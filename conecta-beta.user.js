// ==UserScript==
// @name          Tweaks Lumera (BETA)
// @version       0.1-BETA
// @namespace     lucsenl
// @description   Small adjustments to the CEC/RN.
// @author        lucsenl
// @include       *://cidf.lumera.com.br/*
// @match         *://cidf.lumera.com.br/*
// @run-at        document-end
// @grant         GM_addStyle
// @inject-into   page
// @icon          https://s3.amazonaws.com/movidesk-files/B71B720D3B852CFC60CDED5090E658E3
// @license       0BSD
// @copyright     2024, lucsenl
// @downloadURL   https://raw.githubusercontent.com/lucsenl/userscript/refs/heads/master/conecta-beta.user.js
// @updateURL     https://raw.githubusercontent.com/lucsenl/userscript/refs/heads/master/conecta-beta.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Adiciona as variáveis CSS
    GM_addStyle(`
        :root {
            --lumo-size-xl: 3.0rem;
            --lumo-size-m: 2.1rem;
            --lumo-space-s: 0.0rem;
            --transition-duration-s: 0.5ms;
            --transition-duration-m: 0.5ms;
            --transition-duration-l: 0.5ms;
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

    let abaDetalhesAcessada = false; // Variável para controlar o acesso à aba "Detalhes"

    // Função para verificar se uma string é numérica
    function isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    // Função para selecionar a aba "Detalhes", obter valores e modificar o título
    function selectTabAndModifyTitle() {
        if (abaDetalhesAcessada) return; // Se já acessou a aba, sai da função

        // Seleciona a aba "Detalhes"
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab) {
            detalhesTab.click(); // Simula um clique na aba
            abaDetalhesAcessada = true; // Marca a aba como acessada

            // Espera um pouco para garantir que o conteúdo da aba esteja carregado
            setTimeout(() => {
                // Seleciona os elementos que contêm os valores desejados
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

                // Obtém os valores e verifica se são numéricos
                let valores = [];
                if (valorElement1 && isNumeric(valorElement1.textContent.trim())) {
                    valores.push(valorElement1.textContent.trim());
                }
                if (valorElement2 && isNumeric(valorElement2.textContent.trim())) {
                    valores.push(valorElement2.textContent.trim());
                }

                // Seleciona o elemento do título
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
            }, 500); // Espera 500ms para garantir que o conteúdo esteja carregado
        }
    }

    // Função para ocultar elementos
    function hideElements() {
        const hideSelectors = [
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(1) > div > label:nth-child(3)",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(2) > div > label:nth-child(3)",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(3) > div > label:nth-child(3)",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(4) > div > label:nth-child(3)",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(5) > div > label:nth-child(3)",
            "#gridPedidos > vaadin-grid-cell-content:nth-child(261) > vaadin-grid-sorter"
        ];

        hideSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && !element.dataset.tweaksLumeraHidden) {
                element.style.display = 'none';
                element.dataset.tweaksLumeraHidden = 'true'; // Marca como ocultado
            }
        });
    }

    // Função para aplicar estilos
    function applyStyles() {
        const tabSelectors = [
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(1) > div",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(2) > div",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(3) > div",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(4) > div",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(5) > div"
        ];

        tabSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (!element.dataset.tweaksLumeraStyled) {
                    element.style.flexDirection = 'row';
                    element.style.width = '280px';
                    const labels = element.querySelectorAll('label');
                    labels.forEach(label => {
                        label.style.marginRight = '8px';
                    });
                    element.dataset.tweaksLumeraStyled = 'true'; // Marca como estilizado
                }
            });
        });

        // Ajusta a largura da classe .navi-drawer__content
        const drawerElement = document.querySelector('.navi-drawer__content');
        if (drawerElement && !drawerElement.dataset.tweaksLumeraDrawer) {
            drawerElement.style.width = '170px';
            drawerElement.dataset.tweaksLumeraDrawer = 'true';
        }

        // Adiciona margin-left ao vaadin-radio-group
        const radioGroup = document.querySelector("vaadin-radio-group");
        if (radioGroup && !radioGroup.dataset.tweaksLumeraRadio) {
            radioGroup.style.marginLeft = '10px';
            radioGroup.dataset.tweaksLumeraRadio = 'true';
        }

        // Adiciona margin-left ao botão específico
        const button = document.querySelector("#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(3) > div.spacing-r-m > vaadin-button:nth-child(7)");
        if (button && !button.dataset.tweaksLumeraButton) {
            button.style.marginLeft = '10px';
            button.dataset.tweaksLumeraButton = 'true';
        }

        // Ajusta a altura dos inputs e botões
        const inputsToAdjust = [
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(3) > div.spacing-r-m > vaadin-select",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(3) > div.spacing-r-m > vaadin-text-field",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(3) > div.spacing-r-m > vaadin-combo-box:nth-child(5)",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(3) > div.spacing-r-m > vaadin-button:nth-child(7)",
            "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(3) > div.spacing-r-m > vaadin-button:nth-child(8)"
        ];

        inputsToAdjust.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && element.shadowRoot) {
                let input;
                if (selector.includes('vaadin-select')) {
                    input = element.shadowRoot.querySelector("vaadin-select-text-field").shadowRoot.querySelector("#vaadin-select-text-field-input-1");
                } else if (selector.includes('vaadin-text-field')) {
                    input = element.shadowRoot.querySelector("#vaadin-text-field-input-2");
                } else if (selector.includes('vaadin-combo-box')) {
                    input = element.shadowRoot.querySelector("#input").shadowRoot.querySelector("#vaadin-text-field-input-4");
                } else {
                    input = element; // Para os botões, não é necessário procurar o input
                }
                if (input) {
                    input.style.height = '35px';
                }
            }
        });
    }

    // Função para alterar o texto
    function changeText() {
        const textUpdates = [
            { selector: "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(1) > div > label:nth-child(2)", newText: 'Pedidos em aberto' },
            { selector: "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(2) > div > label:nth-child(2)", newText: 'Fora do prazo' },
            { selector: "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(3) > div > label:nth-child(2)", newText: 'Aguardando interação' },
            { selector: "#inbox-view > div.view-frame__wrapper > div.view-frame__content > div > div:nth-child(2) > vaadin-tabs > vaadin-tab:nth-child(4) > div > label:nth-child(2)", newText: 'Aguardando o solicitante' },
            { selector: "body > div.root > div.root__row > div.navi-drawer > div.navi-drawer__content > div.navi-drawer__scroll-area > div > div:nth-child(7) > a > label", newText: 'Detran' }
        ];

        textUpdates.forEach(({ selector, newText }) => {
            const element = document.querySelector(selector);
            if (element && element.textContent !== newText) {
                element.textContent = newText;
            }
        });
    }

    // Função principal que aplica estilos, oculta elementos e altera texto
    function main() {
        hideElements();
        applyStyles();
        changeText();
        checkUrl(); // Verifica a URL para modificar o título
    }

    // Função para verificar se a URL é a desejada
    function checkUrl() {
        if (window.location.href.includes('/pedido')) {
            selectTabAndModifyTitle();
        } else {
            abaDetalhesAcessada = false; // Reseta a variável ao sair da página de pedido
        }
    }

    // Inicializa o script
    function init() {
        main();

        // Configura o MutationObserver
        const observer = new MutationObserver((mutations) => {
            let shouldRun = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length || mutation.type === 'attributes') {
                    shouldRun = true;
                    break;
                }
            }
            if (shouldRun) {
                main();
            }
        });

        // Começa a observar mudanças no body
        observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }

    // Aguarda o carregamento completo do body antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
