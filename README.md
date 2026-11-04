# Banco Digital

**Parcial final - Análisis y Diseño de Sistemas**

---

Banca digital donde el usuario puede ver su saldo, depositar, cambiar sus datos,
cambiar su contraseña y su PIN, y retirar efectivo como si estuviera en un cajero.

## Funcionalidades

| Código | Pantalla | Qué hace |
| ------ | -------- | -------- |
| HU-01 | Consulta de saldo | Muestra el saldo, el número de cuenta y la hora |
| HU-02 | Depósito | Deposita con montos rápidos; valida vacío, $0 y negativos |
| HU-03 | Datos personales | Cambia correo, teléfono y dirección |
| HU-04 | Credenciales | Cambia la contraseña y activa o cambia el PIN |
| HU-05 | Retiro de efectivo | Retira con PIN (mínimo $10.000, tope $1.000.000 al día) |

## Estructura del repositorio

| Carpeta | Contenido | Tecnología |
| ------- | --------- | ---------- |
| `apibank/` | Backend / API | Spring Boot - Java 21 |
| `frontbank/` | Frontend | Angular |

## Cómo correrlo

Requisitos: Java 21, MySQL y Node.js. Se levantan las dos partes, cada una en su terminal.

### 1) API

```sql
CREATE DATABASE bank_database;
```

```bash
cd apibank
.\gradlew.bat bootRun
```

Queda en http://localhost:8080

> Si tu MySQL tiene contraseña, cámbiala en `apibank/src/main/resources/application.yaml`.

### 2) Frontend

```bash
cd frontbank
npm install
npm start
```

Queda en http://localhost:4200

> Primero regístrate; luego ve a Seguridad y activa el PIN. Sin PIN no deja retirar.

### Modo demo (sin API)

Si no hay MySQL o la API no arranca, en el login marca la casilla "Modo demo"
y se simula todo en el navegador.

- Usuario: `demo`
- Contraseña: `demo1234`
- PIN: `1234`

## Ramas

- `develop` -> rama de integración (se arma y se prueba todo aquí).
- `main`    -> entrega final (la versión que se revisa).

## Integrantes

- Javier Andrés Gómez Labrador - backend
- David Gómez - frontend
