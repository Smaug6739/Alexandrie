import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { encodePlantumlSource, buildPlantumlUrl } from './plantuml-encode';

describe('encodePlantumlSource', () => {
  test('encodes a diagram to the string the official server accepts', async () => {
    // Verified against https://www.plantuml.com/plantuml/svg/<encoded>, which returns
    // an image/svg+xml response for this exact value.
    const encoded = await encodePlantumlSource('@startuml\nAlice -> Bob: Hello\n@enduml');

    assert.equal(encoded, 'SoWkIImgAStDuNBCoKnELT2rKt3AJx9Iy4ZDoSddSaZDIm7A0G00');
  });

  test('only emits characters from the PlantUML alphabet', async () => {
    const encoded = await encodePlantumlSource('@startuml\nclass A {\n  +field: int\n}\n@enduml');

    assert.match(encoded, /^[0-9A-Za-z_-]+$/);
  });

  test('normalizes CRLF so Windows-authored sources encode like Unix ones', async () => {
    const unix = await encodePlantumlSource('@startuml\nAlice -> Bob: Hello\n@enduml');
    const windows = await encodePlantumlSource('@startuml\r\nAlice -> Bob: Hello\r\n@enduml');

    assert.equal(windows, unix);
  });

  test('produces different output for different sources', async () => {
    const first = await encodePlantumlSource('@startuml\nAlice -> Bob\n@enduml');
    const second = await encodePlantumlSource('@startuml\nBob -> Alice\n@enduml');

    assert.notEqual(first, second);
  });
});

describe('buildPlantumlUrl', () => {
  test('joins server and encoded source using the light format', () => {
    const url = buildPlantumlUrl('https://www.plantuml.com/plantuml', 'ABC123', false);

    assert.equal(url, 'https://www.plantuml.com/plantuml/svg/ABC123');
  });

  test('uses the dark-mode endpoint when dark is requested', () => {
    const url = buildPlantumlUrl('https://www.plantuml.com/plantuml', 'ABC123', true);

    assert.equal(url, 'https://www.plantuml.com/plantuml/dsvg/ABC123');
  });

  test('tolerates a trailing slash on the configured server', () => {
    const url = buildPlantumlUrl('https://uml.example.com/plantuml/', 'ABC123', false);

    assert.equal(url, 'https://uml.example.com/plantuml/svg/ABC123');
  });

  test('keeps an explicit port and sub-path intact', () => {
    const url = buildPlantumlUrl('http://localhost:8080/render', 'ABC123', false);

    assert.equal(url, 'http://localhost:8080/render/svg/ABC123');
  });

  test('rejects a server that is not http(s), so a source cannot be smuggled into another scheme', () => {
    assert.throws(() => buildPlantumlUrl('javascript:alert(1)', 'ABC123', false), /http/i);
  });

  test('rejects a blank server instead of building a relative URL', () => {
    assert.throws(() => buildPlantumlUrl('   ', 'ABC123', false), /server/i);
  });
});
