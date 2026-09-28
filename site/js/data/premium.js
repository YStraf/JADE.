// Offres payantes (prix TTC). Les Jade Coins ne s'achètent jamais, ni directement ni via une offre,
// et aucune offre ne donne de caisse : on paie uniquement pour des fonctions et des cosmétiques connus d'avance.
export const OFFERS = {
  plus_m: { kind: 'sub', cycle: 'month', price: 4.99, days: 30 },
  plus_y: { kind: 'sub', cycle: 'year', price: 39.99, days: 365 },
  founder: { kind: 'once', price: 14.99, plusDays: 90, items: ['frame:founder', 'banner:founder', 'title:founder'] },
};
// Liens de paiement Stripe (Payment Links) : à renseigner quand le compte Stripe est prêt. Vide = paiement fermé.
// Stripe renvoie client_reference_id = identifiant du compte ; l'activation sera confirmée par le serveur (webhook).
export const PAY_LINKS = { plus_m: '', plus_y: '', founder: '' };
export const PORTAL_LINK = ''; // Portail client Stripe : gérer le moyen de paiement, résilier.
export const LIMITS = { free: 16, plus: 24 };
export const PLUS_ITEMS = ['frame:plus', 'banner:plus', 'title:plus'];
export const fmtPrice = (n, lang) => new Intl.NumberFormat(lang || document.documentElement.lang || 'fr', { style: 'currency', currency: 'EUR' }).format(n);
