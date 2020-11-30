package com.example.weblab4.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@Data
public class Result extends BaseEntity {
    private Double x;
    private Double y;
    private Double r;
    private Boolean hit;

    @ManyToOne
    @JoinColumn(referencedColumnName = "Id")
    private User owner;

}
