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
});
