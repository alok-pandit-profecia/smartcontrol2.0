import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type profileStoreModel = Instance<typeof ProfileModel>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
let realm = RealmController.getRealmInstance();


const ProfileModel = types.model('ProfileModel', {
    inspectorName: types.string,
    position: types.string,
    inspectionArea: types.string,
    unit: types.string,
    selectLang: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setProfileBlank() {
        self.inspectorName = '',
            self.position = '',
            self.inspectionArea = '',
            self.unit = '',
            self.selectLang = '',
            self.state = 'done'
    },



    setInspectorName(inspectorName: string) {
        self.inspectorName = inspectorName
    },
    setPosition(position: string) {
        self.position = position
    },
    setInspectionArea(inspectionArea: string) {
        self.inspectionArea = inspectionArea
    },
    setUnit(unit: string) {
        self.unit = unit
    },
    setSelectLang(selectLang: string) {
        self.selectLang = selectLang
    },



    callToGetProfileService: flow(function* () {

        self.state = "pending"
        try {
            let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
            // //console.log("loginInfo", loginInfo[0].loginResponse);
            self.inspectorName = JSON.parse(loginInfo[0].loginResponse).InspectorName;
            self.position = JSON.parse(loginInfo[0].loginResponse).Position;
            self.inspectionArea = JSON.parse(loginInfo[0].loginResponse).InspectionArea;
            self.unit = JSON.parse(loginInfo[0].loginResponse).Unit
            let UserId = JSON.parse(loginInfo[0].loginResponse).UserId 
            // //console.log("inspectorName", self.inspectorName);
            // //console.log("position", self.position);
            // //console.log("inspectionArea", self.inspectionArea);
            // //console.log("unit", self.unit);
            // //console.log("UserId", UserId);

            let obj = Object();
            obj.inspectorName = self.inspectorName;
            obj.position = self.position;
            obj.inspectionArea = self.inspectionArea;
            obj.unit = self.unit;
            obj.UserId = UserId;

            // //console.log("object",obj);

            RealmController.addProfileInformationInDB(realm, obj, function dataWrite(params: any) {
                // //console.log("object in Database ",obj);
                ToastAndroid.show('profile Data added to db successfully', 1000);
            });

        } catch (error) {

            self.state = "error"
        }

    }),

})).views(self => ({


    getInspectorName() {
        return self.inspectorName
    },
    getPosition() {
        return self.position
    },
    getInspectionArea() {
        return self.inspectionArea
    },
    getUnit() {
        return self.unit
    },
    getSelectLang() {
        return self.selectLang
    },


}));


export default ProfileModel;







