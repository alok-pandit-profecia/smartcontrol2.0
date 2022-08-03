import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type nnHoldeRequestModelStore = Instance<typeof OnHoldeRequestStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import { fetchGetOnHoldRequestService } from './../../services/WebServices';
import NavigationService from './../../services/NavigationService';
let realm = RealmController.getRealmInstance();


const OnHoldeRequestStore = types.model('OnHoldeRequestModel', {
    inspectionId: types.string,
    type: types.string,
    createdBy: types.string,
    establishment: types.string,
    reason: types.string,
    comments: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate"]),
    loadingState: types.enumeration("State", ["", "Submitting On Hold Request"])
}).actions(self => ({

    setLicenseEstablishmentDataBlank() {
        self.inspectionId = '',
            self.type = '',
            self.createdBy = '',
            self.establishment = '',
            self.reason = '',
            self.comments = '',
            self.state = 'done'
    },

    setInspectionId(inspectionId: string) {
        self.inspectionId = inspectionId
    },
    setType(type: string) {
        self.type = type
    },
    setCreatedBy(createdBy: string) {
        self.createdBy = createdBy
    },
    setEstablishment(establishment: string) {
        self.establishment = establishment
    },
    setReason(reason: string) {
        self.reason = reason
    },
    setComments(comments: string) {
        self.comments = comments
    },

    callToOnHoldDataService: flow(function* (taskId: any, reason: any, comments: any) {
        // //console.log("onHoldRequestData in Model",taskId,reason,comments)

        self.state = "pending";
        self.loadingState = "Submitting On Hold Request";
        try {
            let onHoldResponse = yield fetchGetOnHoldRequestService(taskId, reason, comments);
            console.log("onHoldResponse>>"+JSON.stringify(onHoldResponse))
            if (onHoldResponse && (onHoldResponse.Status == "Success")) {
                self.loadingState = '';
                self.state = "done"
                NavigationService.goBack();
            }
            else {
                self.loadingState = '';
                self.state = "error"
                ToastAndroid.show(onHoldResponse.message? onHoldResponse.message: ('ErrorCode :'+onHoldResponse.ErrorCode+", ErrorMessage :"+onHoldResponse.ErrorMessage), 1000);
            }
        } catch (error) {
            self.state = "error"
        }
    }),


})).views(self => ({
    getInspectionId() {
        return self.inspectionId
    },
    getType() {
        return self.type
    },
    getCreatedBy() {
        return self.createdBy
    },
    getEstablishment() {
        return self.establishment
    },
    getReason() {
        return self.reason
    },
    getComments() {
        return self.comments
    },



}));


export default OnHoldeRequestStore;





