import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type contactStoreModel = Instance<typeof EfstStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import { fetchGetEfstDataService, UpdateFoodHandlerCountService } from './../../services/WebServices';
import NavigationService from '../../services/NavigationService';
let realm = RealmController.getRealmInstance();


const EfstStore = types.model('EfstModel', {
    foodHandlerId: types.string,
    emiratesId: types.string,
    foodHandlerName: types.string,
    gender: types.string,
    passPercentage: types.string,
    nationality: types.string,
    passortNumber: types.string,
    trained: types.string,
    certified: types.string,
    foodHandlerCount: types.string,
    efstDataResponse: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate"])
}).actions(self => ({

    setEfstDataBlank() {
        self.foodHandlerId = '';
        self.emiratesId = '';
        self.foodHandlerName = '';
        self.gender = '';
        self.passPercentage = '';
        self.nationality = '';
        self.passortNumber = '';
        self.trained = '';
        self.certified = '';
        self.foodHandlerCount = '';
        self.state = 'done'
    },
    setFoodHandlerId(foodHandlerId: string) {
        self.foodHandlerId = foodHandlerId
    },
    setEmiratesId(emiratesId: string) {
        self.emiratesId = emiratesId
    },
    setFoodHandlerName(foodHandlerName: string) {
        self.foodHandlerName = foodHandlerName
    },
    setGender(gender: string) {
        self.gender = gender
    },
    setPassPercentage(passPercentage: string) {
        self.passPercentage = passPercentage
    },
    setNationality(nationality: string) {
        self.nationality = nationality
    },
    setPassortNumber(passortNumber: string) {
        self.passortNumber = passortNumber
    },
    setTrained(trained: string) {
        self.trained = trained
    },
    setCertified(certified: string) {
        self.certified = certified
    },
    setFoodHandlerCount(foodHandlerCount: string) {
        self.foodHandlerCount = foodHandlerCount
    },

    callToFetchEfstDataService: flow(function* (licenseCode: any) {

        let obj = Object();
        // <- note the star, this a generator function!
        self.state = "pending"
        try {
            let getefstResponse = yield fetchGetEfstDataService(licenseCode);
            console.log("getefst::" + JSON.stringify(getefstResponse))
            if (getefstResponse) {

                let efstDetails = Array();

                let efstDetailsArray = getefstResponse.GetFoodHandlerTrainedDetailsResult ? getefstResponse.GetFoodHandlerTrainedDetailsResult : []

                for (let index = 0; index < efstDetailsArray.length; index++) {
                    let element = efstDetailsArray[index]
                    obj.FoodHanlderId = element.FoodHanlderId
                    obj.EmiratesID = element.EmiratesID
                    obj.FoodHandlerName = element.FoodHandlerName
                    obj.Gender = element.Gender
                    obj.PassPercentage = element.PassPercentage
                    obj.Nationality = element.Nationality
                    obj.PassportNumber = element.PassportNumber
                    obj.TrainingScheduleAttendanceID = element.TrainingScheduleAttendanceID
                    obj.ExamAttendanceID = element.ExamAttendanceID
                    obj.TradeLicense = element.TradeLicense
                    efstDetails.push(obj);
                }
                self.foodHandlerCount = JSON.stringify(efstDetailsArray.length);
                self.trained = JSON.stringify(efstDetails.filter((obj) => obj.TrainingScheduleAttendanceID != '').length);
                self.certified = JSON.stringify(efstDetails.filter((obj) => obj.ExamAttendanceID != '').length);
                self.efstDataResponse = JSON.stringify(efstDetails);
                self.state = 'efstDataSuccess';
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

    callToUpdateFoodHandlerCountService: flow(function* (trainedCount: any, certifiedCount: any, foodHandlerCount: any, licensesCode: any) {

        self.state = "pending"
        try {
            let efstCountResponse = yield UpdateFoodHandlerCountService(trainedCount, certifiedCount, foodHandlerCount, licensesCode);
            console.log("getefst::" + JSON.stringify(efstCountResponse))

            if (efstCountResponse.Status === "Success") {
                // self.state = 'navigate'
                self.state = 'done'
                Alert.alert("", 'Food Handler count Updated Successfully')
                NavigationService.goBack();
            }
            else {
                Alert.alert("", 'Failed to update Food Handler Count')
                self.state = 'done'
            }

        } catch (error) {

            self.state = "error"
        }

    }),

})).views(self => ({
    getFoodHandlerId() {
        return self.foodHandlerId
    },
    getEmiratesId() {
        return self.emiratesId
    },
    getFoodHandlerName() {
        return self.foodHandlerName
    },
    getGender() {
        return self.gender
    },
    getPassPercentage() {
        return self.passPercentage
    },
    getNationality() {
        return self.nationality
    },
    getPassortNumber() {
        return self.passortNumber
    },
    getTrained() {
        return self.trained
    },
    getCertified() {
        return self.certified
    },
    getFoodHandlerCount() {
        return self.foodHandlerCount
    },

}));


export default EfstStore;
