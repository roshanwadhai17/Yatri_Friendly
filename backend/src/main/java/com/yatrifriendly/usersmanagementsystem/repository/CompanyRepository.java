package com.yatrifriendly.usersmanagementsystem.repository;

import com.yatrifriendly.usersmanagementsystem.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Integer> {
}

