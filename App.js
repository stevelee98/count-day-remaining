/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React from 'react';
import {
  View, StatusBar,
} from 'react-native';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import { MenuProvider } from 'react-native-popup-menu';
import StorageUtil from 'utils/storageUtil';
import { Colors } from 'values/colors';
import I18n from 'react-native-i18n';
import AppNavigator from 'containers/navigation/appNavigator';
import store from './src/store';
import SplashScreen from 'react-native-splash-screen';

const menuProviderStyles = {
  // menuProviderWrapper: styles.menuProviderWrapper,
  // backdrop: styles.backdrop,
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadedToken: false,
    };
  }

  componentDidMount() {
    this.setLanguage();
    this.getToken();
    SplashScreen.hide()
  }

  /**
     * Get token
     */
  getToken() {
    StorageUtil.retrieveItem(StorageUtil.USER_TOKEN).then((token) => {
      // this callback is executed when your Promise is resolved
      global.token = token;
      this.setState({ isLoadedToken: true });
      // SplashScreen.hide();
    }).catch((error) => {
      // this callback is executed when your Promise is rejected
      console.log(`Promise is rejected with error: ${error}`);
      // If case load token error then go to home always
      this.setState({ isLoadedToken: true });
      // SplashScreen.hide();
    });
  }

  setLanguage() {
    StorageUtil.retrieveItem(StorageUtil.LANGUAGE).then((language) => {
      console.log('language', language);
      if (language !== undefined || language != null) {
        if (language === 'vi') {
          I18n.locale = 'vi';
        } else {
          I18n.locale = 'vi';
        }
        StorageUtil.storeItem(StorageUtil.LANGUAGE, 'vi')
      } else {
        I18n.locale = 'vi';
      }
      this.getToken();
    }).catch((error) => {
      console.log(`Promise is rejected with error: ${error}`);
    });
  }

  render() {
    StatusBar.setBackgroundColor(Colors.COLOR_PRIMARY, true);
    StatusBar.setBarStyle('dark-content');
    const { isLoadedToken } = this.state;
    return (
      <Provider store={store}>
        <Root>
          {isLoadedToken ? (
            <MenuProvider customStyles={menuProviderStyles}>
              <AppNavigator />
            </MenuProvider>
          ) : <View style={{ backgroundColor: 'transparent' }} />}
        </Root>
      </Provider>
    );
  }
}
