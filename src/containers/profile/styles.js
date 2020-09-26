import React from "react-native";
import { Colors } from "values/colors";
import { Constants } from "values/constants";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
const { Dimensions, Platform } = React;
const { StyleSheet } = React;

export default (styles = {
	container: {
		width: null,
		height: null,
		flex: 1,
		justifyContent: "center",
		alignItems: "stretch",
		backgroundColor: Colors.COLOR_WHITE
	},
	titleMenu: {
		...commonStyles.text400,
		...Fonts.FONT_500,
		fontSize: Fonts.FONT_SIZE_XX_MEDIUM,
		flex: 1,
		marginHorizontal:Constants.MARGIN_X_LARGE
	},
	viewItemMenu: {
		...commonStyles.cardView,
		flexDirection: 'row',
		alignItems: 'center',
	},
	imgMenu: {
		width: 36,
		height: 36,
		marginRight: Constants.MARGIN_X_LARGE
	}
});
