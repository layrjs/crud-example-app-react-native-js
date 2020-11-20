import React from 'react';
import {AppRegistry, Alert} from 'react-native';
import {useAsyncMemo} from '@layr/react-integration';

// Since the URL class implementation in React Native v0.63.x is far too rudimentary,
// we need to replace it so @layr/router can work properly
import 'react-native-url-polyfill/auto';

import {getFrontend} from './components/frontend';
import {name as appName} from './app.json';

const backendURL = process.env['BACKEND_URL'];

if (!backendURL) {
  throw new Error(`'BACKEND_URL' environment variable is missing`);
}

function Main() {
  const [Frontend] = useAsyncMemo(async () => {
    try {
      return await getFrontend({backendURL});
    } catch {
      Alert.alert('Oups!', 'An error occurred while getting the Frontend component.');
    }
  });

  if (Frontend === undefined) {
    return null;
  }

  return <Frontend.Main />;
}

AppRegistry.registerComponent(appName, () => Main);
