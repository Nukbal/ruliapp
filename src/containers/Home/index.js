import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { getBoardList } from '../../store/ducks/boards';
import BoardItem from '../../components/BoardItem';

export class Home extends PureComponent {
  static defaultProps = {
    list: [],
  }

  componentWillMount() {

  }

  renderItem = ({ item }) => {
    return (
      <BoardItem {...item} />
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.props.list}
          renderItem={this.renderItem}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    list: getBoardList(state),
  };
}

export default connect(mapStateToProps)(Home);
