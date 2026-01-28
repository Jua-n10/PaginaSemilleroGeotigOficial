# 🏗️ Arquitectura del Sistema de Solicitudes GEOTIG

## Diagrama de Flujo General

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PÁGINA WEB PRINCIPAL                             │
│  (JoinSectionAlt.tsx / SolicitudForm.tsx)                               │
└────────────────────────────┬────────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  FORMULARIO 📝   │
                    │  Validación     │
                    │  - XSS sanitize │
                    │  - Rate limit   │
                    │  - Honeypot     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────────────┐
                    │  FIREBASE FIRESTORE 🔥  │
                    │  collection: solicitudes│
                    │  - estado: pendiente    │
                    │  - fechaCreacion        │
                    │  - datos del estudiante │
                    └────────┬───────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼────────┐   ┌──▼──────┐    ┌────▼─────────┐
    │ AdminPanel 👩‍ 💼 │   │Monitor  │    │Notificaciones│
    │ - Ver todas     │   │Panel 👨‍💼│    │(Opcional)   │
    │ - Aceptar       │   │- Ver    │    │- Email      │
    │ - Rechazar      │   │- Revisar│    │- SMS        │
    │ - Eliminar      │   └────┬────┘    └─────────────┘
    │ - Estadísticas  │        │
    └────────┬────────┘        │
             │                 │
             └────────┬────────┘
                      │
           ┌──────────▼──────────┐
           │ Firestore actualiza │
           │ - estado: aceptada  │
           │ - fechaRevision     │
           │ - comentariosAdmin  │
           └─────────────────────┘
```

## Estructura de Componentes

```
src/
├── components/
│   ├── JoinSectionAlt.tsx           ← Formulario visible (página principal)
│   │
│   ├── solicitud/                   ← Nueva carpeta de componentes
│   │   ├── SolicitudForm.tsx        ← Componente reutilizable del formulario
│   │   └── SolicitudStats.tsx       ← Dashboard de estadísticas
│   │
│   ├── SolicitudesPanel.tsx         ← Panel de gestión (admin/monitor)
│   ├── AdminPanel.tsx               ← Panel administrativo
│   └── MonitorPanel.tsx             ← Panel del monitor
│
├── utils/
│   └── firebaseUtils.ts             ← Utilidades y funciones auxiliares
│
├── firabase.ts                      ← Configuración Firebase
│
└── styles/
    └── globals.css

firestore.rules                       ← Security Rules para Firestore

FIREBASE_SOLICITUDES_GUIDE.md        ← Documentación técnica
SISTEMA_SOLICITUDES_README.md        ← Guía de implementación
TESTING_MANUAL.ts                    ← Casos de test
ARQUITECTURA.md                      ← Este archivo
```

## Flujo de Datos en Tiempo Real

```
Usuario completa formulario
        │
        ▼
  ┌─────────────────┐
  │ SolicitudForm   │
  │  - Valida       │
  │  - Sanitiza     │
  │  - Rate limit   │
  └────────┬────────┘
           │
           ▼
    ┌──────────────┐
    │  Firestore   │
    │   addDoc()   │  ← Documento creado con estado: "pendiente"
    └──────┬───────┘
           │
           ▼
    ┌──────────────────────┐
    │ onSnapshot listener  │  ← Escucha cambios en tiempo real
    │  (SolicitudesPanel)  │
    └──────┬───────────────┘
           │
           ▼
    ┌──────────────────┐
    │ UI se actualiza  │
    │ - Nueva solicitud│
    │ - En tiempo real │
    └──────────────────┘
```

## Estados de una Solicitud

```
pendiente                    aceptada
    │                           ▲
    │                           │
    ├─────────────────────────►│
    │      Admin acepta          │
    │                            │
    ├────────────────────────────┘
    │      Admin rechaza
    │
    ▼
rechazada
```

**Estados y significado:**

- 🟡 **pendiente**: Solicitud recién llegada, sin revisar
- 🟢 **aceptada**: Estudiante aprobado para el semillero
- 🔴 **rechazada**: Solicitud no aprobada

## Validaciones en Capas

```
┌──────────────────────────────────────┐
│ 1. VALIDACIONES FRONTEND              │
│    (React Hook Form + Custom Logic)   │
├──────────────────────────────────────┤
│ ✓ Email válido                       │
│ ✓ Nombre 3-100 caracteres            │
│ ✓ Motivación 20-1000 caracteres      │
│ ✓ Campos no vacíos                   │
│ ✓ Rate limiting (10 seg)             │
│ ✓ Spam prevention (3 en 5 min)       │
│ ✓ XSS sanitización                   │
│ ✓ Honeypot anti-bots                 │
└────────────────┬─────────────────────┘
                 │ (Si pasa todo)
                 ▼
┌──────────────────────────────────────┐
│ 2. VALIDACIONES FIRESTORE            │
│    (Security Rules)                   │
├──────────────────────────────────────┤
│ ✓ Campos requeridos presentes        │
│ ✓ Tipos de datos correctos           │
│ ✓ Email válido (regex)               │
│ ✓ Longitudes dentro de límites       │
│ ✓ Estado en valores permitidos       │
└────────────────┬─────────────────────┘
                 │ (Si pasa todo)
                 ▼
    ┌─────────────────────────┐
    │ Documento Guardado ✅    │
    └─────────────────────────┘
