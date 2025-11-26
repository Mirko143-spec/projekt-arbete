document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("highscoreContainer");
    const clearBtn = document.getElementById("clearScoresBtn");
  
    function renderScores() {
      const raw = localStorage.getItem("quizResults");
      if (!raw) {
        container.innerHTML = "<p>No games played yet. Start a quiz!</p>";
        return;
      }
  
      const results = JSON.parse(raw);
  
      if (!results.length) {
        container.innerHTML = "<p>No games played yet. Start a quiz!</p>";
        return;
      }
  
      container.innerHTML = results
        .map((r, index) => {
          const date = new Date(r.date);
          const formatted = date.toLocaleString();
          return `
            <article class="feature-card">
              <h3>#${index + 1} – ${r.name}</h3>
              <p><strong>Score:</strong> ${r.score} pts</p>
              <p><strong>Category:</strong> ${r.category || "N/A"}</p>
              <p><strong>Difficulty:</strong> ${r.difficulty || "N/A"}</p>
              <p style="font-size: 0.8rem; opacity: 0.8;">${formatted}</p>
            </article>
          `;
        })
        .join("");
    }
  
    clearBtn.addEventListener("click", () => {
      if (confirm("Clear all saved high scores?")) {
        localStorage.removeItem("quizResults");
        renderScores();
      }
    });
  
    renderScores();
  });
  