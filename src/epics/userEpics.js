import { ActionEvent } from 'actions/actionEvent'
import { Observable } from 'rxjs';
import {
    map,
    filter,
    catchError,
    mergeMap
} from 'rxjs/operators';
import { ofType } from 'redux-observable';
import { delay, mapTo, switchMap } from 'rxjs/operators';
import { dispatch } from 'rxjs/internal/observable/range';
import * as userActions from 'actions/userActions';
import { ServerPath } from 'config/Server';
import { Header, handleErrors, consoleLogEpic, handleConnectErrors } from './commonEpic';
import { ErrorCode } from 'config/errorCode';
import { fetchError } from 'actions/commonActions';
import ApiUtil from 'utils/apiUtil';


/**
 * Login
 * @param {*} action$ 
 */
export const loginEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/log-me-in', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("LOGIN USER_EPIC:", responseJson);
                if (responseJson.errorCode == ErrorCode.LOGIN_FAIL_USERNAME_PASSWORD_MISMATCH) {
                    // this.showMessage('Tài khoản hoặc mật khẩu không đúng')
                }
                return userActions.loginSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("LOGIN USER_EPIC:", ActionEvent.LOGIN, error)
                    return handleConnectErrors(error)
                })
        )
    );

export const registerEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.REGISTER),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'register', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                alert(ServerPath.API_URL)
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.loginSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("REGISTER USER_EPIC:", ActionEvent.REGISTER, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const changePassEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.CHANGE_PASS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/password/change', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.changePassSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("CHANGE_PASS USER_EPIC:", ActionEvent.CHANGE_PASS, error);
                    return handleConnectErrors(error);
                })
        )
    );

export const getUserInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_USER_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/${action.payload.userId}/profile`, {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_USER_INFO EPIC ", responseJson);
                return userActions.getUserProfileSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_USER_INFO USER_EPIC:", ActionEvent.GET_USER_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const editProfileEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.EDIT_PROFILE),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/edit', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.editProfileSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("EDIT_PROFILE USER_EPIC:", ActionEvent.EDIT_PROFILE, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const signUp = action$ =>
    action$.pipe(
        ofType(ActionEvent.SIGN_UP),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/signup', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.signUpSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("SIGN_UP USER_EPIC:", ActionEvent.SIGN_UP, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const forgetPassEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.FORGET_PASS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/forget-password', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.forgetPassSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("FORGET_PASS USER_EPIC:", ActionEvent.FORGET_PASS, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getNotificationsEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_NOTIFICATIONS),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.filter)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("NOTIFICATIONS: ", responseJson)
                return userActions.getNotificationsSuccess(responseJson)
            }).catch((error) => {
                consoleLogEpic("GET_NOTIFICATIONS USER_EPIC:", ActionEvent.GET_NOTIFICATIONS, error);
                return handleConnectErrors(error)
            })
        )
    )

export const getConfigEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_CONFIG),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/m/config', {
                method: 'GET',
                //headers:Header
                headers: ApiUtil.getHeader()
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("GET_config", responseJson);
                return userActions.getConfigSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("GET_CONFIG USER_EPIC:", ActionEvent.GET_CONFIG, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const postUserDeviceInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.USER_DEVICE_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/device', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.postUserDeviceInfoSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("USER_DEVICE_INFO USER_EPIC:", ActionEvent.USER_DEVICE_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const deleteUserDeviceInfoEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.DELETE_USER_DEVICE_INFO),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/delete/device', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson);
                return userActions.deleteUserDeviceInfoSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("DELETE_USER_DEVICE_INFO USER_EPIC:", ActionEvent.DELETE_USER_DEVICE_INFO, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const countNewNotificationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.COUNT_NEW_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/count/new/notification', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors("COUNT NEW NOTIFICATION JSO", response)
            }).then((responseJson) => {
                console.log("COUNT NEW NOTIFICATION JSON", responseJson);
                global.badgeCount = responseJson.data
                return userActions.countNewNotificationSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("COUNT_NEW_NOTIFICATION USER_EPIC:", ActionEvent.COUNT_NEW_NOTIFICATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const readAllNotificationEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.READ_ALL_NOTIFICATION),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/notification/seen/all', {
                method: 'GET',
                headers: ApiUtil.getHeader(),
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("READ_ALL_NOTIFICATION JSON", responseJson);
                return userActions.readAllNotificationSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("READ_ALL_NOTIFICATION USER_EPIC:", ActionEvent.READ_ALL_NOTIFICATION, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const getUserRequestEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_USER_REQUEST),
        switchMap((action) =>
            fetch(ServerPath.API_URL + `user/request/list`, {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log(responseJson)
                return userActions.getUserRequestSuccess(responseJson)
            })
                .catch((error) => {
                    consoleLogEpic("GET_USER_REQUEST EPIC:", ActionEvent.GET_USER_REQUEST, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const resetPasswordEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.RESET_PASSWORD),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/password/reset', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("RESET_PASSWORD", responseJson);
                return userActions.resetPasswordSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("RESET_PASSWORD USER_EPIC:", ActionEvent.RESET_PASSWORD, error);
                    return handleConnectErrors(error)
                })
        )
    );

export const loginViaSocialEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.LOGIN_SOCIAL),
        switchMap((action) =>
            fetch(ServerPath.API_URL + 'user/login/social', {
                method: 'POST',
                headers: ApiUtil.getHeader(),
                body: JSON.stringify(action.payload)
            }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return handleErrors(response)
            }).then((responseJson) => {
                console.log("LOGIN_SOCIAL", responseJson);
                return userActions.loginViaSocialSuccess(responseJson);
            })
                .catch((error) => {
                    consoleLogEpic("LOGIN_SOCIAL USER_EPIC:", ActionEvent.LOGIN_SOCIAL, error);
                    return handleConnectErrors(error)
                })
        )
    );