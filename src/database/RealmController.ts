const Realm = require('realm');

import LoginSchema from './LoginSchema';
import LanguageSchema from './LanguageSchema';
import CheckListSchema from './CheckListSchema'
import LOVSchema from './LOVSchema'
import ArabicLOVSchema from './ArabicLOVSchema'
import EstablishmentSchema from './EstablishmentSchema'
import TaskSchema from './TaskSchema';
import ProfileDetailsSchema from './ProfileSchema';
import AllEstablishmentSchema from './AllEstablishmentSchema';
import MergedTasksTableSchema from './MergedTasksTableSchema';
import SrDetailsSchema from './SrDetailsSchema';
import Inspectionbase64Schema from './Inspectionbase64Schema';
import XLSX from 'xlsx';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath, readDir, mkdir } from 'react-native-fs';
import { isDev } from '../config/config';
const input = (res: any) => res;
const output = (str: any) => str;
const make_cols = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, (x, i) => XLSX.utils.encode_col(i));
const make_width = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, () => 60);

let estArrayforAll = Array()

async function AddEst() {
    try {

        if (isDev) {
            readFileAssets('AccountsData.xlsx', 'ascii').then((res) => {
                /* parse file */
                const wb = XLSX.read(input(res), { type: 'binary' });
                debugger
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                debugger
                let tempCustumArray = [];
                // setEstablishmentLength(data.length)
                for (let index = 0; index < data.length; index++) {
                    const element: any = data[index];
                    if (element.length) {
                        let obj = {
                            Id: element[1] ? element[1].toString() : "",
                            ADCCNumber: "",
                            ArabicName: element[29] ? element[29].toString() : "",
                            ADFCAIntialTradeLicense: element[30] ? element[30].toString() : "",
                            Mobile: element[31] ? element[31].toString() : "",
                            PreferredLanguage: element[32] ? element[32].toString() : "",
                            LicenseExpiryDate: element[33] ? element[33].toString() : "",
                            LicenseNumber: element[28] ? element[28].toString() : "",
                            LicenseRegDate: element[35] ? element[35].toString() : "",
                            AccountNumber: element[1] ? element[1].toString() : "",
                            AccountRegion: element[38] ? element[38].toString() : "",
                            Status: element[2] ? element[2].toString() : "",
                            AccountClass: element[3] ? element[3].toString() : "",
                            Alias: element[4] ? element[4].toString() : "",
                            BankCode: element[5] ? element[5].toString() : "",
                            EHSRiskClassification: element[39] ? element[39].toString() : "",
                            LicenseCode: element[34] ? element[34].toString() : "",
                            Sent: "",
                            URL: element[6] ? element[6].toString() : "",
                            OnHold: element[7] ? element[7].toString() : "",
                            Reference: element[8] ? element[8].toString() : "",
                            LegalStatus: element[9] ? element[9].toString() : "",
                            Site: element[10] ? element[10].toString() : "",
                            Email: element[11] ? element[11].toString() : "",
                            MainFaxNumber: element[12] ? element[12].toString() : "",
                            LandlineNumber: element[13] ? element[13].toString() : "",
                            Area: element[16] ? element[16].toString() : "",
                            Sector: element[15] ? element[15].toString() : "",
                            City: element[14] ? element[14].toString() : "",
                            EnglishName: element[17] ? element[17].toString() : "",
                            AccountCategory: element[0] ? element[0].toString() : "",
                            Parent: element[18] ? element[18].toString() : "",
                            LicenseSource: element[40] ? element[40].toString() : "",
                            AccountType: element[19] ? element[19].toString() : "",
                            PrimaryAddressId: element[20] ? element[20].toString() : "",
                            NumofWH: element[21] ? element[21].toString() : "",
                            NumofSheds: element[22] ? element[22].toString() : "",
                            NumofFishPonds: element[23] ? element[23].toString() : "",
                            CapofWH: element[24] ? element[24].toString() : "",
                            CapofSheds: element[25] ? element[25].toString() : "",
                            CapofFishPonds: element[26] ? element[26].toString() : "",
                            ADFCAAgrEstGrade: element[27] ? element[27].toString() : "",
                            LATITUDE: element[36] ? element[36].toString() : "",
                            LONGITUDE: element[37] ? element[37].toString() : "",
                            isUploaded: "",
                            addressObj: "",
                            taskId: "",
                        };
                        // tempCustumArray.push(obj);
                        estArrayforAll.push(obj);
                    }
                }
            }).catch((err) => {
                console.log("importFile Error", "Error " + err.message);
            });

        }
        else {
            await readFileAssets('EstDataAA.xlsx', 'ascii').then((res) => {
                /* parse file */
                const wb = XLSX.read(input(res), { type: 'binary' });
                debugger
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                debugger
                let tempCustumArray = Array();
                // setEstablishmentLength(data.length)
                for (let index = 0; index < data.length; index++) {
                    const element: any = data[index];
                    if (element.length) {
                        let addressObj: any = {};
                        addressObj.Id = element[21] ? element[21].toString() : "";
                        addressObj.ADFCAId = "";
                        addressObj.IsPrimary = "Y";
                        addressObj.Updated = "";
                        addressObj.City = element[44] ? element[44].toString() : "";
                        addressObj.Country = element[42] ? element[42].toString() : "";
                        addressObj.POBox = '';
                        addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
                        addressObj.AddressLine2 = '';
                        addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

                        let obj = {
                            Id: element[0] ? element[0].toString() : "",
                            ADCCNumber: "",
                            ArabicName: element[30] ? element[30].toString() : "",
                            ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
                            Mobile: element[32] ? element[32].toString() : "",
                            PreferredLanguage: element[33] ? element[33].toString() : "",
                            LicenseExpiryDate: element[34] ? element[34].toString() : "",
                            LicenseNumber: element[29] ? element[29].toString() : "",
                            LicenseRegDate: element[36] ? element[36].toString() : "",
                            AccountNumber: element[1] ? element[1].toString() : "",
                            AccountRegion: element[39] ? element[39].toString() : "",
                            Status: element[3] ? element[3].toString() : "",
                            AccountClass: element[4] ? element[4].toString() : "",
                            Alias: element[5] ? element[5].toString() : "",
                            BankCode: element[6] ? element[6].toString() : "",
                            EHSRiskClassification: element[40] ? element[40].toString() : "",
                            LicenseCode: element[35] ? element[35].toString() : "",
                            Sent: "",
                            URL: element[7] ? element[7].toString() : "",
                            OnHold: element[8] ? element[8].toString() : "",
                            Reference: element[9] ? element[9].toString() : "",
                            LegalStatus: element[10] ? element[10].toString() : "",
                            Site: element[11] ? element[11].toString() : "",
                            Email: element[12] ? element[12].toString() : "",
                            MainFaxNumber: element[13] ? element[13].toString() : "",
                            LandlineNumber: element[14] ? element[14].toString() : "",
                            Area: element[17] ? element[17].toString() : "",
                            Sector: element[16] ? element[16].toString() : "",
                            City: element[15] ? element[15].toString() : "",
                            EnglishName: element[18] ? element[18].toString() : "",
                            AccountCategory: element[0] ? element[0].toString() : "",
                            Parent: element[19] ? element[19].toString() : "",
                            LicenseSource: element[41] ? element[41].toString() : "",
                            AccountType: element[20] ? element[20].toString() : "",
                            PrimaryAddressId: element[21] ? element[21].toString() : "",
                            NumofWH: element[22] ? element[22].toString() : "",
                            NumofSheds: element[23] ? element[23].toString() : "",
                            NumofFishPonds: element[24] ? element[24].toString() : "",
                            CapofWH: element[25] ? element[25].toString() : "",
                            CapofSheds: element[26] ? element[26].toString() : "",
                            CapofFishPonds: element[27] ? element[27].toString() : "",
                            ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
                            LATITUDE: element[37] ? element[37].toString() : "",
                            LONGITUDE: element[38] ? element[38].toString() : "",
                            isUploaded: "",
                            addressObj: JSON.stringify([addressObj]),
                            taskId: "",
                        };
                        // tempCustumArray.push(obj);
                        estArrayforAll.push(obj);

                    }
                }

                console.log("estArrayforAll.length", estArrayforAll.length);
                // setAllEst(EstDataAA);
                // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            }).catch((err) => {
                console.log("importFile Error", "Error " + err.message);
            });
            let EstDataAD = Array()

            await readFileAssets('EstDataAD.xlsx', 'ascii').then((res) => {
                /* parse file */
                const wb = XLSX.read(input(res), { type: 'binary' });
                debugger
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                debugger
                let tempCustumArray = Array();
                // setEstablishmentLength(data.length)
                for (let index = 0; index < data.length; index++) {
                    const element: any = data[index];
                    if (element.length) {
                        let addressObj: any = {};
                        addressObj.Id = element[21] ? element[21].toString() : "";
                        addressObj.ADFCAId = "";
                        addressObj.IsPrimary = "Y";
                        addressObj.Updated = "";
                        addressObj.City = element[44] ? element[44].toString() : "";
                        addressObj.Country = element[42] ? element[42].toString() : "";
                        addressObj.POBox = '';
                        addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
                        addressObj.AddressLine2 = '';
                        addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

                        let obj = {
                            Id: element[0] ? element[0].toString() : "",
                            ADCCNumber: "",
                            ArabicName: element[30] ? element[30].toString() : "",
                            ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
                            Mobile: element[32] ? element[32].toString() : "",
                            PreferredLanguage: element[33] ? element[33].toString() : "",
                            LicenseExpiryDate: element[34] ? element[34].toString() : "",
                            LicenseNumber: element[29] ? element[29].toString() : "",
                            LicenseRegDate: element[36] ? element[36].toString() : "",
                            AccountNumber: element[1] ? element[1].toString() : "",
                            AccountRegion: element[39] ? element[39].toString() : "",
                            Status: element[3] ? element[3].toString() : "",
                            AccountClass: element[4] ? element[4].toString() : "",
                            Alias: element[5] ? element[5].toString() : "",
                            BankCode: element[6] ? element[6].toString() : "",
                            EHSRiskClassification: element[40] ? element[40].toString() : "",
                            LicenseCode: element[35] ? element[35].toString() : "",
                            Sent: "",
                            URL: element[7] ? element[7].toString() : "",
                            OnHold: element[8] ? element[8].toString() : "",
                            Reference: element[9] ? element[9].toString() : "",
                            LegalStatus: element[10] ? element[10].toString() : "",
                            Site: element[11] ? element[11].toString() : "",
                            Email: element[12] ? element[12].toString() : "",
                            MainFaxNumber: element[13] ? element[13].toString() : "",
                            LandlineNumber: element[14] ? element[14].toString() : "",
                            Area: element[17] ? element[17].toString() : "",
                            Sector: element[16] ? element[16].toString() : "",
                            City: element[15] ? element[15].toString() : "",
                            EnglishName: element[18] ? element[18].toString() : "",
                            AccountCategory: element[0] ? element[0].toString() : "",
                            Parent: element[19] ? element[19].toString() : "",
                            LicenseSource: element[41] ? element[41].toString() : "",
                            AccountType: element[20] ? element[20].toString() : "",
                            PrimaryAddressId: element[21] ? element[21].toString() : "",
                            NumofWH: element[22] ? element[22].toString() : "",
                            NumofSheds: element[23] ? element[23].toString() : "",
                            NumofFishPonds: element[24] ? element[24].toString() : "",
                            CapofWH: element[25] ? element[25].toString() : "",
                            CapofSheds: element[26] ? element[26].toString() : "",
                            CapofFishPonds: element[27] ? element[27].toString() : "",
                            ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
                            LATITUDE: element[37] ? element[37].toString() : "",
                            LONGITUDE: element[38] ? element[38].toString() : "",
                            isUploaded: "",
                            addressObj: JSON.stringify([addressObj]),
                            taskId: "",
                        };
                        // tempCustumArray.push(obj)
                        estArrayforAll.push(obj)

                    }

                }
                console.log("estArrayforAll.length", estArrayforAll.length);
                // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            }).catch((err) => {

                console.log("importFile Error1", "Error " + err.message);
            });

            await readFileAssets('EstDataOther.xlsx', 'ascii').then((res) => {
                /* parse file */
                const wb = XLSX.read(input(res), { type: 'binary' });
                debugger
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                debugger
                let tempCustumArray = Array();
                // setEstablishmentLength(data.length)
                for (let index = 0; index < data.length; index++) {
                    const element: any = data[index];
                    if (element.length) {
                        let addressObj: any = {};
                        addressObj.Id = element[21] ? element[21].toString() : "";
                        addressObj.ADFCAId = "";
                        addressObj.IsPrimary = "Y";
                        addressObj.Updated = "";
                        addressObj.City = element[44] ? element[44].toString() : "";
                        addressObj.Country = element[42] ? element[42].toString() : "";
                        addressObj.POBox = '';
                        addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
                        addressObj.AddressLine2 = '';
                        addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

                        let obj = {
                            Id: element[0] ? element[0].toString() : "",
                            ADCCNumber: "",
                            ArabicName: element[30] ? element[30].toString() : "",
                            ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
                            Mobile: element[32] ? element[32].toString() : "",
                            PreferredLanguage: element[33] ? element[33].toString() : "",
                            LicenseExpiryDate: element[34] ? element[34].toString() : "",
                            LicenseNumber: element[29] ? element[29].toString() : "",
                            LicenseRegDate: element[36] ? element[36].toString() : "",
                            AccountNumber: element[1] ? element[1].toString() : "",
                            AccountRegion: element[39] ? element[39].toString() : "",
                            Status: element[3] ? element[3].toString() : "",
                            AccountClass: element[4] ? element[4].toString() : "",
                            Alias: element[5] ? element[5].toString() : "",
                            BankCode: element[6] ? element[6].toString() : "",
                            EHSRiskClassification: element[40] ? element[40].toString() : "",
                            LicenseCode: element[35] ? element[35].toString() : "",
                            Sent: "",
                            URL: element[7] ? element[7].toString() : "",
                            OnHold: element[8] ? element[8].toString() : "",
                            Reference: element[9] ? element[9].toString() : "",
                            LegalStatus: element[10] ? element[10].toString() : "",
                            Site: element[11] ? element[11].toString() : "",
                            Email: element[12] ? element[12].toString() : "",
                            MainFaxNumber: element[13] ? element[13].toString() : "",
                            LandlineNumber: element[14] ? element[14].toString() : "",
                            Area: element[17] ? element[17].toString() : "",
                            Sector: element[16] ? element[16].toString() : "",
                            City: element[15] ? element[15].toString() : "",
                            EnglishName: element[18] ? element[18].toString() : "",
                            AccountCategory: element[0] ? element[0].toString() : "",
                            Parent: element[19] ? element[19].toString() : "",
                            LicenseSource: element[41] ? element[41].toString() : "",
                            AccountType: element[20] ? element[20].toString() : "",
                            PrimaryAddressId: element[21] ? element[21].toString() : "",
                            NumofWH: element[22] ? element[22].toString() : "",
                            NumofSheds: element[23] ? element[23].toString() : "",
                            NumofFishPonds: element[24] ? element[24].toString() : "",
                            CapofWH: element[25] ? element[25].toString() : "",
                            CapofSheds: element[26] ? element[26].toString() : "",
                            CapofFishPonds: element[27] ? element[27].toString() : "",
                            ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
                            LATITUDE: element[37] ? element[37].toString() : "",
                            LONGITUDE: element[38] ? element[38].toString() : "",
                            isUploaded: "",
                            addressObj: JSON.stringify([addressObj]),
                            taskId: "",
                        };
                        estArrayforAll.push(obj)

                    }
                }
                console.log("estArrayforAll.length", estArrayforAll.length);
                // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            }).catch((err) => {

                console.log("importFile Erro3r", "Error " + err.message);
            });
            let EstDateWR = Array()
            await readFileAssets('EstDateWR.xlsx', 'ascii').then((res) => {
                /* parse file */
                const wb = XLSX.read(input(res), { type: 'binary' });
                debugger
                /* convert first worksheet to AOA */
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                debugger
                let tempCustumArray = Array();
                // setEstablishmentLength(data.length)
                for (let index = 0; index < data.length; index++) {
                    const element: any = data[index];
                    if (element.length) {
                        let addressObj: any = {};
                        addressObj.Id = element[21] ? element[21].toString() : "";
                        addressObj.ADFCAId = "";
                        addressObj.IsPrimary = "Y";
                        addressObj.Updated = "";
                        addressObj.City = element[44] ? element[44].toString() : "";
                        addressObj.Country = element[42] ? element[42].toString() : "";
                        addressObj.POBox = '';
                        addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
                        addressObj.AddressLine2 = '';
                        addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

                        let obj = {
                            Id: element[0] ? element[0].toString() : "",
                            ADCCNumber: "",
                            ArabicName: element[30] ? element[30].toString() : "",
                            ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
                            Mobile: element[32] ? element[32].toString() : "",
                            PreferredLanguage: element[33] ? element[33].toString() : "",
                            LicenseExpiryDate: element[34] ? element[34].toString() : "",
                            LicenseNumber: element[29] ? element[29].toString() : "",
                            LicenseRegDate: element[36] ? element[36].toString() : "",
                            AccountNumber: element[1] ? element[1].toString() : "",
                            AccountRegion: element[39] ? element[39].toString() : "",
                            Status: element[3] ? element[3].toString() : "",
                            AccountClass: element[4] ? element[4].toString() : "",
                            Alias: element[5] ? element[5].toString() : "",
                            BankCode: element[6] ? element[6].toString() : "",
                            EHSRiskClassification: element[40] ? element[40].toString() : "",
                            LicenseCode: element[35] ? element[35].toString() : "",
                            Sent: "",
                            URL: element[7] ? element[7].toString() : "",
                            OnHold: element[8] ? element[8].toString() : "",
                            Reference: element[9] ? element[9].toString() : "",
                            LegalStatus: element[10] ? element[10].toString() : "",
                            Site: element[11] ? element[11].toString() : "",
                            Email: element[12] ? element[12].toString() : "",
                            MainFaxNumber: element[13] ? element[13].toString() : "",
                            LandlineNumber: element[14] ? element[14].toString() : "",
                            Area: element[17] ? element[17].toString() : "",
                            Sector: element[16] ? element[16].toString() : "",
                            City: element[15] ? element[15].toString() : "",
                            EnglishName: element[18] ? element[18].toString() : "",
                            AccountCategory: element[0] ? element[0].toString() : "",
                            Parent: element[19] ? element[19].toString() : "",
                            LicenseSource: element[41] ? element[41].toString() : "",
                            AccountType: element[20] ? element[20].toString() : "",
                            PrimaryAddressId: element[21] ? element[21].toString() : "",
                            NumofWH: element[22] ? element[22].toString() : "",
                            NumofSheds: element[23] ? element[23].toString() : "",
                            NumofFishPonds: element[24] ? element[24].toString() : "",
                            CapofWH: element[25] ? element[25].toString() : "",
                            CapofSheds: element[26] ? element[26].toString() : "",
                            CapofFishPonds: element[27] ? element[27].toString() : "",
                            ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
                            LATITUDE: element[37] ? element[37].toString() : "",
                            LONGITUDE: element[38] ? element[38].toString() : "",
                            isUploaded: "",
                            addressObj: JSON.stringify([addressObj]),
                            taskId: "",
                        };
                        // EstDataAA.push([obj])
                        estArrayforAll.push(obj)

                    }
                }
                console.log("estArrayforAll.length", estArrayforAll.length);
                // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            }).catch((err) => {

                console.log("importFile Err4or", "Error " + err.message);
            });
            console.log("EstDataAA.length", estArrayforAll.length);

        }

    } catch (error) {
        console.log("errorgetTask" + error)
    }
};

