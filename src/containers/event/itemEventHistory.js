import React, { PureComponent } from 'react';
import { View, Text, ImageBackground, Pressable } from 'react-native';
import styles from './styles';
import img_bg_event from 'images/img_bg_event.jpeg';
import { Colors } from 'values/colors';
import DateUtil from 'utils/dateUtil';
import { Fonts } from 'values/fonts';
import { Constants } from 'values/constants';

class ItemEventHistory extends PureComponent {
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
                style={[styles.itemCountDown, {
                    marginTop: index == 0 ? Constants.MARGIN_X_LARGE : 0,
                    marginBottom: index == length ? Constants.MARGIN_X_LARGE : Constants.MARGIN_X_LARGE
                }]}
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
                            <Text style={styles.txtTimeList}>{item.dayAlert} ngày</Text>
                            <Text style={styles.txtTimeTypeList}>Từ {' '}
                                <Text style={{ fontSize: Fonts.FONT_SIZE_XX_SMALL + 1 }}>
                                    {DateUtil.convertFromFormatToFormat(item.createdAt, DateUtil.FORMAT_DATE_TIME_ZONE_T, DateUtil.FORMAT_DATE)}
                                </Text> đến{' '}
                                <Text style={{ fontSize: Fonts.FONT_SIZE_XX_SMALL + 1 }}>{DateUtil.convertFromFormatToFormat(item.dayEvent, DateUtil.FORMAT_DATE_SQL, DateUtil.FORMAT_DATE)}</Text>
                            </Text>
                        </View>
                    </View>
                    <Text numberOfLines={2} style={styles.titleItem}>{item.title}</Text>
                    <Text numberOfLines={2} style={styles.noteItem}>{item.note}</Text>
                </Pressable>
            </ImageBackground>
        )
    }
}

export default ItemEventHistory;
