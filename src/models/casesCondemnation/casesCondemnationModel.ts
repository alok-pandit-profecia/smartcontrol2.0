import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type condemnationStoreModel = Instance<typeof CasesCondemnationStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const CasesCondemnationStore = types.model('CasesCondemnationModel', {
    serialNumber: types.string,
    productName: types.string,
    unit: types.string,
    quantity: types.string,
    netWeight: types.string,
    package: types.string,
    batchNumber: types.string,
    brandName: types.string,
    remarks: types.string,
    place: types.string,
    reason: types.string,
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
    setUnit(unit: string) {
        self.unit = unit
    },
    setQuantity(quantity: string) {
        self.quantity = quantity
    },
    setNeWeight(netWeight: string) {
        self.netWeight = netWeight
    },
    setPackage(packages: string) {
        self.package = packages
    },
    setBatchNumber(batchNumber: string) {
        self.batchNumber = batchNumber
    },
    setBrandName(brandName: string) {
        self.brandName = brandName
    },
    setremarks(remarks: string) {
        self.remarks = remarks
    },
    setPlace(place: string) {
        self.place = place
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },

})).views(self => ({


}));


export default CasesCondemnationStore;
