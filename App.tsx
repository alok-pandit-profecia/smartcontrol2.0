/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import {
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform,
  AppState
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import Routes from './src/routes'
import { ContextProvider, Context } from "./src/utils/Context";
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';
import { createStore } from "./src/store/createStore";
import { RealmController } from "./src/database/RealmController";
import LoginSchema from './src/database/LoginSchema';
import TaskSchema from './src/database/TaskSchema';
let realm = RealmController.getRealmInstance();
import BackgroundFetch from "react-native-background-fetch";
// import codePush from "react-native-code-push";
const rootStore = createStore()

const App = (props: any) => {

  console.disableYellowBox = true;
  useEffect(() => {

    // codePush.sync({
    //   // updateDialog: {title:'An update is available!'},
    //   // deploymentKey:'ukjcGI9QEIOmt_KLBAVJaPnSmaZxVBgMSatiB',
    //   installMode: codePush.InstallMode.IMMEDIATE
    // });
  
    BackgroundFetch.configure({
      minimumFetchInterval: 30,     // <-- minutes ( minimum allowed)
      // Android options
      forceAlarmManager: true,     // <-- Set true to bypass JobScheduler.
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      // periodic:false,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY, // Default
      requiresCharging: false,      // Default
      requiresDeviceIdle: false,    // Default
      requiresBatteryNotLow: false, // Default
      requiresStorageNotLow: false  // Default
    }, async (taskId) => {
      //console.log("[js] Received background-fetch event: ", taskId);
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // RealmController.addFake(realm, {})
      //console.log('tac');
      try {
        let loginData = RealmController.getLoginData(realm, LoginSchema.name);
        loginData = loginData['0'] ? loginData['0'] : {};

        if (loginData.username) {
          let myTasks = rootStore.myTasksModel;
          myTasks.callToBackgroundGetChecklistApi();
        }

      } catch (error) {
        //console.log("error::" + error);
      }
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(taskId);
    }, (error) => {
      //console.log("[js] RNBackgroundFetch failed to start");
    });

    BackgroundFetch.status((status) => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          //console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          //console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          //console.log("BackgroundFetch is enabled");
          break;
      }
    });

    SplashScreen.hide();

    return () => {
      BackgroundFetch.scheduleTask({
        taskId: "ae.adafsa.smartcontrol",
        forceAlarmManager: true,
        periodic: false,
        stopOnTerminate: false,
        enableHeadless: true,
        delay: 5000  // <-- milliseconds
      });
    }
  });

  return (
    <ContextProvider >
      <MenuProvider>
        <Routes {...props} />
      </MenuProvider>
    </ContextProvider>
  );
};

// let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
// export default codePush(codePushOptions)(App);
export default App;