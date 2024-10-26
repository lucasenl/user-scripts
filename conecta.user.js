// ==UserScript==
// @name          Tweaks Lumera BETA
// @version       0.0.1
// @namespace     lucsenl
// @description   Small adjustments to the CEC/RN.
// @author        lucsenl
// @include       *://cidf.lumera.com.br/*
// @match         *://cidf.lumera.com.br/*
// @run-at        document-end
// @grant         GM_addStyle
// @inject-into   page
// @require       https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.5/cash.min.js
// @icon          https://s3.amazonaws.com/movidesk-files/B71B720D3B852CFC60CDED5090E658E3
// @license       0BSD
// @copyright     2024, lucsenl
// @updateURL     https://gitlab.com/lucsenl/userscript/-/raw/main/conecta.user.js
// @downloadURL   https://gitlab.com/lucsenl/userscript/-/raw/main/conecta.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Adiciona variáveis CSS
    GM_addStyle(`
        :root {
            --lumo-size-xl: 3.0rem;
            --lumo-size-m: 2.1rem;
            --lumo-space-s: 0.0rem;
            --transition-duration-s: 0ms;
            --transition-duration-m: 0ms;
            --transition-duration-l: 0ms;
        }
        body[theme~="dark"] {
            --lumo-primary-text-color: hsl(216, 92%, 66%);
            --lumo-primary-color-50pct: hsla(216, 92%, 66%, 0.5);
            --lumo-primary-color-10pct: hsla(216, 92%, 66%, 0.1);
            --lumo-primary-color: hsl(216, 92%, 66%);
            --lumo-base-color: hsl(240, 21%, 15%);
            --lumo-border-radius: 0.9em;
        }
    `);

    const hideSelectors = [
        "vaadin-tabs > vaadin-tab:nth-child(1) > div > label:nth-child(3)",
        "vaadin-tabs > vaadin-tab:nth-child(2) > div > label:nth-child(3)",
        "vaadin-tabs > vaadin-tab:nth-child(3) > div > label:nth-child(3)",
        "vaadin-tabs > vaadin-tab:nth-child(4) > div > label:nth-child(3)",
        "vaadin-tabs > vaadin-tab:nth-child(5) > div > label:nth-child(3)",
        "#gridPedidos > vaadin-grid-cell-content:nth-child(261) > vaadin-grid-sorter"
    ];

    const tabSelectors = [
        "vaadin-tabs > vaadin-tab:nth-child(1) > div",
        "vaadin-tabs > vaadin-tab:nth-child(2) > div",
        "vaadin-tabs > vaadin-tab:nth-child(3) > div",
        "vaadin-tabs > vaadin-tab:nth-child(4) > div",
        "vaadin-tabs > vaadin-tab:nth-child(5) > div"
    ];

    const textUpdates = [
        { selector: "vaadin-tabs > vaadin-tab:nth-child(1) > div > label:nth-child(2)", newText: 'Pedidos em aberto' },
        { selector: "vaadin-tabs > vaadin-tab:nth-child(2) > div > label:nth-child(2)", newText: 'Fora do prazo' },
        { selector: "vaadin-tabs > vaadin-tab:nth-child(3) > div > label:nth-child(2)", newText: 'Aguardando interação' },
        { selector: "vaadin-tabs > vaadin-tab:nth-child(4) > div > label:nth-child(2)", newText: 'Aguardando o solicitante' },
        { selector: "body > div.root > div.root__row > div.navi-drawer > div.navi-drawer__content > div.navi-drawer__scroll-area > div > div:nth-child(7) > a > label", newText: 'Detran' }
    ];

    // Função para ocultar elementos
    function hideElements() {
        hideSelectors.forEach(selector => {
            const element = $(selector);
            if (element.length && !element.data('hidden')) {
                element.hide();
                element.data('hidden', true);
                console.log(`Ocultado: ${selector}`);
            }
        });
    }

    // Função para aplicar estilos
    function applyStyles() {
        tabSelectors.forEach(selector => {
            const elements = $(selector);
            elements.each((_, el) => {
                const $el = $(el);
                if (!$el.data('styled')) {
                    $el.css({ flexDirection: 'row', width: '280px' });
                    $el.find('label').css('marginRight', '8px');
                    $el.data('styled', true);
                    console.log(`Estilo aplicado: ${selector}`);
                }
            });
        });

        const drawer = $('.navi-drawer__content');
        if (drawer.length && !drawer.data('styled')) {
            drawer.css('width', '170px');
            drawer.data('styled', true);
            console.log('Estilo aplicado ao drawer');
        }

        const radioGroup = $('vaadin-radio-group');
        if (radioGroup.length && !radioGroup.data('styled')) {
            radioGroup.css('marginLeft', '10px');
            radioGroup.data('styled', true);
            console.log('Estilo aplicado ao radio group');
        }

        const applyButton = $(`vaadin-button[aria-label="Aplicar"]`);
        if (applyButton.length && !applyButton.data('styled')) {
            applyButton.css('marginLeft', '0px');
            applyButton.data('styled', true);
            console.log('Estilo aplicado ao botão Aplicar');
        }
    }

    // Função para alterar texto
    function changeText() {
        textUpdates.forEach(({ selector, newText }) => {
            const element = $(selector);
            if (element.length && element.text() !== newText) {
                element.text(newText);
                console.log(`Texto alterado em: ${selector} para "${newText}"`);
            }
        });
    }

    // Função principal que aplica estilos, oculta elementos e altera texto
    function main() {
        hideElements();
        applyStyles();
        changeText();
    }

    // Inicializa o script
    function init() {
        main();

        // MutationObserver para alterações no DOM
        const observer = new MutationObserver(() => main());
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    // Aguarda o carregamento completo do body antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
