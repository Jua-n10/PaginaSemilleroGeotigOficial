# 🔐 Guía: Publicar Security Rules en Firebase

## ¿Por qué es importante?

Las **Security Rules** protegen tu base de datos Firestore. Sin ellas, cualquiera podría leer, escribir o eliminar datos.

---

## 📋 Paso a Paso

### Paso 1: Acceder a Firebase Console

1. Abre [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `geotiguni`

### Paso 2: Navegar a Firestore

1. En el menú izquierdo, haz clic en **"Firestore Database"**
2. Se abrirá la interfaz de Firestore

### Paso 3: Abrir el Editor de Reglas

1. Haz clic en la pestaña **"Reglas"** (Rules) en la parte superior
2. Deberías ver el editor de reglas vacío o con reglas por defecto

### Paso 4: Copiar Nuevas Reglas

1. Abre el archivo `firestore.rules` de tu proyecto
2. Copia TODO el contenido (desde `rules_version = '2';` hasta el final)

### Paso 5: Pegar en Firebase

1. En Firebase Console, selecciona TODO el contenido del editor (Ctrl+A)
2. Borralo (Delete)
3. Pega el contenido de `firestore.rules` (Ctrl+V)

### Paso 6: Revisar la Sintaxis

Deberías ver:

```
✅ Si todo está correcto: "Syntax OK"
❌ Si hay error: mostrará la línea problemática
```

Si hay error, revisa que no hayas cortado accidentalmente ninguna línea.

### Paso 7: Publicar

1. Haz clic en el botón **"Publicar"** en la parte inferior derecha
2. Se abrirá un cuadro de confirmación
3. Haz clic en **"Publicar"** nuevamente
4. Espera a que se complete (tarda 30-60 segundos)

### Paso 8: Verificación

Cuando aparezca el mensaje:

```
✅ "Reglas publicadas exitosamente"
```

¡Listo! Tus Security Rules están activas.

---

## 🧪 Probar que Funciona

Después de publicar, prueba lo siguiente:

### Test 1: Crear documento sin autenticación ✅

```javascript
// En la consola del navegador
const { getFirestore, collection, addDoc, serverTimestamp } =
  await import("firebase/firestore");
const { db } = await import("./src/firabase.ts");

try {
  const docRef = await addDoc(collection(db, "solicitudes"), {
    nombre: "Test Usuario",
    email: "test@test.com",
    programa: "Test",
    motivacion: "Mensaje de prueba con al menos 20 caracteres",
    estado: "pendiente",
    fechaCreacion: serverTimestamp(),
    fechaRevision: null,
    comentariosAdmin: "",
  });
  console.log("✅ Documento creado:", docRef.id);
} catch (error) {
  console.error("❌ Error:", error.message);
}
```

**Resultado esperado:** ✅ Documento creado

### Test 2: Leer documento sin autenticación ❌

```javascript
// En la consola del navegador
const { getFirestore, collection, getDocs } =
  await import("firebase/firestore");
const { db } = await import("./src/firabase.ts");

try {
  const snapshot = await getDocs(collection(db, "solicitudes"));
  console.log("❌ PROBLEMA: Se pudo leer sin autenticación");
} catch (error) {
  console.log("✅ Correcto: Lectura bloqueada -", error.message);
}
```

**Resultado esperado:** ❌ Error "Permission denied"

---

## 📋 Contenido de firestore.rules

El archivo debe contener:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /solicitudes/{solicitudId} {
      allow create: if validateSolicitud(request.resource.data);
      allow read: if request.auth != null;
      allow update: if request.auth != null && validateUpdateSolicitud(request.resource.data);
      allow delete: if request.auth != null;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}

function validateSolicitud(data) {
  return data.size() > 0
    && data.nombre is string
    && data.email is string
    && data.programa is string
    && data.motivacion is string
    && data.estado == 'pendiente'
    && data.nombre.size() >= 3
    && data.nombre.size() <= 100
    && data.email.matches('[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
    && data.programa.size() > 0
    && data.motivacion.size() >= 20
    && data.motivacion.size() <= 1000;
}

function validateUpdateSolicitud(data) {
  return data.estado in ['pendiente', 'aceptada', 'rechazada']
    && data.comentariosAdmin is string
    && data.comentariosAdmin.size() <= 1000;
}
```

---

## ❌ Problemas Comunes

### Problema: "Syntax Error"

**Causa:** Una línea se cortó o la sintaxis está mal

**Solución:**

1. Copia el contenido nuevamente desde `firestore.rules`
2. Asegúrate de que empiece con `rules_version = '2';`
3. Verifica que termine correctamente

### Problema: "Permission Denied al crear documento"

**Causa:** Las rules fueron publicadas pero son muy restrictivas

**Solución:**

1. Verifica que la función `validateSolicitud` esté correcta
2. Asegúrate que `allow create:` esté SIN `request.auth`
3. Republica

### Problema: "Se puede leer sin autenticación"

**Causa:** Rules no fueron publicadas o son incorrectas

**Solución:**

1. Verifica que `allow read: if request.auth != null;` esté presente
2. Republica las rules
3. Limpia cache del navegador

---

## ✅ Checklist de Publicación

- [ ] Abrí Firebase Console
- [ ] Seleccioné proyecto `geotiguni`
- [ ] Entré a Firestore → Reglas
- [ ] Copié contenido de `firestore.rules`
- [ ] Pegué en el editor
- [ ] Veo "Syntax OK"
- [ ] Hice clic en "Publicar"
- [ ] Confirmé publicación
- [ ] Esperé a que complete
- [ ] Vi mensaje "✅ Reglas publicadas"
- [ ] Probé crear documento (funciona)
- [ ] Probé leer sin auth (error)

---

## 🎯 Resultado Final

Si todo funcionó correctamente:

✅ **Crear solicitud:** Sin autenticación (formulario público)
✅ **Leer solicitudes:** Solo usuarios autenticados
✅ **Actualizar:** Solo usuarios autenticados + validación
✅ **Eliminar:** Solo usuarios autenticados
✅ **Validación en servidor:** Todos los campos validados

---

## 📚 Documentación de Referencia

- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules)
- [Testing Security Rules](https://firebase.google.com/docs/firestore/security/test-rules)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-structure)

---

**¡Listo para proteger tu base de datos! 🔒**

Si tienes problemas, revisa el archivo `FIREBASE_SOLICITUDES_GUIDE.md` para más detalles.
