import { Alert, ToastAndroid } from 'react-native';
import { services } from './../config/config';
import APICallingService from './APICallingService';
import { RealmController } from './../database/RealmController';
import LoginSchema from './../database/LoginSchema';
import TaskSchema from './../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let loginData = RealmController.getLoginData(realm, LoginSchema.name);
loginData = loginData['0'] ? loginData['0'] : {};
let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

const callToPostService = (payload: any, url: string, auth: string) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToGetContactList = (url: string, payload: string) => { //

    return APICallingService.sendNewPostRequest(url, payload, (res: any) => {

    });

}
const calltoClouser = (url: string, payload: any) => {
    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {

    });
}

const callToPostJSonService = (payload: any, url: string, auth: string) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToSignature = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {

    });

}
async function fetchLovDataService(payload: any, auth: string) {
    try {
        let url = services.url.lovURL;
        const response = await callToPostService(payload, url, auth);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callTosubmitCondemnationService = (payload: any, url: string) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

async function submitCondemnationService(payload: any) {
    try {
        let url = services.url.submitCondemnation;
        const response = await callTosubmitCondemnationService(payload, url);

        return response

    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToLoginService = (url: string, auth: string) => {
    // alert((url))

    return APICallingService.sendRequestForGet(url, (res: any) => {
    });
}

const callToGetTaskAPI = (url: string) => {

    return APICallingService.sendGetRequest(url, (res: any) => {
    });
}

const callToGetChecklistAPI = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToGetNocChecklistAPI = (url: string, payload: string) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

async function fetchNocChecklist(payload: any) {

    try {
        debugger;
        let url = services.url.getChecklistUrl;

        debugger;
        const response = await callToGetNocChecklistAPI(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            ToastAndroid.show('No Checklist available', 1000);
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToGetBA = (url: string, payload: string) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToGetVehicleData = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToCreateAdhocTask = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToScheduleTaskDetails = (url: string) => {

    return APICallingService.sendRequestForGetWithAuth(url, "", (res: any) => {
    });
}

const callToAcknowldgeAPI = (url: string, payload: string) => {
    debugger;
    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

const callToGetEfstData = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {

    });
}

const callToUpdateEfstCount = (url: string, payload: any) => {

    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {

    });
}

const callToFetchOnHoldResult = (url: string, payload: any) => {

    return APICallingService.sendRequestForPostWithAuthJson(url, payload, "", (res: any) => {

    });
}

const callToClosureInspection = (url: string, payload: string) => {

    return APICallingService.sendPostRequest(url, payload, (res: any) => {
    });
}

const callToGetAssessmentAPI = (url: string) => {

    return APICallingService.sendGetRequest(url, (res: any) => {
    });
}

const APIVersionService = (url: string) => {

    return APICallingService.sendGetRequest(url, (res: any) => {
    });
}

async function getAppVersion() {
    try {
        let url: string = services.url.appVersionUrl;
        const response = await APIVersionService(url);
        return response
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function LoginService(url1: string, auth: string) {
    try {
        let url = services.url.loginUrl + url1;
        const response = await callToLoginService(url, auth);

        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToInspectionSubmitService = (payload: any, url: string) => {

    return APICallingService.sendPostRequestJson(url, payload, "", (res: any) => {
    });
}

async function InspectionSubmitService(payload: any, TaskType: string) {

    try {

        let url;

        if (TaskType.toLocaleLowerCase() == 'supervisory inspections' || TaskType.toLocaleLowerCase() == 'monitor inspector performance') {
            url = services.url.supervisorySubmitUrl;
        }
        else if (TaskType.toLocaleLowerCase() == 'bazar inspection') {
            url = services.url.updateAssessmentUrl;
        }
        else {
            url = services.url.submitInspection;
        }
        console.log("url::" + JSON.stringify(url))
        console.log('payload' + JSON.stringify(payload))

        const response = await callToInspectionSubmitService(payload, url);
        console.log('response>>' + JSON.stringify(response))

        return response

    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToAccountSyncService = (url: string, auth: string) => {
    return APICallingService.sendRequestForGet(url, (res: any) => {
    });
}

async function getAccountSyncService(subUrl: string, auth: string) {
    try {
        let url = services.url.accountSyncURL + subUrl;
       // console.log(url)
        const response = await callToAccountSyncService(url, auth);
        return response

    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

const callToUpdateFoodAlert = (url: string, payload: any) => {
    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

async function updateFoodAlert(payload: any) {
    try {
        let url = services.url.updateFoodAlerturl;
        debugger;
        const response = await callToUpdateFoodAlert(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetSignature(obj: any) {                         //action call url

    try {
        debugger;
        let url = services.url.postSignatureURL;
        let payload = {
            "InterfaceID": "ADFCA_CRM_SBL_039",
            "LanguageType": "ENU",
            "InspectorId": loginData.username,
            "InspectorName": loginInfo.InspectorName ? loginInfo.InspectorName : "",
            "Checklistattachment": {
                "Inspection": {
                    "TaskId": obj.taskId,
                    "ListOfActionAttachment": {
                        "QuestAttachment": {
                            "FileExt": "jpg",
                            "FileName": "signature.png",
                            "FileSize": "",
                            "FileSrcPath": "",
                            "FileSrcType": "",
                            "Comment": "",
                            "FileBuffer": obj.fileBuffer
                        }
                    }
                }
            }
        };
        const response = await callToSignature(url, payload);
        // if (response) {
        // ToastAndroid.show('response' + JSON.stringify(response), 1000);
        debugger;
        // //console.log("response.data", response.data);
        return response
        // //console.log("response in web services", response);
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}
async function fetchGetTaskApi(loginData: any, resyncNeed: boolean) {
    try {
        debugger;

        if (resyncNeed) {
            let loginInfo: any = loginData.loginResponse != '' ? JSON.parse(loginData.loginResponse) : {}
            //  let url = 'http://10.110.45.80:7004/GBL_ADFCA_GetScheduleTaskDetails/GetTaskService/GetTasks?UserName=SALEH.BALKHAIR&InspectorId=1-6RTH9E&Attribute5=1.5.4&timetemp=2503';
            let url = services.url.getTaskUrl + `UserName=${loginData.username}&InspectorId=${loginInfo.UserId}&Attribute5=1.5.4&timetemp=2503`;
            const response = await callToGetTaskAPI(url);
            if (response) {
                debugger;
                return response
            }
            else {
                return response
            }
        } else {
            let dbFromTasks = await RealmController.getTasks(realm, TaskSchema.name);
            let tempDbFromTasksArray = Array();
            if (dbFromTasks && dbFromTasks['0']) {
                tempDbFromTasksArray = Object.values(dbFromTasks);
                tempDbFromTasksArray = tempDbFromTasksArray.filter(i => i.isCompleted == false);
                tempDbFromTasksArray = tempDbFromTasksArray.filter(i => i.TaskStatus != 'Failed');

                let obj = {
                    GetTasklist: { Inspection: tempDbFromTasksArray },
                    Status: "Success"

                }

                return await obj
            }
            else {
                let loginInfo: any = loginData.loginResponse != '' ? JSON.parse(loginData.loginResponse) : {}
                //  let url = 'http://10.110.45.80:7004/GBL_ADFCA_GetScheduleTaskDetails/GetTaskService/GetTasks?UserName=SALEH.BALKHAIR&InspectorId=1-6RTH9E&Attribute5=1.5.4&timetemp=2503';
                let url = services.url.getTaskUrl + `UserName=${loginData.username}&InspectorId=${loginInfo.UserId}&Attribute5=1.5.4&timetemp=2503`;
                const response = await callToGetTaskAPI(url);
                if (response) {
                    debugger;
                    return response
                }
                else {
                    return response
                }
            }
        }

    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetChecklistApi(dataObj: any, subBusinessActivity: any, lang: boolean, description: string) {
    try {
        debugger;
        let url = services.url.getChecklistUrl;
        let payload = {}

        if (subBusinessActivity.length) {
            let addSBAFlag = true;
            let objDesc = dataObj.Description == '' ? description : dataObj.Description;

            for (let index = 0; index < subBusinessActivity.length; index++) {
                const element = subBusinessActivity[index];

                if (element["instance"]["attribute"]["text-val"] === objDesc) {
                    addSBAFlag = false;
                    break;
                }
            }

            if (addSBAFlag) {
                subBusinessActivity.push({
                    "@id": "business_activity",
                    "instance": {
                        "@id": objDesc,
                        "attribute": {
                            "@id": "business_activity",
                            "@type": "text",
                            "text-val": objDesc,
                            "text": ""
                        }
                    }
                });
            }
        }
        else {
            subBusinessActivity.push({
                "@id": "business_activity",
                "instance": {
                    "@id": dataObj.Description == '' ? description : dataObj.Description,
                    "attribute": {
                        "@id": "business_activity",
                        "@type": "text",
                        "text-val": dataObj.Description == '' ? description : dataObj.Description,
                        "text": ""
                    }
                }
            });
        }

        payload = {
            "config": {
            },
            "global-instance": {
                "attribute": [
                    {
                        "@id": "inspection_language",
                        "@type": "text",
                        "text-val": lang ? "ARA" : "ENU"
                    },
                    {
                        "@id": "main_business_activity",
                        "@type": "text",
                        "text-val": dataObj.Description == '' ? description : dataObj.Description
                    }
                ],
                "entity": subBusinessActivity
            }
        }
        //   console.log("checklistPayload:" + JSON.stringify(payload));

        const response = await callToGetChecklistAPI(url, payload);
        //   console.log("checklistresponse:" + JSON.stringify(response));
        return response
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchFoodDisposal(item: any) {

    let url = services.url.getFoodDisposalurl;

    let payload: any = {
        "InterfaceID": "ADFCA_CRM_SBL_075",
        "LanguageType": "ENU",
        "TaskNumber": item.TaskId,
        "InspectorName": "",
        "RequestType": "Get",
        "TaskStatus": "",
        "InspectorId": ""
    }
    const response = await callToGetBA(url, payload);
    return response
}

async function fetchGetBusinessActivity(item: any) {

    let url = services.url.getBA;

    let payload: any = {
        "TradeLicense": item.LicenseCode,
        "LanguageType": "ENU",
        "InspectorName": "",
        "MainActivity": item.Description ? item.Description : '',
        "InspectorId": "",
        "EnglishName": "",
        "ArabicName": ""
    }
    debugger;
    const response = await callToGetBA(url, payload);
    // if (response) {
    console.log('payload' + JSON.stringify(payload));
    debugger;
    return response
}

async function fetchSibleReport(payload: any) {

    let url = services.url.inspectionReport;

    debugger;
    const response = await callToGetBA(url, payload);
    // if (response) {
    // //console.log('response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function callToSearchByEst(url: string, payload: any) {

    const response = await callToPostJSonService(payload, url, '');
    return response
}

const callToGetSrAPI = (url: string) => {

    return APICallingService.sendGetRequest(url, (res: any) => {
    });
}

async function fetchHistoryVehicleData(item: any) {

    let url = services.url.getSearchByVehicle;

    let payload = {
        "InterfaceID": "ADFCA_CRM_SBL_009",
        "ChasisNumber": item.chassisNumber,
        "PlateNumber": item.plateNumber,
        "VehicleMake": item.vehicleMake,
        "LanguageType": "ENU",
        "TradeLicenseNumber": "",
        "InspectorName": "",
        "PlaceofIssue": item.placeOfIssue,
        "InspectorId": "",
        "PlateCode": item.plateCode

    }

    debugger;
    const response = await callToGetVehicleData(url, payload);
    // if (response) {
    // //console.log('fetchHistoryVehicleData response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function fetchSrDetails() {
    try {
        debugger;
        let url = '';
        if (loginInfo.UserId && loginData.username) {
            url = services.url.srDetails + 'LoginId=' + loginInfo.UserId + '&LoginName=' + loginData.username + '&RequestType=SR&Attribute5=1.5.4&timetemp=2504';
        } else {
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};
            let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}
            url = services.url.srDetails + 'LoginId=' + loginInfo.UserId + '&LoginName=' + loginData.username + '&RequestType=SR&Attribute5=1.5.4&timetemp=2504';
        }
        console.log(url)
        const response = await callToGetSrAPI(url);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function createAdhocTask(payload: any) {

    let url = services.url.createAdhocInspection;

    debugger;
    const response = await callToCreateAdhocTask(url, payload);
    // if (response) {
    // //console.log('callToCreateAdhocTask response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function scheduleTaskDetails(payload: any) {

    let url = services.url.ScheduleTaskDetails + payload;
    console.log("scheduleTaskDetails", url)

    debugger;
    const response = await callToScheduleTaskDetails(url);
    // if (response) {
    // console.log('callToScheduleTaskDetails response' + JSON.stringify(response), 1000);
    debugger;
    return response
}

async function fetchAcknowldgeApi(payload: any) {
    try {
        debugger;
        // let url = services.url.srDetails;
        let url = services.url.acknowledge;
        const response = await callToAcknowldgeAPI(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetEfstDataService(licenseCode: any) {

    let url = services.url.getEfstUrl;

    let payload = {
        "InterfaceID": "ADFCA_CRM_EFST_063",
        "LanguageType": "ENU",
        "TradeLicense": licenseCode
    };
    console.log("getefstpayload::" + JSON.stringify(payload))

    const response = await callToGetEfstData(url, payload);
    // if (response) {
    return response
    // }
}

async function UpdateFoodHandlerCountService(trainedCount: any, certifiedCount: any, foodHandlerCount: any, licensesCode: any) {
    try {
        // //console.log("item in webservices", trainedCount, certifiedCount, foodHandlerCount, licensesCode);
        let url = services.url.UpdateEfstCountUrl;
        const payload = {
            "InterfaceID": "ADFCA_CRM_SBL_031",
            "LanguageType": "ENU",
            "FISTotalNumberofFoodHandlersCount": foodHandlerCount,
            "InspectorName": "",
            "InspectorId": "",
            "TrainedFoodHandlers": trainedCount,
            "CertifiedFoodHandlers": certifiedCount,
            "TradelicenseNumber": licensesCode
        }
        console.log("updateefstpayload::" + JSON.stringify(payload))

        const efstCountResponse = await callToUpdateEfstCount(url, payload);
        //ToastAndroid.show('UpdatedCountFoddHandlerresponse:' + efstCountResponse, 1000);
        //  debugger;
        return efstCountResponse;
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        ToastAndroid.show('Failed to get updated FoodHandler Count ,Please Try again', 1000);
    }
}


async function fetchGetOnHoldRequestService(taskId: any, reason: any, comments: any) {
    try {
        // //console.log("onHoldRequestData in WebServices", taskId, reason, comments)

        let url = services.url.onHoldRequestUrl;
        const payload = {
            "InterfaceID": "ADFCA_CRM_SBL_010",
            "LanguageType": "",
            "InspectorName": reason,
            "InspectionViolation": {
                "Inspection": {
                    "TaskId": taskId,
                    "Latitude": "",
                    "Comments": comments,
                    "Action": "Violation",
                    "Longitude": "",
                    "ListOfAdfcaOpportunity": {
                        "TaskViolation": {
                            "ViolationDescription": comments,
                            "ViolationName": comments,
                            "InspectionParameter": comments,
                            "ViolationType": "On Hold Request"
                        }
                    }
                }
            },
            "InspectorId": loginData.username
        }

        console.log("payload", JSON.stringify(payload));

        const efstCountResponse = await callToFetchOnHoldResult(url, payload);
        console.log(JSON.stringify(efstCountResponse));
        //ToastAndroid.show('UpdatedCountFoddHandlerresponse:' + efstCountResponse, 1000);
        //debugger;
        return efstCountResponse;
        // }
        // else {
        //     return response
        // }
    }
    catch (e) {
        ToastAndroid.show('Failed to get onHold Request response ,Please Try again', 1000);
    }
}

async function callToVoilationAttachment(payload: any) {
    let url = services.url.voilationAttachment;

    const response = await callToQuestionarieAttachmentAPI(url, payload);
    if (response) {
        debugger;
        return response
    }
    else {
        ToastAndroid.show('Failed To Upload Attachment', 1000);
    }
}
async function callToPostRequestForClouser(obj: any) {
    try {
        debugger;
        let url = services.url.postRequestForClosure;
        let payload = {
            "InterfaceID": "ADFCA_CRM_SBL_010",
            "LanguageType": "",
            "InspectorName": "",
            "InspectionViolation": {
                "Inspection": {
                    "TaskId": obj.inspectionId,
                    "Latitude": "",
                    "Comments": obj.violationName,
                    "Action": "Violation",
                    "Longitude": "",
                    "ListOfAdfcaOpportunity": {
                        "TaskViolation": {
                            "ViolationDescription": obj.violationName,
                            "ViolationName": obj.violationName,
                            "InspectionParameter": obj.violationName,
                            "ViolationType": "Request for Closure"
                        }
                    }
                }
            },
            "InspectorId": obj.inspectorId
        }

        const response = await calltoClouser(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }

}

async function callToGetSupervisoryEst(url: string, payload: any) {

    const response = await callToPostJSonService(payload, url, '');
    return response
}

async function fetchSupervisoryEstDetails(payload: any) {
    try {
        debugger;
        let url = services.url.supervisoryEstDetails;

        const response = await callToGetSupervisoryEst(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function getContactLists(licenseCode: string) {
    try {
        debugger;
        let url = services.url.getContactList;
        let payload = JSON.stringify({
            InterfaceID: 'ADFCA_CRM_SBL_005',
            TradeLicenseNumber: licenseCode
        })
        const response = await callToGetContactList(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}


const callToQuestionarieAttachmentAPI = (url: string, payload: string) => {
    debugger;
    return APICallingService.sendPostRequestJson(url, payload, '', (res: any) => {
    });
}

async function fetchFoodAlertService(payload: any, auth: string) {
    try {
        let url = services.url.getFoodAlerturl;
        const response = await callToPostJSonService(payload, url, auth);
        if (response) {
            // debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetQuestionarieAttachmentApi(payload: any) {

    let url = services.url.postSignatureURL;
    // console.log(url)
    const response = await callToQuestionarieAttachmentAPI(url, payload);
    // if (response) {
    console.log("callToQuestionarieAttachmentAPI>>>" + JSON.stringify(response))
    return response
    // }
    // else {
    //     ToastAndroid.show('Failed To Upload Attachment', 1000);
    // }
}

async function updateEstLocation(payload: any) {

    let url = services.url.updateEstLocationUrl;

    console.log('url ::' + JSON.stringify(url));
    const response = await callToQuestionarieAttachmentAPI(url, payload);
    if (response) {
        debugger;
        return response
    }
    else {
        // ToastAndroid.show('Failed To Upload Attachment', 1000);
    }
}

const callToGetQuestionarie = (url: string) => {


    return APICallingService.sendRequestForGetWithAuth(url, '', (res: any) => {
    });

}

async function fetchGetQuestionarieApi(lang: string, taskId: string) {
    try {
        debugger;
        let url = services.url.getQuestioneries + 'InterfaceID=ADFCA_CRM_SBL_067&LanguageType=' + lang + '&TaskId=' + taskId;
        const response = await callToGetQuestionarie(url);
        if (response) {
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Checklist ,Please Try again', 1000);
    }
}

async function followUpMergeApi(payload: any) {
    try {
        debugger;
        let url = services.url.followUpMerge;
        const response = await callToAcknowldgeAPI(url, payload);
        if (response) {
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Checklist ,Please Try again', 1000);
    }
}

async function fetchGetCampaignChecklistApi(payload: any) {
    debugger;
    let url = services.url.getChecklistUrl;
    const response = await callToGetChecklistAPI(url, payload);
    if (response) {
        //   ToastAndroid.show('response' + response, 1000);
        return response;
    }
    else {
        // ToastAndroid.show('No Checklist Available', 1000);
    }

}

async function getOPAResultApi(payload: any) {
    debugger;
    let url = services.url.getOPAResultUrl;
    const response = await callToGetChecklistAPI(url, payload);
    if (response) {
        //   ToastAndroid.show('response' + response, 1000);
        return response;
    }
    else {
        // ToastAndroid.show('No Checklist Available', 1000);
    }

}

async function fetchClosureInspection(payload: any) {
    try {
        debugger;
        // let url = services.url.srDetails;
        let url = services.url.closureInspectionurl;
        const response = await callToClosureInspection(url, payload);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}

async function fetchGetAssessmentAPI(lang: string, taskId: string) {
    try {
        debugger;
        // let url = services.url.srDetails;
        // let url = services.url.getQuestioneries + 'InterfaceID=ADFCA_CRM_SBL_067&LanguageType=' + lang + '&TaskId=' + taskId;

        let url = services.url.getAssessmentUrl + 'InterfaceID=ADFCA_CRM_SBL_065&LanguageType=' + lang + '&TaskId=' + taskId;
        const response = await callToGetAssessmentAPI(url);
        if (response) {
            debugger;
            return response
        }
        else {
            return response
        }
    }
    catch (e) {
        // ToastAndroid.show('Failed to Get Lov Data ,Please Try again', 1000);
    }
}


export {
    fetchLovDataService, getAppVersion, fetchFoodDisposal, updateEstLocation, callToVoilationAttachment, fetchSibleReport, getOPAResultApi, updateFoodAlert, InspectionSubmitService, fetchSrDetails, fetchAcknowldgeApi, LoginService, fetchGetTaskApi, fetchGetChecklistApi, fetchGetBusinessActivity, callToSearchByEst, fetchHistoryVehicleData, createAdhocTask, scheduleTaskDetails, getAccountSyncService, submitCondemnationService, fetchGetEfstDataService, UpdateFoodHandlerCountService, fetchGetOnHoldRequestService
    , callToPostRequestForClouser, fetchGetSignature, callToGetContactList, getContactLists, fetchFoodAlertService, fetchGetQuestionarieAttachmentApi, fetchGetQuestionarieApi, fetchNocChecklist, fetchGetCampaignChecklistApi, fetchClosureInspection, fetchSupervisoryEstDetails, followUpMergeApi, fetchGetAssessmentAPI
};