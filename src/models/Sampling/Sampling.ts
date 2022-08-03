import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type samplingStoreModel = Instance<typeof Sampling>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { fetchGetQuestionarieAttachmentApi, submitCondemnationService } from './../../services/WebServices';
import NavigationService from '../../services/NavigationService';
import TaskSchema from '../../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let moment = require('moment');
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
import { isDev } from '../../config/config';

const Sampling = types.model('samplingModel', {
    samplingArray: types.string,
    serialNumber: types.string,
    sampleCollectionReason: types.string,
    sampleName: types.string,
    dateofSample: types.string,
    sampleState: types.string,
    sampleTemperature: types.string,
    remainingQuantity: types.string,
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
    attachment1: types.string,
    attachment2: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate"]),
    loadingState: types.enumeration("State", ['', 'Submitting Sampling'])
}).actions(self => ({

    setClearData() {
        self.serialNumber = '';
        self.sampleCollectionReason = '';
        self.sampleName = '';
        self.dateofSample = '';
        self.sampleState = '';
        self.sampleTemperature = '';
        self.remainingQuantity = '';
        self.type = '';
        self.unit = '';
        self.quantity = '';
        self.netWeight = '';
        self.package = '';
        self.batchNumber = '';
        self.brandName = '';
        self.productionDate = '';
        self.expiryDate = '';
        self.countryOfOrigin = '';
        self.remarks = '';
        self.attachment1 = '';
        self.attachment2 = '';
    },
    setSamplingArray(samplingArray: string) {
        self.samplingArray = samplingArray
    },
    setSerialNumber(serialNumber: string) {
        self.serialNumber = serialNumber
    },
    setSampleCollectionReason(sampleCollectionReason: string) {
        self.sampleCollectionReason = sampleCollectionReason
    },
    setSampleState(sampleCollectionReason: string) {
        self.sampleState = sampleCollectionReason
    },
    setSampleName(sampleName: string) {
        self.sampleName = sampleName
    },
    setDateofSample(dateofSample: string) {
        self.dateofSample = dateofSample
    },
    setSampleTemperature(sampleTemperatures: string) {
        self.sampleTemperature = sampleTemperatures
    },
    setRemainingQuantity(remainingQuantity: string) {
        self.remainingQuantity = remainingQuantity
    },
    setType(type: string) {
        self.type = type
    },
    setremarks(remarks: string) {
        self.remarks = remarks
    },
    setUnit(data: string) {
        self.unit = data
    },
    setquantity(data: string) {
        self.quantity = data
    },
    setnetWeight(data: string) {
        self.netWeight = data
    },
    setpackage(data: string) {
        self.package = data
    },
    setbatchNumber(data: string) {
        self.batchNumber = data
    },
    setbrandName(data: string) {
        self.brandName = data
    },
    setproductionDate(data: string) {
        self.productionDate = data
    },
    setExpiryDate(data: string) {
        self.expiryDate = data
    },
    setCountryOfOrigin(countryOfOrigin: string) {
        self.countryOfOrigin = countryOfOrigin
    },
    setRemarks(remarks: string) {
        self.remarks = remarks
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
    callToSubmitSamplingService: flow(function* (taskDetails: any, businessActivity: string) {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Submitting Sampling';
        try {

            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.taskId);
            let inspectionDetails = taskData['0'] ? taskData['0'] : taskDetails
            let mappingData = (typeof (inspectionDetails.mappingData) == 'string') && (inspectionDetails.mappingData != '') ? JSON.parse(inspectionDetails.mappingData) : taskDetails.mappingData;
            let condemnationReportLength = mappingData['0'].condemnationReport ? mappingData['0'].condemnationReport.length : 0,
                samplingReportLength = mappingData['0'].samplingReport ? mappingData['0'].samplingReport.length : 0,
                detentionReportLength = mappingData['0'].detentionReport ? mappingData['0'].detentionReport.length : 0


            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            debugger
            let arr = self.samplingArray != '' ? JSON.parse(self.samplingArray) : [], subPayload = [];

            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];

                let obj = {
                    "Latitude": "",
                    "Longitude": "",
                    "IntegrationId": condemnationReportLength + detentionReportLength + parseInt(element.serialNumber),
                    "Temprature": element.sampleTemperature,
                    "Volume": element.netWeight,
                    "DetentionFlag": "",
                    "DetentionAction": "",
                    "Comments": element.remarks,
                    "BrandName": element.brandName,
                    "UnitofMeasure": element.unit,
                    "ProductionDate": element.productionDate,
                    "Container": "",
                    "BatchNumber": element.batchNumber,
                    "PackingType": element.package,
                    "Place": '',
                    "ProductName": element.sampleName,
                    "BusinessActivity": businessActivity,
                    "Analysis": "",
                    "InspectionType": "Sampling",
                    "Reason": element.sampleCollectionReason,
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
            console.log("Samplingpayload::"+JSON.stringify(payload))
            // let response: any = undefined;
            let response: any = yield submitCondemnationService(payload);
            
            console.log("response::"+JSON.stringify(response))
            if (response) {
                if (isDev) {
                    var path = DownloadDirectoryPath + '/' + taskDetails.TaskId + "_sampling.txt";
                    writeFile(path, JSON.stringify({ payload, response }), 'utf8')
                        .then((success) => {

                        })
                        .catch((err) => {
                            console.log(err.message);
                        });
                }

                if (response.Status == 'Success') {

                    let objct = RealmController.getTaskDetails(realm, TaskSchema.name, taskDetails.TaskId);
                    let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
                    inspectionDetails.samplingFlag = true;
                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Sampling Task updated successfully ', 1000);

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
                                                    "FileName": "Sampling_image_" + index + "_" + i + ".jpg",
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

                                attachmentTemp.push(payloadAttachment);
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

                    self.loadingState = '';
                    ToastAndroid.show(' Success', 1000);

                    // if (attachmentTemp.length) {
                    //     let i = 0; // Global Variableconst arrayLength = 100 // Replace 100 with the actual array's length (the array that contains all tasks , not just my tasks) here

                    //     async function startSync(x: number) {

                    //         if (i < attachmentTemp.length) {
                    //             const element = attachmentTemp[x];
                    //             let getQuestionarieAttachmentResponse = Object();

                    //             if (element) {
                    //                 getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(element);
                    //             }
                    //             if (getQuestionarieAttachmentResponse.Status == "Success") {

                    //             }
                    //             else {
                    //                 ToastAndroid.show('Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage, 1000);
                    //             }
                    //             startSync(++i);
                    //         }
                    //     }

                    //     startSync(i);
                    // }

                    self.state = 'navigate';
                }
                else {
                    debugger;
                    ToastAndroid.show(response.ErrorMessage ? response.ErrorMessage : ' Failed', 1000);
                    self.state = "error";
                }
                // });
            }


        } catch (error) {
            // ... including try/catch error handling
           // console.log("SamplingError>>"+error)
            self.state = "error"
        }

    }),

})).views(self => ({


}));


export default Sampling;
