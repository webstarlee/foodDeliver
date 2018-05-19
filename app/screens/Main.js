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
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CheckBox from 'react-native-check-box'
import {
  BASE_API_URL,
  HEADER_EXPANDED_HEIGHT,
  HEADER_COLLAPSED_HEIGHT,
  ITEM_HEIGHT,
  SCREEN_WIDTH,
  SCREEN_HEIGHT}  from '../components/StaticValues';
import Loaing from '../components/Loading';
import * as Animatable from 'react-native-animatable';
import Utils from "@utils";

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
      currentCartItemBumber: 0,
      currentCartItemPrice: 0,
      totalCarList: [],
      selectedProductForCart: {},
      checkedExtra: {},
      checkOutModalVisible: false,
    }
  }

  handleViewRef = ref => this.flatview = ref;
//component mount part
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
//end

//render part
  //render senction list item
  renderItem = ({item, section}) => {
    return (
      <TouchableOpacity style={styles.itemButtonView} onPress={()=>this.selectItemForCart(item)}>
        <View style={{flex: 1, paddingRight: 10}}>
          <Text style={{fontSize: 15,fontWeight: 'bold',marginBottom: 6}}>{item.title}</Text>
          <Text style={{fontSize: 14}}>{item.description}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.itemPriceButtn} onPress={()=>this.selectItemForCart(item)} ><Text style={{color: '#fff'}} >€ {item.price}</Text></TouchableOpacity>
          <Image
            style={{width: 80, height: 80, resizeMode: "cover"}}
            source={{uri: item.image}} />
        </View>
      </TouchableOpacity>
    )
  }
  //end

  //render section list header
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
  //end

  //render catalog touchbutton of top horizontalscroll
  renderCatalog = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.catelogButton} onPress={() => this.scrollToSection(index)} >
        <Text>{item.catalog.title}</Text>
      </TouchableOpacity>
    )
  }
  //end

  //render extrasource list when click one food appear pop up
  renderExtraSource = ({item, index}) => {
    return (
      <View style={{flex:1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',}}>
        <CheckBox
        style={{flex: 1, padding: 10}}
        onClick={() => this.checkExtraSource(index)}
        checkBoxColor={'#4AA0FA'}
        rightText={item.name} />
        <Text style={{paddingRight: 8}}>+€ {item.price}</Text>
      </View>
    )
  }
  //end

  //render checkout list when click flat checkout button
  renderCheckOutList = ({item, index}) => {

    var finalFoodPrice = 0;

    var price = 0;
    price = price + parseFloat(item.price);
    for (const extra of item.extras) {
      price = price + parseFloat(extra.price);
    }

    finalFoodPrice += price*item.count;
    return (
      <View style={styles.checkOutSingleListContainer}>
        <View style={{paddingBottom: 10, flex: 1, flexDirection: 'row'}} >
          <View style={{flex: 1, flexDirection: 'row'}} >
            <TouchableOpacity onPress={() => this.decreaseFoodNumber(index)} style={styles.checkoutFoodNumberArrowButton} >
              <Icon style={{color: '#b3b0b0', fontSize: 25}} name="ios-arrow-dropleft-circle-outline"/>
            </TouchableOpacity>
            <Text style={{fontSize: 18, paddingHorizontal: 8,color: '#676767', paddingTop: 3,}} >{item.count}</Text>
            <TouchableOpacity onPress={() => this.increaseFoodNumber(index)} style={styles.checkoutFoodNumberArrowButton} >
              <Icon style={{color: '#b3b0b0', fontSize: 25}} name="ios-arrow-dropright-circle-outline"/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.removeOneFood(index)} style={styles.checkoutFoodNumberArrowButton} >
            <Icon style={{color: '#b3b0b0', fontSize: 25}} name="md-close"/>
          </TouchableOpacity>
        </View>
        <View style={{paddingBottom: 10, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} >
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#676767'}} >{item.title}</Text>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#676767'}}>€{finalFoodPrice.toFixed(2)}</Text>
        </View>
        {item.extras.length > 0 &&
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}} >
            <Text style={{fontSize: 13, color: '#b3b0b0'}} >
              {item.extras.map((extra)=>extra.name+", ")}
            </Text>
          </View>
        }
      </View>
    )
  }
  //end

  //set static value of section list item height as virtual to calculate scroll to section
  getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });
  //end

  bounce = () => this.flatview.bounce(1000).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
  jello = () => this.flatview.jello(1000).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
