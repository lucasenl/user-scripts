(function() {
    'use strict';

    const LumeraLibrary = {
        FIRST_LOAD_KEY: 'firstLoadPedido',
        abaDetalhesAcessada: false,

        isNumeric(value) {
            return !isNaN(value) && !isNaN(parseFloat(value));
        },

        modifyTitle() {
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
            if (valorElement1 && this.isNumeric(valorElement1.textContent.trim())) {
                valores.push(valorElement1.textContent.trim());
            }
            if (valorElement2 && this.isNumeric(valorElement2.textContent.trim())) {
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
                const novoTitulo = `Inteiro Teor Matrícula nº ${valores.join(', ')}`;
                if (tituloAtual.includes("Inteiro Teor de Matrícula")) {
                    tituloElement.textContent = tituloAtual.replace(/Inteiro Teor de Matrícula/, novoTitulo);
                } else {
                    tituloElement.textContent = `${tituloAtual} - ${novoTitulo}`;
                }
            }
        },

        checkDetalhesTab() {
            const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
            if (detalhesTab && !this.abaDetalhesAcessada) {
                detalhesTab.click();
                this.abaDetalhesAcessada = true;

                setTimeout(() => {
                    this.modifyTitle();
                }, 1000);
            }
        },

        main() {
            if (window.location.href.includes('/pedido') && document.body.textContent.includes("Inteiro Teor")) {
                if (!localStorage.getItem(this.FIRST_LOAD_KEY)) {
                    localStorage.setItem(this.FIRST_LOAD_KEY, 'true');
                }
                this.checkDetalhesTab();
            } else {
                this.abaDetalhesAcessada = false;
                localStorage.removeItem(this.FIRST_LOAD_KEY);
            }
        },

        init() {
            this.main();

            const observer = new MutationObserver(() => {
                this.main();
            });
            observer.observe(document.body, { childList: true, subtree: true });

            window.addEventListener('popstate', () => this.main());
            window.addEventListener('hashchange', () => this.main());
        }
    };

    // Aguarda o carregamento completo do body antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LumeraLibrary.init());
    } else {
        LumeraLibrary.init();
    }

    // Expor a biblioteca
    window.LumeraLibrary = LumeraLibrary;

})();
