import React from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import commonStyles from "styles/commonStyles";

const { StyleSheet } = React;

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    header: {
        backgroundColor: Colors.COLOR_BACKGROUND
    },
    ContentContainer: {
        flexGrow: 1, backgroundColor: Colors.COLOR_WHITE
    },
    textInformation: {
        marginTop: Constants.MARGIN_X_LARGE,
        marginLeft: Constants.MARGIN_X_LARGE,
        // fontSize: Fonts.FONT_SIZE_XX_LARGE,
        color: 'black'
    },
    form: {
        marginTop: Constants.MARGIN_LARGE
    },
    inputGroup: {
        borderRadius: Constants.CORNER_RADIUS,
        borderColor: '#707070',
        borderWidth:0.4,
    },
    inputNormal: {
        margin: 0, color: 'black'
    },
    containerButtonComplete: {
        justifyContent: 'flex-end',
        paddingBottom: Constants.MARGIN_LARGE * 2
    }
};
