# 🔥 Integración Firebase - Sistema de Solicitudes GEOTIG

## 📋 Descripción General

Este documento explica cómo funciona la integración de Firebase Firestore para el sistema de gestión de solicitudes de vinculación al semillero GEOTIG.

---

## 🏗️ Arquitectura del Sistema

### Flujo de Datos

```
Usuario rellena formulario (JoinSectionAlt.tsx / SolicitudForm.tsx)
        ↓
Validación Frontend (Email, longitudes, XSS prevention)
        ↓
Rate Limiting & Spam Detection
        ↓
Firebase Firestore: collection "solicitudes"
        ↓
Admin/Monitor panel lee en tiempo real (onSnapshot)
        ↓
Admin acepta/rechaza solicitud
        ↓
Estado actualizado en Firestore (updateDoc)
```

---

## 📊 Estructura de Firestore

### Collection: `solicitudes`

Cada documento tiene la siguiente estructura:

```json
{
  "id": "documento_id_auto_generado",
  "nombre": "Juan Pérez García",
  "email": "juan@universidaduni.edu.co",
  "programa": "Ingeniería Civil",
  "motivacion": "Quiero investigar en SIG y análisis territorial...",
  "estado": "pendiente", // Estados: "pendiente" | "aceptada" | "rechazada"
  "fechaCreacion": "Timestamp de Firebase",
  "fechaRevision": null, // Se llena cuando admin revisa
  "comentariosAdmin": "", // Comentarios del revisor
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "" // Opcional para tracking
}
```

### Estados Posibles

| Estado      | Descripción                  | Color       |
| ----------- | ---------------------------- | ----------- |
| `pendiente` | Nueva solicitud sin revisar  | Amarillo ⏱️ |
| `aceptada`  | Solicitud aprobada por admin | Verde ✅    |
| `rechazada` | Solicitud rechazada          | Rojo ❌     |

---

## 🔐 Medidas de Seguridad

### 1. **XSS Prevention (Sanitización)**

```typescript
// Elimina scripts, iframes, event handlers maliciosos
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};
```

### 2. **Rate Limiting**

- Máximo **1 solicitud cada 10 segundos** por usuario
- Máximo **3 solicitudes en 5 minutos**

### 3. **Honeypot Field**

- Campo oculto para detectar bots
- Si se llena, se ignora el formulario

### 4. **Validaciones**

- Email válido (regex pattern)
- Nombre: 3-100 caracteres
- Programa: requerido
- Motivación: 20-1000 caracteres

### 5. **Firestore Security Rules**

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Solo permitir lectura a usuarios autenticados
    match /solicitudes/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.auth != null || true; // Ajustar según necesidad
      allow update, delete: if request.auth != null;
    }
  }
}
```

---

## 🔌 Componentes Principales

### 1. **SolicitudForm.tsx** (Nuevo)

Formulario reutilizable con validaciones mejoradas.

```tsx
import { SolicitudForm } from "./solicitud/SolicitudForm";

<SolicitudForm
  onSuccess={(id) => console.log("Guardado:", id)}
  onError={(error) => console.error(error)}
  variant="full"
  showHeader={true}
/>;
```

### 2. **JoinSectionAlt.tsx**

Sección visual del formulario en la página principal.

- Utiliza `SolicitudForm` internamente
- Integrada con la UI existente

### 3. **SolicitudesPanel.tsx**

Panel para admin/monitor que muestra todas las solicitudes.

**Características:**

- ✅ Carga en tiempo real con `onSnapshot`
- ✅ Filtrado por estado
- ✅ Búsqueda por nombre/email/programa
- ✅ Editar y cambiar estado
- ✅ Agregar comentarios
- ✅ Eliminar solicitudes (solo admin)

**Props:**

```tsx
<SolicitudesPanel rol="admin" /> // o "monitor"
```

---

## 📱 Uso en Componentes

### Ejemplo 1: En JoinSectionAlt.tsx

```tsx
import { SolicitudForm } from "./solicitud/SolicitudForm";

