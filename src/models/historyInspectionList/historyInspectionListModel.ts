import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type historyInspectionListStoreModel = Instance<typeof HistoryInspectionListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const HistoryInspectionListStore = types.model('HistoryInspectionListModel', {
    inspectionId:types.string,
    type:types.string,
    status:types.string,
    date:types.string,   
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setInspectionId(inspectionId: string) {
        self.inspectionId = inspectionId
    },
    setType(type: string) {
        self.type = type
    },
    setStatus(status: string) {
        self.status = status
    },
    setDate(date: string) {
        self.date = date
    }
})).views(self => ({

    getInspectionId() {
        return self.inspectionId
   },
   getType() {
        return self.type 
   },
   getStatus() {
       return self.status 
   },
   getDate() {
       return self.date 
   }, 


}));


export default HistoryInspectionListStore;
