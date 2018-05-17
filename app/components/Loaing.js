import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default class Info extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});