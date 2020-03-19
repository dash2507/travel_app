import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Amplify, {Auth} from 'aws-amplify';
import {HomeScreen, BookingScreen, BookingConfirm} from './src/components';
import {config} from './src/constants/amplify-config';
import {withAuthenticator} from 'aws-amplify-react-native';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
});

const Stack = createStackNavigator();

function App() {
  // const dimensions = useWindowDimensions();

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const signUpConfig = {
  hideAllDefaults: true,
  signUpFields: [
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 1,
      type: 'string',
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 2,
      type: 'password',
    },
  ],
};
const usernameAttributes = 'email';
export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes,
});
