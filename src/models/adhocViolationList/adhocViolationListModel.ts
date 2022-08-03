import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type actionStoreModel = Instance<typeof AdhocViolationListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const AdhocViolationListStore = types.model('AdhocViolationListModel', {
    violationId: types.string,
    inspectionId: types.string, 
    status: types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate", ])
}).actions(self => ({

    setAdhocViolationListDataBlank() {
            self.violationId = '',
            self.inspectionId = '',
            self.status = '',                       
            self.state = 'done'
    },
    setViolationId(violationId: string) {
        self.violationId = violationId
    },
    setInspectionId(inspectionId: string) {
        self.inspectionId = inspectionId
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
    getViolationId() {
        return self.violationId
    },
    getInspectionId() {
        return self.inspectionId
    },  
    getStatus() {
        return self.status
    },
   
}));


export default  AdhocViolationListStore;
