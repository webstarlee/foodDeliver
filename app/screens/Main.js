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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CheckBox from 'react-native-check-box'
import {BASE_API_URL, HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT, ITEM_HEIGHT, SCREEN_WIDTH, SCREEN_HEIGHT}  from '../components/StaticValues';
import Loaing from '../components/Loaing';
import * as Animatable from 'react-native-animatable';

export default class Main extends Component {
  constructor() {
    super();

    this.state = {
      scrollY: new Animated.Value(0),
      resourceDatas: [],
      origineDatas: [],
      isloading: true,
      modalVisible: false,
      selectedItem: {},
      cartClicked: false,
    }
  }

  scrollToSection = (index) => {
    this.sectionListRef.scrollToLocation({
      animated: true,
      sectionIndex: index,
      itemIndex: 0,
      viewPosition: 0
    });
  };

  checkExtraSource() {
    console.log("asdfasd");
  }

  getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  renderItem = ({item, section}) => {
    return (
      <TouchableOpacity style={styles.itemButtonView} onPress={()=>this.setState({modalVisible: true, selectedItem: item})}>
        <View style={{flex: 1, paddingRight: 10}}>
          <Text style={{fontSize: 15,fontWeight: 'bold',marginBottom: 6}}>{item.title}</Text>
          <Text style={{fontSize: 14}}>{item.description}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.itemPriceButtn} ><Text style={{color: '#fff'}} >€ {item.price}</Text></TouchableOpacity>
          <Image
            style={{width: 80, height: 80, resizeMode: "cover"}}
            source={{uri: item.image}} />
        </View>
      </TouchableOpacity>
    )
  }

  renderSectionHeader = ({section}) => {
    return (
      <View style={styles.itemCatalogView}>
        <Image
          style={{width: '100%', height: 70, resizeMode: "cover"}}
          source={{uri: section.catalog.image}}
        />
        <View style={styles.itemCatalogTextView} >
          <Text style={{fontSize: 20,fontWeight: 'bold',marginBottom: 5,}}>{section.catalog.title}</Text>
          <Text>{section.catalog.body}</Text>
        </View>
      </View>
    )
  }

  renderCatalog = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.catelogButton} onPress={() => this.scrollToSection(index)} >
        <Text>{item.catalog.title}</Text>
      </TouchableOpacity>
    )
  }

  renderExtraSource = ({item}) => {
    return (
      <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
        <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={() => this.checkExtraSource()}
        checkBoxColor={'#4AA0FA'}
        rightText={item.name} />
        <Text style={{paddingRight: 8}}>+€ {item.price}</Text>
      </View>
    )
  }

  componentWillmount() {
    this.mounted = true;
  }

  componentDidMount() {
    this.mounted = true;
    
    const url = BASE_API_URL+'/api/catalog/1';
    
    fetch(url)
    .then((response) => response.json())
    .then((responseJson) => {
      if(this.mounted) {
        this.setState({
          resourceDatas: responseJson,
          origineDatas: responseJson,
          isloading: false,
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  componentWillUnmount() {
		this.mounted = false;
  }

  searchData(text){
    console.log(text);
    var searchedData = [];
    for (const section of this.state.origineDatas) {
      var foods = [];
      for (const food of section.data) {
        if(food.title.toLowerCase().includes(text.toLowerCase())){
          foods.push(food)
        }
      }
      if(foods.length > 0) searchedData.push({
        catalog: section.catalog,
        data: foods
      })
    }
    this.setState({
      resourceDatas: searchedData
    })
  }

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });

    const imageBlur = this.state.scrollY.interpolate({
      inputRange: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      outputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 2, 3, 4, 5],
      extrapolate: 'clamp'
    })

    return (
      this.state.isloading?
      <Loaing />
      :
      <View style={styles.container}>
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          <View style={styles.headerImageView} >
            <Animated.Image style={styles.headerImage} source={{uri: BASE_API_URL+'/storage/main_images/header.png'}} blurRadius={imageBlur} />
            <Image style={styles.headerOverlayImage} source={require('../resources/images/overlay.png')} />
            <TextInput placeholder='Searchable' underlineColorAndroid={'transparent'} placeholderTextColor='#fff' style={styles.headerSearch} onChangeText={(text)=>this.searchData(text)}/>
          </View>
          <View style={styles.categoryContainer} >
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.resourceDatas}
              renderItem={this.renderCatalog}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Animated.View>
        <SectionList
          ref={ref => (this.sectionListRef = ref)}
          contentContainerStyle={styles.scrollContainer}
          onScroll={Animated.event(
            [{ nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY
                }
              }
            }])
          }
          scrollEventThrottle={16}
          stickySectionHeadersEnabled={false}
          sections={this.state.resourceDatas}
          renderItem={this.renderItem}
          renderSectionHeader={this.renderSectionHeader}
          keyExtractor={(item, index) => index}
          getItemLayout={this.getItemLayout}
        />
        <Animatable.View transition={['top','left','rotate']} style={this.state.cartClicked? styles.cartFlastButtonClicked: styles.cartFlastButton} >
          <TouchableOpacity style={{flex: 1, borderRadius: 40, overflow: 'hidden'}} onPress={() => this.setState({cartClicked: this.state.cartClicked? false: true })}>
            <Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.basketImg} source={require('../resources/images/basket.png')} />
            <View style={{
              flex: 1,
              transform: [
                {rotate: '-13deg'}
              ],
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingBottom: 10,
            }}>
              <Text style={{color: '#4AA0FA', marginBottom: 5,}}>12</Text>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>€12.50</Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.cartModalContainerView}>
            <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: false})}><View style={styles.cartModalOlverlay} /></TouchableWithoutFeedback>
            <View style={styles.cartModalView}>
              <TouchableOpacity style={styles.modalcloseButton} onPress={() => this.setState({modalVisible: false})} ><Icon name="md-close" style={styles.modalcloseButtonIcon} ></Icon></TouchableOpacity>
              <View>
                {this.state.modalVisible && this.state.selectedItem.extras.length > 0?
                  <FlatList
                    data={this.state.selectedItem.extras}
                    renderItem={this.renderExtraSource}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  :
                  <View style={{alignItems:'center'}}><Text>Extra source not found</Text></View>
                }
              </View>
              <TouchableOpacity style={styles.addtocartButton}>
                <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}} >ADD TO CART</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  basketImg: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: 10,
    left: 15,
    resizeMode: 'contain',
  },
  cartFlastButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4AA0FA',
    top: HEADER_COLLAPSED_HEIGHT-10,
    left: SCREEN_WIDTH-110,
    zIndex: 10001,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  cartFlastButtonClicked: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4AA0FA',
    ...ifIphoneX({
      top: 40,
    }, {
      top: 30,
    }),
    left: 30,
    zIndex: 10001,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    transform: [
      {rotate: '13deg'}
    ]
  },
  modalcloseButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  modalcloseButtonIcon: {
    color: '#4AA0FA',
    fontSize: 35,
    shadowColor: '#4AA0FA',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  addtocartButton: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#4AA0FA',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 1,
    marginTop: 15,
  },
  cartModalContainerView: {
    flex:1,
    paddingTop: SCREEN_HEIGHT/8,
    alignItems: 'center',
    position: 'relative',
  },
  cartModalOlverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#fff',
    opacity: 0.8,
  },
  cartModalView: {
    position: 'relative',
    width: SCREEN_WIDTH*4/5,
    backgroundColor: '#fff',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 60,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemCatalogView: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.6,
    shadowRadius: 1,
    marginVertical: 10,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  itemCatalogTextView: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  itemButtonView: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0,},
    shadowOpacity: 0.6,
    shadowRadius: 1,
    borderRadius: 1,
    backgroundColor: '#fff',
    marginVertical: 3,
  },
  itemPriceButtn: {
    width: 80,
    paddingVertical: 8,
    backgroundColor: '#4AA0FA',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0,},
    shadowOpacity: 0.6,
    shadowRadius: 1,
  },
  headerImageView: {
    flex: 1,
    alignItems: 'center',
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
  headerSearch: {
    fontSize: 12,
    borderBottomColor: '#ededed',
    borderBottomWidth: 2,
    height: 30,
    width: 180,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal:5,
    ...ifIphoneX({
      marginTop: 40,
    }, {
      marginTop: 30,
    }),
  },
  categoryContainer: {
    height: 40,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -1,},
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  catelogButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 3,
    borderRadius: 3,
    justifyContent: 'center',
  },
  scrollContainer: {
    padding: 5,
    paddingTop: HEADER_EXPANDED_HEIGHT,
    paddingBottom: 15,
  },
  header: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: SCREEN_WIDTH,
    top: 0,
    left: 0,
    zIndex: 9998
  },
  title: {
    marginVertical: 16,
    color: "black",
    fontWeight: "bold",
    fontSize: 24
  }
});