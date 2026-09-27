# Contracts: Progression

```ts
useXP(): { total, level, into, need, pct, events: XpEvent[] }           // ['xp','me']
useRank(): { points, name, color, aim, assiduity, next?: {name, missing} } | { unranked: true, testsDone }
useBadges(): { id: BadgeId; unlocked: boolean }[]
useTestRecords(): Record<TestKey, number | null>
useSubmitTestResult(): mutation(test, value, detail) → AwardResult
useTrainingSessions(): Session[]                                         // ['sessions','me']
useImportSessions(): mutation(rows: ParsedCsv[]) → { added, skipped, invalid, xp, coins }

type AwardResult = { xp: number; levelBefore: number; levelAfter: number; coins: number; isRecord?: boolean } | null
```

Chaque mutation qui renvoie un `AwardResult` non nul déclenche côté UI : `pop('+{xp} XP · {label}')`,
`pop('+{coins} coins · …')` si coins > 0, puis `pop('Niveau atteint : N')` + `sfx.enter()` si `levelAfter > levelBefore`,
et invalide `['xp','me']`, `['coins','me']`, `['profile','me']`.

Parseur CSV client : `parseKovaaksCsv(fileName, text) → { scen, date, score, acc, file } | null` (port exact de `parseCSV`).
