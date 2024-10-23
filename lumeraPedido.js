// lumeraPedido.js

(function(window) {
    'use strict';

    const FIRST_LOAD_KEY = 'firstLoadPedido'; 
    let abaDetalhesAcessada = false;

    function isNumeric(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

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

        if (tituloElement && valores.length > 0) {
            const tituloAtual = tituloElement.textContent;
            const novoTitulo = tituloAtual.replace(/Inteiro Teor de Matrícula/, `Inteiro Teor Matrícula nº ${valores.join(', ')}`);
            tituloElement.textContent = novoTitulo;
        }
    }

    function checkDetalhesTab() {
        const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
        if (detalhesTab && !abaDetalhesAcessada) {
            detalhesTab.click();
            abaDetalhesAcessada = true;

            setTimeout(modifyTitle, 1000);
        }
    }

    function main() {
        if (window.location.href.includes('/pedido')) {
            if (!localStorage.getItem(FIRST_LOAD_KEY)) {
                localStorage.setItem(FIRST_LOAD_KEY, 'true');
                setTimeout(() => {
                    location.reload();
                }, 500);
                return;
            }
            checkDetalhesTab();
        } else {
            abaDetalhesAcessada = false;
            localStorage.removeItem(FIRST_LOAD_KEY);
        }
    }

    function init() {
        main();

        const observer = new MutationObserver(() => {
            main();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', main);
        window.addEventListener('hashchange', main);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
