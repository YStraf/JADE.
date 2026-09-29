// Ouvre directement Kovaak's ou Aim Lab sur le bon exercice (liens Steam), sans passer par le menu du jeu.
const KOVAAKS = 824270, AIMLAB = 714010;
function url(soft, { scenario, playlist } = {}) {
  if (soft === 'kovaaks') {
    if (playlist) return 'steam://run/' + KOVAAKS + '/?action=jump-to-playlist;sharecode=' + encodeURIComponent(playlist);
    if (scenario) return 'steam://run/' + KOVAAKS + '/?action=jump-to-scenario;name=' + encodeURIComponent(scenario) + ';mode=challenge';
    return 'steam://run/' + KOVAAKS;
  }
  if (soft === 'aimlab') return 'steam://run/' + AIMLAB;
  return null;
}
module.exports = { url, KOVAAKS, AIMLAB };
