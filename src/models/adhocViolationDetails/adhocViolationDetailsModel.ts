import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type actionStoreModel = Instance<typeof AdhocViolationDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const AdhocViolationDetailsStore = types.model('AdhocViolationDetailsModel', {
    violationNumber: types.string,
    inspectionNumber: types.string,
    createdBy: types.string,
    creationDate: types.string,
    status: types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate", ])
}).actions(self => ({

    setAdhocViolationDetailsDataBlank() {
            self.violationNumber = '',
            self.inspectionNumber = '',
            self.createdBy = '',
            self.creationDate = '',
            self.status = '',                       
            self.state = 'done'
    },
    setViolationNumber(violationNumber: string) {
        self.violationNumber = violationNumber
    },
    setInspectionNumber(inspectionNumber: string) {
        self.inspectionNumber = inspectionNumber
    },
    setCreatedBy(createdBy: string) {
        self.createdBy = createdBy
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setStatus(status: string) {
        self.status = status
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
    getViolationNumber() {
        return self.violationNumber
    },
    getInspectionNumber() {
        return self.inspectionNumber
    },
    getCreatedBy() {
        return self.createdBy
    },
    getCreationDate() {
        return self.creationDate
    },
    getStatus() {
        return self.status
    },
   
}));


export default  AdhocViolationDetailsStore;
