import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof AboutLastReportStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const AboutLastReportStore = types.model('AboutLastReportModel', {
    tasktype: types.string,
    creationDate: types.string,
    score: types.string,
    grade: types.string,
    action: types.string,
    businessActivity: types.string,
    status: types.string,
    actualInspectionDate: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setAboutLastReportDataBlank() {
        self.tasktype = '',
            self.creationDate = '',
            self.score = '',
            self.grade = '',
            self.action = '',
            self.businessActivity = '',
            self.status = '',
            self.actualInspectionDate = '',
            self.state = 'done'
    },
    setTaskType(tasktype: string) {
        self.tasktype = tasktype
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setScore(score: string) {
        self.score = score
    },
    setGrade(grade: string) {
        self.grade = grade
    },
    setAction(action: string) {
        self.action = action
    },
    setBusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setStatus(status: string) {
        self.status = status
    },
    setActualInspectionDate(actualInspectionDate: string) {
        self.actualInspectionDate = actualInspectionDate
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
    getTaskType() {
        return self.tasktype
    },
    getCreationDate() {
        return self.creationDate
    },
    getScore() {
        return self.score
    },
    getGrade() {
        return self.grade
    },
    getAction() {
        return self.action
    },
    getBusinessActivity() {
        return self.businessActivity
    },
    getStatus() {
        return self.status
    },
    getActualInspectionDate() {
        return self.actualInspectionDate
    },

}));


export default AboutLastReportStore;
