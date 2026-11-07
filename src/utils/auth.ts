const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(normalizeEmail(email));
}

export function getAuthErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (isRecord(error)) {
    const entries = error.errors;

    if (Array.isArray(entries)) {
      const messages = entries.flatMap((entry) => {
        if (!isRecord(entry)) return [];
        const message =
          typeof entry.longMessage === "string"
            ? entry.longMessage
            : entry.message;
        return typeof message === "string" && message ? [message] : [];
      });

      if (messages.length > 0) return messages.join("\n");
    }

    if (error instanceof Error && error.message) return error.message;
  }

  return fallback;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Use at least 8 characters for your password.";
  }
  return null;
}
