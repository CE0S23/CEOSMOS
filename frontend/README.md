# CEOSMOS - Deep Work Platform

Una plataforma de trabajo profundo que fusiona el cosmos visual y auditivo para maximizar la concentración.

## 🚀 Características

- **Cosmos Visual**: Galería de imágenes de alta calidad (arte, naturaleza, arquitectura, espacio)
- **Cosmos Auditivo**: Integración de audio (frecuencias alfa, lo-fi, sonidos ambientales)
- **Modos de Enfoque**: Personalización automática según la actividad (Escritura, Programación, Lluvia de ideas)
- **Menú de Enlaces Externos**: Recursos curados para productividad e inspiración

## 🛠️ Tecnologías

- **Frontend**: Angular 18
- **UI Framework**: Angular Material
- **Estilos**: SCSS con variables CSS
- **Arquitectura**: Componentes modulares + Servicios

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   │   ├── external-links-menu/
│   │   ├── player/
│   │   ├── settings/
│   │   └── visualizer/
│   ├── pages/              # Páginas/Vistas
│   │   └── home/
│   ├── services/           # Servicios de datos
│   │   └── inspiration.service.ts
│   ├── app.component.*     # Componente raíz
│   ├── app.module.ts       # Módulo principal
│   └── app-routing.module.ts
├── assets/                 # Recursos estáticos
├── environments/           # Configuraciones de entorno
└── styles.scss            # Estilos globales
```

## 🎨 Diseño

El diseño sigue principios de:
- **Minimalismo**: Interfaz limpia sin distracciones
- **Glassmorphism**: Efectos de vidrio esmerilado
- **Gradientes Cósmicos**: Paleta de colores inspirada en el espacio
- **Animaciones Suaves**: Transiciones y micro-interacciones

## 📝 Próximos Pasos

1. Integración con API de Unsplash para imágenes dinámicas
2. Implementación del reproductor de música
3. Sistema de modos de enfoque con personalización
4. Integración con backend NestJS
5. Gestión de estado con Signals

## 👨‍💻 Desarrollo

Este proyecto sigue las mejores prácticas de Angular:
- Separación de responsabilidades (componentes, servicios, módulos)
- Lazy loading para optimización
- TypeScript strict mode
- SOLID principles

## 📄 Licencia

MIT
