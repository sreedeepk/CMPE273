package com.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity // This tells Hibernate to make a table out of this class
public class UsersInfo {
    @Id
    private Integer userId;

    private String overview;

    private String work;

    private String interests;

}