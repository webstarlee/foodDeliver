import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Main from "../screens/Main";
import Info from "../screens/Info";
import Checkout from "../screens/Checkout";

const HomeStack = StackNavigator({
    Main: {screen: Main},
    Info: {screen: Info},
    Checkout: {screen: Checkout},
 }, {
    headerMode: 'none',
});

export default HomeStack;