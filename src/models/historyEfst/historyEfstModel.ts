import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type historyEfstStoreModel = Instance<typeof HistoryEfstStore>
import { RealmController } from '../../database/RealmController';
import  {fetchEfstDataService}  from './../../services/WebServices';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const HistoryEfstStore = types.model('HistoryEfstModel', {
    foodHandlerId: types.string,
    emiratesId: types.string,
    foodHandlerName: types.string,
    gender: types.string,
    passPercentage: types.string,
    nationality: types.string,
    passortNumber: types.string,   
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({
 
    setFoodHandlerId(foodHandlerId: string) {
        self.foodHandlerId = foodHandlerId
    },
    setEmiratesId(emiratesId: string) {
        self.emiratesId= emiratesId
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
  

    callToefstDataByKeyService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
            let auth = '';
            let payload = {};
            

            let efstResponse = yield fetchEfstDataService(payload, auth);
            ToastAndroid.show('response  :' + JSON.stringify(Response), 1000);
          

        } catch (error) {
            
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
   

}));


export default HistoryEfstStore;
