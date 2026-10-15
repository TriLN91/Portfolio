package com.portfolio.github;

import com.portfolio.config.AppProperties;
import com.portfolio.github.GitHubApiModels.Repo;
import com.portfolio.github.GitHubApiModels.User;
import com.portfolio.github.GitHubStats.LanguageShare;
import com.portfolio.github.GitHubStats.RepoSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Fetches public profile stats from the GitHub API.
 * Results are cached in memory (GitHub allows only 60 unauthenticated requests per hour).
 */
@Service
public class GitHubService {

    private static final Logger log = LoggerFactory.getLogger(GitHubService.class);
    private static final int TOP_LANGUAGES = 6;
    private static final int RECENT_REPOS = 4;

    private final RestClient client;
    private final AppProperties.GitHub settings;
    private volatile GitHubStats cached;

    public GitHubService(RestClient.Builder builder, AppProperties props) {
        this.settings = props.github();
        RestClient.Builder b = builder
                .baseUrl("https://api.github.com")
                .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github+json")
                .defaultHeader("X-GitHub-Api-Version", "2022-11-28");
        if (settings.token() != null && !settings.token().isBlank()) {
            b.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + settings.token());
        }
        this.client = b.build();
    }

    public GitHubStats getStats() {
        GitHubStats current = cached;
        if (current != null && current.fetchedAt().isAfter(Instant.now().minus(Duration.ofMinutes(settings.cacheMinutes())))) {
            return current;
        }
        synchronized (this) {
            current = cached;
            if (current != null && current.fetchedAt().isAfter(Instant.now().minus(Duration.ofMinutes(settings.cacheMinutes())))) {
                return current;
            }
            try {
                cached = fetch();
                return cached;
            } catch (RestClientException e) {
                if (current != null) {
                    log.warn("GitHub API failed, serving stale data: {}", e.getMessage());
                    return current;
                }
                throw new GitHubUnavailableException("GitHub stats are temporarily unavailable", e);
            }
        }
    }

    private GitHubStats fetch() {
        String username = settings.username();
        User user = client.get().uri("/users/{u}", username).retrieve().body(User.class);
        List<Repo> repos = client.get()
                .uri("/users/{u}/repos?per_page=100&sort=pushed&type=owner", username)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Repo>>() {});
        if (user == null || repos == null) {
            throw new RestClientException("Empty response from GitHub");
        }

        List<Repo> own = repos.stream().filter(r -> !r.fork()).toList();
        int stars = own.stream().mapToInt(Repo::stars).sum();
        List<RepoSummary> recent = own.stream()
                .filter(r -> r.pushedAt() != null)
                .sorted(Comparator.comparing(Repo::pushedAt).reversed())
                .limit(RECENT_REPOS)
                .map(r -> new RepoSummary(r.name(), r.description(), r.language(), r.stars(), r.htmlUrl(), r.pushedAt()))
                .toList();

        return new GitHubStats(
                user.login(),
                user.htmlUrl(),
                user.publicRepos(),
                user.followers(),
                stars,
                aggregateLanguages(own.stream().map(Repo::language).toList()),
                recent,
                Instant.now());
    }

    /** Counts repositories per primary language and returns the top ones with percentages (1 decimal) */
    static List<LanguageShare> aggregateLanguages(List<String> languages) {
        Map<String, Long> counts = languages.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        long total = counts.values().stream().mapToLong(Long::longValue).sum();
        if (total == 0) return List.of();

        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed().thenComparing(Map.Entry.<String, Long>comparingByKey()))
                .limit(TOP_LANGUAGES)
                .map(e -> new LanguageShare(e.getKey(), e.getValue().intValue(),
                        Math.round(e.getValue() * 1000.0 / total) / 10.0))
                .toList();
    }
}
