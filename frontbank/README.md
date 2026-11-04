# Front - Banco Digital

El frontend del proyecto, hecho en Angular 22.

## Correrlo

```bash
npm install
npm start
```

Se abre en http://localhost:4200. Para que funcione con datos reales la API tiene que estar corriendo en el puerto 8080.

## Cómo se conecta con la API

El front no llama directo a `localhost:8080`. Todo lo que empieza por `/api` lo redirige el archivo `proxy.conf.mjs` a la API. Así nos evitamos el problema de CORS.

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

## Si se sirve sin el proxy

Si algún día el front se publica aparte (con `ng build`), la API necesita tener CORS activado. En `docs/backend-cors.patch.md` está cómo hacerlo.
