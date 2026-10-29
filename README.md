# Jogos de console no navegador

Catálogo estático (HTML/CSS/JS, sem build) com 20 jogos de console adaptados pela comunidade para rodar no navegador, verificados em 29/10/2026. Os botões abrem os sites dos próprios projetos; nada é hospedado aqui.

## Publicar na Vercel

1. Crie o repositório no GitHub e suba estes arquivos.
2. Em https://vercel.com/new , importe o repositório. Não precisa configurar nada (site estático, sem build).
3. A Vercel gera o link público para compartilhar.

## Estrutura
- `index.html` — página única
- `styles.css` — tema escuro estilo streaming
- `data.js` — os 20 jogos com console, gênero, método do port, requisitos e links
- `app.js` — renderização e filtros por console/gênero
- `*.jpg/png/webp` — capas vindas dos próprios projetos/agregadores (origem verificável)
