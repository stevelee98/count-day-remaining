import React, {Component} from "react";
import {
    ImageBackground, View, Image, TouchableOpacity, Animated,
    BackHandler, Alert, Linking, ScrollView, NativeEventEmitter,
    DeviceEventEmitter, Platform, RefreshControl, Dimensions,
    SafeAreaView, NativeModules, Text
} from "react-native";
import {
    Container, Form, Content, Input, Button, Right, Radio,
    center, ListItem, Left, Header, Item, Picker, Body, Root
} from 'native-base';
import * as actions from 'actions/userActions'
import * as commonActions from 'actions/commonActions'
import {connect} from 'react-redux';
import FlatListCustom from "components/flatListCustom";
import {Constants} from "values/constants";
import {localizes} from "locales/i18n";
import BaseView from "containers/base/baseView";
import HeaderView from "containers/common/headerView";
 
import commonStyles from "styles/commonStyles";
import {Colors} from "values/colors";
import Utils from 'utils/utils';
import ic_edit_black from "images/ic_edit_black.png";
import ic_pen_edit_green from "images/ic_pen_edit_green.png";
import {ErrorCode} from "config/errorCode";
import {ActionEvent, getActionSuccess} from "actions/actionEvent";
import {Fonts} from 'values/fonts'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";
import {configConstants} from "values/configConstants";
import GenderType from "enum/genderType";
import StorageUtil from "utils/storageUtil";
import ic_more_black from "images/ic_more_black.png";
import ic_add_green from "images/ic_cancel_blue.png";
import Hr from "components/hr";
import styles from "./styles";
import ic_clock_green from "images/ic_clock_green.png";
import screenType from "enum/screenType";
import DateUtil from "utils/dateUtil";

const window = Dimensions.get("window");

class UserDetailView extends BaseView {

    constructor(props) {
        super(props)
        const {navigation} = this.props;
        this.state = {
            phone: '',
            email: '',
            address: '',
            gender: null,
        };

        this.dataShop = null;
        this.menuOptions = [
            {
                name: localizes('userProfileView.editInfomation'),
                icon: ic_pen_edit_green,
                event: () => {this.props.navigation.navigate('EditProfile')}
            },
            {
                name: localizes('userProfileView.changePassword'),
                icon: ic_clock_green,
                event: () => {this.props.navigation.navigate('ChangePassword')}
            }
        ];
        this.isYour = this.props.isYour;
    }

