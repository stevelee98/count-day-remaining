import React, { Component } from 'react';
import { BackHandler, Text, View, Image, Alert, Dimensions } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import HomeView from 'containers/home/homeView';

// import icons
import { Colors } from 'values/colors';
import { Fonts } from 'values/fonts';
import commonStyles from 'styles/commonStyles';
import { Constants } from 'values/constants';
import { connect } from 'react-redux';

import BottomTabCustom from 'components/bottomTabCustom';

import ic_home_blue from "images/ic_home_blue.png";
import ic_user_blue from "images/ic_user_blue.png";
import ic_home_black from "images/ic_home_black.png";
import ic_user_black from "images/ic_user_black.png";
import * as actions from 'actions/userActions';
import Utils from 'utils/utils';

const BottomTabNavigator = ({ badgeCount }) => {
	return (
		<Tab.Navigator
			initialRouteName="TabHome"
			activeColor={Colors.COLOR_PRIMARY}
			inactiveColor={Colors.COLOR_TEXT}
			backBehavior={"initialRoute"}
			barStyle={{ backgroundColor: Colors.COLOR_WHITE }}
		>
			<Tab.Screen
				name="TabHome"
				component={HomeView}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? ic_home_blue : ic_home_black} />
					),
					tabBarColor: Colors.COLOR_WHITE
				}}
			/>
			<Tab.Screen
				name="TabUser"
				component={HomeView}
				options={{
					tabBarLabel: "User",
					tabBarIcon: ({ focused, color, size }) => (
						<Image source={focused ? ic_user_blue : ic_user_black} />
					),
					tabBarColor: Colors.COLOR_WHITE
				}}
			/>
		</Tab.Navigator>
	);
}

const mapStateToProps = state => ({
	badgeCount: state.bottomTabNavigator.data,
	isLoading: state.bottomTabNavigator.isLoading,
	errorCode: state.bottomTabNavigator.errorCode,
	action: state.bottomTabNavigator.action
})

const mapDispatchToProps = {
	...actions
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);