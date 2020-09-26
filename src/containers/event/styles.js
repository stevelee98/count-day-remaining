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
        height: Constants.MAX_WIDTH * 0.7
    },
}