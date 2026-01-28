/**
 * Test Manual - Sistema de Solicitudes GEOTIG
 *
 * Este archivo contiene casos de test para validar:
 * - Guardado en Firebase
 * - Validaciones de formulario
 * - Gestión de estados
 * - Security Rules
 */

export interface TestCase {
  nombre: string;
  descripcion: string;
  pasos: string[];
  resultadoEsperado: string;
  completado?: boolean;
  notas?: string;
}

export const MANUAL_TEST_CASES: TestCase[] = [
  // ===== PRUEBAS DE FORMULARIO =====
  {
    nombre: "Test 1.1: Formulario valida campos requeridos",
    descripcion: "Verificar que el formulario requiere todos los campos",
    pasos: [
      "1. Ir a la sección 'Solicita tu vinculación'",
      "2. Intentar enviar con campos vacíos",
      "3. Verificar mensajes de error",
    ],
    resultadoEsperado: "Debe mostrar errores para cada campo vacío sin enviar",
  },

  {
    nombre: "Test 1.2: Validación de email",
    descripcion: "Email inválido debe ser rechazado",
    pasos: [
      "1. Llenar formulario con email inválido (ej: 'notanemail')",
      "2. Intentar enviar",
    ],
    resultadoEsperado: "Debe mostrar error 'Email inválido'",
  },

  {
    nombre: "Test 1.3: Validación de longitud de nombre",
    descripcion: "Nombre debe tener entre 3 y 100 caracteres",
    pasos: [
      "1. Ingresar nombre con 1-2 caracteres",
      "2. Verificar mensaje de error",
      "3. Ingresar nombre válido y completar",
    ],
    resultadoEsperado: "Error inicial, luego aceptar con nombre válido",
  },

  {
    nombre: "Test 1.4: Validación de motivación",
    descripcion: "Motivación debe tener 20-1000 caracteres",
    pasos: [
      "1. Ingresar motivación corta (< 20 caracteres)",
      "2. Verificar error",
      "3. Ingresar motivación válida",
    ],
    resultadoEsperado: "Error con texto corto, aceptar con 20+ caracteres",
  },

  // ===== PRUEBAS DE GUARDADO =====
  {
    nombre: "Test 2.1: Guardar solicitud en Firebase",
    descripcion: "Solicitud debe guardarse en Firestore correctamente",
    pasos: [
      "1. Completar formulario con datos válidos",
      "2. Hacer clic en 'Enviar Solicitud'",
      "3. Esperar confirmación",
      "4. Abrir Firebase Console → Firestore → solicitudes",
      "5. Verificar que aparezca el nuevo documento",
    ],
    resultadoEsperado:
      "Toast verde diciendo 'Solicitud enviada' y nuevo doc en Firestore",
  },

  {
    nombre: "Test 2.2: Datos correctos en Firestore",
    descripcion: "Verificar que los datos se guarden exactamente",
    pasos: [
      "1. Guardar una solicitud",
      "2. Abrir en Firestore el documento creado",
      "3. Verificar estructura de datos",
    ],
    resultadoEsperado: `Documento debe contener:
      - nombre (string)
      - email (string)
      - programa (string)
      - motivacion (string)
      - estado: "pendiente"
      - fechaCreacion (Timestamp)
      - fechaRevision: null
      - comentariosAdmin: ""`,
  },

  {
    nombre: "Test 2.3: Timestamp se registra automáticamente",
    descripcion: "fechaCreacion debe ser Timestamp de servidor",
    pasos: ["1. Enviar solicitud", "2. Verificar fechaCreacion en Firestore"],
    resultadoEsperado: "fechaCreacion debe ser Timestamp con fecha/hora actual",
  },

  // ===== PRUEBAS DE RATE LIMITING =====
  {
    nombre: "Test 3.1: Rate limiting - esperar 10 segundos",
    descripcion: "No permitir envíos más rápido de 10 segundos",
    pasos: [
      "1. Enviar una solicitud",
      "2. Inmediatamente completar otro formulario",
      "3. Intentar enviar segunda solicitud",
    ],
    resultadoEsperado:
      "Toast de error: 'Por favor espera unos segundos antes...'",
  },

  {
    nombre: "Test 3.2: Spam prevention - máximo 3 en 5 minutos",
    descripcion: "Limitar a 3 solicitudes en 5 minutos",
    pasos: [
      "1. Enviar primera solicitud (esperar 10 seg)",
      "2. Enviar segunda solicitud (esperar 10 seg)",
      "3. Enviar tercera solicitud (esperar 10 seg)",
      "4. Intentar enviar cuarta solicitud",
    ],
    resultadoEsperado: "Toast de error: 'Has alcanzado el límite de envíos'",
  },

  {
    nombre: "Test 3.3: Honeypot detecta bots",
    descripcion: "Campo oculto debe detectar bots",
    pasos: [
      "1. Abrir consola del navegador",
      "2. Inspeccionar elemento input con name='honeypot'",
      "3. Rellenar campo honeypot",
      "4. Enviar formulario",
    ],
    resultadoEsperado:
      "Formulario ignora el envío (sin error visible al usuario)",
  },

  // ===== PRUEBAS DE ADMIN PANEL =====
  {
    nombre: "Test 4.1: Admin carga solicitudes en tiempo real",
    descripcion: "SolicitudesPanel debe cargar datos de Firestore",
    pasos: [
      "1. Acceder a Admin Panel",
      "2. Ir a pestaña 'Solicitudes'",
      "3. Verificar que carguen las solicitudes",
    ],
    resultadoEsperado:
      "Debe mostrar lista de solicitudes del Firestore con estado 'Pendiente'",
  },

  {
    nombre: "Test 4.2: Filtrado de solicitudes por estado",
    descripcion: "Poder filtrar por Pendiente, Aceptada, Rechazada",
    pasos: [
      "1. En SolicitudesPanel, hacer clic en filtros",
      "2. Seleccionar 'Pendiente'",
      "3. Luego 'Aceptada'",
      "4. Luego 'Rechazada'",
      "5. Finalmente 'Todos'",
    ],
    resultadoEsperado:
      "Lista debe actualizarse mostrando solo solicitudes del estado seleccionado",
  },

  {
    nombre: "Test 4.3: Búsqueda por nombre/email",
    descripcion: "Poder buscar solicitudes por nombre o email",
    pasos: [
      "1. En SolicitudesPanel, escribir en campo de búsqueda",
      "2. Ingresar nombre de un estudiante",
      "3. Verificar que filtre resultados",
      "4. Intentar con email",
    ],
    resultadoEsperado:
      "Lista debe mostrar solo solicitudes que coincidan con búsqueda",
  },

  {
    nombre: "Test 4.4: Cambiar estado de solicitud",
    descripcion: "Admin puede cambiar estado a Aceptada o Rechazada",
    pasos: [
      "1. Hacer clic en botón 'Revisar' de una solicitud",
      "2. En el modal, seleccionar 'ACEPTAR'",
      "3. Agregar comentario opcional",
      "4. Hacer clic en 'Confirmar Aceptación'",
    ],
    resultadoEsperado: `Toast de éxito y:
      - Estado cambia a "aceptada" (verde)
      - fechaRevision se actualiza
      - comentariosAdmin se guarda en Firestore`,
  },

  {
    nombre: "Test 4.5: Cambiar a estado Rechazada",
    descripcion: "Admin puede rechazar una solicitud",
    pasos: [
      "1. Abrir modal de una solicitud 'Pendiente'",
      "2. Seleccionar 'RECHAZAR'",
      "3. Agregar motivo en comentarios",
      "4. Confirmar",
    ],
    resultadoEsperado:
      "Estado cambia a 'rechazada' (rojo) con comentarios guardados",
  },

  {
    nombre: "Test 4.6: Eliminar solicitud (solo Admin)",
    descripcion: "Solo admin puede eliminar solicitudes",
    pasos: [
      "1. Hacer clic en ícono de papelera",
      "2. Confirmar eliminación",
      "3. Verificar en Firestore",
    ],
    resultadoEsperado: "Documento eliminado de Firestore y lista actualizada",
  },

  // ===== PRUEBAS DE MONITOR PANEL =====
  {
    nombre: "Test 5.1: Monitor ve solicitudes (lectura)",
    descripcion: "Monitor puede ver pero no eliminar solicitudes",
    pasos: [
      "1. Acceder con cuenta de Monitor",
      "2. Ir a 'Solicitudes'",
      "3. Verificar que no tenga botón de papelera",
    ],
    resultadoEsperado:
      "Monitor ve lista pero sin opción de eliminar (solo review)",
  },

  // ===== PRUEBAS DE SEGURIDAD =====
  {
    nombre: "Test 6.1: XSS prevention - script en nombre",
    descripcion: "Prevenir inyección de scripts en campos",
    pasos: [
      "1. En campo nombre, ingresar: <script>alert('xss')</script>",
      "2. Enviar formulario",
      "3. Verificar en Firestore que script fue eliminado",
    ],
    resultadoEsperado:
      "Script debe ser removido, solo guardarse el texto sanitizado",
  },

  {
    nombre: "Test 6.2: XSS prevention - evento onclick",
    descripcion: "Remover event handlers maliciosos",
    pasos: ["1. Ingresar: onclick=alert('xss')", "2. Verificar en Firestore"],
    resultadoEsperado: "Event handler debe ser removido",
  },

  {
    nombre: "Test 6.3: Validación servidor (Firestore Rules)",
    descripcion: "Firestore rechaza datos inválidos",
    pasos: [
      "1. Abrir Firestore Console",
      "2. Intentar crear documento sin 'nombre' field",
      "3. Esperar resultado",
    ],
    resultadoEsperado: "Debe obtener error de permisos/validación",
  },

  // ===== PRUEBAS DE ESTADÍSTICAS =====
  {
    nombre: "Test 7.1: Dashboard muestra estadísticas",
    descripcion: "SolicitudStats calcula y muestra métricas",
    pasos: [
      "1. En Admin Panel con varias solicitudes",
      "2. Verificar estadísticas en SolicitudStats",
      "3. Cambiar estado de algunas solicitudes",
      "4. Verificar actualización de números",
    ],
    resultadoEsperado: `Debe mostrar:
      - Total de solicitudes
      - Pendientes
      - Aceptadas
      - Rechazadas
      - Tasa de aceptación %`,
  },

  // ===== PRUEBAS DE EXPERIENCIA USUARIO =====
  {
    nombre: "Test 8.1: Mensaje de confirmación post-envío",
    descripcion: "Usuario recibe feedback visual después de envío",
    pasos: ["1. Enviar formulario válido", "2. Observar pantalla"],
    resultadoEsperado:
      "Toast verde con mensaje de éxito y modal de confirmación",
  },

  {
    nombre: "Test 8.2: Formulario se limpia después de envío",
    descripcion: "Campos del formulario deben resetearse",
    pasos: [
      "1. Enviar solicitud",
      "2. Esperar confirmación",
      "3. Verificar si campos están vacíos",
    ],
    resultadoEsperado:
      "Todos los campos deben estar vacíos y listos para nuevo envío",
  },
];

