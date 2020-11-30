package com.example.weblab4.repository;

import com.example.weblab4.model.Result;
import com.example.weblab4.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
        List<Result> findByOwner(User owner);

    }
