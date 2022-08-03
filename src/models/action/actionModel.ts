import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type actionStoreModel = Instance<typeof ActionStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import TaskSchema from '../../database/TaskSchema'
import { ToastAndroid, Alert } from 'react-native';
import NavigationService from './../../services/NavigationService';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import { fetchAcknowldgeApi, LoginService } from './../../services/WebServices';
let realm = RealmController.getRealmInstance();


const ActionStore = types.model('ActionModel', {
    latitude: types.string,
    longitude: types.string,
    taskId: types.string,
    establishment: types.string,
    reason: types.string,
    comments: types.string,
    proposedDate: types.string,
    isPostPoned: types.boolean,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",]),
    loadingState: types.enumeration("loadingState", ['', 'Updating Action']),
}).actions(self => ({

    setActionDataBlank() {
        self.taskId = '',
            self.establishment = '',
            self.reason = '',
            self.comments = '',
            self.proposedDate = '',
            self.state = 'done'
    },
    setLatitude(latitude: string) {
        self.latitude = latitude
    },
    setLongitude(longitude: string) {
        self.longitude = longitude
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setEstablishment(establishment: string) {
        self.establishment = establishment
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setComments(comments: string) {
        self.comments = comments
    },
    setProposedDate(proposedDate: string) {
        self.proposedDate = proposedDate
    },
    setIsPostPoned(isPostPoned: boolean) {
        self.isPostPoned = isPostPoned
    },

    callToPosponeTask: flow(function* () {

        self.state = "pending";
        self.loadingState = 'Updating Action';
        try {

            var date = Date.now();
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

            // //console.log("Login info", loginInfo)

            // let obj = {
            //     taskId: self.taskId,
            //     comments: self.comments,
            //     reason:self.reason,
            //     establishment:self.establishment,
            //     proposedDate:self.proposedDate,
            // }
            var date1 = new Date();

            var dateToSend = ("00" + (date1.getMonth() + 1)).slice(-2) + "/" +
                ("00" + date1.getDate()).slice(-2) + "/" +
                date1.getFullYear() + " " +
                ("00" + date1.getHours()).slice(-2) + ":" +
                ("00" + date1.getMinutes()).slice(-2) + ":" +
                ("00" + date1.getSeconds()).slice(-2);

            let obj = {
                "InterfaceID": "ADFCA_CRM_SBL_068",
                "Longitude": self.longitude,
                "Latitude": self.latitude,
                "DateTime": dateToSend,
                "Comments": self.comments,
                "LanguageType": "ENU",
                "InspectorName": "",
                "RequestType": "",
                "Reason": self.reason,
                "TaskStatus": "",
                "TaskId": self.taskId,
                "InspectorId": "",
                "PreposedDateTime": self.proposedDate
            }
            console.log(JSON.stringify(obj))
            let getAcknowldgeResponse = yield fetchAcknowldgeApi(obj);
            if (getAcknowldgeResponse && getAcknowldgeResponse.Status == 'Success') {
                self.isPostPoned = true;
                self.state = 'navigate';
                self.loadingState = '';
                let loginInfo = RealmController.deleteTaskById(realm, self.taskId, () => {

                });

                NavigationService.navigate('Dashboard');
            } else {
                self.state = 'error';
                self.loadingState = '';
                ToastAndroid.show('Failed', 1000);
            }

        } catch (error) {

            self.state = "error"
            // //console.log("Error while calling action call url from action draft", error)
        }

    }),

    callToLovDataByKeyService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            // ... yield can be used in async/await style
            let payload = {
                "Type": "shop_types"
            }
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
            let auth = '';

            if (loginInfo && loginInfo[0] && loginInfo[0].loginResponse) {
                auth = "Bearer " + JSON.parse(loginInfo[0].loginResponse).Data.JWT;
            }


        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),


})).views(self => ({
    getTaskId() {
        return self.taskId
    },
    getEstablishment() {
        return self.establishment
    },
    getReason() {
        return self.reason
    },
    getComments() {
        return self.comments
    },
    getProposedDate() {
        return self.proposedDate
    },

}));


export default ActionStore;
