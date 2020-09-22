import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    Image,
    Dimensions
} from "react-native";
import { Container, Tabs, Tab, ScrollableTab } from "native-base";
// import { Colors } from "react-native-paper";
import { colors } from "react-native-elements";
import FastImage from "react-native-fast-image";
import GIF from '../../android/app/src/main/assets/gif/index';

const ITEM_GIF_WIDTH = 180;
const ITEM_GIF_HEIGHT = 150;

export default class GifPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listGifs: GIF
        }
    }

    componentDidMount = () => {

    };


    /** 
     * handle gif selected 
     * @param gif 
     */
    onPressGifItem = gif => {
        this.props.onPressGifItem(gif);
    };


    render() {
        const { listGifs } = this.state;
        return (
            <View>
                <FlatList
                    contentContainerStyle={{
                        padding: 10,
                        backgroundColor: "#F2F2F2"
                    }}
                    data={listGifs}
                    renderItem={({ item }) =>
                        <GifItem
                            item={item}
                            onPress={this.onPressGifItem}
                        />}
                    horizontal={true}
                    keyExtractor={item => item.source}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={500}
                    windowSize={10}
                    keyboardShouldPersistTaps={"always"}
                    removeClippedSubviews
                />
            </View>
        );
    }
}

const GifItem = React.memo(({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={() => onPress(item)}
            style={{ marginHorizontal: 5 }}>
            <FastImage
                source={item.source}
                style={{ width: ITEM_GIF_WIDTH, height: ITEM_GIF_HEIGHT }}
                resizeMode={'cover'}
            />
        </TouchableOpacity>
    );
})

GifPicker.defaultProps = {

};

