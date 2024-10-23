// ==UserScript==
// @name          Pedido Lumera (BETA)
// @version       0.3
// @namespace     lucsenl
// @description   Script específico para ajuste de título na aba "Pedido".
// @author        lucsenl
// @include       *://cidf.lumera.com.br/*
// @match         *://cidf.lumera.com.br/*
// @grant         none
// @inject-into   page
// @run-at        document-idle
// @license       0BSD
// ==/UserScript==

(function() {
    'use strict';

    const FIRST_LOAD_KEY = 'firstLoadPedido'; // Chave para localStorage
    let abaDetalhesAcessada = false; // Controle de acesso à aba "Detalhes"

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

        const tituloElement = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[1]/div/div[1]/h5',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        // Verifica se o título foi encontrado e faz a substituição
        if (tituloElement && valores.length > 0) {
            const tituloAtual = tituloElement.textContent;
            const novoTitulo = tituloAtual.replace(/Inteiro Teor de Matrícula/, `Inteiro Teor Matrícula nº ${valores.join(', ')}`);
            tituloElement.textContent = novoTitulo; // Atualiza o texto do título
        }
    }

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab && !abaDetalhesAcessada) {
            detalhesTab.click(); // Clica na aba "Detalhes"
            abaDetalhesAcessada = true;

            setTimeout(() => {
                modifyTitle(); // Modifica o título
            }, 1000);
        }
    }

    // Função principal para verificar a URL
    function main() {
        if (window.location.href.includes('/pedido')) {
            if (!localStorage.getItem(FIRST_LOAD_KEY)) {
                localStorage.setItem(FIRST_LOAD_KEY, 'true');
                location.reload(); // Recarrega a página
                return; // Interrompe a execução
            }
            checkDetalhesTab();
        } else {
            abaDetalhesAcessada = false; // Reseta a variável quando não está na página de pedidos
        }
    }

    // Inicializa o script
    function init() {
        main();

        // Observa mudanças no DOM
        const observer = new MutationObserver(() => {
            main(); // Executa a função principal em mudanças
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Escuta eventos de histórico para mudanças de URL
        window.addEventListener('popstate', main);
        window.addEventListener('hashchange', main);
    }

    // Aguarda o carregamento completo do body antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
