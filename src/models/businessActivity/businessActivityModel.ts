import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type businessActivityStoreModel = Instance<typeof BusinessActivityStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const BusinessActivityStore = types.model('BusinessActivityModel', {
    businessActivity:types.string,
    city:types.string,
    category:types.string,   
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setBusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setCity(city: string) {
        self.city = city
    },
    setCategory(category: string) {
        self.category = category
    },
  
  
})).views(self => ({

    getBusinessActivity() {
         return self.businessActivity 
    },
    getCity() {
         return self.city
    },
    getCategory() {
       return  self.category 
    },
  
   
  



}));


export default BusinessActivityStore;
