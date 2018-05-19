import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default class Loading extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={this.props.color} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});