package com.dca.matrix.user;

import java.util.List;

public interface MatrixUserService
{
	List<MatrixUser> findAll();
	
	MatrixUser updateUser(MatrixUser mUser);
	
	MatrixUser findByUsername(String username);
	
	MatrixUser findById(Long id);
	
	List<MatrixUser> search(String searchString);
	
	MatrixUser updatePassword(ChangePasswordMessage msg);	
	
	MatrixUser setTheme(SetThemeMessage msg);

	List<UserCaseRecord> getUserCaseRecords();
}
