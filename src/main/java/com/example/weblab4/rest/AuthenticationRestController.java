package com.example.weblab4.rest;

import com.example.weblab4.dto.AuthenticationRequestDto;
import com.example.weblab4.model.User;
import com.example.weblab4.security.jwt.JwtTokenProvider;
import com.example.weblab4.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.NonUniqueResultException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/auth/")
public class AuthenticationRestController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Autowired
    public AuthenticationRestController(AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
    }

    @PostMapping("login")
    public ResponseEntity login(@RequestBody AuthenticationRequestDto requestDto) {
        try {
            String username = requestDto.getUsername();
            User user = userService.findByUsername(username);

            if (user == null) {
                throw new UsernameNotFoundException("User with username: " + username + " not found");
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, requestDto.getPassword()));
            String token = jwtTokenProvider.createToken(username);

            Map<Object, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("refresh_token", user.getRefresh_token());
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (UsernameNotFoundException e) {
            Map<Object, Object> response = new HashMap<>();
            response.put("description","user with username= "+requestDto.getUsername()+" not found");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);

        } catch (AuthenticationException e){
            Map<Object, Object> response = new HashMap<>();
            response.put("description","wrong password");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @PostMapping("register")
    public ResponseEntity register(@RequestBody AuthenticationRequestDto requestDto) {
        try {
            String username = requestDto.getUsername();
            if (userService.findByUsername(username) != null){
                throw new NonUniqueResultException("User has already registered");
            }

            User user=userService.register(new User(username, requestDto.getPassword()));
            String token = jwtTokenProvider.createToken(username);
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);


            Map<Object, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("refresh_token", user.getRefresh_token());
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (IncorrectResultSizeDataAccessException | NonUniqueResultException ex) {
            Map<Object, Object> response = new HashMap<>();
            response.put("description","user with username= "+requestDto.getUsername()+" has already registered");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }
}

