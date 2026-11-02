'use strict';
(function(){
const $=s=>document.querySelector(s);
const PAGE_SIZE=20;let page=1;
let games=[],platform='Todos',status='all',auditFilter='all',view='catalog',query='',sort='featured',genre='Todos';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
let favorites=new Set(read('apocalipse-favorites',[])),recent=read('apocalipse-recent',[]);
const save=()=>{try{localStorage.setItem('apocalipse-favorites',JSON.stringify([...favorites]));localStorage.setItem('apocalipse-recent',JSON.stringify(recent))}catch{}$('#fav-count').textContent=favorites.size};
const clean=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={direct:'Acesso direto',experimental:'Experimental',files:'Arquivos próprios',down:'Indisponível'};
const auditLabels={tested:'Partida testada',untested:'Não testada'};
function coverUrl(g){return typeof COVERS!=='undefined'&&COVERS[g.cover]?COVERS[g.cover]:g.cover}
function build(){
 games=GAMES.map((g,i)=>{
  const imported=/Importado do cat/.test(g.note);
  const st=g.down?'down':g.exp?'experimental':/Exige|Importa|possuir|própria|próprio|ROM|XISO|ISO|pasta/i.test(g.req||'')?'files':'direct';
  const tested=!imported&&/testad/i.test(g.note)&&!/não testada|nao testada/i.test(g.note);
  const plats=g.console.split(' / ');
  return Object.assign({},g,{id:String(i),idx:i,status:st,audit:tested?'tested':'untested',imported,plats,platform:plats[0],cover:coverUrl(g)});
 });
}
const matchesPlatform=g=>platform==='Todos'||g.plats.includes(platform);
const matchesAudit=g=>auditFilter==='all'||g.audit===auditFilter;
const matchesSearch=g=>clean([g.title,g.genre,g.console].join(' ')).includes(clean(query));
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>$('#toast').classList.remove('show'),2500)}
function openGame(id){recent=[id,...recent.filter(x=>x!==id)].slice(0,20);save();if(view==='recent')render()}
function render(){
 const platCounts={};games.forEach(g=>g.plats.forEach(p=>platCounts[p]=(platCounts[p]||0)+1));
 const shown=Object.keys(platCounts).sort((a,b)=>platCounts[b]-platCounts[a]);
 $('#filters').innerHTML=['Todos',...shown].map(p=>`<button data-platform="${esc(p)}" aria-pressed="${p===platform}" class="${p===platform?'active':''}">${p==='Todos'?'Todas as plataformas':esc(p)} <span class="filter-count">${p==='Todos'?games.length:platCounts[p]}</span></button>`).join('');
 $('#platform-nav').innerHTML=shown.slice(0,14).map(p=>`<button class="platform-nav" data-platform="${esc(p)}" aria-pressed="${p===platform}"><b></b>${esc(p)}<span class="side-count">${platCounts[p]}</span></button>`).join('');
 const base=g=>matchesPlatform(g)&&matchesAudit(g)&&(genre==='Todos'||g.genre===genre)&&matchesSearch(g);
 document.querySelectorAll('[data-status]').forEach(b=>{const sp=b.querySelector('span');if(sp)sp.textContent=games.filter(g=>base(g)&&(b.dataset.status==='all'||g.status===b.dataset.status)).length});
 $('#crumb').textContent=view==='favorites'?'Meus favoritos':view==='recent'?'Abertos recentemente':view==='added'?'Adicionados recentemente':'Descobrir';
 $('#view-title').childNodes[0].textContent=view==='favorites'?'Seus jogos favoritos':view==='recent'?'Volte para a partida':view==='added'?'Adicionados recentemente':'Todos os jogos';
 const list=games.filter(g=>base(g)&&(view!=='catalog'||status==='all'||g.status===status)&&(view!=='favorites'||favorites.has(g.id))&&(view!=='recent'||recent.includes(g.id))&&(view!=='added'||g.imported));
 if(sort==='name')list.sort((a,b)=>a.title.localeCompare(b.title,'pt-BR'));
 else if(sort==='platform')list.sort((a,b)=>a.platform.localeCompare(b.platform)||a.title.localeCompare(b.title,'pt-BR'));
 else if(view==='recent')list.sort((a,b)=>recent.indexOf(a.id)-recent.indexOf(b.id));
 else if(sort==='added'||view==='added')list.sort((a,b)=>b.idx-a.idx);
 else list.sort((a,b)=>(a.imported-b.imported)||(a.down-b.down)||(a.exp?1:0)-(b.exp?1:0)||a.idx-b.idx);
 $('#total').textContent=list.length;
 const tp=Math.max(1,Math.ceil(list.length/PAGE_SIZE));page=Math.min(Math.max(1,page),tp);
 const pg=list.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
 $('#page-summary').textContent=list.length?`${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE,list.length)} de ${list.length} jogos`:'';
 $('#pagination').hidden=list.length<=PAGE_SIZE;
 $('#pagination').innerHTML=`<button data-page="${page-1}" ${page===1?'disabled':''}>← Anterior</button><span class="page-state">Página ${page} de ${tp}</span>${Array.from({length:tp},(_,i)=>`<button data-page="${i+1}" ${page===i+1?'aria-current="page"':''}>${i+1}</button>`).join('')}<button data-page="${page+1}" ${page===tp?'disabled':''}>Próxima →</button>`;
 $('#grid').innerHTML=pg.map(g=>{const off=g.status==='down';return `<article class="game-card"><a ${off?'role="button" aria-disabled="true" tabindex="-1"':`href="${esc(g.url)}"`} class="cover-link ${off?'unavailable':''}" target="_blank" rel="noopener noreferrer" data-game="${g.id}" aria-label="Abrir ${esc(g.title)} no site do projeto"><span class="cvfallback">${esc(g.title)}</span><img src="${esc(g.cover)}" alt="Capa de ${esc(g.title)}" loading="lazy" style="position:relative;z-index:1" onerror="this.style.display='none'"><div class="play-overlay"><span>▶</span></div><span class="platform-badge">${esc(g.console.length>26?g.platform:g.console)}</span></a><button class="fav-button" data-fav="${g.id}" aria-label="Favoritar ${esc(g.title)}" aria-pressed="${favorites.has(g.id)}">${favorites.has(g.id)?'♥':'♡'}</button><div class="game-meta"><span>${esc(g.genre)}</span><span class="${g.status==='direct'?'available':g.status==='experimental'?'warning':'neutral'}">${labels[g.status]}</span></div><h3>${esc(g.title)}</h3><p class="origin-meta">${g.year?esc(g.year)+' · ':''}${esc(g.console)}</p><p class="access-mode-label">No navegador${g.mp?' · online':''}${g.imported?' · adicionado em 02/11/2026':''}</p><p class="audit-label audit-${g.audit}">${auditLabels[g.audit]}</p>${g.accessReview?`<p class="access-mode-label">${esc(g.accessReview.label)}</p>`:''}<div class="card-bottom"><a class="card-play" ${off?'aria-disabled="true" role="button"':`href="${esc(g.url)}" target="_blank" rel="noopener noreferrer" data-game="${g.id}"`}>${off?'Link indisponível':g.audit==='untested'?'Abrir projeto':'Abrir jogo'} <span>↗</span></a><button class="details-button" data-details="${g.id}" aria-label="Informações de ${esc(g.title)}">ⓘ</button></div></article>`}).join('');
 $('#empty').hidden=!!list.length;
 $('#empty-text').textContent=view==='favorites'?'Toque no coração de um jogo para guardá-lo aqui. Seus favoritos ficam neste navegador.':view==='recent'?'Os jogos que você abrir pelo catálogo aparecerão aqui.':'Tente outro nome, plataforma ou resultado de teste.';
 $('#collection-note').innerHTML=view==='added'?'<span>✦</span><p><strong>Novos neste lote.</strong> 221 jogos importados em 02/11/2026. Links revisados em 02/11/2026; confira a revisão de acesso em cada ficha. As partidas deste lote continuam sem teste.</p>':status==='experimental'?'<span>ⓘ</span><p><strong>Há limitações conhecidas.</strong> O próprio projeto informa que o jogo só inicia ou tem problemas. Abra ⓘ antes de jogar.</p>':status==='files'?'<span>ⓘ</span><p><strong>Precisam de uma cópia própria.</strong> O projeto pede arquivos do seu jogo antes da partida.</p>':'<span>ⓘ</span><p><strong>Abrir o link não comprova que a partida funciona.</strong> Confira o resultado do teste em cada ficha. Os jogos importados em 02/11 ainda não foram testados por nós.</p>';
 document.querySelectorAll('[data-platform]').forEach(b=>{b.classList.toggle('active',b.dataset.platform===platform);b.setAttribute('aria-pressed',b.dataset.platform===platform)});
 document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
 $('.status-tabs').hidden=view!=='catalog';
 document.querySelectorAll('[data-status]').forEach(b=>b.setAttribute('aria-selected',b.dataset.status===status));
 $('#added-count').textContent=games.filter(g=>g.imported).length;save();
}
function details(g){$('#detail-body').innerHTML=`<div class="detail-top"><img src="${esc(g.cover)}" alt="Capa de ${esc(g.title)}"><div class="detail-copy"><span class="eyebrow">${esc(g.console)} · ${esc(g.genre)}</span><h2>${esc(g.title)}</h2><p>${esc(g.method)}</p><p>${g.year?'Ano do original: '+esc(g.year)+' · ':''}${esc(g.req)}</p><p>Controles: ${esc(g.controls)}${g.mp?' · online':''}</p></div></div><div class="detail-warning"><p><strong>${auditLabels[g.audit]}</strong><br>${esc(g.note)}</p></div>${g.accessReview?`<div class="detail-warning"><p><strong>Revisão do link: ${esc(g.accessReview.label)}</strong><br>${esc(g.accessReview.note)}</p></div>`:''}<div class="detail-actions">${g.status==='down'?'<span class="disabled-link">Link indisponível nesta revisão</span>':`<a class="primary" data-game="${g.id}" target="_blank" rel="noopener noreferrer" href="${esc(g.url)}">${g.exp?'Experimentar':g.audit==='untested'?'Abrir projeto':'Abrir jogo'} ↗</a>`}<a class="source-link" href="${esc(g.source)}" target="_blank" rel="noopener noreferrer">Página do projeto</a></div>`;$('#details').showModal()}
function about(){$('#detail-body').innerHTML=`<span class="eyebrow">SEM COMPLICAÇÃO</span><h2>Escolha um jogo. Abra o projeto.</h2><p>O Apocalipse Games é um catálogo de links. Clicar na capa ou em “Abrir jogo” abre o site do projeto em outra aba. O projeto pode pedir mais um clique em “Jogar”, tempo de carregamento ou arquivos próprios.</p><p>Use Chrome ou Edge atualizado em um computador. O desempenho depende do jogo, do navegador e do aparelho.</p><p>O coração salva favoritos neste navegador. “Abertos recentemente” guarda os últimos links que você abriu, o que não indica que o jogo iniciou. Nenhum jogo, ISO ou BIOS é hospedado aqui. Salvo indicação na ficha, os projetos não são oficiais das donas dos jogos.</p>`;$('#details').showModal()}
document.addEventListener('click',e=>{
 const pager=e.target.closest('[data-page]');if(pager){if(pager.disabled)return;page=Number(pager.dataset.page);render();$('#collection').scrollIntoView({behavior:'smooth'});return}
 const fav=e.target.closest('[data-fav]');if(fav){const id=fav.dataset.fav;favorites.has(id)?favorites.delete(id):favorites.add(id);save();render();toast(favorites.has(id)?'Adicionado aos favoritos':'Removido dos favoritos');return}
 const det=e.target.closest('[data-details]');if(det){details(games.find(g=>g.id===det.dataset.details));return}
 const p=e.target.closest('[data-platform]');if(p){platform=p.dataset.platform;status='all';page=1;render();return}
 const st=e.target.closest('[data-status]');if(st){status=st.dataset.status;page=1;render();return}
 const v=e.target.closest('[data-view]');if(v){view=v.dataset.view;platform='Todos';page=1;render();$('#collection').scrollIntoView({behavior:'smooth'});return}
 const g=e.target.closest('[data-game]');if(g){const en=games.find(x=>x.id===g.dataset.game);if(en&&en.status==='down'){e.preventDefault();return}openGame(g.dataset.game)}
});
$('#audit-filter').addEventListener('change',e=>{auditFilter=e.target.value;page=1;render()});
$('#genre').addEventListener('change',e=>{genre=e.target.value;page=1;render()});
$('#search').addEventListener('input',e=>{query=e.target.value;page=1;render()});
$('#sort').addEventListener('change',e=>{sort=e.target.value;page=1;render()});
$('#reset').onclick=()=>{page=1;query='';$('#search').value='';platform='Todos';status='all';auditFilter='all';$('#audit-filter').value='all';view='catalog';genre='Todos';$('#genre').value='Todos';render()};
$('#hero-play').onclick=e=>{e.preventDefault();$('#collection').scrollIntoView({behavior:'smooth'})};
$('#howto-btn').onclick=()=>$('#about-section').scrollIntoView({behavior:'smooth'});
$('#about-btn').onclick=about;$('#sources-btn').onclick=about;
$('.close').onclick=()=>$('#details').close();
$('#details').addEventListener('click',e=>{if(e.target===$('#details')){const r=$('#details').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#details').close()}});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)&&!$('#details').open){e.preventDefault();$('#search').focus()}});
build();
const valid=new Set(games.map(g=>g.id));favorites=new Set([...favorites].filter(i=>valid.has(i)));recent=recent.filter(i=>valid.has(i));
$('#search').placeholder=`Buscar entre ${games.length} jogos...`;
$('#genre').innerHTML='<option value="Todos">Todos os gêneros</option>'+[...new Set(games.map(g=>g.genre))].sort((a,b)=>a.localeCompare(b,'pt-BR')).map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join('');
if(typeof HERO_IMG!=='undefined')$('#hero-photo').src=HERO_IMG;
if(typeof BANNER_IMG!=='undefined')$('#site-banner').src=BANNER_IMG;else $('#site-banner-wrap').hidden=true;
const feat=games.find(g=>g.title.indexOf('Most Wanted')>-1&&g.cover)||games[0];$('#hero-cover').src=feat.cover;
render();
})();
