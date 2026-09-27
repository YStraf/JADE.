# Contracts: Communauté

```ts
useForumPosts(category: Cat | 'Tout'): InfiniteQuery<Post[]>   // ['forum', category]
useCreatePost(): mutation({category,title,body,videoUrl}) → { post, award: AwardResult }
useToggleGG(): mutation(postId)                                // optimistic
useReportPost(): mutation({postId, reason, details})
useCurrentChallenge(): Challenge | null
useChallengeLeaderboard(challengeId): Entry[]                  // + Realtime channel `challenge:<id>`
useSubmitChallengeScore(): mutation({score, videoUrl})
useCountdown(target: Date, everyMs = 30000): {days, hours, minutes}
```

Utilitaires : `youtubeId(url)` (port de `ytId`), `nextMondayParis(now)`, `CATS` + `catColor()`.
Composants : `<ForumPage/>`, `<PostCard/>`, `<NewPostModal/>`, `<CategoryPicker/>`, `<ReportDialog/>`,
`<ChallengeHero/>`, `<Countdown/>`, `<Leaderboard/>`, `<SubmitScoreDialog/>`.
