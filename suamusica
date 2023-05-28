// ==UserScript==
// @name           Esconder Elementos no Suamusica
// @namespace      Violentmonkey Scripts
// @match          *://suamusica.com.br/*
// @match          *://www.suamusica.com.br/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=suamusica.com.br
// @grant          GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Esconde a seção "Perfis sugeridos" e elementos relacionados
    GM_addStyle(`
        div.styles_listProfilesContainer__ij3sz.styles_isSuggestion__0Qyw3 {
            display: none !important;
        }
    `);

    // Esconde o elemento div.styles_stickyBanner__5kc4Y:nth-child(1)
    GM_addStyle(`
        div.styles_stickyBanner__5kc4Y:nth-child(1) {
            display: none !important;
        }
    `);

    // Esconde o elemento #Suamusica\.com\.br-ROS-Top-Leaderboard-34
    GM_addStyle(`
        #Suamusica\\.com\\.br-ROS-Top-Leaderboard-34 {
            display: none !important;
        }
    `);

    // Esconde o elemento div.styles_ArtistVideoContainer__8rSwY:nth-child(2)
    GM_addStyle(`
        div.styles_ArtistVideoContainer__8rSwY:nth-child(2) {
            display: none !important;
        }
    `);

    // Esconde o elemento div.row:nth-child(3)
    GM_addStyle(`
        div.row:nth-child(3) {
            display: none !important;
        }
    `);

    // Esconde o elemento div.styles_contentSectionContainer__Jy3m2:nth-child(4)
    GM_addStyle(`
        div.styles_contentSectionContainer__Jy3m2:nth-child(4) {
            display: none !important;
        }
    `);

    // Esconde o elemento .styles_sidebar__eDbOf
    GM_addStyle(`
        .styles_sidebar__eDbOf {
            display: none !important;
        }
    `);

    // Oculta todos os elementos com a classe div.styles_listProfilesContainer__ij3sz
    const listProfilesElements = document.querySelectorAll("div.styles_listProfilesContainer__ij3sz");
    listProfilesElements.forEach((element, index) => {
        if (index !== 0) {
            element.style.display = "none";
        }
    });
})();
