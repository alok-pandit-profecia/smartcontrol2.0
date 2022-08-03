import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof  LicenseEstablishmentStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const LicenseEstablishmentStore = types.model('LicenseEstablishmentModel', {
    establishmentName: types.string,
    licenseSource: types.string,
    licensestartDate: types.string,
    licenseEndDate: types.string,
    licenseNumber: types.string,
    contactDetails: types.string,
    sector:types.string,
    area:types.string,  
    address: types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate", ])
}).actions(self => ({

    setLicenseEstablishmentDataBlank() {
            self.establishmentName = '',
            self.licenseSource = '',
            self.licensestartDate = '',
            self.licenseEndDate = '',
            self.licenseNumber = '',
            self.contactDetails = '',
            self.sector='',           
            self.area='', 
            self.address = '',           
            self.state = 'done'
    },

    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setLicenseStartDate(licensestartDate: string) {
        self.licensestartDate = licensestartDate
    },
    setLicenseEndDate(licenseEndDate: string) {
        self.licenseEndDate = licenseEndDate
    },
    setLicenseNumber(licenseNumber: string) {
        self.licenseNumber = licenseNumber
    },
    setContactDetails(contactDetails:string) {
        self.contactDetails = contactDetails
    },
    setSector(sector: string) {
        self.sector = sector
    },
    setArea(area: string) {
        self.area = area
    },
    setAddress(address: string) {
        self.address = address
    },
  
    
    callToLovDataByKeyService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending"
        try {

            // ... yield can be used in async/await style
            let payload = {
                "Type": "shop_types"
            }
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
            let auth = '';

            if (loginInfo && loginInfo[0] && loginInfo[0].loginResponse) {
                auth = "Bearer " + JSON.parse(loginInfo[0].loginResponse).Data.JWT;
            }


        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),
   

})).views(self => ({
    getEstablishmentName() {
        return self.establishmentName
    },
    getLicenseSource() {
        return self.licenseSource
    },
    getLicenseStartDate() {
        return self.licensestartDate
    },
    getLicenseEndDate() {
        return self.licenseEndDate
    },
    getLicenseNumber() {
        return self.licenseNumber
    },
    getContactDetails() {
        return self.contactDetails
    },
    getSector() {
         return self.sector 
    },
    getArea() {
        return self.area
    },
    getAddress() {
        return self.address
    },
  
   
}));


export default  LicenseEstablishmentStore;
