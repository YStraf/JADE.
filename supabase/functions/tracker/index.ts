// Fonction « tracker » : stats CS2 (Leetify), FACEIT (API officielle) et Valorant (HenrikDev).
// Les clés restent secrètes côté serveur : supabase secrets set FACEIT_KEY=… HENRIK_KEY=… LEETIFY_KEY=…
// Réponse au format attendu par le site/app : { rating|elo+lvl|tier+div, c, kd, hs, win, matches[] }.
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type' };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' } });
const FACEIT_C = ['#eeeeee', '#1ce400', '#1ce400', '#ffc800', '#ffc800', '#ffc800', '#ffc800', '#ff6309', '#ff6309', '#fe1f00'];
const VAL = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'ascendant', 'immortal', 'radiant'];
const VAL_C = ['#8b8b8b', '#b0804a', '#c6ccd0', '#e8c04a', '#4bb8c4', '#c286f0', '#3fc07c', '#e2465f', '#ffe58a'];

async function faceit(nick: string) {
  const H = { Authorization: 'Bearer ' + Deno.env.get('FACEIT_KEY') };
  const p = await (await fetch('https://open.faceit.com/data/v4/players?nickname=' + encodeURIComponent(nick), { headers: H })).json();
  const g = p.games?.cs2; if (!g) return null;
  const st = await (await fetch(`https://open.faceit.com/data/v4/players/${p.player_id}/games/cs2/stats?limit=5`, { headers: H })).json();
  const matches = (st.items || []).map((i: any) => { const s = i.stats; const win = s.Result === '1'; return { map: String(s.Map || '').replace('de_', '').replace(/^./, (c: string) => c.toUpperCase()), win, score: s.Score?.replace(' / ', '-') || '', k: +s.Kills, d: +s.Deaths, a: +s.Assists, hs: +s['Headshots %'] || 0 }; });
  const life = await (await fetch(`https://open.faceit.com/data/v4/players/${p.player_id}/stats/cs2`, { headers: H })).json();
  return { elo: g.faceit_elo, lvl: g.skill_level, c: FACEIT_C[g.skill_level - 1], kd: life.lifetime?.['Average K/D Ratio'], hs: +life.lifetime?.['Average Headshots %'] || 0, win: +life.lifetime?.['Win Rate %'] || 0, matches };
}
async function valorant(riotId: string) {
  const [name, tag] = riotId.split('#'); const H = { Authorization: Deno.env.get('HENRIK_KEY') || '' };
  const acc = await (await fetch(`https://api.henrikdev.xyz/valorant/v2/account/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, { headers: H })).json();
  const region = acc.data?.region; if (!region) return null;
  const mmr = await (await fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/${region}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`, { headers: H })).json();
  const ms = await (await fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/pc/${encodeURIComponent(name)}/${encodeURIComponent(tag)}?mode=competitive&size=5`, { headers: H })).json();
  const matches = (ms.data || []).map((m: any) => { const me = m.players.find((p: any) => p.name.toLowerCase() === name.toLowerCase()); const team = m.teams.find((t: any) => t.team_id === me.team_id); const s = me.stats; const shots = s.headshots + s.bodyshots + s.legshots; return { map: m.metadata.map.name, win: team.won, score: team.rounds.won + '-' + team.rounds.lost, k: s.kills, d: s.deaths, a: s.assists, hs: shots ? Math.round(s.headshots / shots * 100) : 0 }; });
  const tierName = String(mmr.data?.current?.tier?.name || 'Iron 1'); const [t, div] = tierName.split(' ');
  const ti = Math.max(0, VAL.indexOf(t.toLowerCase()));
  const K = matches.reduce((a: number, m: any) => a + m.k, 0), D = matches.reduce((a: number, m: any) => a + m.d, 0);
  return { tier: VAL[ti], div: +div || 0, c: VAL_C[ti], kd: (K / Math.max(1, D)).toFixed(2), hs: Math.round(matches.reduce((a: number, m: any) => a + m.hs, 0) / Math.max(1, matches.length)), win: Math.round(matches.filter((m: any) => m.win).length / Math.max(1, matches.length) * 100), matches };
}
async function cs2(steam: string) {
  const id = steam.match(/7656\d{13}/)?.[0]; if (!id) return null;
  const r = await fetch('https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=' + id, { headers: { _leetify_key: Deno.env.get('LEETIFY_KEY') || '' } });
  if (!r.ok) return null; const p = await r.json();
  const matches = (p.recent_matches || []).slice(0, 5).map((m: any) => ({ map: String(m.map_name || '').replace('de_', ''), win: m.outcome === 'win', score: (m.score || []).join('-'), k: m.kills ?? 0, d: m.deaths ?? 0, a: m.assists ?? 0, hs: Math.round((m.accuracy_head ?? 0) * 100) }));
  const K = matches.reduce((a: number, m: any) => a + m.k, 0), D = matches.reduce((a: number, m: any) => a + m.d, 0);
  const rating = p.ranks?.premier ?? 0;
  return { rating, c: rating < 5000 ? '#b0c3d9' : rating < 10000 ? '#8cc6ff' : rating < 15000 ? '#6a7dff' : rating < 20000 ? '#c166ff' : rating < 25000 ? '#f03cff' : rating < 30000 ? '#eb4b4b' : '#ffd700', kd: (K / Math.max(1, D)).toFixed(2), hs: Math.round(matches.reduce((a: number, m: any) => a + m.hs, 0) / Math.max(1, matches.length)), win: Math.round((p.winrate ?? 0) * 100), matches };
}
Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const u = new URL(req.url); const game = u.searchParams.get('game'), id = (u.searchParams.get('id') || '').slice(0, 100);
  try {
    const out = game === 'faceit' ? await faceit(id) : game === 'valorant' ? await valorant(id) : game === 'cs2' ? await cs2(id) : null;
    return out ? json(out) : json({ error: 'introuvable' }, 404);
  } catch (e) { return json({ error: String(e) }, 502); }
});
