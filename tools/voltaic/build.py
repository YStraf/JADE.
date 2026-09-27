import json, csv, re
d = json.load(open('parsed.json'))
def doc(prefix): return next(v for k, v in d.items() if k.startswith(prefix))['sections']
T = ['iron','bronze','silver','gold','platinum','diamond','jade']
LV_T = {'iron':'beginner','bronze':'beginner','silver':'beginner','gold':'intermediate','platinum':'intermediate','diamond':'advanced','jade':'advanced'}
LV_V = {'novice':'beginner','easy':'beginner','balanced':'intermediate','intermediate':'intermediate','advanced':'advanced'}
TYPES = {'fund':['clicking','tracking','switching'],'static':['clicking','precision'],'dynamic':['clicking','flick'],'smooth':['tracking','precision'],'reactive':['tracking','reaction'],'speedts':['switching','flick'],'evasivets':['switching','tracking'],'reactivity':['tracking','reaction'],'valeasy':['clicking','micro','switching'],'valadv':['clicking','micro','switching'],'bardoz':['clicking','micro','tracking'],'valwarmup':['clicking','tracking'],'valroutine':['clicking','micro','switching'],'cs2warmup':['clicking','tracking'],'antistrafe':['micro','reaction'],'ramp':['clicking','micro'],'micro':['micro','precision']}
M = []  # (prefix, idx, soft, focus, variant/tier, game, dur)
for i, t in enumerate(T): M.append(('1iunv', i, 'kovaaks', 'fund', t, 'all', None))
M += [('1TpFH',0,'kovaaks','valeasy','easy','valorant',None),('1TpFH',1,'kovaaks','bardoz','advanced','valorant',None),('1TpFH',2,'kovaaks','valadv','advanced','valorant',None),
      ('1cORi',0,'kovaaks','smooth','easy','all',None),('1cORi',1,'kovaaks','smooth','intermediate','all',None),('1cORi',2,'kovaaks','smooth','advanced','all',None),
      ('1cORi',3,'kovaaks','static','balanced','all',None),('1cORi',4,'kovaaks','static','advanced','all',None),('1cORi',5,'kovaaks','speedts','balanced','all',25),('1cORi',6,'kovaaks','reactivity','advanced','all',None)]
for i, t in enumerate(T[:6]): M.append(('1BCnF', i, 'aimlab', 'fund', t, 'all', 65))
M += [('1G57J',16,'aimlab','valwarmup',None,'valorant',12),('1G57J',17,'aimlab','valroutine',None,'valorant',40),('1G57J',18,'aimlab','cs2warmup',None,'cs2',12),
      ('1RrYH',0,'aimlab','antistrafe','balanced','valorant',25),('1RrYH',1,'aimlab','antistrafe','advanced','valorant',25),
      ('1XGqf',0,'aimlab','ramp',None,'valorant',16),('1gEyP',0,'aimlab','micro',None,'valorant',None)]
W = [('static','balanced',27),('static','advanced',27),('dynamic','novice',30),('dynamic','intermediate',30),('dynamic','advanced',30),('smooth','novice',33),('smooth','intermediate',33),('smooth','advanced',30),
     ('reactive','novice',None),('reactive','intermediate',None),('reactive','advanced',None),('speedts','novice',None),('speedts','intermediate',None),('speedts','advanced',None),('evasivets','novice',24),('evasivets','intermediate',24),('evasivets','advanced',30)]
for i, (f, v, du) in enumerate(W): M.append(('1oNUB', i, 'aimlab', f, v, 'all', du))
out = []
for pre, i, soft, focus, var, game, dur in M:
    s = doc(pre)[i]
    tier = var if focus == 'fund' else None
    lvl = LV_T[var] if tier else LV_V.get(var, 'intermediate')
    rid = soft[0] + '-' + focus + ('-' + var if var else '')
    blocks = [[(round(a, 2) if a % 1 else int(a)), n.replace(' or ', ' | '), 'r' if u == 'runs' else 'm'] for n, a, u in s['items']]
    code = s['code'] if s['code'] and s['code'].startswith('KOVAAKS') else None
    o = {'id': rid, 'soft': soft, 'focus': focus, 'lvl': lvl, 'game': game, 'types': TYPES[focus], 'blocks': blocks}
    if tier: o['tier'] = tier
    elif var: o['v'] = var
    if code: o['code'] = code
    if dur: o['dur'] = dur
    out.append(o)
ids = [o['id'] for o in out]; assert len(ids) == len(set(ids)), [x for x in ids if ids.count(x) > 1]
R = list(csv.reader(open('sheet.csv', encoding='utf-8-sig')))
keys = ['static','dynamic','smooth','reactive','speedts','evasivets','moveclick','movetrack']
lib = {k: [] for k in keys}
for row in R[2:]:
    for k, c in zip(keys, row):
        c = c.strip().rstrip('*').strip()
        if c and len(c) < 45 and not re.search(r'credit|recommend|asterisk|bold is|rework|DM me', c, re.I): lib[k].append(c)
js = "// Routines Voltaic (Kovaak's et Aim Lab), générées depuis les documents publics de Voltaic\n// (Fundamental, Weakness-specific et Game-specific routines) — ne pas éditer à la main :\n// voir tools/ ou régénérer. Blocs : [quantité, scénario (alternatives séparées par |), 'r' = runs | 'm' = minutes].\n"
js += 'export const ROUTINES = [\n' + ',\n'.join('  ' + json.dumps(o, ensure_ascii=False) for o in out) + '\n];\n'
js += '// Bibliothèque de scénarios Kovaak\'s par catégorie (tableau Voltaic, refonte 2024 par clover).\nexport const SCEN_LIB = ' + json.dumps(lib, ensure_ascii=False) + ';\n'
open('routines-gen.js', 'w').write(js)
print(len(out), 'routines', {k: len(v) for k, v in lib.items()}, sum(1 for o in out if o.get('code')), 'codes')
print(sorted(set(b[2] for o in out for b in o['blocks'])), [o['id'] for o in out if not o['blocks']])
