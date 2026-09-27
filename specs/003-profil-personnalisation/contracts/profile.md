# Contracts: Profil

```ts
// Hooks (TanStack Query)
useProfile(): UseQueryResult<Profile>                      // queryKey ['profile','me']
useUpdateProfile(): UseMutationResult<void, Error, Partial<EditableProfile>>
useMiniProfile(pseudo): UseQueryResult<MiniProfile>        // staleTime 60 s
usePublicProfile(pseudo)                                   // SSR + hydratation

type MiniProfile = {
  pseudo: string; avatarUrl: string | null; avatar: {zoom:number;x:number;y:number};
  banner: {key:string; url:string|null; zoom:number; x:number; y:number};
  frame: string; title: string | null;
  level: number; xp: number; rank: {name:string; color:string; points:number} | null;
  sessions?: number; streak?: number; minutesOnSite?: number;   // absents si showScores = false
  private?: true;
}
```

RPC : `get_public_profile`, `get_mini_profile`, `change_pseudo`, `set_avatar`, `heartbeat`,
`export_my_data` (voir data-model). Edge Function : `POST /functions/v1/delete-account`
(JWT requis, corps `{ confirmPseudo }`).
