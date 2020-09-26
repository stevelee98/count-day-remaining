import React, { PureComponent } from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import ic_trash_red from 'images/ic_trash_red.png';
import styles from './styles';
import Swipeout from 'react-native-swipeout';
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import commonStyles from 'styles/commonStyles';
import { Fonts } from 'values/fonts';
import DateUtil from 'utils/dateUtil';

export class ItemEventNote extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visibleDelete: false,
            isRightOpen: false
        }
    }

    render() {
        let { item, index, dayAlert, onDelete } = this.props;
        const swipeSettings = {
            autoClose: true,
            right: [
                {
                    onPress: () => { onDelete(index) },
                    component: (
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center', flex: 1,
                            marginLeft: - 16,
                            borderRadius: Constants.BORDER_RADIUS,

                        }}>
                            <Image source={ic_trash_red} />
                            <Text style={{ ...commonStyles.textSmall, color: 'red' }}>Xóa</Text>
                        </View>
                    ),
                    backgroundColor: 'white',
                    type: 'delete'
                }
            ]
        };
        return (
            <Swipeout
                {...swipeSettings}
                openRight={this.state.isRightOpen}
                backgroundColor='white'
                scroll={() => {
                    this.setState({
                        isRightOpen: false
                    })
                }}
                style={{ flex: 1, justifyContent: 'center' }}>
                <Pressable
                    onLongPress={() => {
                        this.setState({
                            isRightOpen: true
                        })
                    }}
                    delayLongPress={200}
                    key={index}
                    onPress={() => { }}
                    android_ripple={{
                        color: Colors.COLOR_WHITE,
                        borderless: false,
                    }}
                    style={{
                        ...commonStyles.cardView,
                        elevation: 3,
                        flexDirection: 'row', alignItems: 'center'
                    }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ ...Fonts.FONT_500, color: Colors.COLOR_BLUE_SEA, flex: 1 }}>{DateUtil.convertFromFormatToFormat(item.dayNote, DateUtil.FORMAT_DATE_TIME_ZONE, DateUtil.FORMAT_DAY_TIME)} - Còn {dayAlert} ngày</Text>
                        <Text style={{ ...commonStyles.text400, fontSize: Fonts.FONT_SIZE_XX_SMALL + 1, marginTop: Constants.MARGIN_LARGE, flex: 1 }}>{item.note}</Text>
                    </View>
                    {/* <Image source={ic_trash_red} style={{ marginHorizontal: Constants.MARGIN_X_LARGE }} /> */}
                </Pressable>
            </Swipeout>
        )
    }
}

export default ItemEventNote
