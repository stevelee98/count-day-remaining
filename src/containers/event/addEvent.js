import React, { Component } from 'react'
import {
    View, Text, BackHandler, RefreshControl, Image,
    StatusBar, Pressable, PermissionsAndroid
} from 'react-native';
import {
    Container, Content, Root, Spinner
} from "native-base";
import { connect } from 'react-redux'
import * as actions from "actions/userActions";
import * as commonActions from "actions/commonActions";
import { ActionEvent, getActionSuccess } from "actions/actionEvent";
import { ErrorCode } from "config/errorCode";

import BaseView from 'containers/base/baseView';
import StringUtil from "utils/stringUtil";
import { localizes } from "locales/i18n";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import Utils from "utils/utils";
import StorageUtil from "utils/storageUtil";
import Header from 'components/header';
import TextInputCustom from 'components/textInputCustom';
import ic_calendar_black from 'images/ic_calendar_black.png';
import { CalendarScreen } from 'components/calendarScreen';
import DateUtil from 'utils/dateUtil';
import storage from '@react-native-firebase/storage';
import DeviceInfo from 'react-native-device-info';
import ImagePicker from "react-native-image-picker";
import ImageResizer from "react-native-image-resizer";
import DialogCustom from "components/dialogCustom";
import ic_instagram_black from 'images/ic_instagram_black.png';

import styles from './styles';
import ModalPopup from 'components/modalPopup';

const CANCEL_INDEX = 2;
const FILE_SELECTOR = [localizes("camera"), localizes("image"), localizes("cancel")];
const optionsCamera = {
    title: "Select avatar",
    storageOptions: {
        skipBackup: true,
        path: "images"
    }
};

