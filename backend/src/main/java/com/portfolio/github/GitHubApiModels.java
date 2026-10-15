package com.portfolio.github;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

/** The parts of GitHub's REST API responses we use */
final class GitHubApiModels {

    private GitHubApiModels() {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record User(
            String login,
            @JsonProperty("html_url") String htmlUrl,
            @JsonProperty("public_repos") int publicRepos,
            int followers
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Repo(
            String name,
            String description,
            String language,
            @JsonProperty("stargazers_count") int stars,
            @JsonProperty("html_url") String htmlUrl,
            @JsonProperty("pushed_at") Instant pushedAt,
            boolean fork
    ) {}
}
