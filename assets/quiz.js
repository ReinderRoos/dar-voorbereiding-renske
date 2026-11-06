/**
 * Delta Pi teach — quiz feedback loop (per .dp-quiz sectie)
 * Verwacht .dp-q[data-answer] met radio's en .dp-q__feedback[data-correct|data-wrong]
 */
(function () {
  const quizzes = Array.from(document.querySelectorAll(".dp-quiz"));
  if (quizzes.length === 0) return;

  function initQuiz(quiz) {
    const checkBtn = quiz.querySelector(".dp-quiz__check");
    const resetBtn = quiz.querySelector(".dp-quiz__reset");
    const scoreEl = quiz.querySelector(".dp-quiz__score");

    function questions() {
      return Array.from(quiz.querySelectorAll(".dp-q"));
    }

    function selected(q) {
      const input = q.querySelector('input[type="radio"]:checked');
      return input ? Number(input.value) : null;
    }

    function unlock() {
      questions().forEach((q) => {
        q.classList.remove("is-locked");
        q.querySelectorAll("label").forEach((l) => l.classList.remove("is-chosen"));
        const fb = q.querySelector(".dp-q__feedback");
        if (fb) {
          fb.classList.remove("is-visible", "is-correct", "is-wrong");
          fb.textContent = "";
        }
        q.querySelectorAll("input").forEach((i) => {
          i.disabled = false;
          i.checked = false;
        });
      });
      if (scoreEl) {
        scoreEl.classList.remove("is-visible");
        scoreEl.textContent = "";
      }
    }

    function fallbackWrong(fb) {
      if (fb.dataset.wrong) return fb.dataset.wrong;
      return fb.closest(".dp-lang")?.lang === "en"
        ? "Not quite — read the explainer again."
        : "Niet juist — lees de uitleg nog eens en probeer opnieuw.";
    }

    function fallbackCorrect(fb) {
      if (fb.dataset.correct) return fb.dataset.correct;
      return fb.closest(".dp-lang")?.lang === "en" ? "Correct." : "Juist.";
    }

    function check() {
      let correct = 0;
      let answered = 0;
      const all = questions();
      const isEn = quiz.closest(".dp-lang")?.lang === "en";

      all.forEach((q) => {
        const answer = Number(q.dataset.answer);
        const choice = selected(q);
        const fb = q.querySelector(".dp-q__feedback");
        if (choice === null || !fb) return;

        answered += 1;
        q.classList.add("is-locked");
        q.querySelectorAll("input").forEach((i) => {
          i.disabled = true;
        });
        const chosenLabel = q.querySelector(`input[value="${choice}"]`)?.closest("label");
        if (chosenLabel) chosenLabel.classList.add("is-chosen");

        const ok = choice === answer;
        if (ok) correct += 1;

        fb.textContent = ok ? fallbackCorrect(fb) : fallbackWrong(fb);
        fb.classList.add("is-visible", ok ? "is-correct" : "is-wrong");
        fb.classList.remove(ok ? "is-wrong" : "is-correct");
      });

      if (!scoreEl) return;
      if (answered === 0) {
        scoreEl.textContent = isEn
          ? "Choose an answer for each question first."
          : "Kies eerst bij elke vraag een antwoord.";
        scoreEl.classList.add("is-visible");
        return;
      }
      scoreEl.textContent = isEn
        ? `Score: ${correct} / ${all.length}`
        : `Score: ${correct} / ${all.length}`;
      scoreEl.classList.add("is-visible");
    }

    quiz.addEventListener("change", (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
      const q = input.closest(".dp-q");
      if (!q || q.classList.contains("is-locked")) return;

      const answer = Number(q.dataset.answer);
      const choice = Number(input.value);
      const fb = q.querySelector(".dp-q__feedback");
      if (!fb) return;

      q.classList.add("is-locked");
      q.querySelectorAll("input").forEach((i) => {
        i.disabled = true;
      });
      input.closest("label")?.classList.add("is-chosen");

      const ok = choice === answer;
      fb.textContent = ok ? fallbackCorrect(fb) : fallbackWrong(fb);
      fb.classList.add("is-visible", ok ? "is-correct" : "is-wrong");
      fb.classList.remove(ok ? "is-wrong" : "is-correct");

      const locked = questions().filter((x) => x.classList.contains("is-locked")).length;
      if (scoreEl && locked === questions().length) {
        const c = questions().filter((x) => {
          const a = Number(x.dataset.answer);
          const sel = x.querySelector("input:checked");
          return sel && Number(sel.value) === a;
        }).length;
        scoreEl.textContent = `Score: ${c} / ${questions().length}`;
        scoreEl.classList.add("is-visible");
      }
    });

    checkBtn?.addEventListener("click", check);
    resetBtn?.addEventListener("click", unlock);
  }

  quizzes.forEach(initQuiz);
})();
