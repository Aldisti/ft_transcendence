let ip = "localhost";
let port = "8000";

export const availabilityCheck = {
    USERNAME: `http://${ip}:${port}/username/check`,
    EMAIL: `http://${ip}:${port}/email/check`,
}

export const userAction = {
    LOGIN:  `http://${ip}:${port}/auth/login/`,
    REGISTER:  `http://${ip}:${port}/register`,
    UPDATE_INFO:  `http://${ip}:${port}/register`,
    UPDATE_EMAIL:  `http://${ip}:${port}/register`,
    UPDATE_PASSWORD:  `http://${ip}:${port}/password`,

    TEST: `http://${ip}:${port}/users`
}