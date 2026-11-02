export function createSupabaseAuthGateway(supabase) {
  return {
    async verifyAccessToken(accessToken) {
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error || !data?.user) return null;

      const u = data.user;
      return {
        id: u.id,
        email: u.email,
        provider: u.app_metadata?.provider,
        providers: u.app_metadata?.providers ?? [],
        fullName: u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,      // ← ใหม่
        avatarUrl: u.user_metadata?.avatar_url ?? u.user_metadata?.picture ?? null, // ← ใหม่
      };
    },
  };
}