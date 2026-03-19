// src/utils/extractJSON.js
/**
 * Robustly extract a JSON object or array from an LLM response string.
 * Handles:
 *  - Clean JSON responses
 *  - ```json ... ``` markdown fences
 *  - Leading/trailing prose around the JSON block
 *  - Single-quoted keys (common Gemini quirk)
 */
export function extractJSON(raw) {
    if (typeof raw !== "string") {
        if (raw && typeof raw === "object") return raw; // already parsed
        throw new Error("extractJSON: input is not a string or object");
    }

    // 1. Strip markdown code fences
    let cleaned = raw
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

    // 2. Try direct parse first (happy path)
    try {
        return JSON.parse(cleaned);
    } catch (_) { /* fall through */ }

    // 3. Find the first { or [ and last } or ] to extract the JSON block
    const firstBrace = cleaned.indexOf("{");
    const firstBracket = cleaned.indexOf("[");
    let start = -1;
    let closeChar;

    if (firstBrace === -1 && firstBracket === -1) {
        throw new Error("extractJSON: no JSON object or array found in response");
    }

    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        start = firstBrace;
        closeChar = "}";
    } else {
        start = firstBracket;
        closeChar = "]";
    }

    const end = cleaned.lastIndexOf(closeChar === "}" ? "}" : "]");
    if (end === -1) throw new Error("extractJSON: malformed JSON — no closing bracket");

    const slice = cleaned.slice(start, end + 1);

    // 4. Try parsing the extracted slice
    try {
        return JSON.parse(slice);
    } catch (_) { /* fall through */ }

    // 5. Last resort: replace single quotes around keys/values
    try {
        const fixed = slice.replace(/'/g, '"');
        return JSON.parse(fixed);
    } catch (e) {
        throw new Error(`extractJSON: could not parse LLM response as JSON. Raw: ${raw.slice(0, 200)}`);
    }
}
