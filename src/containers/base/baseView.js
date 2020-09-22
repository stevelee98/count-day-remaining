import React, { Component } from "react";
import {
    BackHandler, ImageBackground, View, StatusBar, DeviceEventManager, Image, ActivityIndicator,
    TouchableOpacity, Dimensions, Platform, Alert, Linking, DeviceEventEmitter, Keyboard,
    PermissionsAndroid, NativeModules, ToastAndroid
} from "react-native";
import {
    Root, Form, Textarea, Container, Header, Title, Left, Icon, Right,
    Button, Body, Content, Text, Card, CardItem,
    Fab, Footer, Input, Item, ActionSheet, Spinner, Tabs, ScrollableTab, Tab,
} from "native-base";
import { CommonActions } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import { Constants } from "values/constants";
import HeaderView from "containers/common/headerView";
import commonStyles from 'styles/commonStyles';
import { Colors } from "values/colors";
import { ErrorCode } from "config/errorCode";
import { localizes } from "locales/i18n";
import StorageUtil from "utils/storageUtil";
import auth from '@react-native-firebase/auth';
import messing from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import ExamQuestionSectionType from "enum/examQuestionSectionType"
import formalType from "enum/formalType";
import DateUtil from "utils/dateUtil";
import Utils from 'utils/utils'
import Toast from 'react-native-root-toast';
import DeviceInfo from 'react-native-device-info';
import VersionNumber from 'react-native-version-number';
import statusType from "enum/statusType";
import rescueAndTransferType from "enum/rescueAndTransferType";
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager, LoginButton } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import StringUtil from "utils/stringUtil";
import { async } from "rxjs/internal/scheduler/async";
import { Fonts } from "values/fonts";
import imageRatio from "enum/imageRatio";
import userType from 'enum/userType';
import appType from "enum/appType";
import staffType from "enum/staffType";
import { configConstants } from "values/configConstants";
import notificationType from "enum/notificationType";
import viewPostType from "enum/viewPostType";
import actionGroupType from "enum/actionGroupType";
import roleType from "enum/roleType";
import typeListUser from "enum/typeListUser";
import screenType from "enum/screenType";

const screen = Dimensions.get("window");

const resetAction = CommonActions.reset({
    index: 0,
    routes: [{ name: "Main" }]
});

const resetActionLogin = CommonActions.reset({
    index: 0,
    routes: [{ name: 'Login', params: { logOuted: true } }],
});

const CHANNEL_ID = 'aaChannelId'
const CHANNEL_NAME = 'Thông báo chung'

/**
 * Base view class
 */
class BaseView extends Component {

    constructor(props) {
        super(props);
        this.className = this.constructor.name;
        this.isShowMessageBack = true;
        this.resourceUrlPath = {};
        this.resourceUrlPathResize = {};
        this.videos = {};
        this.hotline = {};
        this.isShowCardMember = false;
        this.baseView = this;
        this.userAdmin = null;
        this.maxFileSizeUpload = null;
        this.quantityCart = 0;
        this.uploadCommonImageRestriction = {};
        this.uploadCommonVideoRestriction = {};
        this.uploadReviewImageRestriction = {};
        this.userHasBeenSuspended = false;
        this.userHasBeenDeleted = false;
    }

    goto() {

    }

    render() {
        return (
            <View></View>
        );
    }

    /**
     * Has permission
     */
    hasPermission = async (permissions) => {
        if (Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(
            permissions
        );

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(
            permissions
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            console.log("Permission denied by user.");
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log("Permission revoked by user.");
        }

        return false;
    }

    /**
     * Show toast message
     * @param {*} message 
     * @param {*} duration 
     * @param {*} type 
     */
    showMessage(message, duration = 30000, type = 'warning') {
        try {
            if (Platform.OS === 'ios') {
                if (!global.isShowMessageError) {
                    global.isShowMessageError = true;
                    Toast.show(message, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                    });
                }
            } else {
                ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
            }
            setTimeout(() => {
                global.isShowMessageError = false
            }, 5000);
        } catch (e) {
            global.isShowMessageError = false
            console.log(e);
        }
    }

