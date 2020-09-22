/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    Platform,
} from 'react-native';
import ImageLoader from 'components/imageLoader';
import Utils from 'utils/utils';

const DEFAULT_IMAGE_HEIGHT = 720;
const DEFAULT_IMAGE_WIDTH = 1080;

type ImageOffset = {|
    x: number,
        y: number,
|};

type ImageSize = {|
    width: number,
        height: number,
|};

type ImageCropData = {|
    offset: ImageOffset,
        size: ImageSize,
            displaySize ?: ? ImageSize,
            resizeMode ?: ? any,
|};

export default class SquareImageCropper extends React.Component<
    $FlowFixMeProps,
    $FlowFixMeState,
    > {
    state: any;
    _isMounted: boolean;
    _transformData: ImageCropData;

    /* $FlowFixMe(>=0.85.0 site=react_native_fb) This comment suppresses an error
     * found when Flow v0.85 was deployed. To see the error, delete this comment
     * and run Flow. */
    constructor(props) {
        super(props);
        this._isMounted = true;
        this.state = {
            measuredSize: null,
            croppedImageURI: null,
            cropError: null,
        };
    }

    render() {
        if (!this.state.measuredSize) {
            return (
                <View
                    style={styles.container}
                    onLayout={event => {
                        const measuredWidth = event.nativeEvent.layout.width;
                        const measuredHeight = event.nativeEvent.layout.height;
                        if (!measuredWidth) {
                            return;
                        }
                        this.setState({
                            measuredSize: { width: measuredWidth, height: measuredHeight },
                        });
                    }}
                />
            );
        }

        if (!this.state.croppedImageURI) {
            return this._renderImageCropper();
        }
        return this._renderCroppedImage();
    }

    _renderImageCropper() {
        if (!this.props.image) {
            return <View style={styles.container} />;
        }
        let error = null;
        if (this.state.cropError) {
            error = <Text>{this.state.cropError.message}</Text>;
        }
        return (
            <View>
                <ImageCropper
                    image={this.props.image}
                    size={this.state.measuredSize}
                    style={this.props.styleCrop}
                    onTransformDataChange={data => (this._transformData = data)}
                />
                {error}
            </View>
        );
    }

    _renderCroppedImage() {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={{ uri: this.state.croppedImageURI }}
                    style={[this.state.measuredSize, this.props.styleCrop]}
                />
                <TouchableHighlight
                    style={styles.cropButtonTouchable}
                    onPress={this._reset.bind(this)}>
                    <View style={styles.cropButton}>
                        <Text style={styles.cropButtonLabel}>Try again</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    async _crop() {
        try {
            const croppedImageURI = null

            if (croppedImageURI) {
                console.log("-----------------------", croppedImageURI)
                this.props.onCropImage(croppedImageURI);
            }
        } catch (cropError) {
            this.setState({ cropError });
        }
    }

    _reset() {
        this.setState({
            croppedImageURI: null,
            cropError: null,
        });
    }
}

class ImageCropper extends React.Component<$FlowFixMeProps, $FlowFixMeState> {
    _contentOffset: ImageOffset;
    _maximumZoomScale: number;
    _minimumZoomScale: number;
    _scaledImageSize: ImageSize;
    _horizontal: boolean;


    UNSAFE_componentWillMount() {
        console.log("-----------------------------", this.props)
        // Scale an image to the minimum size that is large enough to completely
        // fill the crop box.
        const widthRatio = this.props.image.width / this.props.size.width;
        const heightRatio = this.props.image.height / this.props.size.height;
        this._horizontal = widthRatio > heightRatio;


        if (this._horizontal) {
            this._scaledImageSize = {
                width: this.props.size.width,
                height: this.props.size.height,
            };
        } else {
            this._scaledImageSize = {
                width: this.props.size.width,
                height: this.props.image.height / widthRatio,
            };
            if (Platform.OS === 'android') {
                // hack to work around Android ScrollView a) not supporting zoom, and
                // b) not supporting vertical scrolling when nested inside another
                // vertical ScrollView (which it is, when displayed inside UIExplorer)
                this._scaledImageSize.width *= 2;
                this._scaledImageSize.height *= 2;
                this._horizontal = true;
            }
        }
        this._contentOffset = {
            x: (this._scaledImageSize.width - this.props.size.width) / 2,
            y: (this._scaledImageSize.height - this.props.size.height) / 2,
        };
        this._maximumZoomScale = Math.min(
            this.props.image.width / this._scaledImageSize.width,
            this.props.image.height / this._scaledImageSize.height,
        );
        this._minimumZoomScale = Math.max(
            this.props.size.width / this._scaledImageSize.width,
            this.props.size.height / this._scaledImageSize.height,
        );
        this._updateTransformData(
            this._contentOffset,
            this._scaledImageSize,
            this.props.size,
        );

        // TEST
        this.widthRatio = this.props.image.width / this.props.image.height;
        this.width = this.props.size.width;
        this.height = this.width / this.widthRatio;
        console.log(`RATIO : ${this.widthRatio}`);
        console.log(`WIDTH : ${this.width}`);
        console.log(`HEIGHT : ${this.height}`);
        // TEST
    }

    _onScroll(event) {
        this._updateTransformData(
            event.nativeEvent.contentOffset,
            event.nativeEvent.contentSize,
            event.nativeEvent.layoutMeasurement,
        );
    }

    _updateTransformData(offset, scaledImageSize, croppedImageSize) {
        const offsetRatioX = offset.x / scaledImageSize.width;
        const offsetRatioY = offset.y / scaledImageSize.height;
        const sizeRatioX = croppedImageSize.width / scaledImageSize.width;
        const sizeRatioY = croppedImageSize.height / scaledImageSize.height;
        const cropData: ImageCropData = {
            offset: {
                x: this.props.image.width * offsetRatioX,
                y: this.props.image.height * offsetRatioY,
            },
            size: {
                width: this.props.image.width * sizeRatioX,
                height: this.props.image.width * sizeRatioX * 9 / 16,
            },
        };
        this.props.onTransformDataChange &&
            this.props.onTransformDataChange(cropData);
    }

    render() {
        console.log(`=== image === `);

        console.log(this.props.image);
        let path;
        console.log(this.props.size);
        if (!Utils.isNull(this.props.image.uri))
            path = this.props.image.uri;
        else
            path = this.props.image.path;
        console.log('cropImageCover : ' + path);

        return (
            <View style={this.props.style}>
                <ScrollView
                    alwaysBounceVertical={false}
                    automaticallyAdjustContentInsets={false}
                    contentOffset={this._contentOffset}
                    horizontal={false}
                    onMomentumScrollEnd={this._onScroll.bind(this)}
                    onScrollEndDrag={this._onScroll.bind(this)}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={this.props.style}
                    scrollEventThrottle={16}>
                    {/* <Image
                        testID={'testImage'}
                        source={this.props.image}
                        style={[this.props.size]}
                    /> */}
                    <ImageLoader
                        // style={[this.props.size]}
                        style={{
                            width: this.width,
                            height: this.height
                        }}
                        resizeModeType={"cover"}
                        // resizeModeType={"contain"}
                        path={Platform.OS === 'ios' ? Utils.convertLocalIdentifierIOSToAssetLibrary(path, true) : path}
                    />
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageCropper: {
        alignSelf: 'center',
        marginTop: 12,
    },
    cropButtonTouchable: {
        alignSelf: 'center',
        marginTop: 12,
    },
    cropButton: {
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 4,
    },
    cropButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    text: {
        color: 'white',
    },
});
