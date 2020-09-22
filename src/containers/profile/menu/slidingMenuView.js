import React, { Component } from "react";
import { Root, Header, Title, Content, Container, Tabs, Tab, TabHeading, List, Col } from "native-base";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    Dimensions,
    RefreshControl,
    processColor,
    Item,
    Input,
    Modal,
    TouchableHighlight,
    ToastAndroid,
    Picker,
    SafeAreaView,
    DeviceEventEmitter,
    NativeModules,
    ImageBackground,
    Platform,
    StatusBar
} from "react-native";
import commonStyles from "styles/commonStyles";
import { Constants } from "values/constants"
import { Colors } from "values/colors";
import { localizes } from "locales/i18n";
import BaseView from "containers/base/baseView";
import Dialog, { DIALOG_WIDTH } from 'components/dialog'
import FlatListCustom from "components/flatListCustom";
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import * as productActions from "actions/productActions";
import * as orderActions from 'actions/orderActions'
import { connect } from "react-redux";
import { ErrorCode } from "config/errorCode";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import Utils from 'utils/utils';
import StringUtil from 'utils/stringUtil';
import StorageUtil from "utils/storageUtil";
import DateUtil from "utils/dateUtil";
import styles from "./styles";
import moment from 'moment';
import { ServerPath } from "config/Server";
import Upload from 'lib/react-native-background-upload'
import ApiUtil from "utils/apiUtil";
import ImageLoader from "components/imageLoader";
import { Fonts } from "values/fonts";
import { ListItem } from "react-native-elements";
import { CalendarScreen } from 'components/calendarScreen';
import dataType from 'enum/dataType';
import listType from "enum/listType";
import DialogCustom from "components/dialogCustom";
import { configConstants } from "values/configConstants";
 
import ButtonGradient from 'containers/common/buttonGradient';
import LinearGradient from "react-native-linear-gradient";
import ic_camera_white from "images/ic_camera_white.png";
import conversationStatus from "enum/conversationStatus";
import ic_google_plus from 'images/ic_google_plus.png';
import TextInputCustom from "components/textInputCustom";
import itemSellingVehicleType from 'enum/itemSellingVehicleType';
import ic_edit_white from 'images/ic_edit_white.png'
import ic_next_red from 'images/ic_cancel_blue.png';
import ItemSlidingMenu from "./itemSlidingMenu";
import appType from "enum/appType";
import userType from "enum/userType";
import staffType from "enum/staffType";
import ic_camera_black from "images/ic_camera_black.png";
import listSlidingMenu from './listSlidingMenu'
import ic_logout_white from '../../../images/ic_logout_white.png'
import ic_lock_red from 'images/ic_lock_red.png'
import ic_dropdown from 'images/ic_dropdown.png'
import DatePicker from 'lib/react-native-date-ranges';
import ic_calender_red from 'images/ic_calender_red.png';
import ic_coin_green from 'images/ic_coin_green.png';
import ic_calendar_green from 'images/ic_calendar_green.png';
import ic_revenue_green from 'images/ic_revenue_green.png'
import { getStatusBarHeight } from 'react-native-status-bar-height';

const screen = Dimensions.get("window");
const HEIGHT_CHART = screen.height * 0.3;

