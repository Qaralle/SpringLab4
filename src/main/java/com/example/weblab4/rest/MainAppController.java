package com.example.weblab4.rest;

import com.example.weblab4.dto.PointsDto;
import com.example.weblab4.model.Result;
import com.example.weblab4.repository.ResultRepository;
import com.example.weblab4.service.ResultService;
import com.example.weblab4.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/app/")
public class MainAppController {

    private final ResultService resultService;
    private final UserService userService;
    private final ResultRepository resultRepository;

    @Autowired
    public MainAppController(ResultService resultService, UserService userService, ResultRepository resultRepository) {
        this.resultService = resultService;
        this.userService = userService;
        this.resultRepository = resultRepository;
    }


    @PostMapping("area")
    public ResponseEntity check(@RequestBody PointsDto req){

        Result result = resultService.prepareResult(req.getX(),req.getY(),req.getR(),userService.getCurrentUser());
        resultService.saveResult(result);

        return getResults();
    }

    @PostMapping("results")
    public ResponseEntity getResults(){
        List<Result> results = resultService.getAllForOwner(userService.getCurrentUser());
        return ResponseEntity.ok(resultService.prepareToPrimeReact(results));
    }

    @PostMapping("clear")
    public ResponseEntity clear(){
        resultRepository.deleteAll();
        return ResponseEntity.ok("");
    }
}
