package com.krr006.online_store.dto;

import lombok.Data;

@Data
public class JwtSignInRequest {
    private String username;
    private String password;
}
