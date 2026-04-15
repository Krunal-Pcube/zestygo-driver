/**
 * @format
 */
import './ReactotronConfig'; // ← add this as first line
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerBackgroundHandler } from './src/utils/pushNotification';

registerBackgroundHandler(); 


AppRegistry.registerComponent(appName, () => App);
