// Variável global para armazenar os itens do catálogo
let catalogData = [];

// Seleção de elementos do DOM
const catalogGrid = document.getElementById('catalog-grid');
const statusMessage = document.getElementById('status-message');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Instância do Modal do Bootstrap
const itemModalElement = document.getElementById('itemModal');
const itemModal = new bootstrap.Modal(itemModalElement);
const modalTitle = document.getElementById('itemModalLabel');
const modalBody = document.getElementById('itemModalBody');

// Inicialização: carrega os dados ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
});

// Evento do formulário de busca/filtro
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    filterItems();
});

// 1. Requisição AJAX principal: Carregar lista de itens
async function fetchItems() {
    showLoading();
    try {
        const response = await fetch('data/list.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        catalogData = await response.json();
        renderItems(catalogData);
    } catch (error) {
        showError('Falha ao carregar o conteúdo. Verifique a sua ligação ou servidor local.', fetchItems);
    }
}

// 2. Renderizar os cards na interface
function renderItems(items) {
    catalogGrid.innerHTML = '';
    statusMessage.innerHTML = '';

    if (items.length === 0) {
        statusMessage.innerHTML = `
            <div class="alert alert-warning" role="alert">
                Nenhum item encontrado com os critérios de busca selecionados.
            </div>`;
        return;
    }

    items.forEach(item => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-3'; // Responsividade: 1 col (telemóvel), 2 (tablet), 4 (desktop)

        col.innerHTML = `
            <div class="card h-100 shadow-sm border-0">
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary mb-2 align-self-start">${item.category}</span>
                    <h5 class="card-title fw-bold">${item.title}</h5>
                    <p class="card-text text-muted flex-grow-1">${item.summary}</p>
                    <button class="btn btn-outline-primary mt-3 w-100" onclick="fetchItemDetails(${item.id})">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        `;
        catalogGrid.appendChild(col);
    });
}

// 3. Filtrar itens por texto e categoria
function filterItems() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filtered = catalogData.filter(item => {
        const matchesText = item.title.toLowerCase().includes(searchTerm) || 
                            item.summary.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
        
        return matchesText && matchesCategory;
    });

    renderItems(filtered);
}

// 4. Segunda requisição AJAX: Buscar detalhes individuais de um item
async function fetchItemDetails(id) {
    // Exibe estado de carregamento dentro do Modal
    modalTitle.textContent = 'A carregar...';
    modalBody.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">A carregar...</span>
            </div>
            <p class="mt-2 text-muted">A obter detalhes...</p>
        </div>`;
    
    itemModal.show();

    try {
        const response = await fetch(`data/details/${id}.json`);
        
        if (!response.ok) {
            throw new Error(`Erro ao procurar o item com ID ${id}`);
        }

        const details = await response.json();

        // Prepara o código do vídeo, se existir no JSON
        let videoHTML = '';
        if (details.videoEmbed) {
            // A classe 'ratio ratio-16x9' do Bootstrap deixa o vídeo responsivo
            videoHTML = `
            <div class="ratio ratio-16x9 mb-3">
                ${details.videoEmbed}
            </div>`;
        }

        // Atualiza os dados do Modal com o conteúdo recebido
        modalTitle.textContent = details.title;
        modalBody.innerHTML = `
            <div class="mb-3">
                <span class="badge bg-primary">${details.category}</span>
            </div>
            ${videoHTML}
            <div class="p-3 bg-light rounded mb-3">
                <p class="fs-5 mb-0">${details.fullContent}</p>
            </div>
            <div class="text-end text-muted small mt-3">
                <span><strong>Autor:</strong> ${details.author}</span> | 
                <span><strong>Data:</strong> ${details.date}</span>
            </div>
        `;
    } catch (error) {
        modalTitle.textContent = 'Erro ao carregar';
        modalBody.innerHTML = `
            <div class="alert alert-danger" role="alert">
                Não foi possível carregar as informações detalhadas deste item.
            </div>
            <button class="btn btn-sm btn-outline-danger w-100" onclick="fetchItemDetails(${id})">
                Tentar Novamente
            </button>`;
    }
}

// Função auxiliar: Exibir mensagem/spinner de carregamento
function showLoading() {
    catalogGrid.innerHTML = '';
    statusMessage.innerHTML = `
        <div class="spinner-border text-primary my-3" role="status">
            <span class="visually-hidden">A carregar...</span>
        </div>
        <p class="text-muted">A carregar o conteúdo...</p>
    `;
}

// Função auxiliar: Exibir mensagem de erro com botão para tentar novamente
function showError(message, retryCallback) {
    catalogGrid.innerHTML = '';
    statusMessage.innerHTML = `
        <div class="alert alert-danger" role="alert">
            ${message}
        </div>
        <button id="retry-btn" class="btn btn-primary">Tentar Novamente</button>
    `;
    
    document.getElementById('retry-btn').addEventListener('click', () => {
        retryCallback();
    });
}