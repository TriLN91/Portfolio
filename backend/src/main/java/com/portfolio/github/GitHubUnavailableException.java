package com.portfolio.github;

public class GitHubUnavailableException extends RuntimeException {

    public GitHubUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
