package com.dca.matrix.authentication;

import com.dca.matrix.user.MatrixUserDTO;

public record AuthenticationResponseDTO(String accessToken, MatrixUserDTO user)
{
}
