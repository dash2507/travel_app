import React from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import {ListItem, SearchBar, Header, Button, Icon} from 'react-native-elements';
import {PLACES_API} from '../constants/urls';
import HeaderComponent from './HeaderComponent';
import {Container} from 'native-base';

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoading: false, search: ''};
    this.arrayholder = [];
    this.navigation = this.props.navigation;
  }
  clickPlace = id => {
    this.navigation.navigate('BookingScreen', {
      placeId: id,
    });
  };

  SearchFilterFunction(text) {
    console.log(text);
    this.setState({search: text, isLoading: true});
    if (text.trim() !== '') {
      //passing the inserted text in textinput
      fetch(PLACES_API + '/search?q=' + text.trim())
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          if (responseJson.code === 1) {
            this.setState({
              dataSource: responseJson.data,
            });
          }
          this.setState({
            isLoading: false,
          });
        })
        .catch(error => {
          this.setState({
            dataSource: [{title: 'Error Fetching Data', id: '-1'}],
          });
          console.error(error);
        });
    }
  }

  renderList() {
    if (this.state.isLoading) {
      // Loading View while data is loading
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        data={this.state.dataSource}
        renderItem={({item}) => (
          <ListItem
            key={item.id}
            title={item.title}
            onPress={() => {
              if (item.id !== -1) {
                this.clickPlace(item.id);
              }
            }}
            bottomDivider
          />
        )}
        enableEmptySections={true}
        style={{marginTop: 10}}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
  render() {
    return (
      <Container>
        <HeaderComponent screenName="Search Places" />
        <SearchBar
          round
          searchIcon={{size: 24}}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction('')}
          placeholder="Type Here..."
          value={this.state.search}
          lightTheme
          clearIcon
        />
        {this.renderList()}
      </Container>
    );
  }
}