class SlidingMenuView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            enableRefresh: true,
            refreshing: false,
            source: "",
            fullName: ""
        }
        this.userInfo = null;
        this.orders = [];
        this.listSlidingMenu = [];
        this.filterRevenue = {
            fromDay: this.getStartDayOfWeek(new Date(DateUtil.now().setHours(0, 0, 0, 0))),
            toDay: this.getEndDayOfWeek(new Date(DateUtil.now().setHours(23, 59, 59, 999))),
        }
        this.chartFakeData = [
            {
                seriesName: 'series1',
                data: [
                    { x: '2018-02-01', y: 300000 },
                    { x: '2018-02-02', y: 200000 },
                    { x: '2018-02-03', y: 170000 },
                    { x: '2018-02-04', y: 250000 },
                    { x: '2018-02-05', y: 100000 }
                ],
                color: '#297AB1'
            }
        ];
        this.dates = [];
        this.total = 0;
    }

    componentDidMount() {
        this.getSourceUrlPath();
        this.getProfile();
        this.listSlidingMenu = listSlidingMenu.USER;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    // handle get profile
    handleGetProfile(user) {
        this.userInfo = user;
        this.setState({
            fullName: user.name,
            source: user.avatarPath
        });
    }

    //onRefreshing
    handleRefresh = () => {
        this.state.refreshing = true;
        this.handleRequest();
    }

    // Handle request
    handleRequest() {
        let timeout = 1000;
        this.props.getUserProfile(this.userInfo.id);
        let timeOutRequestOne = setTimeout(() => {
            this.props.getRevenueChart(this.filterRevenue);
            clearTimeout(timeOutRequestOne)
        }, timeout);
    }

    /**
     * Get profile user
     */
    getProfile() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE).then(user => {
            //this callback is executed when your Promise is resolved
            if (!Utils.isNull(user)) {
                this.userInfo = user;
                this.state.fullName = this.userInfo.name;
                this.handleRequest();
            }
        }).catch(error => {
            //this callback is executed when your Promise is rejected
            this.saveException(error, "getProfile");
        });
    }

    /**
     * Handle data
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_USER_INFO)) {
                    console.log("USER LOG RA NE: ", data);
                    this.handleGetProfile(data);
                } else if (this.props.action == getActionSuccess(ActionEvent.GET_REVENUE_CHART)) {
                    console.log("GET_REVENUE_CHART ", data);
                    this.state.refreshing = false;
                    if (!Utils.isNull(data)) {
                        this.dates = [];
                        for (let i = this.filterRevenue.fromDay; DateUtil.compareDateWithFormat(i, this.filterRevenue.toDay, DateUtil.FORMAT_DATE_TIME_ZONE) != -1; i = moment(i, DateUtil.FORMAT_DATE_TIME_ZONE).add(1, 'day').format(DateUtil.FORMAT_DATE_TIME_ZONE)) {
                            this.dates.push({ 'x': DateUtil.convertFromFormatToFormat(i, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_SQL), 'y': 0 })
                        }
                        this.total = 0;
                        this.orders = [];
                        let i = 0;
                        if (data.length > 0) {
                            data.forEach(item => {
                                this.total = this.total + item.total;
                                if (this.orders.length === 0) {
                                    this.orders.push({ 'x': DateUtil.convertFromFormatToFormat(item.completedAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_SQL), 'y': item.total });
                                }
                                else if (this.orders[i].x != DateUtil.convertFromFormatToFormat(item.completedAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_SQL)) {
                                    i++;
                                    this.orders.push({ 'x': DateUtil.convertFromFormatToFormat(item.completedAt, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE_SQL), 'y': item.total });
                                }
                                else {
                                    this.orders[i].y = this.orders[i].y + item.total;
                                }
                            });

                        }
                        this.orders.sort(function (a, b) {
                            if (DateUtil.compareDate(a.x, b.x) < 0) {
                                return 1;
                            }
                            else if (DateUtil.compareDate(a.x, b.x) > 0) {
                                return -1;
                            }
                            else {
                                return 0;
                            }
                        });
                        let t = 0;
                        for (let z = 0; z < this.dates.length; z++) {
                            if (t == this.orders.length) {
                                break;
                            }
                            if (this.dates[z].x == this.orders[t].x) {
                                this.dates[z].y = this.orders[t].y;
                                t++;
                            }
                        }
                        if (this.dates.length === 0) {
                            this.showNoData = true;
                        }
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * show dialog logout
     */
    logoutDialog = () => (
        <DialogCustom
            visible={this.state.isAlert}
            isVisibleTitle={true}
            isVisibleContentText={true}
            isVisibleTwoButton={true}
            contentTitle={"Xác nhận"}
            textBtnOne={"Hủy"}
            textBtnTwo={"Đăng xuất"}
            contentText={localizes('slidingMenu.want_out')}
            onTouchOutside={() => { this.setState({ isAlert: false }) }}
            onPressX={() => { this.setState({ isAlert: false }) }}
            onPressBtnPositive={() => {
                StorageUtil.retrieveItem(StorageUtil.FCM_TOKEN).then((token) => {
                    if (token != undefined) {
                        // const deviceId = DeviceInfo.getDeviceId();
                        let filter = {
                            deviceId: "",
                            deviceToken: token
                        }
                        this.props.deleteUserDeviceInfo(filter) // delete device info
                    } else {
                        console.log('token null')
                    }
                }).catch((error) => {
                    //this callback is executed when your Promise is rejected
                    this.saveException(error, 'logoutDialog')
                });
                StorageUtil.deleteItem(StorageUtil.USER_PROFILE)
                    .then(user => {
                        console.log("user setting", user);
                        if (Utils.isNull(user)) {
                            this.showMessage(localizes('setting.logoutSuccess'))
                            this.setState({ isAlert: false })
                            this.logout()
                            this.goHomeScreen()
                            // this.props.navigation.navigate('', { logOuted: false });
                        } else {
                            this.showMessage(localizes('setting.logoutFail'))
                        }
                    })
                    .catch(error => {
                        this.saveException(error, 'logoutDialog')
                    });
                this.signOutFB(this.state.userFB);
                this.signOutGG(this.state.userGG);
            }}
        />
    )

    /**
     * Render View
     */
    render() {
        let height = (Platform.OS === 'ios') ? Constants.STATUS_BAR_HEIGHT : 0;
        return (
            <Container style={[styles.container, { backgroundColor: Colors.COLOR_WHITE }]}>
                <Root>
                    <Content
                        showsVerticalScrollIndicator={false}
                        ref={(e) => { this.fScroll = e }}
                        style={{ flex: 1 }}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={StatusBar.currentHeight}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }>
                        <View style={{
                            height: getStatusBarHeight(),
                            backgroundColor: Colors.COLOR_PRIMARY,
                            zIndex: 1000
                        }} />
                        {this.renderHeaderUser()}
                        {this.renderSlidingMenu()}
                        <View activeOpacity={Constants.ACTIVE_OPACITY} block>
                            <View style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: Colors.COLOR_WHITE,
                                marginHorizontal: Constants.PADDING_X_LARGE,
                                borderRadius: Constants.CORNER_RADIUS

                            }}>

                                {/* /* REVENUE */}
                                <TouchableOpacity style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }} onPress={() => {
                                    this.props.navigation.navigate("Revenue", {
                                        fromDay: this.filterRevenue.fromDay,
                                        toDay: this.filterRevenue.toDay,
                                        branch: this.branchSelected,
                                    })
                                }}>
                                    <Image source={ic_revenue_green} />
                                    <Text style={[
                                        commonStyles.text,
                                        {
                                            flex: 1,
                                            margin: 0, marginLeft: Constants.PADDING_X_LARGE,
                                            color: Colors.COLOR_RED_LIGHT
                                        }
                                    ]}
                                    >DOANH THU </Text>
                                </TouchableOpacity>

                                {/* /* DATE PICKER */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <DatePicker
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        ref={(ref) => this.picker = ref}
                                        customStyles={{
                                            placeholderText: {
                                                fontSize: Fonts.FONT_SIZE_MEDIUM,
                                                color: Colors.COLOR_PRIMARY,
                                            },
                                            contentText: {
                                                fontSize: Fonts.FONT_SIZE_MEDIUM,
                                                color: Colors.COLOR_PRIMARY,
                                            },
                                            headerStyle: {
                                                backgroundColor: Colors.COLOR_PRIMARY
                                            }
                                        }}
                                        ButtonStyle={{ backgroundColor: Colors.COLOR_PRIMARY }}
                                        onConfirm={this.chooseDate}
                                        centerAlign
                                        allowFontScaling={false} // optional
                                        placeholder={DateUtil.convertFromFormatToFormat(this.filterRevenue.fromDay, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) + "-" + DateUtil.convertFromFormatToFormat(this.filterRevenue.toDay, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE)}
                                        mode={'range'}
                                        markText="Chọn ngày"
                                        headFormat='DD/MM/YYYY'
                                        returnFormat={DateUtil.FORMAT_DATE_SQL}
                                        outFormat='DD/MM/YYYY'
                                        disabledOpenDateRange={true}
                                    />
                                    <Image style={{ width: 14, height: 14 }} source={ic_calendar_green} />
                                </View>
                            </View>

                            {/* /* CHART */}
                            <View style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: Colors.COLOR_BACKGROUND,
                                marginTop: Constants.MARGIN_LARGE
                            }}>

                            </View>
                        </View>

                        {/* /* TOTAL REVENUE */}
                        <View
                            activeOpacity={Constants.ACTIVE_OPACITY} block>
                            <View style={{
                                flex: 1,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: 'center',
                                backgroundColor: Colors.COLOR_WHITE,
                                marginBottom: Constants.PADDING_X_LARGE,
                                borderRadius: Constants.CORNER_RADIUS
                            }}>
                                <Text>Tổng doanh thu: </Text>
                                <Text style={commonStyles.textBold}>{this.total}</Text>
                                <Image source={ic_coin_green} style={{ width: 16, height: 16, flexWrap: 'wrap' }} />
                            </View>
                        </View>

                        {this.logoutDialog()}
                    </Content>
                    {this.state.refreshing ? null : this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }

    /**
     * render menu
     */
    renderSlidingMenu() {
        return (
            <View style={{ marginHorizontal: Constants.PADDING_X_LARGE }}>
                <FlatListCustom
                    style={{
                        backgroundColor: Colors.COLOR_WHITE
                    }}
                    horizontal={false}
                    data={this.listSlidingMenu}
                    itemPerCol={2}
                    renderItem={this.renderItemSlide.bind(this)}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }

    /**
     * renderItem flat list
     */
    renderItemSlide(item, index, parentIndex, indexInParent) {
        return (
            <View>
                <ItemSlidingMenu
                    data={this.listSlidingMenu}
                    item={item}
                    index={index}
                    navigation={this.props.navigation}
                    userInfo={this.userInfo}
                    callBack={() => this.handleRequest()}
                    resourceUrlPathResize={this.resourceUrlPathResize}
                    source={this.state.source}
                    onLogout={() => this.setState({ isAlert: true })
                    }
                    style={global.appAdminType}

                />
                {index !=
                    this.listSlidingMenu.length - 1
                    ?
                    <View></View> : null}
            </View>
        );
    }

    /**
     * Render header user
     */
    renderHeaderUser = () => {
        const { source, txtPhoneNumber, txtAccountName, userFB, userGG, membershipCard } = this.state
        let hasHttp = !Utils.isNull(source) && source.indexOf('http') != -1;
        let avatar = hasHttp ? source
            : this.resourceUrlPathResize.textValue + "=" + source;
        console.log('avatar ne: ', source)
        return (
            <View style={[commonStyles.viewHorizontal, {
                backgroundColor: Colors.COLOR_PRIMARY,
                padding: Constants.MARGIN_X_LARGE,
            }]}>
                {/* /* USER'S IMAGE */}
                <TouchableOpacity
                    style={{ alignItems: 'center', }}
                    onPress={() => {
                        this.props.navigation.navigate('UserProfile', {
                            userId: this.userInfo.id
                        })
                    }}>
                    <ImageLoader
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 48 / 2,
                            borderWidth: Constants.BORDER_WIDTH,
                            borderColor: Colors.COLOR_WHITE,
                            backgroundColor: Colors.COLOR_WHITE
                        }}
                        resizeAtt={hasHttp ? null : {
                            type: 'thumbnail',
                            width: 48, height: 48
                        }}
                        resizeModeType={"cover"}
                        path={avatar}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, marginHorizontal: Constants.MARGIN_LARGE }}>

                    {/* /* NAME AND SEE FULL PROFILE */}
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <Text
                            style={[commonStyles.textBold, { margin: 0, color: Colors.COLOR_WHITE, marginRight: Constants.MARGIN_X_LARGE }]}
                            numberOfLines={1}
                        >
                            {this.state.fullName}
                        </Text>
                    </View>
                    <TouchableOpacity style={{
                        flex: 1, flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    }}
                        onPress={() => {
                            this.props.navigation.navigate('UserProfile', {
                                userId: this.userInfo.id
                            })
                        }}>
                        <Text style={{ margin: 0, color: Colors.COLOR_WHITE, textDecorationLine: 'underline', opacity: 0.6, marginVertical: Constants.MARGIN }}>
                            Bấm để xem trang cá nhân</Text>
                    </TouchableOpacity>
                </View>

                {/* /* LOGOUT */}
                <TouchableOpacity
                    onPress={() => this.setState({ isAlert: true })}
                    style={{ alignItems: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <Image source={ic_logout_white} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <Text style={[commonStyles.textSmall, { margin: 0, color: Colors.COLOR_WHITE }]}>
                            Đăng xuất
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Date press
     */
    chooseDate = (day) => {
        this.filterRevenue.fromDay = DateUtil.convertFromFormatToFormat(new Date(new Date(day.startDate).setHours(0, 0, 0, 0)), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_TIME_ZONE);
        this.filterRevenue.toDay = DateUtil.convertFromFormatToFormat(new Date(new Date(day.endDate).setHours(23, 59, 59, 999)), DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE_TIME_ZONE);
        this.setState({
        });
        this.props.getRevenueChart(this.filterRevenue);
    }

    getStartDayOfWeek(date) {
        if (date.getDay() === 0) {
            return moment(date, DateUtil.FORMAT_DATE_TIME_ZONE).add(-6, 'day').format(DateUtil.FORMAT_DATE_TIME_ZONE);
        }
        return moment(date, DateUtil.FORMAT_DATE_TIME_ZONE).add(-date.getDay(), 'day').format(DateUtil.FORMAT_DATE_TIME_ZONE);
    }

    getEndDayOfWeek(date) {
        if (date.getDay() === 0) {
            return date;
        }
        return moment(date, DateUtil.FORMAT_DATE_TIME_ZONE).add(6 - date.getDay(), 'day').format(DateUtil.FORMAT_DATE_TIME_ZONE);
    }
}

const mapStateToProps = state => ({
    data: state.slidingMenu.data,
    action: state.slidingMenu.action,
    isLoading: state.slidingMenu.isLoading,
    error: state.slidingMenu.error,
    errorCode: state.slidingMenu.errorCode
});

const mapDispatchToProps = {
    ...actions,
    ...productActions,
    ...commonActions,
    ...orderActions
};

export default connect(mapStateToProps, mapDispatchToProps)(SlidingMenuView);
