import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof ContactStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const ContactStore = types.model('ContactModel', {
    type: types.string,
    name: types.string,
    nationality: types.string,
    mobileNumber: types.string,
    relationship: types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate", ])
}).actions(self => ({

    setContactDataBlank() {
            self.type = '',
            self.name = '',
            self.nationality = '',
            self.mobileNumber = '',
            self.relationship = '',                       
            self.state = 'done'
    },
    setType(type: string) {
        self.type = type
    },
    setName(name: string) {
        self.name = name
    },
    setNationality(nationality: string) {
        self.nationality = nationality
    },
    setMobileNumber(mobileNumber: string) {
        self.mobileNumber = mobileNumber
    },
    setRelationship(relationship: string) {
        self.relationship = relationship
    },
  

    callToGetContact:flow(function*()
    {
       self.state="pending"
       
       try{

        let payload= {
            InterfaceID: 'ADFCA_CRM_SBL_005',
            TradeLicenseNumber: 'CN-0932'

        }
       } catch(error){
           self.state = "error"
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
    getType() {
        return self.type
    },
    getName() {
        return self.name
    },
    getNationality() {
        return self.nationality
    },
    getMobileNumber() {
        return self.mobileNumber
    },
    getRelationship() {
        return self.relationship
    },
   
}));


export default  ContactStore;
