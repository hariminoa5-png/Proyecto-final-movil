# AutoTrack - ITLA Gestión Vehicular

AutoTrack es una aplicación móvil moderna desarrollada como proyecto final para la gestión integral de vehículos. La aplicación permite a los estudiantes del ITLA registrar sus vehículos, realizar seguimientos de mantenimiento, gastos de combustible y más, todo bajo un diseño premium oscuro y minimalista.

## 🚀 Tecnologías Utilizadas

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **UI Framework**: [Ionic Framework 8](https://ionicframework.com/)
- **Mobile Bridge**: [Capacitor 8](https://capacitorjs.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Data Handling**: [Axios](https://axios-http.com/) con interceptores de seguridad.

## 🛠️ Requisitos de Instalación

Para ejecutar este proyecto localmente o compilar el APK, necesitas:

1. **Node.js**: Versión 18 o superior.
2. **Java Development Kit (JDK)**: Versión 22 (recomendada).
3. **Android SDK**: Configurado a través de Android Studio.

## 📦 Configuración del Proyecto

```bash
# Navegar a la carpeta del proyecto
cd autotrack

# Instalar dependencias
npm install
```

## 🔨 Compilación y Lanzamiento

### Ejecución en Navegador (Desarrollo)
```bash
npm run dev
```

### Generación de APK (Android)
El proyecto está configurado para generar un APK listo para instalar en dispositivos Android.

1. **Compilar versión web**: `npm run build`
2. **Sincronizar con Android**: `npx cap sync android`
3. **Generar APK**: 
   - Abrir la carpeta `android` en Android Studio.
   - O ejecutar vía terminal: `cd android && ./gradlew assembleDebug`

El APK generado se encontrará en: `android/app/build/outputs/apk/debug/app-debug.apk`

---
**Desarrollado como Proyecto Final · ITLA 2026**
