// rev. fix title

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
            const tituloAtual = tituloElement.textContent;
            const novoTitulo = tituloAtual.replace(/Inteiro Teor de Matrícula/, `Inteiro Teor Matrícula nº ${valores.join(', ')}`);
            if (tituloAtual !== novoTitulo) {
                tituloElement.textContent = novoTitulo; // Atualiza o texto do título
                tituloModificado = true; // Marca que o título foi modificado
                console.log("Título modificado:", novoTitulo); // Log para depuração
            }
        }
    }

    // Função para reafirmar o título
    function fixTitle() {
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

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab && !abaDetalhesAcessada) {
            detalhesTab.click(); // Clica na aba "Detalhes"
            abaDetalhesAcessada = true;

            setTimeout(() => {
                modifyTitle(); // Modifica o título
                returnToInitialTab(); // Retorna à aba inicial após modificar o título
            }, 1000);
            console.log("Aba 'Detalhes' acessada."); // Log para depuração
        }
    }

    // Função para retornar à aba inicial
    function returnToInitialTab() {
        const initialTab = document.querySelector("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)");
        if (initialTab) {
            initialTab.click(); // Clica na aba inicial
            console.log("Retornou à aba inicial."); // Log para depuração
        }
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
                checkDetalhesTab();
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