function getEstDetails(realm: any, Id: any) {
    let schemaName = EstablishmentSchema.name;
    let data = realm.objects(schemaName);
    let filterData = data.filtered(`Id = "${Id}"`);
    return JSON.parse(JSON.stringify(filterData));
}
function getAllEstFromDb(realm: any) {
    let schemaName = EstablishmentSchema.name;
    let data = realm.objects(schemaName);
    return JSON.parse(JSON.stringify(data));
}

if (estArrayforAll.length == 0) {
    AddEst()
    console.log("length0")
}
export const RealmController = {

    getRealmInstance: () => {
        let realm;
        return realm = new Realm({
            schema: [LoginSchema, LanguageSchema, CheckListSchema, SrDetailsSchema, LOVSchema, ArabicLOVSchema, EstablishmentSchema, TaskSchema,
                ProfileDetailsSchema, AllEstablishmentSchema, MergedTasksTableSchema, Inspectionbase64Schema], schemaVersion: 4

        });
    },

    addMergeTask: (realm: any, obj: any, cb: any) => {

        try {
            let updt = realm.objects(MergedTasksTableSchema.name);
            realm.write(() => {
                realm.create(MergedTasksTableSchema.name, {
                    TaskId: obj.TaskId,
                    FollowupId: obj.FollowupId,
                    userId: obj.userId,
                }, true);
            });
            cb();
        }
        catch (e) {
            //console.log("Error in realmTaskMerge: ", e + obj);
        }
    },

    getMergeTask: (realm: any) => {
        try {
            let data = realm.objects(MergedTasksTableSchema.name);
            // let filterData = data.filtered(`taskId = "${taskId}"`);
            return JSON.parse(JSON.stringify(data));
        }
        catch (e) {
            //console.log("Error in realmgetTaskMerge: ", e);
        }
    },

    getEStLength: (realm: any) => {
        try {
            return JSON.parse(JSON.stringify(estArrayforAll.length));
        }
        catch (e) {
            //console.log("Error in realmgetTaskMerge: ", e);
        }
    },

    getMergeTaskById: (realm: any, taskId: string) => {
        try {
            let data = realm.objects(MergedTasksTableSchema.name);
            let filterData = data.filtered(`TaskId = "${taskId}"`);
            return JSON.parse(JSON.stringify(filterData));
        }
        catch (e) {
            return null;
            //console.log("Error in realmgetTaskMerge: ", e);
        }
    },

    deleteMergeTask: (realm: any, taskId: string, cb: any) => {
        try {
            realm.delete(realm.objectForPrimaryKey(MergedTasksTableSchema.name, taskId));
            cb()

            // let updt = realm.objects(MergedTasksTableSchema.name);
            // realm.write(() => {
            //     realm.delete(updt);
            // })
            // cb()
        }
        catch (e) {
            //console.log("Error in realmeleteTaskMerge: ", e);
        }
    },

    deleteAllMergeTask: (realm: any, cb: any) => {
        try {

            let updt = realm.objects(MergedTasksTableSchema.name);
            realm.write(() => {
                realm.delete(updt);
            })
            cb()
        }
        catch (e) {
            cb()
            //console.log("Error in realmeleteTaskMerge: ", e);
        }
    },

    addLoginInformation: (realm: any, obj: any, cb: any) => {

        try {
            let updt = realm.objects(LoginSchema.name);
            realm.write(() => {
                realm.delete(updt);
                realm.create(LoginSchema.name, {
                    isLoggedIn: obj.isLoggedIn,
                    loginResponse: obj.loginResponse,
                    username: obj.username,
                    password: obj.password
                }, true);
            });
            cb();
        }
        catch (e) {
            // //console.log("Error in realm: ", e + obj);
        }
    },

    getLoginData: (realm: any, schemaName: string) => {
        try {
            let data = realm.objects(schemaName);
            return JSON.parse(JSON.stringify(data));
        }
        catch (e) {
            // //console.log("Error in realm: ", e);
        }
    },

    deleteLoginData: (realm: any, cb: any) => {
        try {
            let updt = realm.objects(LoginSchema.name);
            realm.write(() => {
                realm.delete(updt);
            })
            cb()
        }
        catch (e) {
            // //console.log("Error in realm: ", e);
        }
    },

    addLanguage: (realm: any, obj: any) => {

        realm.write(() => {
            realm.create(LanguageSchema.name, {
                LangId: obj.langId,
                Lang: obj.lan

            }, true);
        });

    },

    getLanguage: (realm: any, schemaName: string, langId: any): any => {

        let data = realm.objects(schemaName);
        let filterData = data.filtered(`LangId = "${langId}"`);
        return filterData;

    },

    addCheckListInDB: (realm: any, obj: any, cb: any) => {
        try {
            if (obj.taskId && obj.taskId != '') {
                realm.write(() => {
                    realm.create(CheckListSchema.name, {
                        checkList: obj.checkList,
                        taskId: obj.taskId,
                        timeElapsed: obj.timeElapsed,
                        timeStarted: obj.timeStarted,
                        isCompleted: obj.isCompleted,
                        sign: obj.sign,
                        overallcomment: obj.overallcomment,
                        contactname: obj.contactname,
                        contactnumber: obj.contactnumber,
                        eid: obj.eid,
                    }, true);
                });
                // //console.log("added:: "+ obj.taskId);
            }
            cb();
        } catch (e) {
            cb()
            console.log("Error in realmADDchecklist: ", e);
        }
    },

    deleteCheckListById: (realm: any, taskId: string, cb: any) => {
        try {
            realm.write(() => {
                console.log(" realmdeleteTaskBy: " + taskId);
                realm.delete(realm.objectForPrimaryKey(CheckListSchema.name, taskId));
            })
            cb()
        }
        catch (e) {
            cb()
            console.log("Error in realmdeletechecklistTaskBy: ", taskId);
        }
    },
    getCheckListForTaskId: (realm: any, schemaName: string, taskId: any) => {
        // debugger;
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`taskId = "${taskId}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    addbase64ListInDB: (realm: any, obj: any, cb: any) => {
        try {
            if (obj.taskId && obj.taskId != '') {
                realm.write(() => {
                    realm.create(Inspectionbase64Schema.name, {
                        base64List: obj.base64List,
                        taskId: obj.taskId
                    }, true);
                });
                // //console.log("added:: "+ obj.taskId);
            }
            cb();
        } catch (e) {
            //console.log("Error in realmaddbase64: ", e + obj);
        }
    },

    getbase64ListForTaskId: (realm: any, taskId: any) => {
        // debugger;
        let data = realm.objects(Inspectionbase64Schema.name);
        let filterData = data.filtered(`taskId = "${taskId}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    addLovDetails: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
            // debugger
            let updt = realm.objects(schemaName);
            realm.write(() => {
                realm.delete(updt);
            })
            for (let i = 0; i < obj.length; i++) {
                realm.write(() => {
                    realm.create(schemaName, {
                        key: (obj[i].key),
                        value: JSON.stringify(obj[i].value),
                    }, true);
                });
            }
            cb();
        }
        catch (e) {
            // debugger
            // //console.log("Error in realm: ", e + JSON.stringify(obj));
        }
    },

    addSRDetails: (realm: any, obj: any, cb: any) => {
        try {

            for (let i = 0; i < obj.length; i++) {
                realm.write(() => {
                    realm.create(SrDetailsSchema.name, {
                        LoginName: obj[i].LoginName,
                        ADFCAExibitionToDate: obj[i].ADFCAExibitionToDate,
                        ADFCAExbFromDate: obj[i].ADFCAExbFromDate,
                        SiebSRId: obj[i].SiebSRId,
                        ADFCACertificateExpDate: obj[i].ADFCACertificateExpDate,
                        ADFCACertificateStartDate: obj[i].ADFCACertificateStartDate,
                        ADFCAEventType: obj[i].ADFCAEventType,
                        ADFCASRInspector: obj[i].ADFCASRInspector,
                        ADFCAEventName: obj[i].ADFCAEventName,
                        ADFCAPuposeOfVisit: obj[i].ADFCAPuposeOfVisit,
                        ADFCAPremiseAddress: obj[i].ADFCAPremiseAddress,
                        ApplicationType: obj[i].ApplicationType,
                        ADFCANoOfBooth: obj[i].ADFCANoOfBooth,
                        OpenedDate: obj[i].OpenedDate,
                        ADFCACertificateNo: obj[i].ADFCACertificateNo,
                        Application: obj[i].Application,
                        Status: obj[i].Status,
                        ADFCAEventLocation: obj[i].ADFCAEventLocation,
                        ListOfAdfcaActionThinBc: obj[i].ListOfAdfcaActionThinBc,
                        ListOfAdfcaAccountThinBc: obj[i].ListOfAdfcaAccountThinBc,
                        RequestType: obj[i].RequestType,
                    }, true);
                });
                cb();
            }
        }
        catch (e) {
            debugger
            //console.log("Error in realmaddsr: " + (e));
        }
    },

    addAllEstablishments: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {

            // for (let i = 0; i < obj.length; i++) {
            realm.write(() => {
                realm.create(schemaName, {
                    PREMISE_ID: obj.PREMISE_ID,
                    ACCOUNT_NUMBER: obj.ACCOUNT_NUMBER, // primary key
                    TL_NUMBER: obj.TL_NUMBER,
                    PREMISE_NAME: obj.PREMISE_NAME,
                    PREMISE_NAME_AR: obj.PREMISE_NAME_AR,
                    STATUS: obj.STATUS,
                    PREMISE_CATEGORY: obj.PREMISE_CATEGORY,
                    ADDRESS: obj.PREMISE_CATEGORY,
                    CITY: obj.CITY,
                    AREA: obj.AREA,
                    PREMISE_TYPE: obj.PREMISE_TYPE,
                    MOBILE_NUMBER: obj.MOBILE_NUMBER,
                    INSPECTOR: obj.INSPECTOR,
                    SOURCE: obj.SOURCE,
                    ON_HOLD: obj.ON_HOLD,
                    ON_HOLD_REASON: obj.ON_HOLD_REASON,
                    LATITUDE: obj.LATITUDE,
                    LONGITUDE: obj.LONGITUDE,
                    LAND_LINE: obj.LAND_LINE,
                    EMAIL: obj.EMAIL
                }, true);
            });
            cb();
            // }
        }
        catch (e) {
            debugger
            //console.log("Error in realm: " + (e));
        }
    },

    getAllEstablishments: (realm: any, schemaName: string): any => {

        try {
            let estFromDb = getAllEstFromDb(realm);
            if (estFromDb && estFromDb['0']) {
                let temp = Object.values(estFromDb);
                estArrayforAll = [...estArrayforAll, ...temp];
            }
        }
        catch (error) {
            console.log("Error in getAllEstablishments: ", error);
        }

        return estArrayforAll;
    },

    getSrDetails: (realm: any, schemaName: string): any => {

        //  debugger
        let data = realm.objects(schemaName);
        return JSON.parse(JSON.stringify(data));

    },

    addEstablishmentDetails: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
            // debugger
            let updt = realm.objects(schemaName);
            // realm.write(() => {
            //     realm.delete(updt);
            // })
            debugger
            for (let i = 0; i < obj.length; i++) {
                realm.write(() => {
                    realm.create(schemaName, {
                        Id: obj[i].Id,
                        ADCCNumber: obj[i].ADCCNumber,
                        ArabicName: obj[i].ArabicName,
                        ADFCAIntialTradeLicense: obj[i].ADFCAIntialTradeLicense,
                        Mobile: obj[i].Mobile,
                        PreferredLanguage: obj[i].PreferredLanguage,
                        LicenseExpiryDate: obj[i].LicenseExpiryDate,
                        LicenseNumber: obj[i].LicenseNumber,
                        LicenseRegDate: obj[i].LicenseRegDate,
                        AccountNumber: obj[i].AccountNumber,
                        AccountRegion: obj[i].AccountRegion,
                        Status: obj[i].Status,
                        AccountClass: obj[i].AccountClass,
                        Alias: obj[i].Alias,
                        BankCode: obj[i].BankCode,
                        EHSRiskClassification: obj[i].EHSRiskClassification,
                        LicenseCode: obj[i].LicenseCode,
                        Sent: obj[i].Sent,
                        URL: obj[i].URL,
                        OnHold: obj[i].OnHold,
                        Reference: obj[i].Reference,
                        LegalStatus: obj[i].LegalStatus,
                        Site: obj[i].Site,
                        Email: obj[i].Email,
                        MainFaxNumber: obj[i].MainFaxNumber,
                        LandlineNumber: obj[i].LandlineNumber,
                        Area: obj[i].Area,
                        Sector: obj[i].Sector,
                        City: obj[i].City,
                        EnglishName: obj[i].EnglishName,
                        AccountCategory: obj[i].AccountCategory,
                        Parent: obj[i].Parent,
                        LicenseSource: obj[i].LicenseSource,
                        AccountType: obj[i].AccountType,
                        PrimaryAddressId: obj[i].PrimaryAddressId,
                        NumofWH: obj[i].NumofWH,
                        NumofSheds: obj[i].NumofSheds,
                        NumofFishPonds: obj[i].NumofFishPonds,
                        CapofWH: obj[i].CapofWH,
                        CapofSheds: obj[i].CapofSheds,
                        CapofFishPonds: obj[i].CapofFishPonds,
                        ADFCAAgrEstGrade: obj[i].ADFCAAgrEstGrade,
                        LATITUDE: obj[i].LATITUDE,
                        LONGITUDE: obj[i].LONGITUDE,
                        isUploaded: obj[i].isUploaded,
                        addressObj: obj[i].addressObj,
                        taskId: obj[i].taskId
                    }, true);
                });
            }
            cb(false);
        }
        catch (e) {
            cb(true);
            debugger
            console.log("Error in realmAdd Estdate: ", e);
        }
    },

    getSingleXlsxEstablishmentById: (realm: any, schemaName: string, Id: any) => {
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`PREMISE_ID = "${Id}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    getEstablishmentById: (realm: any, schemaName: string, Id: any) => {
        // debugger;
        if (isDev) {
            let estData = estArrayforAll.filter((item: any) => item.Id == Id);
            if (estData.length) {
                return estData;
            }
            else {
                let data = realm.objects(schemaName);
                let filterData = data.filtered(`Id = "${Id}"`);
                return JSON.parse(JSON.stringify(filterData));
            }
        } else {
            let establishmentData = getEstDetails(realm, Id)
            // console.log("establishmentDataFromDb>>" + JSON.stringify(establishmentData))
            if (establishmentData && establishmentData['0']) {
                return establishmentData['0']
            }
            else {
                let estData = estArrayforAll.filter((item: any) => item.Id == Id);
                if (estData.length) {
                    return estData;
                }
                else {
                    let data = realm.objects(schemaName);
                    let filterData = data.filtered(`Id = "${Id}"`);
                    return JSON.parse(JSON.stringify(filterData));
                }
            }
        }
    },

    getLovData: (realm: any, schemaName: string) => {
        let data = realm.objects(schemaName);
        return JSON.parse(JSON.stringify(data));
    },

    getLovDataByKey: (realm: any, schemaName: string, key: any) => {
        try {
            let data = realm.objects(schemaName);
            let filterData = data.filtered(`key = "${key}"`);
            if (filterData && filterData[0] && filterData[0].value) {
                return (JSON.parse(filterData[0].value));
            }
            else {
                if (Object.keys(filterData).length === 0) {
                    return ([])
                }
            }
        }
        catch (e) {
            // //console.log("Error in realm: ", e);
        }
    },

    deleteLovData: (realm: any, schemaName: string, cb: any) => {
        let updt = realm.objects(schemaName);
        realm.write(() => {
            realm.delete(updt);
        })
        cb();
    },
    deleteEStblishmentsData: (realm: any, cb: any) => {
        try {
            let updt = realm.objects(EstablishmentSchema.name);
            realm.write(() => {
                realm.delete(updt);
            })
            cb()
        }
        catch (e) {
            // //console.log("Error in realm: ", e);
        }
    },
    updateTaskDetails: (realm: any, TaskId: any, schemaName: string, cb: any) => {
        debugger;
        try {
            let impala = realm.objects(schemaName).filtered(`TaskId = "${TaskId}"`);

            realm.write(() => {
                impala.isAcknowledge = true;
            });

            cb();
        }
        catch (e) {
            //console.log("Error in update Task realm: ", e);
        }

    },

    updateTaskMappingData: (realm: any, TaskId: string, obj: string, schemaName: string, cb: any) => {
        debugger;
        try {

            let taskDetails = realm.objects(schemaName).filtered(`TaskId = "${TaskId}"`);
            realm.write(() => {
                taskDetails.MappingData = obj;
            });

            cb();
        }
        catch (e) {
            // //console.log("Error in update Task realm: ", e);
        }

    },

    addTaskDetails: (realm: any, obj: any, schemaName: string, cb: any) => {
        try {
            debugger;
            let updt = realm.objects(schemaName);

            debugger;
            // //console.log('tempObj::'+JSON.stringify(obj))

            realm.write(() => {

                realm.create(schemaName, {
                    TaskId: obj.TaskId,
                    Updated: obj.Updated,
                    InspectortobeEvaluatedId: obj.InspectortobeEvaluatedId,
                    InspLogin: obj.InspLogin,
                    InspJobTitle: obj.InspJobTitle,
                    InspFullName: obj.InspFullName,
                    LicenseCode: obj.LicenseCode,
                    LicenseNumber: obj.LicenseNumber,
                    PlanStatus: obj.PlanStatus,
                    PlanStartDate: obj.PlanStartDate,
                    PlanNumber: obj.PlanNumber,
                    PlanName: obj.PlanName,
                    PlanEndDate: obj.PlanEndDate,
                    PlanAlAin: obj.PlanAlAin,
                    PlanAlGharbia: obj.PlanAlGharbia,
                    PlanAbuDhabi: obj.PlanAbuDhabi,
                    BAId: obj.BAId,
                    EstablishmentId: obj.EstablishmentId,
                    EstablishmentName: obj.EstablishmentName,
                    EstablishmentNameAR: obj.EstablishmentNameAR,
                    ActivitySRId: obj.ActivitySRId,
                    RiskCategory: obj.RiskCategory,
                    InspectorId: obj.InspectorId,
                    Grade: obj.Grade,
                    Comment: obj.Comment,
                    Description: obj.Description,
                    CreatedDate: obj.CreatedDate,
                    Score: obj.Score,
                    Sector: obj.Sector,
                    CompletionDate: obj.CompletionDate,
                    LoginName: obj.LoginName,
                    PrimaryOwnerId: obj.PrimaryOwnerId,
                    TaskPriority: obj.TaskPriority,
                    PlanId: obj.PlanId,
                    CampaignType: obj.CampaignType,
                    BusinessActivity: obj.BusinessActivity,
                    StartDate: obj.StartDate,
                    TaskStatus: obj.TaskStatus,
                    NumOfEST: obj.NumOfEST,
                    TaskType: obj.TaskType,
                    SampleSize: obj.SampleSize,
                    SystemType: obj.SystemType,
                    ListOfAdfcaAccountThinBc: (typeof (obj.ListOfAdfcaAccountThinBc) == 'string') ? obj.ListOfAdfcaAccountThinBc : JSON.stringify(obj.ListOfAdfcaAccountThinBc),
                    FinAcctCurrentBank: obj.FinAcctCurrentBank,
                    Name: obj.Name,
                    isAcknowledge: obj.isAcknowledge,
                    isCompleted: obj.isCompleted,
                    mappingData: (typeof (obj.mappingData) == 'string') ? obj.mappingData : JSON.stringify(obj.mappingData),
                    completionDateWithDayRemaining: obj.completionDateWithDayRemaining,
                    condemnationFlag: obj.condemnationFlag,
                    detentionFlag: obj.detentionFlag,
                    samplingFlag: obj.samplingFlag,
                    comment: obj.comment,
                    nameOfFoodBusinessOperator: obj.nameOfFoodBusinessOperator,
                    attachment: obj.attachment,
                    inspectionApproved: obj.inspectionApproved,
                    address: obj.address,
                    SiebelTaskId: obj.SiebelTaskId,
                    AssessmentScore: obj.AssessmentScore,
                    Description2: obj.Description2,
                    MaxScore: obj.MaxScore,
                    Name2: obj.Name2,
                    Percent: obj.Percent,
                    Template_Name: obj.Template_Name
                }, true);

            });
            // //console.log('dataobj' + JSON.stringify(obj));
            cb();
        }
        catch (e) {
            debugger
            console.log("Error in realmADDTASK: ", e);
            cb()
        }
    },

    getTaskDetails: (realm: any, schemaName: string, TaskId: string) => {
        try {
            debugger;
            let data = realm.objects(schemaName);
            let filterData = data.filtered(`TaskId = "${TaskId}"`);
            return JSON.parse(JSON.stringify(filterData));
        }
        catch (e) {
            debugger;
            // //console.log("Error in realm: ", e);
        }
    },

    deleteTaskById: (realm: any, taskId: string, cb: any) => {
        try {
            realm.write(() => {
                console.log(" realmdeleteTaskBy: " + taskId);
                realm.delete(realm.objectForPrimaryKey(TaskSchema.name, taskId));
            })
            cb()
        }
        catch (e) {
            console.log("Error in realmdeleteTaskBy: ", taskId);
        }
    },

    getTaskIsAck: (realm: any, schemaName: string, TaskId: string) => {
        debugger;
        try {
            let data = realm.objects(schemaName);
            let filterData = data.filtered(`TaskId = "${TaskId}"`);
            return JSON.parse(JSON.stringify(filterData));
        }
        catch (e) {
            debugger;
            // //console.log("Error in realm: ", e);
        }
    },


    getTasks: (realm: any, schemaName: string) => {
        debugger;
        try {
            let data = realm.objects(schemaName);
            // let filterData = data.filtered(`TaskId = "${TaskId}"`);
            return JSON.parse(JSON.stringify(data));
        }
        catch (e) {
            debugger;
            //console.log("Error in getTask realm: ", e);
        }
    },

    addProfileInformationInDB: (realm: any, obj: any, cb: any) => {
        try {
            realm.write(() => {
                realm.create(ProfileDetailsSchema.name, {
                    inspectorName: obj.inspectorName,
                    position: obj.position,
                    inspectionArea: obj.inspectionArea,
                    unit: obj.unit,
                    UserId: obj.UserId,
                }, true);
            });
            cb();
        } catch (e) {
            // //console.log("Error in realm: ", e + obj);
        }
    },

    getProfileData: (realm: any, schemaName: string, UserId: any) => {
        // debugger;
        let data = realm.objects(schemaName);
        let filterData = data.filtered(`UserId= "${UserId}"`);
        return JSON.parse(JSON.stringify(filterData));
    },

    updateEstDetails: (realm: any, Id: any, schemaName: string, cb: any) => {
        debugger;
        try {
            // //console.log("updateEstDetails: ", Id);
            let data = realm.objects(schemaName).filtered(`Id = "${Id}"`);

            realm.write(() => {
                data.isUploaded = "true";
            });


            cb();
        }
        catch (e) {
            // //console.log("Error in updateEstDetails Est realm: ", e);
        }

    },




}