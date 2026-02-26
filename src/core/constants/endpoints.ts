export const baseUrl = "/api"

export const endpoints = {
    request: (path: string) => `${baseUrl}/proxy/${path}`,
    image: {
        getRawImageById: (id: string) => `${baseUrl}/image/getById/${id}`,
    }
}