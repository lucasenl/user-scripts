// ==UserScript==
// @name         lumo
// @include      *://cidf.lumera.com.br/*
// @match        *://cidf.lumera.com.br/*
// @version      0.1
// ==/UserScript==

(function () {
    'use strict';

    let abaDetalhesAcessada = false; // Controle de acesso à aba "Detalhes"

    // Função para verificar se uma string é numérica
    function isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    // Função para modificar o título de acordo com as regras definidas
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

        const tituloElement = document.querySelector(
            'body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5'
        );

        if (tituloElement && valores.length > 0) {
            const tituloAtual = tituloElement.textContent.trim();
            const regexInteiroTeor = /Inteiro Teor de Matrícula\b/i;
            const regexOnusAlienacao = /Ônus e Alienação\b/i;
            const numeroMatricula = valores.join(', ');

            let novoTitulo;

            if (regexInteiroTeor.test(tituloAtual)) {
                novoTitulo = `${tituloAtual} nº ${numeroMatricula}`;
            } else if (regexOnusAlienacao.test(tituloAtual)) {
                novoTitulo = `${tituloAtual} matrícula nº ${numeroMatricula}`;
            } else {
                novoTitulo = tituloAtual; // Mantém o título inalterado se não corresponder aos padrões
            }

            if (tituloAtual !== novoTitulo) {
                tituloElement.textContent = novoTitulo;
            }
        }
    }

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab && !abaDetalhesAcessada) {
            detalhesTab.click(); // Clica na aba "Detalhes"
            abaDetalhesAcessada = true;

            setTimeout(() => {
                modifyTitle(); // Modifica o título após acessar a aba
                returnToInitialTab(); // Retorna à aba inicial após modificar o título
            }, 1000);
        }
    }

    // Função para retornar à aba inicial
    function returnToInitialTab() {
        const initialTab = document.querySelector(
            "body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)"
        );
        if (initialTab) {
            initialTab.click(); // Clica na aba inicial
        }
    }

    // Função principal
    function main() {
        if (window.location.href.includes('/pedido')) {
            checkDetalhesTab(); // Verifica se a aba "Detalhes" foi acessada
        } else {
            abaDetalhesAcessada = false; // Reseta a variável quando não está na página de pedidos
        }
    }

    // Inicializa o script
    function init() {
        const observer = new MutationObserver(() => {
            main(); // Executa a função principal em mudanças
        });

        // Observa o body para quaisquer mudanças
        observer.observe(document.body, { childList: true, subtree: true });

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
