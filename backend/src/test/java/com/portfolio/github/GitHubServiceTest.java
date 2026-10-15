package com.portfolio.github;

import com.portfolio.github.GitHubStats.LanguageShare;
import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class GitHubServiceTest {

    @Test
    void aggregatesLanguagesByRepoCountAndIgnoresMissingOnes() {
        List<String> languages = Arrays.asList("Java", "Java", "TypeScript", null, "Java", "CSS");

        List<LanguageShare> result = GitHubService.aggregateLanguages(languages);

        assertThat(result).extracting(LanguageShare::name).containsExactly("Java", "CSS", "TypeScript");
        assertThat(result.get(0).repos()).isEqualTo(3);
        assertThat(result.get(0).percent()).isEqualTo(60.0);
        assertThat(result.get(1).percent()).isEqualTo(20.0);
    }

    @Test
    void returnsEmptyListWhenNoLanguages() {
        assertThat(GitHubService.aggregateLanguages(Arrays.asList(null, null))).isEmpty();
    }

    @Test
    void keepsOnlyTopSixLanguages() {
        List<String> languages = List.of("A", "B", "C", "D", "E", "F", "G", "G");

        List<LanguageShare> result = GitHubService.aggregateLanguages(languages);

        assertThat(result).hasSize(6);
        assertThat(result.get(0).name()).isEqualTo("G");
    }
}
