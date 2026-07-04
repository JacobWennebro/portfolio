/**
 * Converts a 2-letter ISO 3166-1 country code or ISO 3166-2 subdivision code
 * to its flag emoji.
 *
 * Standard codes: "SK" -> "🇸🇰", "US" -> "🇺🇸"
 * Subdivision codes with known flags: "GB-WLS" -> "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
 * Falls back to parent country flag for unrecognized subdivisions.
 */
export function isoToFlagEmoji(code: string): string {
    const upper = code.toUpperCase();

    // Subdivision codes: XX-YYY
    const subMatch = upper.match(/^([A-Z]{2})-([A-Z]{2,3})$/);
    if (subMatch) {
        const [, parent, sub] = subMatch;

        // Known subdivision flags via tag sequence (waving black flag + tags + cancel)
        const knownSubFlags: Record<string, string> = {
            "GB-WLS": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}", // Wales
            "GB-SCT": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}", // Scotland
            "GB-ENG": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", // England
        };

        if (knownSubFlags[upper]) {
            return knownSubFlags[upper];
        }

        // No known flag for this subdivision (e.g. GB-NIR) — fall back to parent
        return _countryFlag(parent);
    }

    // Standard 2-letter country code
    return _countryFlag(upper);
}

function _countryFlag(code: string): string {
    if (code.length !== 2 || !/^[A-Z]{2}$/.test(code)) {
        return code;
    }
    const base = 0x1f1e6; // regional indicator symbol letter A
    return String.fromCodePoint(
        base + code.charCodeAt(0) - 65,
        base + code.charCodeAt(1) - 65,
    );
}
