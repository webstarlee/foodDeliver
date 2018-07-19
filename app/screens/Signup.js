import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {
  BASE_API_URL,
  HEADER_EXPANDED_HEIGHT,
  HEADER_COLLAPSED_HEIGHT,
  SCREEN_WIDTH,
}  from '../components/StaticValues';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'react-native-firebase';
import SingleTon from "../components/SingleTon"
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Triangle from 'react-native-triangle'; 
import NavigationMain from "../components/NavigationMain";
import DatePicker from 'react-native-datepicker';
import ModalSelector from 'react-native-modal-selector';
import ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';

export default class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            scrollY: new Animated.Value(0),
            birthDate: "",
            gender: "",
            avatarSource: null,
            re_name: null,
            re_gender: null,
            re_birth: null,
            re_email: null,
            re_password: null,
            re_avatar: null,
            registerLoading: false,
        }
    }

    goLogin (){
        if(SingleTon.beforeScreen == "first" || SingleTon.beforeScreen == "signup") {
            SingleTon.beforeScreen = "signup";
            NavigationMain.navigate("Login");
        } else {
            NavigationMain.back();
        }
    }

    goToMain (){
        NavigationMain.navigate("Home");
    }

    selectPhotoTapped() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            allowsEditing: true,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = { uri: response.uri };

                // You can also display the image using data:
                let source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatarSource: source,
                    re_avatar: response.data
                });
            }
        });
    }

    handleRegister() {
        if(SingleTon.devicefcm == null) {
            firebase.messaging().getToken()
            .then((token) => {
                SingleTon.devicefcm = token;
            }).catch((error) => {
            });
        }

        if(this.state.re_name === null) {
            alert('Please input full name');
            return false;
        }

        if(this.state.re_email === null) {
            alert('Please input email');
            return false;
        }

        if(this.state.re_gender === null) {
            alert('Please select gender');
            return false;
        }

        if(this.state.re_password === null) {
            alert('Please input password');
            return false;
        }

        if(this.state.re_birth === null) {
            alert('Please input birth');
            return false;
        }

        if(this.state.re_name !== null && this.state.re_email !== null && this.state.re_gender !== null && this.state.re_password !== null && this.state.re_birth !== null) {
            this.setState({
                registerLoading: true,
            });
            const registerUrl = BASE_API_URL+"/api/register";
            var data="";
            if(this.state.re_avatar !== null) {
                data = {
                    name: this.state.re_name,
                    email: this.state.re_email,
                    gender: this.state.re_gender,
                    birth: this.state.re_birth,
                    image: this.state.re_avatar,
                    password: this.state.re_password,
                    device_fcm: SingleTon.devicefcm,
                }
            } else {
                data = {
                    name: this.state.re_name,
                    email: this.state.re_email,
                    gender: this.state.re_gender,
                    birth: this.state.re_birth,
                    password: this.state.re_password,
                    device_fcm: SingleTon.devicefcm,
                }
            }
            AsyncStorage.setItem("loginEmail", this.state.re_email);

            fetch(registerUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    registerLoading: false,
                });

                if(responseJson.result == "success") {
                    AsyncStorage.setItem("loginToken", responseJson.token);
                    SingleTon.currentUser = responseJson.user;

                    this.setState({
                        re_name: null,
                        re_email: null,
                        re_gender: null,
                        re_birth: null,
                        re_avatar: null,
                        re_password: null,
                    });

                    this.goToMain();
                } else if(responseJson.result == "error") {
                    if(responseJson.message.email[0]){
                        Alert.alert(
                            'Error',
                            responseJson.message.email[0],
                            [
                              {text: 'OK', onPress: () => {
                                console.log("delete");
                              }},
                            ],
                            { cancelable: false }
                        );
                    } else {
                        Alert.alert(
                            'Error',
                            'Something went Wrong. Try again',
                            [
                              {text: 'OK', onPress: () => {
                                console.log("delete");
                              }},
                            ],
                            { cancelable: false }
                        );
                    }
                } else {
                    Alert.alert(
                        'Error',
                        'Something went Wrong. Try again',
                        [
                          {text: 'OK', onPress: () => {
                            console.log("delete");
                          }},
                        ],
                        { cancelable: false }
                    );
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        const headerColor = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        });

        const mapWidth = SCREEN_WIDTH - 30;

        return (
            <View style={styles.container}>
                <View style={{
                ...ifIphoneX({
                    height: 35,
                }, {
                    height: 25,
                }),
                width: SCREEN_WIDTH
                }} />
                <Animated.View style={[styles.header, { height: HEADER_EXPANDED_HEIGHT }]}>
                    <Animated.View style={{
                        height: '100%',
                        width: '100%',
                        position: 'absolute',
                        backgroundColor: '#fff',
                        zIndex: 5,
                        opacity: headerColor,}} />
                    <View style={styles.headerImageView} >
                        <FastImage
                        style={styles.headerImage}
                        source={{
                            uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.header_img,
                            headers:{ Authorization: 'backgroundImage' },
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover} />
                        <FastImage
                            style={styles.headerLogoImg}
                            source={{
                                uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.logo_img,
                                headers:{ Authorization: 'backgroundImage' },
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain} />
                    </View>
                </Animated.View>
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event([{ nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.scrollContainer}
                    style={{overflow: 'visible',}}>
                    <Triangle 
                        style={styles.diagonal} 
                        width={SCREEN_WIDTH} 
                        height={50} 
                        color={'#fff'} 
                        direction={'down-left'} 
                    />
                    <View style={styles.userAvatarSelector}>
                        <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
                            <View style={[styles.avatar, styles.avatarContainer]}>
                            { this.state.avatarSource === null ?
                                <Image style={styles.beforeAvatar} source={require('../resources/images/avatar.png')} />
                                :
                                <Image style={styles.avatar} source={this.state.avatarSource} />
                            }
                            </View>
                            <View style={styles.avatarAddIconView} >
                                <Icon style={{fontSize: 22,color: '#fff',}} name="md-add" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{width: '100%', backgroundColor: '#fff', paddingTop: 50}}>
                        <View style={styles.loginInputContainer} >
                            <TextInput
                                placeholder='FULL NAME'
                                placeholderTextColor='#969696'
                                underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({ re_name: text })}
                                style={[styles.loginInputBox, {marginTop: 40}]}
                                />
                            <TextInput
                                placeholder='EMAIL'
                                placeholderTextColor='#969696'
                                underlineColorAndroid={'transparent'}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                onChangeText={(text) => this.setState({ re_email: text })}
                                style={[styles.loginInputBox, {marginTop: 40}]} 
                                />
                                <View style={{position: 'relative', width: '100%', height: 40, marginTop: 40,}}>
                                    <ModalSelector
                                    style={styles.datePickerStyle}
                                    data={[{ key: 0, label: 'Male' },{ key: 1, label: 'Female' }]}
                                    accessible={true}
                                    scrollViewAccessibilityLabel={'Scrollable options'}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option) => { this.setState({gender:option.label, re_gender: option.key})}} >
                                    <TextInput editable={false} style={{color: '#5e5e5e', fontSize: 18}} placeholderTextColor='#969696' placeholder="GENDER" value={this.state.gender} />
                                    </ModalSelector>
                                </View>
                            <TextInput
                                placeholder='PASSWORD'
                                placeholderTextColor='#969696'
                                underlineColorAndroid={'transparent'}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({ re_password: text })}
                                style={[styles.loginInputBox, {marginTop: 40}]}
                                />
                            <View style={{position: 'relative', width: '100%', height: 40, marginTop: 40, marginBottom: 5}}>
                                <DatePicker
                                    style={[styles.datePickerStyle,]}
                                    date={this.state.birthDate}
                                    mode="date"
                                    placeholder="BIRTHDAY"
                                    format="DD/MM/YYYY"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    showIcon={false}
                                    minuteInterval={10}
                                    customStyles={{
                                        dateIcon: {
                                            position: 'absolute',
                                            left: 0,
                                            top: 4,
                                            marginLeft: 0
                                        },
                                        dateInput: {
                                            borderWidth: 0,
                                            alignItems: 'flex-start',
                                            justifyContent: 'center',
                                        },
                                        dateText: {
                                            color: '#666',
                                            fontSize: 18
                                        },
                                        placeholderText: {
                                            fontSize: 18,
                                            color: '#969696'
                                        }
                                    // ... You can check the source to find the other keys.
                                    }}
                                    onDateChange={(date) => {this.setState({birthDate: date, re_birth: date})}}/>
                            </View>
                        </View>
                        <View style={{width: SCREEN_WIDTH, paddingTop: 80,alignItems: 'center', position: 'relative'}}>
                            <TouchableOpacity
                                disabled={this.state.registerLoading}
                                onPress={() => this.handleRegister()}
                                style={[styles.loginBtn, {backgroundColor: this.state.registerLoading? '#a7a7a7': '#4AA0FA'}]} >
                                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 19}} >SIGN UP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.goLogin()} style={{flexDirection: 'row', justifyContent: 'center', marginTop: 30}}>
                                <Text style={{color: '#5e5e5e', fontSize: 16, marginTop: 1}} >Already have an account? </Text>
                                <Text style={{color: '#4AA0FA', fontWeight: 'bold', fontSize: 19}} >LOGIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT-40,
        width: SCREEN_WIDTH,
        elevation: 3,
        paddingBottom: 70,
    },
    header: {
        backgroundColor: '#fff',
        width: SCREEN_WIDTH,
        position: 'absolute',
        top: 0,
        left: 0,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2,},
        shadowOpacity: 0.5,
        shadowRadius: 2,
    },
    headerImageView: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'hidden',
        zIndex: 3,
    },
    headerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    headerLogoImg: {
        position: 'absolute',
        width: 160,
        height: 100,
        top: 20,
    },
    diagonal: {
        marginTop: -50,
    },
    loginInputContainer: {
        marginTop: 10,
        width: SCREEN_WIDTH,
        paddingHorizontal: 30,
        backgroundColor: '#fff',
    },
    loginInputBox: {
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#999',
        fontSize: 18,
        color: '#5e5e5e',
    },
    loginBtn: {
        width: SCREEN_WIDTH-60,
        padding: 20,
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#fff',
        shadowColor: '#4AA0FA',
        shadowOffset: {width: 0, height: 1,},
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 3,
    },
    datePickerStyle: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#999',
    },
    avatarContainer: {
        borderColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    },
    beforeAvatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        resizeMode: 'contain',
    },
    userAvatarSelector: {
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems:'center',
        position: 'absolute',
        top: HEADER_EXPANDED_HEIGHT-130,
        left: 0,
        zIndex: 3,
    },
    avatarAddIconView: {
        position: 'absolute',
        width: 30,
        height: 30,
        backgroundColor: '#4AA0FA',
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        paddingTop: 2,
        paddingLeft: 2,
        bottom: 0,
        right: 25,
    },
});
