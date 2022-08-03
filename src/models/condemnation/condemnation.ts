import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';

import { fetchGetQuestionarieAttachmentApi, submitCondemnationService } from './../../services/WebServices';
export type condemnationStoreModel = Instance<typeof condemnation>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import NavigationService from '../../services/NavigationService';
import TaskSchema from '../../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let moment = require('moment');
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
import { isDev } from '../../config/config';


const condemnation = types.model('condemnationModel', {
    serialNumber: types.string,
    productName: types.string,
    unit: types.string,
    quantity: types.string,
    netWeight: types.string,
    package: types.string,
    batchNumber: types.string,
    brandName: types.string,
    remarks: types.string,
    place: types.string,
    reason: types.string,
    attachment1: types.string,
    attachment2: types.string,
    condemnationArray: types.string,
    getQuestionarieAttachmentResponse: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate"]),
    loadingState: types.enumeration("State", ["", "Submitting Condemnation"]),
}).actions(self => ({

    setClearData() {
        self.serialNumber = '';
        self.productName = '';
        self.unit = '';
        self.quantity = '';
        self.netWeight = '';
        self.package = '';
        self.batchNumber = '';
        self.brandName = '';
        self.remarks = '';
        self.place = '';
        self.reason = '';
        self.attachment1 = '';
        self.attachment2 = '';
    },

    callToSubmitCondemnationService: flow(function* (taskDetails: any, businessActivity: string) {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = "Submitting Condemnation";
        try {

            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.taskId);
            let inspectionDetails = taskData['0'] ? taskData['0'] : taskDetails
            let mappingData = (typeof (inspectionDetails.mappingData) == 'string') && (inspectionDetails.mappingData != '') ? JSON.parse(inspectionDetails.mappingData) : taskDetails.mappingData;
            let condemnationReportLength = mappingData['0'].condemnationReport ? mappingData['0'].condemnationReport.length : 0,
                samplingReportLength = mappingData['0'].samplingReport ? mappingData['0'].samplingReport.length : 0,
                detentionReportLength = mappingData['0'].detentionReport ? mappingData['0'].detentionReport.length : 0

            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            debugger;
            let arr = self.condemnationArray != '' ? JSON.parse(self.condemnationArray) : [], subPayload = [];

            for (let index = 0; index < arr.length; index++) {

                const element = arr[index];
                let obj = {
                    "Latitude": "",
                    "Longitude": "",
                    "IntegrationId": samplingReportLength + detentionReportLength + parseInt(element.serialNumber),
                    "Temprature": "",
                    "Volume": element.netWeight,
                    "DetentionFlag": "Y",
                    "DetentionAction": "",
                    "Comments": element.remarks,
                    "BrandName": element.brandName,
                    "UnitofMeasure": element.unit,
                    "ProductionDate": "",
                    "Container": "",
                    "BatchNumber": element.batchNumber,
                    "PackingType": element.package,
                    "Place": element.place,
                    "ProductName": element.productName,
                    "BusinessActivity": businessActivity,
                    "Analysis": "",
                    "InspectionType": "Condemnation",
                    "Reason": element.reason,
                    "CountryofOrigin": "",
                    "ExpiryDate": "",
                    "NoofItems": element.quantity,
                    "Code": element.serialNumber,
                    "MadeInCountry": ""
                }
                subPayload.push(obj);
            }

            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_008",
                "LanguageType": "ENU",
                "InspectorName": loginData.username,
                "SamplingDetentionCondemnationTask": {
                    "TaskDetails": {
                        "TaskId": taskDetails.TaskId,
                        "ListOfAdfcaActionFollowUpActionsInt": {
                            "InspectionTaskType": subPayload
                        }
                    }
                },
                "InspectorId": loginData.username
            }
            console.log(JSON.stringify(payload))

            let response: any = yield submitCondemnationService(payload);
            debugger;
            if (response) {
                if (isDev) {
                    var path = DownloadDirectoryPath + '/' + taskDetails.TaskId + "_con.txt";
                    writeFile(path, JSON.stringify({payload,response}), 'utf8')
                        .then((success) => {
        
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });    
                }
                
                    
                if (response.Status == 'Success') {
                    
                    let objct = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.TaskId);
                    let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
                    inspectionDetails.condemnationFlag = true;
                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task updated successfully ', 1000);
                        // NavigationService.replace("StartInspection");
                        // NavigationService.goBack();

                    });
                    
                    let attachmentTemp = Array()
                    for (let index = 0; index < arr.length; index++) {
                        const elementAtt = arr[index];
                        let base64one = elementAtt.attachment1 != '' ? JSON.parse(elementAtt.attachment1).image1Base64 : '';
                        let base64two = elementAtt.attachment2 != '' ? JSON.parse(elementAtt.attachment2).image2Base64 : '';
                        let tmp = [base64one, base64two]

                        for (let i = 0; i < tmp.length; i++) {
                            const element = tmp[i];
                            if (element && element != '') {
                                let payloadAttachment = {
                                    "InterfaceID": "ADFCA_CRM_SBL_039",
                                    "LanguageType": "ENU",
                                    "InspectorId": [
                                        loginData.username
                                    ],
                                    "InspectorName": loginData.username,
                                    "Checklistattachment": {
                                        "Inspection": {
                                            "TaskId": taskDetails.TaskId,
                                            "ListOfActionAttachment": {
                                                "QuestAttachment": {
                                                    "FileExt": "jpg",
                                                    "FileName": "Condemnation_image_" + index + "_" + i + ".jpg",
                                                    "FileSize": "",
                                                    "FileSrcPath": "",
                                                    "FileSrcType": "",
                                                    "Comment": "",
                                                    "FileBuffer": element
                                                }
                                            }
                                        }
                                    }
                                }

                                attachmentTemp.push(payloadAttachment)
                                // console.log("JSON"+JSON.stringify(payloadAttachment))
                                // let getQuestionarieAttachmentResponse = yield fetchGetQuestionarieAttachmentApi(payloadAttachment);
                                // // }
                                // debugger;

                                // // NavigationService.navigate('StartInspection');
                                // if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                                //     self.state = 'done';
                                //     debugger;
                                // }
                                // else {
                                //     ToastAndroid.show('Failed To Upload Attachment', 1000);
                                // }
                            }
                        }
                    }

                    yield Promise.all(attachmentTemp.map(async (element, index) => {
                        let getQuestionarieAttachmentResponse = Object();
                        
                        if (element) {

                            getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(element);

                            if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                            }
                            else {
                                ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                            }
                        }
                    }
                    )).then(results => {
                        console.log("results>>" + results);
                    }).catch(err => {
                        Alert.alert('', 'Failed To Upload Attachment');
                        console.log("err?>>" + err);
                    });

                    ToastAndroid.show(' Success', 1000);
                    self.loadingState = "";
                    self.state = 'navigate';
                }
                else {
                    debugger;
                    self.loadingState = "";
                    // NavigationService.navigate('StartInspection');
                    //console.log(JSON.stringify(response))
                    ToastAndroid.show(response.ErrorMessage ? response.ErrorMessage : ' Failed', 1000);
                    self.state = "error";
                }
                // });
            }


        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

    setCondemnationArray(condemnationArray: string) {
        self.condemnationArray = condemnationArray
    },
    setSerialNumber(serialNumber: string) {
        self.serialNumber = serialNumber
    },
    setProductName(productName: string) {
        self.productName = productName
    },
    setUnit(unit: string) {
        self.unit = unit
    },
    setQuantity(quantity: string) {
        self.quantity = quantity
    },
    setNeWeight(netWeight: string) {
        self.netWeight = netWeight
    },
    setPackage(packages: string) {
        self.package = packages
    },
    setBatchNumber(batchNumber: string) {
        self.batchNumber = batchNumber
    },
    setBrandName(brandName: string) {
        self.brandName = brandName
    },
    setremarks(remarks: string) {
        self.remarks = remarks
    },
    setPlace(place: string) {
        self.place = place
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },
    setState(state: string) {
        self.state = state
    },
    callToGetCondemnationAttachmentApi: flow(function* (taskId: string, base64: string) {
        // {
        self.state = "pending"
        try {

            let payload = `<?xml version="1.0" encoding="UTF-8"?>
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:gbl="http://xmlns.oracle.com/MOB_DEV_ADFCA/gbl_ADFCA_SERV_InspectionAcknowledge/gbl_ADFCA_SERV_InspectionAcknowledgeBPEL">
                <soap:Header>
                    <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" soap:mustUnderstand="1">
                        <wsse:UsernameToken xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" wsu:Id="UsernameToken-s9LhJx1IoeAq7HNLsrIyjw22">
                            <wsse:Username>soauser</wsse:Username>
                            <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">soauser123</wsse:Password>
                        </wsse:UsernameToken>
                    </wsse:Security>
                </soap:Header>
                <soap:Body>
                    <gbl:AttachUpdate_Input xmlns:gbl="http://xmlns.oracle.com/MOB_DEV_ADFCA/GBL_ADFCA_SERV_QuestionnairesAttachment/GBL_ADFCA_SERV_QuestionnairesAttachmentBPEL">
                        <gbl:InterfaceID>ADFCA_CRM_SBL_039</gbl:InterfaceID>
                        <gbl:LanguageType>ARA</gbl:LanguageType>
                        <gbl:InspectorId>SALEH.BALKHAIR</gbl:InspectorId>
                        <gbl:InspectorName>SALEH BALKHAIR</gbl:InspectorName>
                        <gbl:Checklistattachment>
                            <gbl:Inspection>
                                <gbl:TaskId>`+ taskId + `</gbl:TaskId>
                                <gbl:ListOfActionAttachment>
                                    <gbl:QuestAttachment>
                                        <gbl:FileExt>jpg</gbl:FileExt>
                                        <gbl:FileName>image_0_1</gbl:FileName>
                                        <gbl:FileSize/>
                                        <gbl:FileSrcPath></gbl:FileSrcPath>
                                        <gbl:FileSrcType></gbl:FileSrcType>
                                        <gbl:Comment></gbl:Comment>
                                        <gbl:FileBuffer>` + base64 + `</gbl:FileBuffer>
                                    </gbl:QuestAttachment>
                                </gbl:ListOfActionAttachment>
                            </gbl:Inspection>
                        </gbl:Checklistattachment>
                        <gbl:InspectorId></gbl:InspectorId>
                    </gbl:AttachUpdate_Input>
                </soap:Body>
            </soap:Envelope>`;
            let getQuestionarieAttachmentResponse = yield fetchGetQuestionarieAttachmentApi(payload);
            debugger;
            if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                self.state = 'done'
                // Alert.alert('checklistResponse' + JSON.stringify(getChecklistResponse))
                self.getQuestionarieAttachmentResponse = JSON.stringify(getQuestionarieAttachmentResponse);
                // alert(JSON.stringify(getQuestionarieAttachmentResponse));
                // let parseString = require('react-native-xml2js').parseString;
                // let xml = getQuestionarieAttachmentResponse;
                debugger;
            }
            else {
                ToastAndroid.show('Failed To Upload Attachment,ErrorMessage:'+getQuestionarieAttachmentResponse.ErrorMessage, 1000);
            }
        }
        catch (e) {
            // alert('Exception' + e);
        }

        // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
        self.state = "error";

    }),

})).views(self => ({


}));


export default condemnation;
