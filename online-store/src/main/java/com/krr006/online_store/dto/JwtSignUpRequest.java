package com.krr006.online_store.dto;

import lombok.Data;

@Data
public class JwtSignUpRequest {
    private String email;
    private String username;
    private String password;
}

