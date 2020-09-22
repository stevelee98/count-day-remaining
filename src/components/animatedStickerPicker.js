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
import IMAGES from '../../android/app/src/main/assets/animatedStickers/index';
import FastImage from "react-native-fast-image";

const Categories = IMAGES.category;
const Stickers = IMAGES.sticker;
const STICKER_COL_WIDTH = Dimensions.get('window').width / 4;
const STICKER_COL_HEIGHT = 100;
const STICKER_IMAGE_WIDTH = STICKER_COL_WIDTH * 0.8;
const STICKER_IMAGE_HEIGHT = STICKER_COL_HEIGHT * 0.8;
const NUMBER_COLUMNS = 4;
const TAB_IMAGE_WIDTH = 40;
const TAB_IMAGE_HEIGHT = 40;

export default class AnimatedStickerPicker extends Component {
    constructor(props) {
        super(props);
        this.categorySelected = Categories[0];
        this.listStickersSelected = Stickers[this.categorySelected.key]
        this.state = {
            searchQuery: "",
            category: Categories[0],
            isReady: true,
            history: [],
            stickerList: null,
            colSize: 0,
            width: 0,
            listCategories: Categories,
            listStickersSelected: this.listStickersSelected,
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.category !== nextProps.category ||
            this.state.category !== nextState.category ||
            this.state.listStickersSelected !== nextState.listStickersSelected ||
            this.state.listCategories !== nextState.listCategories ||
            !this.state.isReady)
            return true;
        return false;
    }

    /** 
     * handle sticker selected 
     * @param sticker 
     */
    handleStickerSelected = sticker => {
        this.props.onStickerSelected(sticker);
    };

    /**
     * handle Long Press Sticker
     */
    handleLongPressSticker = sticker => {
        this.props.onLongPressSticker(sticker);
    };

    /**
    * handle on press out Sticker
    */
    handleOnPressOutSticker = sticker => {
        this.props.onPressOutSticker(sticker);
    };

    render() {
        const { handleLongPressSticker } = this.props;
        const { category, colSize, isReady, searchQuery } = this.state;

        return (
            <Container>
                <ParentTabSticker
                    listCategories={this.state.listCategories}
                    colSize={colSize}
                    columns={NUMBER_COLUMNS}
                    listSticker={Stickers}
                    handleStickerSelected={this.handleStickerSelected}
                    handleLongPressSticker={this.handleLongPressSticker}
                    handleOnPressOutSticker={this.handleOnPressOutSticker}
                />
            </Container>
        );
    }
}

/**
 * render Parent Tab Sticker 
 */
const ParentTabSticker = React.memo(({ listCategories, listSticker, handleStickerSelected, handleLongPressSticker, columns, colSize, handleOnPressOutSticker }) => {
    console.log(`ParentTabSticker : render()`);

    return (
        <Tabs
            tabBarPosition='bottom'
            tabBarUnderlineStyle={{
                backgroundColor: 'green'
            }}
            prerenderingSiblingsNumber={listCategories.length}
            renderTabBar={() => <ScrollableTab style={{ backgroundColor: 'white' }} />}
        >
            {
                listCategories.map(category =>
                    <Tab
                        // key={category.key}
                        heading={
                            <View style={{ backgroundColor: colors.white }}>
                                <Image
                                    style={{ width: TAB_IMAGE_WIDTH, height: TAB_IMAGE_HEIGHT }}
                                    source={category.symbol}
                                    resizeMode={'center'}
                                />
                            </View>
                        }
                    >
                        <TabSticker
                            colSize={colSize}
                            columns={columns}
                            listSticker={listSticker[category.key]}
                            handleStickerSelected={handleStickerSelected}
                            handleLongPressSticker={handleLongPressSticker}
                            handleOnPressOutSticker={handleOnPressOutSticker}
                        />
                    </Tab>
                )
            }
        </Tabs>
    );
})

/**
 * render Tab Sticker 
 */
const TabSticker = React.memo(({ listSticker, handleStickerSelected, handleLongPressSticker, columns, colSize, handleOnPressOutSticker }) => {
    return (
        <FlatList
            contentContainerStyle={{ paddingBottom: 0, backgroundColor: '#F2F2F2' }}
            data={listSticker}
            renderItem={({ item }) =>
                <StickerItem
                    item={item}
                    handleStickerSelected={handleStickerSelected}
                    handleLongPressSticker={handleLongPressSticker}
                    colSize={colSize}
                    handleOnPressOutSticker={handleOnPressOutSticker}
                />}
            horizontal={false}
            numColumns={columns}
            keyExtractor={item => item.source}
            // initialNumToRender={5}
            // maxToRenderPerBatch={5}
            // updateCellsBatchingPeriod={500}
            windowSize={10}
            keyboardShouldPersistTaps={"always"}
            // ref={scrollview => (this.scrollview = scrollview)}
            removeClippedSubviews
        />
    );
})

/**
 * Emoji item 
 */
const StickerItem = React.memo(({ item, handleStickerSelected, colSize, handleLongPressSticker, handleOnPressOutSticker }) => (
    <StickerCell
        key={item.key}
        sticker={item}
        handleStickerSelected={handleStickerSelected}
        handleLongPressSticker={handleLongPressSticker}
        colSize={colSize}
        handleOnPressOutSticker={handleOnPressOutSticker}
    />
));

/**
 * Sticker item 
 * @param {*} Sticker 
 */
const StickerCell = ({ sticker, colSize, handleStickerSelected, handleLongPressSticker, handleOnPressOutSticker }) => (
    <TouchableOpacity
        // activeOpacity={0.5}
        style={{
            width: STICKER_COL_WIDTH,
            height: STICKER_COL_HEIGHT,
            alignItems: "center",
            justifyContent: "center",
        }}
        onPress={() => handleStickerSelected(sticker)}
        onLongPress={() => handleLongPressSticker(sticker)}
        onPressOut={() => handleOnPressOutSticker(sticker)}
    >
        <FastImage
            style={{
                width: STICKER_IMAGE_WIDTH,
                height: STICKER_IMAGE_HEIGHT
            }}
            source={sticker.thumbnail}
        />
    </TouchableOpacity>
);

AnimatedStickerPicker.defaultProps = {
    theme: "#007AFF",
    category: Categories.all,
    showTabs: true,
    showSearchBar: true,
    showHistory: false,
    showSectionTitles: true,
    columns: 4,
    placeholder: "Search..."
};

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        width: "100%"
    },
    loader: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    tabBar: {
        flexDirection: "row"
    },
    scrollview: {
        flex: 1
    },
    searchbar_container: {
        width: "100%",
        zIndex: 1,
        backgroundColor: "rgba(255,255,255,0.75)"
    },
    search: {
        ...Platform.select({
            ios: {
                height: 36,
                paddingLeft: 8,
                borderRadius: 10,
                backgroundColor: "#E5E8E9"
            }
        }),
        margin: 8
    },
    container: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "flex-start"
    },
    sectionHeader: {
        margin: 8,
        fontSize: 17,
        width: "100%",
        color: "#8F8F8F"
    }
});
