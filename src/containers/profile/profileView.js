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
import DateUtil from 'utils/dateUtil';
import storage from '@react-native-firebase/storage';
import FlatListCustom from "components/flatListCustom";
import styles from './styles';
import ItemSlidingMenu from './itemSlidingMenu';
import ListMenu from './listMenu';

export class ProfileView extends BaseView {

    constructor(props){
        super(props);
        this.state = {
            user: null,
            refreshing: false,
            enableRefresh: true,
            events: []
        }
        this.events = []
        this.user = null
        this.menus = ListMenu;
    }

    componentDidMount(){
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

    getListEvent = async () => {
        let events = await StorageUtil.retrieveItem(StorageUtil.LIST_EVENT);
        if (events != null) {
            this.data = []
            this.data = events
            this.setState({
                data: events
            })
            console.log("data get from storage", events);
            this.getTimeData(events)
        }
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
        if (index < this.data.length) {
            this.data[index] = time
        } else {
            this.data.push({ ...time })
        }
        this.setState({
            data: this.data,
        })
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

    handleRefresh = () =>{

    }

    renderMenuUser() {
        return (
            <View>
                <Text style={styles.titleMenu}>Cá nhân</Text>
                <View style={styles.slidingMenu}>
                    <FlatListCustom
                        horizontal={false}
                        data={this.menus}
                        itemPerRow={1}
                        renderItem={this.renderItemSlide}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    }

    renderItemSlide = (item, index, separators) => {
        return (
            <ItemSlidingMenu
                item={item}
                index={index}
                navigation={this.props.navigation}
                userInfo={this.user}
                callBack={this.getProfile}
            />
        );
    }

    render() {
        const { user } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    <Content
                        showsVerticalScrollIndicator={false}
                        ref={e => { this.fScroll = e }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingVertical: Constants.PADDING_LARGE
                        }}
                        style={{ flex: 1 }}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={Constants.HEIGHT_HEADER_OFFSET_REFRESH}
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }>
                        {this.renderMenuUser()}
                    </Content>
                    {this.showLoadingBar(this.props.isLoading)}
                </Root>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView)
