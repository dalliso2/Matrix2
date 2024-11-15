package com.dca.matrix.authentication;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AuthenticationRequestDTO(@NotNull @Size(max=255) String username, @NotNull @Size(max=255) String password)
{

}
