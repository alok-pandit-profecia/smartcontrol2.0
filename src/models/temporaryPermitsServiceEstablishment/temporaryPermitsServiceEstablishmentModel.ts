import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof  TemporaryPermitsServiceEstablishmentStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const TemporaryPermitsServiceEstablishmentStore = types.model('TemporaryPermitsServiceEstablishmentModel', {
    tradeLicenseNumber: types.string,
    licenseExpiryDate: types.string,
    mainBusinessActivity: types.string,
    sector: types.string,
    customerName: types.string,
    establishmentType: types.string,
    licenseSource:types.string,
    area:types.string,    
    state: types.enumeration("State", ["pending", "done", "error", "navigate", ])
}).actions(self => ({

    setTemporaryPermitsServiceEstablishmentDataBlank() {
            self.tradeLicenseNumber = '',
            self.licenseExpiryDate = '',
            self.mainBusinessActivity = '',
            self.sector = '',
            self.customerName = '',
            self.establishmentType = '',
            self.licenseSource ='',           
            self.area ='',                        
            self.state = 'done'
    },

    setTradeLicenseNumber(tradeLicenseNumber: string) {
        self.tradeLicenseNumber = tradeLicenseNumber
    },
    setLicenseExpiryDate(licenseExpiryDate: string) {
        self.licenseExpiryDate = licenseExpiryDate
    },
    setMainBusinessActivity(mainBusinessActivity: string) {
        self.mainBusinessActivity = mainBusinessActivity
    },
    setSector(sector: string) {
        self.sector = sector
    },
    setCustomerName(customerName: string) {
        self.customerName = customerName
    },
    setEstablishmentType(establishmentType:string) {
        self.establishmentType = establishmentType
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setArea(area: string) {
        self.area = area
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
    getTradeLicenseNumber() {
         return self.tradeLicenseNumber 
    },
    getLicenseExpiryDate() {
       return  self.licenseExpiryDate 
    },
    getMainBusinessActivity() {
        return self.mainBusinessActivity 
    },
    getSector() {
         return self.sector 
    },
    getCustomerName() {
         return self.customerName
    },
    getEstablishmentType() {
         return self.establishmentType
    },
    getLicenseSource() {
         return self.licenseSource 
    },
    getArea() {
         return self.area
    },
  
  
   
}));


export default  TemporaryPermitsServiceEstablishmentStore;
