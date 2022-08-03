import React, { useEffect, useContext } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text } from "react-native";
import { ContextProvider, Context } from "./../utils/Context";
import Login from './Login';
import SplashScreenView from './SplashScreen'
import Dashboard from './Dashboard';
import EstablishmentDetails from './EstablishmentDetails';
import InspectionDetails from './InspectionDetails'
import MyTasks from './MyTasks';
import ContactList from './ContactList';
import Action from './Action';
import efstDetails from './efstDetails';
import StartInspection from './StartInspection';
import Profile from './Profile';
import SearchScreen from './SearchScreen';
import TaskList from './TaskList';
import Detention from './Detention';
import Condemnation from './Condemnation';
import Sampling from './Sampling';
import CondemnationForm from './CondemnationForm';
import DetentionForm from './DetentionForm';
import SamplingForm from './SamplingForm';
import RequestForClouser from './RequestForClouser';
import OnHoldRequest from './OnHoldRequest';
import FoodAlertDetails from './FoodAlertDetails';
import FoodAlerts from './FoodAlerts';
import ProductList from './ProductList';
import FoodAlert from './FoodAlert';
import Reminder from './Reminder';
import CompletedTask from './CompletedTask';
import Settings from './Settings';
import FoodAlertHistory from './FoodAlertHistory';
import LastReportOne from './LastReportOne';
import LastReportTwo from './LastReportTwo';
import AboutSearchDocument from './About/AboutSearchDocument';
import AboutStaff from './About/AboutStaff';
import AboutHistory from './About/AboutHistory';
import AboutDirections from './About/AboutDirections';
import ViolationDetails from './ViolationDetails';
import EstablishmentDetailsTempPermit from './TemporaryPermit/EstablishmentDetailsTempPermit';
import ShowSrDetails from './TemporaryPermit/ShowSrDetails';
import FollowUpStartInspection from './FollowUpStartInspection';

import { createStore } from "../store/createStore";
import { StoreProvider } from "./../store/storeProvider";
import NavigationService from '../services/NavigationService';
import AdhocEstablishmentAndVehical from './AdhocEstablishmentAndVehical';
import AdhocEstablishment from './AdhocEstablishment';
import AdhocCreateNewEstablishment from './AdhocCreateNewEstablishment';
import AdhocEstablishmentDetails from './AdhocEstablishmentDetails';
import ServiceRequstList from './ServiceRequstList';
import ServiceRequestDetails from './ServiceRequestDetails';
import BusinessActivity from  './BusinessActivity'; 
import ViolationList from './ViolationList';
import VehicleDetails from './VehicleDetails';
import InspectionList from './InspectionList'; 
import HistoryInspectionDetails from './HistoryInspectionDetails';
import CampaignDetails from "./campaignDetails"
import ClosureInspection from "./ClosureInspection"
import RequestForClosureList from "./RequestForClosureList";
import SupervisoryMyTask from "./SupervisoryMyTask";
import StartInspectionCondenation from "./StartInspectionCondenation";

const rootStore = createStore()
const Stack = createStackNavigator();

export default () => (

  <StoreProvider value={rootStore}>
    <NavigationContainer ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }}>

      {/* <Stack.Navigator initialRouteName="Dashboard" mode="modal"
              headerMode="none"> */}

      <Stack.Navigator initialRouteName="Login" mode="modal"
        headerMode="none">

        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="RequestForClosureList" component={RequestForClosureList} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="EstablishmentDetails" component={EstablishmentDetails} />
        <Stack.Screen name="InspectionDetails" component={InspectionDetails} />
        <Stack.Screen name="MyTasks" component={MyTasks} />
        <Stack.Screen name="StartInspection" component={StartInspection} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="TaskList" component={TaskList} />
        <Stack.Screen name="ContactList" component={ContactList} />
        <Stack.Screen name="Action" component={Action} />
        <Stack.Screen name="efstDetails" component={efstDetails} />
        <Stack.Screen name="Detention" component={Detention}/>
        <Stack.Screen name="Condemnation" component={Condemnation}/>
        <Stack.Screen name="CondemnationForm" component={CondemnationForm}/>
        <Stack.Screen name="RequestForClouser" component={RequestForClouser}/>
        <Stack.Screen name="Sampling" component={Sampling}/>
        <Stack.Screen name="FoodAlert" component={FoodAlert}/>
        <Stack.Screen name="SamplingForm" component={SamplingForm}/>
        <Stack.Screen name="DetentionForm" component={DetentionForm}/>
        <Stack.Screen name="StartInspectionCondenation" component={StartInspectionCondenation}/>
        
        <Stack.Screen name="Reminder" component={Reminder}/>
        <Stack.Screen name="CompletedTask" component={CompletedTask}/>
        <Stack.Screen name="Settings" component={Settings}/>
        <Stack.Screen name="ProductList" component={ProductList}/>
        <Stack.Screen name="FoodAlertDetails" component={FoodAlertDetails} />
        <Stack.Screen name="FoodAlerts" component={FoodAlerts} />
        <Stack.Screen name="OnHoldRequest" component={OnHoldRequest} />
        <Stack.Screen name="FoodAlertHistory" component={FoodAlertHistory}/>
        <Stack.Screen name="LastReportOne" component={LastReportOne}/>
        <Stack.Screen name="LastReportTwo" component={LastReportTwo}/>
	      <Stack.Screen name="AboutSearchDocument" component={AboutSearchDocument} />
        <Stack.Screen name="AboutStaff" component={AboutStaff} />
        <Stack.Screen name="AboutHistory" component={AboutHistory} />
        <Stack.Screen name="AboutDirections" component={AboutDirections} />
        <Stack.Screen name="ViolationDetails" component={ViolationDetails}/>
        <Stack.Screen name="EstablishmentDetailsTempPermit" component={EstablishmentDetailsTempPermit}/>
        <Stack.Screen name="ShowSrDetails" component={ShowSrDetails}/>
        <Stack.Screen name="AdhocEstablishmentAndVehical" component={AdhocEstablishmentAndVehical}/>
        <Stack.Screen name="AdhocEstablishment" component={AdhocEstablishment}/>
        <Stack.Screen name="AdhocEstablishmentDetails" component={AdhocEstablishmentDetails}/>
        <Stack.Screen name="AdhocCreateNewEstablishment" component={AdhocCreateNewEstablishment}/>
        <Stack.Screen name="ServiceRequstList" component={ServiceRequstList}/>
        <Stack.Screen name="ServiceRequestDetails" component={ServiceRequestDetails}/>
        <Stack.Screen name="BusinessActivity" component={BusinessActivity}/>
        <Stack.Screen name="FollowUpStartInspection" component={FollowUpStartInspection}/>

        <Stack.Screen name="ViolationList" component={ViolationList}/>
        <Stack.Screen name="VehicleDetails" component={VehicleDetails}/>
        <Stack.Screen name="InspectionList" component={InspectionList}/>  
        <Stack.Screen name="HistoryInspectionDetails" component={HistoryInspectionDetails}/>
        <Stack.Screen name="CampaignDetails" component={CampaignDetails}/>
        <Stack.Screen name="ClosureInspection" component={ClosureInspection}/>
        <Stack.Screen name="SupervisoryMyTask" component={SupervisoryMyTask}/>
         
      </Stack.Navigator>

    </NavigationContainer>

  </StoreProvider>
);