import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type historyEstablishmentListStoreModel = Instance<typeof HistoryEstablishmentListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const HistoryEstablishmentListStore = types.model('HistoryEstablishmentListModel', {
    establishmentName:types.string,
    tradeLicense:types.string,
    licenseSource:types.string,
    address:types.string, 
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setTradeLicense(tradeLicense: string) {
        self.tradeLicense = tradeLicense
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setAddress(address: string) {
        self.address = address
    },
  
})).views(self => ({

    getEstablishmentName() {
         return self.establishmentName 
    },
    getTradeLicense() {
         return self.tradeLicense 
    },
    getLicenseSource() {
        return self.licenseSource 
    },
    getAddress() {
        return self.address
    },
  



}));


export default HistoryEstablishmentListStore;
