import React, { useCallback, useContext } from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';

import Title from 'app/components/Title';
import ThemeContext from 'app/ThemeContext';
import AppendLoading from 'app/components/AppendLoading';

// import SearchBar from './SearchBar';
import BoardItem from './BoardItem';
import Placeholder from './placeholder';
import useBoard from './useBoard';

function extractKey(item: string) {
  return item;
}

function getItemLayout(_: any, index: number) {
  return { length: 75, offset: 75 * index, index };
}

interface Props {
  route: any;
  navigation: any;
}

export default function Board({ route, navigation }: Props) {
  const boardId = route.params ? route.params.key : '';
  const { list, data, onRefresh, onEndReached, pushing, appending } = useBoard(boardId);
  const { theme } = useContext(ThemeContext);

  const renderItem = useCallback(({ item, separators }: ListRenderItemInfo<string>) => {
    if (!item) return null;

    const target = data[item];
    const onPress = () => {
      const { navigate } = navigation;
      const { url, parent, key, subject } = target;
      navigate('Post', { url, parent, key, title: subject });
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

  return (
    <FlatList
      data={list}
      keyExtractor={extractKey}
      renderItem={renderItem}
      ListHeaderComponent={<Title label={route.params.title} />}
      ListEmptyComponent={<Placeholder />}
      refreshing={pushing}
      onRefresh={onRefresh}
      // refreshControl={(
      //   <RefreshControl
      //     refreshing={pushing}
      //     onRefresh={onRefresh}
      //     enabled
      //   />
      // )}
      ListFooterComponent={appending ? <AppendLoading /> : undefined}
      getItemLayout={getItemLayout}
      initialNumToRender={8}
      onEndReached={onEndReached}
      onEndReachedThreshold={1}
      style={{ backgroundColor: theme.background }}
    />
  );
}
