// Joueurs de démonstration (tant qu'il n'y a pas de serveur) : forum, classement, mini-profils.
export const DEMO_PLAYERS = [
  { id: 'd1', pseudo: 'Kyro', xp: 61200, rankPoints: 902, sessions: 412, streak: 38, minutes: 9120, style: { frame: 'prism', banner: 'comet', title: 'untouchable' } },
  { id: 'd2', pseudo: 'Nsx', xp: 24400, rankPoints: 781, sessions: 188, streak: 12, minutes: 4020, style: { frame: 'gold', banner: 'dusk', title: 'tryhard' } },
  { id: 'd3', pseudo: 'Luma', xp: 38900, rankPoints: 845, sessions: 251, streak: 21, minutes: 6300, style: { frame: 'flux', banner: 'particles', title: 'tracker' } },
  { id: 'd4', pseudo: 'Tidal', xp: 3100, rankPoints: 355, sessions: 26, streak: 2, minutes: 610, style: { frame: 'copper', banner: 'topo', title: '' } },
  { id: 'd5', pseudo: 'Brixo', xp: 9800, rankPoints: 612, sessions: 90, streak: 5, minutes: 1880, style: { frame: 'emerald', banner: 'mist', title: 'visionary' } },
  { id: 'd6', pseudo: 'Vesper', xp: 15500, rankPoints: 690, sessions: 133, streak: 9, minutes: 2710, style: { frame: 'silver', banner: 'wave', title: 'grinder' } },
  { id: 'd7', pseudo: 'Straf', xp: 20100, rankPoints: 733, sessions: 160, streak: 17, minutes: 3500, style: { frame: 'bronze', banner: 'aurora', title: 'sharpshooter' } },
];
export const DEMO_BOARD = [['Kyro', 3480, 'ok'], ['Luma', 3412, 'ok'], ['Nsx', 3390, 'pending'], ['Straf', 3301, 'none'], ['Vesper', 3255, 'none'], ['Brixo', 3190, 'none'], ['Tidal', 2804, 'none']];
export const DEMO_POSTS = [
  { id: 'seed1', author: 'Straf', cat: 'perf', likes: 12, ago: 3 * 3600e3 },
  { id: 'seed2', author: 'Nsx', cat: 'advice', likes: 7, ago: 26 * 3600e3 },
  { id: 'seed3', author: 'Luma', cat: 'setup', likes: 4, ago: 3 * 864e5 },
  { id: 'seed4', author: 'Kyro', cat: 'challenge', likes: 9, ago: 2 * 864e5 },
  { id: 'seed5', author: 'Vesper', cat: 'team', likes: 3, ago: 5 * 864e5 },
];
