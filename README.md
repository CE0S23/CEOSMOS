# CEOSMOS - Cosmic Ecosystem for Optimized Spaces and Mindful Operating Systems

![Angular](https://img.shields.io/badge/Angular-18.0.0-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.0-blue?style=for-the-badge&logo=typescript)
![Angular Material](https://img.shields.io/badge/Angular%20Material-18.0.0-purple?style=for-the-badge&logo=angular)

##  Descripción del Proyecto

**CEOSMOS** es una plataforma web de productividad personalizada diseñada para facilitar el estado de flujo (Flow State) mediante un ecosistema visual inspirador combinado con música diseñada para la concentración. El proyecto tiene como objetivo crear un espacio digital que optimice la experiencia del usuario para trabajo profundo, creatividad y motivación.

###  Objetivo Principal
Crear un ecosistema de productividad que combine:
- **Inspiración Visual**: Feed de imágenes cósmicas y artísticas de alta calidad
- **Música para el Enfoque**: Integración de playlists y música diseñada para concentración
- **Enlaces Externos Curados**: Acceso rápido a herramientas de productividad
- **Interfaz Premium**: Diseño moderno con estética cósmica y animaciones fluidas

---

##  Arquitecturas y Patrones Aplicados

### 1. **Clean Architecture (Arquitectura Limpia)**
El proyecto está diseñado siguiendo los principios de Clean Architecture:

- **Separación de Capas**:
  - **Presentación** (`components/`, `pages/`): Componentes Angular para la UI
  - **Lógica de Negocio** (`services/`): Servicios para manejo de datos y lógica
  - **Dominio** (`shared/`): Interfaces y tipos compartidos entre frontend y backend

- **Independencia de Frameworks**: La lógica de negocio está desacoplada de Angular
- **Testabilidad**: Servicios inyectables que permiten fácil testing

### 2. **Component-Based Architecture (Arquitectura Basada en Componentes)**

El proyecto utiliza la arquitectura de componentes de Angular:

```
app/
├── components/          # Componentes reutilizables
│   ├── external-links-menu/
│   ├── player/
│   ├── search-bar/
│   ├── settings/
│   └── visualizer/
├── pages/              # Páginas/Vistas principales
│   └── home/
└── services/           # Servicios de lógica de negocio
    ├── inspiration.service.ts
    └── search.service.ts
```

### 3. **Module Pattern (Patrón de Módulos)**

- **Lazy Loading**: Implementado en el routing para carga diferida
  ```typescript
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) }
  ```
- **Feature Modules**: Separación por funcionalidades

### 4. **Service Layer Pattern (Patrón de Capa de Servicios)**

Servicios especializados que encapsulan lógica de negocio:

- **`InspirationService`**: Gestión de contenido inspiracional (citas, imágenes, música)
- **`SearchService`**: Búsqueda inteligente con cálculo de relevancia

### 5. **Reactive Programming (Programación Reactiva)**

- **RxJS Observables**: Manejo de flujos de datos asíncronos
- **Reactive Forms**: Formularios reactivos con `ReactiveFormsModule`
- **Signals (Futuro)**: Preparado para gestión de estado reactivo con Signals de Angular

### 6. **SOLID Principles**

#### Single Responsibility (Responsabilidad Única)
- Cada componente y servicio tiene una única responsabilidad
- `SearchService` solo maneja búsquedas
- `InspirationService` solo gestiona contenido inspiracional

#### Open/Closed (Abierto/Cerrado)
- Componentes extensibles sin modificar código existente
- Interfaces bien definidas

#### Dependency Inversion (Inversión de Dependencias)
- Inyección de dependencias en constructores
- Servicios `providedIn: 'root'`

### 7. **Design System Architecture**

Sistema de diseño completo con:

- **Variables CSS Customizables**:
  ```scss
  --cosmos-deep-space: #0a0e27;
  --cosmos-nebula: #1a1f3a;
  --gradient-cosmos: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  ```

- **Utilidades Reutilizables**:
  - `.glassmorphism` - Efectos de vidrio esmerilado
  - `.text-gradient` - Textos con gradientes
  - Animaciones predefinidas (`fadeIn`, `float`, `pulse-glow`)

### 8. **Repository Pattern (en desarrollo)**

Estructura preparada para implementar repositorios que abstraigan el acceso a datos (backend futuro con NestJS 11).

---

##  Stack Tecnológico

### Frontend
- **Framework**: Angular 18.0.0
- **Lenguaje**: TypeScript 5.4.0
- **UI Library**: Angular Material 18.0.0
- **Estilos**: SCSS con sistema de variables CSS
- **Programación Reactiva**: RxJS 7.8.0
- **Forms**: Reactive Forms Module
- **HTTP Client**: HttpClientModule

### Futuro Backend (en roadmap)
- **Framework**: NestJS 11
- **Arquitectura**: Clean Architecture
- **Shared Interfaces**: Tipado compartido entre frontend y backend

### Tooling
- **Build**: Angular CLI
- **Testing**: Jasmine + Karma
- **Linter**: TSLint/ESLint (pendiente configuración)

---

##  Estructura del Proyecto

```
WEBANGULAR/
├── frontend/                    # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Componentes reutilizables
│   │   │   │   ├── external-links-menu/    # Menú de enlaces externos
│   │   │   │   ├── player/                 # Reproductor de música
│   │   │   │   ├── search-bar/             # Barra de búsqueda inteligente
│   │   │   │   ├── settings/               # Configuración
│   │   │   │   └── visualizer/             # Visualizador (placeholder)
│   │   │   ├── pages/          # Páginas principales
│   │   │   │   └── home/                   # Página principal
│   │   │   ├── services/       # Servicios de lógica de negocio
│   │   │   │   ├── inspiration.service.ts  # Gestión de contenido
│   │   │   │   └── search.service.ts       # Búsqueda inteligente
│   │   │   ├── app.module.ts              # Módulo principal
│   │   │   ├── app-routing.module.ts      # Configuración de rutas
│   │   │   └── app.component.*            # Componente raíz
│   │   ├── assets/             # Recursos estáticos
│   │   ├── environments/       # Configuración de entornos
│   │   ├── styles.scss         # Estilos globales y Design System
│   │   └── index.html          # Punto de entrada HTML
│   ├── angular.json            # Configuración de Angular
│   ├── package.json            # Dependencias del proyecto
│   └── tsconfig.json           # Configuración de TypeScript
├── backend/                     # Backend (pendiente desarrollo)
├── shared/                      # Interfaces compartidas (pendiente)
└── README.md                    # Este archivo
```

---

##  Características Implementadas

### 1. **Sistema de Inspiración Visual**
- **12 imágenes categorizadas**:
  - Espacio (space)
  -  Naturaleza (nature)
  -  Arquitectura (architecture)
  -  Arte (art)
- Fuentes: Unsplash (imágenes de alta calidad)

### 2. **Biblioteca Musical para Enfoque**
- **9 playlists curadas**:
  - Lo-fi Hip Hop
  -  Ondas Alpha (binaural beats)
  -  Música Ambiental/Cósmica
- Integración con YouTube

### 3. **Citas Inspiracionales**
- Sistema de citas categorizadas:
  -  Enfoque (focus)
  -  Creatividad (creativity)
  -  Motivación (motivation)
- Autores: Cal Newport, Albert Einstein, Mihaly Csikszentmihalyi, Nir Eyal

### 4. **Búsqueda Inteligente**
- **Algoritmo de relevancia** con múltiples factores:
  - Coincidencia exacta (peso: 100)
  - Empieza con query (peso: 50)
  - Contiene query (peso: 25)
  - Coincidencia parcial de palabras (peso: 10)
- **Normalización de texto**: 
  - Insensible a mayúsculas
  - Elimina acentos (NFD normalization)
- **Filtros**: Buscar solo en imágenes, música o todo
- **Resultados ordenados** por relevancia

### 5. **Menú de Enlaces Externos**
- **10 enlaces curados** en 4 categorías:
  - **Música**: Lofi Girl, Brain.fm, Noisli
  -  **Imágenes**: Unsplash, Pexels, NASA APOD
  - **Productividad**: Pomofocus, Notion
  -  **Inspiración**: Deep Work, Flow Research Collective
- **Panel tipo overlay** con categorización
- **Diseño visual premium** con iconos Material y colores personalizados

### 6. **Design System Premium**
- **Paleta de colores cósmica**:
  - Deep Space (#0a0e27)
  - Nebula (#1a1f3a)
  - Star Blue (#4a90e2)
  - Aurora (#7b68ee)
  - Galaxy Purple (#9b59b6)
  - Cosmic Pink (#e91e63)

- **Gradientes modernos**:
  - Gradient Cosmos
  - Gradient Nebula
  - Gradient Aurora

- **Efectos visuales**:
  - Glassmorphism (efecto de vidrio esmerilado)
  - Sombras con glow
  - Scrollbar personalizado

- **Animaciones CSS**:
  - `fadeIn`: Entrada suave
  - `float`: Flotación continua
  - `pulse-glow`: Pulso luminoso

### 7. **Routing con Lazy Loading**
- Carga diferida de módulos para optimización
- Redirección automática a `/home`

### 8. **Responsive Design**
- Media queries para adaptación móvil
- Diseño fluido y adaptable

---

##  Principios de Diseño

### Estética Premium
- **Tema Cósmico**: Inspirado en el espacio y el cosmos
- **Dark Mode**: Diseño oscuro por defecto para reducir fatiga visual
- **Gradientes Vibrantes**: Uso de gradientes modernos y atractivos
- **Glassmorphism**: Efectos de vidrio esmerilado para profundidad visual

### Tipografía
- **Primaria**: Inter (Google Fonts)
- **Display**: Space Grotesk (para títulos)
- **Antialiasing**: Optimizado para legibilidad

### Micro-animaciones
- Transiciones suaves en todos los elementos interactivos
- Animaciones de entrada/salida
- Efectos hover para feedback visual

---

##  Cómo Ejecutar el Proyecto

### Prerrequisitos
```bash
- Node.js (v16 o superior)
- npm (v7 o superior)
- Angular CLI (opcional pero recomendado)
```

### Instalación

1. **Clonar el repositorio** (si aplica)
```bash
git clone [URL_DEL_REPOSITORIO]
cd WEBANGULAR/frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar el servidor de desarrollo**
```bash
npm start
# o
ng serve
```

4. **Abrir en navegador**
```
http://localhost:4200
```

### Compilación para Producción
```bash
npm run build
# Los archivos compilados estarán en dist/ceosmos-app/
```

### Testing
```bash
npm test
```

---

##  Componentes Principales

### 1. **HomeComponent**
- **Ubicación**: `app/pages/home/`
- **Responsabilidad**: Página principal del ecosistema
- **Funcionalidades**:
  - Carga de citas aleatorias
  - Integración con búsqueda
  - Selección de imágenes y música
  - Apertura de recursos en nueva pestaña

### 2. **ExternalLinksMenuComponent**
- **Ubicación**: `app/components/external-links-menu/`
- **Responsabilidad**: Gestión de enlaces externos
- **Funcionalidades**:
  - Panel overlay con animación
  - Filtrado por categorías
  - 10 enlaces curados
  - Diseño con tarjetas coloridas

### 3. **SearchBarComponent**
- **Ubicación**: `app/components/search-bar/`
- **Responsabilidad**: Búsqueda de contenido
- **Funcionalidades**:
  - Búsqueda en tiempo real
  - Filtros de tipo de contenido
  - Visualización de resultados con relevancia

### 4. **PlayerComponent** (Placeholder)
- **Ubicación**: `app/components/player/`
- **Estado**: En desarrollo
- **Futuro**: Reproducción de música integrada

### 5. **VisualizerComponent** (Placeholder)
- **Ubicación**: `app/components/visualizer/`
- **Estado**: En desarrollo
- **Futuro**: Visualización de audio en tiempo real

### 6. **SettingsComponent**
- **Ubicación**: `app/components/settings/`
- **Responsabilidad**: Configuración de la aplicación

---

##  Servicios Implementados

### InspirationService
**Archivo**: `services/inspiration.service.ts`

**Responsabilidades**:
- Gestión de citas inspiracionales (4 citas)
- Gestión de imágenes cósmicas (12 imágenes)
- Gestión de playlists musicales (9 playlists)

**Métodos principales**:
```typescript
getRandomQuote(): Observable<InspirationQuote>
getQuotesByCategory(category: string): Observable<InspirationQuote[]>
getImages(): Observable<CosmosImage[]>
getImagesByCategory(category: string): Observable<CosmosImage[]>
getPlaylists(): Observable<MusicPlaylist[]>
getPlaylistsByType(type: string): Observable<MusicPlaylist[]>
```

### SearchService
**Archivo**: `services/search.service.ts`

**Responsabilidades**:
- Búsqueda inteligente en todo el contenido
- Cálculo de relevancia de resultados
- Normalización de texto para búsqueda
- Filtrado por tipo de contenido

**Métodos principales**:
```typescript
search(query: string, filter: 'all' | 'images' | 'music'): Observable<SearchResult[]>
```

**Algoritmo de relevancia**:
- Coincidencia exacta: +100 puntos
- Empieza con query: +50 puntos
- Contiene query: +25 puntos
- Coincidencia parcial: +10 puntos

---

##  Roadmap y Futuras Implementaciones

### Fase 1: Frontend (En desarrollo - 70% completado)
- [x] Estructura base de componentes
- [x] Sistema de diseño premium
- [x] Servicio de inspiración
- [x] Búsqueda inteligente
- [x] Menú de enlaces externos
- [ ] Reproductor de música funcional
- [ ] Visualizador de audio
- [ ] Sistema de configuración completo
- [ ] Modo claro/oscuro toggle
- [ ] Internacionalización (i18n)

### Fase 2: Backend con NestJS 11
- [ ] API REST con NestJS
- [ ] Autenticación y autorización (JWT)
- [ ] Gestión de usuarios
- [ ] Favoritos personalizados
- [ ] Historial de reproducción
- [ ] Integración con APIs externas (Unsplash, Spotify)
- [ ] Base de datos (PostgreSQL/MongoDB)

### Fase 3: Funcionalidades Avanzadas
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Sincronización multi-dispositivo
- [ ] Gamificación (racha de productividad)
- [ ] Analytics de uso
- [ ] Recomendaciones basadas en IA
- [ ] Integración con Pomodoro Timer
- [ ] Notas y journaling

### Fase 4: Optimización
- [ ] Server-Side Rendering (SSR) con Angular Universal
- [ ] Optimización de Bundle Size
- [ ] Performance mejoras
- [ ] Accesibilidad (WCAG 2.1)
- [ ] Testing E2E completo
- [ ] CI/CD Pipeline

---

##  Testing

### Estrategia de Testing
- **Unit Tests**: Jasmine + Karma para componentes y servicios
- **E2E Tests** (pendiente): Protractor o Cypress
- **Coverage** (pendiente): Objetivo 80%+

### Ejecutar Tests
```bash
npm test                 # Tests en modo watch
npm run test:headless    # Tests en modo CI
```

---

## 📚 Documentación de Interfaces

### InspirationQuote
```typescript
interface InspirationQuote {
    id: string;
    text: string;
    author: string;
    category: 'focus' | 'creativity' | 'motivation';
}
```

### CosmosImage
```typescript
interface CosmosImage {
    id: string;
    url: string;
    title: string;
    category: 'space' | 'nature' | 'architecture' | 'art';
}
```

### MusicPlaylist
```typescript
interface MusicPlaylist {
    id: string;
    name: string;
    url: string;
    type: 'lofi' | 'alpha' | 'ambient';
    description: string;
}
```

### SearchResult
```typescript
interface SearchResult {
    id: string;
    type: 'image' | 'music';
    title: string;
    description?: string;
    category: string;
    url: string;
    relevance?: number;
}
```

### ExternalLink
```typescript
interface ExternalLink {
    id: string;
    name: string;
    url: string;
    icon: string;
    description: string;
    category: 'music' | 'images' | 'productivity' | 'inspiration';
    color: string;
}
```

---

## Recursos y Referencias

### Libros y Conceptos
- **Deep Work** - Cal Newport: Trabajo profundo y concentración
- **Flow State** - Mihaly Csikszentmihalyi: Estado de flujo óptimo
- **Indistractable** - Nir Eyal: Gestión de la atención

### Tecnologías
- [Angular Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS](https://rxjs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Inspiración de Diseño
- **Dribbble**: Diseños de productividad
- **Behance**: UI/UX premium
- **Awwwards**: Animaciones web

---

## Contribución

### Estándares de Código
- **Linting**: Seguir reglas de TSLint/ESLint
- **Naming Conventions**: 
  - Componentes: PascalCase
  - Archivos: kebab-case
  - Variables/funciones: camelCase
- **Commit Messages**: Conventional Commits
  ```
  feat: agregar búsqueda por categorías
  fix: corregir filtro de música
  docs: actualizar README
  ```

### Pull Requests
1. Fork del repositorio
2. Crear branch feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---

##  Licencia

Este proyecto es privado y de uso educativo/personal.

---

##  Autor

**Proyecto CEOSMOS**
- Versión: 1.0.0
- Última actualización: Febrero 2026

---

##  Agradecimientos

- **Unsplash**: Por las imágenes de alta calidad
- **YouTube Creators**: Por la música de enfoque
- **Angular Team**: Por el increíble framework
- **Material Design**: Por la librería de componentes


---

**CEOSMOS** - *Donde la productividad encuentra el cosmos* 
