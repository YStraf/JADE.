# Contracts: Shop

```ts
useCrates(): Crate[]                 // crates_catalog + crate_odds
useOpenCrate(): mutation(crateKey) → OpenResult   // génère request_id côté client (crypto.randomUUID)
useInventory(): InventoryItem[]      // ['inventory','me']
useShopLimits(): { cratesLeft; arcadeLeft; resetsAt; arcadeAllowed; reason?: 'underage'|'excluded'|'disabled' }
useArcade(): { spinWheel(), flipCoin(side), pickCell(i), exclude(days|null) }
```

`<CrateOpeningAnimation result pool onDone/>` : construit 40 cartes tirées du pool (aléa visuel
client, sans incidence), force `items[34] = result`, anime `translateX` (4,2 s, `cubic-bezier(.1,.7,.05,1)`),
annonce le résultat via `aria-live`. En mouvement réduit : `onDone` immédiat.

`<WheelOfFortune segmentIndex/>` : rotation `1440 + index×45 ± 13°` en 3,9 s.
Toutes les erreurs RPC sont mappées : `insufficient_funds` → « Pas assez de Jade Coins »,
`daily_limit` → « Limite du jour atteinte, reviens demain », `underage`, `excluded`, `disabled`.
