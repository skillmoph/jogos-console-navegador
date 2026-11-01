/* Apocalipse Games — renderer v3 (estrutura de catálogo de referência) */
(function(){
const $=s=>document.querySelector(s);
const DOT = { "PS1":"#e2574c","PS2":"#4c7dff","PS3":"#9a6bff","PS4":"#3fa9f5","Xbox":"#3dbb4c","Xbox 360":"#52d273","Xbox One":"#2ea34e","N64":"#e2824c","SNES":"#b48ce8","NES":"#c0c7d4","Mega Drive":"#5cc8d8","Saturn":"#8f9bb3","PC":"#34f2e8","Game Boy":"#a4c639","GBA":"#7ab648","GameCube":"#8a6bff","Switch":"#ff5b5b","PSP":"#66a3ff" };
const I = {
 tiro:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/></svg>',
 corrida:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4.5-5"/><circle cx="12" cy="15" r="1.6"/></svg>',
 aventura:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>',
 rpg:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5z"/></svg>',
 party:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2.5" y="8" width="19" height="9" rx="4.5"/><circle cx="8" cy="12.5" r="1.3"/><circle cx="16" cy="11" r="1.1"/><circle cx="18" cy="13.5" r="1.1"/></svg>',
 plataforma:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="11" y="9" width="6" height="6" rx="1"/><rect x="17" y="3" width="5" height="5" rx="1"/></svg>',
 mundoaberto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3L3 5.5v15L9 18l6 2.5 6-2.5v-15L15 5.5z"/><path d="M9 3v15M15 5.5v15"/></svg>',
 sandbox:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/><rect x="8" y="4" width="8" height="8" rx="1"/></svg>',
 esporte:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg>' };
function iconFor(g){ const k=g.toLowerCase(); if(/tiro/.test(k))return I.tiro; if(/corrida/.test(k))return I.corrida; if(/rpg/.test(k))return I.rpg; if(/party/.test(k))return I.party; if(/plataforma/.test(k))return I.plataforma; if(/mundo/.test(k))return I.mundoaberto; if(/constru|sandbox/.test(k))return I.sandbox; if(/esporte/.test(k))return I.esporte; return I.aventura; }
const state={console:"Todos",genre:"Todos",query:""};
const dotFor=c=>DOT[c]||"#8ca3c3";
function kind(g){ if(g.down) return {t:"Indisponível",c:"down"}; if(g.exp) return {t:"Experimental",c:"exp"}; if(/Exige|Importa|possuir|própria|próprio|ROM|XISO|ISO|pasta/i.test(g.req)) return {t:"BYO",c:"byo"}; return {t:"Direto",c:"ok"}; }
function coverUrl(g){ return g.cover?(typeof COVERS!=="undefined"&&COVERS[g.cover]?COVERS[g.cover]:g.cover):null; }

function cardEl(g,i){
  const el=document.createElement("article"); el.className="card";
  const src=coverUrl(g); const first=g.console.split(" / ")[0]; const k=kind(g);
  el.innerHTML=(src
    ?`<div class="cover" style="background-image:url('${src}')">`
    :`<div class="cover ph"><div class="pt">${g.title}</div>`)
    +`<span class="cvl"><span class="dot" style="background:${dotFor(first)}"></span>${g.console}</span>`
    +(g.mp?'<span class="mps">ONLINE</span>':'')+`</div>
    <div class="cbody"><div class="ct">${g.title}</div>
    <div class="cm">${g.year} · ${g.genre}</div>
    <span class="kb ${k.c}">${k.t}</span></div>`;
  el.onclick=()=>openModal(g,i);
  return el;
}
function openModal(g,i){
  const m=$("#modal"); const src=coverUrl(g); const first=g.console.split(" / ")[0]; const k=kind(g);
  $("#m-cover").style.backgroundImage=src?`url('${src}')`:"none";
  $("#m-body").innerHTML=`
    <div class="m-cons"><span class="dot" style="background:${dotFor(first)}"></span>${g.console} · ${g.year}${g.mp?' · ONLINE':''}</div>
    <h3>${g.title}</h3>
    <div class="m-meta">${g.genre} · ${g.method}</div>
    <div class="m-badges"><span class="kb ${k.c}">${g.down?k.t:g.req}</span><span class="kb ok">${g.controls}</span></div>
    <p class="m-note">${g.note}</p>
    <div class="m-actions">
      ${g.down?`<span class="btn down-off">Indisponível</span>`:`<a class="btn ${g.exp?'exp':''}" href="${g.url}" target="_blank" rel="noopener">${g.exp?'Experimentar':'▶ Jogar'}</a>`}
      <a class="proj" href="${g.source}" target="_blank" rel="noopener">página do projeto</a>
    </div>`;
  m.classList.add("on"); document.body.style.overflow="hidden";
}
function closeModal(){ $("#modal").classList.remove("on"); document.body.style.overflow=""; }
document.addEventListener("keydown",e=>{ if(e.key==="Escape") closeModal(); });

function filtered(){ const q=state.query.trim().toLowerCase(); return GAMES.map((g,i)=>({g,i})).filter(({g})=>(state.console==="Todos"||g.console.split(" / ").includes(state.console))&&(state.genre==="Todos"||g.genre===state.genre)&&(!q||(g.title+" "+g.console+" "+g.genre).toLowerCase().includes(q))); }

function renderChips(){
  const cr=$("#chips"); cr.innerHTML="";
  const cons=[...new Set(GAMES.flatMap(g=>g.console.split(" / ")))];
  const mk=(label,n,dot)=>{ const b=document.createElement("button"); b.className="chip";
    b.innerHTML=(dot?`<span class="dot" style="background:${dot}"></span>`:"")+`${label}<span class="n">${n}</span>`;
    b.setAttribute("aria-pressed",state.console===label?"true":"false");
    b.onclick=()=>{ state.console=(state.console===label&&label!=="Todos")?"Todos":label; render(); };
    cr.appendChild(b); };
  mk("Todos",GAMES.length,null);
  cons.forEach(c=>mk(c,GAMES.filter(g=>g.console.split(" / ").includes(c)).length,dotFor(c)));
}

/* carrossel */
function heroWarn(g){
  const w=[];
  if(g.down) w.push("indisponível desde "+g.down);
  if(g.exp) w.push("Experimental");
  if(/partida não testada/i.test(g.note)) w.push("partida não testada");
  if(/WebGPU/i.test(g.note)||/WebGPU/i.test(g.method)) w.push("requer Chrome/Edge com WebGPU");
  return w.length?("⚠ "+w.join(" · ")):"";
}
let slideIdx=0, timer=null;
function buildCarousel(){
  const feat=GAMES.map((g,i)=>({g,i})).filter(({g})=>!g.exp&&!g.down).slice(0,3);
  const track=$("#car-track"); track.innerHTML="";
  let html=`<div class="slide photo-slide">
      <div class="sl-bg" id="sl-photo"></div>
      <div class="sl-fade"></div>
      <div class="sl-tx"><div class="sl-kick">catálogo de jogos no navegador</div>
      <div class="sl-title">Apocalipse Games</div>
      <div class="sl-sub">João Gabriel, 10 anos, fundador do Apocalipse Games.</div></div>
      <img class="sl-ph" id="sl-ph" alt="Foto de capa do site"></div>`;
  feat.forEach(({g,i})=>{
    const src=coverUrl(g); const first=g.console.split(" / ")[0]; const k=kind(g);
    html+=`<div class="slide">
      <div class="sl-bg" style="background-image:url('${src}')"></div>
      <div class="sl-fade"></div>
      <div class="sl-tx"><div class="sl-kick"><span class="dot" style="background:${dotFor(first)}"></span>${g.console} · ${g.year}</div>
      <div class="sl-title">${g.title}</div>
      <div class="sl-sub">${g.genre} · ${g.method}</div>
      <div class="sl-ct"><span class="kb ${k.c}">${k.t}</span>
      ${g.down?`<span class="btn sm down-off">Indisponível</span>`:`<a class="btn sm" href="${g.url}" target="_blank" rel="noopener" onclick="event.stopPropagation()">▶ Jogar</a>`}
      <button class="btn sm ghost" data-detalhe="${i}">Detalhes</button></div>
      <div class="sl-warn">${heroWarn(g)}</div></div>
      <div class="sl-art" style="background-image:url('${src}')"></div></div>`;
  });
  track.innerHTML=html;
  if(typeof HERO_IMG!=="undefined"){ $("#sl-photo").style.backgroundImage=`url('${HERO_IMG}')`; $("#sl-ph").src=HERO_IMG; }
  if(typeof BANNER_IMG!=="undefined"){ const sb=$("#site-banner"); if(sb) sb.src=BANNER_IMG; }
  track.querySelectorAll("[data-detalhe]").forEach(b=>b.onclick=()=>{ const i=+b.getAttribute("data-detalhe"); openModal(GAMES[i],i); });
  const dots=$("#car-dots"); dots.innerHTML="";
  track.querySelectorAll(".slide").forEach((_,n)=>{ const d=document.createElement("button"); d.className="cdot"; d.onclick=()=>goSlide(n); dots.appendChild(d); });
  goSlide(0);
  clearInterval(timer); timer=setInterval(()=>goSlide((slideIdx+1)%track.children.length),6000);
  $("#car-prev").onclick=()=>goSlide((slideIdx-1+track.children.length)%track.children.length);
  $("#car-next").onclick=()=>goSlide((slideIdx+1)%track.children.length);
}
function goSlide(n){
  const track=$("#car-track"); slideIdx=n;
  track.style.transform=`translateX(-${n*100}%)`;
  [...$("#car-dots").children].forEach((d,i)=>d.classList.toggle("on",i===n));
}

function sec(t){ const s=document.createElement("section"); s.className="bloco"; s.innerHTML=`<h2>${t}<span class="seta">›</span></h2>`; return s; }

function render(){
  renderChips();
  const main=$("#secoes"); main.innerHTML="";
  const list=filtered();
  const jogos=list.filter(({g})=>!g.exp&&!g.down).length, exps=list.filter(({g})=>g.exp).length;
  const cnt=exps?`${jogos} jogos + ${exps} experimentais`:`${jogos} jogos`;
  $("#count").textContent=cnt; const tb=$("#count-tb"); if(tb) tb.textContent=cnt;

  if(state.console==="Todos"&&state.genre==="Todos"&&!state.query.trim()){
    const cats={}; GAMES.forEach(g=>cats[g.genre]=(cats[g.genre]||0)+1);
    const cs=sec("Categorias"); const grid=document.createElement("div"); grid.className="catgrid";
    Object.keys(cats).sort((a,b)=>cats[b]-cats[a]).forEach(nm=>{
      const d=document.createElement("button"); d.className="cat";
      d.innerHTML=`<span class="ic">${iconFor(nm)}</span><span class="nm">${nm}</span><span class="ct">${cats[nm]}</span>`;
      d.onclick=()=>{ state.genre=nm; render(); };
      grid.appendChild(d);
    });
    cs.appendChild(grid); main.appendChild(cs);
    [...new Set(list.map(({g})=>g.genre))].forEach(gn=>{
      const items=list.filter(({g})=>g.genre===gn);
      const s=sec(gn); const r=document.createElement("div"); r.className=items.length>4?"row":"grid5";
      items.forEach(({g,i})=>r.appendChild(cardEl(g,i)));
      s.appendChild(r); main.appendChild(s);
    });
  } else {
    const s=sec(state.query.trim()?("Busca: \u201c"+state.query.trim()+"\u201d"):(state.genre!=="Todos"?state.genre:state.console));
    const b=document.createElement("button"); b.className="chip"; b.textContent="‹ Voltar para tudo";
    b.onclick=()=>{ state.genre="Todos"; state.console="Todos"; state.query=""; const q1=document.getElementById("q-top"),q2=document.getElementById("q-row"); if(q1)q1.value=""; if(q2)q2.value=""; render(); };
    s.querySelector("h2").appendChild(b);
    const g2=document.createElement("div"); g2.className="grid5";
    list.forEach(({g,i})=>g2.appendChild(cardEl(g,i)));
    s.appendChild(g2); main.appendChild(s);
  }
}

function shortName(t){ return String(t||"").replace(/^\d+\.\s*/,""); }
/* bindings busca */
(function(){
  function wire(id){ var el=document.getElementById(id); if(!el) return;
    el.addEventListener("input",function(){ state.query=el.value; var o=el.id==="q-top"?document.getElementById("q-row"):document.getElementById("q-top"); if(o&&o.value!==el.value)o.value=el.value; render(); if(el.value.trim()){ document.getElementById("secoes").scrollIntoView({behavior:"smooth",block:"start"}); } });
  }
  wire("q-top"); wire("q-row");
})();
/* bindings topbar/modal */
(function(){
  var h=document.getElementById("btn-howto"); if(h) h.onclick=function(){ document.getElementById("howto").classList.toggle("on"); };
  var v=document.getElementById("btn-all"); if(v) v.onclick=function(){ document.getElementById("chips").scrollIntoView({behavior:"smooth"}); };
  var b=document.getElementById("brand"); if(b) b.onclick=function(e){ e.preventDefault(); window.scrollTo({top:0,behavior:"smooth"}); };
  var mc=document.getElementById("m-close"); if(mc) mc.onclick=function(){ document.getElementById("modal").classList.remove("on"); document.body.style.overflow=""; };
  var bk=document.querySelector("#modal .bk"); if(bk) bk.onclick=function(){ document.getElementById("modal").classList.remove("on"); document.body.style.overflow=""; };
})();
buildCarousel();
render();
})();
