package com.dca.matrix.matrix_entity;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import com.dca.matrix.matrix_entity.MatrixEntityRepository;

@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
class MatrixEntityST
{
	@Autowired
	private MatrixEntityRepository meRepository;
	
	@BeforeEach
	void setUp() throws Exception
	{
	}

	@Test
	void test()
	{
		assertNotNull(this.meRepository);
	}

}
