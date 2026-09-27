# Contracts: Administration

Routes : `/admin/{dashboard,users,brand,forum,reports,content,challenge,shop,logs,settings,tickets}`
(`/admin` → premier onglet autorisé). Garde : Server Component qui lit `admin_roles` ; aucune donnée
admin n'est envoyée au client sans rôle.

```ts
useAdminTabs(): Tab[]                         // filtrés par rôle
useAdminUsers(q): InfiniteQuery<AdminUserRow[]>
useAdminUserDetail(id): { profile, sanctions, xpAdjustments, coinAdjustments, posts, reportsMade, reportsReceived }
useAdminAction(rpcName): mutation(args) → void   // toast + invalidations + ré-auth si > 30 min
useAdminLogs(filters): InfiniteQuery<LogRow[]>
useAdminDashboard(): Stats
```

Composants : `<AdminPanel/>` (nav latérale `pnav`), un composant par onglet (`DashboardTab`, `UsersTab`,
`UserDetailDrawer`, `BrandTab`, `ForumModerationTab`, `ReportsQueue`, `ContentTab`, `ChallengeTab`,
`ShopAdminTab`, `LogsTab`, `SettingsTab`, `TicketsTab`), `<ReasonDialog/>` (motif obligatoire),
`<ConfirmDialog/>` (remplace `confirm()`).
