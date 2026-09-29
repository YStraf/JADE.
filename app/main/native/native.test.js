// Tests des parties sans Windows : lecture/écriture des fichiers de réglages et liens de lancement.
const test = require('node:test');
const assert = require('node:assert');
const { patchCs2, patchValorant, parseLibraries } = require('./games');
const { url } = require('./launcher');
const { gpuScore, scoreOf, recommend } = require('./system');
test('CS2 : ne touche que les clés connues déjà présentes', () => {
  const src = '"video.cfg"\n{\n\t"setting.msaa_samples"\t\t"8"\n\t"setting.videocfg_shadow_quality"\t\t"2"\n\t"setting.unknown"\t\t"7"\n}\n';
  const r = patchCs2(src, 0);
  assert.match(r.text, /"setting\.msaa_samples"\t\t"0"/); assert.match(r.text, /"setting\.videocfg_shadow_quality"\t\t"0"/); assert.match(r.text, /"setting\.unknown"\t\t"7"/); assert.equal(r.changed, 2);
  assert.match(patchCs2(src, 100).text, /"setting\.msaa_samples"\t\t"8"/);
});
test('Valorant : groupes de qualité écrits', () => {
  const r = patchValorant('[/Script/ShooterGame.ShooterGameUserSettings]\r\nbUseVSync=False\r\n\r\n[ScalabilityGroups]\r\nsg.ShadowQuality=3\r\n', 50);
  assert.match(r.text, /sg\.ShadowQuality=1/); assert.match(r.text, /sg\.TextureQuality=1/); assert.match(r.text, /bUseVSync=False/);
});
test('bibliothèques Steam', () => { assert.deepEqual(parseLibraries('"0"\n{\n"path"\t\t"C:\\\\Program Files (x86)\\\\Steam"\n}\n"1"{"path"  "D:\\\\SteamLibrary"}'), ['C:\\Program Files (x86)\\Steam', 'D:\\SteamLibrary']); });
test('liens Kovaak\'s', () => {
  assert.equal(url('kovaaks', { playlist: 'KOVAAKSABC' }), 'steam://run/824270/?action=jump-to-playlist;sharecode=KOVAAKSABC');
  assert.equal(url('kovaaks', { scenario: '1w4ts reload' }), 'steam://run/824270/?action=jump-to-scenario;name=1w4ts%20reload;mode=challenge');
});
test('note du PC', () => {
  assert.ok(gpuScore('NVIDIA GeForce RTX 4070') > gpuScore('NVIDIA GeForce GTX 1650'));
  const s = scoreOf({ gpu: 'NVIDIA GeForce RTX 4070', threads: 16, cpuMhz: 4500, ramGB: 32 }); assert.ok(s > 70 && recommend(s) >= 45);
});
