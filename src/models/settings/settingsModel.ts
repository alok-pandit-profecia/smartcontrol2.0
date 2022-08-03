import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof SettingsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const SettingsStore = types.model('SettingsModel', {
    inspectorName: types.string,
    position: types.string,
    inspetionArea: types.string,
    unit: types.string,
    selectLanguage: types.string,
    oldPassword: types.string,
    newPassword: types.string,
    retypePassword: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setSettingsDataBlank() {
            self.inspectorName = '',
            self.position = '',
            self.inspetionArea = '',
            self.unit = '',
            self.selectLanguage = '',
            self.oldPassword = '',
            self.newPassword = '',
            self.retypePassword= '',
            self.state = 'done'
    },

    setInspectorName(inspectorName: string) {
        self.inspectorName = inspectorName
    },
    setPosition(position: string) {
        self.position = position
    },
    setInspectionArea(inspetionArea: string) {
        self.inspetionArea = inspetionArea
    },
    setUnit(unit: string) {
        self.unit = unit
    },
    setSelectLanguage(selectLanguage: string) {
        self.selectLanguage = selectLanguage
    },
    setOldPassword(oldPassword: string) {
        self.oldPassword = oldPassword
    },
    setNewPassword(newPassword: string) {
        self.newPassword = newPassword
    },
    setRetypePassword(retypePassword: string) {
        self.retypePassword = retypePassword
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
    getInspectorName() {
       return self.inspectorName
    },
    getPosition() {
         return self.position 
    },
    getInspectionArea() {
        return self.inspetionArea 
    },
    getUnit() {
        return self.unit 
    },
    getSelectLanguage() {
         return self.selectLanguage 
    },
    getOldPassword() {
         return self.oldPassword
    },
    getNewPassword() {
         return self.newPassword 
    },
    getRetypePassword() {
         return self.retypePassword
    },


}));


export default SettingsStore;
