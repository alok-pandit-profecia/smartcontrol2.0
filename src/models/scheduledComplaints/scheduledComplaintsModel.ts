import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof ScheduledComplaintsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const ScheduledComplaintsStore = types.model('ScheduledComplaintsModel', {
    inspection: types.string,
    type: types.string,  
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setScheduledComplaintsDataBlank() {
        self.inspection = '',
            self.type = '',           
            self.state = 'done'
    },
    setInspection(inspection: string) {
        self.inspection = inspection
    },
    setType(type: string) {
        self.type = type
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
    getInspection() {
         return self.inspection
    },
    getType() {
        return self.type
    }, 

}));


export default ScheduledComplaintsStore;
