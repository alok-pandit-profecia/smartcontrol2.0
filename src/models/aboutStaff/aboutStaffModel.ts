import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof AboutStaffStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const AboutStaffStore = types.model('AboutStaffModel', {
    name: types.string,
    contact: types.string,
    post: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setAboutStaffDataBlank() {
        self.name = '',
        self.contact = '',
        self.post = '',
        self.state = 'done'
    },
    setName(name: string) {
        self.name = name
    },
    setContact(contact: string) {
        self.contact = contact
    },
    setPost(post: string) {
        self.post = post
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
    getname() {
        return self.name
    },
    getContact() {
        return self.contact
    },
    getPost() {
        return self.post
    },
    
}));


export default AboutStaffStore;
