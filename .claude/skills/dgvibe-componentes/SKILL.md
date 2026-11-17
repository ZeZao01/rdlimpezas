---
name: dgvibe-componentes
description: Biblioteca de blocos de interface do DGVibe — inserir navbar, hero, recursos, planos, depoimentos, FAQ, chamada para ação, contato ou rodapé em uma página existente, adaptados ao design system do projeto. Use quando o usuário pedir para adicionar uma seção, um bloco ou um componente de página.
---

# Componentes do DGVibe — inserir blocos prontos

Blocos são seções de interface **prontas** para entrar dentro de uma página que já existe.
Diferente de template (que troca o site inteiro), aqui você **insere uma peça** e a adapta.

## Catálogo (fonte única)
Leia `/opt/dgvibe/themes/blocos/catalog.json` — id, nome, descrição, categoria e ordem narrativa.
Não varra as pastas para "comparar": escolha pelo catálogo, leia o bloco e insira **um**.

Cada bloco mora em `/opt/dgvibe/themes/blocos/<id>/`:
- `bloco.html` — prévia autônoma + a marcação a inserir
- `NOTAS.md` — anatomia, onde inserir, como adaptar e **como mesclar sem duplicar**

## Antes de escrever qualquer código
1. Leia `/opt/dgvibe/themes/blocos/CONVENCOES.md` (tokens, marcadores e regras).
2. Leia a `NOTAS.md` do bloco escolhido.
3. Leia `.references/design-system.html` do projeto e o CSS vigente (ou `src/index.css` em
   React/Vite) — é de lá que saem as cores, a tipografia e os raios reais.
4. **Leia a página alvo inteira.** O bloco entra no local certo da ordem narrativa, e a página
   quase sempre já tem navbar/footer.

## Ordem narrativa
navbar → hero → features → depoimentos → pricing → faq → contato → cta → footer.
Coloque cada bloco no lugar certo dessa sequência, não obrigatoriamente no fim do arquivo.

## Como inserir
1. Copie o conteúdo **entre os marcadores** do `bloco.html`:
   `<!-- ═══ INÍCIO DO BLOCO: <id> ═══ -->` … `<!-- ═══ FIM DO BLOCO ═══ -->`
2. Copie o bloco `<style>` do mesmo arquivo, junto da marcação.
3. **Adapte os tokens** `--bloco-*` para o design system do projeto (mapeie cores, tipografia,
   raios e largura) e só depois remova o `:root` original dos tokens.
4. Substitua TODO texto de exemplo pelo conteúdo real do projeto.
5. Verifique responsividade, contraste e a hierarquia de headings.

## Regras que não se discute
- **Mesclar > duplicar.** Se a página já tem a seção, adapte ou substitua o que existe — nunca
  cole uma segunda navbar, um segundo rodapé ou um segundo hero.
- **Zero dependência externa.** Não adicione CDN, fonte externa, biblioteca ou `<script>`.
  Interação só em `<details>/<summary>` ou CSS puro — e se o pedido exigir JavaScript, pergunte
  antes de escrever.
- **Nenhum placeholder sobrevive.** Sem "Sua Marca", "Lorem ipsum", preços inventados, depoimentos
  inventados ou links `#` no resultado final. Se faltar dado real (preço, cliente, canal de contato),
  **pergunte ao usuário** em vez de inventar.
- **Projetos React/Vite**: vire componente JSX em `src/components/` (`class` → `className`,
  `for` → `htmlFor`), com o CSS no arquivo de estilos do projeto — nunca um CSS por bloco.
- **Nunca copie scripts legados de tema** (`_ext/`, `_capture/`, firewalls antigos) para o projeto.
- Código nunca vai para o chat; apenas 1–3 frases de status.

## Feedback para o usuário
Diga em 1–2 frases: qual bloco entrou, onde e o que foi adaptado. Se mesclou com uma seção
existente, diga isso explicitamente.