    componentDidMount () {
        this.getSourceUrlPath();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps
            this.handleData()
        }
    }

    /**
     * Handle data when request
     */
    handleData () {
        const {userInfo, isYour} = this.props;
        this.isYour = isYour;
        if (!Utils.isNull(userInfo)) {
            this.handleGetProfile(userInfo);
        }
    }

    /**
     * Handle data user profile
     * @param {*} user 
     */
    handleGetProfile (user) {
        // if (!Utils.isNull(user.shop)) {
        this.dataShop = user.shop;
        // }
        this.setState({
            fullName: user.name.trim(),
            phone: user.phone,
            email: user.email,
            gender: user.gender,
            address: user.address,
            description: user.description,
            birthDate: user.birthDate
        });
    }

    render () {
        return (
            <View style={{
                backgroundColor: 'transparent',
                minHeight: window.height
            }}>
                {/* /* INFO */}
                <View style={styles.infoTitle}>
                    <View>
                        <Text style={[commonStyles.textBold, {marginHorizontal: 0}]}>{localizes('userProfileView.userInfomation')}</Text>
                    </View>
                    {this.isYour
                        && <TouchableOpacity
                            activeOpacity={Constants.ACTIVE_OPACITY}
                            onPress={() => {
                                this.menuOption.open()
                            }}>
                            <Image
                                style={{resizeMode: 'contain'}}
                                source={ic_more_black} />
                            {this.renderMenuOption()}
                        </TouchableOpacity>
                    }
                </View>

                {/* /* NAME */}
                <View style={[styles.itemSliding, {marginTop: 0}]}>
                    <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('userProfileView.lastAndFisrtName')}</Text>
                    <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.state.fullName}</Text>
                </View>
                <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />


                {/* /* PHONE */}
                {this.isYour
                    && <View>
                        <View style={styles.itemSliding}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('userProfileView.phoneNumber')}</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.state.phone}</Text>
                        </View>
                        <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />
                    </View>
                }

                {/* /* EMAIL */}
                {this.isYour
                    && <View>
                        <View style={styles.itemSliding}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>Email</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.state.email}</Text>
                        </View>
                        <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />
                    </View>
                }

                {/* /* DAY OF BIRTH */}
                <View style={styles.itemSliding}>
                    <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('userProfileView.dateOfBirth')}</Text>
                    <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>
                        {!Utils.isNull(this.state.birthDate) ?
                            DateUtil.convertFromFormatToFormat(this.state.birthDate, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DATE) : null}
                    </Text>
                </View>
                <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                {/* /* GENDER */}
                <View style={styles.itemSliding}>
                    <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('userProfileView.gender')}</Text>
                    <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>
                        {!Utils.isNull(this.state.gender) ? this.getGender(this.state.gender) : ' '}
                    </Text>
                </View>
                <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                {/* /* ADDRESS */}
                <View style={styles.itemSliding}>
                    <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('userProfileView.dateOfBirth')}</Text>
                    <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.state.address}</Text>
                </View>
                <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                {/* /* DESCRIPTION */}
                {/* <View style={styles.itemSliding}>
                    <Text style={[{ flex: 1, margin: 0, color: Colors.COLOR_GRAY, fontSize: Fonts.FONT_SIZE_X_MEDIUM }]}>Mô tả</Text>
                    <Text style={[commonStyles.text, { margin: 0, flex: 3, width: window.width * 0.75, textAlign: 'right' }]}>{this.state.description}</Text>
                </View> */}

                {/* /* SHOP INFO */}
                <View
                    style={styles.shopInfoTitle}>
                    <View>
                        <Text style={[commonStyles.textBold, {marginHorizontal: 0}]}>{localizes('storeView.storeInfomation')}</Text>
                    </View>
                    {this.isYour
                        && <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('Store', {
                                callbackRefresh: this.props.callbackRefresh,
                                screen_type: Utils.isNull(this.dataShop) ? screenType.CREATE_STORE : screenType.UPDATE_STORE
                            })
                        }}>
                            <Image
                                style={{resizeMode: 'contain'}}
                                source={Utils.isNull(this.dataShop) ? ic_add_green : ic_pen_edit_green} />
                        </TouchableOpacity>
                    }
                </View>

                {!Utils.isNull(this.dataShop)
                    ? <View>
                        {/* /* SHOP NAME */}
                        <View style={[styles.itemSliding, {marginTop: 0}]}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('storeView.nameStore')}</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.dataShop.name}</Text>
                        </View>
                        <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                        {/* /* SHOP PHONE */}
                        <View style={[styles.itemSliding]}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('storeView.phoneStore')}</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.dataShop.phone}</Text>
                        </View>
                        <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                        {/* /* SHOP EMAIL */}
                        <View style={[styles.itemSliding]}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>Email</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.dataShop.email}</Text>
                        </View>
                        <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                        {/* /* SHOP ADDRESS */}
                        <View style={[styles.itemSliding]}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('storeView.addressStore')}</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.dataShop.address}</Text>
                        </View>
                        <Hr style={{marginHorizontal: Constants.MARGIN_X_LARGE}} />

                        {/* /* SHOP DESCRIPTION */}
                        <View style={[styles.itemSliding]}>
                            <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK, flex: 1}]}>{localizes('storeView.descriptionStore')}</Text>
                            <Text style={[commonStyles.text, {margin: 0, flex: 2, textAlign: "right"}]}>{this.dataShop.description}</Text>
                        </View>
                    </View>
                    :
                    !this.isYour
                    && <View style={[styles.itemSliding, {marginTop: -Constants.MARGIN_X_LARGE}]}>
                        <Text style={[commonStyles.text, {margin: 0, color: Colors.COLOR_BLACK}]}>{localizes('storeView.nodata')}</Text>
                    </View>
                }
            </View>
        )
    }

    /**
     * Get gender user
     * @param {*} gender
     */
    getGender (gender) {
        let genderText = '';
        if (gender === GenderType.MALE)
            genderText = localizes("userProfileView.male");
        else if (gender === GenderType.FEMALE)
            genderText = localizes("userProfileView.female");
        return genderText;
    }


    /**
     * Render menu option
     */
    renderMenuOption = () => {
        return (
            <Menu
                style={{
                    top: Constants.MARGIN_LARGE,
                    right: 0,
                }}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {this.menuOptions.map((item, index) => {
                        return (
                            <MenuOption
                                index={index.toString()}
                                onSelect={() => {
                                    item.event()
                                }}
                            >
                                <View
                                    style={[
                                        commonStyles.viewHorizontal,
                                        {
                                            alignItems: "center",
                                            padding: Constants.MARGIN_LARGE,
                                        }
                                    ]}
                                >
                                    <View style={[styles.iconMenu, {marginRight: Constants.MARGIN_LARGE}]}>
                                        <Image source={item.icon} />
                                    </View>
                                    <Text style={[styles.textMenu], {marginRight: Constants.MARGIN}}>{item.name}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    };
}

export default UserDetailView;