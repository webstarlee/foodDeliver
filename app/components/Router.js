import React, { Component } from 'react';
import { Dimensions, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import Main from "../screens/Main"
import Info from "../screens/Info"

const HomeStack = StackNavigator({
    Main: {screen: Main},
    Info: {screen: Info},
 }, {
    headerMode: 'none',
});

export default HomeStack;