import React from "react-native";
import { Constants } from "values/constants";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";

const { Dimensions, Platform } = React;
const { StyleSheet } = React;

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_WHITE
    },
    containerContent: {
        flexGrow: 1,
        backgroundColor: Colors.COLOR_WHITE
    },
    contentCommon: {
        alignItems: 'center'
    },
    itemTime: {
        borderRadius: Constants.CORNER_RADIUS,
        borderWidth: 1,
        borderColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING_LARGE,
        marginHorizontal: Constants.MARGIN_LARGE,
        alignItems: 'center',
        width: 50
    },
    txtTime: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE,
        fontSize: Fonts.FONT_SIZE_XX_MEDIUM
    },
    txtTimeType: {
        ...commonStyles.textSmall,
        color: Colors.COLOR_WHITE,
    },
    bannerContainer: {
        alignItems: 'center',
        marginVertical: Constants.MARGIN_X_LARGE
    },
    imgBanner: {
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_WIDTH * (9 / 16),
        resizeMode: 'cover',
        marginTop: -16
    },
    imgGradient: {
        position: 'absolute',
        bottom: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_WIDTH * 0.7
    },
    bannerContent: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0
    },
    titleBanner: {
        ...Fonts.FONT_600,
        textAlign: 'center',
        color: Colors.COLOR_WHITE,
        fontSize: Fonts.FONT_SIZE_X_LARGE
    },
    bannerTime: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItem: 'center',
        marginVertical: Constants.MARGIN_X_LARGE
    },
    txtEventHome: {
        ...Fonts.FONT_600,
        fontSize: Fonts.FONT_SIZE_LARGE,
        marginHorizontal: Constants.PADDING_X_LARGE
    },
    content: {
        marginHorizontal: Constants.PADDING_X_LARGE
    },
    fabBtn: {
        ...commonStyles.shadowOffset,
        borderRadius: Constants.BORDER_RADIUS,
    },
    itemTimeList: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginRight: Constants.MARGIN_X_LARGE,
        marginBottom: Constants.MARGIN_X_LARGE
    },
    txtTimeList: {
        ...commonStyles.text,
        margin: 0, padding: 0,
        textAlign: 'left',
        color: Colors.COLOR_WHITE,
        fontSize: Fonts.FONT_SIZE_X_LARGE
    },
    txtTimeTypeList: {
        ...commonStyles.textSmall,
        color: Colors.COLOR_WHITE,
    },
    imgBackground: {
        borderRadius: Constants.CORNER_RADIUS * 2,
        opacity: 0.7,
        backgroundColor: Colors.COLOR_BLACK,
    },
    itemCountDown: {
        ...commonStyles.shadowOffset,
        borderRadius: Constants.CORNER_RADIUS * 2,
        backgroundColor: Colors.COLOR_DRK_GREY,
        marginTop: Constants.MARGIN_LARGE,
        marginBottom: Constants.MARGIN_LARGE,
        marginHorizontal: Constants.MARGIN_X_LARGE
    },
    btnItem: {
        flex: 1,
        padding: Constants.PADDING_X_LARGE,
    },
    titleItem: {
        ...Fonts.FONT_600,
        fontSize: Fonts.FONT_SIZE_LARGE,
        color: Colors.COLOR_WHITE
    },
    noteItem: {
        ...Fonts.FONT_400,
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        color: Colors.COLOR_WHITE
    },
    appName: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE,
        fontSize: Fonts.FONT_SIZE_XX_LARGE,
        position: 'absolute',
        top: 16, left: 16
    },
};

