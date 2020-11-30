package com.example.weblab4.service.impl;

import com.example.weblab4.model.Result;
import com.example.weblab4.model.User;
import com.example.weblab4.repository.ResultRepository;
import com.example.weblab4.service.ResultService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.StringJoiner;

import static java.lang.Math.pow;

@Service
@Slf4j
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;

    @Autowired
    public ResultServiceImpl(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }


    @Override
    public boolean check(Double x, Double y, Double r) {
        log.info("IN check | getting the result");
        if (x > 0 && y < 0) {
            return false;
        } else if ((x <= 0 && y <= 0) && (x >= -r) && (y >=- r/2)){
            return true;
        } else if (x >= 0 && y >= 0 && (y <= -x/2 + r/2)) {
            return true;
        } else return ((x <= 0 && y >= 0) && (pow(x,2) + pow(y,2)<=pow(r/2,2)));
    }



    @Override
    public List<Result> getAllForOwner(User owner) {
        List<Result> result = resultRepository.findByOwner(owner);
        log.info("IN getAllForOwner - {} results found", result.size());
        return result;
    }


    @Override
    public Result prepareResult(Double x, Double y, Double r, User owner) {
        Result result = new Result();
        result.setX(x);
        result.setY(y);
        result.setR(r);
        result.setHit(check(x,y,r));
        result.setOwner(owner);
        log.info("IN saveResult - result was created with owner = {}", owner);
        return result;
    }

    @Override
    public void saveResult(Result result) {
        resultRepository.save(result);
        log.info("IN saveResult - result was saved");
    }

    @Override
    public String prepareToPrimeReact(List<Result> results) {
        StringJoiner joiner = new StringJoiner(",");
        for (Result res : results) {
            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.append("{\"x\":\"");
            stringBuilder.append(String.format("%.3f",res.getX()));
            stringBuilder.append("\", \"y\":\"");
            stringBuilder.append(String.format("%.3f",res.getY()));
            stringBuilder.append("\", \"r\":\"");
            stringBuilder.append(res.getR().toString());
            stringBuilder.append("\", \"res\":\"");
            stringBuilder.append(res.getHit());
            stringBuilder.append("\"}");
            joiner.add(stringBuilder.toString());
        }
        return "["+joiner.toString()+"]";
    }


}
