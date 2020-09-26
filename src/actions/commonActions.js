import { ActionEvent, getActionSuccess } from "./actionEvent";

export const resetAction = () => ({
    type: ActionEvent.RESET_ACTION
})

export const fetchError = (errorCode, error) => ({
    type: ActionEvent.REQUEST_FAIL,
    payload: { errorCode, error }
})

export const saveException = (filter) => ({
    type: ActionEvent.SAVE_EXCEPTION,
    payload: { ...filter }
})

export const saveExceptionSuccess = data => ({
    type: getActionSuccess(ActionEvent.SAVE_EXCEPTION),
    payload: { data }
})

export const pushNotification = (filter) => ({
    type: ActionEvent.PUSH_NOTIFICATION,
    payload: { ...filter }
})

export const pushNotificationSuccess = data => ({
    type: getActionSuccess(ActionEvent.PUSH_NOTIFICATION),
    payload: { data }
})

export const refreshHome = () => ({
    type: ActionEvent.REFRESH_HOME
})

export const refreshHomeSuccess = data => ({
    type: getActionSuccess(ActionEvent.REFRESH_HOME),
    payload: { data }
})