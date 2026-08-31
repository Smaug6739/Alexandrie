/**
 * PlantUML servers take the diagram source in the URL itself: raw-deflated, then
 * encoded with PlantUML's own base64 variant (a different alphabet, and the bytes
 * are packed in the opposite order to standard base64). Rendering is therefore a
 * plain <img src="..."> with no request from our own code.
 */

// PlantUML's alphabet, in its own order. Not interchangeable with standard base64.
const PLANTUML_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';

async function deflateRaw(input: string): Promise<Uint8Array> {
  const stream = new Blob([new TextEncoder().encode(input)]).stream().pipeThrough(new CompressionStream('deflate-raw'));

  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function toPlantumlBase64(bytes: Uint8Array): string {
  let out = '';

  for (let i = 0; i < bytes.length; i += 3) {
    const b1 = bytes[i]!;
    const b2 = i + 1 < bytes.length ? bytes[i + 1]! : 0;
    const b3 = i + 2 < bytes.length ? bytes[i + 2]! : 0;

    // Emitted unpadded: PlantUML pads the final group with zero bytes rather than '='.
    out += PLANTUML_ALPHABET[b1 >> 2];
    out += PLANTUML_ALPHABET[((b1 & 0x3) << 4) | (b2 >> 4)];
    out += PLANTUML_ALPHABET[((b2 & 0xf) << 2) | (b3 >> 6)];
    out += PLANTUML_ALPHABET[b3 & 0x3f];
  }

  return out;
}

/** Encode diagram source into the path segment a PlantUML server expects. */
export async function encodePlantumlSource(source: string): Promise<string> {
  // CRLF would deflate to different bytes than LF, so the same diagram authored on
  // Windows would otherwise miss the server's cache and hash differently in tests.
  const normalized = source.replace(/\r\n/g, '\n');

  return toPlantumlBase64(await deflateRaw(normalized));
}

/**
 * Build the image URL for an encoded diagram. `dsvg` is PlantUML's dark-mode
 * endpoint, which keeps diagrams readable against the app's dark theme.
 */
export function buildPlantumlUrl(server: string, encoded: string, dark: boolean): string {
  const base = server.trim().replace(/\/+$/, '');

  if (!base) throw new Error('No PlantUML server configured.');

  // Guard the scheme explicitly: the diagram source ends up inside this URL, and a
  // javascript:/data: base would turn a document into an execution vector.
  if (!/^https?:\/\//i.test(base)) throw new Error('PlantUML server must be an http(s) URL.');

  return `${base}/${dark ? 'dsvg' : 'svg'}/${encoded}`;
}
