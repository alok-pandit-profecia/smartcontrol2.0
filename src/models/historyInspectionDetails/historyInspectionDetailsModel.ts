import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type  historyInspectionDetailsStoreModel = Instance<typeof  HistoryInspectionDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const  HistoryInspectionDetailsStore = types.model('HistoryInspectionDetailsModel', {
    inspectionNumber: types.number,
    taskType: types.string,
    creationDate: types.string,
    completionDate: types.string,
    status:types.string,    
    businessActivity: types.string,
    grade: types.string,
    description: types.string,  
    priority:types.string,  
    state: types.enumeration("State", ["pending", "done", "error", "navigate", ])
}).actions(self => ({

   
    setInspectionNumber(inspectionNumber: number) {
        self.inspectionNumber = inspectionNumber
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setCompletionDate(completionDate: string) {
        self.completionDate= completionDate
    },
    setStatus(status: string) {
        self.status = status
    },
    setbusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setGrade(grade: string) {
        self.grade =grade
    },
    setDescripion(description:string) {
        self.description = description
    },
    setPriority(priority: string) {
        self.priority = priority
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
    getInspectionNumber() {
       return  self.inspectionNumber 
    },
    getTaskType() {
        return self.taskType
    },
    getCreationDate() {
        return self.creationDate
    },
    getCompletionDate() {
         return self.completionDate
    },
    getStatus() {
        return self.status
    },
    getBusinessActivity() {
        return self.businessActivity
    },
   
    getGrade() {
        return self.grade
    },
   
    getDescripion() {
        return self.description 
    },
    getPriority() {
       return self.priority 
    },
   
}));


export default  HistoryInspectionDetailsStore;
