package com.dca.matrix.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.dca.matrix.api.ApiResponse;
import com.dca.matrix.api.ApiResponseUtil;
import com.dca.matrix.authentication.AuthenticationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path="/api/user",produces="application/json")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
@Slf4j
public class MatrixUserController
{
	private final MatrixUserService userService;
	private final AuthenticationService authService;

//	@GetMapping("/all")
//	@ResponseStatus(HttpStatus.OK)
//	public List<MatrixUserDTO> getAll()
//	{	
//		return this.userService.findAll().stream().map(user->this.createDTO(user)).toList();
//	}
	
//	@GetMapping("/current")
//	public ResponseEntity<ApiResponse<MatrixUserDTO>> getCurrentUser(HttpServletRequest request) throws Exception
//	{
//		return new ResponseEntity<>(ApiResponseUtil.success(this.createDTO(this.authService.getCurrentUser()), 
//															"Retrieved current user.", 
//															request),
//									HttpStatus.OK);
//	}
	
//	@GetMapping( "/{id}")
//	@ResponseStatus(HttpStatus.OK)
//	public MatrixUserDTO loadUser(@PathVariable("id") Long id)
//	{
//		return this.createDTO(this.userService.findById(id));
//	}
	
	public MatrixUserDTO createDTO(MatrixUser user)
	{
		return new MatrixUserDTO(user);
	}
	
	@GetMapping("/search/{q}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<MatrixUserDTO>>> searchUsers(@PathVariable("q") String searchString, HttpServletRequest request) throws Exception
	{
		List<MatrixUser> users = this.userService.search(searchString);
		
		List<MatrixUserDTO> userDTOs = users.stream().map(matrixUser->createDTO(matrixUser)).toList();
		return new ResponseEntity<>(ApiResponseUtil.success(userDTOs, 
															userDTOs.size() + " users found.", 
															request),
													HttpStatus.OK);
	}
	
	@GetMapping("/case_list")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<UserCaseRecord>>> getUserCaseList(HttpServletRequest request) throws Exception
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.userService.getUserCaseRecords(), 
															"Retrieved user's case list", 
															request),
													HttpStatus.OK);
	}
	
//////////////////////////////////////////////////////////////////////
//			POST MAPPTINGS
//////////////////////////////////////////////////////////////////////
	
	@PostMapping(path="/store", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<MatrixUserDTO>> storeUser(@RequestBody MatrixUser user, HttpServletRequest request)
	{
		authService.getCurrentUser().getAuthorities().forEach(ga->log.debug(ga.getAuthority()));
		MatrixUser savedUser = this.userService.updateUser(user);
		return new ResponseEntity<>(ApiResponseUtil.success(this.createDTO(savedUser), 
															"Created/Updated user", 
															request), HttpStatus.OK);
	}

//////////////////////////////////////////////////////////////////////
//PUT MAPPTINGS
//////////////////////////////////////////////////////////////////////
	
	@PatchMapping(path="/password", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	public MatrixUserDTO updatePassword(@RequestBody ChangePasswordMessage msg)
	{
		return this.createDTO(this.userService.updatePassword(msg));
	}
	
	@PatchMapping(path="/theme", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<MatrixUserDTO>> setTheme(@RequestBody SetThemeMessage msg, HttpServletRequest request)
	{
		MatrixUser u = this.userService.setTheme(msg);
		return new ResponseEntity<>(ApiResponseUtil.success(new MatrixUserDTO(u), 
										"Changed user theme to " + (msg.darkTheme()?"dark.":"light."), 
										request),
									HttpStatus.OK);
	}
}
