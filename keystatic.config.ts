import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
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
            { label: 'Otra', value: 'otra' },
          ],
          defaultValue: 'targaryen',
        }),
        avatar: fields.image({
          label: 'Foto/Avatar',
          directory: 'public/images/personajes',
          publicPath: '/images/personajes/',
        }),
        descripcion: fields.markdoc({
          label: 'Descripción del personaje',
        }),
      },
    }),
    hitos: collection({
      label: 'Hitos (Libro vs Serie)',
      slugField: 'titulo',
      path: 'src/content/hitos/*',
      format: { data: 'json' },
      schema: {
        titulo: fields.slug({ name: { label: 'Título del hito' } }),
        tipo: fields.select({
          label: 'Tipo',
          options: [
            { label: 'Batalla', value: 'batalla' },
            { label: 'Escena', value: 'escena' },
            { label: 'Decisión', value: 'decision' },
            { label: 'Muerte', value: 'muerte' },
            { label: 'Otro', value: 'otro' },
          ],
          defaultValue: 'batalla',
        }),
        temporada: fields.number({ label: 'Temporada', defaultValue: 1 }),
        episodio: fields.number({ label: 'Episodio' }),
        personajesImplicados: fields.array(
          fields.relationship({
            label: 'Personaje',
            collection: 'personajes',
          }),
          {
            label: 'Personajes implicados',
            itemLabel: (props) => props.value ?? 'Sin seleccionar',
          }
        ),
        resumenGeneral: fields.markdoc({
          label: 'Resumen general / contexto',
        }),
        puntosComparacion: fields.array(
          fields.object({
            aspecto: fields.text({ label: 'Aspecto comparado' }),
            versionLibro: fields.markdoc({ label: 'Versión libro' }),
            versionSerie: fields.markdoc({ label: 'Versión serie' }),
          }),
          {
            label: 'Puntos de comparación',
            itemLabel: (props) => props.fields.aspecto.value || 'Nuevo punto',
          }
        ),
        conclusion: fields.markdoc({
          label: 'Conclusión',
        }),
      },
    }),
  },
});