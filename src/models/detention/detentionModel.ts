import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';
export type detentionStoreModel = Instance<typeof detentionModel>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import NavigationService from '../../services/NavigationService';
import { ToastAndroid, Alert } from 'react-native';
import { fetchGetQuestionarieAttachmentApi, submitCondemnationService } from './../../services/WebServices';
import TaskSchema from '../../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let moment = require('moment');
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
import { isDev } from '../../config/config';

const detentionModel = types.model('detentionModel', {
    serialNumber: types.string,
    productName: types.string,
    detentionArray: types.string,
    type: types.string,
    unit: types.string,
    quantity: types.string,
    netWeight: types.string,
    package: types.string,
    batchNumber: types.string,
    brandName: types.string,
    productionDate: types.string,
    expiryDate: types.string,
    countryOfOrigin: types.string,
    remarks: types.string,
    reason: types.string,
    decisions: types.string,
    attachment1: types.string,
    attachment2: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate"]),
    loadingState: types.enumeration("State", ["", "Submitting Detention"])
}).actions(self => ({

    setClearData() {
        self.serialNumber = '';
        self.type = '';
        self.unit = '';
        self.quantity = '';
        self.netWeight = '';
        self.package = '';
        self.batchNumber = '';
        self.brandName = '';
        self.productionDate = '';
        self.expiryDate = '';
        self.reason = '';
        self.countryOfOrigin = '';
        self.remarks = '';
        self.decisions = '';
        self.attachment1 = '';
        self.attachment2 = '';

    },

    callToSubmitDetentionService: flow(function* (taskDetails: any, businessActivity: string) {
   
        try {

            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.taskId);
            let inspectionDetails = taskData['0'] ? taskData['0'] : taskDetails
            let mappingData = (typeof (inspectionDetails.mappingData) == 'string') && (inspectionDetails.mappingData != '') ? JSON.parse(inspectionDetails.mappingData) : taskDetails.mappingData;
            let condemnationReportLength = mappingData['0'].condemnationReport ? mappingData['0'].condemnationReport.length : 0,
                samplingReportLength = mappingData['0'].samplingReport ? mappingData['0'].samplingReport.length : 0,
                detentionReportLength = mappingData['0'].detentionReport ? mappingData['0'].detentionReport.length : 0

            self.state = "pending";
            self.loadingState = 'Submitting Detention';
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            debugger
            let arr = self.detentionArray != '' ? JSON.parse(self.detentionArray) : [], subPayload = [];

            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];

                let obj = {
                    "Latitude": "",
                    "Longitude": "",
                    "IntegrationId": samplingReportLength + condemnationReportLength + parseInt(element.serialNumber),
                    "Temprature": '10',
                    "Volume": element.netWeight,
                    "DetentionFlag": "Y",
                    "DetentionAction": element.reason,
                    "Comments": element.remarks,
                    "BrandName": element.brandName,
                    "UnitofMeasure": element.unit,
                    "ProductionDate": element.productionDate,
                    "Container": "2",
                    "BatchNumber": element.batchNumber,
                    "PackingType": element.package,
                    "Place": '',
                    "ProductName": '',
                    "BusinessActivity": businessActivity,
                    "Analysis": "",
                    "InspectionType": "Detention",
                    "Reason": element.reason,
                    "CountryofOrigin": element.countryOfOrigin,
                    "ExpiryDate": element.expiryDate,
                    "NoofItems": element.quantity,
                    "Code": element.serialNumber,
                    "MadeInCountry": element.countryOfOrigin
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

            //console.log(JSON.stringify(payload))
            let response: any = yield submitCondemnationService(payload);
            debugger;
            if (response && response != '') {

                
                if (isDev) {
                    var path = DownloadDirectoryPath + '/' + taskDetails.TaskId + "_det.txt";
                    writeFile(path, JSON.stringify({ payload, response }), 'utf8')
                        .then((success) => {
    
                        })
                        .catch((err) => {
                            console.log(err.message);
                        });    
                }
                
                if (response.Status == 'Success') {
                    // self.loadingState = '';
                    // ToastAndroid.show(' Success', 1000);

                    let objct = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.TaskId);
                    let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
                    inspectionDetails.detentionFlag = true;
                    //console.log("after::"+JSON.stringify(inspectionDetails.mappingData))

                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task updated successfully ', 1000);
                        // NavigationService.goBack();
                        // NavigationService.replace("StartInspection");

                    });

                    // NavigationService.goBack();
                    // NavigationService.navigate('StartInspection');
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
                                                    "FileName": "Detention_image_" + index + "_" + i + ".jpg",
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
                                // console.log(JSON.stringify(payloadAttachment))
                                // let getQuestionarieAttachmentResponse = yield fetchGetQuestionarieAttachmentApi(payloadAttachment);
                                // // }
                                // debugger;
                                // if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                                //     self.state = 'done'
                                //     // Alert.alert('checklistResponse' + JSON.stringify(getChecklistResponse))
                                //     // self.getQuestionarieAttachmentResponse = JSON.stringify(getQuestionarieAttachmentResponse);
                                //     // alert(JSON.stringify(getQuestionarieAttachmentResponse));
                                //     // let parseString = require('react-native-xml2js').parseString;
                                //     // let xml = getQuestionarieAttachmentResponse;
                                //     debugger;
                                // }
                                // else {
                                //     ToastAndroid.show('Failed To Upload Attachment,ErrorMessage:'+getQuestionarieAttachmentResponse.ErrorMessage, 1000);
                                // }
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
                }
                else {
                    debugger;
                    self.loadingState = '';
                    ToastAndroid.show(response.ErrorMessage && response.ErrorMessage != "" ? response.ErrorMessage : ' Failed', 1000);
                    // NavigationService.goBack();
                    self.state = "error";
                }
                // });
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

    setDetentionArray(detentionArray: string) {
        self.detentionArray = detentionArray
    },
    setSerialNumber(serialNumber: string) {
        self.serialNumber = serialNumber
    },
    setProductname(data: string) {
        self.productName = data
    },
    setType(type: string) {
        self.type = type
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
    setProductionDate(productionDate: string) {
        self.productionDate = productionDate
    },
    setExpiryDate(data: string) {
        self.expiryDate = data
    },
    setCountryOfOrigin(countryOfOrigin: string) {
        self.countryOfOrigin = countryOfOrigin
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setRemarks(remarks: string) {
        self.remarks = remarks
    },
    setDecisions(decisions: string) {
        self.decisions = decisions
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },
    setState(state: string) {
        self.state = state
    }

})).views(self => ({

}));


export default detentionModel;
