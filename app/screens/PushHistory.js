import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  FlatList,
} from 'react-native';
import {
    BASE_API_URL,
    SCREEN_WIDTH,
}  from '../components/StaticValues';
import { SkypeIndicator } from 'react-native-indicators';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Ionicons';
import SingleTon from "../components/SingleTon";
import NavigationHome from "../components/NavigationService";
import firebase from 'react-native-firebase';

export default class PushHistory extends Component {
    constructor() {
        super();
        this.state=({
            isloading: true,
            pushData: null,
        });
        if(SingleTon.isShowTab) {
            SingleTon.isShowTab.setState({isShowTabbar: false});
        }
    }

    componentDidMount() {
        SingleTon.showPush = false;

        AsyncStorage.getItem('loginToken')
        .then((val) => {
            const historyFetchUrl = BASE_API_URL+'/api/getpushhistory';
            return fetch(historyFetchUrl,{
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '+val
                }
            });
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            setTimeout(function() {
                this.setState({
                    pushData: responseJson.data,
                    isloading: false
                });
            }.bind(this), 500)
        })
        .catch((error) => {
            console.log(error);
        });

        AsyncStorage.getItem('loginToken')
        .then((val) => {
            const badgeResetUrl = BASE_API_URL+'/api/clearBadge';
            return fetch(badgeResetUrl,{
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer '+val
                }
            });
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            firebase.notifications().setBadge(0);
            if(SingleTon.push) {
                SingleTon.push.setState({
                    isBadge: false,
                    badgeNumber: 0,
                });
            }
            if(SingleTon.isShowTab) {
                SingleTon.isShowTab.setState({
                    isBadge: false,
                    badgeNumber: 0,
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    goToBack() {
        if(SingleTon.isShowTab) {
            SingleTon.isShowTab.setState({isShowTabbar: true});
        }

        if(SingleTon.isOpenTab) {
            SingleTon.sideMenu.open();
        }
        SingleTon.isOpenTab = false;
        NavigationHome.back();
    }

    renderHistoryData = ({item, index}) => {
        return (
            <View style={styles.historyTextView}>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>{item.msg_title}</Text>
                <Text style={{color: '#fff', fontSize: 15}}>{item.msg_text}</Text>
                <View style={{width: '100%', alignItems: 'flex-end'}} >
                    <Text style={{color: '#fff', fontSize: 12}}>{item.msg_time}</Text>
                </View>
            </View>
        )
    }

    renderHistory = ({item, index}) => {
        return (
            <View style={{width: '100%',paddingHorizontal: 20, paddingVertical: 5, alignItems: 'center', marginTop: 5}}>
                <View style={styles.historyDateView} >
                    <Text style={{color: '#fff', fontSize: 17}} >{item.date}</Text>
                </View>
                <FlatList
                    style={{flex: 1,width: '100%'}}
                    data={item.data}
                    renderItem={this.renderHistoryData}
                    keyExtractor={(item, index) => index.toString()}/>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.viewHeader}>
                    <Text style={{fontSize: 26, color: '#4AA0FA'}} >Push History</Text>
                </View>
                {this.state.isloading?
                    <View style={{width:SCREEN_WIDTH, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <SkypeIndicator count={5} size={50} color='#4AA0FA' />
                    </View>
                :
                    this.state.pushData.length == 0?
                        <View style={{flex: 1, paddingTop: 50,}}><Text style={{fontSize: 20}} >Empty History</Text></View>
                    :
                        <FlatList
                            style={{flex: 1,width: SCREEN_WIDTH,}}
                            data={this.state.pushData}
                            contentContainerStyle={{paddingTop: 20,}}
                            renderItem={this.renderHistory}
                            keyExtractor={(item, index) => index.toString()}/>
                }
                <View style={styles.pushHistoryFooter}>
                    <TouchableOpacity onPress={() => this.goToBack()} style={{width: SCREEN_WIDTH, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}} >
                        <Icon name="ios-arrow-back" style={{color: '#4AA0FA',fontSize: 28, paddingTop: 3}} />
                        <Text style={{color: '#4AA0FA', fontSize: 18}}>&nbsp; BACK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    historyDateView: {
        padding: 5,
        backgroundColor: '#4AA0FA',
        borderRadius: 5,
        marginBottom: 5,
        shadowColor: '#666',
        shadowOffset: {width: 0, height: 2,},
        shadowOpacity: 0.9,
        shadowRadius: 1,
        elevation: 3,
    },
    historyTextView: {
        backgroundColor: '#4AA0FA',
        padding: 10,
        marginTop: 15,
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        shadowColor: '#666',
        shadowOffset: {width: 0, height: 2,},
        shadowOpacity: 0.9,
        shadowRadius: 1,
        elevation: 3,
    },
    viewHeader: {
        width: SCREEN_WIDTH,
        alignItems: 'center',
        paddingBottom: 10,
        ...ifIphoneX({
            paddingTop: 50,
        }, {
            paddingTop: 40,
        }),
        backgroundColor: '#fff',
        shadowColor: '#4AA0FA',
        shadowOffset: {width: 0, height: 1,},
        shadowOpacity: 0.6,
        shadowRadius: 3,
        elevation: 3,
    },
    pushHistoryFooter: {
        width: SCREEN_WIDTH,
        backgroundColor: '#fff',
        ...ifIphoneX({
            height: 65,
            paddingBottom: 15,
        }, {
            height: 50,
        }),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1,},
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 3,
        borderTopWidth: 1,
        borderTopColor: '#4AA0FA',
    },
})