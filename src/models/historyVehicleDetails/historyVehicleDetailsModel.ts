import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type HistoryVehicleDetailsStoreModel = Instance<typeof HistoryVehicleDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const HistoryVehicleDetailsStore = types.model('HistoryVehicleDetailsModel', {
    plateNumber: types.string,
    plateCode: types.string,
    placeOfIssue: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setPlateNumber(plateNumber: string) {
        self.plateNumber = plateNumber
    },
    setPlateCode(plateCode: string) {
        self.plateCode = plateCode
    },
    setPlaceOfIssue(placeOfIssue: string) {
        self.placeOfIssue = placeOfIssue
    },


})).views(self => ({

    getPlateNumber() {
        return self.plateNumber
    },

    getPlateCode() {
        return self.plateCode
    },
    gettPlaceOfIssue() {
        return self.placeOfIssue
    },



}));


export default HistoryVehicleDetailsStore;
