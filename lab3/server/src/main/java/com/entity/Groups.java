package com.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
public class Groups {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer groupId;

    private String groupName;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "group_members", joinColumns = {@JoinColumn(name = "group_id")}, inverseJoinColumns = {@JoinColumn(name = "user_id")})
    @JsonIgnore
    private List<Users> users;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private Users owner;

    public Users getOwner() {
        return owner;
    }

    public void setOwner(Users owner) {
        this.owner = owner;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }


    public List<Users> getUsers() {
        return users;
    }

    public void setUsers(List<Users> users) {
        this.users = users;
    }
}
