(function() {
    'use strict';

    const FIRST_LOAD_KEY = 'firstLoadPedido'; // Chave para localStorage
    let abaDetalhesAcessada = false; // Controle de acesso à aba "Detalhes"
    let tituloModificado = false; // Controle se o título já foi modificado

    // Função para verificar se uma string é numérica
    function isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    // Função para modificar o título
    function modifyTitle() {
        const valorElement1 = getValorElement(3); // Pega valor do primeiro elemento
        const valorElement2 = getValorElement(4); // Pega valor do segundo elemento

        let valores = [];
        if (valorElement1) valores.push(valorElement1);
        if (valorElement2) valores.push(valorElement2);

        const tituloElement = document.querySelector("body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5");

        if (tituloElement && valores.length > 0) {
            const tituloAtual = tituloElement.textContent;
            const novoTitulo = tituloAtual.replace(/Inteiro Teor de Matrícula/, `Inteiro Teor Matrícula nº ${valores.join(', ')}`);
            if (tituloAtual !== novoTitulo) {
                tituloElement.textContent = novoTitulo; // Atualiza o texto do título
                tituloModificado = true; // Marca que o título foi modificado
                console.log("Título modificado:", novoTitulo); // Log para depuração
            }
        }
    }

    // Função para obter o valor de um elemento específico
    function getValorElement(index) {
        const valorElement = document.evaluate(
            `/html/body/div[2]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[${index}]/div[2]/vaadin-form-layout/div[3]/div/label[1]`,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        return valorElement && isNumeric(valorElement.textContent.trim()) ? valorElement.textContent.trim() : null;
    }

    // Função para reafirmar o título
    function fixTitle() {
        const valorElement1 = getValorElement(3); // Pega valor do primeiro elemento
        const valorElement2 = getValorElement(4); // Pega valor do segundo elemento

        let valores = [];
        if (valorElement1) valores.push(valorElement1);
        if (valorElement2) valores.push(valorElement2);

        const tituloElement = document.querySelector("body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5");
        if (tituloElement && tituloModificado) {
            const novoTitulo = `Inteiro Teor Matrícula nº ${valores.join(', ')}`;
            if (tituloElement.textContent !== novoTitulo) {
                tituloElement.textContent = novoTitulo; // Reafirma o título modificado
                console.log("Título reafirmado:", novoTitulo); // Log para depuração
            }
        }
    }

    // Função para verificar se o título contém "Inteiro Teor de Matrícula"
    function titleContainsInteiroTeor() {
        const tituloElement = document.querySelector("body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5");
        const contains = tituloElement && tituloElement.textContent.includes('Inteiro Teor de Matrícula');
        console.log("Título contém 'Inteiro Teor de Matrícula':", contains); // Log para depuração
        return contains;
    }

    // Função principal para verificar a URL
    function main() {
        if (window.location.href.includes('/pedido')) {
            console.log("URL contém '/pedido'."); // Log para depuração
            if (titleContainsInteiroTeor()) {
                if (!localStorage.getItem(FIRST_LOAD_KEY)) {
                    localStorage.setItem(FIRST_LOAD_KEY, 'true');
                    setTimeout(() => {
                        location.reload(); // Recarrega a página
                    }, 500); // Recarrega após meio segundo
                    return; // Interrompe a execução
                }
                modifyTitle(); // Modifica o título diretamente, sem clicar na aba
            } else {
                console.log("Título não contém 'Inteiro Teor de Matrícula'."); // Log para depuração
            }
        } else {
            abaDetalhesAcessada = false; // Reseta a variável quando não está na página de pedidos
            localStorage.removeItem(FIRST_LOAD_KEY); // Reseta a chave se sair da página
            tituloModificado = false; // Reseta a variável de título modificado
        }
    }

    // Inicializa o script
    function init() {
        const observer = new MutationObserver(() => {
            main(); // Executa a função principal em mudanças
            fixTitle(); // Reafirma o título se necessário
        });

        // Observa o body para quaisquer mudanças
        observer.observe(document.body, { childList: true, subtree: true });

        // Escuta eventos de histórico para mudanças de URL
        window.addEventListener('popstate', main);
        window.addEventListener('hashchange', main);

        // Executa a função principal inicialmente
        main();
    }

    // Aguarda o carregamento completo do body antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
