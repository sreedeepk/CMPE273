package com.repository;

import com.entity.Files;
import org.springframework.data.repository.CrudRepository;

public interface FileRepository extends CrudRepository<Files, Long> {
    Files findByFileId(Integer fileId);
}
