package com.example.weblab4.service;

import com.example.weblab4.model.Result;
import com.example.weblab4.model.User;


import java.util.List;

public interface ResultService {

    boolean check(Double x, Double y, Double r);

    List<Result> getAllForOwner(User owner);

    void saveResult(Result result);

    String prepareToPrimeReact(List<Result> results);

    Result prepareResult(Double x, Double y, Double r, User owner);
}
