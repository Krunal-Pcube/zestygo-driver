import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  Reactotron
    .configure({ name: 'ZestyGo Driver' })
    .useReactNative({
      console: false,        // ← add this
      networking: { 
        ignoreUrls: /symbolicate/,
      },
    })
    .connect();
}