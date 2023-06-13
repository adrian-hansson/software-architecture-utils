import { sanitizeText } from "./sanitize-text.util"

export const sanitizeId = (text: string): string => {
    return sanitizeText(text)
        .replace(' ', '')
        .replace(/[^A-Za-z0-9_]/g, '')
        .toLocaleLowerCase();
}
