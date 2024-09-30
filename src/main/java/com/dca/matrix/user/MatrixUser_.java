package com.dca.matrix.user;

import jakarta.persistence.metamodel.SingularAttribute;
import jakarta.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(MatrixUser.class)
public class MatrixUser_
{
	public static volatile SingularAttribute<MatrixUser, Long> id;
}
