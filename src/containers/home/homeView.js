import React, { Component } from "react";
import {
    ImageBackground, View, Image, TouchableOpacity,
    BackHandler, Alert, Linking, ScrollView, NativeEventEmitter,
    DeviceEventEmitter, Platform, RefreshControl, Dimensions, Pressable,
    SafeAreaView, NativeModules, StatusBar, Animated, UIManager, LayoutAnimation,
} from "react-native";
import {
    Container, Title, Left, Icon, Right, Button, Body,
    Content, Text, Card, CardItem, Root, Header, Spinner
} from "native-base";
import styles from "./styles";
import BaseView from "containers/base/baseView";
import commonStyles from "styles/commonStyles";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import Utils from 'utils/utils';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import * as bannerActions from 'actions/bannerActions';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";
import { localizes } from "locales/i18n";
import { Fonts } from "values/fonts";
import statusType from "enum/statusType";
import DialogCustom from "components/dialogCustom";
import userType from "enum/userType";
import { configConstants } from "values/configConstants";
import FlatListCustom from "components/flatListCustom";
import BackgroundShadow from "components/backgroundShadow";
import DateUtil from "utils/dateUtil";
import VersionNumber from 'react-native-version-number';
import screenType from "enum/screenType";
import StringUtil from 'utils/stringUtil';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import ImageLoader from 'components/imageLoader';
import img_gradient from 'images/img_gradient.png';
import ActionButton from 'react-native-action-button';
import ic_add_blue from 'images/ic_add_blue.png';
import img_bg_event from 'images/img_bg_event.jpeg';
import { async } from "rxjs";

