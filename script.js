const canvas = document.getElementById("background-canvas");
const notesRoot = document.querySelector("[data-notes-root]");
const episodePageRoot = document.querySelector("[data-episode-page]");
const episodesGrid = document.querySelector("[data-episodes-grid]");
const episodeModal = document.querySelector("[data-episode-modal]");
const episodeModalDialog = document.querySelector(".episode-modal-dialog");
const episodeModalContent = document.querySelector("[data-episode-modal-content]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const spotifyShowUrl = "https://open.spotify.com/show/585zeLWs8s4IsDhBV3FBQ4";
const buildEpisodePageHref = (_season, episode) => `index.html?episode=${episode}`;
const episodeCatalog = [
  {
    season: "2",
    episode: "01",
    title: "You Must Create to Meet Yourself",
    description:
      "The self is made in the act of creation, not discovered before it.",
    image: "art/s2/1.png",
    imagePosition: "center center",
    imageScale: "1.2",
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
    imagePosition: "center center",
    imageScale: "1.18",
    listenUrl: "https://open.spotify.com/episode/5xWPHhy1ojPbfjUIora6g0",
  },
  {
    season: "2",
    episode: "06",
    title: "Loving Someone as They Change",
    description:
      "Love means meeting someone as they keep becoming someone new.",
    image: "art/s2/6.png",
    imagePosition: "center center",
    imageScale: "1.18",
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
    listenUrl: "https://open.spotify.com/episode/5b7Bw91CxoWPphQX16OpwE",
  },
  {
    season: "2",
    episode: "09",
    title: "The Fence and the Yard",
    description:
      "Constraint makes play possible; the fence gives the yard its freedom.",
    image: "art/s2/9.png",
    imagePosition: "center center",
    imageScale: "1.2",
    heroImagePosition: "center center",
    heroImageSize: "128% auto",
    listenUrl: spotifyShowUrl,
  },
  {
    season: "2",
    episode: "10",
    title: "Every Real Learning Is a Small Death",
    description:
      "Every transformation asks an older self to die beautifully.",
    image: "art/s2/10.png",
    listenUrl: "https://open.spotify.com/episode/0axGwWd9p8A89l8QoFhdub",
  },
].map((episode) => ({
  ...episode,
  displayNumber: Number(episode.episode),
  seasonCode: `S${episode.season}E${episode.episode}`,
  pageUrl: buildEpisodePageHref(episode.season, episode.episode),
}));

const seasonCatalog = {
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

const thinkerCatalog = {
  "Agnes Callard": { wikiTitle: "Agnes_Callard" },
  "Charles Limb": { wikiTitle: "Charles_Limb" },
  "Copland": { displayName: "Aaron Copland", wikiTitle: "Aaron_Copland" },
  "Csikszentmihalyi": {
    displayName: "Mihaly Csikszentmihalyi",
    wikiTitle: "Mihaly_Csikszentmihalyi",
  },
  "Dogen Zenji": { displayName: "Dōgen Zenji", wikiTitle: "Dōgen" },
  "Dōgen Zenji": { displayName: "Dōgen Zenji", wikiTitle: "Dōgen" },
  "Dreyfus": { displayName: "Hubert Dreyfus", wikiTitle: "Hubert_Dreyfus" },
  "Esther Perel": { wikiTitle: "Esther_Perel" },
  "Feldenkrais": { displayName: "Moshe Feldenkrais", wikiTitle: "Moshe_Feldenkrais" },
  "Feynman": {
    displayName: "Richard Feynman",
    wikiTitle: "Richard_Feynman",
    wikiUrl: "https://en.wikipedia.org/wiki/Richard_Feynman",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Richard_Feynman_Nobel.jpg/330px-Richard_Feynman_Nobel.jpg",
  },
  "Heidegger": { displayName: "Martin Heidegger", wikiTitle: "Martin_Heidegger" },
  "Heidi Priebe": {
    imageUrl:
      "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2002207/settings_images/d2df2c-7b48-1833-fb4-f7cfd45a2a8_365cf66f-3714-4d10-badd-cbef0e17acf5.jpg",
    fallbackDescription:
      "Heidi Priebe is a writer, speaker, and author specializing in attachment theory and developmental psychology.",
    wikiSearch: "Heidi Priebe",
  },
  "Huizinga": { displayName: "Johan Huizinga", wikiTitle: "Johan_Huizinga" },
  "Iris Murdoch": { wikiTitle: "Iris_Murdoch" },
  "James Clear": { wikiTitle: "James_Clear" },
  "Jorge Luis Borges": { wikiTitle: "Jorge_Luis_Borges" },
  "John Keats": { wikiTitle: "John_Keats" },
  "L.A. Paul": { displayName: "L. A. Paul", wikiTitle: "L._A._Paul" },
  "Lavelle": { displayName: "Louis Lavelle", wikiTitle: "Louis_Lavelle" },
  "Marcus Aurelius": { wikiTitle: "Marcus_Aurelius" },
  "McGilchrist": { displayName: "Iain McGilchrist", wikiTitle: "Iain_McGilchrist" },
  "Merleau-Ponty": {
    displayName: "Maurice Merleau-Ponty",
    wikiTitle: "Maurice_Merleau-Ponty",
  },
  "Miles Davis": { wikiTitle: "Miles_Davis" },
  "Erich Fromm": { wikiTitle: "Erich_Fromm" },
  "Martin Buber": { wikiTitle: "Martin_Buber" },
  "Nassim Taleb": {
    displayName: "Nassim Nicholas Taleb",
    wikiTitle: "Nassim_Nicholas_Taleb",
  },
  "Nietzsche": { displayName: "Friedrich Nietzsche", wikiTitle: "Friedrich_Nietzsche" },
  "Nishitani": { displayName: "Keiji Nishitani", wikiTitle: "Keiji_Nishitani" },
  "Owen Barfield": { wikiTitle: "Owen_Barfield" },
  "Pascal": { displayName: "Blaise Pascal", wikiTitle: "Blaise_Pascal" },
  "Paul Graham": { wikiTitle: "Paul_Graham_(programmer)" },
  "Pirsig": {
    displayName: "Robert M. Pirsig",
    wikiTitle: "Robert_M._Pirsig",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Pirsig2005_%28cropped%29.jpg/330px-Pirsig2005_%28cropped%29.jpg",
  },
  "Polanyi": { displayName: "Michael Polanyi", wikiTitle: "Michael_Polanyi" },
  "Reed Montague": { displayName: "Read Montague", wikiTitle: "Read_Montague" },
  "Rilke": { displayName: "Rainer Maria Rilke", wikiTitle: "Rainer_Maria_Rilke" },
  "Seneca": { displayName: "Seneca", wikiTitle: "Seneca_the_Younger" },
  "Simone Weil": { wikiTitle: "Simone_Weil" },
  "Socrates": {
    displayName: "Socrates",
    wikiTitle: "Socrates",
    wikiUrl: "https://en.wikipedia.org/wiki/Socrates",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Socrates_Louvre.jpg/330px-Socrates_Louvre.jpg",
  },
  "Steinbeck": { displayName: "John Steinbeck", wikiTitle: "John_Steinbeck" },
  "Thomas Kuhn": { wikiTitle: "Thomas_Kuhn" },
  "Austin Osman Spare": { wikiTitle: "Austin_Osman_Spare" },
  "Vervaeke": {
    displayName: "John Vervaeke",
    imageUrl: "https://johnvervaeke.com/wp-content/uploads/2023/03/john-vervaeke-1024x576.jpeg",
    fallbackDescription:
      "John Vervaeke is a cognitive scientist and professor at the University of Toronto known for his work on wisdom, relevance realization, and the meaning crisis.",
    wikiSearch: "John Vervaeke",
  },
  "Waitzkin": { displayName: "Josh Waitzkin", wikiTitle: "Joshua_Waitzkin" },
  "William James": { wikiTitle: "William_James" },
  "Winnicott": { displayName: "Donald Winnicott", wikiTitle: "Donald_Winnicott" },
};

const buildWikiUrl = (title) => `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
const buildWikiSearchUrl = (query) =>
  `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;

const resolveThinker = (name) => {
  const mapped = thinkerCatalog[name] || {};
  const displayName = mapped.displayName || name;
  const wikiTitle = mapped.wikiTitle || null;

  return {
    displayName,
    fallbackDescription: mapped.fallbackDescription || "",
    fallbackImage: mapped.imageUrl || "",
    wikiTitle,
    wikiUrl:
      mapped.wikiUrl ||
      (wikiTitle ? buildWikiUrl(wikiTitle) : buildWikiSearchUrl(mapped.wikiSearch || displayName)),
  };
};

const summarizeText = (text, maxLength = 220) => {
  if (!text || text.length <= maxLength) {
    return text;
  }

  const shortened = text.slice(0, maxLength).trim();
  const lastSentence = Math.max(shortened.lastIndexOf("."), shortened.lastIndexOf("!"));
  const lastSpace = shortened.lastIndexOf(" ");
  const cutIndex = lastSentence > maxLength * 0.6 ? lastSentence + 1 : lastSpace;

  return `${shortened.slice(0, cutIndex > 0 ? cutIndex : maxLength).trim()}...`;
};

const extractThinkerNames = (ideas) => {
  const thinkerIdea = ideas.find((idea) => idea.title.toLowerCase() === "thinkers");

  if (!thinkerIdea) {
    return [];
  }

  return [...new Set(
    thinkerIdea.body
      .split("·")
      .map((name) => name.replace(/^[—-]\s*/, "").trim())
      .filter(Boolean)
  )];
};

const renderThinkerCards = (thinkerNames) =>
  thinkerNames
    .map((name) => {
      const thinker = resolveThinker(name);
      const cardStyle = thinker.fallbackImage
        ? ` style="--thinker-image: url('${thinker.fallbackImage}')"`
        : "";

      return `
        <a
          class="episode-thinker-card${thinker.fallbackImage ? " has-image" : ""}"
          href="${thinker.wikiUrl}"
          target="_blank"
          rel="noreferrer"
          data-thinker-card
          ${cardStyle}
          ${thinker.wikiTitle ? `data-wiki-title="${thinker.wikiTitle}"` : ""}
          data-wiki-url="${thinker.wikiUrl}"
          data-thinker-name="${thinker.displayName}"
        >
          <div class="episode-thinker-media"></div>
          <div class="episode-thinker-copy">
            <p class="episode-thinker-name">${thinker.displayName}</p>
          </div>
        </a>
      `;
    })
    .join("");

const hydrateThinkerCards = async (root) => {
  const thinkerCards = Array.from(root.querySelectorAll("[data-thinker-card]"));

  await Promise.all(
    thinkerCards.map(async (card) => {
      const wikiTitle = card.getAttribute("data-wiki-title");

      if (!wikiTitle) {
        return;
      }

      try {
        const response = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
        );

        if (!response.ok) {
          return;
        }

        const summary = await response.json();
        const imageUrl = summary.originalimage?.source || summary.thumbnail?.source;
        const wikiUrl =
          summary.content_urls?.desktop?.page || card.getAttribute("data-wiki-url");

        if (imageUrl) {
          card.style.setProperty("--thinker-image", `url('${imageUrl}')`);
          card.classList.add("has-image");
        }

        if (wikiUrl) {
          card.href = wikiUrl;
        }
      } catch (error) {
        // Keep the fallback content when a remote profile is unavailable.
      }
    })
  );
};

const defaultSeason = "2";
const fallbackNotesData = window.NOTES_DATA || {};
const seasonNotes = window.SEASON_NOTES || { [defaultSeason]: fallbackNotesData };
const episodeModalTitleBase = "Memories from My Future Self";
let modalHideTimeoutId = 0;
let activeModalEpisode = null;
let lastModalInvoker = null;

const buildEpisodeEmbedUrl = (listenUrl) =>
  listenUrl.includes("/episode/")
    ? listenUrl.replace("open.spotify.com/episode/", "open.spotify.com/embed/episode/")
    : listenUrl.replace("open.spotify.com/show/", "open.spotify.com/embed/show/");

const getSafeEpisodeKey = (episodeKey) => {
  if (seasonNotes[defaultSeason]?.[episodeKey]) {
    return episodeKey;
  }

  return episodeCatalog[0]?.episode || "01";
};

const getEpisodeMeta = (episodeKey) =>
  episodeCatalog.find(
    (episode) => episode.season === defaultSeason && episode.episode === episodeKey
  ) || episodeCatalog[0];

const getEpisodeDetailData = (episodeKey) => {
  const safeEpisode = getSafeEpisodeKey(episodeKey);
  const episodeMeta = getEpisodeMeta(safeEpisode);
  const episodeHtml =
    seasonNotes[defaultSeason]?.[safeEpisode] || seasonNotes[defaultSeason]?.["01"] || "";
  const parser = new DOMParser();
  const parsed = parser.parseFromString(
    `<div class="episode-source-root">${episodeHtml}</div>`,
    "text/html"
  );
  const sourceRoot = parsed.querySelector(".episode-source-root");
  const summaryParagraphs = Array.from(sourceRoot?.querySelectorAll(".episode-summary p") || [])
    .map((paragraph) => paragraph.textContent.trim())
    .filter(Boolean);
  const provocationParagraph =
    sourceRoot?.querySelector(".provocation p")?.textContent?.trim() || "";
  const keyIdeas = Array.from(sourceRoot?.querySelectorAll(".key-idea") || []).map((idea) => ({
    title: idea.querySelector("strong")?.textContent?.trim() || "Idea",
    body: idea.textContent
      .replace(idea.querySelector("strong")?.textContent || "", "")
      .replace(/^ - /, "")
      .replace(/^ — /, "")
      .trim(),
  }));
  const fallbackIdeaCards = Array.from(
    sourceRoot?.querySelectorAll(".ideas-grid .idea-card") || []
  ).map((card) => ({
    title: card.querySelector("h4")?.textContent?.trim() || "Idea",
    body: card.querySelector("p")?.textContent?.trim() || "",
  }));
  const normalizedIdeas = (keyIdeas.length ? keyIdeas : fallbackIdeaCards).slice(0, 8);

  return {
    safeEpisode,
    episodeMeta,
    embedUrl: buildEpisodeEmbedUrl(episodeMeta.listenUrl),
    storyParagraph: summaryParagraphs[0] || provocationParagraph || episodeMeta.description,
    thinkerNames: extractThinkerNames(normalizedIdeas),
  };
};

const renderEpisodeBrowseCards = (currentEpisode = null) =>
  episodeCatalog
    .map(
      (episode) => `
        <article
          class="episode-browse-card${episode.episode === "08" ? " is-featured" : ""}${
            currentEpisode === episode.episode ? " is-current" : ""
          }"
          style="--episode-image: url('${episode.image}'); --episode-image-position: ${
            episode.imagePosition || "center center"
          }; --episode-image-scale: ${episode.imageScale || "1.12"}"
        >
          <button
            type="button"
            class="episode-browse-open"
            data-open-episode="${episode.episode}"
            aria-label="Open details for ${episode.title}"
          ></button>
          <div class="episode-browse-top">
            <p class="episode-browse-number">#${episode.displayNumber}</p>
          </div>
          <div class="episode-browse-body">
            <h3 class="episode-browse-title">${episode.title}</h3>
            <p class="episode-browse-description">${episode.description}</p>
          </div>
        </article>
      `
    )
    .join("");

const renderEpisodeGrid = (root, currentEpisode = null) => {
  root.innerHTML = renderEpisodeBrowseCards(currentEpisode);
};

const updateEpisodeQuery = (episodeKey) => {
  const url = new URL(window.location.href);

  if (episodeKey) {
    url.searchParams.set("episode", episodeKey);
  } else {
    url.searchParams.delete("episode");
  }

  window.history.replaceState({}, "", url);
};

const buildEpisodePaginationMarkup = (episodeKey) => {
  const currentIndex = episodeCatalog.findIndex((episode) => episode.episode === episodeKey);
  const previousEpisode = currentIndex > 0 ? episodeCatalog[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex >= 0 && currentIndex < episodeCatalog.length - 1
      ? episodeCatalog[currentIndex + 1]
      : null;

  if (!previousEpisode && !nextEpisode) {
    return "";
  }

  return `
    <div class="episode-page-pagination">
      ${
        previousEpisode
          ? `<a
              class="episode-page-pagination-link"
              href="${previousEpisode.pageUrl}"
              data-open-episode="${previousEpisode.episode}"
            >
              Previous episode
            </a>`
          : ""
      }
      ${
        nextEpisode
          ? `<a
              class="episode-page-pagination-link"
              href="${nextEpisode.pageUrl}"
              data-open-episode="${nextEpisode.episode}"
            >
              Next episode
            </a>`
          : ""
      }
    </div>
  `;
};

const setEpisodeModalMarkup = (episodeKey) => {
  if (!episodeModalContent) {
    return null;
  }

  const { safeEpisode, episodeMeta, embedUrl, storyParagraph, thinkerNames } =
    getEpisodeDetailData(episodeKey);

  episodeModalContent.innerHTML = `
    <article class="episode-page-hero" style="--episode-hero-image: url('${episodeMeta.image}'); --episode-hero-position: ${episodeMeta.heroImagePosition || "center center"}; --episode-hero-size: ${episodeMeta.heroImageSize || "118% auto"};">
      <div class="episode-page-hero-inner">
        <h1 class="episode-page-title" id="episode-modal-title">#${episodeMeta.displayNumber} - ${episodeMeta.title}</h1>
        <p class="episode-page-dek">${episodeMeta.description}</p>
        ${buildEpisodePaginationMarkup(safeEpisode)}
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

    <section class="episode-page-panel episode-page-story">
      <p>${storyParagraph}</p>
    </section>

    <section class="episode-page-panel episode-page-thinkers">
      <div class="episode-page-panel-label">Thinkers</div>
      <div class="episode-thinker-grid">
        ${renderThinkerCards(thinkerNames)}
      </div>
    </section>

    <section class="episode-page-panel episode-page-library">
      <div class="episode-page-panel-label">Episodes</div>
      <div class="episodes-grid episode-page-library-grid">
        ${renderEpisodeBrowseCards(safeEpisode)}
      </div>
    </section>
  `;

  document.title = `${episodeMeta.title} | ${episodeModalTitleBase}`;
  hydrateThinkerCards(episodeModalContent);

  return safeEpisode;
};

const openEpisodeModal = (episodeKey, invoker = null) => {
  if (!episodeModal || !episodeModalContent) {
    return;
  }

  window.clearTimeout(modalHideTimeoutId);
  const safeEpisode = setEpisodeModalMarkup(episodeKey);

  if (!safeEpisode) {
    return;
  }

  activeModalEpisode = safeEpisode;
  lastModalInvoker = invoker || document.activeElement;
  episodeModal.hidden = false;
  document.body.classList.add("has-episode-modal");
  if (episodeModalDialog) {
    episodeModalDialog.scrollTop = 0;
  }
  window.requestAnimationFrame(() => {
    episodeModal.classList.add("is-open");
  });
  updateEpisodeQuery(safeEpisode);
};

const closeEpisodeModal = ({ restoreFocus = true } = {}) => {
  if (!episodeModal || episodeModal.hidden) {
    updateEpisodeQuery(null);
    return;
  }

  activeModalEpisode = null;
  document.title = episodeModalTitleBase;
  document.body.classList.remove("has-episode-modal");
  episodeModal.classList.remove("is-open");
  updateEpisodeQuery(null);
  modalHideTimeoutId = window.setTimeout(() => {
    episodeModal.hidden = true;
    if (episodeModalContent) {
      episodeModalContent.innerHTML = "";
    }
  }, 180);

  if (restoreFocus && lastModalInvoker instanceof HTMLElement) {
    lastModalInvoker.focus({ preventScroll: true });
  }
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
  const lineRgb = "191, 178, 189";
  const lineDarkRgb = "136, 121, 133";
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

    const driftX = Math.max(-0.32, Math.min(0.32, titleField * 0.06));
    const driftY = Math.max(-0.2, Math.min(0.2, subtitleField * 0.05));
    const blur = prefersReducedMotion.matches
      ? 0
      : Math.max(0, Math.abs(titleField) * 0.035 + edgePresence * 0.16 - 0.06);
    const opacity = 0.97 + Math.max(0, 0.02 - Math.abs(subtitleField) * 0.004);
    const edgeGlow = Math.min(0.08, 0.03 + edgePresence * 0.025);

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
  renderEpisodeGrid(episodesGrid);

  document.addEventListener("click", (event) => {
    const openTrigger = event.target.closest("[data-open-episode]");
    const closeTrigger = event.target.closest("[data-close-episode-modal]");

    if (openTrigger) {
      event.preventDefault();
      openEpisodeModal(openTrigger.getAttribute("data-open-episode"), openTrigger);
      return;
    }

    if (closeTrigger) {
      event.preventDefault();
      closeEpisodeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !episodeModal?.hidden) {
      closeEpisodeModal();
    }
  });

  const requestedEpisode = new URLSearchParams(window.location.search).get("episode");

  if (requestedEpisode) {
    openEpisodeModal(requestedEpisode);
  }
}

if (notesRoot) {
  const searchParams = new URLSearchParams(window.location.search);
  const legacyNotesData = window.NOTES_DATA || {};
  const seasonNotes = window.SEASON_NOTES || { "2": legacyNotesData };
  const episodeLinks = document.querySelectorAll("[data-episode-link]");
  const currentSeasonLabel = document.querySelector("[data-current-season]");
  const currentEpisodeLabel = document.querySelector("[data-current-episode]");
  const activeSeason = "2";
  const activeSeasonNotes = seasonNotes[activeSeason] || {};
  const availableEpisodes = Object.keys(activeSeasonNotes);
  const fallbackEpisode = availableEpisodes[0] || "01";
  const requestedEpisode = searchParams.get("episode") || fallbackEpisode;
  const activeEpisode = activeSeasonNotes[requestedEpisode] ? requestedEpisode : fallbackEpisode;
  const bodyContent = activeSeasonNotes[activeEpisode] || activeSeasonNotes[fallbackEpisode];
  const buildEpisodeHref = (seasonKey, episodeKey) =>
    buildEpisodePageHref(seasonKey, episodeKey);

  episodeLinks.forEach((link) => {
    const linkSeason = link.getAttribute("data-season-link") || "2";
    const linkEpisode = link.getAttribute("data-episode-link");

    if (linkSeason === activeSeason && linkEpisode === activeEpisode) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  if (currentSeasonLabel) {
    currentSeasonLabel.textContent =
      seasonCatalog[activeSeason]?.menuLabel || "";
  }

  if (currentEpisodeLabel) {
    currentEpisodeLabel.textContent =
      seasonCatalog[activeSeason]?.episodes?.[activeEpisode] ||
      seasonCatalog["2"].episodes["01"];
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
      } else {
        nextEpisode.remove();
      }
    }

    window.scrollTo(0, 0);
  } else {
    notesRoot.innerHTML =
      '<div class="notes-loading">These show notes are not available yet.</div>';
  }
}
