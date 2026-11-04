package org.example.bancodigitalbe.domain.exceptions;

import lombok.Getter;

@Getter
public class AccountNotFoundException extends RuntimeException {
    private final Long userId;

    public AccountNotFoundException(Long userId) {
        super("[!] el usuario {" + userId + "} no tiene cuenta bancaria");
        this.userId = userId;
    }

}
