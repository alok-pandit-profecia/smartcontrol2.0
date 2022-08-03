import {
    types,
    Instance,
    flow
} from 'mobx-state-tree';

export type LoginStoreModel = Instance<typeof LoginStore>
import { services } from './../../config/config';
import { fetchLovDataService, LoginService, getAppVersion } from './../../services/WebServices';
import NavigationService from './../../services/NavigationService';
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import LOVSchema from '../../database/LOVSchema';
import ArabicLOVSchema from '../../database/ArabicLOVSchema';
import { ToastAndroid, Alert } from 'react-native';
let realm = RealmController.getRealmInstance();
let moment = require('moment');

const LoginStore = types.model('LoginModel', {
    isOnline: types.boolean,
    username: types.string,
    password: types.string,
    isArabic: types.boolean,
    searchText: types.string,
    lovResponse: types.string,
    loginResponse: types.string,
    lovArray: types.string,
    verionResponse: types.string,
    verionNumber: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "loginSuccess", "lovSuccess"]),
    loadingState: types.enumeration("loadingState", ['', "Logging In", "Fetching LOV Data", "Inserting establishment data.It may take upto 15 minutes.", "Inserting Establishment Data", "Inserting Establishment Data", "Inserting establishment data it may take upto 15 minutes"]),
}).actions(self => ({

    setLoginDataBlank() {
        self.username = '';
        self.password = '';
        self.state = 'done'
    },
    setUsername(username: string) {
        self.username = username
    },
    setPassword(password: string) {
        self.password = password
    },
    setState(state: string) {
        self.state = state
    },
    setLoadingState(loadingState: string) {
        self.loadingState = loadingState
    },
    setisArabic(isArabic: boolean) {
        self.isArabic = isArabic
    },
    setSearchText(searchText: string) {
        self.searchText = searchText
    },
    callToLoginService: flow(function* (isFaceId) {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Logging In';
        try {
            debugger;
            let auth = '';
            let payload = {}, username = self.username, password = self.password;
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            if (isFaceId) {
                username = loginData.username ? loginData.username : '';
                loginData = self.password ? self.password : '';
            }
            let url = 'UserName=' + username + '&Password=' + escape(password) + '&Attrib5=1.5.4&timetemp=2500';
            let loginResponse: any = yield LoginService(url, auth);
            debugger;
            if (loginResponse && (loginResponse.Status == 'Success')) {
                self.isOnline = true;
                self.loginResponse = JSON.stringify(loginResponse);
                let obj = {
                    isLoggedIn: true,
                    loginResponse: JSON.stringify(loginResponse),
                    username: self.username,
                    password: self.password
                }

                RealmController.addLoginInformation(realm, obj, () => {
                    self.state = 'loginSuccess';
                    self.loadingState = '';
                });

            }
            else {
                debugger;
                ToastAndroid.show(loginResponse && loginResponse.ErrorMessage ? loginResponse.ErrorMessage : ' Failed', 1000);
                self.state = "error";
                self.loadingState = '';
            }

        } catch (error) {
            // alert((error))
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

    callAppVersion: flow(function* () {
        // self.state = "pending";
        // self.loadingState = 'Getting App Version';
        try {

            let verionResponse: any = yield getAppVersion();

            if (verionResponse && (verionResponse.Status == 'Success')) {
                self.verionResponse = JSON.stringify(verionResponse);
                // self.state = 'done';
                // self.loadingState = '';
                if (verionResponse.Version && verionResponse.Version != '') {
                    let ApiVersion = verionResponse.Version.split('.');
                    let AppVersion = self.verionNumber !== '' ? self.verionNumber.split('.') :'1.0.11';                   let flag = false;

                    if (ApiVersion.length) {
                        if (parseInt(AppVersion[0]) < parseInt(ApiVersion[0])) {
                            flag = true;
                        }
                        else if (parseInt(AppVersion[1]) < parseInt(ApiVersion[1])) {
                            flag = true;
                        }
                        else if (parseInt(AppVersion[2]) < parseInt(ApiVersion[2])) {
                            flag = true;
                        }
                        if (flag) {
                            console.log('different version number');
                            Alert.alert(
                                "",
                                "Please Upgrade Version !",
                                [
                                ],
                                {
                                    cancelable: false,
                                }
                            )
                        }    
                    }
                    else{
                        Alert.alert(
                            "",
                            "Failed to get Version",
                            [
                            ],
                            {
                                cancelable: false,
                            }
                        )
                    }
                }

            }
            else {
                debugger;
                ToastAndroid.show(verionResponse && verionResponse.ErrorMessage ? verionResponse.ErrorMessage : ' Failed', 1000);
                Alert.alert(
                    "",
                    "Failed to get Version",
                    [
                    ],
                    {
                        cancelable: false,
                    }
                )
            }

        } catch (error) {
            // alert((error))
            // ... including try/catch error handling
            self.state = "error"
        }
    }),

    callToLovDataByKeyService: flow(function* (flag: boolean) {
        // <- note the star, this a generator function!
        // self.state = "pending"
        try {
            let auth = '';
            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_061",
                "ApplicationType": "1",
                "LanguageName": "English-American"
            }
            let payloadAr = {
                "InterfaceID": "ADFCA_CRM_SBL_061",
                "ApplicationType": "1",
                "LanguageName": "Arabic (Saudi Arabia)"
            }

            const saveDataInDB = (data: any, lanuage: string) => {
                let lovArray = Array();
                debugger
                if (data) {

                    var LookupNodes = data.GetLookupValuesResponse && data.GetLookupValuesResponse.Lookup;

                    let lookupValues = [];
                    let TODO_TYPE: any = [];
                    let UT_MARKET_CLASS: any = [];
                    let PHMA_RATING: any = [];
                    let FIN_ORG_SOURCE: any = [];
                    let FS_ACTIVITY_CLASS: any = [];
                    let SR_RESOLUTION: any = [];
                    let EVENT_STATUS: any = [];
                    let WEB_COLLAB_TYPE: any = [];
                    let FINCORP_DEAL_APPROVAL_AUTH: any = [];
                    let COUNTRY: any = [];
                    let ACTIVITY_AUDIENCE_TYPE: any = [];
                    let REPEATING_APPT_TYPE: any = [];
                    let ADFCA_CONDEMNATION_REASON: any = []; // new
                    let ADFCA_CONDEMNATION_PLACE: any = [];
                    let UT_MARKET_TYPE: any = [];
                    let AUTO_MAKE_TYPE: any = [];
                    let CUT_ACCOUNT_TYPE: any = [];
                    let ACCOUNT_TYPE: any = [];
                    let ADFCA_MAIN_BA: any = [];
                    let ADFCA_EMIRATES: any = [];
                    let MOBILE_VERSION: any = [];
                    let UT_METER_TYPE: any = [];
                    let AIRS_JOB_TITLE: any = [];
                    let ADFCA_OPA_UPD_DATE: any = [];
                    let ADFCA_OPA_ONLINE: any = [];
                    let INSP_SCOPE: any = [];
                    let INSP_TYPE: any = [];
                    let ADFCA_PESTICIDES_UPD: any = [];
                    let NBR_LAPTOPS: any = [];
                    let ADFCA_BAZAR_NAME: any = [];
                    let ADFCA_BAZAR_TASK_ID: any = [];
                    let ADFCA_SALAMAT_SURVEY_TASK_ID: any = [];

                    for (let j = 0; j < LookupNodes.length; j++) {

                        let Lookup = LookupNodes[j];

                        switch (Lookup.Type) {
                            case "TODO_TYPE":
                                TODO_TYPE.push(Lookup);
                                break;
                            case "UT_MARKET_CLASS":
                                UT_MARKET_CLASS.push(Lookup);
                                break;
                            case "PHMA_RATING":
                                PHMA_RATING.push(Lookup);
                                break;
                            case "FIN_ORG_SOURCE":
                                FIN_ORG_SOURCE.push(Lookup);
                                break;
                            case "FS_ACTIVITY_CLASS":
                                FS_ACTIVITY_CLASS.push(Lookup);
                                break;
                            case "SR_RESOLUTION":
                                SR_RESOLUTION.push(Lookup);
                                break;
                            case "EVENT_STATUS":
                                EVENT_STATUS.push(Lookup);
                                break;
                            case "WEB_COLLAB_TYPE":
                                WEB_COLLAB_TYPE.push(Lookup);
                                break;
                            case "FINCORP_DEAL_APPROVAL_AUTH":
                                FINCORP_DEAL_APPROVAL_AUTH.push(Lookup);
                                break;
                            case "COUNTRY":
                                COUNTRY.push(Lookup);
                                break;

                            case "ACTIVITY_AUDIENCE_TYPE":
                                ACTIVITY_AUDIENCE_TYPE.push(Lookup);
                                break;

                            case "REPEATING_APPT_TYPE":
                                REPEATING_APPT_TYPE.push(Lookup);
                                break;

                            case "ADFCA_CONDEMNATION_REASON":
                                ADFCA_CONDEMNATION_REASON.push(Lookup);
                                break;
                            case "ADFCA_BAZAR_NAME":
                                ADFCA_BAZAR_NAME.push(Lookup);
                                break;
                            case "ADFCA_SALAMAT_SURVEY_TASK_ID":
                                ADFCA_SALAMAT_SURVEY_TASK_ID.push(Lookup);
                                break;
                            case "ADFCA_BAZAR_TASK_ID":
                                ADFCA_BAZAR_TASK_ID.push(Lookup);
                            case "ADFCA_CONDEMNATION_PLACE":
                                ADFCA_CONDEMNATION_PLACE.push(Lookup);
                                break;

                            case "UT_MARKET_TYPE":
                                UT_MARKET_TYPE.push(Lookup);
                                break;

                            case "AUTO_MAKE_TYPE":
                                AUTO_MAKE_TYPE.push(Lookup);
                                break;

                            case "CUT_ACCOUNT_TYPE":

                                CUT_ACCOUNT_TYPE.push(Lookup);
                                break;

                            case "ACCOUNT_TYPE":

                                ACCOUNT_TYPE.push(Lookup);
                                break;
                            case "ADFCA_MAIN_BA":

                                ADFCA_MAIN_BA.push(Lookup);
                                break;
                            case "ADFCA_EMIRATES":
                                ADFCA_EMIRATES.push(Lookup);
                                break;
                            case "MOBILE_VERSION":
                                MOBILE_VERSION.push(Lookup);
                                break;
                            case "UT_METER_TYPE":
                                UT_METER_TYPE.push(Lookup);
                                break;
                            case "AIRS_JOB_TITLE":
                                AIRS_JOB_TITLE.push(Lookup);
                                break;
                            case "ADFCA_OPA_UPD_DATE":
                                ADFCA_OPA_UPD_DATE.push(Lookup);
                                break;
                            case "ADFCA_PESTICIDES_UPD":
                                ADFCA_PESTICIDES_UPD.push(Lookup);
                                break;
                            case "ADFCA_OPA_ONLINE":
                                ADFCA_OPA_ONLINE.push(Lookup);
                                break;
                            case "INSP_SCOPE":
                                INSP_SCOPE.push(Lookup);
                                break;
                            case "INSP_TYPE":
                                INSP_TYPE.push(Lookup);
                                break;
                            case "NBR_LAPTOPS":
                                NBR_LAPTOPS.push(Lookup);
                                break;
                        }

                    }
                    lovArray.push({ key: 'ADFCA_SALAMAT_SURVEY_TASK_ID', value: ADFCA_SALAMAT_SURVEY_TASK_ID });
                    lovArray.push({ key: 'ADFCA_BAZAR_TASK_ID', value: ADFCA_BAZAR_TASK_ID });
                    lovArray.push({ key: 'ADFCA_BAZAR_NAME', value: ADFCA_BAZAR_NAME });
                    lovArray.push({ key: 'NBR_LAPTOPS', value: NBR_LAPTOPS });
                    lovArray.push({ key: 'ADFCA_PESTICIDES_UPD', value: ADFCA_PESTICIDES_UPD });
                    lovArray.push({ key: 'INSP_TYPE', value: INSP_TYPE });
                    lovArray.push({ key: 'INSP_SCOPE', value: INSP_SCOPE });
                    lovArray.push({ key: 'ADFCA_OPA_ONLINE', value: ADFCA_OPA_ONLINE });
                    lovArray.push({ key: 'ADFCA_OPA_UPD_DATE', value: ADFCA_OPA_UPD_DATE });
                    lovArray.push({ key: 'AIRS_JOB_TITLE', value: AIRS_JOB_TITLE });
                    lovArray.push({ key: 'UT_METER_TYPE', value: UT_METER_TYPE });
                    lovArray.push({ key: 'MOBILE_VERSION', value: MOBILE_VERSION });
                    lovArray.push({ key: 'ADFCA_EMIRATES', value: ADFCA_EMIRATES });
                    lovArray.push({ key: 'ADFCA_MAIN_BA', value: ADFCA_MAIN_BA });
                    lovArray.push({ key: 'ACCOUNT_TYPE', value: ACCOUNT_TYPE });
                    lovArray.push({ key: 'CUT_ACCOUNT_TYPE', value: CUT_ACCOUNT_TYPE });
                    lovArray.push({ key: 'AUTO_MAKE_TYPE', value: AUTO_MAKE_TYPE });
                    lovArray.push({ key: 'UT_MARKET_TYPE', value: UT_MARKET_TYPE });
                    lovArray.push({ key: 'ADFCA_CONDEMNATION_PLACE', value: ADFCA_CONDEMNATION_PLACE });
                    lovArray.push({ key: 'ADFCA_CONDEMNATION_REASON', value: ADFCA_CONDEMNATION_REASON });
                    lovArray.push({ key: 'REPEATING_APPT_TYPE', value: REPEATING_APPT_TYPE });
                    lovArray.push({ key: 'ACTIVITY_AUDIENCE_TYPE', value: ACTIVITY_AUDIENCE_TYPE });
                    lovArray.push({ key: 'COUNTRY', value: COUNTRY });
                    lovArray.push({ key: 'FINCORP_DEAL_APPROVAL_AUTH', value: FINCORP_DEAL_APPROVAL_AUTH });
                    lovArray.push({ key: 'WEB_COLLAB_TYPE', value: WEB_COLLAB_TYPE });
                    lovArray.push({ key: 'EVENT_STATUS', value: EVENT_STATUS });
                    lovArray.push({ key: 'SR_RESOLUTION', value: SR_RESOLUTION });
                    lovArray.push({ key: 'FS_ACTIVITY_CLASS', value: FS_ACTIVITY_CLASS });
                    lovArray.push({ key: 'FIN_ORG_SOURCE', value: FIN_ORG_SOURCE });
                    lovArray.push({ key: 'PHMA_RATING', value: PHMA_RATING });
                    lovArray.push({ key: 'UT_MARKET_CLASS', value: UT_MARKET_CLASS });
                    lovArray.push({ key: 'TODO_TYPE', value: TODO_TYPE });
                    lovArray.push({ key: 'lovSyncDate', value: moment().format('LLL') });

                    if (lanuage === 'english') {
                        self.lovArray = JSON.stringify(lovArray);
                        RealmController.addLovDetails(realm, (lovArray), LOVSchema.name, () => {
                            debugger
                        })
                    }
                    else {
                        self.lovArray = JSON.stringify(lovArray);
                        RealmController.addLovDetails(realm, (lovArray), ArabicLOVSchema.name, () => {
                            debugger
                        })
                    }

                }
                else {

                    ToastAndroid.show('login.failedToLoadListOfValues', ToastAndroid.CENTER);

                }
                return lovArray;

            }

            //console.log('LOV CAll')
            let lovInfo = undefined;
            if (!flag) {
                lovInfo = RealmController.getLovData(realm, LOVSchema.name);
            }
            debugger
            // // //console.log('lovInfo' + JSON.stringify(lovInfo));

            if (lovInfo && lovInfo['0']) {

                let key = "lovSyncDate";

                let syncDate = RealmController.getLovDataByKey(realm, LOVSchema.name, key);
                debugger

                let today: any = new Date();
                syncDate = new Date(syncDate);

                if ((Math.abs(today - syncDate) / 36e5) > 24) {

                    try {

                        let response: any = {}, responseAr: any = {};
                        debugger
                        response = yield fetchLovDataService(payload, auth);

                        if (response) {
                            let arr: any = saveDataInDB(response, 'english');
                            if (arr.length) {
                                self.lovResponse = JSON.stringify(arr);
                            }
                        }
                        debugger
                        responseAr = yield fetchLovDataService(payloadAr, auth);

                        if (responseAr) {
                            let arrArabic: any = saveDataInDB(responseAr, 'arabic');
                            if (arrArabic.length) {
                                self.lovResponse = JSON.stringify(arrArabic);
                            }
                        }

                    }
                    catch (e) {
                        // Alert.alert(e);
                        // //console.log(e);
                    }
                    //Api call, delete existing lov ,then add  & update date in db
                }
                else {
                    debugger
                    // //console.log('not sync');
                    self.lovResponse = JSON.stringify(lovInfo);
                    // yield call(bindLovData, action);
                }

            }
            else {

                let response: any = {}, responseAr: any = {};
                debugger
                response = yield fetchLovDataService(payload, auth);

                if (response && response.GetLookupValuesResponse && response.GetLookupValuesResponse.Lookup) {
                    let arr: any = saveDataInDB(response, 'english');
                    if (arr.length) {
                        self.lovResponse = JSON.stringify(arr);
                    }
                }
                debugger
                responseAr = yield fetchLovDataService(payloadAr, auth);

                if (responseAr && responseAr.GetLookupValuesResponse && response.GetLookupValuesResponse.Lookup) {
                    let arrArabic: any = saveDataInDB(responseAr, 'arabic');
                    if (arrArabic.length) {
                        self.lovResponse = JSON.stringify(arrArabic);
                    }
                }

            }
            self.state = "done"

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

})).views(self => ({
    getUsername() {
        return self.username
    },
    getPassowrd() {
        return self.password
    },
    getState() {
        return self.state
    },
    getisArabic() {
        return self.isArabic
    },
    getLOVResponsec() {
        return self.lovResponse
    }
}));


export default LoginStore;
