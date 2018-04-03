import React, { PureComponent } from 'react';
import { StackNavigator, DrawerNavigator } from 'react-navigation';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { darkBarkground, background, titleText, primary, white } from '../../styles/color';
import Board from './Board';
import DetailScreen from '../Detail';
import BoardList from '../../config/BoardList';

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 12,
  },
  headerRight: {
    marginRight: 12,
  }
});

export default StackNavigator({
  Board: {
    screen: Board,
    navigationOptions: {
      headerBackTitle: null,
    },
  },
  Detail: { screen: DetailScreen },
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      backgroundColor: primary,
    },
    headerTitleStyle: {
      color: 'white',
    },
    cardStyle: {
      opacity: 1,
    },
    headerLeft: (
      <TouchableOpacity onPress={() => navigation.navigate('DrawerToggle')}>
        <FontAwesome style={styles.headerLeft} name="navicon" size={20} color="white" />
      </TouchableOpacity>
    ),
    headerRight: (
      <TouchableOpacity>
        <FontAwesome style={styles.headerRight} name="pencil-square-o" size={20} color="white" />
      </TouchableOpacity>
    ),
  }),
});
