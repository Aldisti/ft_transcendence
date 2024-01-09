let ip = "localhost";
let port = "8000";

export const availabilityCheck = {
    USERNAME: `http://${ip}:${port}/users/`,
    EMAIL: `http://${ip}:${port}/users/`,
}

export const general = {
    INTRA_URL: `http://${ip}:${port}/oauth2/intra/url/`,
}

export const userAction = {
    REFRESH_TOKEN: `http://${ip}:${port}/auth/refresh/`,
    LOGIN: `http://${ip}:${port}/auth/login/`,
    LOGOUT: `http://${ip}:${port}/auth/logout/`,
    REGISTER: `http://${ip}:${port}/register/`,
    UPDATE_INFO: `http://${ip}:${port}/register`,
    UPDATE_EMAIL: `http://${ip}:${port}/register`,
    UPDATE_PASSWORD: `http://${ip}:${port}/password`,

    TEST: `http://${ip}:${port}/users`
}