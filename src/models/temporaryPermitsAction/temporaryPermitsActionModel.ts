import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type licenseActionStoreModel = Instance<typeof TemporaryPermitsActionStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const TemporaryPermitsActionStore= types.model('TemporaryPermitsActionModel', {
    taskId: types.string,
    establishment: types.string,
    reason: types.string,
    comments: types.string,
    proposedDate: types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({


    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setEstablishment(establishment: string) {
        self.establishment = establishment
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setComments(comments: string) {
        self.comments = comments
    },
    setProposedDate(proposedDate: string) {
        self.proposedDate = proposedDate
    },
  

})).views(self => ({
    getTaskId() {
        return self.taskId
    },
    getEstablishment() {
        return self.establishment
    },
    getReason() {
        return self.reason
    },
    getComments() {
        return self.comments
    },
    getProposedDate() {
        return self.proposedDate
    }

}));


export default TemporaryPermitsActionStore;
