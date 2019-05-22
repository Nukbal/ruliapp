import React, { useCallback } from 'react';
import { NavigationScreenProp } from 'react-navigation';
import {
  StyleSheet,
  FlatList,
  StatusBar,
  ActivityIndicator,
  View,
  ListRenderItemInfo,
  Text,
  Platform,
} from 'react-native';

// import SearchBar from './SearchBar';
import BoardItem from './BoardItem';
import itemStyles from './BoardItem/styles';
import { darkBarkground } from '../../styles/color';
import Placeholder from './placeholder';
import useBoard from './useBoard';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  infoPanel: {
    paddingLeft: 8,
    paddingRight: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const AppendLoading = (
  <View style={[itemStyles.container, { alignItems: 'center' }]}>
    <ActivityIndicator />
  </View>
);

interface Props {
  navigation: NavigationScreenProp<any, { title: string, key: string }>;
}

export default function Board({ navigation }: Props) {
  const boardId = navigation.state.params ? navigation.state.params.key : '';
  const { list, data, onRefresh, onEndReached, pushing, appending } = useBoard(boardId);

  const renderItem = useCallback(({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const target = data[item];
    const onPress = () => {
      const { navigate } = navigation;
      const { url, parent, key, subject } = target;
      navigate({ routeName: 'Post', params: { url, parent, key, subject } });
    };

    return (
      <BoardItem
        onPress={onPress}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        {...target}
      />
    );
  }, [navigation, data]);

  const extractKey = useCallback((item: string) => item, []);

  if (!boardId) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <Text>Please select board</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={extractKey}
        renderItem={renderItem}
        ListEmptyComponent={<Placeholder />}
        refreshing={pushing}
        onRefresh={onRefresh}
        ListFooterComponent={appending ? AppendLoading : undefined}
        getItemLayout={(_: any, index: number) => ({ length: 75, offset: 75 * index, index })}
        initialNumToRender={8}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
        removeClippedSubviews
      />
      {Platform.OS === 'ios' && (<StatusBar barStyle="light-content" />)}
    </View>
  );
}

Board.navigationOptions = ({ navigation }: Props) => {
  const title = navigation.getParam('title', 'Ruliapp');
  return {
    title: title || '',
  };
};