```

## Flujo de Autenticación para Admin/Monitor

```
┌────────────────────────┐
│ Usuario intenta acceder│
│ a Admin Panel          │
└───────────┬────────────┘
            │
            ▼
   ┌────────────────────┐
   │ ¿Tiene credenciales│
   │ guardadas?         │
   └────┬───────────────┘
        │
        ├─NO──┐
        │     │
        │     ▼
        │   ┌──────────────────┐
        │   │ Mostrar LoginModal│
        │   └────┬─────────────┘
        │        │
        │        ▼
        │   ┌──────────────────┐
        │   │ Validar password │
        │   └────┬─────────────┘
        │
        └─SÍ────┐
                │
                ▼
        ┌──────────────────┐
        │ Acceder a Panel  │
        │ - Ver solicitudes│
        │ - Gestionar      │
        │ - Cambiar estado │
        └──────────────────┘
```

## Interacción de Componentes

```
App.tsx
  │
  ├── JoinSectionAlt.tsx
  │   └── SolicitudForm.tsx           ← Formulario principal
  │       └── (Firebase: addDoc)      ← Guarda en Firestore
  │
  ├── AdminPanel.tsx
  │   ├── LoginModal.tsx              ← Autenticación
  │   ├── SolicitudStats.tsx          ← Muestra estadísticas
  │   │   └── (Utils: calcularEstadisticas)
  │   │
  │   └── SolicitudesPanel.tsx        ← Gestión de solicitudes
  │       ├── (Firebase: onSnapshot)  ← Escucha en tiempo real
  │       ├── (Firebase: updateDoc)   ← Cambia estado
  │       ├── (Firebase: deleteDoc)   ← Elimina solicitud
  │       └── (Utils: formatearFecha, getEstadoColor)
  │
  └── MonitorPanel.tsx
      └── SolicitudesPanel.tsx        ← Solo lectura/revisión
```

## Seguridad - Capas de Protección

```
┌────────────────────────────────────────────────────────────┐
│              CAPAS DE SEGURIDAD                             │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  CAPA 1: PREVENCIÓN DE ATAQUES (Cliente)                   │
│  ├─ XSS: Sanitización de entrada                           │
│  ├─ CSRF: Honeypot field                                   │
│  ├─ Rate Limiting: Máximo 3 envíos en 5 min              │
│  └─ Validaciones: React Hook Form                         │
│                                                              │
│  CAPA 2: VALIDACIONES (Servidor)                           │
│  ├─ Firestore Security Rules                              │
│  ├─ Validación de tipos de datos                          │
│  ├─ Validación de longitudes                              │
│  └─ Validación de emails (regex)                          │
│                                                              │
│  CAPA 3: CONTROL DE ACCESO                                │
│  ├─ Lectura: Solo autenticados (admin/monitor)           │
│  ├─ Creación: Permitida públicamente                     │
│  ├─ Actualización: Solo autenticados                      │
│  └─ Eliminación: Solo admin                              │
│                                                              │
│  CAPA 4: AUDITORÍA                                        │
│  ├─ fechaCreacion: Timestamp automático                  │
│  ├─ fechaRevision: Cuando se revisa                      │
│  ├─ comentariosAdmin: Quién decidió                      │
│  └─ userAgent: Información del navegador                 │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

## Modelo de Datos - Documento Solicitud

```json
{
  "id": "auto_generado",
  "nombre": "string (3-100 chars)",
  "email": "string (email válido)",
  "programa": "string",
  "motivacion": "string (20-1000 chars)",
  "estado": "pendiente|aceptada|rechazada",
  "fechaCreacion": "Timestamp",
  "fechaRevision": "Timestamp|null",
  "comentariosAdmin": "string (0-1000 chars)",
  "userAgent": "string (opcional)",
  "ipAddress": "string (opcional)"
}
```

## Casos de Uso Principales

### 1. Estudiante Envía Solicitud

```
Usuario visita página →
Completa formulario →
Frontend valida →
Firebase guarda →
Se muestra confirmación
```

### 2. Admin Revisa Solicitudes

```
Admin accede panel →
Firestore carga datos en tiempo real →
Admin ve lista de solicitudes →
Hace clic en "Revisar" →
Ve detalles →
Decide aceptar/rechazar →
Escribe comentarios →
Confirma →
Firestore se actualiza automáticamente
```

### 3. Monitor Monitorea Solicitudes

```
Monitor accede →
Ve lista en tiempo real →
Puede filtrar/buscar →
Puede leer detalles →
NO puede eliminar →
NO puede cambiar estado
```

## Performance & Escalabilidad

```
Optimizaciones implementadas:

✓ Queries limitadas a 500 documentos (getSolicitudesQuery)
✓ Indexing en Firestore (estado, fechaCreacion)
✓ Caching con React state
✓ Real-time listeners (onSnapshot)
✓ Lazy loading de componentes
✓ Memoización con useMemo
```

## Próximas Mejoras Sugeridas

```
Corto Plazo:
├─ Notificaciones por email al aceptar/rechazar
├─ Exportar solicitudes a PDF/CSV
└─ Búsqueda avanzada por fecha rango

Mediano Plazo:
├─ Dashboard con gráficos (Chart.js)
├─ Sistema de scoring automático
├─ Integración con Google Sheets
└─ Backup automático

Largo Plazo:
├─ Machine Learning para selección
├─ Mobile app nativa
├─ Integración SSO (Google, Microsoft)
└─ Análisis predictivo de matriculación
```

---

**Documento actualizado:** 26 de enero de 2026
**Versión:** 1.0
**Estado:** ✅ Sistema en producción
