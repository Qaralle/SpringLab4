package com.example.weblab4.security.jwt;

import com.example.weblab4.model.Status;
import com.example.weblab4.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class JwtUserFactory {

    public JwtUserFactory() {
    }

    public static JwtUser create(User user) {
        return new JwtUser(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                mapToGrantedAuthorities(new ArrayList<>(Collections.singletonList(user.getRole()))),
                user.getStatus().equals(Status.ACTIVE)
        );
    }


    //TODO сделать нормальную таблицу ролей
    private static List<GrantedAuthority> mapToGrantedAuthorities(List<String> userRoles) {
        return userRoles.stream()
                .map(role ->
                        new SimpleGrantedAuthority(role)
                ).collect(Collectors.toList());
    }
}
