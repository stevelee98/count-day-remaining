import slidingMenuType from "enum/slidingMenuType";
import { localizes } from "locales/i18n";
import I18n from 'react-native-i18n';
import ic_history from 'images/ic_history.png';

export default ListMenu = [
    {
        name: 'Các sự kiện đã qua',
        forUser: false,
        screen: slidingMenuType.USER_INFO,
        icon: ic_history
    },
    {
        name: localizes("userProfile.logOut"),
        forUser: true,
        icon: null,
        screen: null
    }
]