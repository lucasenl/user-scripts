// rev.-0.1

(function() {
    'use strict';

    const FIRST_LOAD_KEY = 'firstLoadPedido'; // Chave para localStorage
    let abaDetalhesAcessada = false; // Controle de acesso à aba "Detalhes"
    let tituloModificado = false; // Controle se o título já foi modificado

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

        // Verifica se o título contém "Inteiro Teor de Matrícula"
        if (tituloElement && tituloElement.textContent.includes("Inteiro Teor de Matrícula") && valores.length > 0) {
            const tituloAtual = tituloElement.textContent;
            const novoTitulo = tituloAtual.replace(/Inteiro Teor de Matrícula/, `Inteiro Teor Matrícula nº ${valores.join(', ')}`);
            if (tituloAtual !== novoTitulo) {
                tituloElement.textContent = novoTitulo; // Atualiza o texto do título
                tituloModificado = true; // Marca que o título foi modificado

                // Volta para a aba "Andamentos"
                const andamentosTab = document.querySelector("body > div.root > div.root__row > div.root__column > div.root__view-container > div > div.view-frame__content > div > vaadin-tabs > vaadin-tab:nth-child(1)");
                if (andamentosTab) {
                    andamentosTab.click(); // Clica na aba "Andamentos"
                }
            }
        }
    }

    // Função para fixar o título se necessário
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
                tituloElement.textContent = novoTitulo; // Reafirma o título modificado
            }
        }
    }

    // Função para verificar quando a aba "Detalhes" foi acessada
    function checkDetalhesTab() {
        const tituloElement = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[1]/div/div[1]/h5',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        // Verifica se o título contém "Inteiro Teor de Matrícula" antes de clicar na aba "Detalhes"
        if (tituloElement && tituloElement.textContent.includes("Inteiro Teor de Matrícula") && !abaDetalhesAcessada) {
            const detalhesTab = document.querySelector('vaadin-tab[aria-selected="false"]:nth-child(2)');
            if (detalhesTab) {
                detalhesTab.click(); // Clica na aba "Detalhes"
                abaDetalhesAcessada = true;

                setTimeout(() => {
                    modifyTitle(); // Modifica o título após clicar
                }, 1000);
            }
        }
    }

    // Função principal para verificar a URL
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
                        location.reload(); // Recarrega a página se o título estiver correto
                    }, 500); // Recarrega após meio segundo
                    return; // Interrompe a execução
                }
            }
            checkDetalhesTab();
        } else {
            abaDetalhesAcessada = false; // Reseta a variável quando não está na página de pedidos
            localStorage.removeItem(FIRST_LOAD_KEY); // Reseta a chave se sair da página
            tituloModificado = false; // Reseta a variável de título modificado
        }
    }

    // Inicializa o script
    function init() {
        main();

        // Observa mudanças no DOM
        const observer = new MutationObserver(() => {
            main(); // Executa a função principal em mudanças
            fixTitle(); // Reafirma o título se necessário
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
