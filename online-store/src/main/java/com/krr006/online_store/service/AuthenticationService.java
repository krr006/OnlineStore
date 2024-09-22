package com.krr006.online_store.service;

import com.krr006.online_store.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.krr006.online_store.dto.JwtResponse;
import com.krr006.online_store.dto.JwtSignInRequest;
import com.krr006.online_store.dto.JwtSignUpRequest;
import com.krr006.online_store.entity.Role;
import com.krr006.online_store.entity.User;


@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public JwtResponse signUp(JwtSignUpRequest request) {
        Role role = Role.ROLE_USER;

        if ("admin".equals(request.getUsername())) {
            role = Role.ROLE_ADMIN;
        }


        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userService.create(user);

        var jwt = jwtService.generateToken(user);
        return new JwtResponse(jwt);
    }

    public ResponseEntity<JwtResponse> signIn(JwtSignInRequest request) {
        try {

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
            ));
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Wrong login or password");
        }

        var user = userService
                .userDetailsService()
                .loadUserByUsername(request.getUsername());

        var jwt = jwtService.generateToken(user);

        return ResponseEntity.ok(new JwtResponse(jwt));
    }
}