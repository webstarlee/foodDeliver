import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {BASE_API_URL, ITEM_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT}  from './StaticValues';
import LinearGradient from 'react-native-linear-gradient';
import SingleTon from "./SingleTon";
import firebase from 'react-native-firebase';
import NavigationMain from "./NavigationMain";
import NavigationHome from "./NavigationService";
import Icon from 'react-native-vector-icons/Ionicons';

export default class SideMenu extends Component {
  constructor() {
    super();
    this.state ={
      isBadge: false,
      badgeNumber: 0,
    }

    SingleTon.push = this;
  }

  componentDidMount() {
    console.log(SingleTon.currentUser);
    AsyncStorage.getItem('loginToken')
    .then((val) => {
        const badgeFetchUrl = BASE_API_URL+'/api/getbadgeNumber';
        return fetch(badgeFetchUrl,{
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
        if(responseJson.result === "success") {
          this.setState({
            isBadge: true,
            badgeNumber: responseJson.number,
          })

          if(SingleTon.isShowTab) {
            SingleTon.isShowTab.setState({
                isBadge: true,
                badgeNumber: responseJson.number,
            });
          }
        }
    })
    .catch((error) => {
        console.log(error);
    });
  }

  handleLogout() {
    AsyncStorage.removeItem('loginToken');
    NavigationMain.navigate("Before");
  }

  goToPushhistory() {
    SingleTon.sideMenu.close();
    NavigationHome.navigate('Pushhistory');
  }

  render() {
    return (
      <LinearGradient colors={['#4abafa', '#0071b1']} style={styles.container}>
        <View style={styles.sideMenuContentContainer} >
          <View style={{position: 'relative', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{width: '100%', paddingHorizontal: 20}}>
              <Image style={styles.sideMenuLogo} source={{uri: SingleTon.currentUser.avatar_url}} />
              <View>
                <View
                  style={{
                    borderBottomColor: '#fff',
                    borderBottomWidth: 1,
                    paddingTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',}}>
                  <Text style={{color: '#fff', fontSize: 22, fontWeight: 'bold'}}>Name: {SingleTon.currentUser.name}</Text>
                </View>
                <View style={{paddingTop: 20,}}>
                  <TouchableOpacity style={styles.sidemenuButton}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="ios-contact" style={{width: 20,marginRight: 10,color: '#fff', fontSize: 23}} />
                      <Text style={{color: '#fff', fontSize: 18}}>Profile</Text>
                    </View>
                    <Icon name="ios-arrow-forward" style={{marginRight: 10,color: '#fff', fontSize: 25}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sidemenuButton} onPress={() => this.goToPushhistory()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="md-notifications" style={{width: 20, marginRight: 10,color: '#fff', fontSize: 23}} />
                      <Text style={{color: '#fff', fontSize: 18}}>Push History</Text>
                      {this.state.isBadge&&
                        <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: '#ee2121', justifyContent: 'center', alignItems: 'center', marginLeft: 5, marginTop: 5}}>
                          <Text style={{color: '#fff', fontSize: 15}}>{this.state.badgeNumber}</Text>
                        </View>
                      }
                    </View>
                    <Icon name="ios-arrow-forward" style={{marginRight: 10,color: '#fff', fontSize: 25}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sidemenuButton} >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="md-pizza" style={{width: 20, marginRight: 10,color: '#fff', fontSize: 23}} />
                      <Text style={{color: '#fff', fontSize: 18}}>Order History</Text>
                    </View>
                    <Icon name="ios-arrow-forward" style={{marginRight: 10,color: '#fff', fontSize: 25}} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sidemenuButton} onPress={() => this.handleLogout()}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon name="md-log-out" style={{width: 20,marginRight: 10,color: '#fff', fontSize: 23}} />
                      <Text style={{color: '#fff', fontSize: 18}}>Logout</Text>
                    </View>
                    <Icon name="ios-arrow-forward" style={{marginRight: 10,color: '#fff', fontSize: 25}} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a9c86',
    position: 'relative',
  },
  sideMenuContentContainer: {
    width: SCREEN_WIDTH*0.7,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    padding: 10,
    paddingTop: 50,
    flex: 1,
  },
  sideMenuLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    top: -110,
    left: 20,
  },
  backgroundBlurBehind: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0278bb',
  },
  backgroundBlur: {
    position: 'absolute',
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderColor: '#0278bb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 3,
    overflow: 'hidden',
  },
  sidemenuButton: {
    paddingVertical: 5,
    marginVertical: 5,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
