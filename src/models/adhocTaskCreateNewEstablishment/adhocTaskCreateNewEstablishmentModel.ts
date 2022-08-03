import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type adhocTaskCreateNewEstablishmentStoreModel = Instance<typeof AdhocTaskCreateNewEstablishmentStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
import { add } from 'react-native-reanimated';
let realm = RealmController.getRealmInstance();

import { fetchHistoryVehicleData, callToSearchByEst } from './../../services/WebServices';

import { services } from './../../config/config';


const AdhocTaskCreateNewEstablishmentStore = types.model('AdhocTaskCreateNewEstablishmentModel', {
    establishmentEnglishName: types.string,
    establishmentArabicName: types.string,
    establishmentType: types.string,
    establishmentClass: types.string,
    plateCode: types.string,
    plateNumber: types.string,
    vehicleMark: types.string,
    sector: types.string,
    contact: types.string,
    tradeLicenseNumber: types.string,
    tradeLicenseSource: types.string,
    email: types.string,
    tradeLicenseHistoryResponse: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "success", "searchVehicleSuccess", "searchEstSuccess"]),
    loadingState: types.enumeration("State", ["", "Getting Establishment Details", "Getting Vehicle Details"]),
}).actions(self => ({

    setEstablishmentEnglishName(establishmentEnglishName: string) {
        self.establishmentEnglishName = establishmentEnglishName
    },
    setEstablishmentArabicName(establishmentArabicName: string) {
        self.establishmentArabicName = establishmentArabicName
    },
    setEstablishmentType(establishmentType: string) {
        self.establishmentType = establishmentType
    },
    setEstablishmentClass(establishmentClass: string) {
        self.establishmentClass = establishmentClass
    },
    setPlateCode(plateCode: string) {
        self.plateCode = plateCode
    },
    setPlateNumber(plateNumber: string) {
        self.plateNumber = plateNumber
    },
    setVehicleMark(vehicleMark: string) {
        self.vehicleMark = vehicleMark
    },
    setSector(sector: string) {
        self.sector = sector
    },
    setContact(contact: string) {
        self.contact = contact
    },
    settradeLicenseNumber(tradeLicenseNumber: string) {
        self.tradeLicenseNumber = tradeLicenseNumber
    },
    setTradeLicenseSource(tradeLicenseSource: string) {
        self.tradeLicenseSource = tradeLicenseSource
    },
    setEmail(email: string) {
        self.email = email
    },
    setTradeLicenseHistory(tradeLicenseHistory: string) {
        self.tradeLicenseHistoryResponse = tradeLicenseHistory
    },

    callToSearchByVehicleService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Getting Vehicle Details';
        try {

            // ... yield can be used in async/await style
            let obj = {
                placeOfIssue: self.tradeLicenseSource,
                plateNumber: self.plateNumber,
                plateCode: self.plateCode,
                lang: '',
                tradeLicenseNumber: self.tradeLicenseNumber,
                vehicleMake: self.vehicleMark,
                chassisNumber: ''
            }


            const vehicleResponse = yield fetchHistoryVehicleData(obj);


            if (vehicleResponse) {
                var parseString = require('react-native-xml2js').parseString;
                var xml = vehicleResponse;
                debugger;

                parseString(xml, function (err: string, result: any) {
                    let resultArr = result["env:Envelope"]['env:Body'][0]['ns0:VehicleDetails_Output'][0];
                    // // //console.log("resultArr: ", resultArr)

                    if (resultArr["ns0:Status"][0] == "Success") {

                        self.tradeLicenseNumber = resultArr["ns0:TradeLicenseNumber"][0]
                        self.state = "searchVehicleSuccess"

                    } else {
                        self.state = "error"
                        ToastAndroid.show(resultArr["ns0:ErrorMessage"][0], ToastAndroid.CENTER);
                        // Alert.alert(resultArr["ns0:ErrorMessage"][0])
                    }

                });


                // self.searchVehicleResponse = JSON.stringify(estResponse.TradelicenseHistory.Establishment);

            } else {

                self.state = "error"
                ToastAndroid.show("Failed to get response", ToastAndroid.CENTER);
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            // //console.log("error: ", error)

        }

    }),

    callToSearchByEstablishmentService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Getting Establishment Details';
        try {

            // ... yield can be used in async/await style
            let payload = {

                "InterfaceID": "ADFCA_CRM_SBL_005",
                "LanguageType": "",
                "TradeLicenseNumber": self.tradeLicenseNumber.toUpperCase(),
                "InspectorName": "",
                "LicenseSource": self.tradeLicenseSource,
                "InspectorId": "",
                "EnglishName": self.establishmentEnglishName + (self.establishmentEnglishName.length > 0 ? "*" : ""),
                "ArabicName": self.establishmentArabicName,
                "AdditionalTag1": "",
                "Sector": self.sector,
                "AdditionalTag2": "",
                "Area": '',
                "AdditionalTag3": ""

            }

            let url = services.url.searchHistory

            const estResponse = yield callToSearchByEst(url, JSON.stringify(payload));

            if (estResponse && estResponse.Status == "Success") {

                self.state = "searchEstSuccess";
                self.loadingState = '';
                self.tradeLicenseHistoryResponse = JSON.stringify(estResponse.TradelicenseHistory.Establishment);

            } else {
                self.state = "error";
                self.loadingState = '';
                ToastAndroid.show(estResponse.ErrorMessage, ToastAndroid.CENTER);
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            // //console.log("error: ", error)

        }

    }),
})).views(self => ({

    getEstablishmentEnglishName() {
        return self.establishmentArabicName
    },
    getEstablishmentArabicName() {
        return self.establishmentArabicName
    },
    getEstablishmentType() {
        return self.establishmentType
    },
    getEstablishmentClass() {
        return self.establishmentClass
    },
    getPlateCode() {
        return self.plateCode
    },
    getPlateNumber() {
        return self.plateNumber
    },
    getVehicleMark() {
        return self.vehicleMark
    },
    getSector() {
        return self.sector
    },
    getContact() {
        return self.contact
    },
    gettradeLicenseNumber() {
        return self.tradeLicenseNumber
    },
    getTradeLicenseSource() {
        return self.tradeLicenseSource
    },
    getEmail() {
        return self.email
    },
    getState() {
        return self.state
    }


}));


export default AdhocTaskCreateNewEstablishmentStore;
