import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  SectionList,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  BASE_API_URL,
  HEADER_EXPANDED_HEIGHT,
  HEADER_COLLAPSED_HEIGHT,
  ITEM_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from '../components/StaticValues';
import Loaing from '../components/Loading';
import SingleTon from "../components/SingleTon";
import HTMLView from 'react-native-htmlview';

export default class Info extends Component {
  constructor() {
    super();
    this.state = {
      scrollY: new Animated.Value(0),
      imageBlur: 0,
      resInfo: null,
      isloading: true,
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
    var currentBlur = event.nativeEvent.contentOffset.y/20;
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
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });

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
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <View style={styles.headerImageView} >
            <Image ref={(ref) => this.imageBlurRef = ref} style={styles.headerImage} source={{uri: BASE_API_URL+'/storage/main_images/header.png'}} blurRadius={0} />
            <Image style={styles.headerOverlayImage} source={require('../resources/images/overlay.png')} />
          </View>
        </Animated.View>
        <ScrollView
          ref={ref => (this.infoListRef = ref)}
          contentContainerStyle={styles.scrollContainer}
          onScroll={
            Animated.event( 
              [{ nativeEvent: { 
                  contentOffset: { 
                    y: this.state.scrollY 
                  }
                } 
              }],{listener: (event) => this.backImgBlur(event)},)
          }
          scrollEventThrottle={16}>
            <View style={styles.defaultView}>
              <HTMLView
                value={this.state.resInfo.message}
                StyleSheet={htmlStyles}
              />
            </View>
            <View style={styles.defaultView}>
              <Text style={{fontWeight: 'bold'}} >{this.state.resInfo.storeName}</Text>
              <View style={{width: '100%', height: 300}}>
              </View>
              <View>
                <Text style={{color: '#505050', fontWeight: 'bold', fontSize: 16, marginBottom: 5,}} >Address</Text>
                <Text>{this.state.resInfo.street}</Text>
                <Text>{this.state.resInfo.city}</Text>
              </View>
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultView: {
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.4,
    shadowRadius: 2,
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
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 15,
    paddingTop: HEADER_EXPANDED_HEIGHT,
    width: SCREEN_WIDTH,
  },
  header: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 9998
  },
  headerImageView: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
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