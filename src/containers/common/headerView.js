import React, { Component } from "react";
import PropTypes from "prop-types";
import { ImageBackground, Dimensions, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, Keyboard } from "react-native";
import { Form, Textarea, Container, Header, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Fab, Footer, Input, Item, Picker } from "native-base";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import BaseView from "containers/base/baseView";
import TimerCountDown from "components/timerCountDown";
import commonStyles from "styles/commonStyles";
import ic_back_white from "images/ic_back_white.png";
import { Fonts } from "values/fonts";
import ic_default_user from "images/ic_default_user.png";
import shadow_avatar_home from "images/shadow_avatar_home.png";
import Utils from "utils/utils";
import ImageLoader from "components/imageLoader";
import BackgroundShadow from "components/backgroundShadow";
import StringUtil from "utils/stringUtil";
import { localizes } from "locales/i18n";
import ModalDropdown from "components/dropdown";
import staffType from "enum/staffType";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger
} from "react-native-popup-menu";

const deviceHeight = Dimensions.get("window").height;
const AVATAR_SIZE = 32;
const AVATAR_BORDER = AVATAR_SIZE / 2

class HeaderView extends Component {
    static propTypes = {
        //Title
        title: PropTypes.string.isRequired,
        //Handle to be called:
        //when user pressed back button
        onBack: PropTypes.func,
        titleStyle: PropTypes.object,
        visibleBack: PropTypes.bool,
        visibleLogo: PropTypes.bool,
        visibleNotification: PropTypes.bool,
        visibleAccount: PropTypes.bool,
        visibleIconLeft: PropTypes.bool,
        visibleDark: PropTypes.bool,
        barStyle: PropTypes.string,
        barBackground: PropTypes.string,
        barTranslucent: PropTypes.bool,
        backColor: PropTypes.string
    };

    static defaultProps = {
        visibleBack: false,
        visibleNotification: false,
        visibleAccount: false,
        onBack: null,
        titleStyle: null,
        visibleIconLeft: false,
        visibleLogo: false,
        visibleDark: false,
        barStyle: "dark-content",
        barBackground: Colors.COLOR_TRANSPARENT,
        barTranslucent: true,
        backColor: 'black'
    };

    constructor(props) {
        super(props);
        this.state = {
            countDownTime: this.props.timeLimit,
            branchSelected: {
                id: null,
                name: "Tất cả chi nhánh"
            }
        };
        this.timeTick = this.state.countDownTime;
    }

    render() {
        const { title,
            onBack,
            onRefresh,
            renderLeftMenu,
            barBackground,
            barTranslucent,
            visibleDark,
            barStyle
        } = this.props;
        return (
            <View style={styles.headerBody}>
                {this.props.visibleIconLeft ? this.renderIconLeft() : null}
                {this.props.visibleLogo ? this.renderLogo() : null}
                {!StringUtil.isNullOrEmpty(title) ? (
                    <View style={{
                        position: "absolute",
                        right: 0,
                        left: 0
                    }}>
                        <Text numberOfLines={1} style={[commonStyles.title, {
                            textAlign: "center",
                            marginHorizontal: Constants.MARGIN_X_LARGE * 3,
                            color: Colors.COLOR_TEXT_PRIMARY
                        }, this.props.titleStyle]}>
                            {title}
                        </Text>
                    </View>
                ) : null}
                {this.props.visibleBack ? this.renderBack() : null}
                {this.props.visibleAccount ? this.renderAccount() : null}
                {this.props.visibleIconRight ? this.renderIconRight() : null}
                {this.props.visibleNotification ? this.renderNotification() : null}
                {/* <StatusBar
                    animated={true}
                    backgroundColor={barBackground}
                    barStyle={barStyle}  // dark-content, light-content and default
                    hidden={false}  //To hide statusBar
                    translucent={barTranslucent}  //allowing light, but not detailed shapes
                /> */}
            </View>

        );
    }

