import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Los campos `fields.markdoc` de Keystatic se guardan como un documento
// estructurado (no como texto plano), por eso los tipamos como `z.any()`.
// Los renderizaremos más adelante con el componente de Keystatic.
const documentoMarkdoc = z.any();

const personajes = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/personajes' }),
  schema: z.object({
    nombre: z.string(),
    casa: z.enum(['targaryen', 'hightower', 'velaryon', 'otra']),
    avatar: z.string().optional(),
    descripcion: documentoMarkdoc,
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
    resumenGeneral: documentoMarkdoc,
    puntosComparacion: z.array(
      z.object({
        aspecto: z.string(),
        versionLibro: documentoMarkdoc,
        versionSerie: documentoMarkdoc,
      })
    ),
    conclusion: documentoMarkdoc,
  }),
});

export const collections = { personajes, hitos };
