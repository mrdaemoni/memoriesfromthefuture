const canvas = document.getElementById("background-canvas");
const notesRoot = document.querySelector("[data-notes-root]");

if (canvas) {
  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const titleBlock = document.querySelector(".title-block");
  const siteTitle = document.querySelector(".site-title");
  const siteSubtitle = document.querySelector(".site-subtitle");

  let animationFrameId = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let time = 0;
  let leftSources = [];
  let rightSources = [];
  let synapses = [];

  const paper = "#fffaff";
  const lineRgb = "209, 199, 209";
  const lineDarkRgb = "168, 156, 168";
  const levels = [-1.35, -1.02, -0.72, -0.42, -0.12, 0.12, 0.42, 0.72, 1.02, 1.35];

  const smoothstep = (edge0, edge1, value) => {
    const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  };

  const buildSide = (side) =>
    Array.from({ length: 6 }, (_, index) => ({
      anchorX:
        side === "left"
          ? width * (0.16 + index * 0.055 + Math.random() * 0.03)
          : width * (0.84 - index * 0.055 - Math.random() * 0.03),
      anchorY: height * (0.14 + index * 0.14 + Math.random() * 0.05),
      amplitudeX: width * (0.05 + Math.random() * 0.035),
      amplitudeY: height * (0.025 + Math.random() * 0.045),
      driftX: 0.0002 + Math.random() * 0.00028,
      driftY: 0.00018 + Math.random() * 0.00024,
      phase: Math.random() * Math.PI * 2,
      strength: 0.9 + Math.random() * 0.9,
      falloff: 145 + Math.random() * 45,
    }));

  const buildField = () => {
    leftSources = buildSide("left");
    rightSources = buildSide("right");
  };

  const resizeCanvas = () => {
    pixelRatio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildField();
  };

  const sampleSide = (sources, x, y, direction) => {
    let value = 0;

    for (const source of sources) {
      const animatedX =
        source.anchorX + Math.sin(time * source.driftX + source.phase) * source.amplitudeX;
      const animatedY =
        source.anchorY + Math.cos(time * source.driftY + source.phase) * source.amplitudeY;
      const dx = x - animatedX;
      const dy = y - animatedY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      value += Math.sin(distance * 0.022 - time * 0.0018 + source.phase) * source.strength;
      value += (direction * source.falloff) / (distance + 120);
    }

    return value;
  };

  const sampleField = (x, y) => {
    const leftWave = sampleSide(leftSources, x, y, 1);
    const rightWave = sampleSide(rightSources, x, y, -1);
    const balance = leftWave + rightWave;
    const crossCurrent =
      Math.sin(y * 0.011 + time * 0.0012) * 0.55 +
      Math.cos(x * 0.008 - time * 0.0011) * 0.45 +
      Math.sin((x + y) * 0.0036 + time * 0.0007) * 0.35;

    return balance * 0.58 + crossCurrent;
  };

  const interpolate = (pointA, pointB, valueA, valueB, level) => {
    const ratio = (level - valueA) / (valueB - valueA || 1);

    return {
      x: pointA.x + (pointB.x - pointA.x) * ratio,
      y: pointA.y + (pointB.y - pointA.y) * ratio,
    };
  };

  const updateSynapses = (candidates) => {
    const now = time;

    synapses = synapses.filter((synapse) => now - synapse.bornAt < synapse.life);

    if (prefersReducedMotion.matches || candidates.length === 0 || synapses.length > 10) {
      return;
    }

    if (Math.random() > 0.18) {
      return;
    }

    const candidate = candidates[Math.floor(Math.random() * candidates.length)];
    const tooClose = synapses.some((synapse) => {
      const dx = synapse.x - candidate.x;
      const dy = synapse.y - candidate.y;
      return Math.sqrt(dx * dx + dy * dy) < 42;
    });

    if (tooClose) {
      return;
    }

    synapses.push({
      x: candidate.x,
      y: candidate.y,
      bornAt: now,
      life: 2200 + Math.random() * 1600,
      radius: 28 + Math.random() * 24,
    });
  };

  const synapseInfluence = (x, y) => {
    let strongest = 0;

    for (const synapse of synapses) {
      const age = time - synapse.bornAt;
      const progress = age / synapse.life;

      if (progress >= 1) {
        continue;
      }

      const dx = x - synapse.x;
      const dy = y - synapse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const fade = Math.sin(progress * Math.PI);
      const spatial = Math.max(0, 1 - distance / synapse.radius);
      strongest = Math.max(strongest, fade * spatial);
    }

    return strongest;
  };

  const drawContours = () => {
    context.fillStyle = paper;
    context.fillRect(0, 0, width, height);

    const cellSize = Math.max(16, Math.min(22, width / 52));
    const cols = Math.ceil(width / cellSize) + 1;
    const rows = Math.ceil(height / cellSize) + 1;
    const values = Array.from({ length: rows }, () => Array(cols).fill(0));

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        values[row][col] = sampleField(col * cellSize, row * cellSize);
      }
    }

    context.lineWidth = 0.95;
    context.lineCap = "round";
    context.lineJoin = "round";
    const synapseCandidates = [];

    for (const level of levels) {
      const alpha = 0.15 + smoothstep(-1.35, 1.35, level) * 0.11;

      for (let row = 0; row < rows - 1; row += 1) {
        for (let col = 0; col < cols - 1; col += 1) {
          const x = col * cellSize;
          const y = row * cellSize;

          const topLeft = { x, y };
          const topRight = { x: x + cellSize, y };
          const bottomRight = { x: x + cellSize, y: y + cellSize };
          const bottomLeft = { x, y: y + cellSize };

          const valueTopLeft = values[row][col];
          const valueTopRight = values[row][col + 1];
          const valueBottomRight = values[row + 1][col + 1];
          const valueBottomLeft = values[row + 1][col];

          const intersections = [];

          if ((valueTopLeft < level) !== (valueTopRight < level)) {
            intersections.push(
              interpolate(topLeft, topRight, valueTopLeft, valueTopRight, level)
            );
          }

          if ((valueTopRight < level) !== (valueBottomRight < level)) {
            intersections.push(
              interpolate(topRight, bottomRight, valueTopRight, valueBottomRight, level)
            );
          }

          if ((valueBottomRight < level) !== (valueBottomLeft < level)) {
            intersections.push(
              interpolate(bottomRight, bottomLeft, valueBottomRight, valueBottomLeft, level)
            );
          }

          if ((valueBottomLeft < level) !== (valueTopLeft < level)) {
            intersections.push(
              interpolate(bottomLeft, topLeft, valueBottomLeft, valueTopLeft, level)
            );
          }

          if (intersections.length === 2) {
            const midpointX = (intersections[0].x + intersections[1].x) / 2;
            const midpointY = (intersections[0].y + intersections[1].y) / 2;
            const influence = synapseInfluence(midpointX, midpointY);
            const strokeAlpha = alpha + influence * 0.2;
            const strokeRgb = influence > 0.02 ? lineDarkRgb : lineRgb;

            context.strokeStyle = `rgba(${strokeRgb}, ${strokeAlpha})`;
            context.beginPath();
            context.moveTo(intersections[0].x, intersections[0].y);
            context.lineTo(intersections[1].x, intersections[1].y);
            context.stroke();
          }

          if (intersections.length === 4) {
            const midpointAX = (intersections[0].x + intersections[1].x) / 2;
            const midpointAY = (intersections[0].y + intersections[1].y) / 2;
            const influenceA = synapseInfluence(midpointAX, midpointAY);
            const strokeAlphaA = alpha + influenceA * 0.2;
            const strokeRgbA = influenceA > 0.02 ? lineDarkRgb : lineRgb;

            context.strokeStyle = `rgba(${strokeRgbA}, ${strokeAlphaA})`;
            context.beginPath();
            context.moveTo(intersections[0].x, intersections[0].y);
            context.lineTo(intersections[1].x, intersections[1].y);
            context.stroke();

            const midpointBX = (intersections[2].x + intersections[3].x) / 2;
            const midpointBY = (intersections[2].y + intersections[3].y) / 2;
            const influenceB = synapseInfluence(midpointBX, midpointBY);
            const strokeAlphaB = alpha + influenceB * 0.2;
            const strokeRgbB = influenceB > 0.02 ? lineDarkRgb : lineRgb;

            context.strokeStyle = `rgba(${strokeRgbB}, ${strokeAlphaB})`;
            context.beginPath();
            context.moveTo(intersections[2].x, intersections[2].y);
            context.lineTo(intersections[3].x, intersections[3].y);
            context.stroke();
          }
        }
      }
    }

    const nodes = [];
    const nodeStep = cellSize * 2;

    for (let y = nodeStep; y < height; y += nodeStep) {
      for (let x = nodeStep; x < width; x += nodeStep) {
        const fieldValue = sampleField(x, y);

        if (Math.abs(fieldValue) < 0.06) {
          const node = {
            x,
            y,
            radius: 0.65 + (0.06 - Math.abs(fieldValue)) * 9,
            alpha: 0.045 + (0.06 - Math.abs(fieldValue)) * 0.55,
          };

          nodes.push(node);
          synapseCandidates.push(node);
        }
      }
    }

    updateSynapses(synapseCandidates);

    for (const node of nodes) {
      context.fillStyle = `rgba(${lineRgb}, ${node.alpha})`;
      context.beginPath();
      context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      context.fill();
    }

    for (const synapse of synapses) {
      const age = time - synapse.bornAt;
      const progress = age / synapse.life;
      const fade = Math.sin(progress * Math.PI);

      if (fade <= 0) {
        continue;
      }

      context.fillStyle = `rgba(${lineDarkRgb}, ${0.04 * fade})`;
      context.beginPath();
      context.arc(synapse.x, synapse.y, synapse.radius * (0.35 + fade * 0.35), 0, Math.PI * 2);
      context.fill();
    }
  };

  const updateTitleMemory = () => {
    if (!titleBlock || !siteTitle || !siteSubtitle) {
      return;
    }

    const titleRect = siteTitle.getBoundingClientRect();
    const subtitleRect = siteSubtitle.getBoundingClientRect();
    const titleCenterX = titleRect.left + titleRect.width / 2;
    const titleCenterY = titleRect.top + titleRect.height / 2;
    const subtitleCenterX = subtitleRect.left + subtitleRect.width / 2;
    const subtitleCenterY = subtitleRect.top + subtitleRect.height / 2;
    const titleField = sampleField(titleCenterX, titleCenterY);
    const subtitleField = sampleField(
      subtitleCenterX,
      subtitleCenterY
    );
    const titleLeftField = sampleField(titleRect.left, titleCenterY);
    const titleRightField = sampleField(titleRect.right, titleCenterY);
    const titleTopField = sampleField(titleCenterX, titleRect.top);
    const titleBottomField = sampleField(titleCenterX, titleRect.bottom);

    const edgePresence =
      Math.abs(titleRightField - titleLeftField) * 0.32 +
      Math.abs(titleBottomField - titleTopField) * 0.28;

    const driftX = Math.max(-1.2, Math.min(1.2, titleField * 0.22));
    const driftY = Math.max(-0.8, Math.min(0.8, subtitleField * 0.16));
    const blur = prefersReducedMotion.matches
      ? 0
      : Math.max(0, Math.abs(titleField) * 0.16 + edgePresence * 0.95 - 0.05);
    const opacity = 0.84 + Math.max(0, 0.12 - Math.abs(subtitleField) * 0.018);
    const edgeGlow = Math.min(0.28, 0.12 + edgePresence * 0.12);

    titleBlock.style.setProperty("--memory-shift-x", `${driftX}px`);
    titleBlock.style.setProperty("--memory-shift-y", `${driftY}px`);
    titleBlock.style.setProperty("--memory-blur", `${blur.toFixed(2)}px`);
    titleBlock.style.setProperty("--memory-opacity", opacity.toFixed(3));
    titleBlock.style.setProperty("--memory-edge-glow", edgeGlow.toFixed(3));
  };

  const render = () => {
    drawContours();
    updateTitleMemory();

    if (!prefersReducedMotion.matches) {
      time += 16;
      animationFrameId = window.requestAnimationFrame(render);
    }
  };

  const handleResize = () => {
    resizeCanvas();
    drawContours();
  };

  resizeCanvas();
  render();

  window.addEventListener("resize", handleResize);

  prefersReducedMotion.addEventListener("change", () => {
    window.cancelAnimationFrame(animationFrameId);
    render();
  });
}