    //Show login view
    showLoginView(route) {
        if (!Utils.isNull(route)) {
            this.props.navigation.push('Login', {
                router: {
                    name: route.routeName,
                    params: route.params
                }
            })
        } else {
            this.props.navigation.navigate('Login')
        }
    }

    /**
     * Open camera roll view
     */
    showCameraRollView = async (params) => {
        const hasPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (hasPermission) this.props.navigation.navigate("CameraRoll", params);
    }

    //Save exception
    saveException(error, func) {
        let filter = {
            className: this.props.route ? this.props.route.name : this.className,
            exception: error.message + " in " + func,
            osVersion: DeviceInfo.getSystemVersion(),
            appVersion: VersionNumber.appVersion
        }
        // console.log(filter)
        this.props.saveException(filter)
    }

    componentWillMount() {
        // console.log("I am Base View", this.props);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onChangedOrientation)
    }

    /**
     * Sign out GG
     */
    signOutGG = async (data) => {
        try {
            if (!Utils.isNull(data)) {
                await GoogleSignin.signOut();
            }
        } catch (error) {
            this.saveException(error, "signOutGG")
        }
    };

    /**
     * Sign out FB
     */
    signOutFB = async (data) => {
        if (!Utils.isNull(data)) {
            LoginManager.logOut()
        }
    };

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        console.log(this.className, 'back pressed')
        if (this.props.navigation) {
            this.onBack()
            return true
        } else {
            return false
        }
        return true
    }

    /**
     * Back pressed
     * True: not able go back
     * False: go back
     */
    onBackPressed() {
        return false
    }

    /**
    * On back
    */
    onBack = () => {
        if (this.props.navigation.goBack) {
            setTimeout(() => {
                this.props.navigation.goBack()
            })
        }
    }

    /**
     * Go to home screen
     */
    goHomeScreen() {
        this.props.navigation.dispatch(resetAction)
    }

    /**
     * Go to login screen
     */
    goLoginScreen() {
        this.props.navigation.dispatch(resetActionLogin)
    }

    /**
     * Show cart
     */
    showCart = () => {
        this.props.navigation.navigate("Cart")
    }

    /**
     * go to Notification
     */
    gotoNotification = () => {
        this.props.navigation.navigate("NotificationHome")
    }

    /**
     * Go home
     */
    goHome = () => {
        this.props.navigation.navigate("Main")
    }

    /**
     * Render header view
     * default: visibleBack = true
     * onBack, stageSize, initialIndex
     *
     * @param {*} props 
     */
    renderHeaderView(props = {}) {
        const defaultProps = {
            visibleBack: true,
            onBack: this.onBack,
            shadowOffset: { height: 6, width: 3 },
            shadowOpacity: 0.25,
            elevation: Constants.SHADOW,
        }
        const newProps = { ...defaultProps, ...props }
        return <HeaderView {...newProps} />
    }

    /**
     * Render map view
     *
     * @param {*} props 
     */
    renderMapView(props = {}) {
        const defaultProps = {
            visibleMakerMyLocation: true,
            visibleLoadingBar: true,
            visibleButtonLocation: true
        }
        const newProps = { ...defaultProps, ...props }

    }

    /**
     * Go next screen
     * @param {*} className 
     * @param {*} params 
     * @param {*} isNavigate 
     */
    goNextScreen(className, params = this.props.route.params, isNavigate = true) {
        if (isNavigate)
            this.props.navigation.navigate(className, params)
        else
            this.props.navigation.push(className, params)
    }


    /**
     * get new notification
     */
    countNewNotification = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then((user) => {
            if (this.props.countNewNotification && !Utils.isNull(user) && user.status == statusType.ACTIVE) {
                this.props.countNewNotification()
            }
        }).catch((error) => {
            console.log(error)
        });
    }

    /**
     * Logout
     */
    logout = async () => {
        console.log("ON LOGOUT IN BASE VIEW");
        await StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
        await StorageUtil.storeItem(StorageUtil.USER_PROFILE, null)
        await StorageUtil.deleteItem(StorageUtil.USER_TOKEN)
        await StorageUtil.storeItem(StorageUtil.USER_TOKEN, null)
        await StorageUtil.deleteItem(StorageUtil.FIREBASE_TOKEN)
        await StorageUtil.deleteItem(StorageUtil.FCM_TOKEN)
        await StorageUtil.storeItem(StorageUtil.FIREBASE_TOKEN, null)
        await StorageUtil.storeItem(StorageUtil.FCM_TOKEN, null)
        global.token = ""
        global.firebaseToken = ""
        global.badgeCount = 0
        auth().signOut();
        this.signOutFB();
        this.signOutGG();
    }

    /**
     * Authentication firebase
     */
    signInWithCustomToken = async (userId) => {
        let firebaseToken = await StorageUtil.retrieveItem(StorageUtil.FIREBASE_TOKEN);
        console.log("FIREBASE TOKEN: ", firebaseToken)
        if (!Utils.isNull(firebaseToken) & !Utils.isNull(userId)) {
            if (Platform.OS === "android") {
                auth().signInWithCustomToken(firebaseToken).catch(function (error) {
                    console.warn("Error auth: " + error.code + " - " + error.message);
                });
            } else {
                var view = NativeModules.AppDelegate
                view.loginAuthenFirebase(firebaseToken)
            }
        }
    }

    /**
     * put info of user to firebase
     * @param {*} userId 
     * @param {*} userName 
     * @param {*} avatarPath 
     */
    putUserInfoToFirebase = (userId, userName, avatarPath) => {
        database().ref(`/users`)
            .child(userId)
            .set({
                name: userName,
                avatar: avatarPath,
                isOnline: true
            });
    }

    /**
     * Handle error
     * @param {} errorCode 
     */
    handleError(errorCode, error, action = null) {
        switch (errorCode) {
            case ErrorCode.ERROR_COMMON:
                this.showMessage(action == null ? localizes("error_in_process") : action + "  " + localizes("error_in_process"))
                break
            case ErrorCode.NO_CONNECTION:
                this.showMessage(localizes("error_connect_to_server"))
                break
            case ErrorCode.UN_AUTHORIZE:
            case ErrorCode.USER_HAS_BEEN_DELETED:
                if (!this.userHasBeenDeleted) {
                    this.userHasBeenDeleted = true;
                    this.showMessage(localizes("userHasBeenDeleted"));
                    this.logout();
                    this.props.navigation.navigate('Login');
                    let timeOut2;
                    timeOut2 = setTimeout(() => {
                        this.userHasBeenDeleted = false;
                        clearTimeout(timeOut2);
                    }, 3000);
                }
                break;
            case ErrorCode.USER_HAS_BEEN_SUSPENDED:
                if (!this.userHasBeenSuspended) {
                    this.userHasBeenSuspended = true;
                    this.showMessage(localizes("userHasBeenSuspended"));
                    this.logout();
                    this.props.navigation.navigate('Login');
                    let timeOut;
                    timeOut = setTimeout(() => {
                        this.userHasBeenSuspended = false;
                        clearTimeout(timeOut);
                    }, 3000);
                }
                break;
            case ErrorCode.AUTHENTICATE_REQUIRED:
                if (this.userHasBeenSuspended || this.userHasBeenDeleted) break;
                this.logout();
                if (!global.isShowMessageError) {
                    global.isShowMessageError = true;
                    Alert.alert(
                        localizes('notification'),
                        localizes('baseView.authenticateRequired'),
                        [
                            {
                                text: 'OK', onPress: () => {
                                    global.isShowMessageError = false;
                                    this.props.navigation.navigate('Login');
                                }
                            }
                        ],
                        { cancelable: false },
                    );
                }
                break

            default:
        }
    }

    /**
     * Handle connection change
     */
    handleConnectionChange = (isConnected) => {
        console.log(`is connected: ${isConnected}`)
    }

    /**
     * Open screen call
     * @param {*} phone 
     */
    renderCall(phone) {
        let url = `tel:${phone}`;
        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                console.log('Can\'t handle url: ' + url);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err =>
            this.saveException(err, "renderCall")
        );
    }

    /**
     * Show loading bar
     * @param {*} isShow 
     */
    showLoadingBar(isShow) {
        return isShow ? <Spinner style={{ position: 'absolute', top: (screen.height - 100) / 2, left: 0, right: 0, zIndex: 1000 }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    }

    /**
     * Get source url path
     */
    getSourceUrlPath = async () => {
        let mobileConfig = await StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG)
        if (!Utils.isNull(mobileConfig)) {
            this.maxFileSizeUpload = mobileConfig.find(x => x.name == 'max_file_size_upload') || {}
        }
    }

    async componentDidMount(){
        this.checkPermission();
    }


    getUserToken = () => {
        let token = StorageUtil.retrieveItem(StorageUtil.USER_TOKEN).then((token) => {
            global.token = token;
            console.log("USER TOKEN IN BASE VIEW: ", token);
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
            this.props.getConfig();
        })
    }

    /**
     * check permission
     */
    checkPermission = async () => {
        const enabled = await messing().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    /**
     * request permission
     */
    requestPermission = async () => {
        try {
            await messing().requestPermission();
            this.getToken();
        } catch (error) {
        }
    }

    /** 
     * get token
     */
    async getToken() {
        let fcmToken = await StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN);
        console.log("GET TOKEN IN BASE VIEW: ", fcmToken);
        if (!Utils.isNull(fcmToken)) {
            let fcmTokenNew = await messing().getToken();
            if (!Utils.isNull(fcmTokenNew) && fcmToken !== fcmTokenNew) {
                await StorageUtil.storeItem(StorageUtil.FCM_TOKEN, fcmTokenNew);
                this.refreshToken();
            } else if (!global.isSendTokenDevice) {
                this.refreshToken();
            }
        } else {
            fcmToken = await messing().getToken();
            if (fcmToken) {
                StorageUtil.storeItem(StorageUtil.FCM_TOKEN, fcmToken);
                this.refreshToken();
            }
        }
        messing().onTokenRefresh((token) => {
            StorageUtil.storeItem(StorageUtil.FCM_TOKEN, token);
            this.refreshToken()
        });
    }

    /**
     * Refresh token
     */
    refreshToken = async () => {
        try {
            let token = StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN)
        } catch {
            (error) => {
                console.log('Promise is rejected with error: ' + error);
            }
        };
    }

    goToScreen = () => {

    }

    createNotificationListeners = async () => {
        this.messageListener = messing().subscribeToTopic("all");
        this.messageListener = messing().onMessage((message) => {
            console.log('Notification message ' + JSON.stringify(message));
            const localNotification = new firebase.notifications.Notification({
                sound: 'default',
                show_in_foreground: true
            })
                .setNotificationId(notification._notificationId)
                .setTitle(notification._title)
                .setSubtitle(notification._subtitle)
                .setBody(notification._body)
                .setData(notification._data)
                .android.setPriority(firebase.notifications.Android.Priority.High)
                .android.setBigText(notification._body)
            if (Platform.OS === 'android' && localNotification.android.channelId == null) {
                const channel = new firebase.notifications.Android.Channel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    firebase.notifications.Android.Importance.Max
                ).setDescription('In stock channel');
                // Create the channel
                firebase.notifications().android.createChannel(channel);
                localNotification.android.setChannelId(channel.channelId);
            }
            // try {
            //     await firebase.notifications().displayNotification(localNotification);
            //     notification.android.setAutoCancel(true)
            //     if (!global.logout) {
            //         this.countNewNotification()
            //     }
            // } catch (e) {
            //     console.log('catch', e)
            // }
        });
        messing().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage.notification);
            // messing().removeAllDeliveredNotifications()
            if (!global.logout) {
                this.countNewNotification()
            }
            // this.goToScreen(notificationOpen.notification._data);
        });
        messing()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:', remoteMessage.notification,);
                    // setInitialRoute(remoteMessage.data.type); 
                }
            });

    }

    /**
     * Register keyboard event
     */
    registerKeyboardEvent() {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
    }

    /**
     * Handle show keyboard 
     * @param {*} e 
     */
    keyboardWillShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }

    /**
     * Handle hide keyboard
     * @param {*} e 
     */
    keyboardWillHide(e) {
        this.setState({ keyboardHeight: 0 });
    }
}

export default BaseView;
