package com.dca.matrix.user;

public record ChangePasswordMessage(String currentPassword, String newPassword, String newPassword2)
{
}
