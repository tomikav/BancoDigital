# Front - Banco Digital

El frontend del proyecto, hecho en Angular 22.

## Correrlo

Normalmente no se corre aparte: la API lo compila y lo sirve en el mismo puerto.

```bash
npm install
```

Luego, en `apibank`, `.\gradlew.bat bootRun` compila el front (si hubo cambios) y deja todo en http://localhost:4200.

Para trabajar en el front con recarga automática (con la API ya corriendo en el 4200):

```bash
npm start
```

Se abre en http://localhost:4201.

## Cómo se conecta con la API

El front llama a la API con rutas relativas (`/users`, `/accounts`, `/auth`). Cuando lo sirve Spring Boot es el mismo origen, así que no hay CORS. En modo desarrollo el archivo `proxy.conf.mjs` manda esas rutas al puerto 4200.

La API usa autenticación Basic, entonces al iniciar sesión guardo el usuario y la clave y el `auth.interceptor` los manda en cada petición. Si la API responde 401, te devuelve al login.

## Carpetas

```
src/app/
  core/    -> servicios, interceptores, guards y modelos
  pages/   -> una carpeta por pantalla
```

Pantallas:

- `login` y `register` → entrar y crear cuenta
- `shell` → el menú de la izquierda
- `dashboard` → saldo (HU-01)
- `deposit` → depositar (HU-02)
- `profile` → datos personales (HU-03)
- `security` → contraseña y PIN (HU-04)
- `withdraw` → retirar (HU-05)

## Modo demo

En el login se puede marcar **Modo demo** para probar sin la API. Simula las respuestas en el navegador con las mismas reglas del backend. Usuario `demo`, clave `demo1234`, PIN `1234`.

## Si se sirve aparte

Si algún día el front se publica en otro servidor, la API ya tiene CORS para `localhost`. En `docs/backend-cors.patch.md` está el detalle.
