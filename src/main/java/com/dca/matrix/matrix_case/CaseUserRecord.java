package com.dca.matrix.matrix_case;

public record CaseUserRecord(Long caseId, Long userId, Long roleId, String username, String lastName, String firstName, Long profileImageId, boolean enabled){}
