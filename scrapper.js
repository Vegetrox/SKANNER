/* ═══════════════════════════════════════════════════════════════
   SKANNER — scrapper.js
   Moteur de redirection vers les sites marchands
   + construction et rendu des cartes résultats
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── URLS DES MOTEURS ────────────────────────────────────────────────────────
/**
 * Pour chaque moteur, une fonction qui prend une query et retourne l'URL de recherche
 */
const ENG_URLS = {
  google:   q => `https://www.google.com/search?q=${encodeURIComponent(q)}`,
  amazon:   q => `https://www.amazon.fr/s?k=${encodeURIComponent(q)}`,
  ldlc:     q => `https://www.ldlc.com/recherche/${encodeURIComponent(q)}/`,
  materiel: q => `https://www.materiel.net/recherche/${encodeURIComponent(q)}/`,
  ebay:     q => `https://www.ebay.fr/sch/i.html?_nkw=${encodeURIComponent(q)}`,
  rdc:      q => `https://www.rueducommerce.fr/recherche?term=${encodeURIComponent(q)}`
};

// ─── MÉTADONNÉES DES SOURCES ─────────────────────────────────────────────────
/** Chaque source : nom affiché + couleur du point */
const SOURCES = [
  { n: 'GOOGLE SHOPPING', c: '#4285f4' },
  { n: 'AMAZON.FR',       c: '#ff9900' },
  { n: 'LDLC',            c: '#e63946' },
  { n: 'MATERIEL.NET',    c: '#00b4d8' },
  { n: 'EBAY.FR',         c: '#86bc25' },
  { n: 'RUE DU COMMERCE', c: '#9b5de5' },
];

/** Sous-titres des cartes */
const SUBTITLES = [
  'Prix &amp; stock',
  'Meilleur deal',
  'Test &amp; benchmark',
  'Reconditionné',
  'Top vente',
  'Financement'
];

/** Descriptions des cartes — fonctions prenant la query */
const CARD_DESCS = [
  q => `Comparez les offres en temps réel pour « ${q} ». Alertes de baisse de prix disponibles.`,
  q => `Stock disponible. Livraison 24 h. Garantie constructeur 3 ans. Retour 30 j gratuit.`,
  q => `Test complet : benchmarks, températures, consommation et rapport qualité/prix détaillé.`,
  q => `Version reconditionnée grade A certifiée. Économisez jusqu'à 40 % sur le prix neuf.`,
  q => `Meilleures ventes de la semaine. Noté 4,7 / 5 par plus de 3 200 acheteurs vérifiés.`,
  q => `Plusieurs configurations disponibles. Financement en 3× sans frais. Retrait magasin.`,
];

// ─── MÉTADONNÉES DES CATÉGORIES ──────────────────────────────────────────────
/**
 * Pour chaque catégorie : classe badge, label, dégradé ligne supérieure
 */
const CAT_META = {
  all:   { badge: 'b-all',   label: 'TECH',  grad: 'linear-gradient(90deg,transparent,#00e5ff,transparent)' },
  gpu:   { badge: 'b-gpu',   label: 'GPU',   grad: 'linear-gradient(90deg,transparent,#ff007f,transparent)' },
  ecran: { badge: 'b-ecran', label: 'ÉCRAN', grad: 'linear-gradient(90deg,transparent,#00ff99,transparent)' },
  ssd:   { badge: 'b-ssd',   label: 'SSD',   grad: 'linear-gradient(90deg,transparent,#ff6a00,transparent)' },
  cpu:   { badge: 'b-cpu',   label: 'CPU',   grad: 'linear-gradient(90deg,transparent,#ffe040,transparent)' },
};

// ─── UTILITAIRE : PRIX FICTIF ─────────────────────────────────────────────────
/**
 * Génère un prix fictif formaté en euros (pour démo visuelle)
 * En production : remplacer par un vrai fetch sur une API prix
 */
function fakePrix() {
  return (Math.floor(Math.random() * 900) + 99).toLocaleString('fr-FR') + ' €';
}

// ─── CONSTRUCTION D'UNE CARTE ─────────────────────────────────────────────────
/**
 * Retourne le HTML d'une carte résultat
 * @param {string} query    — terme de recherche brut
 * @param {string} fullQuery — query + mot-clé catégorie
 * @param {Object} src      — { n: nom, c: couleur }
 * @param {number} idx      — index (0-5)
 * @param {Object} meta     — CAT_META[cat]
 * @returns {string}
 */
function buildCard(query, fullQuery, src, idx, meta) {
  const delay = (idx * 0.07).toFixed(2);
  // On encode fullQuery pour l'attribut onclick inline
  const escaped = JSON.stringify(fullQuery);

  return `
    <div class="card"
         style="animation-delay:${delay}s"
         onclick="window.open(ENG_URLS[window._curEng](${escaped}), '_blank')">
      <div class="card-topline" style="--card-grad:${meta.grad}"></div>
      <div class="card-src" style="--sdot:${src.c}">
        <span class="src-dot"></span>${src.n}
      </div>
      <div class="card-title">${query} — ${SUBTITLES[idx]}</div>
      <div class="card-desc">${CARD_DESCS[idx](query)}</div>
      <div class="card-foot">
        <div class="card-price">${fakePrix()}</div>
        <span class="badge ${meta.badge}">${meta.label}</span>
      </div>
    </div>`;
}

// ─── RENDU DE LA GRILLE RÉSULTATS ────────────────────────────────────────────
/**
 * Injecte les cartes dans #grid et met à jour le compteur
 * @param {string} query    — terme saisi par l'utilisateur
 * @param {string} cat      — catégorie active (all/gpu/ecran/ssd/cpu)
 * @param {string} catKw    — mot-clé catégorie à préfixer
 */
function renderResults(query, cat, catKw) {
  const meta      = CAT_META[cat] || CAT_META.all;
  const fullQuery = catKw ? `${catKw} ${query}` : query;

  document.getElementById('rCount').textContent = SOURCES.length;

  document.getElementById('grid').innerHTML = SOURCES
    .map((src, i) => buildCard(query, fullQuery, src, i, meta))
    .join('');
}
