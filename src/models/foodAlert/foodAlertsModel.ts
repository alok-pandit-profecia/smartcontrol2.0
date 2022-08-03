import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof FoodAlertsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import { fetchFoodAlertService } from './../../services/WebServices';
let realm = RealmController.getRealmInstance();


const FoodAlertsStore = types.model('FoodAlertsModel', {
    alertResponse: types.string,
    selectedAlertObj: types.string,
    alertNumber: types.string,
    alertType: types.string,
    alertSource: types.string,
    status: types.string,
    startDate: types.string,
    toDate: types.string,
    description: types.string,
    sourceAlertNo: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "noAlert"]),
    loadingState: types.enumeration("loadingState", ["", "Fetching Food Alerts"])
}).actions(self => ({

    setFoodAlertDataBlank() {
        self.alertResponse = '',
            self.selectedAlertObj = '',
            self.alertNumber = '',
            self.alertType = '',
            self.alertSource = '',
            self.status = '',
            self.startDate = '',
            self.toDate = '',
            self.description = '',
            self.sourceAlertNo = '',
            self.state = 'done'
    },

    setAlertNumber(alertNumber: string) {
        self.alertNumber = alertNumber
    },
    setSelectedAlertObj(selectedAlertObj: string) {
        self.selectedAlertObj = selectedAlertObj
    },
    setAlertType(alertType: string) {
        self.alertType = alertType
    },
    setAlertSource(alertSource: string) {
        self.alertSource = alertSource
    },
    setStatus(status: string) {
        self.status = status
    },
    setStartDate(startDate: string) {
        self.startDate = startDate
    },
    setToDate(toDate: string) {
        self.toDate = toDate
    },
    setDescription(description: string) {
        self.description = description
    },
    setSourceAlertNo(sourceAlertNo: string) {
        self.sourceAlertNo = sourceAlertNo
    },
    setState(state: string) {
        self.state = state
    },
    callToFetchFoodAlertService: flow(function* () {
        // <- note the star, this a generator function!  
        //debugger
        self.state = "pending";
        self.loadingState = 'Fetching Food Alerts';
        try {
            let auth = '';
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};
            let loginInfo: any = loginData.loginResponse != '' ? JSON.parse(loginData.loginResponse) : {};

            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_032",
                "LanguageType": "ENU",
                "InspectorName": loginInfo.InspectorName ? loginInfo.InspectorName : '',
                "InspectorId": loginData.username
            }

            let foodAlertResponse = yield fetchFoodAlertService(payload, auth);
            // console.log("payload" + JSON.stringify(payload));
            // console.log("foodAlertResponse" + JSON.stringify(foodAlertResponse));
            // debugger;
            if (foodAlertResponse && foodAlertResponse.Status == "Success") { //&& foodAlertResponse.MobilityFoodAlert.FoodAlerts.length > 0
                self.alertResponse = JSON.stringify(foodAlertResponse.MobilityFoodAlert.FoodAlerts);
                // //console.log(" self.alertResponse ",  self.alertResponse )
                // //console.log(" self.alertResponse ",  self.alertResponse.length);
                self.state = 'done';
                self.loadingState = '';
            }
            else if (foodAlertResponse && foodAlertResponse.Status == "No Alerts") { //&& foodAlertResponse.MobilityFoodAlert.FoodAlerts.length > 0
                ToastAndroid.show(foodAlertResponse.Status, 1000);
                self.state = 'noAlert'
                self.loadingState = '';
            }
            else {
                ToastAndroid.show("failed to get food Alert Response", 1000);
                self.state = "error";
                self.loadingState = '';
            }
        }
        catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

})).views(self => ({
    getAlertNumber() {
        return self.alertNumber
    },
    getAlertResponse() {
        return self.alertResponse
    },
    getAlertType() {
        return self.alertType
    },
    getAlertSource() {
        return self.alertSource
    },
    getStatus() {
        return self.status
    },
    getStartDate() {
        return self.startDate
    },
    getToDate() {
        return self.toDate
    },
    getDescription() {
        return self.description
    },
    getSourceAlertNo() {
        return self.sourceAlertNo
    },
    getState() {
        return self.state
    },

}));


export default FoodAlertsStore;
