package org.example.bancodigitalbe.domain.exceptions;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class InvalidAmountException extends RuntimeException {
    private final BigDecimal amount;

    public InvalidAmountException(BigDecimal amount) {
        super("[!] el monto {" + amount + "} debe ser mayor a cero");
        this.amount = amount;
    }

}
