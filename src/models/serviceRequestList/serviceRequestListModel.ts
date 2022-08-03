import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type serviceRequestListStoreModel = Instance<typeof ServiceRequestListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const ServiceRequestListStore = types.model('ServiceRequestListModel', {
    serviceRequestNo:types.string,
    applicationType:types.string,
    application:types.string,   
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setServiceRequestNo(serviceRequestNo: string) {
        self.serviceRequestNo = serviceRequestNo
    },
    setApplicationType(applicationType: string) {
        self.applicationType = applicationType
    },
    setApplication(application: string) {
        self.application = application
    },
  
  
})).views(self => ({

    getServiceRequestNo() {
         return self.serviceRequestNo
    },
    getApplicationType() {
         return self.applicationType
    },
    getApplication() {
        return self.application
    },
   
  



}));


export default ServiceRequestListStore;
