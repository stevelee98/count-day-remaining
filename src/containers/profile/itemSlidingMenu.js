import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Constants } from "values/constants";
import Utils from "utils/utils";
import screenType from "enum/screenType";
import { Colors } from "values/colors";
import commonStyles from "styles/commonStyles";
import { Fonts } from "values/fonts";
import Hr from "components/hr";
import styles from "./styles";

class ItemSlidingMenu extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { item, index, navigation, userInfo, callBack } = this.props;
        if (userInfo == null && item.forUser == true) return null;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => {

                }}
            >
                <View style={{
                    ...commonStyles.cardView,
                    flexDirection: 'row', justifyContent:'center'
                }}>
                    {item.icon != null && <Image style={{width: 48, height: 48}} source={item.icon} />}
                    <Text style={{ ...commonStyles.text400, ...Fonts.FONT_500, fontSize: Fonts.FONT_SIZE_XX_MEDIUM }} >{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default ItemSlidingMenu;
