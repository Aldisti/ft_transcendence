let ip = "${ip}";
let port = "${port}";

export const availabilityCheck = {
    USERNAME: `http://${ip}:${port}/username/check`,
    EMAIL: `http://${ip}:${port}/email/check`,
}

export const userAction = {
    LOGIN:  `http://${ip}:${port}/login`,
    REGISTER:  `http://${ip}:${port}/register`,
    UPDATE_INFO:  `http://${ip}:${port}/register`,
    UPDATE_EMAIL:  `http://${ip}:${port}/register`,
    UPDATE_PASSWORD:  `http://${ip}:${port}/password`,
}