Aquí tienes el documento en formato Markdown con la hoja de ruta completa para estructurar el proyecto de prueba, trabajar con el contenido y dejarlo listo para desplegar.

```markdown
# Hoja de Ruta: Desarrollo y Despliegue del Proyecto

## 1. Visión General del Proyecto de Prueba
* **Temática:** Comparativa "Libro vs. Serie" (*Fuego y Sangre* vs. *La Casa del Dragón*).
* **Objetivo técnico:** Probar el flujo completo de Keystatic (CMS basado en Git) en combinación con Astro, Tailwind CSS, GitHub y Vercel.

---

## 2. Definición del Esquema del CMS (`keystatic.config.ts`)

Para probar contenido estructurado y relacional, reemplaza tu `keystatic.config.ts` por dos colecciones clave: **Personajes** y **Diferencias**.

```typescript
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // En producción cambiará a 'github'
  },
  collections: {
    personajes: collection({
      label: 'Personajes',
      slugField: 'nombre',
      path: 'src/content/personajes/*',
      format: { data: 'json' },
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre del personaje' } }),
        casa: fields.select({
          label: 'Casa',
          options: [
            { label: 'Targaryen', value: 'targaryen' },
            { label: 'Hightower', value: 'hightower' },
            { label: 'Velaryon', value: 'velaryon' },
          ],
          defaultValue: 'targaryen',
        }),
        avatar: fields.image({
          label: 'Foto/Avatar',
          directory: 'public/images/personajes',
          publicPath: '/images/personajes/',
        }),
      },
    }),
    diferencias: collection({
      label: 'Diferencias Libro vs Serie',
      slugField: 'titulo',
      path: 'src/content/diferencias/*',
      format: { contentField: 'detalle' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título del cambio' } }),
        personaje: fields.relationship({
          label: 'Personaje principal afectado',
          collection: 'personajes',
        }),
        temporada: fields.number({ label: 'Temporada' }),
        resumenCorto: fields.text({ label: 'Resumen en una frase' }),
        detalle: fields.markdoc({
          label: 'Explicación detallada (MDX)',
        }),
      },
    }),
  },
});

```

---

## 3. Configurar Content Collections en Astro (`src/content/config.ts`)

Astro necesita conocer el esquema para ofrecerte **TypeScript estricto y autocompletado** al consultar los datos desde tus archivos `.astro`.

Crea el archivo `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const personajes = defineCollection({
  type: 'data',
  schema: z.object({
    nombre: z.string(),
    casa: z.enum(['targaryen', 'hightower', 'velaryon']),
    avatar: z.string().optional(),
  }),
});

const diferencias = defineCollection({
  type: 'content',
  schema: z.object({
    titulo: z.string(),
    personaje: z.string(),
    temporada: z.number(),
    resumenCorto: z.string(),
  }),
});

export const collections = { personajes, diferencias };

```

---

## 4. Desarrollo de Páginas en Astro

1. **Página Principal (`src/pages/index.astro`):**
* Usa `getCollection('diferencias')` y `getCollection('personajes')` para listar las tarjetas de la landing.


2. **Páginas Dinámicas (`src/pages/diferencias/[slug].astro`):**
* Usa `getStaticPaths()` para generar la ruta estática de cada diferencia redactada en Keystatic.
* Renderiza el contenido Markdoc/MDX usando el componente `<Content />` nativo de Astro.



---

## 5. Estrategia de Trabajo con IA y Copilot (Contexto)

Para optimizar la generación de contenidos e interfaz con IA:

* **Para poblar Keystatic:** Genera archivos Markdown/JSON directamente en las carpetas `src/content/personajes/` y `src/content/diferencias/` pidiéndole a la IA datos con el formato que espera el esquema.
* **Para Copilot:** Mantén abiertos en las pestañas de VS Code el archivo `keystatic.config.ts` y la página `.astro` en la que estés trabajando para que el modelo entienda los tipos.

---

## 6. Despliegue en Producción (GitHub + Vercel)

1. **Subir a GitHub:**
```bash
git add .
git commit -m "feat: estructura inicial de Keystatic y Astro"
git push origin main

```


2. **Conectar a Vercel:**
* Importa el repositorio en Vercel.
* Framework Preset: **Astro**.
* Haz clic en **Deploy** (coste $0).


3. **Activar Auth en Producción (Modo Git en Keystatic):**
* Cuando quieras que tu cliente edite en la web real, cambia en `keystatic.config.ts`:
```typescript
storage: process.env.NODE_ENV === 'production' 
  ? { kind: 'github', repo: 'usuario/repo' }
  : { kind: 'local' }

```


* Genera las claves de OAuth App en GitHub y añádelas como variables de entorno en Vercel (`KEYSTATIC_GITHUB_CLIENT_ID` y `KEYSTATIC_GITHUB_CLIENT_SECRET`).



```

```