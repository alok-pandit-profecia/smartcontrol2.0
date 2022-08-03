import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type HistoryViolationListStoreModel = Instance<typeof HistoryViolationListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const HistoryViolationListStore = types.model('HistoryViolationListModel', {
    violationNumber: types.string,
    inspectionNumber: types.string,
    createdBy:types.string,
    creationDate:types.string,    
    status: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setViolationNumber(violationNumber: string) {
        self.violationNumber = violationNumber
    },
    setInspectionNumber(inspectionNumber: string) {
        self.inspectionNumber = inspectionNumber
    },
    setCreatedBy(createdBy: string) {
        self.createdBy = createdBy
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setStatus(status: string) {
        self.status = status
    },
   
})).views(self => ({

    getViolationNumber() {
        return self.violationNumber
    },
    getInspectionNumber() {
         return self.inspectionNumber 
    },
    getCreatedBy() {
       return self.createdBy 
    },
    getCreationDate() {
       return self.creationDate 
    },
    getStatus() {
       return self.status
    },


}));


export default HistoryViolationListStore;
