/**
 * Converts a 2-letter ISO 3166-1 country code to its flag emoji.
 * Example: "SK" -> "🇸🇰", "GB" -> "🇬🇧", "US" -> "🇺🇸"
 */
export function isoToFlagEmoji(code: string): string {
    const upper = code.toUpperCase();
    if (upper.length !== 2 || !/^[A-Z]{2}$/.test(upper)) {
        return code;
    }
    const base = 0x1f1e6; // regional indicator symbol letter A
    return String.fromCodePoint(
        base + upper.charCodeAt(0) - 65,
        base + upper.charCodeAt(1) - 65,
    );
}
