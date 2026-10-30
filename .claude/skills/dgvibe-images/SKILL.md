---
name: dgvibe-images
description: Geração nativa de imagens no DGVibe (banners, heros, logos, ilustrações, ícones, OG images). Use sempre que o usuário pedir uma imagem, arte visual, banner ou asset para o projeto.
---

# Geração de Imagens no DGVibe

Esta skill ensina a usar a ferramenta nativa `generate_image` para criar ativos visuais profissionais diretamente no projeto.

## Regra de Ouro da Plataforma

1. **NUNCA tente inventar binários com `Write`** nem escrever scripts `curl`/`python` para chamar APIs externas. O gateway é interno, protegido contra sondagem no sandbox e a credencial fica sob custódia do servidor DGVibe.
2. **Use EXCLUSIVAMENTE a ferramenta `generate_image`**. Ela gera o asset no gateway da plataforma e grava na pasta de assets correta da estrutura do projeto (`public/images/` em projetos Vite/React/Next, ou `images/` na raiz em sites estáticos), com extensão correspondente aos bytes reais (`.jpg`, `.png` ou `.webp`).
3. **Use SEMPRE a URL pública exata retornada pela ferramenta** — independente da estrutura interna, o servidor DGVibe e o Vite servem a pasta de assets na raiz web como `/images/<arquivo>`:
   - `<img src="/images/hero-home.jpg" alt="Hero..." />`
   - `background-image: url('/images/banner-promo.jpg');`
4. **GERAR A IMAGEM É APENAS METADE DA TAREFA**: a ferramenta NÃO altera o código do projeto sozinha. O agente PRECISA localizar os arquivos que usavam a imagem antiga (ou onde a nova deve entrar) e aplicar a edição via `Edit`/`Write` logo em seguida. Nunca pare na resposta da ferramenta dizendo apenas que o arquivo foi criado.

---

## Como Montar o Prompt Visual

A qualidade da imagem depende da riqueza descritiva do prompt. Nunca passe prompts telegráficos como "um gato" ou "banner para loja". Estruture em:

1. **Assunto principal**: o objeto, pessoa ou cena central, com detalhes específicos.
2. **Estilo artístico**: fotografia profissional, ilustração vetorial 3D minimalista, arte conceitual cyberpunk, render cinematográfico Octane, etc.
3. **Iluminação e atmosfera**: luz natural suave de hora dourada, neon contrastante, estúdio profissional com softbox, sombras volumétricas.
4. **Paleta de cores**: harmonize com o tema do projeto (ex.: "tons escuros de azul meia-noite #0B1220 com acentos ciano neon #00F5FF").
5. **Composição e proporção**:
   - **Hero / Banner**: *"horizontal wide 16:9 banner, panoramic framing, subject placed on the right with negative space on the left for text overlay"*.
   - **Avatar / Logo / Ícone**: *"centered square 1:1, isolated on clean dark background, vector minimalism, sharp outlines"*.
   - **Card / Feed**: *"vertical 4:5 portrait, dynamic depth of field"*.

> **Dica de texto:** o gerador aceita prompts em português ou inglês. Em geral, termos visuais em inglês (*"cinematic lighting, 8k resolution, minimalist 3D isometric"*) produzem fidelidade estética ainda maior.

---

## Passo a Passo de Execução

Quando o usuário pedir: *"crie um banner para a landing page"*, *"coloque um logo moderno"* ou *"altere a imagem do hero"*:

1. **Investigue onde a imagem deve entrar**:
   - Se for uma **substituição** (ex.: "altere a imagem do hero"): faça `Grep` no projeto por `hero`, `images/`, `<img`, `background-image` ou classes do componente antes de gerar. Descubra qual arquivo (ex.: `src/components/Hero.jsx`, `index.html`) e qual URL antiga ele usava.
   - Escolha um slug descritivo para o `filename` (sem extensão, ex.: `hero-fintech-dark`, `logo-simbolo-prisma`, `card-depoimento-1`).
2. **Chame a ferramenta `generate_image`**:
   ```json
   {
     "prompt": "Modern minimalist 3D glassmorphic logo symbol for a financial technology app, glowing cyan and deep violet reflections, dark sleek backdrop, isometric angle, pristine sharp render",
     "filename": "logo-fintech-3d"
   }
   ```
3. **Aguarde o resultado**: a ferramenta retorna o formato real, o caminho gravado no disco e a URL pública (ex.: `/images/logo-fintech-3d.jpg`).
4. **Aplique IMEDIATAMENTE no código do projeto (obrigatório)**:
   - Abra o componente/página via `Edit`/`Write`.
   - Se era substituição: troque TODAS as referências da URL antiga pela nova `publicUrl`.
   - Se era asset novo: adicione a tag `<img>` ou o CSS usando exatamente a `publicUrl` retornada.
   - Garanta `alt` descritivo e classes de layout responsivas (ex.: `w-full h-auto object-cover` no Tailwind).
5. **Apresente ao usuário**: informe que o asset foi gerado E quais arquivos de código foram alterados para usá-lo. Nunca encerre o turno dizendo apenas que a imagem foi gerada.
