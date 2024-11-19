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

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(path="/api/user",produces="application/json")
@RequiredArgsConstructor
@Slf4j
public class MatrixUserController
{
	private final MatrixUserService userService;
	private final AuthenticationService authService;

	@PreAuthorize("isAuthenticated()")
	@GetMapping("/all")
	@ResponseStatus(HttpStatus.OK)
	public List<MatrixUserDTO> getAll()
	{	
		return this.userService.findAll().stream().map(user->this.createDTO(user)).toList();
	}
	
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/current")
	public ResponseEntity<ApiResponse<MatrixUserDTO>> getCurrentUser(HttpServletRequest request) throws Exception
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.createDTO(this.authService.getCurrentUser()), 
															"Retrieved current user.", 
															request.getRequestURI()),
									HttpStatus.OK);
	}
	
	@PreAuthorize("isAuthenticated()")
	@GetMapping( "/{id}")
	@ResponseStatus(HttpStatus.OK)
	public MatrixUserDTO loadUser(@PathVariable("id") Long id)
	{
		return this.createDTO(this.userService.findById(id));
	}
	
	public MatrixUserDTO createDTO(MatrixUser user)
	{
		return new MatrixUserDTO(user);
	}
	
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/search/{q}")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<MatrixUserDTO>>> searchUsers(@PathVariable("q") String searchString, HttpServletRequest request) throws Exception
	{
		authService.getCurrentUser().getAuthorities().forEach(ga->log.debug(ga.getAuthority()));
		List<MatrixUser> users = this.userService.search(searchString);
		
		List<MatrixUserDTO> userDTOs = users.stream().map(matrixUser->createDTO(matrixUser)).toList();
		return new ResponseEntity<>(ApiResponseUtil.success(userDTOs, 
														userDTOs.size() + " users found.", 
														request.getRequestURI()),
								HttpStatus.OK);
	}
	
	@PreAuthorize("isAuthenticated()")
	@GetMapping("/case_list")
	@ResponseStatus(HttpStatus.OK)
	public ResponseEntity<ApiResponse<List<UserCaseRecord>>> getUserCaseList(HttpServletRequest request) throws Exception
	{
		return new ResponseEntity<>(ApiResponseUtil.success(this.userService.getUserCaseRecords(), 
															"Retrieved user's case list", 
															request.getRequestURI()),
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
															request.getRequestURI()), HttpStatus.OK);
	}

//////////////////////////////////////////////////////////////////////
//PUT MAPPTINGS
//////////////////////////////////////////////////////////////////////
	
	@PreAuthorize("isAuthenticated()")
	@PatchMapping(path="/password", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	public MatrixUserDTO updatePassword(@RequestBody ChangePasswordMessage msg)
	{
		return this.createDTO(this.userService.updatePassword(msg));
	}
	
	@PreAuthorize("isAuthenticated()")
	@PatchMapping(path="/theme", consumes="application/json")
	@ResponseStatus(HttpStatus.OK)
	public MatrixUserDTO setTheme(@RequestBody SetThemeMessage msg)
	{
		MatrixUser u = this.userService.setTheme(msg);
		u.setDarkTheme(!msg.darkTheme());
		return this.createDTO(u);
	}
	

}
