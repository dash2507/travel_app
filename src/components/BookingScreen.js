import React, {useState, useEffect} from 'react';
import {BOOKING_API} from '../constants/urls';
import HeaderComponent from './HeaderComponent';
import {
  Container,
  Content,
  Picker,
  Form,
  Item,
  Label,
  Input,
  H3,
  Text,
  DatePicker,
  Icon,
  Button,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {Auth} from 'aws-amplify';
import {encrypt, decrypt} from '../constants/ceaser_cipher';

const BookingScreen = props => {
  const [date, setDate] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [basePrice, setBasePrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [card, setCard] = useState({cardNumber: '', mm: '', yy: '', cvv: ''});
  const [email, setEmail] = useState('');
  const navigation = props.navigation;
  const {placeId} = props.route.params;

  useEffect(() => {
    console.log(card);
    async function loadBaseprice() {
      await setBasePrice(12);
      await setTotal(12);
    }
    loadBaseprice();
    Auth.currentUserInfo().then(user => {
      setEmail(user.attributes.email);
    });
  }, []);

  const setCardNumber = number => {
    return number
      .replace(/\s?/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };
  const bookTicket = () => {
    let token = '';

    Auth.currentSession().then(sess => {
      token = sess.getIdToken().getJwtToken();
      console.log("Email---->", email);
      fetch(BOOKING_API + '/verify_payment', {
        method: 'post',
        body: encrypt(JSON.stringify({...card, token: token})),
      })
        .then(response => response.text())
        .then(responseText => JSON.parse(decrypt(responseText)))
        .then(responseJson => {
          if (responseJson.code == 0) {
            alert('Invalid Card Details');
            return;
          } else if (responseJson.code == 1) {
            const data = {
              userID: email,
              placeID: placeId,
              passengers: passengers,
              journeyDate: date.toISOString().split('T')[0],
              cardEnding: card.cardNumber.split(' ')[3],
              basePrice: basePrice,
              totalPrice: total,
              token: token,
            };
            console.log(card);
            fetch(BOOKING_API + '/book', {
              method: 'post',
              body: encrypt(JSON.stringify(data)),
            })
              .then(response => response.text())
              .then(responseText => JSON.parse(decrypt(responseText)))
              .then(responseJson => {
                console.log(responseJson);
                props.navigation.navigate('BookingConfirm', {
                  bookingStatus: responseJson,
                });
              });
          }
        });
    });
  };
  return (
    <Container>
      <HeaderComponent screenName="Booking" />
      <H3 style={{padding: 10}}>Header Three</H3>
      <Content style={{padding: 5}}>
        <Text>Journey:</Text>

        <Form style={{paddingVertical: 10}}>
          <Grid style={{paddingBottom: 10}}>
            <Col>
              <Item stackedLabel>
                <Label>Passengers:</Label>
                <Picker
                  style={{width: Platform.OS === 'ios' ? undefined : 120}}
                  placeholder="Number of Passengers"
                  note="true"
                  mode="dropdown"
                  selectedValue={passengers}
                  onValueChange={value => {
                    setPassengers(value);
                    setTotal(basePrice * value);
                  }}>
                  <Picker.Item label="1" value={1} />
                  <Picker.Item label="2" value={2} />
                  <Picker.Item label="3" value={3} />
                  <Picker.Item label="4" value={4} />
                  <Picker.Item label="5" value={5} />
                </Picker>
              </Item>
            </Col>
            <Col style={{paddingVertical: 30, paddingHorizontal: 20}}>
              <Text> Total: ${total}</Text>
            </Col>
          </Grid>
          <Item inlineLabel>
            <Label>Journey Date</Label>
            <DatePicker
              defaultDate={new Date()}
              minimumDate={new Date()}
              locale={'en'}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={'fade'}
              androidMode={'default'}
              placeHolderText="Select date"
              textStyle={{color: 'green'}}
              placeHolderTextStyle={{color: '#d3d3d3'}}
              onDateChange={date => setDate(date)}
              disabled={false}
            />
          </Item>

          <Text style={{paddingVertical: 10}}>Card Details:</Text>
          <Item inlineLabel>
            <Icon active name="card" />
            <Input
              placeholder="XXXX XXXX XXXX XXXX"
              value={card.cardNumber}
              maxLength={19}
              keyboardType="number-pad"
              onChangeText={number => {
                setCard({
                  ...card,
                  cardNumber: setCardNumber(number),
                });
              }}
            />
          </Item>

          <Grid>
            <Row>
              <Col>
                <Item stackedLabel>
                  <Label>Expiry Date:</Label>
                  <Row>
                    <Col>
                      <Input
                        placeholder="MM"
                        maxLength={2}
                        keyboardType="number-pad"
                        value={card.mm}
                        onChangeText={m => {
                          setCard({
                            ...card,
                            mm: m,
                          });
                        }}></Input>
                    </Col>
                    <Col>
                      <Input
                        placeholder="YY"
                        maxLength={2}
                        keyboardType="number-pad"
                        value={card.yy}
                        onChangeText={y => {
                          setCard({
                            ...card,
                            yy: y,
                          });
                        }}></Input>
                    </Col>
                  </Row>
                </Item>
              </Col>
              <Col>
                <Item stackedLabel>
                  <Label>CVV:</Label>
                  <Input
                    placeholder="XXX"
                    maxLength={3}
                    keyboardType="number-pad"
                    value={card.cvv}
                    onChangeText={c => {
                      setCard({
                        ...card,
                        cvv: c,
                      });
                    }}></Input>
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button primary onPress={() => bookTicket()}>
                  <Text>Submit</Text>
                </Button>
              </Col>
              <Col>
                <Button danger onPress={() => navigation.goBack()}>
                  <Text>Cancel</Text>
                </Button>
              </Col>
            </Row>
          </Grid>
        </Form>
      </Content>
    </Container>
  );
};

export {BookingScreen};