console.disableYellowBox = true;
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental && Platform.Version > 23
) {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

class HomeView extends BaseView {

    constructor(props) {
        super(props)
        this.state = {
            user: null,
            userType: null,
            avatar: "",
            appVersion: null,
            enableLoadMore: false,
            enableRefresh: true,
            isLoadingMore: false,
            refreshing: false,
            isAlertVersion: false,
            year: 0,
            month: 0,
            day: 0,
            hour: 0,
            minute: 0,
            second: 0,
            dayAlert: 0,
            hourAlert: 0,
            minuteAlert: 0,
            secondAlert: 0,
            indexBanner: 0,
            bannerTime: [],
            scrolling: false,
            dataTime: []
        };
        this.dataVersion = null;
        this.dayBefore = 1000;
        global.onExitApp = this.onExitApp.bind(this);
        this.banner = []
        this.diffs = []
        this.diffsData = [];
        this.intervalData = []
        this.interval = [];
        this.bannerTime = [];
        this.dataTime = [];
        this.data = []
    }

    /**
     * Press back exit app
     */
    onExitApp() {
        this.setState({ isAlertExitApp: true })
    }

    /**
     * Get profile user
     */
    getProfile = async () => {
        let user = await StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
        if (user != null) {
            this.user = user;
            this.setState({
                user: user
            })
            this.signInWithCustomToken(user.id);
        }
    }

    // handle get profile
    handleGetProfile(user) {
        this.setState({
            user: user,
            avatar: user.avatarPath,
            userType: user.userType
        });
    }

    async componentDidMount() {
        super.componentDidMount();
        BackHandler.addEventListener("hardwareBackPress", () => { this.handlerBackButton });
        this.getBanner();
        this.getBannerTime()
        StorageUtil.retrieveItem(StorageUtil.VERSION).then((version) => {
            this.setState({
                appVersion: version
            })
        }).catch((error) => {
            this.saveException(error, 'componentDidMount')
        })
        this.getProfile();
        if (!global.logout) {
            this.getProfile();
        }

        // let countDown = [
        //     {
        //         id: '123456',
        //         title: 'Đếm ngày nhận lương', 
        //         note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500',
        //         resource: 'https://cdn2.eyeem.com/thumb/314f1817e5acadb912ce87c018b1dd76a8141931-1521038537976/w/1280',
        //         dayEvent: '2020-10-10'
        //     },
        //     {
        //         id: '123789',
        //         title: 'Đếm ngày đi Đà Lạt', 
        //         note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500',
        //         resource: 'https://vcdn1-dulich.vnecdn.net/2019/05/23/12-1558593963.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=sEbfKs9N6CgwUja6gayIJA',
        //         dayEvent: '2020-10-25'
        //     },
        // ]
        // StorageUtil.storeItem(StorageUtil.LIST_EVENT, countDown)
        this.getListEvent()
    }

    handleRefresh = () => {
        this.state.refreshing = false;
        this.getProfile()
        this.getBanner()
        this.data = [];
        this.state.dataTime = []
        this.getListEvent()
    }

    getBanner = () => {
        this.props.getBanner()
    }

    getListEvent = async () => {
        let events = await StorageUtil.retrieveItem(StorageUtil.LIST_EVENT);
        if (events != null) {
            this.data = []
            this.data = events
            this.setState({
                dataTime: events
            })
            console.log("data get from storage", events);
            this.getTimeData(events)
        }
    }

    getBannerTime = (timeEvent) => {
        let now = new Date();
        this.banner.forEach((item, index) => {
            let dayEvent = new Date(timeEvent);
            let diff = dayEvent.getTime() - now.getTime();
            if (diff >= 0) {
                this.diffs.push(diff);
                this.interval.push(setInterval(() => {
                    if (this.diffs[index] >= 1000) {
                        this.convertMillisecond(this.diffs[index], index)
                        this.diffs[index] = this.diffs[index] - 1000
                    }
                }, 10000))
            }
        })
    }

    convertMillisecond = (millisecond, index) => {
        // this.year = Math.floor(millisecond / 31536000000);
        // this.month = Math.floor((millisecond - this.year * 31536000000) / 2629746000);
        let dayAlert = Math.floor(millisecond / 86400000);
        let hourAlert = Math.floor((millisecond - dayAlert * 86400000) / 3600000)
        let minuteAlert = Math.floor((millisecond - dayAlert * 86400000 - hourAlert * 3600000) / 60000);
        let secondAlert = Math.floor((millisecond - dayAlert * 86400000 - hourAlert * 3600000 - minuteAlert * 60000) / 1000);
        let time = {
            title: this.banner[index].title,
            resource: this.banner[index].resource,
            dayAlert: dayAlert,
            hourAlert: hourAlert,
            minuteAlert: minuteAlert,
            secondAlert: secondAlert
        }
        if (index < this.bannerTime.length) {
            this.bannerTime[index] = time
        } else {
            this.bannerTime.push({ ...time })
        }
        this.setState({
            bannerTime: this.bannerTime,
        })
    }

    getTimeData = (data) => {
        let now = new Date();
        data.forEach((item, index) => {
            if (item) {
                let dayEvent = new Date(item.dayEvent);
                let diff = dayEvent.getTime() - now.getTime();
                if (diff >= 0) {
                    this.convertMillisecondData(item, index, diff)
                }
            }
        })
    }

    convertMillisecondData = (item, index, millisecond) => {
        let dayAlert = Math.floor(millisecond / 86400000);
        let time = {
            ...item,
            dayAlert: dayAlert,
        }
        if (index < this.dataTime.length) {
            this.dataTime[index] = time
        } else {
            this.dataTime.push({ ...time })
        }
        this.setState({
            dataTime: this.dataTime,
        })
    }

    /**
     * Handler back button
     */
    handlerBackButton = () => {
        console.log(this.className, 'back pressed')
        if (this.props.navigation) {
            this.onExitApp();
        } else {
            return false
        }
        return true
    }

    /**
     * go to Login
     */
    gotoLogin = () => {
        this.props.navigation.navigate('Login')
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData();
        }
    }

    UNSAFE_componentWillUnmount() {
        super.componentWillUnmount();
        this.interval.forEach((item) => {
            clearInterval(item)
        })
        BackHandler.removeEventListener("hardwareBackPress", () => { this.handlerBackButton });
    }

    /**
     * Handle data when request 
     */
    handleData() {
        let data = this.props.userInfo;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.isLoadingMore = false;
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    if (!Utils.isNull(data) && data.status == statusType.ACTIVE) {
                        StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
                        this.handleGetProfile(data);
                    }
                } else if (this.props.action == ActionEvent.NOTIFY_LOGIN_SUCCESS) {
                    this.getProfile();
                } else if (this.props.action == getActionSuccess(ActionEvent.COUNT_NEW_NOTIFICATION)) {
                    let notifications = 0;
                    if (data != null) {
                        global.badgeCount = data;
                        notifications = global.badgeCount;
                        this.setState({ notificationsNumber: notifications });
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_UPDATE_VERSION)) {
                    this.checkUpdateVersion(data, this.state.appVersion)
                    this.props.getConfig();
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_CONFIG)) {
                    if (data) {
                        this.configList = data;
                        StorageUtil.storeItem(StorageUtil.MOBILE_CONFIG, this.configList);
                        this.configList.find((item) => {
                            if (item.name == "resource_url_path_resize") {
                                this.resourceUrlPathResize = item.textValue
                            }
                        })
                        this.props.getBanner()
                        this.getResource()
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_BANNER)) {
                    if (data != null && data.length > 0) {
                        this.banner = []
                        data.forEach(element => {
                            if (element != null) {
                                this.banner.push({ ...element });
                                this.getBannerTime(element.dayEvent)
                            }
                        });
                    }
                } else if (this.props.action == ActionEvent.REFRESH_HOME) {
                    console.log("refresh home");
                    this.handleRefresh()
                }
                this.state.refreshing = false
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }


    renderCommon = () => {
        return (
            <View style={styles.contentCommon}>
                {this.state.bannerTime.map((item, index) => {
                    return (
                        <View key={index} style={styles.bannerContainer}>
                            <Image
                                source={{ uri: item.resource }}
                                style={styles.imgBanner} />
                            <Image source={img_gradient} style={styles.imgGradient} />
                            <Text style={styles.appName}>Day by Day</Text>
                            <View style={styles.bannerContent}>
                                <Text style={styles.titleBanner}>{item.title}</Text>
                                <View style={styles.bannerTime}>
                                    {item.dayAlert > 0 && this.renderItemTime(item.dayAlert, 'ngày')}
                                    {item.hourAlert > 0 && this.renderItemTime(item.hourAlert, 'giờ')}
                                    {item.minuteAlert > 0 && this.renderItemTime(item.minuteAlert, 'phút')}
                                    {this.renderItemTime(item.secondAlert, 'giây')}
                                </View>

                            </View>

                        </View>
                    )
                })}
            </View>
        )
    }

    renderItemTime = (time, timeType) => {
        return (
            <View style={styles.itemTime}>
                <Text style={styles.txtTime}>{time}</Text>
                <Text style={styles.txtTimeType}>{timeType}</Text>
            </View>
        )
    }

    renderFAB = () => {
        return (
            !this.state.scrolling && <ActionButton
                buttonColor={Colors.COLOR_WHITE}
                shadowStyle={styles.fabBtn}
                renderIcon={() => <Image source={ic_add_blue}></Image>}
                onPress={() => { this.props.navigation.navigate("AddEvent", { callBack: this.handleRefresh }) }}
            />
        );
    }

    renderListTimeCountDown = () => {
        return (
            <FlatListCustom
                onRef={(ref) => { this.flatListRef = ref }}
                contentContainerStyle={{ flex: 1 }}
                data={this.state.dataTime}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={item => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                isShowEmpty={this.state.dataTime.length == 0}
                textForEmpty={'Chưa có dữ liệu'}
            />
        )
    }

    renderItem = (item, index) => {
        return (
            <ImageBackground
                key={index}
                onPress={() => { }}
                source={item.resource != null? { uri: item.resource } : img_bg_event}
                imageStyle={styles.imgBackground}
                style={styles.itemCountDown}
            >
                <Pressable
                    onPress={() => { this.props.navigation.navigate("EventDetail", { event: item }) }}
                    android_ripple={{
                        color: Colors.COLOR_WHITE,
                        borderless: false,
                    }}
                    style={styles.btnItem}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.itemTimeList}>
                            <Text style={styles.txtTimeList}>D - {item.dayAlert}</Text>
                            <Text style={styles.txtTimeTypeList}>{DateUtil.convertFromFormatToFormat(item.dayEvent, DateUtil.FORMAT_DATE_SQL, DateUtil.FORMAT_DATE)}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={2} style={styles.titleItem}>{item.title}</Text>
                    <Text numberOfLines={2} style={styles.noteItem}>{item.note}</Text>
                </Pressable>
            </ImageBackground>
        )
    }

    render() {
        const { user, avatar } = this.state;
        this.scrollY = new Animated.Value(0);
        return (
            <Container style={styles.container}>
                <Root>
                    <ScrollView
                        onScroll={Animated.event(
                            [{
                                nativeEvent: { contentOffset: { y: this.scrollY } }
                            }],
                            {
                                listener: (event) => {
                                    const CustomLayoutLinear = {
                                        duration: 200,
                                        create: {
                                            type: LayoutAnimation.Types.easeInEaseOut,
                                            property: LayoutAnimation.Properties.opacity,
                                        },
                                        delete: {
                                            type: LayoutAnimation.Types.easeInEaseOut,
                                            property: LayoutAnimation.Properties.opacity,
                                        },
                                        update: {
                                            type: LayoutAnimation.Types.easeInEaseOut,
                                            property: LayoutAnimation.Properties.opacity,
                                        },
                                    }
                                    LayoutAnimation.configureNext(CustomLayoutLinear);
                                    if (this.scrollY._value > 50) {
                                        this.setState({ scrolling: true })
                                    } else {
                                        this.setState({ scrolling: false })
                                    }
                                }
                            },
                            { useNativeDriver: Platform.OS === 'android' },
                        )}
                        scrollEventThrottle={1}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerContent}>
                        {this.renderCommon()}
                        <Text style={styles.txtEventHome}>Các sự kiện đang diễn ra</Text>
                        {this.renderListTimeCountDown()}
                    </ScrollView>
                    {this.renderFAB()}
                </Root>
                {this.renderAlertExitApp()}
                {this.state.isLoadingMore || this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                <StatusBar translucent backgroundColor='transparent' />
            </Container>
        );
    }

    /**
     * Render loading bar
     * @param {} isShow
     */
    showLoadingBar(isShow) {
        return isShow ? < Spinner style={{
            position: 'absolute',
            top: Constants.MAX_HEIGHT / 2,
            left: 0,
            right: 0,
            justifyContent: 'center',
            bottom: 0
        }} color={Colors.COLOR_PRIMARY} ></Spinner> : null
    }

    /**
     * Render alert Exit App
     */
    renderAlertExitApp() {
        return (
            <DialogCustom
                visible={this.state.isAlertExitApp}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={"Thông báo"}
                textBtnOne={"Không, cảm ơn"}
                textBtnTwo={"Thoát"}
                contentText={"Bạn muốn thoát ứng dụng?"}
                onTouchOutside={() => { this.setState({ isAlertExitApp: false }) }}
                onPressX={() => { this.setState({ isAlertExitApp: false }) }}
                onPressBtnPositive={() => {
                    BackHandler.exitApp()
                }}
            />
        )
    }

    /**
     * Render alert Version
     */
    renderAlertVersion() {
        if (!Utils.isNull(this.dataVersion)) {
            return (
                <DialogCustom
                    visible={this.state.isAlertVersion}
                    isVisibleTitle={true}
                    isVisibleContentText={true}
                    isVisibleTwoButton={true}
                    contentTitle={localizes('homeView.updateNewVersion')}
                    textBtnOne={this.dataVersion.force === 0 ? localizes('no') : ""}
                    textBtnTwo={localizes('yes')}
                    contentText={this.dataVersion.description}
                    onTouchOutside={() => { this.setState({ isAlertVersion: false }) }}
                    onPressX={this.dataVersion.force === 0 ? () => {
                        this.setState({ isAlertVersion: false })
                        saveStorage(this.dataVersion)
                    } : null}
                    onPressBtnPositive={() => {
                        renderWebView(this.dataVersion.link)
                        this.setState({ isAlertVersion: false })
                        saveStorage(this.dataVersion)
                    }}
                />
            )
        }
    }

    /**
     * Check update version
     */
    checkUpdateVersion = (data, appVersion) => {
        this.dataVersion = data
        if (data != null) {
            if (data.version.toString() > VersionNumber.appVersion) {
                if (data.force === 0) {
                    if (appVersion != null || appVersion != undefined) {
                        if (appVersion.version !== data.version) {
                            this.setState({ isAlertVersion: true })
                        }
                    } else {
                        this.setState({ isAlertVersion: true })
                    }
                } else {
                    this.setState({ isAlertVersion: true })
                }
            }
        } else {
            StorageUtil.deleteItem(StorageUtil.VERSION);
        }
    }
}

saveStorage = (data) => {
    StorageUtil.storeItem(StorageUtil.VERSION, data)
}

renderWebView = (link) => {
    Linking.openURL(link)
    RNRestart.Restart()
}

const mapStateToProps = state => ({
    userInfo: state.home.data,
    isLoading: state.home.isLoading,
    error: state.home.error,
    errorCode: state.home.errorCode,
    action: state.home.action,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...bannerActions
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
