package com.dca.matrix.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MatrixUserRepository extends JpaRepository<MatrixUser, Long>
{	
	Optional<MatrixUser> findByUsername(String username);
	
	@Query("select u from MatrixUser u order by UPPER(u.lastName), UPPER(u.firstName)")
	<T> List<T> findAllQuery();
	
	@Query("""
            Select u from MatrixUser u where UPPER(u.username) like UPPER(concat('%', :searchString, '%'))\
             or UPPER(u.username) like UPPER(concat('%', :searchString, '%'))\
             or UPPER(u.firstName) like UPPER(concat('%', :searchString, '%'))\
             or UPPER(u.lastName) like UPPER(concat('%', :searchString, '%'))\
             order by UPPER(u.lastName), UPPER(u.firstName)\
            """)
	List<MatrixUser> searchUsers(String searchString);
}
