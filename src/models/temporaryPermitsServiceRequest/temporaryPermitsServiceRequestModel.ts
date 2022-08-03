import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof TemporaryPermitsServiceRequestStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { fetchSrDetails, createAdhocTask } from '../../services/WebServices';
import { ToastAndroid } from 'react-native';
let realm = RealmController.getRealmInstance();


const TemporaryPermitsServiceRequestStore = types.model('TemporaryPermitsServiceRequestModel', {
    serviceRequestNumber: types.string,
    city: types.string,
    application: types.string,
    applicationType: types.string,
    status: types.string,
    creationDate: types.string,
    closedDate: types.string,
    permitStartDate: types.string,
    permitEndDate: types.string,
    serviceRequrestArray: types.string,
    serviceRequrestObject: types.string,
    taskId: types.string,
    loadingState: types.enumeration("State", ['', "Creating Adhoc task", "Get Scheduled Task Details"]),
    state: types.enumeration("State", ["pending", "done", "error", "navigate","adhocSuccess"])
}).actions(self => ({

    setTemporaryPermitsServiceRequestDataBlank() {
        self.serviceRequestNumber = '',
            self.city = '',
            self.application = '',
            self.applicationType = '',
            self.status = '',
            self.creationDate = '',
            self.closedDate = '',
            self.permitStartDate = '',
            self.permitEndDate = '',
            self.serviceRequrestArray = '',
            self.state = 'done'
    },

    setServiceRequestArray(data: string) {
        self.serviceRequrestArray = data
    },
    setServiceRequestObject(data: string) {
        self.serviceRequrestObject = data
    },
    setServiceRequestNumber(serviceRequestNumber: string) {
        self.serviceRequestNumber = serviceRequestNumber
    },
    setCity(city: string) {
        self.city = city
    },
    setApplication(application: string) {
        self.application = application
    },
    setApplicationType(applicationType: string) {
        self.applicationType = applicationType
    },
    setStatus(status: string) {
        self.status = status
    },
    setState(state: string) {
        self.state = state
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setClosedDate(closedDate: string) {
        self.closedDate = closedDate
    },
    setPermitStartDate(permitStartDate: string) {
        self.permitStartDate = permitStartDate
    },
    setPermitEndDate(permitEndDate: string) {
        self.permitEndDate = permitEndDate
    },

    callToAdhocInspection: flow(function* () {
        {
            self.state = "pending";
            self.loadingState = "Creating Adhoc task";
            try {

                let loginData = RealmController.getLoginData(realm, LoginSchema.name);
                loginData = loginData['0'] ? loginData['0'] : {};

                let tempdata = self.serviceRequrestObject != '' ? JSON.parse(self.serviceRequrestObject) : {};
                let BusinessActivity = tempdata.BusinessActivity;
                let TradeArabicName = tempdata.EnglishName;
                let TradeLicense = tempdata.TradeLicenseNumber;
                let AccountType = tempdata.AccountClass;
                let TradeExpiryDate = tempdata.LicenseExpiryDate;
                let SRID = tempdata.ADFCACertificateNo;
                let InspectionType = 'Temporary Routine Inspection';

                let payload = {
                    "InterfaceID": "ADFCA_CRM_SBL_034",
                    "Longitude": "",
                    "PostalCode": "",
                    "Address2": '',
                    "InspectionType": InspectionType,
                    "AccountArabicName": TradeArabicName,
                    "PhoneNumber": "",
                    "LanguageType": "",
                    "City": "",
                    "TradeLicenseNumber": TradeLicense,
                    "Latitude": "",
                    "InspectorName": loginData.username,
                    "AccountName": "StOrgRegis",
                    "Score": "",
                    "MailAddress": "",
                    "Address1": "",
                    "AccountType": AccountType,
                    "Action": BusinessActivity,
                    "LicenseExpDate": TradeExpiryDate,
                    "InspectorId": SRID,
                    "LicenseRegDate": "",
                    "Grade": ""
                }
                console.log("callAdhocTaskpayload: " + JSON.stringify(payload))

                let callAdhocTaskResponse = yield createAdhocTask(payload);

                debugger;
                if (callAdhocTaskResponse && callAdhocTaskResponse.Status == "Success") {

                    console.log("callAdhocTaskResponse: " + JSON.stringify(callAdhocTaskResponse))

                    self.state = "adhocSuccess";
                    self.loadingState = "";
                    self.taskId = callAdhocTaskResponse.TaskId

                } else {
                    self.loadingState = "";
                    self.state = "error"
                    ToastAndroid.show(callAdhocTaskResponse.message ? callAdhocTaskResponse.message : ("ErrorCode :"+callAdhocTaskResponse.ErrorCode+", ErrorMessage :"+callAdhocTaskResponse.ErrorMessage),100);
                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error"
            }
        }
    }),

    callToFecthSrDetails: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            let response: any = yield fetchSrDetails();
            debugger;
            if (response) {
                // console.log('fetch Sr details>>'+ JSON.stringify(response));
                try {
                    let responseParse = response;
                    let srDetailsArray = Array();
                    if (parseInt(responseParse.NumofRec)) {
                        //for(var i=0;i<responseParse.ListOfAdfcaAccountSyncIo.AdfcaAccountThinBc.length;i++)
                        for (let i = 0; i < parseInt(responseParse.NumofRec); i++) {
                            let srObj: any = {};
                            let srDetails = responseParse.ListOfAdfcaSrIo.SRDetails[i];

                            srObj.ADFCAExibitionToDate = srDetails.ADFCAExibitionToDate;                            //7
                            srObj.ADFCAExbFromDate = srDetails.ADFCAExbFromDate;                                    //6                
                            srObj.SiebSRId = srDetails.SiebSRId;
                            srObj.ADFCACertificateExpDate = srDetails.ADFCACertificateExpDate;
                            srObj.ADFCACertificateStartDate = srDetails.ADFCACertificateStartDate;
                            srObj.ADFCAEventType = srDetails.ADFCAEventType;                                       //8 
                            srObj.ADFCASRInspector = srDetails.ADFCASRInspector;
                            srObj.ADFCAEventName = srDetails.ADFCAEventName;                                      //5          
                            srObj.ADFCAPuposeOfVisit = srDetails.ADFCAPuposeOfVisit;                             //4           
                            srObj.ADFCAPremiseAddress = srDetails.ADFCAPremiseAddress;                          //3
                            srObj.ApplicationType = srDetails.ApplicationType;

                            srObj.ADFCANoOfBooth = srDetails.ADFCANoOfBooth;                                     //2
                            srObj.OpenedDate = srDetails.OpenedDate;
                            srObj.ADFCACertificateNo = srDetails.ADFCACertificateNo;
                            srObj.Application = srDetails.Application;
                            if (srObj.Application == 'Events-Exhibitions Permit') {
                                srObj.Application = 'Temporary Permit';
                            }
                            srObj.Status = srDetails.Status;
                            srObj.ADFCAEventLocation = srDetails.ADFCAEventLocation;                             //1
                            srObj.ListOfAdfcaActionThinBc = JSON.stringify(srDetails.ListOfAdfcaActionThinBc);
                            srObj.ListOfAdfcaAccountThinBc = escape(JSON.stringify(srDetails.ListOfAdfcaAccountThinBc));

                            srObj.RequestType = responseParse.RequestType;
                            srObj.LoginName = responseParse.LoginName;

                            srDetailsArray.push(srObj);

                        }//end for loop i

                        RealmController.addSRDetails(realm, srDetailsArray, () => {
                            //console.log(JSON.stringify(srDetailsArray))
                        })
                    }
                    let responseObject: any = {};
                    responseObject.Error_spcMessage = responseParse.Error_spcMessage;
                    responseObject.lastPageFlag = responseParse.Last_spcPage;
                    responseObject.NumOfRec = parseInt(responseParse.NumofRec);
                    responseObject.Status = responseParse.Status;
                    responseObject.srDetailsArray = srDetailsArray;
                    // successCallback(responseObject);
                } catch (e) {
                    let responseObject: any = {};
                    responseObject.Error_spcMessage = "";
                    responseObject.lastPageFlag = false;
                    responseObject.NumOfRec = 0;
                    responseObject.Status = "Failed";
                    responseObject.srDetailsArray = [];
                    // successCallback(responseObject);
                }
            }
            else {
                //console.log('failed');
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),


})).views(self => ({

    getServiceRequestNumber() {
        return self.serviceRequestNumber
    },
    getCity() {
        return self.city
    },
    getApplication() {
        return self.application
    },
    getApplicationType() {
        return self.applicationType
    },
    getStatus() {
        return self.status
    },
    getCreationDate() {
        return self.creationDate
    },
    getClosedDate() {
        return self.closedDate
    },
    getPermitStartDate() {
        return self.permitStartDate
    },
    getPermitEndDate() {
        return self.permitEndDate
    },




}));


export default TemporaryPermitsServiceRequestStore;
