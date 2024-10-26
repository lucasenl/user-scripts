// ==UserScript==
// @name         Mover Elemento Após Detalhes
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  Move conteúdo de uma aba para outra após clicar em detalhes, removendo elementos ocultos
// @match        https://cidf.lumera.com.br/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.5/cash.min.js
// @downloadURL  https://raw.githubusercontent.com/lucsenl/userscript/refs/heads/beta/lumera-beta.user.js
// @updateURL    https://raw.githubusercontent.com/lucsenl/userscript/refs/heads/beta/lumera-beta.user.js
// ==/UserScript==

(function() {
    'use strict';

    let abaDetalhesAcessada = false; // Controle de acesso à aba "Detalhes"

    // Função para detectar o navegador
    function detectBrowser() {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Firefox") !== -1) {
            return "Firefox";
        } else if (userAgent.indexOf("Edg") !== -1 || userAgent.indexOf("Edge") !== -1) { // Edge
            return "Edge";
        } else if (userAgent.indexOf("Chrome") !== -1) {
            return "Chrome"; // Chrome
        }
        return "Other";
    }

    // Função para remover o estilo hidden
    function removeHiddenElement() {
        let hiddenElement;
        const browser = detectBrowser();

        if (browser === "Firefox") {
            hiddenElement = $("body > div:nth-child(6) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)");
        } else if (browser === "Chrome" || browser === "Edge") {
            hiddenElement = $("body > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(3)");
        }

        if (hiddenElement.length > 0) {
            hiddenElement.css({
                display: 'flex', // Muda para display: flex
                flexDirection: 'column', // Define a direção do flex
                visibility: 'visible', // Garante que o elemento é visível
                opacity: '1' // Garante que a opacidade é 1
            }).removeAttr('hidden'); // Remove o atributo hidden

            // Força a aplicação dos estilos
            hiddenElement[0].style.setProperty('display', 'flex', 'important');
            hiddenElement[0].style.setProperty('visibility', 'visible', 'important');
            hiddenElement[0].style.setProperty('opacity', '1', 'important');
        }
    }

    // Função para mover o conteúdo
    function moverConteudo() {
        const origem = $("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > div:nth-child(2)");
        const destino = $("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > div:nth-child(1)");

        if (origem.length > 0 && destino.length > 0) {
            destino.append(origem.children().first()); // Move o primeiro filho do conteúdo de origem para o destino
        }
    }

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const detalhesTab = $("vaadin-tab[aria-selected='false']:nth-child(2)"); // Seletor ajustado para Cash
        if (detalhesTab.length > 0 && !abaDetalhesAcessada) {
            detalhesTab[0].click(); // Clica na aba "Detalhes"
            abaDetalhesAcessada = true;

            setTimeout(() => {
                removeHiddenElement(); // Remove o estilo oculto
                moverConteudo(); // Move o conteúdo
                returnToAndamentosTab(); // Retorna à aba "Andamentos"
            }, 1000);
        }
    }

    // Função para retornar à aba "Andamentos"
    function returnToAndamentosTab() {
        const andamentosTab = $("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)");
        if (andamentosTab.length > 0) {
            andamentosTab[0].click(); // Clica na aba "Andamentos"
        }
    }

    // Função principal para verificar a URL
    function main() {
        if (window.location.href.includes('/pedido')) {
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
