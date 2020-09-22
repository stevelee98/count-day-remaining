import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import { initialState } from './index'
import { ErrorCode } from 'config/errorCode';


export default function (state = initialState, action) {
    console.log("get action success", action);
    switch (action.type) {
        case ActionEvent.NOTIFY_LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                error: null,
                errorCode: ErrorCode.ERROR_SUCCESS,
                data: null,
                action: action.type,
            }
        case ActionEvent.GET_USER_INFO:
        case ActionEvent.GET_CONFIG:
        case ActionEvent.GET_UPDATE_VERSION:
        case ActionEvent.USER_DEVICE_INFO:
        case ActionEvent.GET_BANNER:
            return {
                ...state,
                isLoading: true,
                error: null,
                errorCode: ErrorCode.ERROR_INIT,
                data: null,
                action: action.type,
            }
        case getActionSuccess(ActionEvent.GET_USER_INFO):
        case getActionSuccess(ActionEvent.GET_CONFIG):
        case getActionSuccess(ActionEvent.GET_UPDATE_VERSION):
        case getActionSuccess(ActionEvent.USER_DEVICE_INFO):
        case getActionSuccess(ActionEvent.GET_BANNER):
            console.log("get action success", action);
            return {
                ...state,
                isLoading: false,
                data: action.payload.data.data !== undefined ? action.payload.data.data : null,
                errorCode: action.payload.data.errorCode,
                action: action.type,
            }
        case ActionEvent.REQUEST_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload.error,
                errorCode: action.payload.errorCode,
                action: action.type
            }
        default:
            return state;
    }
}
