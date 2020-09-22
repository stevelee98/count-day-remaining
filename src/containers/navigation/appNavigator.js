import React, { Component } from "react";
import {
    Easing, Animated, View, Text
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import HomeView from 'containers/home/homeView';
import RegisterView from 'containers/register/registerView';
import ConfirmRegisterView from 'containers/register/confirmRegisterView';
import Main from 'containers/main/bottomTabNavigator';
import ForgotPasswordView from 'containers/forgotPassword/forgotPasswordView';
import ConfirmPasswordView from 'containers/forgotPassword/confirmPassword/confirmPasswordView';
import NotificationView from 'containers/notification/notificationView';
import ChangePasswordView from 'containers/changePassword/changePasswordView';
import UserProfileView from 'containers/profile/info/userProfileView';
import LoginView from 'containers/login/loginView';
import AddEvent from 'containers/event/addEvent';

import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={'Main'}
                headerMode={'none'}
                mode={'modal'}
                screenOptions={{
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.SlideFromRightIOS
                }}
            >
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordView} />
                <Stack.Screen name="Login" component={LoginView} />
                <Stack.Screen name="Register" component={RegisterView} />
                <Stack.Screen name="ConfirmRegister" component={ConfirmRegisterView} />
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Notification" component={NotificationView} />
                <Stack.Screen name="Home" component={HomeView} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordView} />
                <Stack.Screen name="ConfirmPassword" component={ConfirmPasswordView} />
                <Stack.Screen name="UserProfile" component={UserProfileView} />
                <Stack.Screen name="AddEvent" component={AddEvent} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator;
