import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type CheckListStoreModel = Instance<typeof CheckListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
let realm = RealmController.getRealmInstance();

const CheckListStore = types.model('CheckListModel', {
    parameter: types.string,
    parameter_weight_mobility: types.string,
    parameter_EHS_Risk: types.string,
    parameter_guidance_rules: types.string,
    parameter_grace_minimum: types.string,
    parameter_reference: types.string,
    parameter_EHS: types.string,
    parameter_subtype: types.string,
    parameter_grace_maximum: types.string,
    parameter_type: types.string,
    parameter_EFST: types.string,
    parameter_score_desc: types.optional(types.array(types.string), []),
    parameter_score: types.optional(types.array(types.string), []),
    parameter_non_comp_desc:types.optional(types.array(types.string), []),
    regulation: types.optional(types.array(types.string), []),
    Answers: types.string,
    NA:types.string ,
    NAValue: types.string,
    NI: types.string,
    NIValue: types.string,
    grace:types.string ,
    image1: types.string,
    image1Base64: types.string,
    image2: types.string,
    image2Base64: types.string,
    comments: types.string,
    TotalScoreForQuestion: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setcheckListDataBlank() {
        self.state = 'done'
    },
    

})).views(self => ({
    
}));


export default CheckListStore;
