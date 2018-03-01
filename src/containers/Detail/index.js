import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, StatusBar } from 'react-native';
import { requestDetail, getDetailInfo } from '../../store/ducks/detail';
import { darkBarkground } from '../../styles/color';
import DetailView from '../../components/DetailView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBarkground,
    justifyContent: 'flex-start',
  },
});

export class Detail extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
   });

  static defaultProps = {
    contents: [],
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const { prefix, boardId } = params.board;
    this.props.request(prefix, boardId, params.id);
  }

  render() {
    const { navigation, request, screenProps, ...rest } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <DetailView {...rest} />
      </SafeAreaView>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    request: bindActionCreators(requestDetail, dispatch),
  };
}

function mapStateToProps(state) {
  return getDetailInfo(state);
}

export default connect(mapStateToProps, mapDispatchToProps)(Detail);
