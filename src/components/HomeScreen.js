import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import {
  ListItem,
  SearchBar,
  Header,
  Button,
  Icon
} from "react-native-elements";
import { Auth } from "aws-amplify";
import { PLACES_API } from "../constants/urls";
import HeaderComponent from "./HeaderComponent";

export class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: false, search: "" };
    this.arrayholder = [];
    this.navigation = this.props.navigation;
    Auth.currentSession()
      .then(session => console.log(session))
      .catch(err => console.error(err));
  }
  clickPlace = id => {
    this.navigation.navigate("BookingScreen", {
      placeId: id
    });
  };

  SearchFilterFunction(text) {
    console.log(text);
    this.setState({ search: text, isLoading: true });
    //passing the inserted text in textinput
    fetch(PLACES_API + "/comments?postId=" + text)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          dataSource: responseJson
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  renderList() {
    if (this.state.isLoading) {
      // Loading View while data is loading
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <FlatList
        data={this.state.dataSource}
        renderItem={({ item }) => (
          <ListItem
            key={item.id}
            title={item.body}
            onPress={() => this.clickPlace(item.id)}
            bottomDivider
          />
        )}
        enableEmptySections={true}
        style={{ marginTop: 10 }}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  }
  render() {
    return (
      <View>
        <HeaderComponent screenName="Search Places" />
        <SearchBar
          round
          searchIcon={{ size: 24 }}
          onChangeText={text => this.SearchFilterFunction(text)}
          onClear={text => this.SearchFilterFunction("")}
          placeholder="Type Here..."
          value={this.state.search}
          platform="android"
          round="true"
        />
        {this.renderList()}
      </View>
    );
  }
}
