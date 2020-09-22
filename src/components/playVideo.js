// import React, {
//     Component
// } from 'react';

// import {
//     AppRegistry,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import StorageUtil from 'utils/storageUtil';
// import Video from 'lib/react-native-video';
// import commonStyles from 'styles/commonStyles';
// import Utils from 'utils/utils';
// import StringUtil from 'utils/stringUtil';

// class PlayVideo extends Component {
//     constructor(props){
//         super(props)
//         this.videoUrl = {}
//         this.state = {
//             rate: 1,
//             volume: 1,
//             muted: false,
//             resizeMode: 'contain',
//             duration: 0.0,
//             currentTime: 0.0,
//             paused: true,
//             videoUrl: "",
//             isPlay: false
//         };
//         this.video = Video
//     }

//     onLoad = (data) => {
//         this.setState({ duration: data.duration });
//         console.log('onLoad: ', data.duration);
//         console.log('paused: ', this.state.paused);
//         if(this.state.isPlay == false){
//             this.setState({ paused: true },() => this.setState({ paused: false }))
//         }
//     };

//     onProgress = (data) => {
//         this.setState({ currentTime: data.currentTime });
//         console.log('onProgress: ', data.currentTime);
//     };

//     onEnd = () => {
//         this.setState({ paused: true })
//         this.video.seek(0);
//         this.props.onEndTrial()
//         console.log('onEnd');
//     };

//     onAudioBecomingNoisy = () => {
//         this.setState({ paused: true })
//         console.log('onAudioBecomingNoisy');
//     };

//     onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
//         if (!this.state.paused && !event.hasAudioFocus) {
//           this.setState({ paused: false, isPlay: true })
//         }
//         console.log('onAudioFocusChanged');
//     }

//     getCurrentTimePercentage() {
//         if (this.state.currentTime > 0) {
//             return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
//         }
//         return 0;
//     };

//     renderRateControl(rate) {
//         const isSelected = (this.state.rate === rate);

//         return (
//             <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
//                 <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
//                     {rate}x
//           </Text>
//             </TouchableOpacity>
//         );
//     }

//     renderResizeModeControl(resizeMode) {
//         const isSelected = (this.state.resizeMode === resizeMode);

//         return (
//             <TouchableOpacity onPress={() => { this.setState({ resizeMode }) }}>
//                 <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
//                     {resizeMode}
//                 </Text>
//             </TouchableOpacity>
//         )
//     }

//     renderVolumeControl(volume) {
//         const isSelected = (this.state.volume === volume);

//         return (
//             <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
//                 <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
//                     {volume * 100}%
//           </Text>
//             </TouchableOpacity>
//         )
//     }

//     getFormattedTime() {
//         let miliseconds = this.state.duration - this.state.currentTime;
//         if (miliseconds == 0) return;

//         const totalSeconds = Math.round(miliseconds);
//         let seconds = parseInt(totalSeconds % 60, 10);
//         let minutes = parseInt(totalSeconds / 60, 10) % 60;
//         let hours = parseInt(totalSeconds / 3600, 10);
//         seconds = seconds < 10 ? '0' + seconds : seconds;
//         minutes = minutes < 10 ? '0' + minutes : minutes;
//         hours = hours < 10 ? '0' + hours : hours;
//         hours = hours === '00' ? '' : hours + ':';
//         return hours + minutes + ':' + seconds;
//     }

//     componentWillMount(){
//         this.getVideo();
//     }

//     /**
//      * Get video
//      */
//     getVideo=()=>{
//         StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG).then((video) => {
//             console.log('faq', video)
//             this.videoUrl = video.find(x => x.name == 'home.intro_video_url')
//             console.log('url video',this.videoUrl.textValue)
//             this.setState({
//                 videoUrl: this.videoUrl.textValue,
//                 paused: false
//             })
//         }).catch((error) => {
//             //this callback is executed when your Promise is rejected
//             console.log('Promise is rejected with error: ' + error);
//         });
//     }

//     render() {
//         const flexCompleted = this.getCurrentTimePercentage() * 100;
//         const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
//         console.log("Render Play Video")
//         console.log("Pause",this.state.paused)
//         return (
//             <View style={styles.container}>
//                 <View style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
//                     <Text style={commonStyles.textOrangeBold}>{this.getFormattedTime()}</Text>
//                 </View>
//                 <TouchableOpacity
//                     style={styles.fullScreen}
//                     onPress={() => this.setState({ paused: !this.state.paused })}
//                 >
//                     {!Utils.isNull(this.state.videoUrl) && !StringUtil.isNullOrEmpty(this.state.videoUrl) ?
//                         <Video
//                             ref={(ref) => { this.video = ref }}
//                             /* For ExoPlayer */
//                             source={{ uri: this.state.videoUrl }}
//                             style={styles.fullScreen}
//                             rate={this.state.rate}
//                             paused={this.state.paused}
//                             volume={this.state.volume}
//                             muted={this.state.muted}
//                             resizeMode={this.state.resizeMode}
//                             onLoad={this.onLoad}
//                             onProgress={this.onProgress}
//                             onEnd={this.onEnd}
//                             onAudioBecomingNoisy={this.onAudioBecomingNoisy}
//                             onAudioFocusChanged={this.onAudioFocusChanged}
//                             repeat={false}
//                         /> : null
//                     }
//                 </TouchableOpacity>

//                 <View style={styles.controls}>
//                     {/* <View style={styles.generalControls}> */}
//                         <View style={styles.rateControl}>
//                             {this.renderRateControl(0.25)}
//                             {this.renderRateControl(0.5)}
//                             {this.renderRateControl(1.0)}
//                             {this.renderRateControl(1.5)}
//                             {this.renderRateControl(2.0)}
//                         </View>

//                         {/* <View style={styles.volumeControl}>
//                             {this.renderVolumeControl(0.5)}
//                             {this.renderVolumeControl(1)}
//                             {this.renderVolumeControl(1.5)}
//                         </View> */}

//                         {/* <View style={styles.resizeModeControl}>
//                             {this.renderResizeModeControl('cover')}
//                             {this.renderResizeModeControl('contain')}
//                             {this.renderResizeModeControl('stretch')}
//                         </View> */}
//                     {/* </View> */}

//                     <View style={styles.trackingControls}>
//                         <View style={styles.progress}>
//                             <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
//                             <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
//                         </View>
//                     </View>
//                 </View>
//             </View>
//         );
//     }
// }


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'black',
//         position: 'relative'
//     },
//     fullScreen: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         bottom: 0,
//         right: 0,
//     },
//     controls: {
//         backgroundColor: 'transparent',
//         borderRadius: 5,
//         position: 'absolute',
//         bottom: 10,
//         left: 10,
//         right: 10,
//     },
//     progress: {
//         flex: 1,
//         flexDirection: 'row',
//         borderRadius: 3,
//         overflow: 'hidden',
//     },
//     innerProgressCompleted: {
//         height: 10,
//         backgroundColor: '#cccccc',
//     },
//     innerProgressRemaining: {
//         height: 10,
//         backgroundColor: '#2C2C2C',
//     },
//     generalControls: {
//         flex: 1,
//         flexDirection: 'row',
//         borderRadius: 4,
//         overflow: 'hidden'
//     },
//     rateControl: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     volumeControl: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'center',
//     },
//     resizeModeControl: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     controlOption: {
//         alignSelf: 'stretch',
//         fontSize: 11,
//         color: 'white',
//         paddingLeft: 2,
//         paddingRight: 2,
//         lineHeight: 12,
//     },
// });

// export default PlayVideo;