if (notesRoot) {
  const searchParams = new URLSearchParams(window.location.search);
  const episode = searchParams.get("episode") || "01";
  const notesData = window.NOTES_DATA || {};
  const bodyContent = notesData[episode] || notesData["01"];
  const episodeLinks = document.querySelectorAll("[data-episode-link]");
  const currentEpisodeLabel = document.querySelector("[data-current-episode]");
  const episodeTitles = {
    "01": "E01. Still Carving Bones",
    "02": "E02. The Water We Swim In",
    "03": "E03. The Discipline of Attention",
    "04": "E04. The Metric Trap",
    "05": "E05. Numbers to Leave Numbers",
    "06": "E06. Attention Changes the World",
    "07": "E07. Knowing Before Knowing",
  };
  const episodeLinksMap = {
    "01": "show-notes.html?episode=01",
    "02": "show-notes.html?episode=02",
    "03": "show-notes.html?episode=03",
    "04": "show-notes.html?episode=04",
    "05": "show-notes.html?episode=05",
    "06": "show-notes.html?episode=06",
    "07": "show-notes.html?episode=07",
  };

  episodeLinks.forEach((link) => {
    if (link.getAttribute("data-episode-link") === episode) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (currentEpisodeLabel) {
    currentEpisodeLabel.textContent = episodeTitles[episode] || episodeTitles["01"];
  }

  if (bodyContent) {
    notesRoot.innerHTML = bodyContent;

    const flattenInlineEmphasis = (root) => {
      root.querySelectorAll("strong, b, em").forEach((node) => {
        node.replaceWith(document.createTextNode(node.textContent || ""));
      });
    };

    notesRoot.querySelectorAll(".episode-summary p, .provocation p").forEach((paragraph) => {
      paragraph.classList.add("notes-body-paragraph");
      flattenInlineEmphasis(paragraph);
    });

    const ideaGrids = notesRoot.querySelectorAll(".ideas-grid");

    ideaGrids.forEach((grid) => {
      const section = grid.closest(".key-ideas");

      if (!section) {
        return;
      }

      const cards = grid.querySelectorAll(".idea-card");

      cards.forEach((card) => {
        const title = card.querySelector("h4")?.textContent?.trim();
        const body = card.querySelector("p")?.textContent?.trim();

        if (!title || !body) {
          return;
        }

        const normalizedIdea = document.createElement("div");
        normalizedIdea.className = "key-idea";

        const strong = document.createElement("strong");
        strong.textContent = title;

        normalizedIdea.append(strong, document.createTextNode(` — ${body}`));
        section.insertBefore(normalizedIdea, grid);
      });

      grid.remove();
    });

    const nextEpisode = notesRoot.querySelector(".next-episode");

    if (nextEpisode) {
      const nextNumber = String(Number(episode) + 1).padStart(2, "0");
      const nextTitle = episodeTitles[nextNumber];
      const nextHref = episodeLinksMap[nextNumber];
      const existingParagraph = nextEpisode.querySelector("p");

      if (nextTitle && nextHref) {
        nextEpisode.innerHTML = "";

        const label = document.createElement("div");
        label.className = "next-episode-label";
        label.textContent = "Next Episode";

        const titleLink = document.createElement("a");
        titleLink.className = "next-episode-link";
        titleLink.href = nextHref;
        titleLink.textContent = nextTitle;

        nextEpisode.append(label, titleLink);

        if (existingParagraph) {
          const teaser = document.createElement("p");
          teaser.className = "next-episode-copy";
          teaser.textContent = existingParagraph.textContent.trim();
          nextEpisode.append(teaser);
        }
      }
    }

    window.scrollTo(0, 0);
  } else {
    notesRoot.innerHTML =
      '<div class="notes-loading">These show notes are not available yet.</div>';
  }
}
