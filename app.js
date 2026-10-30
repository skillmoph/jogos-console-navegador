const CONSOLE_CLASS = { "PS2":"PS2", "PS2 / Xbox / PC":"PS2", "PS1 / Saturn / PC":"PS1", "PSP":"PSP", "PS1":"PS1", "Xbox":"Xbox", "N64":"N64", "SNES":"SNES", "Mega Drive":"MD", "PC":"PC", "Game Boy Color":"GBC", "Game Boy":"GB", "GBA":"GBA", "NES":"NES" };
const state = { console:"Todos", genre:"Todos" };

function chip(row, label, key) {
  const b = document.createElement("button");
  b.className = "chip"; b.textContent = label;
  b.setAttribute("aria-pressed", state[key] === label ? "true" : "false");
  b.onclick = () => { state[key] = label; render(); };
  row.appendChild(b);
}

function renderFilters() {
  const cr = document.getElementById("console-filters");
  const gr = document.getElementById("genre-filters");
  cr.querySelectorAll(".chip").forEach(e => e.remove());
  gr.querySelectorAll(".chip").forEach(e => e.remove());
  CONSOLES.forEach(c => chip(cr, c, "console"));
  GENRES.forEach(g => chip(gr, g, "genre"));
}

function card(g, i) {
  const el = document.createElement("article");
  el.className = "card";
  const cc = CONSOLE_CLASS[g.console] || "PS2";
  const src = g.cover ? (typeof COVERS !== "undefined" && COVERS[g.cover] ? COVERS[g.cover] : g.cover) : null;
  const coverStyle = src ? `style="background-image:url('${src}')"` : "";
  const placeholder = g.cover ? "" : `<div class="ph"><div class="console-tag">${cc === "GBC" ? "GBC" : g.console.split(" ")[0]}</div><div class="ptitle">${g.title}</div><div class="nocover">arte não disponível</div></div>`;
  el.innerHTML = `
    <div class="cover" ${coverStyle}>
      ${placeholder}
      <span class="pill ${cc}">${g.console}</span>
      ${g.mp ? '<span class="mp">ONLINE</span>' : ""}
    </div>
    <div class="body">
      <div class="title">${i + 1}. ${g.title}</div>
      <div class="meta">${g.year} · ${g.genre} · ${g.method}</div>
      <div class="badges">
        <span class="badge req">${g.req}</span>
        <span class="badge">${g.controls}</span>
      </div>
      <p class="note">${g.note}</p>
      <div class="actions">
        <a class="play" href="${g.url}" target="_blank" rel="noopener">▶ Jogar</a>
        <a class="src" href="${g.source}" target="_blank" rel="noopener">projeto</a>
      </div>
    </div>`;
  return el;
}

function render() {
  renderFilters();
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  const list = GAMES.map((g, i) => ({ g, i }))
    .filter(({ g }) => (state.console === "Todos" || g.console === state.console || g.console.startsWith(state.console))
                   && (state.genre === "Todos" || g.genre === state.genre));
  list.forEach(({ g, i }) => grid.appendChild(card(g, i)));
  document.getElementById("count").textContent = `${list.length} de ${GAMES.length} jogos`;
}
render();
