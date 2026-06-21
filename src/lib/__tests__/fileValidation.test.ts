import { describe, it, expect } from 'vitest';
import { validateFile, acceptAttr, IMAGE_RULE, PDF_RULE } from '../fileValidation';

function fakeFile(type: string, bytes: number): File {
  const blob = new Blob([new Uint8Array(0)], { type });
  // size is read-only on File; stub it for the test.
  return Object.defineProperty(new File([blob], 'x', { type }), 'size', { value: bytes });
}

describe('validateFile — images', () => {
  it('accepts a small JPG/PNG/WebP', () => {
    expect(validateFile(fakeFile('image/jpeg', 500_000), IMAGE_RULE)).toBeNull();
    expect(validateFile(fakeFile('image/png', 1_000_000), IMAGE_RULE)).toBeNull();
    expect(validateFile(fakeFile('image/webp', 2_000_000), IMAGE_RULE)).toBeNull();
  });
  it('rejects a wrong type', () => {
    expect(validateFile(fakeFile('image/gif', 100), IMAGE_RULE)).toMatch(/file type/i);
    expect(validateFile(fakeFile('application/pdf', 100), IMAGE_RULE)).toMatch(/file type/i);
  });
  it('rejects an oversized image', () => {
    expect(validateFile(fakeFile('image/png', 3 * 1024 * 1024), IMAGE_RULE)).toMatch(/too large/i);
  });
});

describe('validateFile — PDFs', () => {
  it('accepts a PDF under the limit and rejects over', () => {
    expect(validateFile(fakeFile('application/pdf', 1_000_000), PDF_RULE)).toBeNull();
    expect(validateFile(fakeFile('application/pdf', 6 * 1024 * 1024), PDF_RULE)).toMatch(/too large/i);
  });
  it('rejects a non-PDF', () => {
    expect(validateFile(fakeFile('image/png', 100), PDF_RULE)).toMatch(/file type/i);
  });
});

describe('acceptAttr', () => {
  it('joins MIME types for the input accept attribute', () => {
    expect(acceptAttr(IMAGE_RULE)).toBe('image/jpeg,image/png,image/webp');
    expect(acceptAttr(PDF_RULE)).toBe('application/pdf');
  });
});
