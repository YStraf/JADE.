import re, json, glob, sys
out = {}
item = re.compile(r'^\s*(\d+)\.\s+(.+?)\s+-\s+(\d+)\s*runs?\b', re.I)
item2 = re.compile(r'^\s*(\d+)\.\s+(.+?)\s+[-–]\s+(\d+(?:\.\d+)?)\s*(min|minutes|m|seconds|sec|s)\b\.?', re.I)
code = re.compile(r'^\s*((?:KOVAAKS|AIMLAB)?[A-Z]{12,})\s*$')
for f in sorted(glob.glob('*.txt')):
    L = [l.replace('﻿','').rstrip() for l in open(f, encoding='utf-8', errors='ignore').read().replace('\r','').split('\n')]
    title = next(l for l in L if l.strip()).strip()
    secs = []; cur = None; prev = []
    for l in L:
        s = l.strip()
        if not s or s.startswith('_'): continue
        m = item.match(l) or item2.match(l)
        if m and not l.startswith('   '):
            if cur is None or (cur['items'] and int(m.group(1)) == 1 and cur.get('closed')):
                cur = {'head': ' / '.join(prev[-3:]), 'items': [], 'code': None}; secs.append(cur)
            if int(m.group(1)) == 1 and cur['items']:
                cur = {'head': ' / '.join(prev[-3:]), 'items': [], 'code': None}; secs.append(cur)
            name = re.sub(r'\s+', ' ', m.group(2)).strip()
            u = (m.group(4) if m.re is item2 else 'runs') if m.lastindex and m.lastindex >= 4 else 'runs'
            v = float(m.group(3)); v = v/60 if u and u.lower().startswith('s') else v
            cur['items'].append([name, round(v,2), 'runs' if u=='runs' else 'min'])
            continue
        c = code.match(s)
        if c and 'COMPLETE ROUTINE' not in s:
            if cur and not cur['code'] and not cur['items']: cur['code'] = c.group(1)
            else: pend = c.group(1); cur = {'head': ' / '.join(prev[-3:]), 'items': [], 'code': c.group(1)}; secs.append(cur)
            continue
        if not l.startswith('   ') and len(s) < 70: prev.append(s)
    secs = [s for s in secs if s['items']]
    out[f[:-4]] = {'title': title, 'sections': secs}
json.dump(out, open('parsed.json', 'w'), indent=0, ensure_ascii=False)
for k, v in out.items():
    print('##', v['title'], '|', len(v['sections']), 'sections')
    for s in v['sections']: print('  -', s['head'][-70:], '|', s['code'], '|', len(s['items']))
