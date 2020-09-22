import { fetchError } from "actions/commonActions"
import { ErrorCode } from "config/errorCode";
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
import * as banner from 'actions/bannerActions';
import { ServerPath } from 'config/Server';
import StorageUtil from "utils/storageUtil";
import ApiUtil from 'utils/apiUtil';
import Utils from "utils/utils";
import database from '@react-native-firebase/database';

export const Header = new Headers({
    "Accept": "application/json",
    'Content-Type': 'application/json',
    'X-APITOKEN': global.token
})

export const getBannerEpic = action$ =>
    action$.pipe(
        ofType(ActionEvent.GET_BANNER),
        switchMap((action) =>
            database().ref(`banner`)
            .limitToLast(10)
            .once('value', (val) => {
                console.log("messagesSnap: ", val.val());
                let data = {
                    data: val.val(),
                    errorCode: ErrorCode.ERROR_SUCCESS
                }
                console.log("bannerActions.getBannerSuccess(data);", new Object(banner.getBannerSuccess(data)));
                return data;
            }).then((responseJson) => {
                console.log("GET_BANNER EPIC", banner.getBannerSuccess(responseJson))
                let data = {
                    data: responseJson.val(),
                    errorCode: ErrorCode.ERROR_SUCCESS
                }
                return banner.getBannerSuccess(data)
            })
        )
    );
