# Instrucciones para agentes AI (Copilot)

Breve: este repo es una SPA en React (Vite) que usa Firebase Firestore para un sistema de "solicitudes".

- **Arrancar**: `npm i` → `npm run dev`. Producción: `npm run build`.
- **Stack**: Vite + React 18, TypeScript, Tailwind-style utility classes, Firebase v12 (cliente).

Arquitectura (visión rápida)

- Cliente React hace todas las lecturas/escrituras a Firestore directamente (no hay backend desplegado aquí).
- Hay una carpeta `functions/` preparada para Cloud Functions pero actualmente `functions/src/index.ts` está vacía.
- El flujo clave: formulario en `src/components/solicitud/SolicitudForm.tsx` → sanitiza y valida → guarda en colección `solicitudes` en Firestore.

Puntos críticos / archivos clave

- Firebase: [src/firabase.ts](src/firabase.ts) — contiene `app`, `auth`, `db` y la configuración del proyecto.
- Utilidades y modelos: [src/utils/firebaseUtils.ts](src/utils/firebaseUtils.ts) — conversión de documentos, validaciones (`isValidEmail`, `validateSolicitudData`), sanitización (`sanitizeInput`), y `getSolicitudesQuery()` (limite 500).
- Entrypoint: [src/main.tsx](src/main.tsx) y [src/App.tsx](src/App.tsx). Puntos de control UI: `AdminPanel`, `MonitorPanel`, `LoginModal`.
- Tests manuales y guía: `TESTING_MANUAL.ts` contiene los casos de prueba y guías de ejecución.

Convenciones y patrones específicos del proyecto

- Idioma: comentarios y mensajes en español; formato de fecha por defecto `es-CO` en utilidades (`formatearFecha`).
- Roles y almacenamiento local: el UI usa `localStorage` con claves `geotig_user` y `geotig_role` (valores esperados: `'admin' | 'monitor'`). Ejemplo en `src/App.tsx`.
- Sanitización: se espera que todo texto de usuario pase por `sanitizeInput` (XSS prevention) antes de guardarse.
- Estadísticas: `calcularEstadisticas(solicitudes: Solicitud[])` en `firebaseUtils` — usarla para dashboards.
- Límite de lectura: `getSolicitudesQuery()` aplica `limit(500)` y ordena por `fechaCreacion desc` — respeta esto para evitar lecturas excesivas.

Integraciones externas

- Firebase (Firestore + Auth) — la app asume permisos/Rules en `firestore.rules` en la raíz.
- Email/otras librerías: `@emailjs/browser` incluido; revisar `package.json` para versiones y cambios.

Desarrollo y depuración rápida

- Logs: `src/main.tsx` hace `console.log('Firebase listo:', app)` para comprobar la inicialización.
- Si se requiere funciones server-side, implementar en `functions/src` y desplegar con Firebase CLI (no configurado en este repo).

Cómo contribuir cambios a comportamiento de datos

- Para cambiar validaciones o sanitización, editar `src/utils/firebaseUtils.ts` (punto único donde están las reglas de validación usadas por el cliente).
- Para cambiar estructura de Firestore (nombres de campos o colección), actualizar `firebaseUtils` y los componentes que consumen los campos (ej. `SolicitudesPanel.tsx`).

Ejemplos concretos (copy/paste)

- Obtener la query de solicitudes:

```ts
import { getSolicitudesQuery } from "src/utils/firebaseUtils";
const q = getSolicitudesQuery();
```

- Chequear role en App:

```ts
const role = localStorage.getItem("geotig_role");
if (role === "admin") {
  /* abrir AdminPanel */
}
```

Limitaciones y supuestos descubiertos

- No hay tests automatizados ni CI configurado; la verificación se hace manual según `TESTING_MANUAL.ts`.
- `functions/` está vacío: no hay lógica server-side implementada por defecto.

Si algo no está claro o faltan convenciones (ej. reglas de deploy de Firebase, variables de entorno, o estructura de usuarios), dime qué parte quieres que amplíe y lo actualizo.
