import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof  ScheduledLicensesStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import LicenseActionStore from '../licenseAction/licenseActionModel';
let realm = RealmController.getRealmInstance();


const  ScheduledLicensesStore = types.model('ScheduledLicensesModel', {
    result: types.string,
    finalComments: types.string,     
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setScheduledLicensesDataBlank() {
        self.result='',
        self.finalComments = '',        
        self.state = 'done'
    },
    setResult(result: string) {
        self.result = result
    },
    setFinalComments(finalComments: string) {
        self.finalComments= finalComments
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
    getResult() {
         return self.result
    },
    getFinalComments() {
         return self.finalComments
    }, 
   
}));


export default ScheduledLicensesStore;
