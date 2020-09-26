import React, { Component } from 'react'
import {
    View, Text, BackHandler, RefreshControl, Image, TextInput,
    StatusBar, Pressable, PermissionsAndroid, Keyboard
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
import img_gradient from 'images/img_gradient.png';
import ic_back_white from 'images/ic_back_white.png';
import ic_three_dot from 'images/ic_three_dot.png';
import ic_check_green from 'images/ic_check_green.png';
import ic_edit_black from 'images/ic_edit_black.png';
import img_bg_event from 'images/img_bg_event.jpeg';
import ic_trash_red from 'images/ic_trash_red.png';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import FlatListCustom from "components/flatListCustom";
import ItemEventNote from './itemEventNote'
import styles from './styles';
import ModalPopup from 'components/modalPopup';
import EventNote from 'containers/entity/eventNote';
import { async } from 'rxjs';

const LIST_MENU = [
    {
        name: 'Chỉnh sửa',
        screen: 'AddEvent',
        value: 1
    },
    {
        name: 'Xóa',
        screen: null,
        value: 2
    }
]

export class EventDetail extends BaseView {
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
            success: false,
            dayAlert: null,
            note: null,
            note: [],
            titleLoading: null,
        }
        this.notes = []
        this.url = null;
        let { event, callBack } = this.props.route.params;
        // alert(event.id)
        this.callBack = callBack;
        this.event = event;
    }

    componentDidMount = () => {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur ', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.getProfile();
        this.getTimeAlert();
        this.getNoteOfEvent()
    }

    getEvent = async (newEvent) => {
        this.event = newEvent;
        this.getTimeAlert();
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

    getNoteOfEvent = async () => {
        let key = StorageUtil.NOTE_PER_DAY_BY_EVENT + this.event.id;
        let note = await StorageUtil.retrieveItem(key)
        if (note != null) {
            // alert(note.dayNote)
            // console.log("get note of event", note[0].dayNote);
            this.notes = [];
            this.notes = note;
            this.setState({
                note: note
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

    getTimeAlert = () => {
        let now = new Date();
        if (this.event) {
            let dayEvent = new Date(this.event.dayEvent);
            let diff = dayEvent.getTime() - now.getTime();
            if (diff >= 0) {
                let dayAlert = Math.floor(diff / 86400000);
                this.setState({ dayAlert })
            }
        }
    }

    renderFilterMenu = () => {
        return (
            <Menu
                style={styles.filterMenu}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {LIST_MENU.map((item, index) => {
                        return (
                            <MenuOption
                                onSelect={() => {
                                    if (item.screen != null) {
                                        this.props.navigation.navigate('AddEvent', { event: this.event, callBack: this.getEvent })
                                    } else {
                                        this.refs.modalConfirmDelete.showModal()
                                    }
                                }}
                            >
                                <View style={{ padding: Constants.PADDING_LARGE }}  >
                                    <Text style={{ ...commonStyles.text400, color: index == 1 ? 'red' : 'black' }}>{item.name}</Text>
                                </View>
                            </MenuOption>
                        )
                    })}
                </MenuOptions>
            </Menu>
        );
    }

    renderHeader = () => {
        return (
            <View>
                <Image
                    source={this.event.resource ? { uri: this.event.resource }: img_bg_event}
                    style={styles.resource} />
                <Image source={img_gradient} style={styles.imgGradient} />
                <View style={{ position: 'absolute', bottom: 32, left: 24 }}>
                    <Text style={{ ...commonStyles.text500, color: Colors.COLOR_WHITE }}>Còn
                        <Text style={{
                            ...commonStyles.text,
                            color: Colors.COLOR_WHITE,
                            fontSize: 36,
                            ...Fonts.FONT_600
                        }}> {this.state.dayAlert} <Text style={{ ...commonStyles.text500, color: Colors.COLOR_WHITE }}>Ngày</Text>
                        </Text></Text>
                    <Text style={{ ...commonStyles.text500, color: Colors.COLOR_WHITE }}>Đến ngày {DateUtil.convertFromFormatToFormat(this.event.dayEvent, DateUtil.FORMAT_DATE_SQL, DateUtil.FORMAT_DAY_TIME)}</Text>
                    <Text style={{
                        ...Fonts.FONT_600,
                        color: Colors.COLOR_WHITE,
                        fontSize: Fonts.FONT_SIZE_LARGE,
                        marginTop: Constants.MARGIN_LARGE
                    }}>{this.event.title}</Text>
                </View>
                <Pressable
                    android_ripple={{
                        color: Colors.COLOR_WHITE,
                        borderless: false,
                    }}
                    onPress={this.onBack}
                    style={{
                        position: 'absolute',
                        top: 42, left: 12,
                        padding: Constants.PADDING_LARGE
                    }}
                >
                    <Image source={ic_back_white} />
                </Pressable>
            </View>
        )
    }

    renderListNote = () => {
        return (
            <FlatListCustom
                onRef={(ref) => { this.flatListRef = ref }}
                contentContainerStyle={{ flex: 1, marginTop: Constants.MARGIN_X_LARGE }}
                data={this.notes}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={item => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    renderItem = (item, index) => {
        let dayNoteArr = item.dayNote.split(' ');
        let dayYear = dayNoteArr[0].split('-');
        let dayTime = dayNoteArr[1].split(':');
        let dayItem = new Date(dayYear[0], Number(dayYear[1]) - 1, dayYear[2], dayTime[0], dayTime[1]);
        let diff = new Date(this.event.dayEvent).getTime() - dayItem.getTime();
        let dayAlert = Math.floor(diff / 86400000);
        return (
            <ItemEventNote
                key={index.toString()}
                item={item}
                index={index}
                dayAlert={dayAlert}
                onDelete={() => { this.onDelete() }}
            />
        )
    }

    onSaveNote = async () => {
        let key = StorageUtil.NOTE_PER_DAY_BY_EVENT + this.event.id;
        let now = new Date();
        let dayNote = now.getFullYear() + '-' + (Number(now.getMonth()) + 1).toString()
            + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        // alert(dayNote.toString())
        let note = {
            id: `note${(now.getTime()).toString()}`,
            eventId: this.event.id,
            dayNote: dayNote.toString(),
            note: this.state.noteValue
        }
        // alert(note.dayNote)
        this.notes.unshift({ ...note })
        let savedNote = await StorageUtil.storeItem(key, this.notes);
        this.setState({ noteValue: null })
        this.showMessage("Thêm thành công")
        Keyboard.dismiss()
        setTimeout(() => { this.getNoteOfEvent() })
    }

    onDelete = async (index) => {
        this.notes.splice(index, 1);
        let key = StorageUtil.NOTE_PER_DAY_BY_EVENT + this.event.id;
        await StorageUtil.storeItem(key, this.notes);
        this.showMessage("Xóa thành công")
        setTimeout(() => { this.getNoteOfEvent() })
    }

    onDeleteEvent = async () => {
        let events = await StorageUtil.retrieveItem(StorageUtil.LIST_EVENT)
        console.log("on delete event", events)
        if (events != null) {
            let indexDelete = 0;
            events.forEach((item, index) => {
                if (item.id == this.event.id) {
                    console.log("on delete event", index)
                    indexDelete = index;
                }
            });
            events.splice(indexDelete, 1);
            console.log("event list after delete", events);
            await StorageUtil.storeItem(StorageUtil.LIST_EVENT, null);
            await StorageUtil.storeItem(StorageUtil.LIST_EVENT, events);
            if (this.callBack) {
                this.callBack()
            }
            this.onBack();
        }
    }

    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <Content
                        scrollEventThrottle={1}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerContent}>
                        {this.renderHeader()}
                        <View style={{
                            borderTopLeftRadius: 16,
                            borderTopRightRadius: 12,
                            flex: 1,
                            backgroundColor: Colors.COLOR_WHITE,
                            marginTop: -12,
                            paddingVertical: Constants.PADDING_LARGE
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItem: 'flex-start', paddingHorizontal: Constants.PADDING_X_LARGE, }}>
                                <Text style={{ ...Fonts.FONT_500, fontSize: Fonts.FONT_SIZE_X_LARGE, flex: 1 }}>{this.event.title} </Text>
                                <Pressable onPress={() => { this.menuOption.open() }} style={{ padding: Constants.PADDING_LARGE }}>
                                    <Image source={ic_three_dot} />
                                </Pressable>
                                {this.renderFilterMenu()}
                            </View>
                            <Text style={{ ...Fonts.FONT_400, fontSize: Fonts.FONT_SIZE_MEDIUM, marginTop: Constants.MARGIN_X_LARGE, paddingHorizontal: Constants.PADDING_X_LARGE, }}>{this.event.note}</Text>
                            <View style={{ marginTop: Constants.MARGIN_X_LARGE, paddingHorizontal: Constants.PADDING_X_LARGE, }}>
                                {/* <Text style={{ ...Fonts.FONT_500, fontSize:Fonts.FONT_SIZE_X_MEDIUM }}>Hôm nay {new Date().getDate()} / {new Date().getMonth()}, còn {this.state.dayAlert} ngày nữa</Text> */}
                                <Text style={{ ...Fonts.FONT_500, fontSize: Fonts.FONT_SIZE_X_MEDIUM }}>Hôm nay bạn nghĩ gì ?</Text>
                                <TextInput
                                    ref={note => this.note = note}
                                    style={[commonStyles.text500, {
                                        flex: 1,
                                        margin: 0,
                                        borderBottomWidth: 0.8,
                                        borderBottomColor: Colors.COLOR_GREY_LIGHT
                                    }]}
                                    value={this.state.noteValue}
                                    placeholder={`Còn ${this.state.dayAlert} ngày nữa, bạn đã làm được những gì ?`}
                                    onChangeText={(noteValue) => { this.setState({ noteValue }) }}
                                    blurOnSubmit={false}
                                    multiline={true}
                                />
                                {(this.state.noteValue != null && this.state.noteValue != '') && <Pressable
                                    onPress={this.onSaveNote}
                                    android_ripple={{
                                        color: Colors.COLOR_WHITE,
                                        borderless: false,
                                    }}
                                    style={{
                                        ...commonStyles.shadowOffset,
                                        elevation: 4,
                                        backgroundColor: 'white',
                                        alignSelf: 'flex-end',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 80,
                                        borderRadius: Constants.CORNER_RADIUS * 2,
                                        padding: Constants.PADDING_LARGE,
                                        paddingHorizontal: Constants.PADDING_LARGE,
                                        marginTop: Constants.MARGIN_X_LARGE
                                    }}
                                >
                                    <Text style={{ ...Fonts.FONT_500, color: '#2ed052' }}>Thêm</Text>
                                </Pressable>}
                            </View>
                            {this.renderListNote()}
                        </View>
                    </Content>
                    <ModalPopup
                        ref={'modalConfirmDelete'}
                        onPressYes={() => this.onDeleteEvent()}
                        content={() => {
                            return (<Text style={commonStyles.text400}>Bạn có chắc chắn muốn xóa sự kiện này ?</Text>)
                        }} />
                    {this.showLoadingBar(this.state.loading)}
                </Root>
                <StatusBar translucent backgroundColor='transparent' />
            </Container>
        )
    }

    showLoadingBar(isShow) {
        return isShow ?
            <View style={styles.viewUploading}>
                <View style={styles.viewLoader}>
                    <Spinner color={Colors.COLOR_PRIMARY} />
                    <Text style={commonStyles.text}>{this.state.titleLoading}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(EventDetail)
