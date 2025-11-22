import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

/* AI-INSTRUCTION-START:app-registration
 * App Registration
 *
 * This is the entry point for your React Native app.
 * The appName is read from app.json.
 *
 * CUSTOMIZATION:
 * If you need to register HeadlessJS tasks or other background tasks,
 * add them below using AppRegistry.registerHeadlessTask()
 *
 * AI-INSTRUCTION-END */
AppRegistry.registerComponent(appName, () => App);
