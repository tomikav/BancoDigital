# Banco Digital

Proyecto para el parcial final de Análisis y Diseño de Sistemas.

La idea es una banca digital donde el usuario puede ver su saldo, depositar, cambiar sus datos, cambiar su clave y su PIN, y retirar plata como si estuviera en un cajero.

## Qué hay en el repo

- `apibank/` → el backend, hecho en Spring Boot por Javier
- `frontbank/` → el frontend en Angular (lo estoy armando por partes)

## Cómo correr la API

Se necesita Java 21 y MySQL.

1. Crear la base de datos en MySQL:
   ```sql
   CREATE DATABASE bank_database;
   ```
2. Entrar a la carpeta y correrla:
   ```bash
   cd apibank
   .\gradlew.bat bootRun
   ```
3. Queda en http://localhost:8080

Si tu MySQL tiene contraseña, hay que cambiarla en `apibank/src/main/resources/application.yaml`.

## Cómo correr el front

```bash
cd frontbank
npm install
npm start
```

Queda en http://localhost:4200

## Ramas

Trabajamos en `feature`, de ahí pasamos a `dev` con un pull request y cuando todo funciona lo pasamos a `main`.

## Integrantes

- Javier Andrés Gómez Labrador — backend
- Cristhian David Gómez Mendoza — frontend
