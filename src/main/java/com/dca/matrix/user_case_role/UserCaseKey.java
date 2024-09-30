package com.dca.matrix.user_case_role;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserCaseKey
{
	@Column(name = "user_id")
	@NotNull
	private Long userId;
	
	@Column(name = "case_id")
	@NotNull
	private Long caseId;
	
	public void setCaseId(Long caseId)
	{
		this.caseId = caseId;
	}
}

