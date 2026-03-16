const canvas = document.getElementById("background-canvas");

if (canvas) {
  const context = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

  const render = () => {
    drawContours();

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