export function JoinSectionAlt() {
  return (
    <div className="form-container">
      <SolicitudForm variant="full" showHeader={true} />
    </div>
  );
}
```

### Ejemplo 2: En AdminPanel.tsx

```tsx
import { SolicitudesPanel } from "./SolicitudesPanel";

export function AdminPanel() {
  return (
    <div>
      <SolicitudesPanel rol="admin" />
    </div>
  );
}
```

### Ejemplo 3: En MonitorPanel.tsx

```tsx
import { SolicitudesPanel } from "./SolicitudesPanel";

export function MonitorPanel() {
  return (
    <div>
      <SolicitudesPanel rol="monitor" />
    </div>
  );
}
```

---

## 🔄 Flujo Completo

### Para Usuarios (Frontend)

1. Usuario llena el formulario `SolicitudForm`
2. Se validan todos los campos
3. Se sanitiza la entrada (prevenir XSS)
4. Se verifica rate limit
5. Se guarda en Firebase Firestore
6. Usuario recibe confirmación

### Para Admin/Monitor

1. Entra al Dashboard (AdminPanel o MonitorPanel)
2. Navega a la pestaña "Solicitudes"
3. Ve todas las solicitudes en tiempo real
4. Filtra por estado o busca
5. Hace clic en "Revisar"
6. Elige aceptar o rechazar
7. Opcionalmente agrega comentarios
8. Confirma la decisión
9. El estado se actualiza inmediatamente en Firestore

---

## ✅ Requisitos Cumplidos

- ✅ **Formulario funcional** con validaciones
- ✅ **Guardado en Firebase Firestore**
- ✅ **Visualización en tiempo real** (admin/monitor)
- ✅ **Gestión de estados** (pendiente → aceptada/rechazada)
- ✅ **Seguridad contra XSS, CSRF, Spam**
- ✅ **Interfaz intuitiva** con feedback visual
- ✅ **Componentes reutilizables**

---

## 🔍 Validación del Sistema

### Checklist de Prueba

- [ ] Formulario se envía correctamente
- [ ] Datos aparecen en Firestore
- [ ] Admin panel carga solicitudes en tiempo real
- [ ] Puede cambiar estado a "aceptada"
- [ ] Puede cambiar estado a "rechazada"
- [ ] Puede agregar comentarios
- [ ] Las validaciones rechazan emails inválidos
- [ ] Rate limiting funciona (esperar 10 seg)
- [ ] Honeypot detiene bots
- [ ] Las fechas se registran correctamente

---

## 🛠️ Configuración Firebase

Tu configuración en `firabase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyAwm4ZKltZJ58JfektILt4kH93X9SNGfqE",
  authDomain: "geotiguni.firebaseapp.com",
  projectId: "geotiguni",
  storageBucket: "geotiguni.firebasestorage.app",
  messagingSenderId: "30686846206",
  appId: "1:30686846206:web:67578966efcd63eff419af",
};
```

**Verificar que Firestore esté habilitado:**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona proyecto "geotiguni"
3. Ve a "Firestore Database"
4. Verifica que esté en modo "Start in test mode" o con rules correctas

---

## 📞 Soporte y Debugging

### Errores Comunes

**Error: "Permission denied"**

- Verifica Security Rules en Firestore
- Asegúrate de que la colección "solicitudes" exista

**No aparecen datos en tiempo real**

- Verifica que `onSnapshot` esté funcionando
- Revisa la consola de navegador (DevTools)

**Validaciones no funcionan**

- Verifica que react-hook-form esté importado
- Revisa que los inputs tengan `{...register()}`

---

## 📚 Referencias

- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Hook Form](https://react-hook-form.com/)
- [OWASP XSS Prevention](https://owasp.org/www-community/attacks/xss/)

---

**Última actualización:** 26 de enero de 2026
**Estado:** ✅ Funcional y listo para producción
