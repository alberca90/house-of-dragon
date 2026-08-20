import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Los campos `fields.markdoc` (descripcion, resumenGeneral, versionLibro, versionSerie,
// conclusion) se guardan como archivos `.mdoc` separados, no dentro de este JSON.
// Por eso no forman parte de este schema: se leen aparte con el reader de Keystatic
// (ver src/lib/keystaticReader.ts) en las páginas de detalle.

const personajes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/personajes' }),
  schema: z.object({
    nombre: z.string(),
    casa: z.enum(['targaryen', 'hightower', 'velaryon', 'otra']),
    avatar: z.string().optional(),
  }),
});

const hitos = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/hitos' }),
  schema: z.object({
    titulo: z.string(),
    tipo: z.enum(['batalla', 'escena', 'decision', 'muerte', 'otro']),
    temporada: z.number().optional(),
    episodio: z.number().optional(),
    personajesImplicados: z.array(z.string()),
    puntosComparacion: z.array(
      z.object({
        aspecto: z.string(),
      })
    ),
  }),
});

export const collections = { personajes, hitos };
