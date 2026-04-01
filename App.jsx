import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaView>
  ); 
}

export default App;
