import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type HistoryVehicleStoreModel = Instance<typeof HistoryVehicleStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const HistoryVehicleStore = types.model('HistoryVehicleModel', {
    placeOfIssue:types.string,
    plateNumber:types.string,
    plateCode:types.string,
    chassisNumber:types.string,   
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setPlaceOfIssue(placeOfIssue: string) {
        self.placeOfIssue = placeOfIssue
    },
    setPlateNumber(plateNumber: string) {
        self.plateNumber = plateNumber
    },
    setPlateCode(plateCode: string) {
        self.plateCode = plateCode
    },
    setChassisNumber(chassisNumber: string) {
        self.chassisNumber = chassisNumber
    }
})).views(self => ({

    gettPlaceOfIssue() {
        return self.placeOfIssue
   },
   getPlateNumber() {
        return self.plateNumber 
   },
   getPlateCode() {
       return self.plateCode 
   },
   getChassisNumber() {
       return self.chassisNumber 
   }, 


}));


export default HistoryVehicleStore;
