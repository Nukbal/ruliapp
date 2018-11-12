import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import { createStackNavigator } from 'react-navigation-stack';
// @ts-ignore
import { createAppContainer } from 'react-navigation';

import BoardStack from './containers/Board';
import DrawerScreen from './containers/Drawer';
import ConfigScreen from './containers/Settings';

import { primary } from './styles/color';

const MainNav = createBottomTabNavigator(
  {
    Board: { screen: BoardStack },
    List: { screen: DrawerScreen },
    Settings: { screen: ConfigScreen, title: 'Settings' },
  },
  {
    // @ts-ignore
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        const size = horizontal ? 20 : 25;
        switch (routeName) {
          case 'Board': {
            return <Icon name="dashboard" size={size} color={tintColor!} />;
          }
          case 'List': {
            return <Icon name="dashboard" size={size} color={tintColor!} />;
          }
          case 'Settings': {
            return <Icon name="settings" size={size} color={tintColor!} />;
          }
          default: {
            return null;
          }
        }
      },
    }),
    tabBarOptions: {
      activeTintColor: primary,
      inactiveTintColor: 'gray',
    },
  }
);

export default createAppContainer(MainNav);
