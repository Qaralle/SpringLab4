package com.example.weblab4.model;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@Table(name = "\"USER\"")
@NoArgsConstructor
public class User extends BaseEntity {

    public User(String username, String password){
        this.username=username;
        this.password=password;
    }

    private String username;
    private String password;
    private String role;
    private String refresh_token;

    @Enumerated(EnumType.STRING)
    @Column
    private Status status;

}
