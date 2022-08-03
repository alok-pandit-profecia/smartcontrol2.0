import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type detentionStoreModel = Instance<typeof CasesDetentionStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();


const CasesDetentionStore = types.model('CasesDetentionModel', {
    serialNumber: types.string,
    productName:types.string,
    type: types.string,
    unit: types.string,
    quantity: types.string,
    netWeight: types.string,
    package: types.string,
    batchNumber: types.string,
    brandName: types.string,
    productionDate: types.string,
    decisions: types.string,
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
    setType(type: string) {
        self.type = type
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
    setProductionDate(productionDate: string) {
        self.productionDate = productionDate
    },
    setDecisions(decisions: string) {
        self.decisions = decisions
    },
    setAttachment1(attachment1: string) {
        self.attachment1 = attachment1
    },
    setAttachment2(attachment2: string) {
        self.attachment2 = attachment2
    },

})).views(self => ({

}));


export default CasesDetentionStore;
