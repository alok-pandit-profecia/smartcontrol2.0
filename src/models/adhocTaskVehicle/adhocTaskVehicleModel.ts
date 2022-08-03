import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type adhocTaskVehicleStoreModel = Instance<typeof AdhocTaskVehicleStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();

import { fetchHistoryVehicleData } from './../../services/WebServices';
import { services } from './../../config/config';


const AdhocTaskVehicleStore = types.model('AdhocTaskVehicleModel', {
    placeOfIssue: types.string,
    plateNumber: types.string,
    plateCode: types.string,
    chassisNumber: types.string,
    searchVehicleResponse: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "success"]),
    loadingState: types.enumeration("loadingState", ['', 'Get Vehicle Details'])
}).actions(self => ({

    setPlaceOfIssue(placeOfIssue: string) {
        self.placeOfIssue = placeOfIssue
    },
    setPlateNumber(plateNumber: string) {
        self.plateNumber = plateNumber
    },
    setPlateCode(plateCode: string) {
        self.plateCode = plateCode
    },
    setChassisNumber(chassisNumber: string) {
        self.chassisNumber = chassisNumber
    },
    setSearchVehicleResponse(searchVehicleResponse: string) {
        self.searchVehicleResponse = searchVehicleResponse
    },
    setState(state: string) {
        self.state = state
    },

    setVehicleDataBlank() {
        self.placeOfIssue = '',
            self.plateNumber = '',
            self.chassisNumber = '',
            self.plateCode = '',
            self.searchVehicleResponse = '',
            self.state = 'done'
    },

    callToSearchByVehicleService: flow(function* () {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Get Vehicle Details';
        try {

            // ... yield can be used in async/await style
            let obj = {
                placeOfIssue: self.placeOfIssue,
                plateNumber: self.plateNumber,
                plateCode: self.plateCode,
                chassisNumber: self.chassisNumber,
                lang: '',
                tradeLicenseNumber: '',
                vehicleMake: ''
            }
            const vehicleResponse = yield fetchHistoryVehicleData(obj);

            // //console.log("estResponse: ", vehicleResponse)
            if (vehicleResponse) {
                var parseString = require('react-native-xml2js').parseString;
                var xml = vehicleResponse;
                debugger;
                let vehicleArray = Array();

                parseString(xml, function (err: string, result: any) {
                    let resultArr = result["env:Envelope"]['env:Body'][0]['ns0:VehicleDetails_Output'][0];
                    // //console.log("resultArr: ", resultArr)

                    if (resultArr["ns0:Status"][0] == "Success") {
                        let obj = Object();
                        obj.CabinCategory = resultArr["ns0:CabinCategory"][0];
                        obj.ChasisNumber = resultArr["ns0:ChasisNumber"][0];
                        obj.Comments = resultArr["ns0:Comments"][0];
                        obj.ErrorCode = resultArr["ns0:ErrorCode"][0];
                        obj.ErrorMessage = resultArr["ns0:ErrorMessage"][0];
                        obj.OnHold = resultArr["ns0:OnHold"][0];
                        obj.PermissionExpDate = resultArr["ns0:PermissionExpDate"][0];
                        obj.PermitPurpose = resultArr["ns0:PermitPurpose"][0];
                        obj.PlaceofIssue = resultArr["ns0:PlaceofIssue"][0];
                        obj.PlateCode = resultArr["ns0:PlateCode"][0];
                        obj.PlateNumber = resultArr["ns0:PlateNumber"][0];
                        obj.SpecificationType = resultArr["ns0:SpecificationType"][0];
                        obj.Status = resultArr["ns0:Status"][0];
                        obj.TradeLicenseNumber = resultArr["ns0:TradeLicenseNumber"][0];
                        obj.VehicleCategory = resultArr["ns0:VehicleCategory"][0];
                        obj.VehicleColor = resultArr["ns0:VehicleColor"][0];
                        obj.VehicleEngine = resultArr["ns0:VehicleEngine"][0];
                        obj.VehicleMadeUp = resultArr["ns0:VehicleMadeUp"][0];
                        obj.VehicleMake = resultArr["ns0:VehicleMake"][0];
                        obj.VehicleModel = resultArr["ns0:VehicleModel"][0];
                        obj.VehicleEngine = resultArr["ns0:VehicleEngine"][0];
                        obj.VehicleNumber = resultArr["ns0:VehicleNumber"][0];
                        obj.VehicleOwner = resultArr["ns0:VehicleOwner"][0];
                        obj.VehicleType = resultArr["ns0:VehicleType"][0];
                        obj.VehicleYear = resultArr["ns0:VehicleYear"][0];

                        vehicleArray.push(obj);
                        self.state = "success";
                        self.loadingState = '';
                        self.searchVehicleResponse = JSON.stringify(vehicleArray)
                    } else {
                        self.state = "error";
                        self.loadingState = '';
                        Alert.alert(resultArr["ns0:ErrorMessage"][0])
                    }

                });


                // self.searchVehicleResponse = JSON.stringify(estResponse.TradelicenseHistory.Establishment);

            } else {
                self.state = "error"
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            // //console.log("error: ", error)

        }

    }),

})).views(self => ({

    gettPlaceOfIssue() {
        return self.placeOfIssue
    },
    getPlateNumber() {
        return self.plateNumber
    },
    getPlateCode() {
        return self.plateCode
    },
    getChassisNumber() {
        return self.chassisNumber
    },
    getSearchVehicleResponse() {
        return self.searchVehicleResponse
    },
    getState() {
        return self.state
    }

}));


export default AdhocTaskVehicleStore;
