export const ActionEvent = {
    RESET_ACTION: 'resetAction',
    LOGIN: 'login',
    REQUEST_FAIL: 'requestFail',
    REGISTER: 'register',
    GET_USER_INFO: 'getUserInfo',
    GET_CONFIG: 'getConfig',
    SIGN_UP: 'signUp',
    FORGET_PASS: 'forgetPass',
    CHANGE_PASS: 'changePass',
    GET_NOTIFICATIONS: 'GET_NOTIFICATIONS',
    GET_MAIN_NOTIFICATIONS: 'GET_MAIN_NOTIFICATIONS',
    RESET_DATA: 'RESET_DATA',
    LOGOUT: 'logOut',
    NOTIFY_LOGIN_SUCCESS: 'notifyLoginSuccess',
    LOGIN_GOOGLE: 'LOGIN_GOOGLE',
    LOGIN_FB: 'LOGIN_FB',
    GET_BANNER: 'getBanner',
    RESET_PASSWORD: 'resetPassword',
    LOGIN_SOCIAL: 'loginViaSocial',
    PUSH_NOTIFICATION: 'pushNotification',
};

export function getActionSuccess(action) {
    return action + 'Success'
}
