'use strict';
import React, {Component} from 'react';
import {
    Dimensions, View, TextInput, Image, StyleSheet, Text, PixelRatio, ImageBackground, Platform,
    TouchableHighlight, TouchableOpacity, Keyboard, ToastAndroid, ScrollView, Modal, BackHandler,
    StatusBar
} from 'react-native';
import {Container, Form, Content, Input, Button, Right, Radio, center, ListItem, Left, Header, Item, Picker, Body, Root} from 'native-base';
import ButtonComp from 'components/button';
import {capitalizeFirstLetter} from 'utils/stringUtil';
import cover from 'images/bg_launch.png';
import styles from './styles';
import {localizes} from 'locales/i18n';
import BaseView from 'containers/base/baseView';
import commonStyles from 'styles/commonStyles';
import I18n from 'react-native-i18n';
import {Colors} from 'values/colors';
import {Fonts} from 'values/fonts';
import {CheckBox} from 'react-native-elements'
import {Constants} from 'values/constants'
import {Icon} from 'react-native-elements';
import ic_down_black from 'images/ic_down_black.png';
import Utils from 'utils/utils'
import ic_back_white from 'images/ic_back_white.png'
import ic_lock_white from 'images/ic_lock_white.png'
import ic_unlock_white from 'images/ic_unlock_white.png'
import ic_check_box_white from 'images/ic_check_box_white.png'
import ic_uncheck_box_white from 'images/ic_uncheck_box_white.png'
import ModalDropdown from 'components/modalDropdown'
import Autocomplete from 'components/autocomplete';
import {connect} from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import {ErrorCode} from 'config/errorCode';
import {getActionSuccess, ActionEvent} from 'actions/actionEvent';
import * as actions from 'actions/userActions';
import * as commonActions from 'actions/commonActions';
import GenderType from 'enum/genderType';
import StringUtil from 'utils/stringUtil';
import ImagePicker from 'react-native-image-crop-picker'
import roleType from 'enum/roleType'
import screenLincareType from 'enum/screenLincareType';
import userType from 'enum/userType';
import screenType from 'enum/screenType';
import TextInputCustom from 'components/textInputCustom';
import ic_logo_green from 'images/ic_log_splash.png';
import OTPType from 'enum/otpType';
 
import ButtonGradient from 'containers/common/buttonGradient';
import ic_phone_receiver_green from 'images/ic_cancel_blue.png';
import LinearGradient from "react-native-linear-gradient";
import ic_hide_grey from 'images/ic_hide_grey.png';
import ic_eye_grey from 'images/ic_eye_grey.png';
import otpType from 'enum/otpType';
import statusType from 'enum/statusType';
import DateUtil from 'utils/dateUtil';
const deviceHeight = Dimensions.get("window").height;
const MARGIN_BETWEEN_ITEM = 0;
const HEIGHT_OF_INPUT = 100;
class StoreView extends BaseView {

    constructor(props) {
        super(props);
        let {screen_type} = this.props.route.params;
        this.isCreateStoreView = screen_type == screenType.CREATE_STORE ? true : false;
        this.state = {
            name: '',
            phone: '',
            email: '',
            address: '',
            description: '',
            editData: false,
            heightt: "100%",
        }
    };

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentDidMount () {
        this.setState({
            heightt: "99%"
        })
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        if (!this.isCreateStoreView)
            this.props.getShop({});
    }

    /** 
     * on change name 
     */
    onChangename = (_name) => {
        this.name = _name;
        this.setState({
            name: _name
        })
    }

    /** 
     * on change phone
     */
    onChangePhone = (_phone) => {
        this.phone = _phone;
        this.setState({
            phone: _phone
        })
    }

    /** 
     * on change email
     */
    onChangeEmail = (_email) => {
        this.email = _email;
        this.setState({
            email: _email
        })
    }

    /** 
     * on change address
     */
    onChangeAddress = (_address) => {
        this.address = _address;
        this.setState({
            address: _address
        })
    }

