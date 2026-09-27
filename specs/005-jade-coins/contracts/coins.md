# Contracts: Jade Coins

```ts
useCoinsBalance(): { balance: number; isLoading: boolean }     // ['coins','me','balance'] + Realtime profiles:id=eq.uid
useCoins(): { balance; history: InfiniteQuery<CoinTx[]> }     // RPC my_coins_history
type CoinTx = { id: number; amount: number; reason: CoinReason; balanceAfter: number; createdAt: string; ref?: {type:string; id:string} }
```

Libellés de motifs (i18n `coins.reason.*`) : `session` « Séance importée », `record_test` « Record sur un test »,
`streak_week` « Série de N jours », `level_milestone` « Palier niveau N », `challenge` « Défi de la semaine »,
`crate_open` « Caisse <nom> », `arcade_stake` « Mise <jeu> », `arcade_payout` « Gain <jeu> »,
`admin_grant` / `admin_revoke` « Ajustement de l'équipe ».

Composant `<CoinChip/>` : pastille jade + nombre formaté `fr-FR` ; `<CoinDisclaimer/>` : mention FR-006.
