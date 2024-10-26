// rev.2

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
        const valorElement1 = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[3]/div[2]/vaadin-form-layout/div[3]/div/label[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        const valorElement2 = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]/div[4]/div[2]/vaadin-form-layout/div[3]/div/label[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        let valores = [];
        if (valorElement1 && isNumeric(valorElement1.textContent.trim())) {
            valores.push(valorElement1.textContent.trim());
        }
        if (valorElement2 && isNumeric(valorElement2.textContent.trim())) {
            valores.push(valorElement2.textContent.trim());
        }

        const tituloElement = document.querySelector("body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5");

        if (tituloElement && valores.length > 0) {
            const novoTitulo = `Inteiro Teor Matrícula nº ${valores.join(', ')}`;
            if (tituloElement.textContent !== novoTitulo) {
                tituloElement.textContent = novoTitulo; // Atualiza o texto do título
                tituloModificado = true; // Marca que o título foi modificado
                console.log("Título modificado:", novoTitulo); // Log para depuração
            }
        }
    }

    // Função para verificar se o título contém "Inteiro Teor de Matrícula"
    function titleContainsInteiroTeor() {
        const tituloElement = document.querySelector("body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5");
        return tituloElement && tituloElement.textContent.includes('Inteiro Teor de Matrícula');
    }

    // Função principal para verificar a URL
    function main() {
        if (window.location.href.includes('/pedido')) {
            console.log("URL contém '/pedido'."); // Log para depuração
            if (titleContainsInteiroTeor()) {
                modifyTitle(); // Chama a função para modificar o título
            } else {
                console.log("Título não contém 'Inteiro Teor de Matrícula'."); // Log para depuração
            }
        } else {
            abaDetalhesAcessada = false; // Reseta a variável quando não está na página de pedidos
            tituloModificado = false; // Reseta a variável de título modificado
        }
    }

    // Inicializa o script
    function init() {
        const observer = new MutationObserver(() => {
            main(); // Executa a função principal em mudanças
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
