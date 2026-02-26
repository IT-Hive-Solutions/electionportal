export const baseUrl = "/api"

export const endpoints = {
    candidates: Object.assign(
        `${baseUrl}/candidates`,
        { report: `${baseUrl}/candidates/reports`, }
    ), request: (path: string) => `${baseUrl}/proxy/${path}`,
    image: {
        getRawImageById: (id: string) => `${baseUrl}/image/getById/${id}`,
    }
}