export class AddEvent extends BaseView {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            title: null,
            note: null,
            dayEvent: null,
            resource: null,
            visibleDialog: false,
            loading: false,
            success: false
        }
        this.url = null;
        let { callBack } = this.props.route.params;
        this.callBack = callBack;
    }

    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur ', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.getProfile();
    }

    getProfile = async () => {
        let user = await StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
        if (user != null) {
            this.user = user;
            this.setState({
                user: user
            })
        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData()
        }
    }

    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    chooseDate = (day) => {
        this.setState({
            dayEvent: DateUtil.convertFromFormatToFormat(
                day,
                DateUtil.FORMAT_DATE_TIME_ZONE_T,
                DateUtil.FORMAT_DATE_SQL
            ),
        });
    }

    validate = () => {
        let { title, note, dayEvent } = this.state;
        if (StringUtil.isNullOrEmpty(title)) {
            this.showMessage("Tiêu đề không được bỏ trống")
        } else if (StringUtil.isNullOrEmpty(title.trim())) {
            this.showMessage("Tiêu đề không được bỏ trống")
        } else if (dayEvent == null || (dayEvent != null && dayEvent.trim() === "")) {
            this.showMessage("Ngày sự kiện không được bỏ trống")
        } else if (this.state.resource != null) {
            this.setState({ loading: true })
            this.uploadImage(this.state.resource);
        } else {
            this.setState({ loading: true })
            this.onSaveEvent()
        }
    }

    onSaveEvent = async (imagePath) => {
        let event = await StorageUtil.retrieveItem(StorageUtil.LIST_COUNT_DOWN);
        let newEvent = {
            title: this.state.title,
            note: this.state.note,
            dayEvent: this.state.dayEvent,
            resource: imagePath
        }
        if (event == null) {
            let arr = [{ ...newEvent }];
            event = arr;
        } else {
            event.push({ ...newEvent });
        }
        let result = await StorageUtil.storeItem(StorageUtil.LIST_COUNT_DOWN, event);
        if (this.state.user == null) {
            this.setState({
                loading: false,
                success: true
            })
            this.refs.modalSuccess.showModal()
        } else {
            this.refs.modalSuccess.showModal()
        }
    }

    uploadImage = (uri) => {
        let uriArray = uri.split("/");
        let url = uriArray[uriArray.length - 1];
        let id = DeviceInfo.getDeviceToken();
        let fr = storage().ref(`${id}/${url}`);
        fr.putFile(uri, { contentType: 'image/jpeg' }).on(
            'state_changed',
            snapshot => {
                if (snapshot.state == "success") {
                    fr.getDownloadURL().then((url) => {
                        console.log("upload image to firebase zzzzz", url)
                        if (this.url !== url) {
                            this.url = url;
                            this.onSaveEvent(url);
                        }
                    });
                }
            },
            error => {
                console.log("errrorr upload", error);
            }
        );
    };

    renderFileSelectionDialog() {
        return (
            <DialogCustom
                visible={this.state.visibleDialog}
                isVisibleTitle={true}
                isVisibleContentForChooseImg={true}
                contentTitle={'Chọn hình ảnh'}
                onTouchOutside={() => {
                    this.setState({ visibleDialog: false });
                }}
                onPressX={() => {
                    this.setState({ visibleDialog: false });
                }}
                onPressCamera={() => {
                    this.onSelectedType(0);
                }}
                onPressGallery={() => {
                    this.onSelectedType(1);
                }}
            />
        );
    }

    onSelectedType(index) {
        if (index !== CANCEL_INDEX) {
            if (index === 0) {
                this.takePhoto();
            } else if (index === 1) {
                this.showDocumentPicker();
            }
        } else {
            this.hideDialog();
        }
    }

    /**
      * Show document picker
      */
    showDocumentPicker = async fileType => {
        const hasCameraPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (!hasCameraPermission) return;
        ImagePicker.launchImageLibrary(optionsCamera, response => {
            const { error, uri, originalRotation, didCancel } = response;
            this.hideDialog();
            if (uri && !error) {
                let rotation = 0;
                ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 80, rotation).
                    then(({ uri }) => {
                        this.setState({
                            resource: uri
                        })
                    }).catch(err => {
                        console.log(err)
                    })
            } else if (error) {
                console.log("The photo picker errored. Check ImagePicker.launchCamera func", error)
            }
        });
    };

    rotateImage = (orientation) => {
        let degRotation;
        switch (orientation) {
            case 90:
                degRotation = 90;
                break;
            case 270:
                degRotation = -90;
                break;
            case 180:
                degRotation = 180;
                break;
            default:
                degRotation = 0;
        }
        return degRotation;
    }

    attachFile = () => {
        this.showDialog();
    };

    showDialog() {
        this.setState({
            visibleDialog: true
        });
    }

    hideDialog() {
        this.setState({
            visibleDialog: false
        });
    }

    takePhoto = async () => {
        const hasCameraPermission = await this.hasPermission(PermissionsAndroid.PERMISSIONS.CAMERA);
        if (!hasCameraPermission) return;
        ImagePicker.launchCamera(optionsCamera, response => {
            const { error, uri, originalRotation, didCancel } = response;
            this.hideDialog();
            if (uri && !error) {
                let rotation = this.rotateImage(originalRotation);
                try {
                    ImageResizer.createResizedImage(uri, 800, 600, "JPEG", 80, rotation).
                        then(({ uri }) => {
                            this.setState({
                                resource: uri
                            })
                        }).catch(err => {
                            console.log(err)
                        })
                } catch (error) {
                    console.log("ERRO when rotaion", error);
                }
            } else if (error) {
                console.log("The photo picker errored. Check ImagePicker.launchCamera func", error)
            }
        });
    };

    onSuccess = () => {
        if (this.callBack) {
            this.callBack()
        }
        this.onBack()
    }

    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <Header
                        barStyle={'dark-content'}
                        title={"Thêm sự kiện"}
                        onBack={() => { this.onBack() }}
                        headerColor={'orange'} />
                    <Content
                        scrollEventThrottle={1}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerContent}>
                        <View style={{
                            ...commonStyles.cardView,
                            paddingVertical: Constants.PADDING_X_LARGE,
                            paddingHorizontal: 0,
                            marginTop: Constants.MARGIN_X_LARGE
                        }}>
                            <TextInputCustom
                                placeholder={'Tiêu đề'}
                                refInput={r => (this.title = r)}
                                isInputNormal={true}
                                value={this.state.title}
                                onChangeText={(title) => { this.setState({ title }) }}
                                onSubmitEditing={() => {
                                    this.note.focus();
                                }}
                                returnKeyType={'next'}
                                onPressPlaceHolder={() => { this.title.focus() }}
                            />
                            <TextInputCustom
                                placeholder={'Ghi chú'}
                                styles={{ marginTop: Constants.MARGIN_X_LARGE }}
                                refInput={r => (this.note = r)}
                                isMultiLines={true}
                                value={this.state.note}
                                onChangeText={(note) => { this.setState({ note }) }}
                                returnKeyType={'next'}
                                inputNormalStyle={{ color: Colors.COLOR_TEXT }}
                                onPressPlaceHolder={() => { this.note.focus() }}    
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginHorizontal: Constants.MARGIN_X_LARGE }}>
                                <Text style={{ ...commonStyles.text400, marginLeft: 2 }}>Chọn ngày sự kiện</Text>
                                <TextInputCustom
                                    refInput={input => {
                                        this.dayEvent = input;
                                    }}
                                    styles={{ width: 130, marginTop: Constants.MARGIN_LARGE }}
                                    isInputMask={true}
                                    placeholder={"--/--/----"}
                                    onChangeText={dayEvent => this.setState({ dayEvent })}
                                    value={DateUtil.convertFromFormatToFormat(this.state.dayEvent, DateUtil.FORMAT_DATE_SQL, DateUtil.FORMAT_DATE)}
                                    keyboardType="phone-pad"
                                    onFocus={() => this.showCalendar.showDateTimePicker()}
                                    editable={true}
                                    typeFormat={'datetime'}
                                    options={{ format: 'DD/MM/YYYY' }}
                                    iconRight={ic_calendar_black}
                                    onPressRight={() => this.showCalendar.showDateTimePicker()}
                                />
                            </View>
                            <View style={{
                                borderWidth: 0.5,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: Constants.MARGIN_XX_LARGE,
                                marginHorizontal: Constants.MARGIN_X_LARGE
                            }}>
                                {this.state.resource == null && <Pressable
                                    android_ripple={{
                                        color: Colors.COLOR_WHITE,
                                        borderless: false,
                                    }}
                                    onPress={() => {
                                        this.setState({
                                            visibleDialog: true
                                        })
                                    }}
                                    style={{
                                        alignItems: 'center', padding: Constants.PADDING_X_LARGE,
                                        paddingVertical: Constants.PADDING_XX_LARGE,
                                    }}
                                >
                                    <Image source={ic_instagram_black} />
                                    <Text style={{ ...commonStyles.text400, marginTop: Constants.MARGIN }}>Thêm ảnh nền cho sự kiện</Text>
                                </Pressable>}
                                {this.state.resource && <Image source={{ uri: this.state.resource }}
                                    style={{
                                        width: Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE * 2,
                                        borderRadius: 16,
                                        height: (Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE) * (9 / 25),
                                        resizeMode: 'cover'
                                    }} />}
                            </View>
                            {this.state.resource && <Pressable
                                android_ripple={{
                                    color: Colors.COLOR_WHITE,
                                    borderless: false,
                                }}
                                onPress={() => {
                                    this.setState({
                                        visibleDialog: true
                                    })
                                }}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: Constants.PADDING,
                                    marginTop: Constants.MARGIN_X_LARGE
                                }}
                            >
                                <Text style={{ ...commonStyles.text400, marginTop: Constants.MARGIN, marginRight: Constants.MARGIN_LARGE }}>Chọn ảnh khác</Text>
                                <Image source={ic_instagram_black} />
                            </Pressable>}
                        </View>
                        <Pressable
                            android_ripple={{
                                color: Colors.COLOR_WHITE,
                                borderless: false,
                            }}
                            onPress={this.validate}
                            style={{
                                marginVertical: Constants.MARGIN_X_LARGE,
                                backgroundColor: 'orange',
                                borderRadius: 36,
                                padding: Constants.PADDING_LARGE + 4,
                                alignItems: 'center',
                                marginHorizontal: Constants.MARGIN_X_LARGE
                            }}
                        >
                            <Text style={{
                                ...Fonts.FONT_600,
                                color: Colors.COLOR_WHITE,
                                fontSize: Fonts.FONT_SIZE_XX_MEDIUM
                            }}>Thêm sự kiện</Text>
                        </Pressable>
                    </Content>
                    {this.renderFileSelectionDialog()}
                    <CalendarScreen
                        minimumDate={new Date(new Date().setDate(DateUtil.now().getDate() + 1))}
                        dateCurrent={DateUtil.now()}
                        chooseDate={this.chooseDate}
                        ref={ref => (this.showCalendar = ref)}
                    />
                    {this.showLoadingBar(this.state.loading)}
                    <ModalPopup ref={'modalSuccess'} content={() => { return <Text style={commonStyles.text400}>Thêm sự kiện thành công</Text> }}
                        onPressYes={this.onSuccess} />
                </Root>
                <StatusBar translucent={false} />
            </Container>
        )
    }

    showLoadingBar(isShow) {
        return isShow ?
            <View style={styles.viewUploading}>
                <View style={styles.viewLoader}>
                    <Spinner color={Colors.COLOR_PRIMARY} />
                    <Text style={commonStyles.text}>Đang tải hình ảnh lên</Text>
                </View>
            </View> : null
    }
}
const mapStateToProps = state => ({
    isLoading: state.home.isLoading,
    error: state.home.error,
    errorCode: state.home.errorCode,
    action: state.home.action,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent)
