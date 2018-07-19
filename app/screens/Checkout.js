import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SCREEN_WIDTH }  from '../components/StaticValues';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from "../components/NavigationService";
import SingleTon from "../components/SingleTon";
import DatePicker from 'react-native-datepicker';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import CheckBox from 'react-native-check-box';
import ModalSelector from 'react-native-modal-selector'

export default class Checkout extends Component {
  constructor() {
    super();

    this.inputRefs = {};

    this.state ={
      time: '',
      ideal: "ABN AMRO",
      paymentCheck: 0,
      isAndroid: true,
    }
    if(SingleTon.isShowTab) {
      SingleTon.isShowTab.setState({isShowTabbar: false});
    }
  }

  componentDidMount() {
     if( Platform.OS === 'ios') {
         this.setState({isAndroid: false})
     }
  }

  backToDetail(){
    SingleTon.isShowTab.setState({
      isShowTabbar: true,
    });

    setTimeout(function() {
      SingleTon.mainPage.setState({
        cartClicked: SingleTon.mainPage.state.cartClicked? false: true,
        checkOutModalVisible: SingleTon.mainPage.state.checkOutModalVisible? false: true
      })
    }, 500)

    NavigationService.back();
  }
  finalcheckedOut(){
    SingleTon.cartedList = [];
    NavigationService.navigate('Main');
  }

