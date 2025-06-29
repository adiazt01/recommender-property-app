<!-- Banner -->
<p align="center">
  <img src="./.github/banner.png" alt="Recommender Property App Banner" />
</p>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-4+-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-4+-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3+-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/DaisyUI-2+-A3E635?logo=daisyui&logoColor=white" alt="DaisyUI" />
  <img src="https://img.shields.io/badge/Lucide-React-000?logo=lucide&logoColor=white" alt="Lucide React" />
</p>

# Recommender Property App

Un sistema inteligente de recomendación inmobiliaria construido con React, TypeScript y Vite.

## Características

- **Motor de Recomendación de Propiedades:** Sugiere propiedades similares según ciudad, tipo, precio, tamaño y ambientes.
- **Puntaje Ponderado:** Cada atributo tiene un peso para una recomendación más precisa.
- **Recomendaciones Explicables:** Cada recomendación incluye razones (como pares clave/valor) para mayor transparencia.
- **Filtrado y Búsqueda:** Filtra propiedades por ciudad, tipo y término de búsqueda.
- **Paginación:** Navega por las propiedades con resultados paginados.
- **Estadísticas de Mercado:** Consulta el contexto de mercado para cada propiedad (precio promedio, posición, etc.).
- **UI Moderna:** Construido con Tailwind CSS y DaisyUI.

## Stack Tecnológico

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DaisyUI](https://daisyui.com/)
- [Lucide React Icons](https://lucide.dev/icons/)

## Comenzando

### Requisitos

- Node.js (recomendado v18+)
- npm o yarn

### Instalación

```bash
git clone https://github.com/adiazt01/recommender-property-app.git
cd recommender-property-app
npm install
# o
yarn install
```

### Desarrollo

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build

```bash
npm run build
# o
yarn build
```

### Lint

```bash
npm run lint
# o
yarn lint
```

## Estructura del Proyecto

```
src/
  features/
    core/
      algorithms/
      components/
      constants/
      hooks/
      interface/
      types/
    properties/
      components/
      context/
      hooks/
      interface/
      mappers/
      services/
  utils/
    recomendation.util.ts
  data/
    properties.json
```

## Motor de Recomendación

- El motor utiliza un sistema de puntaje ponderado para comparar propiedades.
- Cada recomendación incluye un objeto `reasons` con claves como `same_city`, `similar_price`, etc., y sus valores correspondientes.
- Puedes personalizar los pesos y umbrales en `src/features/core/constants/recommendationWeightConstants.ts`.

## Alias

- `@/` → `src/`
- `@core/` → `src/features/core/`
- `@properties/` → `src/features/properties/`

## Ejemplo de Uso

```typescript
import { SmartRecommendationEngine } from "@/utils/recomendation.util";
import { getProperties } from "@properties/services/propertyService";

const properties = getProperties();
const engine = new SmartRecommendationEngine(properties);
const recommendations = engine.getRecommendations(properties[0]);
```