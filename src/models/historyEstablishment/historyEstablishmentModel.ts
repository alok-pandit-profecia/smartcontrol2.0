import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type HistoryEstablishmentStoreModel = Instance<typeof HistoryEstablishmentStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const HistoryEstablishmentStore = types.model('HistoryEstablishmentModel', {
    englishTradeName:types.string,
    arabicTradeName:types.string,
    licenseSource:types.string,
    licenseNo:types.string,   
    area: types.string,
    sector: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setEnglishTradeName(englishTradeName: string) {
        self.englishTradeName = englishTradeName
    },
    setArabicTradeName(arabicTradeName: string) {
        self.arabicTradeName = arabicTradeName
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setLicenseNo(licenseNo: string) {
        self.licenseNo = licenseNo
    },
    setArea(area: string) {
        self.area = area
    },
    setSector(sector: string) {
        self.sector = sector
    },   
})).views(self => ({

    getEnglishTradeName() {
         return self.englishTradeName 
    },
    getArabicTradeName() {
         return self.arabicTradeName 
    },
    getLicenseSource() {
        return self.licenseSource 
    },
    getLicenseNo() {
        return self.licenseNo 
    },
    gtArea() {
        return self.area
    },
    getSector() {
       return self.sector
    },   



}));


export default HistoryEstablishmentStore;
