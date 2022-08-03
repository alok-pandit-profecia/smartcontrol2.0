import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof ScheduledFollowUpStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import LicenseActionStore from '../licenseAction/licenseActionModel';
let realm = RealmController.getRealmInstance();


const ScheduledFollowUpStore = types.model('ScheduledFollowUpModel', {
    result: types.string,
    finalComments: types.string, 
    contactName:types.string,
    mobileNumber:types.string,
    emiratesId:types.string,
    evidenceAttachment1: types.string,
    evidenceAttachment2: types.string,
    licenseAttachment1: types.string,
    licenseAttachment2: types.string,
    emiratesIdAttachment1: types.string,
    emiratesIdAttachment2: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setScheduledFollowUpDataBlank() {
        self.result='',
        self.finalComments = '',
        self.contactName='',
        self.mobileNumber='',
        self.emiratesId='',
        self.evidenceAttachment1='',
        self.evidenceAttachment2='',
        self.licenseAttachment1='',
        self.licenseAttachment2='',
        self.emiratesIdAttachment1='',
        self.emiratesIdAttachment2='',
        self.state = 'done'
    },
    setResult(result: string) {
        self.result = result
    },
    setFinalComments(finalComments: string) {
        self.finalComments= finalComments
    }, 
    setContactName(contactName: string) {
        self.contactName= contactName
    }, 
    setMobileNumber(mobileNumber: string) {
        self.mobileNumber= mobileNumber
    }, 
    setEmiratesId(emiratesId: string) {
        self.emiratesId= emiratesId
    }, 
    setEvidenceAttachment1(evidenceAttachment1: string) {
        self.evidenceAttachment1=evidenceAttachment1
    }, 
    setEvidenceAttachment2(evidenceAttachment2: string) {
        self.evidenceAttachment2=evidenceAttachment2
    },  
    setLicenseAttachment1(licenseAttachment1: string) {
        self.licenseAttachment1= licenseAttachment1
    }, 
    setLicenseAttachment2(licenseAttachment2: string) {
        self.licenseAttachment2= licenseAttachment2
    }, 
    setEmiratesIdAttachment1(emiratesIdAttachment1: string) {
        self.emiratesIdAttachment1 = emiratesIdAttachment1
    }, 
    setEmiratesIdAttachment2(emiratesIdAttachment2: string) {
        self.emiratesIdAttachment2 = emiratesIdAttachment2
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
    getResult() {
         return self.result
    },
    getFinalComments() {
         return self.finalComments
    }, 
    getContactName() {
         return self.contactName
    }, 
    getMobileNumber() {
         return self.mobileNumber
    }, 
    getEmiratesId() {
         return self.emiratesId
    }, 
    getEvidenceAttachment1() {
         return self.evidenceAttachment1
    }, 
    getEvidenceAttachment2() {
         return self.evidenceAttachment2
    },  
    getLicenseAttachment1() {
         return self.licenseAttachment1
    }, 
    getLicenseAttachment2() {
        return self.licenseAttachment2
    }, 
    getEmiratesIdAttachment1() {
         return self.emiratesIdAttachment1 
    }, 
    getEmiratesIdAttachment2() {
         return self.emiratesIdAttachment2 
    },   

}));


export default ScheduledFollowUpStore;
