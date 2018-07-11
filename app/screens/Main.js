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
  AsyncStorage,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CheckBox from 'react-native-check-box';
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
import SingleTon from "../components/SingleTon";
import {NavigationActions} from "react-navigation";
import NavigationService from "../components/NavigationService";
import FastImage from 'react-native-fast-image';
import ParallaxHeader from '../components/Paralloxheader';
import { Switch } from '../components/SwitchComponent';
const maxCartViewHeight = SCREEN_HEIGHT*7/8 - 210;

var typingTimer;
var doneTypingInterval = 1000;

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
      deliveryCost: "FREE",
      isLogin: false,
      cupon: 0,
      iscupon: false,
      discountString: "",
      isSearch: false,
      searchText: "",
      currentCatalog: 0,
      imageBlur: 0,
      isCartViewScrollDown: true,
      isCartViewScrollUp: false,
      ischeckingcuppon: false,
      isFirstCatalog: true,
      isSwitch: false,
      isAndroid: true,
    }
    SingleTon.mainPage = this;
    if(SingleTon.isShowTab) {
      SingleTon.isShowTab.setState({isShowTabbar: true});
    }
  }

  handleViewRef = ref => this.flatview = ref;

//component mount part
  componentWillmount() {
    this.mounted = true;
  }

  componentDidMount() {
    this.mounted = true;

    if( Platform.OS === 'ios') {
        this.setState({isAndroid: false})
    }

    const foodFetchUrl = BASE_API_URL+'/api/catalog/1';

    fetch(foodFetchUrl)
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

    this.setState({deliveryCost: SingleTon.restaurantInfo.deliveryCost});
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
          <Text style={{color: '#666',fontSize: 15,fontWeight: 'bold',marginBottom: 6}}>{item.title}</Text>
          <Text style={{color: '#666',fontSize: 14, flexWrap: 'wrap'}}>{item.description}</Text>
        </View>
        <View>
          <TouchableOpacity style={styles.itemPriceButtn} onPress={()=>this.selectItemForCart(item)} ><Text style={{color: '#fff'}} >€ {item.price}</Text></TouchableOpacity>
          <FastImage
            style={{width: 80, height: 80}}
            source={{uri: item.image,
            headers:{ Authorization: 'someAuthToken' },
            priority: FastImage.priority.normal,}}
            resizeMode={FastImage.resizeMode.cover}/>
        </View>
      </TouchableOpacity>
    )
  }
  //end

  //render section list header
  renderSectionHeader = ({item}) => {
    return (
      <View style={{backgroundColor: '#fff', width: SCREEN_WIDTH}}>
        <View style={styles.itemCatalogView}>
          <View style={{backgroundColor: '#fff', width: '100%', height: 70, position: 'absolute', zIndex: 1}}>
            <Loaing color={'#000'}/>
          </View>
          <FastImage
            style={{width: '100%', height: 70,zIndex: 2}}
            source={{
              uri: item.catalog.image,
              headers:{ Authorization: 'someAuthToken' },
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={styles.itemCatalogTextView} >
            <Text style={{color: '#666',fontSize: 20,fontWeight: 'bold',marginBottom: 5,}}>{item.catalog.title}</Text>
            <Text style={{color: '#666',}} >{item.catalog.body}</Text>
          </View>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={item.data}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }
  //end

  //render catalog touchbutton of top horizontalscroll
  renderCatalog = ({item, index}) => {
    return (
      <TouchableOpacity style={this.state.currentCatalog == index? styles.catelogButtonSelected: styles.catelogButton} onPress={() => this.scrollToSection(index)} >
        <Text style={{color: this.state.currentCatalog == index? '#fff' : '#585858', fontWeight: this.state.currentCatalog == index? 'bold': 'normal'}} >{item.catalog.title}</Text>
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

  renderHeaderOfSectionHeader() {
    return (
      <View style={[styles.headerContainerStyle, { marginTop: this.state.isAndroid? 0:-95,}]} >
        <View style={{padding: 5, position: 'relative', flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{
            position: 'relative',
            height: 40,
            width: SCREEN_WIDTH*3/5-10,}}>
            {!this.state.isAndroid&&
                <View style={styles.headerSearchOverlay} ></View>
            }
            <TextInput  placeholder='Search' underlineColorAndroid={'transparent'} placeholderTextColor='#666' style={[styles.headerSearch, {borderRadius: 3,borderColor: '#c2c2c2', borderWidth: this.state.isAndroid? 1:0,}]} onChangeText={(text)=>this.searchData(text)} value={this.state.searchText} />
            {this.state.isSearch &&
              <TouchableOpacity style={styles.searchClearBtn} onPress={() => this.clearSearch()} >
                <Icon style={{fontSize: 23, color: '#666'}} name="md-close" />
              </TouchableOpacity>
            }
          </View>
          <View style={{position: 'relative', width:SCREEN_WIDTH*2/5-10, height: 40}}>
              {!this.state.isAndroid&&
                  <View style={styles.headerSearchOverlay} ></View>
              }
            <Switch
              value={this.state.isSwitch}
              onValueChange={(val) => this.setState({isSwitch: !this.state.isSwitch})}
              disabled={false}
              activeText={'Take Away'}
              inActiveText={' Deliver '}
              circleSize={34}
              barHeight={40}
              circleBorderWidth={0}
              backgroundActive={'#4AA0FA'}
              backgroundInactive={'transparent'}
              circleActiveColor={'#1075df'}
              circleInActiveColor={'#fff'}
              changeValueImmediately={true}
              renderInsideCircle={() => <Icon name="ios-menu" style={{fontSize: 20, color: this.state.isSwitch? '#fff':'#666'}} />}
              changeValueImmediately={true}
              innerCircleStyle={{ alignItems: "center", justifyContent: "center" }}
              outerCircleStyle={{}}
              renderActiveText={true}
              renderInActiveText={true}
            />
          </View>
        </View>
        <View style={styles.categoryContainer} >
          <FlatList
            style={{paddingLeft: this.state.isFirstCatalog? 0:SCREEN_WIDTH/2-103}}
            contentContainerStyle={{paddingRight: SCREEN_WIDTH/2-103,}}
            ref={ref => (this.catalogheader = ref)}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={this.state.resourceDatas}
            renderItem={this.renderCatalog}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    )
  }

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
      this.jello();

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

      totalPrice = totalPrice - totalPrice*this.state.cupon/100;

      if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
        totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
      }

      //set totalcart list and set empty of selected food, extra source, cart number and total price etc
      this.setState({
        totalCarList: totalCartArray,
        modalVisible: false,
        selectedItem: {},
        checkedExtra: {},
        selectedProductForCart: {},
        currentCartItemBumber: totalCartedNumber,
        currentCartItemPrice: totalPrice,
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
    this.jello();

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

    totalPrice = totalPrice - totalPrice*this.state.cupon/100;

    if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
      totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
    }

    //set totalcart list and set empty of selected food, extra source, cart number and total price etc
    this.setState({
      totalCarList: totalCartArray,
      modalVisible: false,
      selectedItem: {},
      checkedExtra: {},
      selectedProductForCart: {},
      currentCartItemBumber: totalCartedNumber,
      currentCartItemPrice: totalPrice,
    });
  }
  //end

  //function when search
  searchData(text = ""){
    var searchedData = [];
    this.setState({
      searchText: text,
    });

    if(text != "") {
      this.setState({
        isSearch: true,
      })
    } else {
      this.setState({
        isSearch: false,
      })
    }

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
      resourceDatas: searchedData,
    })
  }
  //end

  //clear search
  clearSearch() {
    this.setState({
      searchText: "",
      isSearch: false,
      imageBlur: 0,
    });

    this.searchData();
  }
  //end

  //function when click close button of checkout overview pop up
  colseCheckOutDetail() {
    this.setState({
      cartClicked: this.state.cartClicked? false: true,
      checkOutModalVisible: this.state.checkOutModalVisible? false: true
    });
  }
  //end

  //function when click header catalog button
  scrollToSection = (index) => {
    this.sectionListRef.scrollToIndex({animated: true, index: index});
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

    totalPrice = totalPrice - totalPrice*this.state.cupon/100;

    if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
      totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
    }

    this.setState({
      currentCartItemBumber: totalNumber,
      currentCartItemPrice: totalPrice,
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

      totalPrice = totalPrice - totalPrice*this.state.cupon/100;

      if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
        totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
      }

      this.setState({
        totalCarList: totalCartedList,
        currentCartItemBumber: totalNumber,
        currentCartItemPrice: totalPrice,
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

    totalPrice = totalPrice - totalPrice*this.state.cupon/100;

    if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
      totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
    }

    this.setState({
      totalCarList: totalCartedList,
      currentCartItemBumber: totalNumber,
      currentCartItemPrice: totalPrice,
    });
  }
  //end

  //checkCupon
  checkCupon(text) {
    clearTimeout(typingTimer);
    this.setState({
      discountString: text,
    });
    typingTimer = setTimeout(function() {
        this.doneTyping();
    }.bind(this), doneTypingInterval);
  }
  //end

  doneTyping() {
      this.setState({
          ischeckingcuppon: true,
      })
      var cuponText = this.state.discountString;
      const cuponCheckUrl = BASE_API_URL+'/api/couponCheck/'+cuponText;
      
      fetch(cuponCheckUrl,{
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer '+this.state.authToken
        }
      })
      .then((response) => {
          this.setState({
              ischeckingcuppon: false,
          })
        if(response != null) {
          return response.json()
        } else {
          return {"result": "error"}
        }
      })
      .then((responseJson) => {
        if(responseJson.result == "success") {
          this.setState({
            cupon: parseInt(responseJson.cupon.percentage),
            iscupon: true,
          });
          var totalCartArray = Utils.copy(this.state.totalCarList);
          var totalPrice = 0;
          for (const product of totalCartArray) {
            var price = 0;
            price = price + parseFloat(product.price);
            for (const extra of product.extras) {
              price = price + parseFloat(extra.price);
            }
            totalPrice += price*product.count;
          }

          totalPrice = totalPrice - totalPrice*this.state.cupon/100;

          if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
            totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
          }

          this.setState({
            currentCartItemPrice: totalPrice,
          });
        } else {
          this.setState({
            iscupon: false,
            cupon: 0,
          });
          var totalCartArray = Utils.copy(this.state.totalCarList);
          var totalPrice = 0;
          for (const product of totalCartArray) {
            var price = 0;
            price = price + parseFloat(product.price);
            for (const extra of product.extras) {
              price = price + parseFloat(extra.price);
            }
            totalPrice += price*product.count;
          }

          totalPrice = totalPrice - totalPrice*this.state.cupon/100;

          if(!isNaN(this.state.deliveryCost) && totalPrice > 0) {
            totalPrice = totalPrice + parseFloat(this.state.deliveryCost);
          }

          this.setState({
            currentCartItemPrice: totalPrice,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onItemsChanges = ({ viewableItems }) => {
    var nowCatalogindex = viewableItems[0].index;
    var resourceDatas = Utils.copy(this.state.resourceDatas);
    var lastCatalogIndex = resourceDatas.length-1;
    if(nowCatalogindex == 0 || nowCatalogindex == lastCatalogIndex) {
      this.setState({
        isFirstCatalog: true,
      })
    } else {
      this.setState({
        isFirstCatalog: false,
      })
    }

    if(nowCatalogindex == lastCatalogIndex) {
      this.catalogheader.scrollToEnd({animated: true,});
    } else {
      this.catalogheader.scrollToIndex({animated: true, index: nowCatalogindex});
    }
    this.setState({
      currentCatalog: nowCatalogindex,
      resourceDatas: resourceDatas,
    });
  }

  onCartItemChange = ({viewableItems}) => {
    var lastIndex = this.state.totalCarList.length - 1;
    var currentFirstIndex = viewableItems[0].index;
    var totalviewblelength = viewableItems.length-1;
    var currentlastIndex = viewableItems[totalviewblelength].index;
    if(currentFirstIndex == 0) {
      this.setState({isCartViewScrollUp: false});
    } else {
      this.setState({isCartViewScrollUp: true});
    }

    if(currentlastIndex == lastIndex) {
      this.setState({isCartViewScrollDown: false});
    } else {
      this.setState({isCartViewScrollDown: true});
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

  finalCheckOut() {
    if(this.state.totalCarList.length > 0) {
      
      AsyncStorage.getItem('loginToken')
      .then((val) => {
        if(val != null) {
          if(this.state.isLogin) {
            return "logedin";
          } else {
            this.setState({authToken: val});
            const userCheckurl = BASE_API_URL+'/api/details';
            return fetch(userCheckurl,{
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer '+this.state.authToken
              }
            });
          }
        }
      })
      .then((response) => {
        if(response == "logedin") {
          SingleTon.cartedList = this.state.totalCarList;
          this.colseCheckOutDetail();
          setTimeout(function() {
            NavigationService.navigate("Checkout");
          }, 500)
        }else if(response != "logedin" && response != null)
        {
          this.setState({
            isLogin: true,
          });
          SingleTon.cartedList = this.state.totalCarList;
          this.colseCheckOutDetail();
          setTimeout(function() {
            NavigationService.navigate("Checkout");
          }, 500)
        } else {
          this.setState({
            isLogin: false,
          });
          this.colseCheckOutDetail();

          setTimeout(function(){
            Alert.alert(
              'Alert',
              'Need to Login !',
              [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Login', onPress: () => {
                  SingleTon.sideMenu.open();
                }},
              ],
              { cancelable: false }
            )
          }, 700)
        }
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      alert('Your cart is empty');
    }
  }
//end

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });

    const headerColor = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });

    var basketImg = this.state.iscupon? require('../resources/images/basketcuponed.png') : require('../resources/images/basket.png');

    var cutNumberColor = this.state.iscupon? '#36e952' : '#4AA0FA';

    var delivercost = isNaN(this.state.deliveryCost)? this.state.deliveryCost: "€"+this.state.deliveryCost;

    const viewImages = {
      background: require('../resources/images/header.png'),
    };

    const slideInUp = {
      from: {
        translateY: 20,
      },
      to: {
        translateY: 0,
      },
    };

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

        <Animated.View style={[styles.header, { height:HEADER_EXPANDED_HEIGHT }]}>
          <Animated.View style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            backgroundColor: '#fff',
            zIndex: 5,
            opacity: this.state.isSearch? 1: headerColor,
          }} />
          <View style={styles.headerImageView} >
            <Image ref={(ref) => this.imageBlurRef = ref} style={styles.headerImage} source={{uri: BASE_API_URL+'/uploads/storeinfo/'+SingleTon.restaurantInfo.header_img}} blurRadius={0} />
            <Image style={styles.headerOverlayImage} source={require('../resources/images/overlay.png')} />
          </View>
        </Animated.View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{paddingTop: this.state.isAndroid? 0: 95, }}
          ref={ref => (this.sectionListRef = ref)}
          contentContainerStyle={[styles.scrollContainer, {paddingTop: this.state.isSearch?1: HEADER_EXPANDED_HEIGHT-60,}]}
          onScroll={
            Animated.event(
              [{ nativeEvent: {
                  contentOffset: {
                    y: this.state.scrollY
                  }
                }
              }])
          }
          bounces={false}
          scrollEventThrottle={16}
          data={this.state.resourceDatas}
          renderItem={this.renderSectionHeader}
          keyExtractor={(item, index) => index.toString()}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={this.renderHeaderOfSectionHeader()}
          ListEmptyComponent={
            <View style={{
              alignItems: 'center',
              backgroundColor: '#fff',
              paddingTop: 30,
              height: 500,
            }} >
                <Text style={{fontSize: 25}} >No Result</Text>
            </View>
          }
          onViewableItemsChanged={this.onItemsChanges}
        />
        {this.state.iscupon &&
          <Animatable.View transition={['top', 'left', 'rotate']} style={[
            {backgroundColor: cutNumberColor},
            this.state.cartClicked? styles.cartCupponTextOpened : styles.cartCupponTextCLosed]}><Text style={{color: '#fff'}} >-{this.state.cupon}%</Text></Animatable.View>
        }
        <Animatable.View transition={['top','left','rotate']} style={this.state.cartClicked? styles.cartFlastButtonClicked: styles.cartFlastButton} >
          <TouchableOpacity style={{width: 80, height: 80, alignItems: 'center', justifyContent: 'flex-end'}} onPress={() => this.setState({cartClicked: this.state.cartClicked? false: true, checkOutModalVisible: this.state.checkOutModalVisible? false: true })}>
            <Animatable.View
              style={[
                styles.cartFlatButtonView,
                this.state.iscupon? styles.isCupon: styles.notCupon
              ]}
              ref={this.handleViewRef}>
              <Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.basketImg} source={basketImg} />
              <Animatable.View style={{
                flex: 1,
                transform: [
                  {rotate: '-12deg'}
                ],
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 10,}}>
                <Text style={{color: cutNumberColor, marginBottom: 5,}}>{this.state.currentCartItemBumber}</Text>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>€{this.state.currentCartItemPrice.toFixed(2)}</Text>
              </Animatable.View>
            </Animatable.View>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View transition={['opacity','scale', 'borderRadius', 'width']} style={this.state.checkOutModalVisible? styles.checkOutFlatbehindOverlayOpen : styles.checkOutFlatbehindOverlayClosed}></Animatable.View>
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
              <TouchableOpacity style={styles.modalcloseButton} onPress={() => this.colseCheckOutDetail()} ><Icon name="md-close" style={[styles.modalcloseButtonIcon, {color: cutNumberColor},]} ></Icon></TouchableOpacity>
              <View>
              {this.state.checkOutModalVisible && this.state.totalCarList.length > 0?
                <View style={{position: 'relative'}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    style={{padding: 5}}
                    data={this.state.totalCarList}
                    renderItem={this.renderCheckOutList}
                    keyExtractor={(item, index) => index.toString()}
                    onViewableItemsChanged={this.onCartItemChange}
                  />
                </View>
                :
                <View style={{alignItems:'center'}}><Text>Your cart is empty</Text></View>
              }
              </View>
              {this.state.totalCarList.length > 0&&
              <View
                style={{
                width: 20,
                alignItems: 'center',
                position: 'absolute',
                bottom: 150,
                right: 2,
                }} >
                <Icon style={{fontSize: 20, color: this.state.isCartViewScrollDown? '#4AA0FA': '#ddd', transform: [{rotate: '90deg'}]}} name="ios-play" />
              </View>
              }
              {this.state.totalCarList.length > 0&&
              <View
                style={{
                width: 20,
                alignItems: 'center',
                position: 'absolute',
                top: 50,
                right: 2,
                }} >
                <Icon style={{fontSize: 20, color: this.state.isCartViewScrollUp? '#4AA0FA': '#ddd', transform: [{rotate: '-90deg'}]}} name="ios-play" />
              </View>
              }
              <View style={styles.checkOutDeliveryView}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10,}}>
                  <Text style={{fontSize: 16}}>Delivery costs</Text>
                  <Text style={{fontSize: 16}}>{delivercost}</Text>
                </View>
                <View style={{position: 'relative'}}>
                  <TextInput
                    placeholder="Enter your discount code"
                    style={{
                      padding: 10,
                      fontSize: 16,
                      backgroundColor: '#fff',
                      borderColor: this.state.iscupon? '#36e952':'#ddd',
                      borderRadius: 5,
                      borderWidth: 1,
                      shadowColor: this.state.iscupon? '#36e952':'#000',
                      shadowOffset: {width: 0, height: 0,},
                      shadowOpacity: this.state.iscupon?0.7:0.1,
                      elevation: 3,
                      shadowRadius: 3,
                    }}
                    onChangeText={(text)=>this.checkCupon(text)}
                    autoCapitalize="none"
                    value={this.state.discountString}/>
                    {this.state.ischeckingcuppon&&
                    <ActivityIndicator size="small" color="#034f9e" style={{position: 'absolute', right: 10, top: 12,elevation: 3,}} />
                    }
                    {this.state.iscupon&&
                    <Icon style={{position: 'absolute', fontSize: 30, right: 10, top: 7,elevation: 3, color: '#36e952'}} name="ios-checkmark-circle-outline" />
                    }
                </View>
              </View>
              <TouchableOpacity onPress={() => this.finalCheckOut()} style={[styles.addtocartButton, {backgroundColor: cutNumberColor},]}>
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
  cartviewDetailstyle: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
    borderColor: '#fff',
    borderWidth: 1,
    padding: 5,
    overflow: 'hidden'
  },
  finalCheckOutView: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    elevation: 3,
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
    width: 0,
    backgroundColor: '#fff',
    opacity: 0.7,
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
    width: SCREEN_WIDTH,
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
    ...ifIphoneX({
      paddingTop: 130,
    }, {
      paddingTop: 120,
    }),
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
    elevation: 3,
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
    top: HEADER_COLLAPSED_HEIGHT+15,
    left: SCREEN_WIDTH-110,
    zIndex: 10001,
    overflow: 'visible',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    elevation: 3,
  },
  cartFlatButtonView: {
    // flex: 1,
    width: 80,
    height: 80,
    shadowColor: '#034f9e',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 1,
    elevation: 3,
    shadowRadius: 3,
  },
  notCupon: {
    backgroundColor: '#4AA0FA',
    borderRadius: 40,
  },
  isCupon: {
    backgroundColor: '#36e952',
    shadowColor: '#0dac26',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 40,
  },
  cartCupponTextCLosed: {
    width:50,
    height: 25,
    position: 'absolute',
    top: HEADER_COLLAPSED_HEIGHT+15,
    left: SCREEN_WIDTH-145,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.4,
    elevation: 3,
    shadowRadius: 2,
    transform: [
      {rotate: '-12deg'}
    ],
    zIndex: 10000,
  },
  cartCupponTextOpened: {
    width:50,
    height: 25,
    position: 'absolute',
    ...ifIphoneX({
      top: 35,
    }, {
      top: 25,
    }),
    left: 90,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.4,
    elevation: 3,
    shadowRadius: 2,
    zIndex: 10000,
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
    ],
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
    elevation: 3,
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
    elevation: 3,
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
    elevation: 3,
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
    elevation: 3,
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
    position: 'relative',
    paddingTop: 35,
  },
  itemCatalogView: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.6,
    elevation: 3,
    shadowRadius: 1,
    marginVertical: 10,
    borderRadius: 3,
    backgroundColor: '#fff',
    height: 160,
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
    elevation: 3,
    borderRadius: 1,
    backgroundColor: '#fff',
    marginVertical: 3,
    height: 150,
    marginHorizontal: 5,
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
    elevation: 3,
    shadowRadius: 1,
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
  headerContainerStyle: {
    width: SCREEN_WIDTH,
    height: 100,
    backgroundColor: '#fff',
  },
  headerSearchOverlay: {
    height: 40,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0,},
    shadowOpacity: 0.6,
    elevation: 3,
    shadowRadius: 2,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'absolute',
  },
  headerSearch: {
    height: 40,
    textAlign: 'center',
    width: SCREEN_WIDTH*3/5-10,
  },
  searchClearBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 29,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    height: 45,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 5,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2,},
    shadowOpacity: 0.6,
    elevation: 3,
    shadowRadius: 2,
    marginBottom: 5,
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
    minWidth: 200,
    alignItems: 'center',
  },
  catelogButtonSelected: {
    backgroundColor: '#4AA0FA',
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 3,
    borderRadius: 3,
    justifyContent: 'center',
    minWidth: 200,
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 110,
    zIndex: 9998,
    overflow: 'visible',
  },
  header: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH,
    position: 'absolute',
    top: 0,
    left: 0,
    // zIndex: 9998,
    paddingBottom: 5,
  },
  title: {
    marginVertical: 16,
    color: "black",
    fontWeight: "bold",
    fontSize: 24
  }
});
