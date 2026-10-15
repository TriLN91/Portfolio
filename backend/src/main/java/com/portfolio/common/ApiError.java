package com.portfolio.common;

import java.util.Map;

/** Error body returned by every endpoint: { "message": "...", "errors": { "field": "reason" } } */
public record ApiError(String message, Map<String, String> errors) {

    public static ApiError of(String message) {
        return new ApiError(message, Map.of());
    }
}
