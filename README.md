# Portal do Riso

**Nome Completo:** Alessandro Rogério Heidmann  
**Disciplina:** Desenvolvimento Web  
**Tema:** Portal interativo de humor.

## 🚀 Funcionalidades
* **Listagem Dinâmica:** Carregamento assíncrono do catálogo principal via AJAX (Fetch API).
* **Detalhes sob Demanda:** Requisição individual de detalhes do item exibida em um Modal (Bootstrap).
* **Filtros e Busca:** Pesquisa por texto (título ou resumo) e filtro por categoria (Piada, Charada, Vídeo).
* **Mídia Responsiva:** Suporte à incorporação de vídeos do YouTube com ajuste automático de proporção (16:9).
* **Tratamento de Estados:** Feedbacks visuais na interface para carregamento (loading spinner), listas vazias e erros de conexão.

## 📂 Fonte dos Dados
Os dados consumidos pela aplicação são estáticos e locais. Foram criados especificamente para fins didáticos neste projeto e estão estruturados em arquivos JSON. A lista principal encontra-se em `data/list.json` e os detalhes específicos de cada item estão separados em arquivos individuais na pasta `data/details/` (ex: `1.json`, `8.json`).

## 🛠️ Instruções de Execução
Para que as requisições AJAX (`fetch()`) funcionem corretamente e não sejam bloqueadas pela política de CORS do navegador, o projeto **não deve** ser aberto com um duplo clique no arquivo `index.html` (protocolo `file://`).

1. Faça o clone do repositório ou baixe os arquivos.
2. Abra a pasta do projeto no VS Code.
3. Utilize a extensão **Live Server** (clicando em "Go Live" na barra inferior) ou inicie qualquer servidor HTTP local de sua preferência.
4. O navegador abrirá automaticamente o projeto no endereço `http://127.0.0.1:5500`.

## 🧪 Roteiro de Testes

* **Listagem:** Ao carregar a página inicial, verifique se os cards contendo os títulos e resumos das piadas/vídeos são exibidos no grid principal.
* **Detalhes:** Clique no botão "Ver Detalhes" de qualquer card. Um Modal deverá se sobrepor à tela exibindo o conteúdo completo. Para testar a incorporação de vídeo, abra os detalhes do item "Cão de Skate" ou "Gato vs Pepino".
* **Busca e Filtro:** 
  1. Digite "skate" na barra de pesquisa e clique em Buscar (ou aperte Enter). Apenas o vídeo relacionado deve aparecer.
  2. Limpe a barra de pesquisa, selecione a categoria "Charada" e clique em Buscar. Apenas as charadas devem ser listadas.
* **Estado de Carregamento:** No navegador (Google Chrome), abra o DevTools (F12), vá na aba *Network* (Rede), mude o *Throttling* para "Slow 3G" e atualize a página. Você verá o "Spinner" (círculo azul girando) indicando o carregamento dos dados.
* **Estado Vazio:** Digite um texto aleatório que não existe no catálogo (ex: "xyz123") e faça a busca. Um alerta amarelo informará que "Nenhum item foi encontrado com os critérios de busca selecionados."
* **Estado de Erro:** Para forçar um erro, renomeie temporariamente a pasta `data` para `data2` e recarregue a página. Um alerta vermelho indicará a "Falha ao carregar o conteúdo", exibindo também um botão azul "Tentar Novamente". Volte o nome da pasta para `data` e clique no botão para testar a recuperação da falha.