/* ═══════════════════════════════════════════════════════════════
   SKANNER — script.js
   Logique principale : état global, catégories, quick tags,
   sélection moteur, lancement de recherche
   Dépend de : scrapper.js (ENG_URLS, renderResults)
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── ÉTAT GLOBAL ─────────────────────────────────────────────────────────────
/**
 * curEng  → moteur sélectionné (clé dans ENG_URLS)
 * curKw   → mot-clé catégorie préfixé à la recherche
 * curCat  → identifiant catégorie active
 *
 * Exposé sur window pour que les onclick inline de scrapper.js
 * puissent y accéder (window._curEng).
 */
let curEng = 'google';
let curKw  = '';
let curCat = 'all';

// Expose pour scrapper.js
window._curEng = curEng;

// ─── QUICK TAGS DATA ──────────────────────────────────────────────────────────
/**
 * Suggestions rapides par catégorie
 * Mis à jour à chaque changement de catégorie
 */
const TAGS = {
  all: [
    'RTX 4090', 'RX 7900 XTX', 'Samsung 4K 27"',
    'SSD 2 To', 'Ryzen 9 7950X', 'i9-14900K', 'LG OLED', 'NVMe Gen5'
  ],
  gpu: [
    'RTX 4090', 'RTX 4080 Super', 'RX 7900 XTX',
    'RTX 4070 Ti Super', 'Arc B580', 'RTX 3090 Ti occas.',
    'RX 7800 XT', 'RTX 4060 Ti 16Go'
  ],
  ecran: [
    'Dell U2724D', 'LG OLED 27" 4K', 'Samsung G7 32"',
    'ASUS ROG Swift 4K', 'BenQ EX3210R', 'Gigabyte M32U',
    'Samsung Odyssey G9', 'AOC U27G3X'
  ],
  ssd: [
    'Samsung 990 Pro 2To', 'WD Black SN850X', 'Crucial T700 2To',
    'Kingston Fury Renegade', 'Seagate IronWolf 4To',
    'WD Red Pro 6To', 'Samsung 870 EVO 4To', 'Corsair MP600 Pro XT'
  ],
  cpu: [
    'Ryzen 9 9950X', 'Intel i9-14900K', 'Ryzen 7 9800X3D',
    'Intel i7-14700K', 'Ryzen 5 9600X', 'Intel i5-14600K',
    'Ryzen 9 7900X3D', 'Intel Core Ultra 9'
  ]
};

// ─── QUICK TAGS : RENDU ───────────────────────────────────────────────────────
/**
 * Injecte les quick-tags dans #qtags selon la catégorie
 * @param {string} cat
 */
function buildTags(cat) {
  const list = TAGS[cat] || TAGS.all;
  document.getElementById('qtags').innerHTML = list
    .map(t => `<span class="qtag" onclick="quickSearch(${JSON.stringify(t)})">${t}</span>`)
    .join('');
}

/**
 * Pré-remplit le champ et lance la recherche
 * @param {string} term
 */
function quickSearch(term) {
  document.getElementById('q').value = term;
  doSearch();
}

// ─── SÉLECTION MOTEUR ────────────────────────────────────────────────────────
/**
 * @param {HTMLElement} btn — bouton .eng cliqué
 */
function pickEng(btn) {
  document.querySelectorAll('.eng').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  curEng = btn.dataset.e;
  window._curEng = curEng; // sync pour scrapper.js
}

// ─── SÉLECTION CATÉGORIE ─────────────────────────────────────────────────────
/**
 * @param {HTMLElement} btn — bouton .cat cliqué
 */
function pickCat(btn) {
  document.querySelectorAll('.cat').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  curKw  = btn.dataset.kw;
  curCat = btn.dataset.c;
  buildTags(curCat);
}

// ─── LANCEMENT RECHERCHE ─────────────────────────────────────────────────────
/**
 * Ouvre le moteur dans un nouvel onglet
 * puis affiche les cartes résultats (démo)
 */
function doSearch() {
  const raw = document.getElementById('q').value.trim();
  if (!raw) return;

  // URL finale avec mot-clé catégorie si présent
  const fullQuery = curKw ? `${curKw} ${raw}` : raw;
  window.open(ENG_URLS[curEng](fullQuery), '_blank');

  // Affichage des cartes
  renderResults(raw, curCat, curKw);
}

// ─── CLAVIER ─────────────────────────────────────────────────────────────────
document.getElementById('q').addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch();
});

// ─── INIT ────────────────────────────────────────────────────────────────────
buildTags('all');