/**
 * Guía de ejecución de tests
 */
export const TESTING_GUIDE = `
🧪 GUÍA DE EJECUCIÓN DE TESTS MANUALES

Sigue estos pasos para validar que el sistema funcione correctamente:

1️⃣ TESTS DE FORMULARIO (Pruebas 1.1 - 1.4)
   - Verifica que todas las validaciones funcionen
   - Asegúrate de ver mensajes de error claros
   - Tiempo estimado: 10 minutos

2️⃣ TESTS DE GUARDADO (Pruebas 2.1 - 2.3)
   - Envía solicitudes reales
   - Verifica en Firebase Console
   - Revisa que datos sean correctos
   - Tiempo estimado: 15 minutos

3️⃣ TESTS DE RATE LIMITING (Pruebas 3.1 - 3.3)
   - Prueba limites de envío
   - Verifica protección anti-spam
   - Confirma honeypot funciona
   - Tiempo estimado: 20 minutos

4️⃣ TESTS DE ADMIN PANEL (Pruebas 4.1 - 4.6)
   - Carga datos en tiempo real
   - Prueba filtrado y búsqueda
   - Cambia estados (Aceptar/Rechazar)
   - Tiempo estimado: 20 minutos

5️⃣ TESTS DE MONITOR (Prueba 5.1)
   - Verifica permisos de Monitor
   - Confirma no puede eliminar
   - Tiempo estimado: 5 minutos

6️⃣ TESTS DE SEGURIDAD (Pruebas 6.1 - 6.3)
   - Intenta inyecciones XSS
   - Verifica sanitización
   - Tiempo estimado: 15 minutos

7️⃣ TESTS DE ESTADÍSTICAS (Prueba 7.1)
   - Verifica cálculos de métricas
   - Confirma actualización en tiempo real
   - Tiempo estimado: 10 minutos

8️⃣ TESTS DE UX (Pruebas 8.1 - 8.2)
   - Verifica feedback visual
   - Comprueba reset de formulario
   - Tiempo estimado: 5 minutos

⏱️ TIEMPO TOTAL ESTIMADO: 100 minutos (~1.5 horas)

✅ Si todos los tests pasan, el sistema está listo para producción.
`;

/**
 * Verificación rápida (Quick Check)
 */
export const QUICK_CHECK: TestCase[] = [
  {
    nombre: "Quick Check 1: Formulario básico",
    descripcion: "Envía y guarda una solicitud",
    pasos: ["1. Completa formulario", "2. Envía", "3. Verifica en Firestore"],
    resultadoEsperado: "Documento aparece en Firestore",
  },
  {
    nombre: "Quick Check 2: Admin panel",
    descripcion: "Panel carga datos en tiempo real",
    pasos: [
      "1. Accede al Admin Panel",
      "2. Ve a Solicitudes",
      "3. Verifica que carguen datos",
    ],
    resultadoEsperado: "Solicitudes se cargan automáticamente",
  },
  {
    nombre: "Quick Check 3: Cambiar estado",
    descripcion: "Aceptar una solicitud",
    pasos: ["1. Haz clic en Revisar", "2. Elige ACEPTAR", "3. Confirma"],
    resultadoEsperado: "Estado cambia a verde (Aceptada)",
  },
];
