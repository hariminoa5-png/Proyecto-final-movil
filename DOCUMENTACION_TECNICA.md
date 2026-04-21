# Documentación Técnica - AutoTrack

Este documento detalla la arquitectura de software, las decisiones de diseño y los protocolos de comunicación implementados en el proyecto AutoTrack.

## 1. Arquitectura del Sistema

La aplicación sigue el patrón de arquitectura de una **Single Page Application (SPA)** móvil, utilizando un desacoplamiento claro entre la interfaz de usuario y la lógica de servicios.

### Componentes Principales:
- **Presentation Layer**: Componentes de React que utilizan Ionic para el renderizado nativo.
- **Service Layer**: Módulos especializados (`api.ts`, `auth.ts`) que gestionan la comunicación con el exterior.
- **State Management**: Uso de `React Hooks` (`useState`, `useEffect`) para el manejo del estado local y reactividad.

## 2. Integración con la API (ITLA OAS 3.0)

El sistema se integra con una API RESTful que sigue una convención específica de envío de datos.

### Protocolo datax
Todas las peticiones `POST` encapsulan su contenido JSON en un campo llamado `datax` codificado como `application/x-www-form-urlencoded`.

**Ejemplo de Payload:**
```json
datax={"matricula":"20212377", "contrasena":"********"}
```

### Seguridad y Autenticación
- **Bearer Tokens**: Una vez que el usuario se activa o inicia sesión, el servidor devuelve un token JWT.
- **Interceptores**: Se ha implementado un interceptor de Axios que inyecta automáticamente el header `Authorization: Bearer <TOKEN>` en cada petición saliente a la API, garantizando que el usuario siempre esté autenticado en los módulos protegidos.

## 3. Flujo de Usuario Corregido

- **Registro**: El sistema valida la matrícula y devuelve un token temporal.
- **Activación**: Se utiliza el token temporal + una nueva contraseña para habilitar la cuenta de forma permanente.
- **Persistencia**: Se utiliza `localStorage` para persistir la sesión del usuario, garantizando que no sea necesario iniciar sesión cada vez que se abre la app.

## 4. Diseño y UX
- **Tema**: Dark Navy (#0a0f1a) con acentos en Electric Blue (#1d8cf8).
- **Reactividad**: Se migró de `onIonChange` a `onIonInput` para asegurar que los campos de texto actualicen el estado de la aplicación en tiempo real, eliminando retrasos en la validación móvil.

---
**Proyecto Final de Aplicación Web/Móvil**
**Docente: ITLA**
