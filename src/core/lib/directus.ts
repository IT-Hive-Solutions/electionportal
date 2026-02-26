
import {
    createDirectus,
    rest,
    staticToken
} from "@directus/sdk";

export const DIRECTUS_BASE_URL = process.env.DIRECTUS_BASE_URL || "";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || "";

export function getDirectusClient() {
    return createDirectus(DIRECTUS_BASE_URL)
        .with(staticToken(DIRECTUS_TOKEN))  // token already managed by your cookie system
        .with(rest())
}


export const directusPublic = createDirectus(DIRECTUS_BASE_URL).with(rest());


export function getAssetURL(fileId: string) {
    return `${DIRECTUS_BASE_URL}assets/${fileId}`;
}

export function getDownloadUrl(fileId: string) {
    return `${DIRECTUS_BASE_URL}assets/${fileId}?download`;
}