  render() {

    let index = 0;
    const data = [
        { key: index++, label: 'ABN AMRO' },
        { key: index++, label: 'ASN Bank' },
        { key: index++, label: 'Bunq' },
        { key: index++, label: 'ING' },
        { key: index++, label: 'Knab' },
        { key: index++, label: 'Rabobank' },
        { key: index++, label: 'RegioBank' },
        { key: index++, label: 'SNS Bank' },
        { key: index++, label: 'Triodos Bank' },
        { key: index++, label: 'van Lanschot' },
        { key: index++, label: 'Moneyou' }
    ];

    return (
      <View style={styles.container} >
        <View style={{
          ...ifIphoneX({
            height: 40,
          }, {
            height: 30,
          }),
          backgroundColor: '#fff',
          width: SCREEN_WIDTH,
        }} ></View>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.finalCheckoutScrollView}>
          <Text style={styles.finalCheckTitle} >Almost Done !</Text>
          <View style={styles.finalCheckDefaultView}>
            <Text style={{color: '#999', fontWeight: 'bold', fontSize: 15}}>To what address should we deliver your offer?</Text>
            <Text style={styles.defaultSmaillText} >Street name and number:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
              <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
            <Text style={styles.defaultSmaillText} >Zip Code:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
              <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
            <Text style={styles.defaultSmaillText} >City Name:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
              <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
          </View>
          <View style={[styles.finalCheckDefaultView, {marginTop: 15}]}>
            <Text style={{color: '#999', fontWeight: 'bold', fontSize: 15}} >How can we contact you?</Text>
            <Text style={styles.defaultSmaillText} >Name:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
              <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
            <Text style={styles.defaultSmaillText} >E-mail Address:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
              <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
            <Text style={styles.defaultSmaillText} >Phone Number:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
              <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
            <Text style={styles.defaultSmaillText} >* Business Name:</Text>
            <View style={{position: 'relative', marginVertical: 5,}}>
              <View
                style={{
                  position: 'absolute',
                  shadowColor: '#000',
                  shadowOffset: {width: 1, height: 1,},
                  shadowOpacity: 0.6,
                  shadowRadius: 2,
                  elevation: 2,
                  backgroundColor: 'transparent',
                  borderColor: '#fff',
                  width: '100%',
                  height: '100%',
                  borderWidth: 1,
                  overflow: 'hidden',
                  borderRadius: 5,
                }}></View>
                <TextInput style={[styles.defaultTextInput, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,backgroundColor: this.state.isAndroid? '#fff': 'transparent',}]} />
            </View>
            <CheckBox
              style={{flex: 1, paddingTop: 10}}
              onClick={() => console.log("asdfasdfsadfasdf")}
              checkBoxColor={'#4AA0FA'}
              rightTextStyle={{color: '#4AA0FA', fontSize: 13}}
              rightText={"Keep me informed about special offers and discounts."} />
            <CheckBox
              style={{flex: 1, paddingTop: 10}}
              onClick={() => console.log("asdfasd")}
              checkBoxColor={'#4AA0FA'}
              rightTextStyle={{color: '#4AA0FA', fontSize: 13}}
              rightText={"Keep me informed about the status of my delivery through push messages."} />
          </View>
          <View style={[styles.finalCheckDefaultView, {marginTop: 15}]}>
            <Text style={{color: '#999', fontWeight: 'bold', fontSize: 15}}>What time would you like to receive your order?</Text>
            <View style={{position: 'relative', width: '100%', height: 40, marginTop: 7, marginBottom: 5}}>
              <DatePicker
                style={styles.datePickerStyle}
                date={this.state.time}
                mode="time"
                placeholder="As soon as possible"
                format="HH:mm"
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
                    color: '#666'
                  }
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={(time) => {this.setState({time: time})}}/>
                <Icon style={{fontSize: 22,color: '#666', position: 'absolute', top: 10, right: 10,zIndex: 10, elevation: 3,}} name="ios-arrow-down" />
            </View>
            <Text style={styles.defaultSmaillText} >Additional Comment:</Text>
              <View style={{position: 'relative', marginVertical: 5,}}>
                <View
                  style={{
                    position: 'absolute',
                    shadowColor: '#000',
                    shadowOffset: {width: 1, height: 1,},
                    shadowOpacity: 0.6,
                    shadowRadius: 2,
                    elevation: 2,
                    backgroundColor: 'transparent',
                    borderColor: '#fff',
                    width: '100%',
                    height: '100%',
                    borderWidth: 1,
                    overflow: 'hidden',
                    borderRadius: 5,
                  }}></View>
                <TextInput
                style={[styles.defaultTextInputArea, {borderColor: '#999',borderWidth: this.state.isAndroid? 1: 0,}]}
                multiline={true}
                editable = {true}
                numberOfLines={10}/>
              </View>
          </View>
          <View style={[styles.finalCheckDefaultView, {marginTop: 15}]}>
            <Text style={{color: '#999', fontWeight: 'bold', fontSize: 15}}>What payment method would you like to use?</Text>
            <View style={{position: 'relative', flexDirection: 'row', width: '100%', height: 30, alignItems: 'center', marginTop: 10}}>
              <CheckBox
                isChecked={this.state.paymentCheck == 'cash'? true :false}
                style={{flex: 1}}
                onClick={() => this.setState({paymentCheck: 'cash'})}
                checkBoxColor={'#4AA0FA'}
                rightTextStyle={{color: '#4AA0FA', fontSize: 15}}
                rightText={"Cash"} />
              <Image style={{width: 25, height: 25, resizeMode: 'contain'}} source={require('../resources/images/cash.png')} />
            </View>
            <View style={{position: 'relative', marginTop: 5,}}>
              <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}} >
                <CheckBox
                  isChecked={this.state.paymentCheck == 'ideal'? true :false}
                  style={{flex: 1}}
                  onClick={() => this.setState({paymentCheck: 'ideal'})}
                  checkBoxColor={'#4AA0FA'}
                  rightTextStyle={{color: '#4AA0FA', fontSize: 15}}
                  rightText={"iDEAL"} />
                  <Image style={{width: 25, height: 25, resizeMode: 'contain'}} source={require('../resources/images/iDeal.png')} />
              </View>
              <View style={{position: 'relative', width: '100%', height: 40, marginTop: 5, marginBottom: 5, paddingLeft: 30}}>
                <ModalSelector
                  disabled={this.state.paymentCheck == 'ideal'? false : true}
                  style={styles.datePickerStyle}
                  data={data}
                  initValue="ABN AMRO"
                  accessible={true}
                  scrollViewAccessibilityLabel={'Scrollable options'}
                  cancelButtonAccessibilityLabel={'Cancel Button'}
                  onChange={(option)=>{ this.setState({ideal:option.label})}} >
                  <TextInput editable={false} style={{color: this.state.paymentCheck == 'ideal'? '#777' : '#ddd'}} placeholder="Select something yummy!" value={this.state.ideal} />
                </ModalSelector>
                <Icon style={{fontSize: 22, position: 'absolute', top: 10, right: 10,elevation: 3, color: this.state.paymentCheck == 'ideal'? '#777' : '#ddd'}} name="ios-arrow-down" />
              </View>
            </View>
            <View style={{position: 'relative', flexDirection: 'row', width: '100%', height: 30, alignItems: 'center', marginTop: 10}}>
              <CheckBox
                isChecked={this.state.paymentCheck == 'paypal'? true :false}
                style={{flex: 1}}
                onClick={() => this.setState({paymentCheck: 'paypal'})}
                checkBoxColor={'#4AA0FA'}
                rightTextStyle={{color: '#4AA0FA', fontSize: 15}}
                rightText={"Paypal"} />
              <Image style={{width: 25, height: 25, resizeMode: 'contain'}} source={require('../resources/images/paypal.png')} />
            </View>
            <View style={{position: 'relative', flexDirection: 'row', width: '100%', height: 30, alignItems: 'center', marginTop: 10}}>
              <CheckBox
                isChecked={this.state.paymentCheck == 'credit'? true :false}
                style={{flex: 1}}
                onClick={() => this.setState({paymentCheck: 'credit'})}
                checkBoxColor={'#4AA0FA'}
                rightTextStyle={{color: '#4AA0FA', fontSize: 15}}
                rightText={"CreditCard"} />
              <Image style={{width: 60, height: 25, resizeMode: 'contain'}} source={require('../resources/images/visa.png')} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => this.finalcheckedOut()}
            style={styles.finalCheckoutButton}>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}} >FINISH ORDER</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.finalCheckOutFooter}>
          <TouchableOpacity onPress={() => this.backToDetail()} style={{width: SCREEN_WIDTH, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}} >
            <Icon name="ios-arrow-back" style={{color: '#4AA0FA',fontSize: 28, paddingTop: 3}} />
            <Text style={{color: '#4AA0FA', fontSize: 18}}>&nbsp; BACK</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  finalCheckoutButton: {
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4AA0FA',
    padding: 12,
    width: SCREEN_WIDTH-20,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 3,
  },
  datePickerStyle: {
    width: '100%',
    height: 40,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 3,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pickerSelectStyles: {
    padding: 10,
    borderColor: '#666',
    borderWidth: 1,
  },
  defaultTextInputArea: {
    // marginTop: 5,
    borderColor: '#999',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 2,
    // marginBottom: 5,
    height: 100,
    elevation: 3,
    overflow: 'hidden'
  },
  defaultTextInput: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 2,
    // marginBottom: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  defaultSmaillText: {
    marginTop: 5,
    fontSize: 12,
    color: '#3798FD'
  },
  finalCheckDefaultView: {
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1,},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  finalCheckTitle: {
    color: '#3798FD',
    fontSize: 25,
    fontWeight: 'bold',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0,},
    shadowOpacity: 0.6,
    shadowRadius: 0,
    marginLeft: 10,
    elevation: 3,
    marginBottom: 10,
  },
  finalCheckOutFooter: {
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
  finalCheckoutScrollView: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    width: SCREEN_WIDTH,
    paddingTop: 10
  },
});
