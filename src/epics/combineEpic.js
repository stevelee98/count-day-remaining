import { combineEpics } from 'redux-observable';
import {
    loginEpic,
    registerEpic,
    getUserInfoEpic,
    editProfileEpic,
    changePassEpic,
    forgetPassEpic,
    getNotificationsEpic,
    getConfigEpic,
    postUserDeviceInfoEpic,
    deleteUserDeviceInfoEpic,
    countNewNotificationEpic,
    readAllNotificationEpic,
    resetPasswordEpic,
    loginViaSocialEpic
} from './userEpics';
import {
    getCountryEpic,
    getUpdateVersionEpic,
    saveExceptionEpic,
    pushNotificationEpic
} from './commonEpic';

import {
    getBannerEpic
} from './bannerEpic'
import { from } from 'rxjs';
export default combineEpics(
    loginEpic,
    registerEpic,
    getUserInfoEpic,
    editProfileEpic,
    changePassEpic,
    forgetPassEpic,
    getNotificationsEpic,
    getConfigEpic,
    postUserDeviceInfoEpic,
    deleteUserDeviceInfoEpic,
    countNewNotificationEpic,
    readAllNotificationEpic,
    resetPasswordEpic,
    loginViaSocialEpic,
    getUpdateVersionEpic,
    saveExceptionEpic,
    pushNotificationEpic,
    getBannerEpic
)
