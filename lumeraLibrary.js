// rev.-0.2

(function(global) {
    'use strict';

    const FIRST_LOAD_KEY = 'firstLoadPedido';
    let abaDetalhesAcessada = false;
    let tituloModificado = false;

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

        if (tituloElement && tituloElement.textContent.includes("Inteiro Teor de Matrícula") && valores.length > 0) {
            const tituloAtual = tituloElement.textContent;
            const novoTitulo = tituloAtual.replace(/Inteiro Teor de Matrícula/, `Inteiro Teor Matrícula nº ${valores.join(', ')}`);
            if (tituloAtual !== novoTitulo) {
                tituloElement.textContent = novoTitulo;
                tituloModificado = true;

                const andamentosTab = document.querySelector("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)");
                if (andamentosTab) {
                    andamentosTab.click();
                }
            }
        }
    }

    function fixTitle() {
        const tituloElement = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[1]/div/div[1]/h5',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (tituloElement && tituloElement.textContent.includes("Inteiro Teor de Matrícula") && tituloModificado) {
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

            const novoTitulo = `Inteiro Teor Matrícula nº ${valores.join(', ')}`;
            if (tituloElement.textContent !== novoTitulo) {
                tituloElement.textContent = novoTitulo;
            }
        }
    }

    function checkDetalhesTab() {
        const tituloElement = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[1]/div/div[1]/h5',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (tituloElement && tituloElement.textContent.includes("Inteiro Teor de Matrícula") && !abaDetalhesAcessada) {
            const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
            if (detalhesTab) {
                detalhesTab.click();
                abaDetalhesAcessada = true;

                setTimeout(() => {
                    modifyTitle();
                }, 1000);
            }
        }
    }

    function main() {
        if (window.location.href.includes('/pedido')) {
            const tituloElement = document.evaluate(
                '/html/body/div[2]/div[2]/div[2]/div[1]/div/div[1]/h5',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (!localStorage.getItem(FIRST_LOAD_KEY)) {
                if (tituloElement && tituloElement.textContent.includes("Inteiro Teor de Matrícula")) {
                    localStorage.setItem(FIRST_LOAD_KEY, 'true');
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                    return;
                }
            }
            checkDetalhesTab();
        } else {
            abaDetalhesAcessada = false;
            localStorage.removeItem(FIRST_LOAD_KEY);
            tituloModificado = false;
        }
    }

    function init() {
        main();

        const observer = new MutationObserver(() => {
            main();
            fixTitle();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('popstate', main);
        window.addEventListener('hashchange', main);
    }

    // Expondo a função init
    global.MyLibrary = {
        init,
    };

})(window);
