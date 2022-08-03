/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from "react-native-background-fetch";
import WriteEstablishmentData from "./WriteEstablishmentData";

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(WriteEstablishmentData);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerHeadlessTask('WriteEstablishmentData', () => require('./WriteEstablishmentData'));
