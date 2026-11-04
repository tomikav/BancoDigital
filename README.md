# Banco Digital

Proyecto para el parcial final de Análisis y Diseño de Sistemas.

Es una banca digital donde el usuario puede ver su saldo, depositar, cambiar sus datos, cambiar su clave y su PIN, y retirar plata como si estuviera en un cajero.

## Qué hay en el repo

- `apibank/` → el backend, hecho en Spring Boot por Javier
- `frontbank/` → el frontend, hecho en Angular

## Lo que se puede hacer

- **HU-01** Ver el saldo de la cuenta
- **HU-02** Depositar plata
- **HU-03** Cambiar correo, teléfono y dirección
- **HU-04** Cambiar la contraseña y el PIN
- **HU-05** Retirar efectivo (con PIN, mínimo de $10.000, tope de $1.000.000 al día y el cajero te dice qué billetes te da)

## Cómo correrlo

Hay que levantar las dos partes, cada una en su terminal.

### 1. La API

Se necesita Java 21 y MySQL.

```sql
CREATE DATABASE bank_database;
```

```bash
cd apibank
.\gradlew.bat bootRun
```

Queda en http://localhost:8080. Si tu MySQL tiene contraseña, cámbiala en `apibank/src/main/resources/application.yaml`.

### 2. El front

```bash
cd frontbank
npm install
npm start
```

Queda en http://localhost:4200

Primero hay que registrarse, luego ir a **Seguridad** y activar el PIN, porque sin PIN no deja retirar.

### Sin la API

Si no tienes MySQL o la API no arranca, en el login hay una casilla de **Modo demo** que simula todo en el navegador. Usuario `demo`, contraseña `demo1234` y PIN `1234`.

## Ramas

Trabajamos en `feature`, de ahí pasamos a `dev` con un pull request y cuando todo funciona lo pasamos a `main`.

## Integrantes

- Javier Andrés Gómez Labrador — backend
- David Gómez — frontend
