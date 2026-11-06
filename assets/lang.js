/**
 * Delta Pi teach — NL / EN language toggle
 * Verwacht .dp-lang[data-lang] en knoppen .dp-lang-switch__btn[data-lang]
 */
(function () {
  const STORAGE_KEY = "dp-teach-lang";
  const blocks = Array.from(document.querySelectorAll(".dp-lang[data-lang]"));
  const buttons = Array.from(document.querySelectorAll(".dp-lang-switch__btn[data-lang]"));
  if (blocks.length === 0 || buttons.length === 0) return;

  function setLang(code) {
    const lang = blocks.some((b) => b.dataset.lang === code) ? code : "nl";

    blocks.forEach((block) => {
      const on = block.dataset.lang === lang;
      block.classList.toggle("is-active", on);
      block.hidden = !on;
    });

    buttons.forEach((btn) => {
      const on = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });

    document.documentElement.lang = lang;

    const active = blocks.find((b) => b.dataset.lang === lang);
    const title = active?.dataset.title;
    if (title) {
      document.title = `${title} — Delta Pi`;
    }

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang || "nl"));
  });

  let initial = "nl";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && blocks.some((b) => b.dataset.lang === saved)) initial = saved;
  } catch (_) {
    /* ignore */
  }
  setLang(initial);
})();
