// ==UserScript==
// @name           Ocultar elementos no mail.proton.me
// @namespace      Violentmonkey Scripts
// @match          *://*mail.proton.me/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=mail.proton.me
// @grant          GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Ocultar os elementos
    GM_addStyle('.topnav-list > li:nth-child(1) { display: none !important; }');
    GM_addStyle('.protonmail_signature_block-proton { display: none !important; }');
    GM_addStyle('li.topnav-listItem:nth-child(3) { display: none !important; }');
})();
