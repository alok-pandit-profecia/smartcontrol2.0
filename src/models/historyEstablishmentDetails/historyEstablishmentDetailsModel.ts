import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type HistoryEstablishmentDetailsStoreModel = Instance<typeof HistoryEstablishmentDetailsStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
import { add } from 'react-native-reanimated';
let realm = RealmController.getRealmInstance();


const HistoryEstablishmentDetailsStore = types.model('HistoryEstablishmentDetailsModel', {
    establishmentName:types.string,
    licenseNumber:types.string,
    licenseStartDate:types.string,
    licenseEndDate:types.string, 
    arabicEstablishmentName:types.string,   
    contactDetails: types.string,
    address: types.string,  
    emailId: types.string,
    onHold: types.string,
    businessActivity: types.string,  
    selectVehicle: types.string,
    taskType: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setLicenseNumber(licenseNumber: string) {
        self.licenseNumber = licenseNumber
    },
    setLicenseStartDate(licenseStartDate: string) {
        self.licenseStartDate = licenseStartDate
    },
    setLicenseEndDate(licenseEndDate: string) {
        self.licenseEndDate = licenseEndDate
    },
    setarabicEstablishmentName(arabicEstablishmentName: string) {
        self.arabicEstablishmentName = arabicEstablishmentName
    },
    setContactDetails(contactDetails: string) {
        self.contactDetails = contactDetails
    },   
    setAddress(address: string) {
        self.address = address
    },
    setEmailId(emailId: string) {
        self.emailId = emailId
    },
    setOnHold(onHold: string) {
        self.onHold = onHold
    },
    setBusinessActivity(businessActivity: string) {
        self.businessActivity = businessActivity
    },
    setSelectVehicle(selectVehicle: string) {
        self.selectVehicle = selectVehicle
    },
    setTaskType(taskType: string) {
        self.taskType = taskType
    },   
})).views(self => ({

    getEstablishmentName() {
        return self.establishmentName 
    },
    getLicenseNumber() {
         return self.licenseNumber 
    },
    getLicenseStartDate() {
         return self.licenseStartDate 
    },
    getLicenseEndDate() {
       return self.licenseEndDate 
    },
    getarabicEstablishmentName() {
         return self.arabicEstablishmentName 
    },
    getContactDetails() {
         return self.contactDetails 
    },   
    getAddress() {
         return self.address 
    },
    getEmailId() {
        return self.emailId 
    },
    getOnHold() {
         return self.onHold 
    },
    getBusinessActivity() {
         return self.businessActivity 
    },
    getSelectVehicle() {
        return  self.selectVehicle 
    },
    getTaskType() {
         return self.taskType
    },


}));


export default HistoryEstablishmentDetailsStore;
