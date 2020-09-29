import React, { Component } from 'react'
import {
    View, Text, BackHandler, RefreshControl, Image, TextInput,
    StatusBar, Pressable, PermissionsAndroid, Keyboard, ImageBackground
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
import DateUtil from 'utils/dateUtil';
import storage from '@react-native-firebase/storage';
import FlatListCustom from "components/flatListCustom";
import styles from './styles';
import ItemSlidingMenu from '../profile/itemSlidingMenu';
import ListMenu from '../profile/listMenu';
import ItemEventHistory from './itemEventHistory';

export class EventHistoryView extends BaseView {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            refreshing: false,
            enableRefresh: true,
            events: []
        }
        this.data = []
        this.user = null
        this.menus = ListMenu;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.props.navigation.addListener('blur ', () => {
            BackHandler.removeEventListener("hardwareBackPress", this.handlerBackButton);
        });
        this.getProfile();
        this.getListEvent()
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

    getListEvent = async () => {
        let events = await StorageUtil.retrieveItem(StorageUtil.LIST_EVENT);
        if (events != null) {
            this.getTimeData(events)
        }
    }

    getTimeData = (data) => {
        let now = new Date()
        data.forEach((item, index) => {
            if (item) {
                let createdTime = new Date(item.createdAt);
                let dayEvent = new Date(item.dayEvent);
                let diff = dayEvent.getTime() - createdTime.getTime();
                let diffFromToday = dayEvent.getTime() - now.getTime();
                if (diff >= 0 && diffFromToday <= 0) {
                    this.convertMillisecondData(item, index, diff)
                }
            }
        })
        console.log("DATA FROM EVENT HISTORY", this.data)
        this.setState({
            ok: true
        })
    }

    convertMillisecondData = (item, index, millisecond) => {
        let dayAlert = Math.floor(millisecond / 86400000);
        let time = {
            ...item,
            dayAlert: dayAlert,
        }
        if (index < this.data.length) {
            this.data[index] = time
        } else {
            this.data.push({ ...time })
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

    handleRefresh = () => {
        this.getListEvent()
    }


    renderListHistory = () => {
        console.log("this.dataTime", this.data);
        return (
            <FlatListCustom
                onRef={(ref) => { this.flatListRef = ref }}
                contentContainerStyle={{ flex: 1 }}
                data={this.data}
                renderItem={this.renderItem.bind(this)}
                keyExtractor={item => item.id}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                isShowEmpty={this.data.length == 0}
                textForEmpty={'Bạn chưa có sự kiện nào kết thúc'}
                styleTextEmpty={{ textAlign: 'center', marginHorizontal: Constants.MARGIN_XX_LARGE }}
            />
        )
    }

    renderItem = (item, index) => {
        return (
            <ItemEventHistory
                item={item}
                index={index}
                length={this.data.length}
                onPress={this.onPressEvent}
            />
        )
    }
    
    onPressEvent = (item) =>{
        this.props.navigation.navigate("EventHistoryDetail", { event: item, callBack: this.handleRefresh }) 
    }

    render() {
        const { user } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <Header
                        barStyle={'dark-content'}
                        title={"Các sự kiện đã qua"}
                        onBack={() => { this.onBack() }}
                        headerColor={'orange'} />
                    <Content
                        scrollEventThrottle={1}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.containerContent}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }>
                        {this.renderListHistory()}
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
                <StatusBar translucent={false} />
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(EventHistoryView)
