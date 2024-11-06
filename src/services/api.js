export const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

export const endPoints = {
    LOGIN_API: BASE_URL + "/user/login",
    REGISTER_API: BASE_URL + "/user/register",
    LOGOUT_API : BASE_URL + '/user/logout',
    GET_MY_PROFILE_API : BASE_URL + '/user/me',
}