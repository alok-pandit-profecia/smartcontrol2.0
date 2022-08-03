import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type inspectionStoreModel = Instance<typeof TemporaryPermitsInspectionsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const TemporaryPermitsInspectionsStore = types.model('TemporaryPermitsInspectionsModel', {
    taskId: types.number,
    taskType: types.string,
    creationDate: types.string,
    businessActivity: types.string,
    subBusinessActivity: types.string,
    description: types.string,
    risk: types.string,
    sheduledDate: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setTemporaryPermitsInspectionDataBlank() {
        self.taskId = 0,
            self.taskType = '',
            self.creationDate = '',
            self.businessActivity = '',
            self.subBusinessActivity = '',
            self.description = '',
            self.risk = '',
            self.sheduledDate = '',
            self.state = 'done'
    },

    setTaskId(taskId: number) {
        self.taskId = taskId
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setBusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setSubBusinessActivity(subBusinessActivity: string) {
        self.subBusinessActivity = subBusinessActivity
    },
    setDescripion(description: string) {
        self.description = description
    },

    setRisk(risk: string) {
        self.risk = risk
    },
    setSheduledDate(sheduledDate: string) {
        self.sheduledDate = sheduledDate
    },

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
    setTaskId() {
        return self.taskId
    },
    setTaskType() {
        return self.taskType
    },
    setCreationDate() {
        return self.creationDate
    },
    setBusinessActivity() {
        return self.businessActivity
    },
    setSubBusinessActivity() {
        return self.subBusinessActivity
    },
    setDescripion() {
        return self.description
    },
    setRisk() {
        return self.risk
    },
    setSheduledDate() {
        return self.sheduledDate
    },

}));


export default TemporaryPermitsInspectionsStore;
