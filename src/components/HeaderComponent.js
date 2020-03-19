import React from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Header, Button, Icon } from "react-native-elements";
import { Auth } from "aws-amplify";
import { Updates } from "expo";
import { useNavigation } from "@react-navigation/native";

const HeaderComponent = ({ screenName }) => {
  const navigation = useNavigation();
  return (
    <Header
      leftComponent={
        <Button
          title=""
          type="clear"
          onPress={() => navigation.toggleDrawer()}
          icon={<Icon name="menu" color="white" />}
        />
      }
      centerComponent={{
        text: screenName,
        style: { color: "#fff" }
      }}
      rightComponent={
        <Button
          title=""
          type="clear"
          icon={<Icon name="logout" type="simple-line-icon" color="white" />}
          onPress={() => {
            Auth.signOut().then(() => Updates.reload());
          }}
        />
      }
    />
  );
};
export default HeaderComponent;