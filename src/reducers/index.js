import { combineReducers } from 'redux';
import userReducer from 'reducers/userReducer';
import homeReducer from 'reducers/homeReducer';
import bottomTabNavigator from 'reducers/bottomTabNavigatorReducer';
import { ErrorCode } from 'config/errorCode';

export const initialState = {
    data: null,
    isLoading: false,
    error: null,
    errorCode: ErrorCode.ERROR_INIT,
    action: null
}

export default combineReducers({
    user: userReducer,
    home: homeReducer,
    bottomTabNavigator: bottomTabNavigator,
});

