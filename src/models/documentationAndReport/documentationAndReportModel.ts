import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type documentStoreModel = Instance<typeof DocumentationAndReportStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { Alert, ToastAndroid } from 'react-native';
let realm = RealmController.getRealmInstance();
import { fetchGetSignature } from './../../services/WebServices';


const DocumentationAndReportStore = types.model('DocumentationAndReportModel', {

    taskId: types.string,
    fileExtention: types.string,
    fileName: types.string,
    fileBuffer: types.string,
    saveImageFlag: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setDocumentationAndReportDataBlank() {
        self.taskId = '',
            self.fileExtention = '',
            self.fileName = '',
            self.fileBuffer = '',
            self.saveImageFlag = '',
            self.state = 'done'
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setFileExtention(fileExtention: string) {
        self.fileExtention = fileExtention
    },
    setFileName(fileName: string) {
        self.fileName = fileName
    },
    setFileBuffer(fileBuffer: string) {
        self.fileBuffer = fileBuffer
        // //console.log("file buffer output", self.fileBuffer);
    },
    setSaveImageFlag(saveImageFlag: string) {
        self.saveImageFlag = saveImageFlag
    },
    postToSignature: flow(function* () {
        // <- note the star, this a generator function

        self.state = "pending"
        try {
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

            // //console.log("Login info", loginInfo)

            let obj = {
                taskId: self.taskId,
                // comments: self.comments,
                fileBuffer: self.fileBuffer,
                fileExtention: self.fileExtention,
                fileName: self.fileName,
            }

            let documentResponse = yield fetchGetSignature(obj);
            // var parseString = require('react-native-xml2js').parseString;
            // var xml = documentResponse;

            // parseString(xml, function (err: string, result: any) {

            //     let documentResponse = result['env:Envelope']['env:Body'][0]['ns0:AttachUpdate_Output'][0]['ns0:Status'];

            if (documentResponse.Status == 'Success') {
                // ToastAndroid.show('Signature added successfully ', 1000);
                // Alert.alert('Signature added successfully');
            }
            else {
                // Alert.alert('Signature is not added');
                // ToastAndroid.show('Signature is not added', 1000);
            }
            // });


        } catch (error) {

            self.state = "error"
            // //console.log("Error", error)
        }

    }),

})).views(self => ({


    getTaskId() {
        return self.taskId
    },

    getFileName() {
        return self.fileName
    },
    getFileExtention() {
        return self.fileExtention
    },
    getFileBuffer() {
        return self.fileBuffer
    },


}));


export default DocumentationAndReportStore;
