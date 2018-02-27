import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { View, Text, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { requestDetail, getDetailInfo } from '../../store/ducks/detail';
import { darkBarkground, border, listItem } from '../../styles/color';
import LazyImage from '../../components/LazyImage';
import Comments from '../../components/Comments';

export class Detail extends PureComponent {
  static defaultProps = {
    contents: [],
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { prefix, boardId } = params.board;
    this.props.request(prefix, boardId, params.id);
  }

  renderContentRow = (item) => {
    switch(item.type) {
      case 'embeded':
        return (<Text style={styles.TextContent} key={item.key}>{item.content}</Text>);
      case 'image':
        return (
          <LazyImage
            key={item.key}
            source={{ uri: item.content }}
          />
        );
      default:
        return (<Text style={styles.TextContent} key={item.key}>{item.content}</Text>);
        break;
    }
  }

  render() {
    const { contents, title, commentList } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.content}>
            {contents.length > 0 && contents.map(this.renderContentRow)}
          </View>
          <Comments comments={commentList} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    marginBottom: 6,
    borderRadius: 3,
    padding: 8,
    backgroundColor: listItem,
    borderBottomColor: border,
    borderBottomWidth: 1,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 4,
    padding: 8,
    borderRadius: 3,
    minHeight: 250,
    backgroundColor: listItem,
    justifyContent: 'flex-start',
  },
  TextContent: {
    marginBottom: 6,
    color: 'white',
  }
});

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(requestDetail, dispatch),
  };
}

function mapStateToProps(state) {
  return getDetailInfo(state);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
