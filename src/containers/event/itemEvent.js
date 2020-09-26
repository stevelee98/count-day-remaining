import React, { PureComponent } from 'react';
import { View, Text, ImageBackground, Pressable } from 'react-native';
import styles from './styles';
import img_bg_event from 'images/img_bg_event.jpeg';
import { Colors } from 'values/colors';
import DateUtil from 'utils/dateUtil';

class ItemEvent extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { item, index, length, onPress } = this.props;
        return (
            <ImageBackground
                key={index}
                source={item.resource != null ? { uri: item.resource } : img_bg_event}
                imageStyle={styles.imgBackground}
                style={styles.itemCountDown}
            >
                <Pressable
                    onPress={() => { onPress(item) }}
                    android_ripple={{
                        color: Colors.COLOR_WHITE,
                        borderless: false,
                    }}
                    style={styles.btnItem}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.itemTimeList}>
                            <Text style={styles.txtTimeList}>D - {item.dayAlert}</Text>
                            <Text style={styles.txtTimeTypeList}>{DateUtil.convertFromFormatToFormat(item.dayEvent, DateUtil.FORMAT_DATE_SQL, DateUtil.FORMAT_DATE)}</Text>
                        </View>
                    </View>
                    <Text numberOfLines={2} style={styles.titleItem}>{item.title}</Text>
                    <Text numberOfLines={2} style={styles.noteItem}>{item.note}</Text>
                </Pressable>
            </ImageBackground>
        )
    }
}

export default ItemEvent;
