import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

// Instancia única del reader de Keystatic para resolver JSON + .mdoc.
export const reader = createReader(process.cwd(), keystaticConfig);
