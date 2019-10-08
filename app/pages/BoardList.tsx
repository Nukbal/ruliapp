import React, { useContext } from 'react';
import { StyleSheet, SectionList, SectionListData, Text, View, TouchableHighlight } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { bestList, communityList, hobbyList, newsList, gameList } from 'app/config/BoardList';
import ThemeContext from 'app/ThemeContext';
import Title from 'app/components/Title';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  item: {
    height: 55,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  label: {
    paddingLeft: 8,
    paddingVertical: 14,
    marginTop: 6,
    justifyContent: 'center',
  },
  labelText: {
    fontWeight: '900',
    fontSize: 18,
  },
  footer: {
    borderBottomWidth: 1,
  },
});

interface Props {
  navigation: NavigationScreenProp<any>;
}

const sections = [
  { title: '뉴스', data: newsList },
  { title: '베스트', data: bestList },
  { title: '취미', data: hobbyList },
  { title: '게임', data: gameList },
  { title: '커뮤니티', data: communityList },
];

export default function BoardList({ navigation }: Props) {
  const { theme } = useContext(ThemeContext);

  const onPressItem = ({ key, title }: any) => {
    const { navigate } = navigation;
    navigate({ routeName: 'Board', params: { title, key }, key });
  };

  const renderItem = ({ item, index }: any) => {
    const onPress = () => onPressItem(item);
    return (
      <TouchableHighlight
        onPress={onPress}
        key={index}
        underlayColor={theme.primaryHover}
        style={[styles.item, { backgroundColor: theme.background }]}
      >
        <Text style={{ color: theme.text }}>{item.title}</Text>
      </TouchableHighlight>
    );
  };

  function renderHeader({ section: { title } }: { section: SectionListData<any> }) {
    return (
      <View style={styles.label}>
        <Text style={[styles.labelText, { color: theme.primaryLight }]}>{title}</Text>
      </View>
    );
  }

  function renderFooter() {
    return <View style={[styles.footer, { borderColor: theme.border }]} />;
  }

  return (
    <SectionList
      sections={sections}
      ListHeaderComponent={<Title label="루리웹" />}
      renderSectionHeader={renderHeader}
      renderSectionFooter={renderFooter}
      renderItem={renderItem}
      style={[styles.container, { backgroundColor: theme.background }]}
      stickySectionHeadersEnabled={false}
    />
  );
}
