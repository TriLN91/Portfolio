package com.portfolio.contact;

public record ContactResponse(String status) {

    public static ContactResponse received() {
        return new ContactResponse("received");
    }
}
