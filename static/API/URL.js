let ip = "192.168.1.32";
let port = "8000";
let pongPort = "7000";

export const availabilityCheck = {
    USERNAME: `http://${ip}:${port}/users/check/`,
    EMAIL: `http://${ip}:${port}/users/check/`,
}

export const general = {
    USER_INFO: `http://${ip}:${port}/users/`,
    GET_USERS: `http://${ip}:${port}/users/`,
    INTRA_URL: `http://${ip}:${port}/oauth2/intra/url/`,
    CONVERT_INTRA_TOKEN: `http://${ip}:${port}/oauth2/intra/login/`,
    LINK_INTRA_TOKEN_ACCOUNT: `http://${ip}:${port}/oauth2/intra/link/`,
}

export const auth = {
    ACTIVATE_TFA: `http://${ip}:${port}/2fa/manage/`,
    GET_EMAIL_CODE: `http://${ip}:${port}/tokens/otp/`,
    VALIDATE_CODE: `http://${ip}:${port}/2fa/validate/activate/`,
    VALIDATE_CODE_LOGIN: `http://${ip}:${port}/2fa/validate/login/`,
    VALIDATE_CODE_RECOVERY: `http://${ip}:${port}/2fa/validate/recover/`,
    CHECK_TFA_STATUS: `http://${ip}:${port}/2fa/manage/`,
    REMOVE_TFA: `http://${ip}:${port}/2fa/manage/`,
    SEND_RECOVERY_CODE: `http://${ip}:${port}/tokens/recovery/`,
    UPDATE_PASSWORD: `http://${ip}:${port}/tokens/password/`,
    INTRA_STATUS: `http://${ip}:${port}/oauth2/linked/`,

    GET_GOOGLE_URL: `http://${ip}:${port}/oauth2/google/v2/url/`,
    UNLINK_GOOGLE_ACCOUNT: `http://${ip}:${port}/oauth2/google/unlink/`,
    LINK_GOOGLE_ACCOUNT: `http://${ip}:${port}/oauth2/google/v2/link/`,
    LOGIN_WITH_GOOGLE: `http://${ip}:${port}/oauth2/google/v2/login/`,
}

export const friendship = {
    SEND_REQUEST: `http://${ip}:${port}/friends/request/send/`,
    REMOVE_FRIEND: `http://${ip}:${port}/friends/request/delete/`,
    ACCEPT_REQUEST: `http://${ip}:${port}/friends/request/accept/`,
    DENY_REQUEST: `http://${ip}:${port}/friends/request/reject/`,
    FRIEND_STATUS: `http://${ip}:${port}/friends/`,
    GET_FRIENDS: `http://${ip}:${port}/friends/all/`,
}

export const socket = {
    CHAT_SOCKET: `ws://${ip}:${port}/ws/chat/socket/`,
    NOTIFICATION_SOCKET: `ws://${ip}:${port}/ws/notification/socket/`,
    GET_TICKET: `http://${ip}:${port}/auth/ticket/`,

    GET_QUEQUE_TICKET: `http://${ip}:${port}/auth/ticket/matchmaking/`,
    GAME_SOCKET: `ws://${ip}:${pongPort}/ws/game/socket/`,
    QUEUE_SOCKET: `ws://${ip}:${pongPort}/ws/matchmaking/queue/`
}

export const userAction = {
    REFRESH_TOKEN: `http://${ip}:${port}/auth/refresh/`,
    LOGIN: `http://${ip}:${port}/auth/login/`,
    LOGOUT: `http://${ip}:${port}/auth/logout/`,
    LOGOUT_ALL: `http://${ip}:${port}/auth/logout/all/`,
    REGISTER: `http://${ip}:${port}/register/`,
    UPDATE_INFO: `http://${ip}:${port}/users/info/update/`,
    UPDATE_PHOTO: `http://${ip}:${port}/users/image/upload/`,
    UPDATE_EMAIL: `http://${ip}:${port}/register`,
    UPDATE_PASSWORD: `http://${ip}:${port}/users/password/update/`,

    TEST: `http://${ip}:${port}/users`
}