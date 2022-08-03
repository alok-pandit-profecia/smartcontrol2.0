import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';


export type adhocTaskEstablishmentStoreModel = Instance<typeof AdhocTaskEstablishmentStore>
import { RealmController } from '../../database/RealmController';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import { $nonEmptyObject } from 'mobx-state-tree/dist/internal';
import Detention from '../../routes/Detention';
let realm = RealmController.getRealmInstance();

import { callToSearchByEst } from './../../services/WebServices';
import { services } from './../../config/config';
import NavigationService from './../../services/NavigationService';


const AdhocTaskEstablishmentStore = types.model('AdhocTaskEstablishmentModel', {
    englishTradeName: types.string,
    arabicTradeName: types.string,
    licenseSource: types.string,
    licenseNo: types.string,
    area: types.string,
    sector: types.string,
    tradeLicenseHistoryResponse: types.string,
    estResponse: types.string,
    clikedItem: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "success"]),
    stateResponse: types.enumeration("State", ["","pending", "done", "error", "navigate", "success"]),
    loadingState: types.enumeration("State", ["", "Get Establishments"])
}).actions(self => ({

    setEnglishTradeName(englishTradeName: string) {
        self.englishTradeName = englishTradeName
    },
    setArabicTradeName(arabicTradeName: string) {
        self.arabicTradeName = arabicTradeName
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setLicenseNo(licenseNo: string) {
        self.licenseNo = licenseNo
    },
    setArea(area: string) {
        self.area = area
    },
    setSector(sector: string) {
        self.sector = sector
    },
    setTradeLicenseHistory(tradeLicenseHistory: string) {
        self.tradeLicenseHistoryResponse = tradeLicenseHistory
    },
    setState(state: string) {
        self.state = state
    },
    setAdhocEstDataBlank() {
        self.englishTradeName = '',
            self.arabicTradeName = '',
            self.licenseSource = '',
            self.licenseNo = '',
            self.area = '',
            self.sector = '',
            self.tradeLicenseHistoryResponse = '',
            self.state = 'done'
    },
    setSelectedItem(clikedItem: string) {
        self.clikedItem = clikedItem
    },

    callToSearchByEstablishmentService: flow(function* (establishmentData: any) {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Get Establishments';
        try {
            // self.estResponse = "";
            // ... yield can be used in async/await style
            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_005",
                "LanguageType": "",
                "TradeLicenseNumber": self.licenseNo.toUpperCase(),
                "InspectorName": "",
                "LicenseSource": self.licenseSource,
                "InspectorId": "",
                "EnglishName": self.englishTradeName + (self.englishTradeName.length > 0 ? "*" : ""),
                "ArabicName": self.arabicTradeName,
                "AdditionalTag1": "",
                "Sector": self.sector,
                "AdditionalTag2": "",
                "Area": self.area,
                "AdditionalTag3": ""
            }
            self.tradeLicenseHistoryResponse = '';
            // console.log("JSON.stringify(estResponse.TradelicenseHistory.Establishment)::"+JSON.stringify(estResponse))

            let estResponse = Object()

            let tempLicenseNumber = [], tempLicenseCode = [], tempLicenseSource = [], tempArea = [], tempSector = [], tempEnglishName = [], tempArabicName = [];
            // alert(str)
            if (self.licenseNo != '') {
                tempLicenseNumber = establishmentData.filter((item: any, index: number) => {
                    item.LicenseNumber = item.LicenseNumber ? item.LicenseNumber : '';
                    if (
                        (item.LicenseNumber.toString().toLowerCase().indexOf(self.licenseNo.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
                tempLicenseCode = establishmentData.filter((item: any, index: number) => {
                    item.LicenseCode = item.LicenseCode ? item.LicenseCode : '';

                    if (
                        (item.LicenseCode.toString().toLowerCase().indexOf(self.licenseNo.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
            }

            if (self.licenseSource != '') {
                tempLicenseSource = establishmentData.filter((item: any, index: number) => {
                    item.LicenseSource = item.LicenseSource ? item.LicenseSource : '';

                    if (
                        (item.LicenseSource.toString().toLowerCase().indexOf(self.licenseSource.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
            }

            if (self.area != '') {
                tempArea = establishmentData.filter((item: any, index: number) => {
                    item.Area = item.Area ? item.Area : '';

                    if (
                        (item.Area.toString().toLowerCase().indexOf(self.area.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
            }

            if (self.sector != '') {
                tempSector = establishmentData.filter((item: any, index: number) => {
                    item.Area = item.Area ? item.Area : '';

                    if (
                        (item.Area.toString().toLowerCase().indexOf(self.area.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
            }

            if (self.englishTradeName != '') {
                tempEnglishName = establishmentData.filter((item: any, index: number) => {
                    item.EnglishName = item.EnglishName ? item.EnglishName : '';

                    if (
                        (item.EnglishName.toString().toLowerCase().indexOf(self.englishTradeName.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
            }

            if (self.arabicTradeName != '') {
                tempArabicName = establishmentData.filter((item: any, index: number) => {
                    item.ArabicName = item.ArabicName ? item.ArabicName : '';

                    if (
                        (item.ArabicName.toString().toLowerCase().indexOf(self.arabicTradeName.toLowerCase()) > -1)
                    ) {
                        return item;
                    }
                });
            }

            let temp = Array()
            temp = [...tempLicenseCode, ...tempLicenseNumber, ...tempSector, ...tempArea, ...tempEnglishName, ...tempArabicName, ...tempLicenseSource]
            // alert(temp.length)
            // if (estResponse && estResponse.Status == "Success") {
            // console.log("JSON.stringify(estResponse.TradelicenseHistory.Establishment)::" + JSON.stringify(temp))
            self.state = "success";
            self.loadingState = "";
            self.tradeLicenseHistoryResponse = JSON.stringify(temp);
            // self.tradeLicenseHistoryResponse = JSON.stringify(estResponse.TradelicenseHistory.Establishment);

            let url = services.url.searchHistory
            const estDataResponse = yield callToSearchByEst(url, payload);
            if (estDataResponse.Status == "Success") {
                let tmp = (estDataResponse.TradelicenseHistory && estDataResponse.TradelicenseHistory.Establishment) ? estDataResponse.TradelicenseHistory.Establishment : ''
                self.estResponse = tmp ? JSON.stringify(tmp) : "";
                self.stateResponse = "done";
            }
            else {
                self.stateResponse = "error";
                self.loadingState = "";
                ToastAndroid.show(estResponse.ErrorMessage, ToastAndroid.CENTER);
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            // //console.log("error: ", error)
            ToastAndroid.show("Failed to get response", ToastAndroid.CENTER);

        }

    }),

    callToSearchByEstablishmentServiceFromAPI: flow(function* () {
        // <- note the star, this a generator function!

        try {

            // ... yield can be used in async/await style
            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_005",
                "LanguageType": "",
                "TradeLicenseNumber": self.licenseNo.toUpperCase(),
                "InspectorName": "",
                "LicenseSource": self.licenseSource,
                "InspectorId": "",
                "EnglishName": self.englishTradeName + (self.englishTradeName.length > 0 ? "*" : ""),
                "ArabicName": self.arabicTradeName,
                "AdditionalTag1": "",
                "Sector": self.sector,
                "AdditionalTag2": "",
                "Area": self.area,
                "AdditionalTag3": ""
            }

            console.log("licenseHistory.Establishment)payload::" + JSON.stringify(payload))

            // alert(temp.length)
            // if (estResponse && estResponse.Status == "Success") {
            //console.log("JSON.stringify(estResponse.TradelicenseHistory.Establishment)::"+JSON.stringify(estResponse.TradelicenseHistory.Establishment))

            // self.tradeLicenseHistoryResponse = JSON.stringify(estResponse.TradelicenseHistory.Establishment);

            self.state = "pending";
            self.loadingState = 'Get Establishments';

            let url = services.url.searchHistory
            const estDataResponse = yield callToSearchByEst(url, payload);
            if (estDataResponse.Status == "Success") {
                let tmp = (estDataResponse.TradelicenseHistory && estDataResponse.TradelicenseHistory.Establishment) ? estDataResponse.TradelicenseHistory.Establishment : ''
                self.estResponse = tmp ? JSON.stringify(tmp) : "";
                // console.log("tmp)::" + JSON.stringify(tmp))

                let searchHistory = Array()
                for (let index = 0; index < tmp.length; index++) {
                    const element = tmp[index];
                    element.ArabicName = element.TradeArabicName ? element.TradeArabicName : "";
                    element.ADFCAIntialTradeLicense = element.TradeLicense ? element.TradeLicense : "";
                    element.Mobile = element.MobilePhoneNumber ? element.MobilePhoneNumber : "";
                    element.LicenseExpiryDate = element.TradeExpDate ? element.TradeExpDate : "";
                    let licenseNumber = element.TradeLicense ? element.TradeLicense.split("-") : '';
                    if (licenseNumber.length) {
                        let temp = '';
                        licenseNumber.map((itm: any, i: number) => { if (i != 0) { temp = temp + itm + ((i == (licenseNumber.length - 1)) ? '' : '-') } })
                        element.LicenseNumber = temp;
                    }
                    else {
                        element.LicenseNumber = "";
                    }
                    element.LicenseRegDate = element.TradeRegDate ? element.TradeRegDate : "";
                    element.LicenseCode = element.TradeLicense ? element.TradeLicense : "";
                    element.Email = element.EmailAddress ? element.EmailAddress : "";
                    element.EnglishName = element.TradeEngName ? element.TradeEngName : "";
                    element.Id = element.Id ? element.Id : "";
                    searchHistory.push(element)
                }
                self.tradeLicenseHistoryResponse = searchHistory.length ? JSON.stringify(searchHistory) : "";

                self.state = "success";
                self.loadingState = "";
            }
            else {
                self.state = "error";
                self.loadingState = "";
                ToastAndroid.show("ErrorCode :" + estDataResponse.ErrorCode + "," + estDataResponse.ErrorMessage, ToastAndroid.CENTER);
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            // //console.log("error: ", error)
            ToastAndroid.show("Failed to get response", ToastAndroid.CENTER);

        }

    }),
})).views(self => ({

    getEnglishTradeName() {
        return self.englishTradeName
    },
    getArabicTradeName() {
        return self.arabicTradeName
    },
    getLicenseSource() {
        return self.licenseSource
    },
    getLicenseNo() {
        return self.licenseNo
    },
    gtArea() {
        return self.area
    },
    getSector() {
        return self.sector
    },
    getTradeLicenseHistory() {
        return self.tradeLicenseHistoryResponse
    },
    getState() {
        return self.state
    },
    getSelectedItem() {
        return self.clikedItem
    }



}));


export default AdhocTaskEstablishmentStore;
