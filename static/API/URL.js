let ip = "localhost";
let port = "8000";

export const availabilityCheck = {
    USERNAME: `http://${ip}:${port}/users/check/`,
    EMAIL: `http://${ip}:${port}/users/check/`,
}

export const general = {
    INTRA_URL: `http://${ip}:${port}/oauth2/intra/url/`,
    USER_INFO: `http://${ip}:${port}/users/`,
    CONVERT_INTRA_TOKEN: `http://${ip}:${port}/oauth2/intra/login/`,
    LINK_INTRA_TOKEN_ACCOUNT: `http://${ip}:${port}/oauth2/intra/link/`,
}

export const auth = {
    ACTIVATE_TFA: `http://${ip}:${port}/2fa/manage/`,
    GET_EMAIL_CODE: `http://${ip}:${port}/tokens/otp/`,
    VALIDATE_CODE: `http://${ip}:${port}/2fa/validate/activate/`,
    VALIDATE_CODE_LOGIN: `http://${ip}:${port}/2fa/validate/login/`,
    CHECK_TFA_STATUS: `http://${ip}:${port}/2fa/manage/`,
    REMOVE_TFA: `http://${ip}:${port}/2fa/manage/`,

}

export const userAction = {
    REFRESH_TOKEN: `http://${ip}:${port}/auth/refresh/`,
    LOGIN: `http://${ip}:${port}/auth/login/`,
    LOGOUT: `http://${ip}:${port}/auth/logout/`,
    REGISTER: `http://${ip}:${port}/register/`,
    UPDATE_INFO: `http://${ip}:${port}/users/info/update/`,
    UPDATE_PHOTO: `http://${ip}:${port}/users/image/upload/`,
    UPDATE_EMAIL: `http://${ip}:${port}/register`,
    UPDATE_PASSWORD: `http://${ip}:${port}/users/password/update/`,

    TEST: `http://${ip}:${port}/users`
}