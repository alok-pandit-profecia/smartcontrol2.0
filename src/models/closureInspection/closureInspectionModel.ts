import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';
export type closureInspectionStoreModel = Instance<typeof ClosureInspectionStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { Alert, ToastAndroid } from 'react-native';
let realm = RealmController.getRealmInstance();
import { fetchClosureInspection } from './../../services/WebServices';
import { fetchGetSignature } from './../../services/WebServices';
import { fetchGetQuestionarieAttachmentApi, InspectionSubmitService } from './../../services/WebServices';
import NavigationService from '../../services/NavigationService';
import TaskSchema from '../../database/TaskSchema';
let moment = require('moment');


const ClosureInspectionStore = types.model('ClosureInspectionModel', {

    taskId: types.string,
    taskType: types.string,
    englishTradeName: types.string,
    licenseNo: types.string,
    address: types.string,
    inspectorName: types.string,
    comment: types.string,
    fileBuffer: types.string,
    image: types.string,
    imageExtension: types.string,
    saveImageFlag: types.string,
    nameOfBusinessOperator: types.string,
    attachmentOne: types.string,
    attachmentTwo: types.string,
    attachmentThree: types.string,
    attachmentFour: types.string,
    attachmentFive: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "clouserAttachmentSuccess", "clouserSubmit"]),
    loadingState: types.enumeration("loadingState", ['', 'Please stay on this page until submission is completed.', 'Uploading Attachments'])

}).actions(self => ({

    setDocumentationAndReportDataBlank() {
        self.taskId = '',
            self.taskType = '',
            self.englishTradeName = '',
            self.licenseNo = '',
            self.address = '',
            self.inspectorName = '',
            self.comment = '',
            self.fileBuffer = '',
            self.image = '',
            self.imageExtension = '',
            self.saveImageFlag = '',
            self.state = 'done'
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setLicenseNumber(licenseNo: string) {
        self.licenseNo = licenseNo
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },
    setEnglishTradeName(englishTradeName: string) {
        self.englishTradeName = englishTradeName
    },
    setAddress(address: string) {
        self.address = address
    },
    setComment(comment: string) {
        self.comment = comment
    },
    setInspectorName(inspectorName: string) {
        self.inspectorName = inspectorName
    },
    setFileBuffer(fileBuffer: string) {
        self.fileBuffer = fileBuffer
    },
    setImage(image: string) {
        self.image = image
    },
    setImageExtension(imageExtension: string) {
        self.imageExtension
    },
    setSaveImageFlag(saveImageFlag: string) {
        self.saveImageFlag = saveImageFlag
    },
    setNameOfBusinessOperator(nameOfBusinessOperator: string) {
        self.nameOfBusinessOperator = nameOfBusinessOperator
    },
    setAttachmentOne(attachmentOne: string) {
        self.attachmentOne = attachmentOne
    },
    setAttachmentTwo(attachmentTwo: string) {
        self.attachmentTwo = attachmentTwo
    },
    setAttachmentThree(attachmentThree: string) {
        self.attachmentThree = attachmentThree
    },
    setAttachmentFour(attachmentFour: string) {
        self.attachmentFour = attachmentFour
    },
    setAttachmentFive(attachmentFive: string) {
        self.attachmentFive = attachmentFive
    },
    callToClosureInspectionChecklist: flow(function* (payload: any) {
        {
            self.state = "pending";
            self.loadingState = "Please stay on this page until submission is completed.";
            try {

                let TaskSubmitApiResponse = yield fetchClosureInspection(payload);
                debugger;
                // alert("res" + JSON.stringify(TaskSubmitApiResponse))
                if (TaskSubmitApiResponse && TaskSubmitApiResponse.Status == "Success") {
                    //ToastAndroid.show('Task submited successfully ', 1000);
                    // self.TaskSubmitApiResponse = JSON.stringify(TaskSubmitApiResponse);
                    self.state = 'navigate'
                }
                else {
                    // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                    //  ToastAndroid.show('Failed submit Task', 1000);
                    self.state = "error";
                    self.loadingState = "";
                }

            } catch (error) {
                // ... including try/catch error handling
                self.state = "error";
                self.loadingState = "";
            }
        }
    }),

    postToSignature: flow(function* () {
        // <- note the star, this a generator function

        self.state = "pending";

        try {
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

            // //console.log("Login info", loginInfo)

            let obj = {
                taskId: self.taskId,
                fileBuffer: self.fileBuffer
            }

            let documentResponse = yield fetchGetSignature(obj);

            if (documentResponse.Status == 'Success') {
                self.loadingState = "";
                // ToastAndroid.show('Signature added successfully ', 1000);
                // Alert.alert('Signature added successfully');
            }
            else {
                self.loadingState = "";
                // Alert.alert('Signature is not added');
                // ToastAndroid.show('Signature is not added', 1000);
            }
            // });
        } catch (error) {
            self.state = "error";
            self.loadingState = "";
        }

    }),


    callToAttachmentApi: flow(function* (taskId: string, base64: any, userName: string, payload: any, taskDetails: any) {
        // {
        self.state = "pending";
        self.loadingState = "Uploading Attachments";

        try {

            // let taskDetails = { ...JSON.parse(objct) }
            let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
            mappingData.isCompltedOffline = true;
            taskDetails.mappingData = mappingData;

            //console.log('base64' + JSON.stringify(base64));
            for (let index = 0; index < base64.length; index++) {

                if (index == base64.length - 1) {
                    break;
                }
                else {
                    const element = base64[index];
                    let imgName = index == 0 ? 'one' : index == 1 ? 'two' : index == 2 ? 'three' : index == 3 ? 'four' : 'five'


                    if (element && element != '') {

                        let payloadAttachment = {
                            "InterfaceID": "ADFCA_CRM_SBL_039",
                            "LanguageType": "ENU",
                            "InspectorId": [
                                userName
                            ],
                            "InspectorName": userName,
                            "Checklistattachment": {
                                "Inspection": {
                                    "TaskId": taskId,
                                    "ListOfActionAttachment": {
                                        "QuestAttachment": {
                                            "FileExt": "jpg",
                                            "FileName": "imageAttachment_" + imgName,
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

                        let getQuestionarieAttachmentResponse = yield fetchGetQuestionarieAttachmentApi(payloadAttachment);
                        debugger;
                        if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                            continue;
                            debugger;
                        }
                        else {
                            ToastAndroid.show('Failed To Upload Attachment', 1000);
                            continue;
                        }
                    }
                    else {
                        continue;
                    }

                }
            }
            // if (index == base64.length - 1) {
            // alert('task submitted');
            self.state = 'clouserAttachmentSuccess';
            self.loadingState = "";

            self.state = "pending";
            self.loadingState = "Please stay on this page until submission is completed.";
          
            let TaskSubmitApiResponse = yield InspectionSubmitService(payload, 'Closure Inspection');
            if (TaskSubmitApiResponse && TaskSubmitApiResponse.Status == "Success") {
                // let obj = {
                //     taskId: self.taskId,
                //     fileBuffer: self.fileBuffer
                // }

                // let documentResponse = yield fetchGetSignature(obj);

                // if (documentResponse.Status == 'Success') {
                    self.state = 'clouserSubmit';
                    self.loadingState = '';
                    taskDetails.isCompleted = true;
                    taskDetails.TaskStatus = 'Completed';
                    const format1 = "YYYY-MM-DD HH:mm:ss"

                    taskDetails.CompletionDate = moment(new Date()).format(format1);

                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                        Alert.alert('', 'Task Submitted Successfully');
                        NavigationService.navigate('Dashboard');
                    });
                    // ToastAndroid.show('Signature added successfully ', 1000);
                //     // Alert.alert('Signature added successfully');
                // }
                // else {
                //     Alert.alert('', 'Clouser failed to submit');
                //     self.state = 'done';
                //     self.loadingState = "";

                // }

            }
            else {
                Alert.alert('', 'Clouser failed to submit');
                self.state = 'done';
                self.loadingState = "";

            }
            // }
            // else {
            //     self.loadingState = "";
            //     self.state = 'done';
            //     ToastAndroid.show('Failed To Upload Attachment', 1000);
            // }
        }
        catch (e) {
            console.log('Exception' + e);
        // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
            self.state = "error";
        }
    }),


})).views(self => ({


    getTaskId() {
        return self.taskId
    },

    getTaskType() {
        return self.taskType
    },
    getEnglishTradeName() {
        return self.englishTradeName
    },
    getAddress() {
        return self.address
    },
    getLicenseNumber() {
        return self.licenseNo
    },
    getInspectorName() {
        return self.inspectorName
    },
    getComment() {
       return  self.comment 
    },
    getFileBuffer() {
       return self.fileBuffer
    },
    getImage(image: string) {
        self.image = image
    },
    getImageExtension(imageExtension: string) {
        self.imageExtension = imageExtension
    },
    getSaveImageFlag() {
        return self.saveImageFlag
    },

}));


export default ClosureInspectionStore;