    /**
     * Render back
     */
    renderBack() {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    padding: Constants.PADDING_LARGE
                }}
                onPress={() => {
                    if (this.props.onBack) this.props.onBack();
                }}
            >
                <Image source={ic_back_white} />
            </TouchableOpacity>
        );
    }

    /**
     * Render icon left
     */
    renderIconLeft() {
        const { onPressIconLeft } = this.props;
        return (
            <TouchableOpacity
                style={{ padding: Constants.PADDING_X_LARGE }}
                onPress={() => {
                    if (onPressIconLeft) this.props.onPressIconLeft();
                }}
            >
                <Image source={this.props.visibleIconLeft} />
            </TouchableOpacity>
        );
    }

    /**
     * Render icon right
     */
    renderIconRight() {
        const { onPressIconRight } = this.props;
        return (
            <TouchableOpacity
                style={{ padding: Constants.PADDING_X_LARGE }}
                onPress={() => {
                    if (onPressIconRight) this.props.onPressIconRight();
                }}
            >
                <Image source={this.props.visibleIconRight} />
            </TouchableOpacity>
        );
    }

    /**
     * Render account
     */
    renderAccount() {
        const { user, onPressUser, source } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={onPressUser}
                style={{
                    alignItems: "center",
                    flexDirection: "row",
                    width: "75%",
                    marginHorizontal: Constants.MARGIN_LARGE
                }}
            >
                <ImageLoader
                    style={{
                        width: AVATAR_SIZE,
                        height: AVATAR_SIZE,
                        borderRadius: AVATAR_BORDER,
                        position: "relative"
                    }}
                    // resizeModeType={"cover"}
                    path={!Utils.isNull(user) ? user.avatarPath : null}
                />
                <View>
                    <Text numberOfLines={1} style={[commonStyles.textSmall, {
                        opacity: 0.8,
                        margin: 0,
                        marginLeft: Constants.MARGIN_LARGE,
                        color: Colors.COLOR_BLACK
                    }]}>{user != null ? "Chào, " + user.name : "Đăng nhập/ Đăng ký"}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    /**
     * Render notification button
     */
    renderNotification() {
        const { quantityNotification, visibleDark } = this.props;
        // const WIDTH = Utils.getLength(parseInt(quantityNotification)) < 2 ? 16 : 26;
        const HEIGHT = 16;
        const RIGHT = -4;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    padding: Constants.PADDING_LARGE,
                }}
                onPress={() => { if (this.props.gotoNotification) this.props.gotoNotification(); }}
            >
                {/* <Image source={ic_notification_blue} /> */}
                {global.badgeCount && global.badgeCount > 0 ? (
                    <View
                        style={[
                            {
                                position: 'absolute',
                                alignSelf: 'flex-start',
                                right: 5,
                                top: 6,
                                borderWidth: 1, borderColor: Colors.COLOR_WHITE,
                                backgroundColor: Colors.COLOR_RED,
                                borderRadius: 16,
                                paddingHorizontal: Constants.PADDING,
                                justifyContent: 'center', alignItems: 'center'
                            }
                        ]}
                    >
                        <Text style={{
                            textAlign: 'center',
                            color: Colors.COLOR_WHITE,
                            fontSize: Fonts.FONT_SIZE_SMALL
                        }}>{global.badgeCount}</Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }



    componentWillReceiveProps(newProps) {
        if (newProps.timeLimit <= 0) this.timeTick = newProps.timeLimit;
        this.setState({
            countDownTime: newProps.timeLimit
        });
    }

    /**
     * Render logo
     */
    renderLogo() {
        return (
            <View style={[commonStyles.viewCenter, {
                position: "absolute",
                padding: Constants.PADDING_LARGE,
                left: 0
            }]}>
                {/* <Image source={ic_logo} style={{ width: 42, height: 42 }} /> */}
            </View>
        );
    }
}

const styles = {
    headerBody: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.COLOR_BACKGROUND,
        margin: Constants.MARGIN_LARGE,
        borderRadius: Constants.CORNER_RADIUS * 6
    }
};
export default HeaderView;
