const canvas = document.getElementById("background-canvas");
const notesRoot = document.querySelector("[data-notes-root]");
const episodePageRoot = document.querySelector("[data-episode-page]");
const episodesGrid = document.querySelector("[data-episodes-grid]");
const seasonFilterButtons = document.querySelectorAll("[data-season-filter]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const spotifyShowUrl = "https://open.spotify.com/show/585zeLWs8s4IsDhBV3FBQ4";
const buildEpisodePageHref = (season, episode) => `episode.html?season=${season}&episode=${episode}`;
const episodeCatalog = [
  {
    season: "1",
    episode: "01",
    title: "Still Carving Bones",
    description:
      "From tally marks on bone to tacit knowing, the opening episode climbs the abstraction ladder.",
    image: "art/s1/1-carvingbone.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "1",
    episode: "02",
    title: "The Water We Swim In",
    description:
      "The subject-object split is the water we swim in, and quality lives before it.",
    image: "art/s1/2-waterweswim.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "1",
    episode: "03",
    title: "The Discipline of Attention",
    description:
      "Attention is practiced seeing: the discipline that turns knowledge into taste.",
    image: "art/s1/3-disciplineofattention.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "1",
    episode: "04",
    title: "The Metric Trap",
    description:
      "Metrics help us manage, but they fail where meaning and wisdom actually live.",
    image: "art/s1/4-themetrictrap.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "1",
    episode: "05",
    title: "Numbers to Leave Numbers",
    description:
      "Master the numbers deeply enough to leave them behind and enter embodied skill.",
    image: "art/s1/5-numers.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "1",
    episode: "06",
    title: "Attention Changes the World",
    description:
      "The way you attend changes the world that becomes visible to you.",
    image: "art/s1/6-attention.png",
    listenUrl: "https://open.spotify.com/episode/6edGkhyLpAv4xjVKhTComT",
  },
  {
    season: "1",
    episode: "07",
    title: "Knowing Before Knowing",
    description:
      "Tacit knowing closes the season: the body speaks before thought catches up.",
    image: "art/s1/7-knowing.png",
    listenUrl: "https://open.spotify.com/episode/2GqnIwZZBHbyqOIqP1cNsH",
  },
  {
    season: "2",
    episode: "01",
    title: "You Must Create to Meet Yourself",
    description:
      "The self is made in the act of creation, not discovered before it.",
    image: "art/s2/1.png",
    listenUrl: "https://open.spotify.com/episode/7AOU64AKrN2w7w1XFFIsr1",
  },
  {
    season: "2",
    episode: "02",
    title: "The Questions You Carry",
    description:
      "The questions you carry determine the world you are able to see.",
    image: "art/s2/2.png",
    listenUrl: "https://open.spotify.com/episode/62QiTsGY67LMgDWiLEvT52",
  },
  {
    season: "2",
    episode: "03",
    title: "The Body Knows Before the Mind Can Say Why",
    description:
      "The body knows what the mind can only later learn to explain.",
    image: "art/s2/3.png",
    listenUrl: "https://open.spotify.com/episode/5piZDgQ4foEYGTM7oHVd9e",
  },
  {
    season: "2",
    episode: "04",
    title: "Attention Is a Moral Act",
    description:
      "Attention is the moral force that decides what becomes real in a life.",
    image: "art/s2/4.png",
    listenUrl: "https://open.spotify.com/episode/0CJirc4Xcyt8hslyUJ242A",
  },
  {
    season: "2",
    episode: "05",
    title: "The Center of Boredom",
    description:
      "Mastery begins where boredom stops being something to escape.",
    image: "art/s2/5.png",
    listenUrl: "https://open.spotify.com/episode/5xWPHhy1ojPbfjUIora6g0",
  },
  {
    season: "2",
    episode: "06",
    title: "Loving Someone as They Change",
    description:
      "Love means meeting someone as they keep becoming someone new.",
    image: "art/s2/6.png",
    listenUrl: "https://open.spotify.com/episode/4PEsI9y7SXu6PkfkSMqYQR",
  },
  {
    season: "2",
    episode: "07",
    title: "The Density of Contact",
    description:
      "A life is shaped less by duration than by dense encounters with reality.",
    image: "art/s2/7.png",
    listenUrl: "https://open.spotify.com/episode/3YpfEPbI3FZ2LYYrU6E2zL",
  },
  {
    season: "2",
    episode: "08",
    title: "The Porosity of Humility",
    description:
      "Humility is porosity, the openness that lets reality change you.",
    image: "art/s2/8.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "2",
    episode: "09",
    title: "The Fence and the Yard",
    description:
      "Constraint makes play possible; the fence gives the yard its freedom.",
    image: "art/s2/9.png",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "2",
    episode: "10",
    title: "Every Real Learning Is a Small Death",
    description:
      "Every transformation asks an older self to die beautifully.",
    image: "art/s2/10.png",
    listenUrl: spotifyShowUrl,
  },
].map((episode, index) => ({
  ...episode,
  displayNumber: Number(episode.episode),
  seasonCode: `S${episode.season}E${episode.episode}`,
  pageUrl: buildEpisodePageHref(episode.season, episode.episode),
}));

const seasonCatalog = {
  "1": {
    menuLabel:
      "Season 1, Learning to See. From tally marks on bone to knowledge that precedes thought",
    shortLabel: "Learning to See",
    episodes: {
      "01": "E01. Still Carving Bones",
      "02": "E02. The Water We Swim In",
      "03": "E03. The Discipline of Attention",
      "04": "E04. The Metric Trap",
      "05": "E05. Numbers to Leave Numbers",
      "06": "E06. Attention Changes the World",
      "07": "E07. Knowing Before Knowing",
    },
  },
  "2": {
    menuLabel:
      "Season 2, The Architecture of Becoming. Ten episodes on creativity, attention, love, play, and transformation",
    shortLabel: "The Architecture of Becoming",
    episodes: {
      "01": "E01. You Must Create to Meet Yourself",
      "02": "E02. The Questions You Carry",
      "03": "E03. The Body Knows Before the Mind Can Say Why",
      "04": "E04. Attention Is a Moral Act",
      "05": "E05. The Center of Boredom",
      "06": "E06. Loving Someone as They Change",
      "07": "E07. The Density of Contact",
      "08": "E08. The Porosity of Humility",
      "09": "E09. The Fence and the Yard",
      "10": "E10. Every Real Learning Is a Small Death",
    },
  },
};

if (canvas) {
  const context = canvas.getContext("2d");
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

if (episodesGrid) {
  let activeSeasonFilter = "all";

  const renderEpisodeCards = () => {
    const filteredEpisodes =
      activeSeasonFilter === "all"
        ? episodeCatalog
        : episodeCatalog.filter((episode) => episode.season === activeSeasonFilter);

    if (filteredEpisodes.length === 0) {
      episodesGrid.innerHTML =
        '<div class="episodes-empty">No episodes are available in this view yet.</div>';
      return;
    }

    episodesGrid.innerHTML = filteredEpisodes
      .map(
        (episode) => `
          <article
            class="episode-browse-card${episode.displayNumber === 8 ? " is-featured" : ""}"
            style="--episode-image: url('${episode.image}')"
          >
            <div class="episode-browse-top">
              <p class="episode-browse-number">#${episode.displayNumber}</p>
              <p class="episode-browse-code">${episode.seasonCode}</p>
            </div>
            <div class="episode-browse-body">
              <h3 class="episode-browse-title">${episode.title}</h3>
              <p class="episode-browse-description">${episode.description}</p>
              <div class="episode-browse-actions">
                <a
                  class="episode-browse-listen"
                  href="${episode.listenUrl}"
                  target="_blank"
                  rel="noreferrer"
                >
                  Listen
                </a>
                <a class="episode-browse-more" href="${episode.pageUrl}">
                  More
                </a>
              </div>
            </div>
          </article>
        `
      )
      .join("");
  };

  const syncSeasonFilters = () => {
    seasonFilterButtons.forEach((button) => {
      const isActive = button.getAttribute("data-season-filter") === activeSeasonFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  seasonFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeSeasonFilter = button.getAttribute("data-season-filter") || "all";
      syncSeasonFilters();
      renderEpisodeCards();
    });
  });

  syncSeasonFilters();
  renderEpisodeCards();
}

if (episodePageRoot) {
  const searchParams = new URLSearchParams(window.location.search);
  const legacyNotesData = window.NOTES_DATA || {};
  const seasonNotes = window.SEASON_NOTES || { "1": legacyNotesData };
  const requestedSeason = searchParams.get("season") || "2";
  const activeSeason = seasonNotes[requestedSeason] ? requestedSeason : "2";
  const activeEpisode = searchParams.get("episode") || (activeSeason === "2" ? "08" : "01");
  const safeEpisode = seasonNotes[activeSeason]?.[activeEpisode]
    ? activeEpisode
    : Object.keys(seasonNotes[activeSeason] || {})[0] || "01";
  const episodeMeta =
    episodeCatalog.find(
      (episode) => episode.season === activeSeason && episode.episode === safeEpisode
    ) || episodeCatalog[0];
  const embedUrl = episodeMeta.listenUrl.includes("/episode/")
    ? episodeMeta.listenUrl.replace("open.spotify.com/episode/", "open.spotify.com/embed/episode/")
    : episodeMeta.listenUrl.replace("open.spotify.com/show/", "open.spotify.com/embed/show/");
  const episodeHtml =
    seasonNotes[activeSeason]?.[safeEpisode] || seasonNotes["1"]?.["01"] || "";
  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div class="episode-source-root">${episodeHtml}</div>`, "text/html");
  const sourceRoot = parsed.querySelector(".episode-source-root");
  const provocation =
    sourceRoot?.querySelector(".provocation p")?.textContent?.trim() ||
    episodeMeta.description;
  const summaryParagraphs = Array.from(sourceRoot?.querySelectorAll(".episode-summary p") || [])
    .map((paragraph) => paragraph.textContent.trim())
    .concat(
      Array.from(sourceRoot?.children || [])
        .filter((element) => element.tagName === "P")
        .map((element) => element.textContent.trim())
    )
    .filter(Boolean)
    .slice(0, 3);
  const keyIdeas = Array.from(sourceRoot?.querySelectorAll(".key-idea") || []).map((idea) => ({
    title: idea.querySelector("strong")?.textContent?.trim() || "Idea",
    body: idea.textContent.replace(idea.querySelector("strong")?.textContent || "", "").replace(/^ — /, "").trim(),
  }));
  const fallbackIdeaCards = Array.from(
    sourceRoot?.querySelectorAll(".ideas-grid .idea-card") || []
  ).map((card) => ({
    title: card.querySelector("h4")?.textContent?.trim() || "Idea",
    body: card.querySelector("p")?.textContent?.trim() || "",
  }));
  const normalizedIdeas = (keyIdeas.length ? keyIdeas : fallbackIdeaCards).slice(0, 6);
  const topLevelSourceCards = Array.from(sourceRoot?.children || []).filter(
    (element) => element.classList?.contains("source-card")
  );
  const sourceCards = Array.from(sourceRoot?.querySelectorAll(".sources .source-card") || [])
    .concat(topLevelSourceCards)
    .map((card) => ({
      author: card.querySelector(".author")?.textContent?.trim() || "Featured thinker",
      title: card.querySelector(".title")?.textContent?.trim() || "",
      description: card.querySelector(".description")?.textContent?.trim() || "",
      link:
        card.querySelector(".link")?.getAttribute("href") ||
        card.querySelector(".author a")?.getAttribute("href") ||
        "",
      linkLabel: card.querySelector(".link")?.textContent?.trim() || "Explore",
    }))
    .filter((card) => card.title || card.description)
    .slice(0, 6);
  const readingList = Array.from(sourceRoot?.querySelectorAll(".reading-list li") || [])
    .map((item) => item.textContent.trim())
    .filter(Boolean)
    .slice(0, 8);

  const navigationGridMarkup = episodeCatalog
    .map(
      (episode) => `
        <article
          class="episode-browse-card${episode.season === activeSeason && episode.episode === safeEpisode ? " is-featured is-current" : ""}"
          style="--episode-image: url('${episode.image}')"
        >
          <div class="episode-browse-top">
            <p class="episode-browse-number">#${episode.displayNumber}</p>
            <p class="episode-browse-code">${episode.seasonCode}</p>
          </div>
          <div class="episode-browse-body">
            <h3 class="episode-browse-title">${episode.title}</h3>
            <p class="episode-browse-description">${episode.description}</p>
            <div class="episode-browse-actions">
              <a
                class="episode-browse-listen"
                href="${episode.listenUrl}"
                target="_blank"
                rel="noreferrer"
              >
                Listen
              </a>
              ${
                episode.season === activeSeason && episode.episode === safeEpisode
                  ? '<span class="episode-browse-more is-current">Current</span>'
                  : `<a class="episode-browse-more" href="${episode.pageUrl}">More</a>`
              }
            </div>
          </div>
        </article>
      `
    )
    .join("");

  episodePageRoot.innerHTML = `
    <article class="episode-page-hero" style="--episode-hero-image: url('${episodeMeta.image}')">
      <div class="episode-page-hero-inner">
        <div class="episode-page-overline">Memories from My Future Self</div>
        <div class="episode-page-code">#${episodeMeta.displayNumber} · ${episodeMeta.seasonCode}</div>
        <h1 class="episode-page-title">${episodeMeta.title}</h1>
        <p class="episode-page-dek">${episodeMeta.description}</p>
        <blockquote class="episode-page-quote">${provocation}</blockquote>
        <div class="episode-page-actions">
          <a class="episode-page-button is-primary" href="${episodeMeta.listenUrl}" target="_blank" rel="noreferrer">Listen in Spotify</a>
          <a class="episode-page-button" href="#episode-ideas">Enter the episode</a>
        </div>
      </div>
      <div class="episode-page-audio">
        <iframe
          data-testid="embed-iframe"
          src="${embedUrl}?utm_source=generator"
          width="100%"
          height="352"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="${episodeMeta.title} Spotify player"
        ></iframe>
      </div>
    </article>

    <section class="episode-page-grid">
      <section class="episode-page-panel episode-page-story">
        <div class="episode-page-panel-label">The Invitation</div>
        <h2 class="episode-page-panel-title">Why this episode matters now</h2>
        ${summaryParagraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </section>

      <aside class="episode-page-panel episode-page-meta">
        <div class="episode-page-panel-label">Season</div>
        <div class="episode-page-meta-value">${seasonCatalog[activeSeason]?.shortLabel || ""}</div>
        <div class="episode-page-panel-label">Image</div>
        <div class="episode-page-meta-copy">Local artwork from your archive anchors this episode in the same visual world as the homepage.</div>
      </aside>
    </section>

    <section class="episode-page-panel" id="episode-ideas">
      <div class="episode-page-panel-label">Key Ideas</div>
      <h2 class="episode-page-panel-title">What to carry with you</h2>
      <div class="episode-idea-grid">
        ${normalizedIdeas
          .map(
            (idea) => `
              <article class="episode-idea-card">
                <h3>${idea.title}</h3>
                <p>${idea.body}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="episode-page-panel">
      <div class="episode-page-panel-label">Featured Thinkers</div>
      <h2 class="episode-page-panel-title">The minds inside the episode</h2>
      <div class="episode-thinker-grid">
        ${sourceCards
          .map(
            (card) => `
              <article class="episode-thinker-card">
                <div class="episode-thinker-author">${card.author}</div>
                <h3>${card.title}</h3>
                <p>${card.description}</p>
                ${card.link ? `<a href="${card.link}" target="_blank" rel="noreferrer">${card.linkLabel}</a>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
    </section>

    <section class="episode-page-panel">
      <div class="episode-page-panel-label">Reading Trail</div>
      <h2 class="episode-page-panel-title">Continue deeper</h2>
      <ul class="episode-reading-list">
        ${readingList.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="episode-page-panel episode-page-library">
      <div class="episode-page-panel-label">Episode Navigation</div>
      <h2 class="episode-page-panel-title">Explore the full archive</h2>
      <p class="episode-page-library-copy">
        Move through the whole body of work without leaving the episode experience.
      </p>
      <div class="episodes-grid episode-page-library-grid">
        ${navigationGridMarkup}
      </div>
    </section>
  `;

  document.title = `${episodeMeta.title} | Memories from My Future Self`;
}

if (notesRoot) {
  const searchParams = new URLSearchParams(window.location.search);
  const legacyNotesData = window.NOTES_DATA || {};
  const seasonNotes = window.SEASON_NOTES || { "1": legacyNotesData };
  const episodeLinks = document.querySelectorAll("[data-episode-link]");
  const currentSeasonLabel = document.querySelector("[data-current-season]");
  const currentEpisodeLabel = document.querySelector("[data-current-episode]");
  const requestedSeason = searchParams.get("season") || "1";
  const activeSeason = seasonNotes[requestedSeason] ? requestedSeason : "1";
  const activeSeasonNotes = seasonNotes[activeSeason] || {};
  const availableEpisodes = Object.keys(activeSeasonNotes);
  const fallbackEpisode = availableEpisodes[0] || "01";
  const requestedEpisode = searchParams.get("episode") || fallbackEpisode;
  const activeEpisode = activeSeasonNotes[requestedEpisode] ? requestedEpisode : fallbackEpisode;
  const bodyContent = activeSeasonNotes[activeEpisode] || activeSeasonNotes[fallbackEpisode];
  const buildEpisodeHref = (seasonKey, episodeKey) =>
    buildEpisodePageHref(seasonKey, episodeKey);

  episodeLinks.forEach((link) => {
    const linkSeason = link.getAttribute("data-season-link") || "1";
    const linkEpisode = link.getAttribute("data-episode-link");

    if (linkSeason === activeSeason && linkEpisode === activeEpisode) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (currentSeasonLabel) {
    currentSeasonLabel.textContent =
      seasonCatalog[activeSeason]?.menuLabel || seasonCatalog["1"].menuLabel;
  }

  if (currentEpisodeLabel) {
    currentEpisodeLabel.textContent =
      seasonCatalog[activeSeason]?.episodes?.[activeEpisode] ||
      seasonCatalog["1"].episodes["01"];
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
      const episodeOrder = Object.keys(seasonCatalog[activeSeason]?.episodes || {});
      const currentIndex = episodeOrder.indexOf(activeEpisode);
      const nextEpisodeKey = episodeOrder[currentIndex + 1];
      let nextTitle = seasonCatalog[activeSeason]?.episodes?.[nextEpisodeKey];
      let nextHref = nextEpisodeKey ? buildEpisodeHref(activeSeason, nextEpisodeKey) : null;
      let nextLabel = "Next Episode";
      const existingParagraph = nextEpisode.querySelector("p");

      if (!nextTitle || !nextHref) {
        const nextSeasonKey = String(Number(activeSeason) + 1);
        const nextSeasonEpisodes = Object.keys(seasonCatalog[nextSeasonKey]?.episodes || {});
        const firstNextSeasonEpisode = nextSeasonEpisodes[0];

        if (firstNextSeasonEpisode && seasonNotes[nextSeasonKey]?.[firstNextSeasonEpisode]) {
          nextTitle = seasonCatalog[nextSeasonKey].episodes[firstNextSeasonEpisode];
          nextHref = buildEpisodeHref(nextSeasonKey, firstNextSeasonEpisode);
          nextLabel = "Next Season";
        }
      }

      if (nextTitle && nextHref) {
        nextEpisode.innerHTML = "";

        const label = document.createElement("div");
        label.className = "next-episode-label";
        label.textContent = nextLabel;

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
