import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof CompletedTaskEfstStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const CompletedTaskEfstStore = types.model('CompletedTaskEfstModel', {
    foodHandlerId: types.string,
    emiratesId: types.string,
    foodHandlerName: types.string,
    gender: types.string,
    passPercentage: types.string,
    nationality: types.string,
    passortNumber: types.string,
    trained: types.string,
    certified: types.string,
    foodHandlerCount: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setLicenseEfstDataBlank() {
        self.foodHandlerId = '',
        self.emiratesId = '',
        self.foodHandlerName = '',
        self.gender = '',
        self.passPercentage = '',
        self.nationality = '',
        self.passortNumber = '',
        self.trained = '',
        self.certified = '',
        self.foodHandlerCount = '',
        self.state = 'done'
    },
    setFoodHandlerId(foodHandlerId: string) {
        self.foodHandlerId = foodHandlerId
    },
    setEmiratesId(emiratesId: string) {
        self.emiratesId = emiratesId
    },
    setFoodHandlerName(foodHandlerName: string) {
        self.foodHandlerName = foodHandlerName
    },
    setGender(gender: string) {
        self.gender = gender
    },
    setPassPercentage(passPercentage: string) {
        self.passPercentage = passPercentage
    },
    setNationality(nationality: string) {
        self.nationality = nationality
    },
    setPassortNumber(passortNumber: string) {
        self.passortNumber = passortNumber
    },
    setTrained(trained: string) {
        self.trained = trained
    },
    setCertified(certified: string) {
        self.certified = certified
    },
    setFoodHandlerCount(foodHandlerCount: string) {
        self.foodHandlerCount = foodHandlerCount
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
    getFoodHandlerId() {
        return self.foodHandlerId
    },
    getEmiratesId() {
        return self.emiratesId
    },
    getFoodHandlerName() {
        return self.foodHandlerName
    },
    getGender() {
        return self.gender
    },
    getPassPercentage() {
        return self.passPercentage
    },
    getNationality() {
        return self.nationality
    },
    getPassortNumber() {
        return self.passortNumber
    },
    getTrained() {
        return self.trained
    },
    getCertified() {
        return self.certified
    },
    getFoodHandlerCount() {
        return self.foodHandlerCount
    },

}));


export default CompletedTaskEfstStore;
