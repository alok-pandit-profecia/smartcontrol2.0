import {
    types,
    Instance,
    destroy,
    getParent,
    cast,
    SnapshotIn,
    flow
} from 'mobx-state-tree';

export type establishmentStoreModel = Instance<typeof EstablishmentStore>
import { RealmController } from '../../database/RealmController';
import { getAccountSyncService, getContactLists } from './../../services/WebServices';
import EstablishmentSchema from '../../database/EstablishmentSchema';
import LoginSchema from '../../database/LoginSchema';
import { ToastAndroid, Alert } from 'react-native';
import NavigationService from '../../services/NavigationService';
let realm = RealmController.getRealmInstance();
let moment = require('moment');

const EstablishmentStore = types.model('EstablishmentModel', {
    establishmentId: types.string,
    allEstablishmentData: types.string,
    establishmentName: types.string,
    ehsRiskClassification: types.string,
    licenseSource: types.string,
    licensestartDate: types.string,
    licenseEndDate: types.string,
    licenseNumber: types.string,
    contactDetails: types.string,
    address: types.string,
    area: types.string,
    sector: types.string,
    response: types.string,
    estId: types.string,
    licenseCode: types.string,
    contactList: types.string,
    state: types.enumeration("State", ["pending", "done", "error", "navigate", "AccountSyncSuccess"]),
    loadingState: types.enumeration("loadingState", ["Fetching Establishment Details", "Fetching Contact Details", ""]),
}).actions(self => ({

    setEstablishmentDataBlank() {
        self.establishmentName = '';
        self.licenseSource = '';
        self.licensestartDate = '';
        self.ehsRiskClassification = '';
        self.licenseEndDate = '';
        self.licenseNumber = '';
        self.contactDetails = '';
        self.address = '';
        self.area = '';
        self.response = '';
        self.sector = '';
        self.state = 'done';
    },

    setEHSRiskClassification(data: string) {
        self.ehsRiskClassification = data
    },
    setEstablishmentId(data: string) {
        self.establishmentId = data
    },
    setAllEstablishmentData(data: string) {
        self.allEstablishmentData = data
    },
    setEstablishmentName(establishmentName: string) {
        self.establishmentName = establishmentName
    },
    setLicenseSource(licenseSource: string) {
        self.licenseSource = licenseSource
    },
    setLicenseStartDate(licensestartDate: string) {
        self.licensestartDate = licensestartDate
    },
    setLicenseEndDate(licenseEndDate: string) {
        self.licenseEndDate = licenseEndDate
    },
    setLicenseNumber(licenseNumber: string) {
        self.licenseNumber = licenseNumber
    },
    setLicenseCode(licenseCode: string) {
        self.licenseCode = licenseCode
    },
    setContactDetails(contactDetails: string) {
        self.contactDetails = contactDetails
    },
    setAddress(address: string) {
        self.address = address
    },
    setArea(area: string) {
        self.area = area
    },
    setSector(sectore: string) {
        self.sector = sectore
    },
    setEstIds(estId: string) {
        self.estId = estId
    },
    setState(state: string) {
        self.state = state
    },
    setContactList(contactList: string) {
        self.contactList = contactList
    },
    callToAccountSyncService: flow(function* (licenceId: string, isArabic: boolean, singleRecord: boolean) {
        // <- note the star, this a generator function!
        self.state = "pending";
        self.loadingState = 'Fetching Establishment Details';

        try {
            let allDate = Array();
            let auth = '';
            let payload = {}
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};
            let url = '', apiCallFlag = false;

            if (singleRecord) {
                url = `?Login=${loginData.username}&RecToDate=${moment().format('L')}&Start_spcRow=0&RecFromDate=${moment().format('L')}&Page_spcSize=3000&TransactionType=Record&Attrib5=1.5.4&AccountCategory=Food&tempflg=2507&LicenceNumber=${licenceId}`;
                apiCallFlag = true;
               
                let response: any = yield getAccountSyncService(url, auth);
                
                console.log("accountSyncAddressArrayresponse: ", JSON.stringify(response))
                if (response && (response.Status == "Success")) {

                    let accountSyncAddressArray: any = [], accountSyncArray = [];
                    for (let i = 0; i < parseInt(response.NumOfRec); i++) {
                        let adfcaAccountThinBcObj: any = {};
                        let adfcaAccountThinBc = response.ListOfAdfcaAccountSyncIo.AdfcaAccountThinBc[i];
                        adfcaAccountThinBcObj.Id = adfcaAccountThinBc.Id;
                        adfcaAccountThinBcObj.ADCCNumber = adfcaAccountThinBc.ADCCNumber;
                        adfcaAccountThinBcObj.ArabicName = adfcaAccountThinBc.ArabicName;
                        adfcaAccountThinBcObj.ADFCAIntialTradeLicense = adfcaAccountThinBc.ADFCAIntialTradeLicense;
                        adfcaAccountThinBcObj.Mobile = adfcaAccountThinBc.Mobile;
                        adfcaAccountThinBcObj.PreferredLanguage = adfcaAccountThinBc.PreferredLanguage;
                        adfcaAccountThinBcObj.LicenseExpiryDate = adfcaAccountThinBc.LicenseExpiryDate
                        adfcaAccountThinBcObj.LicenseNumber = adfcaAccountThinBc.LicenseNumber;
                        adfcaAccountThinBcObj.LicenseRegDate = adfcaAccountThinBc.LicenseRegDate;
                        adfcaAccountThinBcObj.AccountNumber = adfcaAccountThinBc.AccountNumber;
                        adfcaAccountThinBcObj.AccountRegion = adfcaAccountThinBc.AccountRegion;
                        adfcaAccountThinBcObj.Status = adfcaAccountThinBc.Status;
                        adfcaAccountThinBcObj.AccountClass = adfcaAccountThinBc.AccountClass;
                        adfcaAccountThinBcObj.Alias = adfcaAccountThinBc.Alias;
                        adfcaAccountThinBcObj.BankCode = adfcaAccountThinBc.BankCode;
                        adfcaAccountThinBcObj.EHSRiskClassification = adfcaAccountThinBc.EHSRiskClassification;
                        adfcaAccountThinBcObj.LicenseCode = adfcaAccountThinBc.LicenseCode;
                        adfcaAccountThinBcObj.Sent = adfcaAccountThinBc.Sent;
                        adfcaAccountThinBcObj.URL = adfcaAccountThinBc.URL;
                        adfcaAccountThinBcObj.OnHold = adfcaAccountThinBc.OnHold;
                        adfcaAccountThinBcObj.Reference = adfcaAccountThinBc.Reference;
                        adfcaAccountThinBcObj.LegalStatus = adfcaAccountThinBc.LegalStatus;
                        adfcaAccountThinBcObj.Site = adfcaAccountThinBc.Site;
                        adfcaAccountThinBcObj.Email = adfcaAccountThinBc.Email;
                        adfcaAccountThinBcObj.MainFaxNumber = adfcaAccountThinBc.MainFaxNumber;
                        adfcaAccountThinBcObj.LandlineNumber = adfcaAccountThinBc.LandlineNumber;
                        adfcaAccountThinBcObj.Area = adfcaAccountThinBc.Area;
                        adfcaAccountThinBcObj.Sector = adfcaAccountThinBc.Sector;
                        adfcaAccountThinBcObj.City = adfcaAccountThinBc.City;
                        adfcaAccountThinBcObj.EnglishName = adfcaAccountThinBc.EnglishName;
                        adfcaAccountThinBcObj.AccountCategory = adfcaAccountThinBc.AccountCategory;
                        adfcaAccountThinBcObj.Parent = adfcaAccountThinBc.Parent;
                        adfcaAccountThinBcObj.LicenseSource = adfcaAccountThinBc.LicenseSource;
                        adfcaAccountThinBcObj.AccountType = adfcaAccountThinBc.AccountType;
                        adfcaAccountThinBcObj.PrimaryAddressId = adfcaAccountThinBc.PrimaryAddressId;

                        adfcaAccountThinBcObj.NumofWH = adfcaAccountThinBc.NumofWH;
                        adfcaAccountThinBcObj.NumofSheds = adfcaAccountThinBc.NumofSheds;
                        adfcaAccountThinBcObj.NumofFishPonds = adfcaAccountThinBc.NumofFishPonds;
                        adfcaAccountThinBcObj.CapofWH = adfcaAccountThinBc.CapofWH;
                        adfcaAccountThinBcObj.CapofSheds = adfcaAccountThinBc.CapofSheds;
                        adfcaAccountThinBcObj.CapofFishPonds = adfcaAccountThinBc.CapofFishPonds;
                        adfcaAccountThinBcObj.ADFCAAgrEstGrade = adfcaAccountThinBc.ADFCAAgrEstGrade;
                        adfcaAccountThinBcObj.isUploaded = "false";


                        // // //console.log('adfcaAccountThinBcObj::'+JSON.stringify(adfcaAccountThinBcObj))
                        let numOfAddress = 0;
                        if (adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress) {

                            // for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[0].ADFCAAccountThinBC_BusinessAddress.length; j++)
                            for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress.length; j++) {
                                numOfAddress++;
                                let adfcaBusinessAddress = adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[j].ADFCAAccountThinBC_BusinessAddress;
                                let addressObj: any = {};
                                addressObj.Id = adfcaBusinessAddress.Id;
                                addressObj.ADFCAId = adfcaBusinessAddress.ADFCAId;
                                addressObj.IsPrimary = adfcaBusinessAddress.IsPrimary;
                                addressObj.Updated = adfcaBusinessAddress.Updated;
                                addressObj.City = adfcaBusinessAddress.City;
                                addressObj.Country = adfcaBusinessAddress.Country;
                                addressObj.POBox = adfcaBusinessAddress.POBox;
                                addressObj.AddressLine1 = adfcaBusinessAddress.Address;
                                addressObj.AddressLine2 = adfcaBusinessAddress.Address2;
                                addressObj.EstabilishmentID = adfcaAccountThinBc.Id;
                                accountSyncAddressArray.push(addressObj);
                            }//end for loop j
                        }

                        adfcaAccountThinBcObj.mainAddresObj = numOfAddress;//escape(JSON.stringify(mainAddresObj));
                        adfcaAccountThinBcObj.addressObj = JSON.stringify(accountSyncAddressArray)
                        accountSyncArray.push(adfcaAccountThinBcObj);

                    }//end for loop i

                    // }
                    let responseObject: any = {};
                    responseObject.Error_spcMessage = response.Error_spcMessage;
                    responseObject.lastPageFlag = response.Last_spcPage;
                    responseObject.NumOfRec = parseInt(response.NumOfRec);
                    responseObject.Status = response.Status;
                    console.log("response: ", JSON.stringify(response))

                    if (response && (response.Status == "Success")) {

                        responseObject.accountSyncArray = accountSyncArray;
                        responseObject.accountSyncAddressArray = accountSyncAddressArray;

                        self.address = (accountSyncArray[0].addressObj && accountSyncArray[0].addressObj[0]) ? (((accountSyncArray[0].addressObj[0].AddressLine1) && (accountSyncArray[0].addressObj[0].AddressLine2)) ? (accountSyncArray[0].addressObj[0].AddressLine1 + ',' + accountSyncArray[0].addressObj[0].AddressLine2) : '') : ''
                        self.establishmentId = (accountSyncArray[0].Id ? accountSyncArray[0].Id : '')
                        self.area = (accountSyncArray[0].Area ? accountSyncArray[0].Area : '')
                        self.sector = (accountSyncArray[0].Sector ? accountSyncArray[0].Sector : '')
                        self.contactDetails = (accountSyncArray[0].Sector ? accountSyncArray[0].Sector : '')
                        self.establishmentName = (isArabic ? accountSyncArray[0].ArabicName ? accountSyncArray[0].ArabicName : '' : accountSyncArray[0].EnglishName ? accountSyncArray[0].EnglishName : '')
                        self.licenseEndDate = (accountSyncArray[0].LicenseExpiryDate ? accountSyncArray[0].LicenseExpiryDate : '')
                        self.licensestartDate = (accountSyncArray[0].LicenseRegDate ? accountSyncArray[0].LicenseRegDate : '')
                        self.licenseNumber = (accountSyncArray[0].LicenseNumber ? accountSyncArray[0].LicenseNumber : '')
                        self.licenseSource = (accountSyncArray[0].LicenseSource ? accountSyncArray[0].LicenseSource : '')
                        self.ehsRiskClassification = (accountSyncArray[0].EHSRiskClassification ? accountSyncArray[0].EHSRiskClassification : '')
                        self.response = JSON.stringify(accountSyncArray);

                        RealmController.addEstablishmentDetails(realm, accountSyncArray, EstablishmentSchema.name, () => {
                        });
                    }
                    self.loadingState = '';
                    if (singleRecord) {
                        self.state = 'AccountSyncSuccess'
                    }
                }
                else {
                    self.loadingState = '';
                    // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                    self.state = "error";
                }

            }
            else {
                let lastSyncDate = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, "LastSyncDate")
                lastSyncDate = lastSyncDate && lastSyncDate['0'] ? lastSyncDate['0'].Alias : "";
                let currentDateAnimal, reqObj = Object();
                if (lastSyncDate && (lastSyncDate != "")) {
                    let currentDateAnimalFromdate = new Date(lastSyncDate);
                    let currentDate = new Date();

                    function allDateFromToDate(date: any) {
                        let diffhours = (currentDate - date) / 36e5;
                        if (diffhours >= 24) {
                            let today = currentDate;
                            let tomorrow = date;
                            // tomorrow.setDate(today.getDate() + 1);
                            // let nextDate = tomorrow.setDate(today.getDate() + 1);
                            let nextDate = new Date(new Date(tomorrow).setDate(new Date(tomorrow).getDate() + 1));
                            // let tmpTomorrowDateWithoutHours = tomorrow.setHours(0, 0, 0, 0);
                            // if ((new Date()).setHours(0, 0, 0, 0) == tmpTomorrowDateWithoutHours) {
                            //     tomorrow = new Date();
                            // }

                            url = `?Login=${loginData.username}&RecToDate=${moment(today).format('L') + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}&Start_spcRow=0&RecFromDate=${moment(date).format('L') + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()}&Page_spcSize=1000&TransactionType=Delta&Attrib5=1.5.4&AccountCategory=Food&tempflg=2507`;
                            // console.log("lastSyncDate>>>" + JSON.stringify(url))
                            // console.log("diffhours>>>" + diffhours + "," + "diffhours>>>" + JSON.stringify(date) + ", nextDate>>>" + JSON.stringify(nextDate + ",") + ", tomorrow>>>" + JSON.stringify(tomorrow + ","))
                            allDate.push(url);
                            // currentDateAnimal = tomorrow;
                            // reqObj.recordToDate = currentDateAnimal;
                            // reqObj.recordFromDate = currentDateAnimalFromdate
                            reqObj.recordToDate = today.toString();
                            reqObj.recordFromDate = tomorrow.toString();
                            allDateFromToDate(nextDate)
                        }
                        else {
                            reqObj.recordToDate = moment().format('L') + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
                            reqObj.recordFromDate = moment(date).format('L') + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                            url = `?Login=${loginData.username}&RecToDate=${reqObj.recordToDate}&Start_spcRow=0&RecFromDate=${reqObj.recordFromDate}&Page_spcSize=1000&TransactionType=Delta&Attrib5=1.5.4&AccountCategory=Food&tempflg=2507`;
                            allDate.push(url);
                        }
                        let accountSyncArray = [
                            {
                                Id: 'LastSyncDate',
                                ADCCNumber: '',
                                ArabicName: '',
                                ADFCAIntialTradeLicense: '',
                                Mobile: '',
                                PreferredLanguage: '',
                                LicenseExpiryDate: '',
                                LicenseNumber: '',
                                LicenseRegDate: '',
                                AccountNumber: '',
                                AccountRegion: '',
                                Status: '',
                                AccountClass: '',
                                Alias: moment().format('L') + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
                                BankCode: '',
                                EHSRiskClassification: '',
                                LicenseCode: '',
                                Sent: '',
                                URL: '',
                                OnHold: '',
                                Reference: '',
                                LegalStatus: '',
                                Site: '',
                                Email: '',
                                MainFaxNumber: '',
                                LandlineNumber: '',
                                Area: '',
                                Sector: '',
                                City: '',
                                EnglishName: '',
                                AccountCategory: '',
                                Parent: '',
                                LicenseSource: '',
                                AccountType: '',
                                PrimaryAddressId: '',
                                NumofWH: '',
                                NumofSheds: '',
                                NumofFishPonds: '',
                                CapofWH: '',
                                CapofSheds: '',
                                CapofFishPonds: '',
                                ADFCAAgrEstGrade: '',
                                LATITUDE: '',
                                LONGITUDE: '',
                                isUploaded: '',
                                addressObj: '',
                                taskId: ''
                            }
                        ]
                        RealmController.addEstablishmentDetails(realm, accountSyncArray, EstablishmentSchema.name, () => {
                        });
                    }
                    console.log("currentDateAnimalFromdate>>>" + JSON.stringify(currentDateAnimalFromdate))
                    allDateFromToDate(currentDateAnimalFromdate);
                }
                else {
                    let accountSyncArray = [
                        {
                            Id: 'LastSyncDate',
                            ADCCNumber: '',
                            ArabicName: '',
                            ADFCAIntialTradeLicense: '',
                            Mobile: '',
                            PreferredLanguage: '',
                            LicenseExpiryDate: '',
                            LicenseNumber: '',
                            LicenseRegDate: '',
                            AccountNumber: '',
                            AccountRegion: '',
                            Status: '',
                            AccountClass: '',
                            Alias: moment().format('L') + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),
                            BankCode: '',
                            EHSRiskClassification: '',
                            LicenseCode: '',
                            Sent: '',
                            URL: '',
                            OnHold: '',
                            Reference: '',
                            LegalStatus: '',
                            Site: '',
                            Email: '',
                            MainFaxNumber: '',
                            LandlineNumber: '',
                            Area: '',
                            Sector: '',
                            City: '',
                            EnglishName: '',
                            AccountCategory: '',
                            Parent: '',
                            LicenseSource: '',
                            AccountType: '',
                            PrimaryAddressId: '',
                            NumofWH: '',
                            NumofSheds: '',
                            NumofFishPonds: '',
                            CapofWH: '',
                            CapofSheds: '',
                            CapofFishPonds: '',
                            ADFCAAgrEstGrade: '',
                            LATITUDE: '',
                            LONGITUDE: '',
                            isUploaded: '',
                            addressObj: '',
                            taskId: ''
                        }
                    ]
                    RealmController.addEstablishmentDetails(realm, accountSyncArray, EstablishmentSchema.name, () => {
                    });
                    lastSyncDate = moment().format('L') + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

                    reqObj.recordToDate = lastSyncDate;
                    reqObj.recordFromDate = lastSyncDate;

                    url = `?Login=${loginData.username}&RecToDate=${reqObj.recordToDate}&Start_spcRow=0&RecFromDate=${reqObj.recordFromDate}&Page_spcSize=1000&TransactionType=Delta&Attrib5=1.5.4&AccountCategory=Food&tempflg=2507`;
                    allDate.push(url);
                }

                yield Promise.all(allDate.map(async (element, index) => {
                    let response: any = await getAccountSyncService(element, auth);

                    //console.log("accountSyncAddressArrayresponse: ", JSON.stringify(response))
                    if (response && (response.Status == "Success")) {

                        let accountSyncAddressArray: any = [], accountSyncArray = [];
                        for (let i = 0; i < parseInt(response.NumOfRec); i++) {
                            let adfcaAccountThinBcObj: any = {};
                            let adfcaAccountThinBc = response.ListOfAdfcaAccountSyncIo.AdfcaAccountThinBc[i];
                            adfcaAccountThinBcObj.Id = adfcaAccountThinBc.Id;
                            adfcaAccountThinBcObj.ADCCNumber = adfcaAccountThinBc.ADCCNumber;
                            adfcaAccountThinBcObj.ArabicName = adfcaAccountThinBc.ArabicName;
                            adfcaAccountThinBcObj.ADFCAIntialTradeLicense = adfcaAccountThinBc.ADFCAIntialTradeLicense;
                            adfcaAccountThinBcObj.Mobile = adfcaAccountThinBc.Mobile;
                            adfcaAccountThinBcObj.PreferredLanguage = adfcaAccountThinBc.PreferredLanguage;
                            adfcaAccountThinBcObj.LicenseExpiryDate = adfcaAccountThinBc.LicenseExpiryDate
                            adfcaAccountThinBcObj.LicenseNumber = adfcaAccountThinBc.LicenseNumber;
                            adfcaAccountThinBcObj.LicenseRegDate = adfcaAccountThinBc.LicenseRegDate;
                            adfcaAccountThinBcObj.AccountNumber = adfcaAccountThinBc.AccountNumber;
                            adfcaAccountThinBcObj.AccountRegion = adfcaAccountThinBc.AccountRegion;
                            adfcaAccountThinBcObj.Status = adfcaAccountThinBc.Status;
                            adfcaAccountThinBcObj.AccountClass = adfcaAccountThinBc.AccountClass;
                            adfcaAccountThinBcObj.Alias = adfcaAccountThinBc.Alias;
                            adfcaAccountThinBcObj.BankCode = adfcaAccountThinBc.BankCode;
                            adfcaAccountThinBcObj.EHSRiskClassification = adfcaAccountThinBc.EHSRiskClassification;
                            adfcaAccountThinBcObj.LicenseCode = adfcaAccountThinBc.LicenseCode;
                            adfcaAccountThinBcObj.Sent = adfcaAccountThinBc.Sent;
                            adfcaAccountThinBcObj.URL = adfcaAccountThinBc.URL;
                            adfcaAccountThinBcObj.OnHold = adfcaAccountThinBc.OnHold;
                            adfcaAccountThinBcObj.Reference = adfcaAccountThinBc.Reference;
                            adfcaAccountThinBcObj.LegalStatus = adfcaAccountThinBc.LegalStatus;
                            adfcaAccountThinBcObj.Site = adfcaAccountThinBc.Site;
                            adfcaAccountThinBcObj.Email = adfcaAccountThinBc.Email;
                            adfcaAccountThinBcObj.MainFaxNumber = adfcaAccountThinBc.MainFaxNumber;
                            adfcaAccountThinBcObj.LandlineNumber = adfcaAccountThinBc.LandlineNumber;
                            adfcaAccountThinBcObj.Area = adfcaAccountThinBc.Area;
                            adfcaAccountThinBcObj.Sector = adfcaAccountThinBc.Sector;
                            adfcaAccountThinBcObj.City = adfcaAccountThinBc.City;
                            adfcaAccountThinBcObj.EnglishName = adfcaAccountThinBc.EnglishName;
                            adfcaAccountThinBcObj.AccountCategory = adfcaAccountThinBc.AccountCategory;
                            adfcaAccountThinBcObj.Parent = adfcaAccountThinBc.Parent;
                            adfcaAccountThinBcObj.LicenseSource = adfcaAccountThinBc.LicenseSource;
                            adfcaAccountThinBcObj.AccountType = adfcaAccountThinBc.AccountType;
                            adfcaAccountThinBcObj.PrimaryAddressId = adfcaAccountThinBc.PrimaryAddressId;

                            adfcaAccountThinBcObj.NumofWH = adfcaAccountThinBc.NumofWH;
                            adfcaAccountThinBcObj.NumofSheds = adfcaAccountThinBc.NumofSheds;
                            adfcaAccountThinBcObj.NumofFishPonds = adfcaAccountThinBc.NumofFishPonds;
                            adfcaAccountThinBcObj.CapofWH = adfcaAccountThinBc.CapofWH;
                            adfcaAccountThinBcObj.CapofSheds = adfcaAccountThinBc.CapofSheds;
                            adfcaAccountThinBcObj.CapofFishPonds = adfcaAccountThinBc.CapofFishPonds;
                            adfcaAccountThinBcObj.ADFCAAgrEstGrade = adfcaAccountThinBc.ADFCAAgrEstGrade;
                            adfcaAccountThinBcObj.isUploaded = "false";


                            // // //console.log('adfcaAccountThinBcObj::'+JSON.stringify(adfcaAccountThinBcObj))
                            let numOfAddress = 0;
                            if (adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress) {

                                // for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[0].ADFCAAccountThinBC_BusinessAddress.length; j++)
                                for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress.length; j++) {
                                    numOfAddress++;
                                    let adfcaBusinessAddress = adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[j].ADFCAAccountThinBC_BusinessAddress;
                                    let addressObj: any = {};
                                    addressObj.Id = adfcaBusinessAddress.Id;
                                    addressObj.ADFCAId = adfcaBusinessAddress.ADFCAId;
                                    addressObj.IsPrimary = adfcaBusinessAddress.IsPrimary;
                                    addressObj.Updated = adfcaBusinessAddress.Updated;
                                    addressObj.City = adfcaBusinessAddress.City;
                                    addressObj.Country = adfcaBusinessAddress.Country;
                                    addressObj.POBox = adfcaBusinessAddress.POBox;
                                    addressObj.AddressLine1 = adfcaBusinessAddress.Address;
                                    addressObj.AddressLine2 = adfcaBusinessAddress.Address2;
                                    addressObj.EstabilishmentID = adfcaAccountThinBc.Id;
                                    accountSyncAddressArray.push(addressObj);
                                }//end for loop j
                            }

                            adfcaAccountThinBcObj.mainAddresObj = numOfAddress;//escape(JSON.stringify(mainAddresObj));
                            adfcaAccountThinBcObj.addressObj = JSON.stringify(accountSyncAddressArray)
                            accountSyncArray.push(adfcaAccountThinBcObj);

                        }//end for loop i

                        // }
                        let responseObject: any = {};
                        responseObject.Error_spcMessage = response.Error_spcMessage;
                        responseObject.lastPageFlag = response.Last_spcPage;
                        responseObject.NumOfRec = parseInt(response.NumOfRec);
                        responseObject.Status = response.Status;

                        if (response && (response.Status == "Success")) {

                            responseObject.accountSyncArray = accountSyncArray;
                            responseObject.accountSyncAddressArray = accountSyncAddressArray;

                            self.address = (accountSyncArray[0].addressObj && accountSyncArray[0].addressObj[0]) ? (((accountSyncArray[0].addressObj[0].AddressLine1) && (accountSyncArray[0].addressObj[0].AddressLine2)) ? (accountSyncArray[0].addressObj[0].AddressLine1 + ',' + accountSyncArray[0].addressObj[0].AddressLine2) : '') : ''
                            self.establishmentId = (accountSyncArray[0].Id ? accountSyncArray[0].Id : '')
                            self.area = (accountSyncArray[0].Area ? accountSyncArray[0].Area : '')
                            self.sector = (accountSyncArray[0].Sector ? accountSyncArray[0].Sector : '')
                            self.contactDetails = (accountSyncArray[0].Sector ? accountSyncArray[0].Sector : '')
                            self.establishmentName = (isArabic ? accountSyncArray[0].ArabicName ? accountSyncArray[0].ArabicName : '' : accountSyncArray[0].EnglishName ? accountSyncArray[0].EnglishName : '')
                            self.licenseEndDate = (accountSyncArray[0].LicenseExpiryDate ? accountSyncArray[0].LicenseExpiryDate : '')
                            self.licensestartDate = (accountSyncArray[0].LicenseRegDate ? accountSyncArray[0].LicenseRegDate : '')
                            self.licenseNumber = (accountSyncArray[0].LicenseNumber ? accountSyncArray[0].LicenseNumber : '')
                            self.licenseSource = (accountSyncArray[0].LicenseSource ? accountSyncArray[0].LicenseSource : '')
                            self.ehsRiskClassification = (accountSyncArray[0].EHSRiskClassification ? accountSyncArray[0].EHSRiskClassification : '')
                            self.response = JSON.stringify(accountSyncArray);

                            RealmController.addEstablishmentDetails(realm, accountSyncArray, EstablishmentSchema.name, () => {
                            });
                        }
                        self.loadingState = '';
                        if (singleRecord) {
                            self.state = 'AccountSyncSuccess'
                        }
                    }
                    else {
                        self.loadingState = '';
                        // ToastAndroid.show(I18n.t('others.failedToAgainPleaseTryAgainLater'), 1000);
                        self.state = "error";
                    }

                })).then(() => { })
            }


        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }
    }),

    callToGetContactList: flow(function* (licenseCode: string) {
        self.state = "pending";
        self.loadingState = 'Fetching Contact Details';
        try {

            let a = {}
            let auth = '';
            let payload = {}
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};

            let response: any = yield getContactLists(licenseCode);
            debugger;
            console.log("response:" + JSON.stringify(response))
            if (response && (response.Status == "Success")) {

                console.log('response::' + JSON.stringify(response));

                let contacts = response.TradelicenseHistory && response.TradelicenseHistory.Establishment[0] && response.TradelicenseHistory.Establishment[0].ListOfPartyRelationshipTo ? response.TradelicenseHistory.Establishment[0].ListOfPartyRelationshipTo.EstalishmentRelationship : [];

                let newContactList = [];
                // console.log('contact list::' + JSON.stringify(contacts));

                if (contacts.length > 0) {
                    newContactList = contacts.map((item: any) => {
                        return { name: item.Value, type: item.Type, relationship: item.Relationship };
                    });
                }

                // console.log('contact list::' + JSON.stringify(newContactList));

                let contactsNumber = response.TradelicenseHistory && response.TradelicenseHistory.Establishment[0] && response.TradelicenseHistory.Establishment[0].ListOfContact ? response.TradelicenseHistory.Establishment[0].ListOfContact.Contact : [];
                // //console.log('contacts', contacts);
                let newContactListNumber = [];
                if (contactsNumber.length > 0) {
                    newContactListNumber = contactsNumber.map((item: any) => {
                        return { mobileNumber: item.MobileNumber, nationality: item.Nationality, };
                    })
                }

                // self.contactList = JSON.stringify({ ...newContactList, ...newContactListNumber });
                // console.log('contact list::' + JSON.stringify(self.contactList));
                let contactObj = Object();
                let contactArr = Array();
                if (newContactList.length > 0) {
                    for (let index = 0; index < newContactList.length; index++) {
                        const element = newContactList[index];
                        contactObj.name = element.name;
                        contactObj.type = element.type;
                        contactObj.relationship = element.relationship;
                        contactArr.push(element);
                    }
                }
                if (contactArr.length > 0) {
                    for (let indexContact = 0; indexContact < contactArr.length; indexContact++) {
                        const elementContact = contactArr[indexContact];
                        for (let indexNewContact = 0; indexNewContact < newContactListNumber.length; indexNewContact++) {
                            const elementNewContact = newContactListNumber[indexNewContact];
                            elementContact.mobileNumber = elementNewContact.mobileNumber;
                            elementContact.nationality = elementNewContact.nationality;
                            contactArr[indexContact] = (elementContact);
                        }

                    }
                }
                else {

                    for (let indexNewContact = 0; indexNewContact < newContactListNumber.length; indexNewContact++) {
                        const elementNewContact = newContactListNumber[indexNewContact];
                        contactArr.push(elementNewContact);
                    }

                }

                // console.log('contactArr ::' + JSON.stringify(contactArr));
                self.loadingState = '';
                self.state = 'done'
                self.contactList = JSON.stringify(contactArr);
                NavigationService.navigate('ContactList')

            }
            else {
                self.loadingState = '';
                ToastAndroid.show(response.message ? response.message : "Error:" + response.ErrorCode, 1000);
                self.state = "error";
            }

        } catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }
    })

})).views(self => ({
    getEstablishmentName() {
        return self.establishmentName
    },
    getLicenseSource() {
        return self.licenseSource
    },
    getLicenseStartDate() {
        return self.licensestartDate
    },
    getLicenseEndDate() {
        return self.licenseEndDate
    },
    getLicenseNumber() {
        return self.licenseNumber
    },
    getContactDetails() {
        return self.contactDetails
    },
    getAddress() {
        return self.address
    },
    getArea() {
        return self.area
    },
    getEstIds() {
        return self.estId
    },

}));


export default EstablishmentStore;