    /** 
     * on change description 
     */
    onChangeDescription = (_description) => {
        this.description = _description;
        this.setState({
            description: _description
        })
    }

    /**
    * on press to update store
    */
    onPressUpdateStore = () => {
        const {name, email, phone, address, description, editData} = this.state;
        if (name == '' &&
            phone == '' &&
            email == '' &&
            address == '' &&
            description == '') {
            this.props.deleteShop();
            return;
        }
        const res = phone.trim().charAt(0);
        if (Utils.isNull(name)) {
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (StringUtil.validSpecialCharacter(name.trim())) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (StringUtil.validSpecialCharacter2(name.trim())) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (StringUtil.validEmojiIcon(name.trim())) {
            this.showMessage(localizes('register.vali_fullname'));
        } else if (name.length > 60) {
            this.showMessage(localizes('register.vali_fullname_length'));
        } else if (Utils.isNull(phone)) {
            this.showMessage(localizes('register.vali_fill_phone'));
        } else if (!Utils.validateHotline(phone.trim()) && !Utils.validatePhone(phone.trim())) {
            this.showMessage(localizes('createStoreView.vali_phone'));
        } else if (!Utils.isNull(address) && address.length > 250) {
            this.showMessage(localizes('createStoreView.vali_address_length'));
        } else if (!Utils.isNull(description) && description.length > 1000) {
            this.showMessage(localizes('createStoreView.vali_description_length'));
        } else {
            if (!editData) {
                this.createStore();
            } else {
                this.updateStore();
            }
        }
    }

    /**
    * handle click button cancel to back screen
    */
    onPressCancel = () => {
        this.props.navigation.goBack();
    }

    /**
     * create store
     */
    createStore () {
        const {name, email, phone, address, description} = this.state;
        if (Utils.isNull(name.trim())) {
            this.showMessage(localizes('register.vali_fill_fullname'));
            this.name.focus();
        } else if (!Utils.isNull(email) && !Utils.validateEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.name.focus();
        } else if (!Utils.isNull(email) && (email.length > 150)) {
            this.showMessage(localizes('createStoreView.vali_email_length'));
            this.email.focus();
        } else if (!Utils.isNull(email) && StringUtil.validSpecialCharacterForEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();

        } else if (!Utils.isNull(email) && !Utils.validateEmail(email.trim())) {
            this.showMessage(localizes('register.vali_email'));
            this.email.focus();
        } else {
            let data = {
                name: StringUtil.validMultipleSpace(name.trim()),
                phone: phone.trim(),
                address: address.trim(),
                description: description.trim(),
                email: email.trim().toLowerCase(),
            };
            this.props.createShop(data);
        }
    }

    /**
     * update store
     */
    updateStore () {
        const {name, email, phone, address, description} = this.state;
        if (Utils.isNull(name.trim())) {
            this.name.focus();
            this.showMessage(localizes('register.vali_fill_fullname'));
        } else if (!Utils.isNull(email) && !Utils.validateEmail(email.trim())) {
            this.email.focus();
            this.showMessage(localizes('register.vali_email'));
        } else if (StringUtil.validSpecialCharacterForEmail(email.trim())) {
            this.email.focus();
            this.showMessage(localizes('register.vali_email'));
        } else if (!Utils.isNull(email) && (email.length > 150)) {
            this.email.focus();
            this.showMessage(localizes('createStoreView.vali_email_length'));
        } else {
            let data = {
                name: StringUtil.validMultipleSpace(name.trim()),
                phone: phone.trim(),
                address: address.trim(),
                description: description.trim(),
                email: email.trim().toLowerCase(),
            };
            this.props.updateShop(data);
        }
    }

    /**
     * focus input
     * @param {*} text 
     */
    focusInput (text) {
        if (this.isFirstTime)
            return true
        return text !== ''
    }

    /**
     * Handle data when request
     */
    handleData () {
        let data = this.props.data
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (this.props.action == getActionSuccess(ActionEvent.GET_SHOP)) {
                    if (!Utils.isNull(data)) {
                        let name = data.name;
                        let phone = data.phone;
                        let email = data.email;
                        let address = data.address;
                        let description = data.description;
                        this.setState({
                            name: name,
                            phone: phone,
                            email: email,
                            address: address,
                            description: description
                        })
                        this.state.editData = true;
                    } else {
                        this.state.editData = false;
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.CREATE_SHOP)) {
                    if (!Utils.isNull(data)) {
                        this.showMessage(localizes("createStoreView.creata_store_success"))
                        this.props.navigation.goBack();
                        this.props.route.params.callbackRefresh();
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.UPDATE_SHOP)) {
                    if (!Utils.isNull(data)) {
                        this.showMessage(localizes('updateStoreView.update_store_success'))
                        this.props.navigation.goBack();
                        this.props.route.params.callbackRefresh();
                    }
                } else if (this.props.action == getActionSuccess(ActionEvent.DELETE_SHOP)) {
                    this.showMessage(localizes('updateStoreView.delete_store_success'))
                    this.props.navigation.goBack();
                    this.props.route.params.callbackRefresh();
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error)
            }
        }
    }

    render () {
        let {screenType} = this.state;
        return (
            <Container style={[styles.container, {}]}>
                <Root >
                    <HeaderGradient
                        iconDark
                        onBack={this.onBack}

                        visibleBack={true}
                        titleStyle={{color: Colors.COLOR_BLACK}}
                        // visibleLogo={true}
                        // visibleCart={!Utils.isNull(user) ? true : false}
                        showCart={this.showCart}
                        title={this.isCreateStoreView ? localizes('storeView.create_store_title') : localizes('storeView.update_store_title')}
                        renderMidMenu={this.renderMidMenu}
                    />
                    <Content contentContainerStyle={styles.ContentContainer}>
                        <View style={{flex: 1}}>
                            <View>
                                <Text style={[commonStyles.titleBold, styles.textInformation, {
                                    fontSize: Fonts.FONT_SIZE_X_MEDIUM
                                }]}>{localizes('createStoreView.information')}</Text>
                            </View>
                            {/* {Input form} */}
                            <Form style={styles.form}>
                                <View>
                                    <TextInputCustom
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="gray"
                                        placeholder={localizes(
                                            'createStoreView.store_name'
                                        )}
                                        styleInputGroup={styles.inputGroup}
                                        refInput={r => (this.name = r)}
                                        isInputNormal={true}
                                        value={this.state.name}
                                        onChangeText={this.onChangename}
                                        inputNormalStyle={[styles.inputNormal, {height: this.state.heightt}]}
                                        onSubmitEditing={() => {
                                            this.phone.focus();
                                        }}
                                        returnKeyType={"next"}
                                        keyboardType="words"
                                    />
                                </View>
                                <View>
                                    <TextInputCustom
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="gray"
                                        placeholder={localizes(
                                            'createStoreView.phone'
                                        )}
                                        styleInputGroup={styles.inputGroup}
                                        refInput={r => (this.phone = r)}
                                        isInputNormal={true}
                                        value={this.state.phone}
                                        onChangeText={this.onChangePhone}
                                        inputNormalStyle={[styles.inputNormal, {height: this.state.heightt}]}
                                        onSubmitEditing={() => {
                                            this.email.focus();
                                        }}
                                        returnKeyType={"next"}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <View>
                                    <TextInputCustom
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="gray"
                                        placeholder={localizes(
                                            'createStoreView.email'
                                        )}
                                        styleInputGroup={styles.inputGroup}
                                        refInput={r => (this.email = r)}
                                        isInputNormal={true}
                                        value={this.state.email}
                                        onChangeText={this.onChangeEmail}
                                        inputNormalStyle={[styles.inputNormal, {height: this.state.heightt}]}
                                        onSubmitEditing={() => {
                                            this.address.focus();
                                        }}
                                        returnKeyType={"next"}
                                        keyboardType="email-address"
                                    />
                                </View>
                                <View>
                                    <TextInputCustom
                                        textAlignVertical={'top'}
                                        multiline={true}
                                        numberOfLines={4}
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="gray"
                                        placeholder={localizes(
                                            'createStoreView.address'
                                        )}
                                        styleInputGroup={styles.inputGroup}
                                        refInput={r => (this.address = r)}
                                        isInputNormal={true}
                                        value={this.state.address}
                                        onChangeText={this.onChangeAddress}
                                        inputNormalStyle={{
                                            flex: 1,
                                            height: HEIGHT_OF_INPUT,
                                            marginHorizontal: Constants.MARGIN_LARGE,
                                            paddingHorizontal: Constants.PADDING_LARGE,
                                        }}
                                        onSubmitEditing={() => {
                                            this.description.focus();
                                        }}
                                        returnKeyType={"next"}
                                        keyboardType="words"
                                    />
                                </View>
                                <View>
                                    <TextInputCustom
                                        textAlignVertical={'top'}
                                        multiline={true}
                                        numberOfLines={4}
                                        backgroundColor={Colors.COLOR_TRANSPARENT}
                                        placeholderTextColor="gray"
                                        placeholder={localizes(
                                            'createStoreView.description'
                                        )}
                                        styleInputGroup={styles.inputGroup}
                                        refInput={r => (this.description = r)}
                                        isMultiLines={true}
                                        value={this.state.description}
                                        onChangeText={this.onChangeDescription}
                                        inputNormalStyle={{
                                            flex: 1,
                                            height: HEIGHT_OF_INPUT,
                                            marginHorizontal: Constants.MARGIN_LARGE,
                                            paddingHorizontal: Constants.PADDING_LARGE,
                                        }}
                                        onSubmitEditing={() => {
                                        }}
                                        returnKeyType={"next"}
                                        keyboardType="words"
                                    />
                                </View>

                            </Form>

                        </View>
                        {/* CREATE store view => Complete button */}
                        {
                            this.isCreateStoreView &&
                            <View style={styles.containerButtonComplete}>
                                {/* {Button login} */}
                                {this.renderCommonButton(
                                    localizes('storeView.complete_button'),
                                    {color: Colors.COLOR_WHITE},
                                    {},
                                    () => {
                                        this.onPressUpdateStore(),
                                            this.setState({editData: false})
                                    },
                                    this.activeDoneButton() ? [Colors.COLOR_GRAY, Colors.COLOR_GRAY] : [Colors.COLOR_PRIMARY, Colors.COLOR_PRIMARY],
                                    this.activeDoneButton()
                                )}
                            </View>
                        }
                        {/* UPDATE store view => Complete button */}
                        {
                            !this.isCreateStoreView &&
                            <View style={styles.containerButtonComplete}>
                                {/* {button update} */}
                                {this.renderCommonButton(
                                    localizes('storeView.update_button'),
                                    {color: Colors.COLOR_WHITE},
                                    {marginBottom: 0},
                                    () => {
                                        this.onPressUpdateStore(),
                                            this.setState({editData: true})
                                    }
                                )}

                                {this.renderCommonButton(
                                    localizes('storeView.cancel_button'),
                                    {color: Colors.COLOR_GREEN_LIGHT},
                                    {borderWidth: 0.2, borderColor: Colors.COLOR_COMMENT_BACKGROUND, paddingBottom: 1, },
                                    () => this.onPressCancel(),
                                    [Colors.COLOR_WHITE, Colors.COLOR_WHITE]
                                )}
                            </View>
                        }
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container >
        )
    }

    /** 
     * active done button
     */
    activeDoneButton = () => {
        if (!Utils.isNull(this.state.name) && !Utils.isNull(this.state.phone)) {
            return false;
        } else {
            return true;
        }
    }
}

const mapStateToProps = state => ({
    data: state.shop.data,
    isLoading: state.shop.isLoading,
    error: state.shop.error,
    errorCode: state.shop.errorCode,
    action: state.shop.action
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreView);
