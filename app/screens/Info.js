import React, { Component } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  BASE_API_URL,
  HEADER_EXPANDED_HEIGHT,
  HEADER_COLLAPSED_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from '../components/StaticValues';
import Loaing from '../components/Loading';
import SingleTon from "../components/SingleTon";
import HTMLView from 'react-native-htmlview';
import GoogleStaticMap from 'react-native-google-static-map';
import { ifIphoneX } from 'react-native-iphone-x-helper';

export default class Info extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
      imageBlur: 0,
      resInfo: null,
      isloading: true,
    }
    if(SingleTon.isShowTab) {
      SingleTon.isShowTab.setState({isShowTabbar: true});
    }
  }

  componentDidMount() {
    const restaurantInfourl = BASE_API_URL+'/api/storeinfo/1/storeinfo';

    if(SingleTon.restaurantInfo != null) {
      this.setState({
        resInfo: SingleTon.restaurantInfo,
        isloading: false,
      })
    } else {
      fetch(restaurantInfourl)
      .then((response) => response.json())
      .then((responseJson) => {
        SingleTon.restaurantInfo = responseJson.data;
        this.setState({
          isloading: false,
          resInfo: responseJson.data,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  backImgBlur(event) {
    var currentBlur = event.nativeEvent.contentOffset.y/12;
    if(currentBlur < this.state.imageBlur || this.state.imageBlur < 10) {
      this.setState({
        imageBlur: currentBlur
      });
      this.imageBlurRef.setNativeProps({blurRadius: this.state.imageBlur});
      // console.log(this.state.imageBlur);
    }
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT-20, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });

    const headerColor = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    const mapWidth = SCREEN_WIDTH - 30;

    return (
      this.state.isloading?
      <View style={{
        flex: 1,
        backgroundColor: '#fff',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
      }} ><Loaing color={'#000'}/></View>
      :
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
            opacity: headerColor,
          }} />
          <View style={styles.headerImageView} >
            <Image ref={(ref) => this.imageBlurRef = ref} style={styles.headerImage} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.header_img}} blurRadius={0} />
            <Image style={styles.headerOverlayImage} source={require('../resources/images/overlay.png')} />
          </View>
        </Animated.View>
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: {contentOffset: {y: this.state.scrollY}}}])}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContainer}>
          <View style={{
            backgroundColor: '#fff',
            marginTop: 5,
            paddingLeft: 5,
            paddingRight: 5,
            paddingBottom: 15,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -2,},
            shadowOpacity: 0.4,
            shadowRadius: 2,
            elevation: 3,
            }} >
            <View style={[styles.defaultView, {backgroundColor: '#f5f5f5'}]}>
              <HTMLView
                value={this.state.resInfo.message}
                StyleSheet={htmlStyles}
              />
            </View>
            <View style={styles.defaultView}>
              <Text style={{fontWeight: 'bold', marginBottom: 10,}} >{this.state.resInfo.storeName}</Text>
              <View style={{width: '100%'}}>
                <GoogleStaticMap
                  style={{width: '100%', height: 200}}
                  latitude={this.state.resInfo.latitude.toString()}
                  longitude={this.state.resInfo.longitude.toString()}
                  zoom={17}
                  size={{ width: mapWidth, height: 200 }}
                  apiKey={'AIzaSyApTWJ2H7KF81Ctr0tSQpHa1Hjzk7CdghY'}
                />
              </View>
              <View style={{marginTop: 10,}}>
                <Text style={{color: '#505050', fontWeight: 'bold', fontSize: 16, marginBottom: 5,}} >Address</Text>
                <Text>{this.state.resInfo.street}</Text>
                <Text>{this.state.resInfo.postalZip}</Text>
                <Text>{this.state.resInfo.city}</Text>
              </View>
            </View>
            <View style={styles.defaultView}>
              <Text style={{color: '#505050', fontWeight: 'bold', fontSize: 16, marginBottom: 5,}}>Opening Times</Text>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Monday</Text>
                <Text>{this.state.resInfo.monday}</Text>
              </View>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Tuesday</Text>
                <Text>{this.state.resInfo.tuesday}</Text>
              </View>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Wednesday</Text>
                <Text>{this.state.resInfo.wednesday}</Text>
              </View>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Thursday</Text>
                <Text>{this.state.resInfo.thursday}</Text>
              </View>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Friday</Text>
                <Text>{this.state.resInfo.friday}</Text>
              </View>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Saturday</Text>
                <Text>{this.state.resInfo.saturday}</Text>
              </View>
              <View style={styles.openingTime}>
                <Text style={{fontWeight: 'bold'}}>Sunday</Text>
                <Text>{this.state.resInfo.sunday}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  openingTime: {
    flexDirection: 'row',
    width: 200,
    justifyContent: 'space-between',
    paddingVertical: 2
  },
  defaultView: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
    backgroundColor: '#fff',
    marginVertical: 6,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingTop: HEADER_EXPANDED_HEIGHT-45,
    width: SCREEN_WIDTH,
    elevation: 3,
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
    resizeMode: 'cover',
    position: 'absolute'
  },
  headerOverlayImage: {
    position: 'absolute',
    height: 100,
    top: -1,
    flex: 1,
    resizeMode: 'contain',
  },
});

const htmlStyles = StyleSheet.create({
  span: {
    fontWeight: 'bold',
    fontSize: 23,
  }
})
