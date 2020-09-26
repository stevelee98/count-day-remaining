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
    viewLoader: {
        width: Constants.MAX_WIDTH * 0.8, height: 150,
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: 'center', alignItems: 'center',
        borderRadius: Constants.CORNER_RADIUS * 3
    },
    viewUploading: {
        ...commonStyles.viewCenter,
        position: 'absolute',
        top: 0, left: 0,
        right: 0, bottom: 0,
        zIndex: 1000,
        backgroundColor: Colors.COLOR_BLACK_OPACITY_50
    },
    resource: {
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_WIDTH * (9 / 12),
        resizeMode: 'cover'
    },
    imgGradient: {
        position: 'absolute',
        bottom: 0,
        width: Constants.MAX_WIDTH,
        height: Constants.MAX_WIDTH * 0.9
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
}