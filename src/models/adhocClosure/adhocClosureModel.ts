import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type licenseActionStoreModel = Instance<typeof AdhocClosureStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();
import NavigationService from './../../services/NavigationService';
import { callToPostRequestForClouser, LoginService } from './../../services/WebServices'

const AdhocClosureStore = types.model('AdhocClosureModel', {
    inspectionId: types.string,
    type: types.string,
    createdBy: types.string,
    establishment: types.string,
    comments: types.string,

    state: types.enumeration("State", ["pending", "done", "error", "navigate",]),
    // loadingState: types.enumeration("loadingState", ['', 'Submitting Request For Closure']),
    loadingState: types.enumeration("loadingState", ['', 'Submitting Request for Closure'])
}).actions(self => ({


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
    setComments(comments: string) {
        self.comments = comments
    },

    callToRequest: flow(function* () {

        self.state = "pending";
        self.loadingState = "Submitting Request for Closure";

        try {

            var date = Date.now();
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
            loginInfo = loginInfo['0'] ? loginInfo['0'] :{}
            // //console.log("Login info", loginInfo)

            let obj = {
                inspectionId: self.inspectionId,
                comments: self.comments,
                establishment: self.establishment,
                action: 'Violation',
                violationDescription: self.comments,
                violationName: self.comments,
                inspectionParams: self.comments,
                violationType: 'Request for Closure',
                inspectorId: loginInfo.username
            }

            let closureResponse = yield callToPostRequestForClouser(obj);
          
                if (closureResponse.Status == 'Success') {
                    self.state = "done"
                    self.loadingState = '';
                    ToastAndroid.show('Closure Request sent  Successfully', 1000);
                    NavigationService.goBack();  //added for back navigation.
                    // Alert.alert('Closure Request sent  Successfully')

                }
                else {
                    ToastAndroid.show(closureResponse.ErrorMessage+",ErorCode: "+closureResponse.ErrorCode, 1000);
                    self.state = "done"
                    self.loadingState = '';
                }
           
        } catch (error) {

            self.state = "error";
            self.loadingState = '';
            // //console.log("Error", error)
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
    getComments() {
        return self.comments
    }

}));


export default AdhocClosureStore;
