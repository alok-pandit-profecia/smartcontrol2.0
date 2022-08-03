import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type establishmentStoreModel = Instance<typeof  ProductListStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
let realm = RealmController.getRealmInstance();


const  ProductListStore = types.model('ProductListModel', {
    productName: types.string,
    brand: types.string,
    type: types.string,
    batch: types.string,
    weight: types.string,
    unit: types.string,
    country: types.string,  
    state: types.enumeration("State", ["pending", "done", "error", "navigate",])
}).actions(self => ({

    setProductListDataBlank() {
            self.productName = '',
            self.brand = '',
            self.type = '',
            self.batch = '',
            self.weight = '',
            self.unit = '',
            self.country = '',
            self.state = 'done'
    },

    setproductName(productName: string) {
        self.productName = productName
    },
    setbrand(brand: string) {
        self.brand = brand
    },
    settype(type: string) {
        self.type = type
    },
    setbatch(batch: string) {
        self.batch = batch
    },
    setweight(weight: string) {
        self.weight = weight
    },
    setunit(unit: string) {
        self.unit = unit
    },
    setcountry(country: string) {
        self.country = country
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

    getproductName() {
        return self.productName 
    },
    getbrand() {
        return self.brand
    },
    gettype() {
        return self.type 
    },
    getbatch() {
        return self.batch 
    },
    getweight() {
        return self.weight 
    },
    getunit() {
        return self.unit 
    },
    getcountry() {
        return self.country 
    },


}));


export default ProductListStore;