//end

//function part
  //when select one food from the section list
  selectItemForCart(item) {
    if(item.extras.length > 0) {
      this.setState({
        modalVisible: true,
        selectedItem: item,
        selectedProductForCart: {
          count: 1,
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          discount: item.discount,
          image: item.image,
        },
      });
    } else {
      this.bounce();

      var singleProductForCart = {
        count: 1,
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        discount: item.discount,
        image: item.image,
        extras: [],
      }

      console.log(singleProductForCart)

      var totalCartArray = this.state.totalCarList;//get of your total carted food with all extra

      var finalMatchCheck = 0;

      var i = 0;
      var totalCartedNumber = 0;

      for (const food of totalCartArray) {
        if(food.id == singleProductForCart.id && food.extras.length == singleProductForCart.extras.length) {
          var isExtraMatched = true
          for (const gotExtra of singleProductForCart.extras) {
            var sameExtra = food.extras.find(function(element) {
              return element.id == gotExtra.id;
            });
            if(sameExtra == null){
              isExtraMatched = false
              break
            }
          }
          if (isExtraMatched) {
            totalCartArray[i].count += 1;
            finalMatchCheck += 1;
          }
        }
        totalCartedNumber += totalCartArray[i].count;
        i ++;
      }

      if(finalMatchCheck == 0) {
        totalCartArray.push(singleProductForCart);//add new food to existing cart list
        totalCartedNumber += 1;
      }

      console.log(totalCartArray);

      // var cartNumber = totalCartArray.length;//get total cart food amount of kind

      var totalPrice = 0;//set initial price to 0

      //calculate all price of food and extra source
      for (const product of totalCartArray) {
        var price = 0;
        price = price + parseFloat(product.price);
        for (const extra of product.extras) {
          price = price + parseFloat(extra.price);
        }

        totalPrice += price*product.count;
      }


      //set totalcart list and set empty of selected food, extra source, cart number and total price etc
      this.setState({
        totalCarList: totalCartArray,
        modalVisible: false,
        selectedItem: {},
        checkedExtra: {},
        selectedProductForCart: {},
        currentCartItemBumber: totalCartedNumber,
        currentCartItemPrice: totalPrice.toFixed(2),
      });
    }
  }
  //end

  //function when click extra source check box
  checkExtraSource(index) {
    var currentExtra = this.state.checkedExtra;
    if(currentExtra[index] == null){
      currentExtra[index] = this.state.selectedItem.extras[index]
    }else{
      delete currentExtra[index]
    }
    this.setState({
      checkedExtra: currentExtra
    })
  }
  //end

  //function when click close cart detail pop up view
  closeCartDetail() {
    this.setState({
      modalVisible: false,
      selectedItem: {},
      checkedExtra: {},
      selectedProductForCart: {}
    })
  }
  //end

  //function when click add to cart button
  addToCart() {
    this.bounce();

    var singleProductForCart = this.state.selectedProductForCart;//get all data of selected food food and extra source etc

    singleProductForCart["extras"] = Object.values(this.state.checkedExtra);//add extra source to the existing products

    console.log(this.state.selectedProductForCart);

    var totalCartArray = this.state.totalCarList;//get of your total carted food with all extra

    var finalMatchCheck = 0;

    var i = 0;
    var totalCartedNumber = 0;

    for (const food of totalCartArray) {
      if(food.id == singleProductForCart.id && food.extras.length == singleProductForCart.extras.length) {
        var isExtraMatched = true
        for (const gotExtra of singleProductForCart.extras) {
          var sameExtra = food.extras.find(function(element) {
            return element.id == gotExtra.id;
          });
          if(sameExtra == null){
            isExtraMatched = false
            break
          }
        }
        if (isExtraMatched) {
          totalCartArray[i].count += 1;
          finalMatchCheck += 1;
        }
      }
      totalCartedNumber += totalCartArray[i].count;
      i ++;
    }

    if(finalMatchCheck == 0) {
      totalCartArray.push(this.state.selectedProductForCart);//add new food to existing cart list
      totalCartedNumber += 1;
    }

    console.log(totalCartArray);

    // var cartNumber = totalCartArray.length;//get total cart food amount of kind

    var totalPrice = 0;//set initial price to 0

    //calculate all price of food and extra source
    for (const product of totalCartArray) {
      var price = 0;
      price = price + parseFloat(product.price);
      for (const extra of product.extras) {
        price = price + parseFloat(extra.price);
      }

      totalPrice += price*product.count;
    }

    //set totalcart list and set empty of selected food, extra source, cart number and total price etc
    this.setState({
      totalCarList: totalCartArray,
      modalVisible: false,
      selectedItem: {},
      checkedExtra: {},
      selectedProductForCart: {},
      currentCartItemBumber: totalCartedNumber,
      currentCartItemPrice: totalPrice.toFixed(2),
    });
  }
  //end

  //function when search
  searchData(text){
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
  //end

  //function when click close button of checkout overview pop up
  colseCheckOutDetail() {
    this.setState({
      cartClicked: this.state.cartClicked? false: true,
      checkOutModalVisible: this.state.checkOutModalVisible? false: true
    })
  }
  //end

  //function when click header catalog button
  scrollToSection = (index) => {
    this.sectionListRef.scrollToLocation({
      animated: true,
      sectionIndex: index,
      itemIndex: 0,
      viewPosition: 0
    });
  };
  //end

  //function when click delete btn from the checkout view
  removeOneFood(index) {
    Alert.alert(
      'Alert',
      'Are you Sure ?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes Delete', onPress: () => {
          this.jello();
          var totalCartedList = this.state.totalCarList;
          totalCartedList.splice(index, 1);
          this.setState({
            totalCarList: totalCartedList
          });
          this.resetFoodNumPrice();
        }},
      ],
      { cancelable: false }
    )
  }
  //end

  //function to reset the food numer and price
  resetFoodNumPrice() {
    var totalCartArray = Utils.copy(this.state.totalCarList);
    var totalPrice = 0;
    var totalNumber = 0;
    for (const product of totalCartArray) {
      var price = 0;
      price = price + parseFloat(product.price);
      for (const extra of product.extras) {
        price = price + parseFloat(extra.price);
      }

      totalPrice += price*product.count;
      totalNumber += product.count;
    }

    this.setState({
      currentCartItemBumber: totalNumber,
      currentCartItemPrice: totalPrice.toFixed(2),
    });
  }
  //end

  //function when click decrease button from the checkout view
  decreaseFoodNumber(index) {
    var totalCartedList = Utils.copy(this.state.totalCarList);
    var currentNumber = totalCartedList[index].count;
    currentNumber -= 1;
    if(currentNumber <= 0) {
      this.removeOneFood(index);
    } else {
      this.jello();
      totalCartedList[index].count = currentNumber;

      var totalPrice = 0;
      var totalNumber = 0;

      for (const product of totalCartedList) {
        var price = 0;
        price = price + parseFloat(product.price);
        for (const extra of product.extras) {
          price = price + parseFloat(extra.price);
        }
  
        totalPrice += price*product.count;
        totalNumber += product.count;
      }

      this.setState({
        totalCarList: totalCartedList,
        currentCartItemBumber: totalNumber,
        currentCartItemPrice: totalPrice.toFixed(2),
      });
    }
  }
  //end

  //function when click decrease button from the checkout view
  increaseFoodNumber(index) {
    this.jello();
    var totalCartedList = Utils.copy(this.state.totalCarList);
    var currentNumber = totalCartedList[index].count;
    currentNumber += 1;

    totalCartedList[index].count = currentNumber;

    var totalPrice = 0;
    var totalNumber = 0;

    for (const product of totalCartedList) {
      var price = 0;
      price = price + parseFloat(product.price);
      for (const extra of product.extras) {
        price = price + parseFloat(extra.price);
      }

      totalPrice += price*product.count;
      totalNumber += product.count;
    }

    this.setState({
      totalCarList: totalCartedList,
      currentCartItemBumber: totalNumber,
      currentCartItemPrice: totalPrice.toFixed(2),
    });
  }
  //end
