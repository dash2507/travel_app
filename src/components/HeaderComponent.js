import React from 'react';
import {
  Container,
  Left,
  Right,
  Body,
  Header,
  Button,
  Icon,
  Title,
} from 'native-base';
import {Auth} from 'aws-amplify';
import RNRestart from 'react-native-restart';

const HeaderComponent = ({screenName}) => {
  return (
    <Header>
      <Body>
        <Title>{screenName}</Title>
      </Body>
      <Right>
        <Button
          transparent
          onPress={() => {
            Auth.signOut().then(() => RNRestart.Restart());
          }}>
          <Icon ios="ios-log-out" android="md-log-out" />
        </Button>
      </Right>
    </Header>
  );
};
export default HeaderComponent;
