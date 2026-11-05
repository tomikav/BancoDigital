package org.example.bancodigitalbe;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import static org.example.bancodigitalbe.ConsoleColors.*;

@Component
public class StartupMessage {

    private static final String[] LISTO = {
            " _     ___ ____ _____ ___  _ ",
            "| |   |_ _/ ___|_   _/ _ \\| |",
            "| |    | |\\___ \\ | || | | | |",
            "| |___ | | ___) || || |_| |_|",
            "|_____|___|____/ |_| \\___/(_)"
    };

    @Value("${server.port:4200}")
    private String port;

    @Value("${spring.application.name:api}")
    private String name;

    @EventListener(ApplicationReadyEvent.class)
    public void show(ApplicationReadyEvent event) {
        double seconds = event.getTimeTaken().toMillis() / 1000.0;

        System.out.println();
        for (String line : LISTO) {
            System.out.println("  " + GREEN + BOLD + line + RESET);
        }
        System.out.println();
        System.out.println("  " + GREEN + BOLD + "API Banco Digital encendida" + RESET
                + GRAY + " (" + name + ") en " + String.format("%.1f", seconds) + " s" + RESET);
        System.out.println();
        System.out.println("  " + GREEN + "->" + RESET + "  " + BOLD + "Local:" + RESET + "   "
                + CYAN + "http://localhost:" + BOLD + port + RESET + CYAN + "/" + RESET);
        System.out.println("  " + GREEN + "->" + RESET + "  " + BOLD + "MySQL:" + RESET + "   "
                + GRAY + "bank_database en localhost:3306" + RESET);
        System.out.println("  " + GREEN + "->" + RESET + "  " + GRAY + "presiona " + RESET + BOLD + "Ctrl + C"
                + RESET + GRAY + " para apagarla" + RESET);
        System.out.println();
    }

}
