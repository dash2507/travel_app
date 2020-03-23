import React, {useState} from 'react';
import {View, BackHandler, Text} from 'react-native';
import HeaderComponet from './HeaderComponent';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Icon,
  Button,
} from 'native-base';

const BookingConfirm = ({route, navigation}) => {
  const [bookingStatus, setStatus] = useState({
    code: 1,
    booking_id: '8cf4341a',
  });
  // const { bookingStatus } = route.params;

  const printStatus = status => {
    if (status.code == 1) {
      return (
        <Card
          transparent
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#dcedc8',
            borderRadius: 10,
          }}>
          <CardItem style={{backgroundColor: '#dcedc8'}}>
            <Icon
              ios="ios-checkmark-circle"
              android="md-checkmark-circle"
              style={{color: '#5a9216'}}
            />
            <Text style={{color: '#5a9216'}}>Booking Confirmed</Text>
          </CardItem>
          <CardItem style={{backgroundColor: '#dcedc8'}}>
            <Body
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>
                Congratulations! Your tickets are booked successfully!
              </Text>
              <Text>Booking ID: {bookingStatus.booking_id}</Text>
            </Body>
          </CardItem>
        </Card>
      );
    } else {
      return <Text>Booking Not Successful</Text>;
    }
  };
  return (
    <Container>
      <HeaderComponet screenName="Booking Status" />
      <Content padder>
        <Button
          transparent
          iconLeft
          style={{alignSelf: 'flex-end'}}
          onPress={() => {
            navigation.reset({
              routes: [{name: 'HomeScreen'}],
            });
          }}>
          <Text>Close</Text>
          <Icon ios="ios-close-circle" android="md-close-circle" />
        </Button>
        {printStatus(bookingStatus)}
      </Content>
    </Container>
  );
};
export {BookingConfirm};
