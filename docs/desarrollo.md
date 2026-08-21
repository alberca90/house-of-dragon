Aquí tienes la ficha técnica consolidada en formato Markdown, lista para que la pegues en tu documentación del proyecto.

```markdown
# Cheat Sheet: Puesta a punto del Stack (Astro + Keystatic + Tailwind)

## 1. Requisitos de Entorno y Manejo de Node (NVM)

Astro 5 exige **Node.js v22.12.0 o superior**. Para convivir con otros proyectos de Node en Windows usando NVM:

```bash
# Descargar e instalar Node 22
nvm install 22

# Activar Node 22 para este entorno
nvm use 22

# Verificar que la versión activa sea >= 22.12.0
node -v

```

---

## 2. Comandos de Instalación del Proyecto

Creación del proyecto Astro e instalación manual de todas las dependencias requeridas (Keystatic, React y Tailwind CSS v4):

```bash
# 1. Crear el proyecto Astro base
npm create astro@latest

# 2. Entrar en la carpeta
cd house-of-dragon

# 3. Instalar Keystatic, Renderer de React (necesario para la UI de Keystatic) y Tailwind CSS v4
npm install @keystatic/core @keystatic/astro @astrojs/react react react-dom @tailwindcss/vite tailwindcss

# 4. Iniciar el servidor local
npm run dev

```

---

## 3. Extensiones de VS Code Necesarias

* **Astro** (`astro-vscode`): Soporte oficial de sintaxis para componentes `.astro`.
* **Tailwind CSS IntelliSense** (Oficial de *Tailwind Labs*): Autocompletado, linter y sugerencias de clases.
* **MDX**: Soporte de formato para archivos `.mdx`.

---

## 4. Archivos de Configuración del Proyecto

### `astro.config.mjs`

Configuración principal de Astro unificando la integración de React, Keystatic y el plugin Vite de Tailwind. **Actualizado**: se añadió el adapter de Vercel para poder desplegar (ver punto 8 sobre modo híbrido):

```typescript
import { defineConfig } from 'astro/config';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(), // Sin `output: 'server'` => modo híbrido (estático por defecto, SSR bajo demanda)
  integrations: [
    react(),     // Renderiza la UI en React de Keystatic
    keystatic(), // Panel de administración del CMS
  ],
  vite: {
    plugins: [tailwindcss()], // Plugin nativo de Tailwind v4
  },
});

```

### `keystatic.config.ts` (En la raíz del proyecto)

Esquema inicial local para definir las colecciones del CMS:

```typescript
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        content: fields.markdoc({ label: 'Contenido' }),
      },
    }),
  },
});

```

---

## 5. Puntos de Acceso en Local

* **Aplicación Web (Landing):** `http://localhost:4321`
* **Panel Administrador (Keystatic CMS):** `http://localhost:4321/keystatic`

---

## 6. Conceptos Clave

* **Por qué React:** La interfaz de usuario del admin de Keystatic corre internamente sobre React, por lo que `@astrojs/react` es obligatorio aunque la web final se construya solo en componentes Astro.
* **Tailwind v4:** Ya no requiere `npx astro add tailwind` ni archivo `tailwind.config.js`; se compila mediante Vite (`@tailwindcss/vite`).
* **Modo Local:** El estado actual de Keystatic guarda los contenidos directamente en archivos dentro del sistema de archivos local (`src/content/`).

---

## 7. Content Layer API (Astro v5+/v7): `content.config.ts`

Astro dejó de usar `src/content/config.ts` con `type: 'data' | 'content'`. Ahora el archivo va **directo bajo `src/`** y cada colección necesita un `loader` explícito:

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const personajes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/personajes' }),
  schema: z.object({ nombre: z.string(), casa: z.string() }),
});

export const collections = { personajes };
```

Si ves el error `LegacyContentConfigError`, es por esto: mueve el archivo y añade el `loader`.

---

## 8. Campos `fields.markdoc` de Keystatic: cómo leerlos y renderizarlos

Esto nos costó varias vueltas, ojo con esto en el futuro:

* Los campos `fields.markdoc` (texto enriquecido) **se guardan como archivos `.mdoc` separados**, no dentro del JSON de la entrada. Por eso `getCollection()` de Astro **nunca** los ve — solo sirve para listar campos planos (texto, número, select, etc.).
* Para leer el contenido real hay que usar el reader oficial de Keystatic (`createReader` de `@keystatic/core/reader`) con `{ resolveLinkedFiles: true }`. Ver `src/lib/keystaticReader.ts`.
* Ese reader devuelve el **AST crudo de `@markdoc/markdoc`**, que NO es el formato que espera `<DocumentRenderer>` de `@keystatic/core/renderer` (ese componente es para otro tipo de campo, `fields.document`). Usarlo con `fields.markdoc` renderiza vacío o revienta.
* El render correcto para `fields.markdoc` es el pipeline estándar de Markdoc: `Markdoc.transform(node, config)` + `Markdoc.renderers.react(transformed, React)`. Ya está encapsulado en `src/components/MarkdocContent.tsx` — reutiliza ese componente siempre que muestres un campo markdoc, no repitas la lógica.

---

## 9. Servidor de desarrollo en segundo plano

En este entorno, `astro dev` corre siempre como un proceso en background (incluso sin flags). Se gestiona con scripts propios en `package.json`:

```bash
npm run dev:bg      # arranca en background
npm run dev:status  # comprobar si sigue vivo
npm run dev:logs    # ver logs (solo eventos de Astro/Vite, no tus console.log sueltos)
npm run dev:stop    # detenerlo
```

Si escribes `astro dev --background` a pelo en Git Bash y da `astro: command not found`, es porque el binario vive en `node_modules/.bin` y no está en el PATH global. Usa siempre `npm run <script>` o `npx astro ...`.

Para verificar errores de tipos de forma fiable (más que fiarte del editor, que a veces cachea diagnósticos viejos), usa:

```bash
npx astro check
```

---

## 10. Despliegue: adapter de Vercel y modo híbrido

La integración `keystatic()` necesita renderizado bajo demanda (SSR) para las rutas del panel `/keystatic`. Sin un adapter, `npm run build` falla con `NoAdapterInstalled`.

Solución aplicada:

```bash
npm install @astrojs/vercel
```

En `astro.config.mjs` se añadió `adapter: vercel()`. Importante: **se quitó `output: 'server'`** a propósito. Sin ese `output`, Astro usa modo **híbrido**: todas las páginas se generan estáticas en el build (rápido, ideal para `/`, `/personajes`, `/hitos`, etc.) y solo las rutas que necesiten SSR real (como las de Keystatic) se renderizan bajo demanda en el servidor de Vercel. Si alguna página nuestra necesitara SSR en el futuro, se marca individualmente con `export const prerender = false;` en su frontmatter, en vez de forzar todo el sitio a servidor.

