import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type AdhocTaskEstablishmentDetailsStoreModel = Instance<typeof AdhocTaskEstablishmentDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
let realm = RealmController.getRealmInstance();

import { createAdhocTask, scheduleTaskDetails } from './../../services/WebServices';
let loginData = RealmController.getLoginData(realm, LoginSchema.name);
loginData = loginData['0'] ? loginData['0'] : {};
let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

const AdhocTaskEstablishmentDetailsStore = types.model('AdhocTaskEstablishmentDetailsModel', {
    establishmentName: types.string,
    licenseNumber: types.string,
    licenseStartDate: types.string,
    licenseEndDate: types.string,
    arabicEstablishmentName: types.string,
    contactDetails: types.string,
    address: types.string,
    emailId: types.string,
    onHold: types.string,
    businessActivity: types.string,
    selectVehicle: types.string,
    taskType: types.string,
    bazarName: types.string,
    city: types.string,
    address1: types.string,
    address2: types.string,
    accountType: types.string,
    taskId: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "adhocSuccess", "scheduleTaskSuccess"]),
    loadingState: types.enumeration("State", ['', "Creating Adhoc task", "Get Scheduled Task Details"]),

}).actions(self => ({

    setBazarName(bazarName: string) {
        self.bazarName = bazarName
    },
    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setLicenseNumber(licenseNumber: string) {
        self.licenseNumber = licenseNumber
    },
    setLicenseStartDate(licenseStartDate: string) {
        self.licenseStartDate = licenseStartDate
    },
    setLicenseEndDate(licenseEndDate: string) {
        self.licenseEndDate = licenseEndDate
    },
    setarabicEstablishmentName(arabicEstablishmentName: string) {
        self.arabicEstablishmentName = arabicEstablishmentName
    },
    setContactDetails(contactDetails: string) {
        self.contactDetails = contactDetails
    },
    setAddress(address: string) {
        self.address = address
    },
    setEmailId(emailId: string) {
        self.emailId = emailId
    },
    setOnHold(onHold: string) {
        self.onHold = onHold
    },
    setBusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setSelectVehicle(selectVehicle: string) {
        self.selectVehicle = selectVehicle
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },
    setAddress1(address1: string) {
        self.address1 = address1
    },
    setAddress2(address2: string) {
        self.address2 = address2
    },
    setCity(city: string) {
        self.city = city
    },
    setAccountType(accountType: string) {
        self.accountType = accountType
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setState(state: string) {
        self.state = state
    },
    callToAdhocInspection: flow(function* () {
        {
            self.state = "pending";
            self.loadingState = "Creating Adhoc task";
            try {

                let payload = {
                    "InterfaceID": "ADFCA_CRM_SBL_034",
                    "Longitude": "",
                    "PostalCode": "",
                    "Address2": self.address2,
                    "InspectionType": self.taskType,
                    "AccountArabicName": self.arabicEstablishmentName.includes('?') ? "" : self.arabicEstablishmentName,
                    "PhoneNumber": self.contactDetails,
                    "LanguageType": "",
                    "City": self.city,
                    "TradeLicenseNumber": self.licenseNumber,
                    "Latitude": "",
                    "InspectorName": loginData.username,
                    "AccountName": "StOrgRegis",
                    "Score": "",
                    "MailAddress": self.emailId,
                    "Address1": self.address1,
                    "AccountType": self.accountType,
                    "Action": self.businessActivity,
                    "LicenseExpDate": self.licenseEndDate,
                    "InspectorId": loginData.username,
                    "LicenseRegDate": self.licenseStartDate,
                    "Grade": ""
                }
                console.log("callAdhocTaskPAyload: " + JSON.stringify(payload))

                let callAdhocTaskResponse = yield createAdhocTask(payload);
                console.log("callAdhocTaskResponse: " + JSON.stringify(callAdhocTaskResponse))

                debugger;
                if (callAdhocTaskResponse && callAdhocTaskResponse != '' && callAdhocTaskResponse.Status == "Success") {

                    console.log("callAdhocTaskResponse: " + JSON.stringify(callAdhocTaskResponse))

                    self.state = "adhocSuccess";
                    self.loadingState = "";
                    self.taskId = callAdhocTaskResponse.TaskId

                } else {
                    self.loadingState = "";
                    self.state = "done"

                    ToastAndroid.show(callAdhocTaskResponse.message ?("Errorcode:"+callAdhocTaskResponse.message):("Errorcode:"+callAdhocTaskResponse.ErrorCode+",ErrorMessage:" + callAdhocTaskResponse.ErrorMessage + "TaskId:"+callAdhocTaskResponse.TaskId), ToastAndroid.CENTER);
                }
        
            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),

    callToScheduleTaskDetails: flow(function* () {
        {
            self.state = "pending";
            self.loadingState = "Get Scheduled Task Details";
            try {

                // let obj:any = {

                //     TaskId : self.taskId,
                //     lang:''
                // }

                let obj = "InterfaceID=ADFCA_CRM_SBL_040&LanguageType=" + "ENU" + "&InspectionNumber=" + self.taskId

                let scheduleTaskDetailsResponse = yield scheduleTaskDetails(obj);
                debugger;
                console.log("eHSRiskClassification: ", scheduleTaskDetailsResponse)

                if (scheduleTaskDetailsResponse && scheduleTaskDetailsResponse != '' && scheduleTaskDetailsResponse.Status == 'Success') {
                    debugger;

                    self.state = "scheduleTaskSuccess";
                    self.loadingState = "";
                    let eHSRiskClassification = ''
                    try {

                        eHSRiskClassification = scheduleTaskDetailsResponse.TodoListTask.Inspection[0].ListOfAccount.Establishment[0].EHSRiskClassification
                        //console.log("eHSRiskClassification: ", eHSRiskClassification)
                    }
                    catch (e) {
                        eHSRiskClassification = ''
                    }

                } else {
                    self.state = "error";
                    self.loadingState = "";
                    console.log("scheduleTaskDetailsResponse::" + JSON.stringify(scheduleTaskDetailsResponse))
                    // if (scheduleTaskDetailsResponse.ErrorMessage) {
                        ToastAndroid.show(scheduleTaskDetailsResponse.message ? scheduleTaskDetailsResponse.message : ("ErrorMessage : "+ scheduleTaskDetailsResponse.ErrorMessage+", ErrorCode :"+scheduleTaskDetailsResponse.ErrorCode), ToastAndroid.CENTER);

                    // } else {
                    //     ToastAndroid.show("Something went wrong", ToastAndroid.CENTER);

                    // }
                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),
})).views(self => ({

    getEstablishmentName() {
        return self.establishmentName
    },
    getLicenseNumber() {
        return self.licenseNumber
    },
    getLicenseStartDate() {
        return self.licenseStartDate
    },
    getLicenseEndDate() {
        return self.licenseEndDate
    },
    getarabicEstablishmentName() {
        return self.arabicEstablishmentName
    },
    getContactDetails() {
        return self.contactDetails
    },
    getAddress() {
        return self.address
    },
    getEmailId() {
        return self.emailId
    },
    getOnHold() {
        return self.onHold
    },
    getBusinessActivity() {
        return self.businessActivity
    },
    getSelectVehicle() {
        return self.selectVehicle
    },
    getTaskType() {
        return self.taskType
    },
    getAddress1() {
        return self.address1
    },
    getAddress2() {
        return self.taskType
    },
    getCity() {
        return self.city
    },
    getAccountType() {
        return self.accountType
    },
    getState() {
        return self.state
    }


}));


export default AdhocTaskEstablishmentDetailsStore;
