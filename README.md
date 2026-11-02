# Banco Digital

Plataforma de banca digital — Parcial final de Análisis y Diseño de Sistemas.

Monorepo con dos piezas que se comunican por una API REST:

| Carpeta | Qué es | Stack |
|---|---|---|
| [`backend/`](backend) | API REST con arquitectura limpia (hexagonal) | Java 21, Spring Boot 4.1.2, Spring Security (HTTP Basic + BCrypt), Spring Data JPA, MySQL, Gradle |
| `frontend/` | Panel web del cliente *(en construcción)* | Angular 22 |

## Funcionalidades (historias de usuario)

| HU | Funcionalidad | Puntos |
|---|---|---|
| HU-01 | Consulta de saldo en tiempo real | 2 |
| HU-02 | Depósito de fondos | 3 |
| HU-03 | Actualización de datos personales | 3 |
| HU-04 | Modificación de credenciales (clave y PIN) | 5 |
| HU-05 | Retiro de efectivo (cajero inteligente) | 8 |

## Correr el backend

Requisitos: JDK 21 y MySQL corriendo en `localhost:3306`.

```sql
CREATE DATABASE bank_database;
```

```bash
cd backend
./gradlew bootRun        # Windows: .\gradlew.bat bootRun
```

La API queda en `http://localhost:8080`. Usuario y clave de MySQL en `backend/src/main/resources/application.yaml`.

## Flujo de ramas

`feature` → `dev` → `main`. Todo se desarrolla en `feature`, se integra por Pull Request a `dev`, se verifica y luego se integra a `main`.

## Créditos

- Backend: [JavierWebDev](https://github.com/JavierWebDev) — historial original conservado en este repo.
- Frontend: David Gómez.