//end

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });

    const imageBlur = this.state.scrollY.interpolate({
      inputRange: [0, 0],
      outputRange: [0, 5],
      extrapolate: 'clamp'
    })

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
          <TouchableOpacity  style={{flex: 1, borderRadius: 40,}} onPress={() => this.setState({cartClicked: this.state.cartClicked? false: true, checkOutModalVisible: this.state.checkOutModalVisible? false: true })}>
            <Animatable.View style={styles.cartFlatButtonView} ref={this.handleViewRef}>
              <Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.basketImg} source={require('../resources/images/basket.png')} />
              <Animatable.View style={{
                flex: 1,
                transform: [
                  {rotate: '-13deg'}
                ],
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 10,
              }}>
                <Text style={{color: '#4AA0FA', marginBottom: 5,}}>{this.state.currentCartItemBumber}</Text>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>€{this.state.currentCartItemPrice}</Text>
              </Animatable.View>
            </Animatable.View>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View transition={['opacity','scale', 'borderRadius']} style={this.state.checkOutModalVisible? styles.checkOutFlatbehindOverlayOpen : styles.checkOutFlatbehindOverlayClosed}></Animatable.View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.cartModalContainerView}>
            <TouchableWithoutFeedback onPress={() => this.closeCartDetail()}><View style={styles.cartModalOlverlay} /></TouchableWithoutFeedback>
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
              <TouchableOpacity style={styles.addtocartButton} onPress={() => this.addToCart()}>
                <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}} >ADD TO CART</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.checkOutModalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          <View style={styles.checkOutModalContainerView}>
            <TouchableWithoutFeedback onPress={() => this.colseCheckOutDetail()}>
              <View style={styles.checkOutModalOlverlay} />
            </TouchableWithoutFeedback>
            <View style={styles.checkOutModalView}>
              <TouchableOpacity style={styles.modalcloseButton} onPress={() => this.colseCheckOutDetail()} ><Icon name="md-close" style={styles.modalcloseButtonIcon} ></Icon></TouchableOpacity>
              <View>
              {this.state.checkOutModalVisible && this.state.totalCarList.length > 0?
                  <FlatList
                    data={this.state.totalCarList}
                    renderItem={this.renderCheckOutList}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  :
                  <View style={{alignItems:'center'}}><Text>Your cart is empty</Text></View>
                }
              </View>
              <View style={styles.checkOutDeliveryView}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,}}>
                  <Text style={{fontSize: 16}}>Delivery costs</Text>
                  <Text style={{fontSize: 16}}>FREE</Text>
                </View>
                <View>
                  <TextInput placeholder="Enter your discount code" style={{
                    padding: 10,
                    fontSize: 16,
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderRadius: 5,
                    borderWidth: 1,
                  }} />
                </View>
              </View>
              <TouchableOpacity style={styles.addtocartButton}>
                <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}} >Check Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  checkOutDeliveryView: {
    position: 'absolute',
    width: '100%',
    left: 15,
    bottom: 65,
    borderTopColor: '#d9d9d9',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  checkoutFoodNumberArrowButton: {
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent:'center',
  },
  checkOutSingleListContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    margin: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  checkOutFlatbehindOverlayClosed: {
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    opacity: 0,
    borderRadius: 500,
    transform: [
      {scale: 0}
    ]
  },
  checkOutFlatbehindOverlayOpen: {
    position: 'absolute',
    zIndex: 9999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    opacity: 0.7,
    borderRadius: 0,
    transform: [
      {scale: 1}
    ]
  },
  checkOutModalOlverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'transparent',
  },
  checkOutModalContainerView: {
    flex:1,
    paddingTop: SCREEN_HEIGHT/6,
    alignItems: 'center',
    position: 'relative',
  },
  checkOutModalView: {
    position: 'relative',
    width: SCREEN_WIDTH*7/8,
    backgroundColor: '#fff',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 3,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 160,
    maxHeight: SCREEN_HEIGHT*5/7,
  },
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
    top: HEADER_COLLAPSED_HEIGHT-10,
    left: SCREEN_WIDTH-110,
    zIndex: 10001,
    overflow: 'visible',
  },
  cartFlatButtonView: {
    flex: 1,
    width: 80,
    height: 80,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.8,
    shadowRadius: 5,
    borderRadius: 40,
    backgroundColor: '#4AA0FA',
  },
  cartFlastButtonClicked: {
    position: 'absolute',
    ...ifIphoneX({
      top: 40,
    }, {
      top: 30,
    }),
    left: 30,
    zIndex: 10001,
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
    position: 'absolute',
    width: '100%',
    left:15,
    bottom: 15,
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
    paddingBottom: 70,
    maxHeight: SCREEN_HEIGHT*6.5/8,
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