import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 8,
    marginBottom: 8,
    backgroundColor: 'white',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
  },
  item: {
    flex: 1,
    flexDirection: 'column',
  }
});

export default class BoardItem extends Component {
  render() {
    const { title, comments, author, like, views, times, likes } = this.props;
    return (
      <TouchableOpacity>
        <View style={styles.container}>
          <Text>{title}</Text>
          <View style={styles.info}>
            <View style={styles.item}>
              <Ionicons name="ios-text-outline" size={25} color="grey" />
              <Text>{comments || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-thumbs-up-outline" size={25} color="grey" />
              <Text>{likes || 0}</Text>
            </View>
            <View style={styles.item}>
              <Ionicons name="ios-eye-outline" size={25} color="grey" />
              <Text>{views || 0}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
