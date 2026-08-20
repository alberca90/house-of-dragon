import Markdoc from '@markdoc/markdoc';
import { fields } from '@keystatic/core';
import * as React from 'react';

// Config compartida para transformar el AST de Markdoc al árbol renderable.
const markdocConfig = fields.markdoc.createMarkdocConfig({});

type Props = {
  field?: { node: unknown };
};

// Los campos `fields.markdoc` de Keystatic se renderizan con el pipeline
// estándar de @markdoc/markdoc (transform + renderers.react), no con
// <DocumentRenderer>, que es específico del tipo de campo `fields.document`.
export default function MarkdocContent({ field }: Props) {
  if (!field?.node) return null;
  const transformed = Markdoc.transform(
    field.node as Parameters<typeof Markdoc.transform>[0],
    markdocConfig as Parameters<typeof Markdoc.transform>[1]
  );
  return Markdoc.renderers.react(transformed, React);
}
