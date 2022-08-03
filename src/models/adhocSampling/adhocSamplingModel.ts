import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type samplingStoreModel = Instance<typeof AdhocSamplingStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const AdhocSamplingStore = types.model('AdhocSamplingModel', {
    serialNumber: types.string,
    productName:types.string,
    brandName:types.string,
    sampleCollectionReason: types.string,
    sampleName: types.string,
    dateofSample: types.string,
    sampleState: types.string,
    sampleTemperature: types.string,
    remainingQuantity: types.string,
    type: types.string,
    countryOfOrigin: types.string,
    remarks: types.string,
    attachment1: types.string,
    attachment2: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({


    setSerialNumber(serialNumber: string) {
        self.serialNumber = serialNumber
    },
    setProductName(productName: string) {
        self.productName = productName
    },
    setBrandName(brandName: string) {
        self.brandName = brandName
    },
    setSampleCollectionReason(sampleCollectionReason: string) {
        self.sampleCollectionReason = sampleCollectionReason
    },
    sampleState(sampleCollectionReason: string) {
        self.sampleCollectionReason = sampleCollectionReason
    },
    setSampleName(sampleName: string) {
        self.sampleName = sampleName
    },
    setDateofSample(dateofSample: string) {
        self.dateofSample = dateofSample
    },
    setSampleTemperature(sampleTemperatures: string) {
        self.sampleTemperature = sampleTemperatures
    },
    setRemainingQuantity(remainingQuantity: string) {
        self.remainingQuantity = remainingQuantity
    },
    setType(type: string) {
        self.type = type
    },
    setremarks(remarks: string) {
        self.remarks = remarks
    },
    setCountryOfOrigin(countryOfOrigin: string) {
        self.countryOfOrigin = countryOfOrigin
    },
    setRemarks(remarks: string) {
        self.remarks = remarks
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },

})).views(self => ({


}));


export default AdhocSamplingStore;
