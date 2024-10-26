// rev.3

// atualizaTitulo.js
(function(global) {
    'use strict';

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

        const tituloElement = document.querySelector(
            'body > div.root > div.root__row > div.root__column > div.app-header-inner > div > div.app-bar__container > h5'
        );

        if (tituloElement && valores.length > 0) {
            const tituloAtual = tituloElement.textContent;
            const regex = /Matrícula\b(.*)$/i;

            const novoTitulo = regex.test(tituloAtual)
                ? tituloAtual.replace(regex, `Matrícula nº ${valores.join(', ')}`)
                : `${tituloAtual} nº ${valores.join(', ')}`;

            if (tituloAtual !== novoTitulo) {
                tituloElement.textContent = novoTitulo;
                console.log("Título modificado:", novoTitulo);
            }
        }
    }

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab && !abaDetalhesAcessada) {
            detalhesTab.click();
            abaDetalhesAcessada = true;

            setTimeout(() => {
                modifyTitle();
                returnToInitialTab();
            }, 1000);
            console.log("Aba 'Detalhes' acessada.");
        }
    }

    // Função para retornar à aba inicial
    function returnToInitialTab() {
        const initialTab = document.querySelector(
            "body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)"
        );
        if (initialTab) {
            initialTab.click();
            console.log("Retornou à aba inicial.");
        }
    }

    // Função principal
    function main() {
        if (window.location.href.includes('/pedido')) {
            console.log("URL contém '/pedido'.");
            checkDetalhesTab();
        } else {
            abaDetalhesAcessada = false;
        }
    }

    // Inicializa o script
    function init() {
        const observer = new MutationObserver(() => {
            main();
        });

        observer.observe(document.body, { childList: true, subtree: true });
        main();
    }

    // Aguarda o carregamento completo do body antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expondo a função para ser utilizada em outros scripts
    global.atualizaTituloMatricula = {
        init: init
    };

})(window);
