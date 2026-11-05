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

Requisitos: Java 21, MySQL (XAMPP) y Node.js 24.

La API y el front quedan juntos en **http://localhost:4200**: Spring Boot sirve el
front compilado de Angular y la API en el mismo puerto (sin proxy y sin CORS).

### 1) Base de datos

Inicia MySQL desde XAMPP. La primera vez crea la base:

```sql
CREATE DATABASE bank_database;
```

> Si tu MySQL tiene contraseña, cámbiala en `apibank/src/main/resources/application.yaml`.

### 2) Instalar dependencias del front (solo la primera vez)

```bash
cd frontbank
npm install
```

### 3) Levantar todo

```bash
cd apibank
.\gradlew.bat bootRun
```

`bootRun` compila el front automáticamente si hubo cambios (tarea `buildFront`) y luego
arranca la API. Cuando aparezca **LISTO!** abre http://localhost:4200

> Primero regístrate; luego ve a Seguridad y activa el PIN. Sin PIN no deja retirar.

Cada operación (registro, login, depósito, retiro...) se muestra en la terminal de la API
con las consultas SQL que se ejecutan en MySQL y un resumen con el resultado.
Para apagar la API: `Ctrl + C`.

### Modo desarrollo del front (opcional)

Con la API corriendo en el 4200, `npm start` dentro de `frontbank` abre el front en
http://localhost:4201 con recarga automática. El `proxy.conf.mjs` manda `/users`,
`/accounts` y `/auth` a la API.

### Puertos

| Qué | Puerto |
| --- | ------ |
| API + front compilado | 4200 |
| Front en modo desarrollo (`npm start`) | 4201 |
| MySQL | 3306 |

### Problemas comunes

| Síntoma | Solución |
| ------- | -------- |
| `Port 4200 was already in use` | Hay otro proceso en el 4200 (por ejemplo un `npm start` viejo). Ciérralo con `Ctrl + C` y vuelve a correr `bootRun`. |
| La API no arranca y menciona la base de datos | MySQL no está encendido: inícialo en XAMPP. |
| `npm` no se reconoce al correr `bootRun` | La terminal no tiene Node en el PATH; ábrela de nuevo (`node -v` debe mostrar 24). |
| El front muestra un aviso de "Modo demo activo" | Desmarca la casilla "Modo demo" en el login; en ese modo no se usa la API. |
| El navegador muestra una versión vieja del front | Recarga con `Ctrl + F5`. |

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
