// ==UserScript==
// @name         Tweaks Lumera Beta
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Move conteúdo de uma aba para outra após clicar em detalhes, removendo elementos ocultos
// @match        https://cidf.lumera.com.br/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let abaDetalhesAcessada = false; // Controle de acesso à aba "Detalhes"

    // Função para remover o estilo hidden
    function removeHiddenElement() {
        let hiddenElement;
        // Checa se está no Firefox ou Chrome
        if (navigator.userAgent.indexOf("Firefox") !== -1) {
            hiddenElement = document.evaluate(
                '/html/body/div[5]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
        } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
            hiddenElement = document.evaluate(
                '/html/body/div[2]/div[2]/div[2]/div[2]/div/div[2]/div/div[2]',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
        }

        if (hiddenElement) {
            hiddenElement.style.display = 'flex'; // Muda para display: flex
            hiddenElement.style.flexDirection = 'column'; // Define a direção do flex
            hiddenElement.style.visibility = 'visible'; // Garante que o elemento é visível
            hiddenElement.style.opacity = '1'; // Garante que a opacidade é 1
            hiddenElement.removeAttribute('hidden'); // Remove o atributo hidden

            // Força a aplicação dos estilos
            hiddenElement.style.setProperty('display', 'flex', 'important');
            hiddenElement.style.setProperty('visibility', 'visible', 'important');
            hiddenElement.style.setProperty('opacity', '1', 'important');

            console.log("Elemento oculto agora visível com flex-direction: column.");
        }
    }

    // Função para mover o conteúdo
    function moverConteudo() {
        const origem = document.querySelector("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > div:nth-child(2)");
        const destino = document.querySelector("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > div:nth-child(1)");

        if (origem && destino) {
            destino.appendChild(origem.firstChild); // Move o primeiro filho do conteúdo de origem para o destino
            console.log("Conteúdo movido de 'Detalhes' para 'Andamentos'.");
        }
    }

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab && !abaDetalhesAcessada) {
            detalhesTab.click(); // Clica na aba "Detalhes"
            abaDetalhesAcessada = true;

            setTimeout(() => {
                removeHiddenElement(); // Remove o estilo oculto
                moverConteudo(); // Move o conteúdo
                returnToAndamentosTab(); // Retorna à aba "Andamentos"
            }, 1000);
            console.log("Aba 'Detalhes' acessada."); // Log para depuração
        }
    }

    // Função para retornar à aba "Andamentos"
    function returnToAndamentosTab() {
        const andamentosTab = document.querySelector("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)"); // Ajuste conforme necessário
        if (andamentosTab) {
            andamentosTab.click(); // Clica na aba "Andamentos"
            console.log("Retornou à aba 'Andamentos'."); // Log para depuração
        }
    }

    // Função principal para verificar a URL
    function main() {
        if (window.location.href.includes('/pedido')) {
            console.log("URL contém '/pedido'."); // Log para depuração
            checkDetalhesTab();
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
