/**
 * Strict, reusable client-side file validation for uploads (images, PDFs).
 * Mirrors the server-side limits enforced on the Supabase Storage bucket, so the
 * user gets instant feedback while the server remains the final authority.
 */

export interface FileRule {
  /** Maximum size in bytes. */
  maxBytes: number;
  /** Allowed MIME types (exact match). */
  accept: string[];
  /** Human-readable description for error messages + the file input `accept` hint. */
  label: string;
}

const MB = 1024 * 1024;

export const IMAGE_RULE: FileRule = {
  maxBytes: 2 * MB,
  accept: ['image/jpeg', 'image/png', 'image/webp'],
  label: 'JPG, PNG or WebP up to 2 MB',
};

export const PDF_RULE: FileRule = {
  maxBytes: 5 * MB,
  accept: ['application/pdf'],
  label: 'PDF up to 5 MB',
};

/** Returns an error message if invalid, or null if the file passes the rule. */
export function validateFile(file: File, rule: FileRule): string | null {
  if (!rule.accept.includes(file.type)) {
    return `Invalid file type — allowed: ${rule.label}.`;
  }
  if (file.size > rule.maxBytes) {
    const max = Math.round(rule.maxBytes / MB);
    return `File is too large (max ${max} MB).`;
  }
  return null;
}

/** Convenience value for an <input type="file" accept="..."> attribute. */
export function acceptAttr(rule: FileRule): string {
  return rule.accept.join(',');
}
