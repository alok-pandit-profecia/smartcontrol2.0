import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type serviceRequestDetailsStoreModel = Instance<typeof ServiceRequestDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const ServiceRequestDetailsStore = types.model('ServiceRequestDetailsModel', {
    serviceRequestNo:types.string,
    city:types.string,
    application:types.string, 
    applicationType:types.string,
    status:types.string,
    creationDate:types.string,
    closedDate:types.string,
    permitstartDate:types.string,
    permitEndDate:types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setServiceRequestNo(serviceRequestNo: string) {
        self.serviceRequestNo = serviceRequestNo
    },
    setCity(city: string) {
        self.city = city
    },
    setApplication(application: string) {
        self.application = application
    },  
    setApplicationType(applicationType: string) {
        self.applicationType = applicationType
    },
    setStatus(status: string) {
        self.status = status
    },
    setCreationDate(creationDate: string) {
        self.creationDate = creationDate
    },
    setClosedDate(closedDate: string) {
        self.closedDate = closedDate
    },
    setPermitStartDate(permitstartDate: string) {
        self.permitstartDate = permitstartDate
    },
    setPermitEndDate(permitEndDate: string) {
        self.permitEndDate = permitEndDate
    },
  
  
})).views(self => ({

    getServiceRequestNo() {
        return self.serviceRequestNo 
    },
    getCity() {
        return self.city 
    },
    getApplication() {
        return self.application 
    },  
    getApplicationType() {
        return self.applicationType 
    },
    getStatus() {
         return self.status 
    },
    getCreationDate() {
        return self.creationDate 
    },
    getClosedDate() {
        return self.closedDate 
    },
    getPermitStartDate() {
        return self.permitstartDate 
    },
    getPermitEndDate() {
       return self.permitEndDate
    },
  
   
  



}));


export default ServiceRequestDetailsStore;
