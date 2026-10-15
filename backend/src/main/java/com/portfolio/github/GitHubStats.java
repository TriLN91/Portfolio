package com.portfolio.github;

import java.time.Instant;
import java.util.List;

/** Response of GET /api/github/stats (shape matches frontend/src/lib/api.ts) */
public record GitHubStats(
        String username,
        String profileUrl,
        int publicRepos,
        int followers,
        int totalStars,
        List<LanguageShare> languages,
        List<RepoSummary> recentRepos,
        Instant fetchedAt
) {
    public record LanguageShare(String name, int repos, double percent) {}

    public record RepoSummary(String name, String description, String language, int stars, String url, Instant pushedAt) {}
}
