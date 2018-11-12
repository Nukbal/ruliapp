import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { primary } from '../../styles/color';
import BoardScreen from './Board';
import PostScreen from '../Post';

export default createStackNavigator({
  Board: {
    screen: BoardScreen,
    navigationOptions: {
      headerBackTitle: null,
    },
  },
  Post: {
    screen: PostScreen,
  },
}, {
  // @ts-ignore
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: primary,
    },
    headerTitleStyle: {
      color: 'white',
    },
  },
});
