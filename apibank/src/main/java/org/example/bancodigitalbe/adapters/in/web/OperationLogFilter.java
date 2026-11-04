package org.example.bancodigitalbe.adapters.in.web;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

import static org.example.bancodigitalbe.ConsoleColors.*;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class OperationLogFilter extends OncePerRequestFilter {

    private static final DateTimeFormatter HOUR = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String operation = operationName(request.getMethod(), request.getRequestURI());
        if (operation == null) {
            chain.doFilter(request, response);
            return;
        }

        ContentCachingResponseWrapper wrapper = new ContentCachingResponseWrapper(response);
        long start = System.currentTimeMillis();
        chain.doFilter(request, wrapper);
        long time = System.currentTimeMillis() - start;

        int status = wrapper.getStatus();
        String user = username(request);
        String body = new String(wrapper.getContentAsByteArray(), StandardCharsets.UTF_8);
        wrapper.copyBodyToResponse();

        String color = status < 400 ? GREEN : status < 500 ? YELLOW : RED;
        String result = status < 400 ? "OK   " : "ERROR";

        System.out.println();
        System.out.println("  " + GRAY + LocalTime.now().format(HOUR) + RESET
                + "  " + color + BOLD + result + RESET
                + "  " + BOLD + String.format("%-18s", operation) + RESET
                + "  " + CYAN + String.format("%-15s", user) + RESET
                + "  " + color + status + RESET
                + GRAY + "  " + time + " ms" + RESET);
        if (status == 401) {
            String reason = user.equals("-") ? "peticion sin credenciales" : "usuario o contrasena incorrectos";
            System.out.println("            " + GRAY + reason + RESET);
        } else if (!body.isBlank()) {
            System.out.println("            " + GRAY + shorten(body) + RESET);
        }
    }

    private String operationName(String method, String path) {
        return switch (method + " " + path) {
            case "POST /users/register" -> "REGISTRO";
            case "POST /auth/login" -> "LOGIN";
            case "GET /accounts/me/balance" -> "CONSULTA SALDO";
            case "POST /accounts/me/deposits" -> "DEPOSITO";
            case "POST /accounts/me/withdrawals" -> "RETIRO";
            case "PATCH /users/me" -> "DATOS PERSONALES";
            case "PUT /users/me/password" -> "CAMBIO CONTRASENA";
            case "PUT /users/me/pin" -> "CAMBIO PIN";
            default -> null;
        };
    }

    private String username(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Basic ")) {
            return "-";
        }
        try {
            String decoded = new String(Base64.getDecoder().decode(header.substring(6)), StandardCharsets.UTF_8);
            return decoded.split(":")[0];
        } catch (IllegalArgumentException e) {
            return "-";
        }
    }

    private String shorten(String text) {
        return text.length() > 200 ? text.substring(0, 200) + "..." : text;
    }
}
