import React, { useContext, useState, useRef, useEffect } from 'react';
import { Image, View, Switch, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import TextComponent from '../components/TextComponent';
import ResetPasswordComponent from './../components/ResetPasswordComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor, isDev } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import Accordion from 'react-native-collapsible/Accordion';
import RegistrationComponent from '../components/RegistrationComponent';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
let realm = RealmController.getRealmInstance();
import XLSX from 'xlsx';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
const input = (res: any) => res;
import Spinner from 'react-native-loading-spinner-overlay';

import EstablishmentSchema from '../database/EstablishmentSchema';
import LoginSchema from '../database/LoginSchema';
import AllEstablishmentSchema from '../database/AllEstablishmentSchema';
import { RealmController } from '../database/RealmController';
import NavigationService from '../services/NavigationService';
var estArrayforAll = Array()

const Settings = (props: any) => {
    const context: any = useContext(Context);
    const [activeSections, setSection] = useState([]);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, loginDraft: rootStore.loginModel })
    const { myTasksDraft, loginDraft, establishmentDraft } = useInject(mapStore)
    const Sections = [
        { title: Strings[context.isArabic ? 'ar' : 'en'].settings.editUserProfile, type: "registration" },
        { title: Strings[context.isArabic ? 'ar' : 'en'].settings.changePassword, type: 'resetPassword' },
        { title: Strings[context.isArabic ? 'ar' : 'en'].settings.notification, type: 'notification' },

    ];

    const renderAccordionHeader = (content: any, index: any, isActive: any) => {

        return (
            <View style={{ minHeight: HEIGHT * 0.01, height: 'auto', backgroundColor: '#abcfbf', flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 22 }}>
                <View style={{ flex: 8.4, justifyContent: 'center', alignItems: context.isArabic ? 'flex-end' : 'flex-start', paddingHorizontal: 10 }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: context.isArabic ? 'right' : 'left', fontSize: 12, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                        label={content.title}
                    />

                </View>
                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', height: 25, }}>

                    {content.type == 'notification' ?
                        <Switch
                            thumbColor={fontColor.TitleColor}
                            trackColor={{ true: 'white', false: 'white' }}
                            onValueChange={(val) => {

                            }}
                            value={context.isArabic} /> :
                        isActive ? <Image
                            source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                            style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '90deg' }] : [{ rotate: '90deg' }] }}
                            resizeMode={'contain'}
                        />
                            :
                            <Image
                                source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '-180deg' }] : [{ rotate: '0deg' }] }}
                                resizeMode={'contain'}
                            />
                    }
                </View>
            </View>
        );
    };

    const renderContent = (item: any) => {
        return (
            item.type == 'registration' ? <RegistrationComponent isArabic={context.isArabic} /> :
                item.type == 'resetPassword' ? <ResetPasswordComponent isArabic={context.isArabic} /> : null

        );
    };

    const updateSections = (activeSections: any) => {
        setSection(activeSections.includes(undefined) ? [] : activeSections);
    };

    async function AddEst() {
        try {


            // loginDraft.setState('pending');
            // loginDraft.setLoadingState('Inserting Establishment Data');
            let est = RealmController.getAllEstablishments(realm, EstablishmentSchema.name);
            let estCount = RealmController.getSingleXlsxEstablishmentById(realm, AllEstablishmentSchema.name, 'estcount');
            let EstDataAA: any = []

            // console.log("est.length:::" + Object.values(est).length + "," + (estCount['0'] && estCount['0'].ACCOUNT_NUMBER))
            estCount = (estCount['0'] && estCount['0'].ACCOUNT_NUMBER) ? parseInt(estCount['0'].ACCOUNT_NUMBER) : -1
            // if ((Object.values(est).length < (estCount - 350)) || (!est['0'])) {
            //     loginDraft.setState('pending');
            //     // if (!est['0']) {
            //     loginDraft.setLoadingState('Inserting establishment data.It may take upto 15 minutes.');
            //     // }
            //     // else{
            //     //     loginDraft.setLoadingState('Inserting establishment data it may take upto 15 minutes');
            //     // }

            //     if (isDev) {
            //         readFileAssets('AccountsData.xlsx', 'ascii').then((res) => {
            //             /* parse file */
            //             const wb = XLSX.read(input(res), { type: 'binary' });
            //             debugger
            //             /* convert first worksheet to AOA */
            //             const wsname = wb.SheetNames[0];
            //             const ws = wb.Sheets[wsname];
            //             const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            //             debugger
            //             let tempCustumArray = [];
            //             // setEstablishmentLength(data.length)
            //             for (let index = 0; index < data.length; index++) {
            //                 const element: any = data[index];
            //                 if (element.length) {
            //                     let obj = {
            //                         Id: element[1] ? element[1].toString() : "",
            //                         ADCCNumber: "",
            //                         ArabicName: element[29] ? element[29].toString() : "",
            //                         ADFCAIntialTradeLicense: element[30] ? element[30].toString() : "",
            //                         Mobile: element[31] ? element[31].toString() : "",
            //                         PreferredLanguage: element[32] ? element[32].toString() : "",
            //                         LicenseExpiryDate: element[33] ? element[33].toString() : "",
            //                         LicenseNumber: element[28] ? element[28].toString() : "",
            //                         LicenseRegDate: element[35] ? element[35].toString() : "",
            //                         AccountNumber: element[1] ? element[1].toString() : "",
            //                         AccountRegion: element[38] ? element[38].toString() : "",
            //                         Status: element[2] ? element[2].toString() : "",
            //                         AccountClass: element[3] ? element[3].toString() : "",
            //                         Alias: element[4] ? element[4].toString() : "",
            //                         BankCode: element[5] ? element[5].toString() : "",
            //                         EHSRiskClassification: element[39] ? element[39].toString() : "",
            //                         LicenseCode: element[34] ? element[34].toString() : "",
            //                         Sent: "",
            //                         URL: element[6] ? element[6].toString() : "",
            //                         OnHold: element[7] ? element[7].toString() : "",
            //                         Reference: element[8] ? element[8].toString() : "",
            //                         LegalStatus: element[9] ? element[9].toString() : "",
            //                         Site: element[10] ? element[10].toString() : "",
            //                         Email: element[11] ? element[11].toString() : "",
            //                         MainFaxNumber: element[12] ? element[12].toString() : "",
            //                         LandlineNumber: element[13] ? element[13].toString() : "",
            //                         Area: element[16] ? element[16].toString() : "",
            //                         Sector: element[15] ? element[15].toString() : "",
            //                         City: element[14] ? element[14].toString() : "",
            //                         EnglishName: element[17] ? element[17].toString() : "",
            //                         AccountCategory: element[0] ? element[0].toString() : "",
            //                         Parent: element[18] ? element[18].toString() : "",
            //                         LicenseSource: element[40] ? element[40].toString() : "",
            //                         AccountType: element[19] ? element[19].toString() : "",
            //                         PrimaryAddressId: element[20] ? element[20].toString() : "",
            //                         NumofWH: element[21] ? element[21].toString() : "",
            //                         NumofSheds: element[22] ? element[22].toString() : "",
            //                         NumofFishPonds: element[23] ? element[23].toString() : "",
            //                         CapofWH: element[24] ? element[24].toString() : "",
            //                         CapofSheds: element[25] ? element[25].toString() : "",
            //                         CapofFishPonds: element[26] ? element[26].toString() : "",
            //                         ADFCAAgrEstGrade: element[27] ? element[27].toString() : "",
            //                         LATITUDE: element[36] ? element[36].toString() : "",
            //                         LONGITUDE: element[37] ? element[37].toString() : "",
            //                         isUploaded: "",
            //                         addressObj: "",
            //                         taskId: "",
            //                     };
            //                     tempCustumArray.push(obj);
            //                     RealmController.addEstablishmentDetails(realm, [obj], EstablishmentSchema.name, () => {

            //                     });
            //                     //console.log(index)
            //                     // increment(index)
            //                     if (index == (data.length - 1)) {
            //                         // clearInterval(interval);
            //                         loginDraft.setState('done')
            //                         loginDraft.setLoadingState('')
            //                         // setIsVisible(false)
            //                     }
            //                 }
            //             }
            //             establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            //         }).catch((err) => {
            //             loginDraft.setState('done');
            //             loginDraft.setLoadingState('')
            //             //console.log("importFile Error", "Error " + err.message);
            //         });

            //     }
            //     else {
            //         await readFileAssets('EstDataAA.xlsx', 'ascii').then((res) => {
            //             /* parse file */
            //             const wb = XLSX.read(input(res), { type: 'binary' });
            //             debugger
            //             /* convert first worksheet to AOA */
            //             const wsname = wb.SheetNames[0];
            //             const ws = wb.Sheets[wsname];
            //             const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            //             debugger
            //             let tempCustumArray = [];
            //             // setEstablishmentLength(data.length)
            //             for (let index = 0; index < data.length; index++) {
            //                 const element: any = data[index];
            //                 if (element.length) {
            //                     let addressObj: any = {};
            //                     addressObj.Id = element[21] ? element[21].toString() : "";
            //                     addressObj.ADFCAId = "";
            //                     addressObj.IsPrimary = "Y";
            //                     addressObj.Updated = "";
            //                     addressObj.City = element[44] ? element[44].toString() : "";
            //                     addressObj.Country = element[42] ? element[42].toString() : "";
            //                     addressObj.POBox = '';
            //                     addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
            //                     addressObj.AddressLine2 = '';
            //                     addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

            //                     let obj = {
            //                         Id: element[0] ? element[0].toString() : "",
            //                         ADCCNumber: "",
            //                         ArabicName: element[30] ? element[30].toString() : "",
            //                         ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
            //                         Mobile: element[32] ? element[32].toString() : "",
            //                         PreferredLanguage: element[33] ? element[33].toString() : "",
            //                         LicenseExpiryDate: element[34] ? element[34].toString() : "",
            //                         LicenseNumber: element[29] ? element[29].toString() : "",
            //                         LicenseRegDate: element[36] ? element[36].toString() : "",
            //                         AccountNumber: element[1] ? element[1].toString() : "",
            //                         AccountRegion: element[39] ? element[39].toString() : "",
            //                         Status: element[3] ? element[3].toString() : "",
            //                         AccountClass: element[4] ? element[4].toString() : "",
            //                         Alias: element[5] ? element[5].toString() : "",
            //                         BankCode: element[6] ? element[6].toString() : "",
            //                         EHSRiskClassification: element[40] ? element[40].toString() : "",
            //                         LicenseCode: element[35] ? element[35].toString() : "",
            //                         Sent: "",
            //                         URL: element[7] ? element[7].toString() : "",
            //                         OnHold: element[8] ? element[8].toString() : "",
            //                         Reference: element[9] ? element[9].toString() : "",
            //                         LegalStatus: element[10] ? element[10].toString() : "",
            //                         Site: element[11] ? element[11].toString() : "",
            //                         Email: element[12] ? element[12].toString() : "",
            //                         MainFaxNumber: element[13] ? element[13].toString() : "",
            //                         LandlineNumber: element[14] ? element[14].toString() : "",
            //                         Area: element[17] ? element[17].toString() : "",
            //                         Sector: element[16] ? element[16].toString() : "",
            //                         City: element[15] ? element[15].toString() : "",
            //                         EnglishName: element[18] ? element[18].toString() : "",
            //                         AccountCategory: element[0] ? element[0].toString() : "",
            //                         Parent: element[19] ? element[19].toString() : "",
            //                         LicenseSource: element[41] ? element[41].toString() : "",
            //                         AccountType: element[20] ? element[20].toString() : "",
            //                         PrimaryAddressId: element[21] ? element[21].toString() : "",
            //                         NumofWH: element[22] ? element[22].toString() : "",
            //                         NumofSheds: element[23] ? element[23].toString() : "",
            //                         NumofFishPonds: element[24] ? element[24].toString() : "",
            //                         CapofWH: element[25] ? element[25].toString() : "",
            //                         CapofSheds: element[26] ? element[26].toString() : "",
            //                         CapofFishPonds: element[27] ? element[27].toString() : "",
            //                         ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
            //                         LATITUDE: element[37] ? element[37].toString() : "",
            //                         LONGITUDE: element[38] ? element[38].toString() : "",
            //                         isUploaded: "",
            //                         addressObj: JSON.stringify(addressObj),
            //                         taskId: "",
            //                     };
            //                     // tempCustumArray.push([obj]);
            //                     estArrayforAll.push([obj]);
            //                     // RealmController.addEstablishmentDetails(realm, [obj], EstablishmentSchema.name, () => {

            //                     // });
            //                     //console.log(index)
            //                     // increment(index)
            //                     // if (index == (data.length - 1)) {
            //                     //     // clearInterval(interval);
            //                     //     loginDraft.setState('done')
            //                     //     loginDraft.setLoadingState('')
            //                     //     // setIsVisible(false)
            //                     // }
            //                 }
            //             }
            //             // EstDataAA = [...EstDataAA,...tempCustumArray]

            //             console.log("estArrayforAll.length", estArrayforAll.length);
            //             // setAllEst(EstDataAA);
            //             // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            //         }).catch((err) => {
            //             loginDraft.setState('done');
            //             loginDraft.setLoadingState('')
            //             console.log("importFile Error", "Error " + err.message);
            //         });
            //         let EstDataAD = Array()

            //         await readFileAssets('EstDataAD.xlsx', 'ascii').then((res) => {
            //             /* parse file */
            //             const wb = XLSX.read(input(res), { type: 'binary' });
            //             debugger
            //             /* convert first worksheet to AOA */
            //             const wsname = wb.SheetNames[0];
            //             const ws = wb.Sheets[wsname];
            //             const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            //             debugger
            //             let tempCustumArray = [];
            //             // setEstablishmentLength(data.length)
            //             for (let index = 0; index < data.length; index++) {
            //                 const element: any = data[index];
            //                 if (element.length) {
            //                     let addressObj: any = {};
            //                     addressObj.Id = element[21] ? element[21].toString() : "";
            //                     addressObj.ADFCAId = "";
            //                     addressObj.IsPrimary = "Y";
            //                     addressObj.Updated = "";
            //                     addressObj.City = element[44] ? element[44].toString() : "";
            //                     addressObj.Country = element[42] ? element[42].toString() : "";
            //                     addressObj.POBox = '';
            //                     addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
            //                     addressObj.AddressLine2 = '';
            //                     addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

            //                     let obj = {
            //                         Id: element[0] ? element[0].toString() : "",
            //                         ADCCNumber: "",
            //                         ArabicName: element[30] ? element[30].toString() : "",
            //                         ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
            //                         Mobile: element[32] ? element[32].toString() : "",
            //                         PreferredLanguage: element[33] ? element[33].toString() : "",
            //                         LicenseExpiryDate: element[34] ? element[34].toString() : "",
            //                         LicenseNumber: element[29] ? element[29].toString() : "",
            //                         LicenseRegDate: element[36] ? element[36].toString() : "",
            //                         AccountNumber: element[1] ? element[1].toString() : "",
            //                         AccountRegion: element[39] ? element[39].toString() : "",
            //                         Status: element[3] ? element[3].toString() : "",
            //                         AccountClass: element[4] ? element[4].toString() : "",
            //                         Alias: element[5] ? element[5].toString() : "",
            //                         BankCode: element[6] ? element[6].toString() : "",
            //                         EHSRiskClassification: element[40] ? element[40].toString() : "",
            //                         LicenseCode: element[35] ? element[35].toString() : "",
            //                         Sent: "",
            //                         URL: element[7] ? element[7].toString() : "",
            //                         OnHold: element[8] ? element[8].toString() : "",
            //                         Reference: element[9] ? element[9].toString() : "",
            //                         LegalStatus: element[10] ? element[10].toString() : "",
            //                         Site: element[11] ? element[11].toString() : "",
            //                         Email: element[12] ? element[12].toString() : "",
            //                         MainFaxNumber: element[13] ? element[13].toString() : "",
            //                         LandlineNumber: element[14] ? element[14].toString() : "",
            //                         Area: element[17] ? element[17].toString() : "",
            //                         Sector: element[16] ? element[16].toString() : "",
            //                         City: element[15] ? element[15].toString() : "",
            //                         EnglishName: element[18] ? element[18].toString() : "",
            //                         AccountCategory: element[0] ? element[0].toString() : "",
            //                         Parent: element[19] ? element[19].toString() : "",
            //                         LicenseSource: element[41] ? element[41].toString() : "",
            //                         AccountType: element[20] ? element[20].toString() : "",
            //                         PrimaryAddressId: element[21] ? element[21].toString() : "",
            //                         NumofWH: element[22] ? element[22].toString() : "",
            //                         NumofSheds: element[23] ? element[23].toString() : "",
            //                         NumofFishPonds: element[24] ? element[24].toString() : "",
            //                         CapofWH: element[25] ? element[25].toString() : "",
            //                         CapofSheds: element[26] ? element[26].toString() : "",
            //                         CapofFishPonds: element[27] ? element[27].toString() : "",
            //                         ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
            //                         LATITUDE: element[37] ? element[37].toString() : "",
            //                         LONGITUDE: element[38] ? element[38].toString() : "",
            //                         isUploaded: "",
            //                         addressObj: JSON.stringify(addressObj),
            //                         taskId: "",
            //                     };
            //                     // EstDataAA.push([obj])
            //                     estArrayforAll.push([obj])
            //                     // tempCustumArray.push(obj);
            //                     // RealmController.addEstablishmentDetails(realm, [obj], EstablishmentSchema.name, () => {

            //                     // });
            //                     //console.log(index)
            //                     // increment(index)
            //                     // if (index == (data.length - 1)) {
            //                     //     // clearInterval(interval);
            //                     //     loginDraft.setState('done')
            //                     //     loginDraft.setLoadingState('')
            //                     //     // setIsVisible(false)
            //                     // }
            //                 }
            //             }
            //             console.log("estArrayforAll.length", estArrayforAll.length);
            //             // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            //         }).catch((err) => {
            //             loginDraft.setState('done');
            //             loginDraft.setLoadingState('')
            //             console.log("importFile Error1", "Error " + err.message);
            //         });

            //         await readFileAssets('EstDataOther.xlsx', 'ascii').then((res) => {
            //             /* parse file */
            //             const wb = XLSX.read(input(res), { type: 'binary' });
            //             debugger
            //             /* convert first worksheet to AOA */
            //             const wsname = wb.SheetNames[0];
            //             const ws = wb.Sheets[wsname];
            //             const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            //             debugger
            //             let tempCustumArray = [];
            //             // setEstablishmentLength(data.length)
            //             for (let index = 0; index < data.length; index++) {
            //                 const element: any = data[index];
            //                 if (element.length) {
            //                     let addressObj: any = {};
            //                     addressObj.Id = element[21] ? element[21].toString() : "";
            //                     addressObj.ADFCAId = "";
            //                     addressObj.IsPrimary = "Y";
            //                     addressObj.Updated = "";
            //                     addressObj.City = element[44] ? element[44].toString() : "";
            //                     addressObj.Country = element[42] ? element[42].toString() : "";
            //                     addressObj.POBox = '';
            //                     addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
            //                     addressObj.AddressLine2 = '';
            //                     addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

            //                     let obj = {
            //                         Id: element[0] ? element[0].toString() : "",
            //                         ADCCNumber: "",
            //                         ArabicName: element[30] ? element[30].toString() : "",
            //                         ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
            //                         Mobile: element[32] ? element[32].toString() : "",
            //                         PreferredLanguage: element[33] ? element[33].toString() : "",
            //                         LicenseExpiryDate: element[34] ? element[34].toString() : "",
            //                         LicenseNumber: element[29] ? element[29].toString() : "",
            //                         LicenseRegDate: element[36] ? element[36].toString() : "",
            //                         AccountNumber: element[1] ? element[1].toString() : "",
            //                         AccountRegion: element[39] ? element[39].toString() : "",
            //                         Status: element[3] ? element[3].toString() : "",
            //                         AccountClass: element[4] ? element[4].toString() : "",
            //                         Alias: element[5] ? element[5].toString() : "",
            //                         BankCode: element[6] ? element[6].toString() : "",
            //                         EHSRiskClassification: element[40] ? element[40].toString() : "",
            //                         LicenseCode: element[35] ? element[35].toString() : "",
            //                         Sent: "",
            //                         URL: element[7] ? element[7].toString() : "",
            //                         OnHold: element[8] ? element[8].toString() : "",
            //                         Reference: element[9] ? element[9].toString() : "",
            //                         LegalStatus: element[10] ? element[10].toString() : "",
            //                         Site: element[11] ? element[11].toString() : "",
            //                         Email: element[12] ? element[12].toString() : "",
            //                         MainFaxNumber: element[13] ? element[13].toString() : "",
            //                         LandlineNumber: element[14] ? element[14].toString() : "",
            //                         Area: element[17] ? element[17].toString() : "",
            //                         Sector: element[16] ? element[16].toString() : "",
            //                         City: element[15] ? element[15].toString() : "",
            //                         EnglishName: element[18] ? element[18].toString() : "",
            //                         AccountCategory: element[0] ? element[0].toString() : "",
            //                         Parent: element[19] ? element[19].toString() : "",
            //                         LicenseSource: element[41] ? element[41].toString() : "",
            //                         AccountType: element[20] ? element[20].toString() : "",
            //                         PrimaryAddressId: element[21] ? element[21].toString() : "",
            //                         NumofWH: element[22] ? element[22].toString() : "",
            //                         NumofSheds: element[23] ? element[23].toString() : "",
            //                         NumofFishPonds: element[24] ? element[24].toString() : "",
            //                         CapofWH: element[25] ? element[25].toString() : "",
            //                         CapofSheds: element[26] ? element[26].toString() : "",
            //                         CapofFishPonds: element[27] ? element[27].toString() : "",
            //                         ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
            //                         LATITUDE: element[37] ? element[37].toString() : "",
            //                         LONGITUDE: element[38] ? element[38].toString() : "",
            //                         isUploaded: "",
            //                         addressObj: JSON.stringify(addressObj),
            //                         taskId: "",
            //                     };
            //                     // EstDataAA.push([obj])
            //                     estArrayforAll.push([obj])

            //                     // tempCustumArray.push(obj);
            //                     // RealmController.addEstablishmentDetails(realm, [obj], EstablishmentSchema.name, () => {

            //                     // });
            //                     //console.log(index)
            //                     // increment(index)
            //                     // if (index == (data.length - 1)) {
            //                     //     // clearInterval(interval);
            //                     //     loginDraft.setState('done')
            //                     //     loginDraft.setLoadingState('')
            //                     //     // setIsVisible(false)
            //                     // }
            //                 }
            //             }
            //             console.log("estArrayforAll.length", estArrayforAll.length);
            //             // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            //         }).catch((err) => {
            //             loginDraft.setState('done');
            //             loginDraft.setLoadingState('')
            //             console.log("importFile Erro3r", "Error " + err.message);
            //         });
            //         let EstDateWR = Array()
            //         await readFileAssets('EstDateWR.xlsx', 'ascii').then((res) => {
            //             /* parse file */
            //             const wb = XLSX.read(input(res), { type: 'binary' });
            //             debugger
            //             /* convert first worksheet to AOA */
            //             const wsname = wb.SheetNames[0];
            //             const ws = wb.Sheets[wsname];
            //             const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
            //             debugger
            //             let tempCustumArray = [];
            //             // setEstablishmentLength(data.length)
            //             for (let index = 0; index < data.length; index++) {
            //                 const element: any = data[index];
            //                 if (element.length) {
            //                     let addressObj: any = {};
            //                     addressObj.Id = element[21] ? element[21].toString() : "";
            //                     addressObj.ADFCAId = "";
            //                     addressObj.IsPrimary = "Y";
            //                     addressObj.Updated = "";
            //                     addressObj.City = element[44] ? element[44].toString() : "";
            //                     addressObj.Country = element[42] ? element[42].toString() : "";
            //                     addressObj.POBox = '';
            //                     addressObj.AddressLine1 = element[45] ? element[45].toString() : "";
            //                     addressObj.AddressLine2 = '';
            //                     addressObj.EstabilishmentID = element[1] ? element[1].toString() : "";

            //                     let obj = {
            //                         Id: element[0] ? element[0].toString() : "",
            //                         ADCCNumber: "",
            //                         ArabicName: element[30] ? element[30].toString() : "",
            //                         ADFCAIntialTradeLicense: element[31] ? element[31].toString() : "",
            //                         Mobile: element[32] ? element[32].toString() : "",
            //                         PreferredLanguage: element[33] ? element[33].toString() : "",
            //                         LicenseExpiryDate: element[34] ? element[34].toString() : "",
            //                         LicenseNumber: element[29] ? element[29].toString() : "",
            //                         LicenseRegDate: element[36] ? element[36].toString() : "",
            //                         AccountNumber: element[1] ? element[1].toString() : "",
            //                         AccountRegion: element[39] ? element[39].toString() : "",
            //                         Status: element[3] ? element[3].toString() : "",
            //                         AccountClass: element[4] ? element[4].toString() : "",
            //                         Alias: element[5] ? element[5].toString() : "",
            //                         BankCode: element[6] ? element[6].toString() : "",
            //                         EHSRiskClassification: element[40] ? element[40].toString() : "",
            //                         LicenseCode: element[35] ? element[35].toString() : "",
            //                         Sent: "",
            //                         URL: element[7] ? element[7].toString() : "",
            //                         OnHold: element[8] ? element[8].toString() : "",
            //                         Reference: element[9] ? element[9].toString() : "",
            //                         LegalStatus: element[10] ? element[10].toString() : "",
            //                         Site: element[11] ? element[11].toString() : "",
            //                         Email: element[12] ? element[12].toString() : "",
            //                         MainFaxNumber: element[13] ? element[13].toString() : "",
            //                         LandlineNumber: element[14] ? element[14].toString() : "",
            //                         Area: element[17] ? element[17].toString() : "",
            //                         Sector: element[16] ? element[16].toString() : "",
            //                         City: element[15] ? element[15].toString() : "",
            //                         EnglishName: element[18] ? element[18].toString() : "",
            //                         AccountCategory: element[0] ? element[0].toString() : "",
            //                         Parent: element[19] ? element[19].toString() : "",
            //                         LicenseSource: element[41] ? element[41].toString() : "",
            //                         AccountType: element[20] ? element[20].toString() : "",
            //                         PrimaryAddressId: element[21] ? element[21].toString() : "",
            //                         NumofWH: element[22] ? element[22].toString() : "",
            //                         NumofSheds: element[23] ? element[23].toString() : "",
            //                         NumofFishPonds: element[24] ? element[24].toString() : "",
            //                         CapofWH: element[25] ? element[25].toString() : "",
            //                         CapofSheds: element[26] ? element[26].toString() : "",
            //                         CapofFishPonds: element[27] ? element[27].toString() : "",
            //                         ADFCAAgrEstGrade: element[28] ? element[28].toString() : "",
            //                         LATITUDE: element[37] ? element[37].toString() : "",
            //                         LONGITUDE: element[38] ? element[38].toString() : "",
            //                         isUploaded: "",
            //                         addressObj: JSON.stringify(addressObj),
            //                         taskId: "",
            //                     };
            //                     // EstDataAA.push([obj])
            //                     estArrayforAll.push([obj])

            //                     // tempCustumArray.push(obj);
            //                     // RealmController.addEstablishmentDetails(realm, [obj], EstablishmentSchema.name, () => {

            //                     // });
            //                     //console.log(index)
            //                     // increment(index)
            //                     if (index == (data.length - 1)) {
            //                         // clearInterval(interval);
            //                         loginDraft.setState('done')
            //                         loginDraft.setLoadingState('')
            //                         // setIsVisible(false)
            //                     }
            //                 }
            //             }
            //             console.log("estArrayforAll.length", estArrayforAll.length);
            //             // establishmentDraft.setAllEstablishmentData(JSON.stringify(tempCustumArray));
            //         }).catch((err) => {
            //             loginDraft.setState('done');
            //             loginDraft.setLoadingState('')
            //             console.log("importFile Err4or", "Error " + err.message);
            //         });
            //         console.log("EstDataAA.length", estArrayforAll.length);

            //         if (estArrayforAll.length) {
            //             if (!est['0']) {
            //                 let obj = {
            //                     PREMISE_ID: 'estcount',
            //                     ACCOUNT_NUMBER: estArrayforAll.length.toString(), // primary key
            //                     TL_NUMBER: '',
            //                     PREMISE_NAME: '',
            //                     PREMISE_NAME_AR: '',
            //                     STATUS: '',
            //                     PREMISE_CATEGORY: '',
            //                     ADDRESS: '',
            //                     CITY: '',
            //                     AREA: '',
            //                     PREMISE_TYPE: '',
            //                     MOBILE_NUMBER: '',
            //                     INSPECTOR: '',
            //                     SOURCE: '',
            //                     ON_HOLD: '',
            //                     ON_HOLD_REASON: '',
            //                     LATITUDE: '',
            //                     LONGITUDE: '',
            //                     LAND_LINE: '',
            //                     EMAIL: ''
            //                 }
            //                 RealmController.addAllEstablishments(realm, obj, AllEstablishmentSchema.name, () => {

            //                 });

            //                 for (let index = 0; index < estArrayforAll.length; index++) {
            //                     const element = estArrayforAll[index];

            //                     await RealmController.addEstablishmentDetails(realm, element, EstablishmentSchema.name, () => {

            //                     });
            //                 }
            //             }
            //             else {
            //                 estArrayforAll = estArrayforAll.splice(Object.values(est).length)
            //                 for (let index = 0; index < estArrayforAll.length; index++) {
            //                     const element = estArrayforAll[index];

            //                     await RealmController.addEstablishmentDetails(realm, element, EstablishmentSchema.name, () => {
            //                         // console.log("index:", index);

            //                     });
            //                 }

            //             }

            //         }
            //     }
            // }

        } catch (error) {
            console.log("errorgetTask" + error)
            loginDraft.setState('done');
            loginDraft.setLoadingState('')
        }
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={loginDraft.state == 'pending' ? true : false}
                textContent={loginDraft.loadingState != '' ? loginDraft.loadingState : 'Loading ...'}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                // customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 5, fontWeight: '400' }}
            />

            <Spinner
                visible={myTasksDraft.state == 'pending' ? true : false}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <Spinner
                visible={myTasksDraft.mergeState == 'pending' ? true : false}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5, }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].settings.settings)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 1.5, alignItems: 'center', alignSelf: 'center', justifyContent: 'center', width: '90%' }}>
                    <Image resizeMode={'stretch'} style={{ width: 100, height: 100 }} source={require('./../assets/images/profile/Profile64x64.png')} />
                </View>

                {/* <ScrollView> */}

                {/* <Accordion
                            sections={Sections}
                            activeSections={activeSections}
                            renderHeader={renderAccordionHeader}
                            renderContent={renderContent}
                            touchableComponent={TouchableOpacity}
                            onChange={updateSections}
                        /> */}


                <View style={{ flex: 1, width: '80%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => {
                            // RealmController.deleteLoginData(realm, () => {
                            // loginDraft.setUsername('')
                            // loginDraft.setPassword('')
                            NavigationService.navigate("Login");
                            // })
                        }}
                        style={{ backgroundColor: "#5c666f", height: '50%', justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: 'white' }}>{Strings[context.isArabic ? 'ar' : 'en'].settings.logOut}</Text>
                    </TouchableOpacity>
                </View>

                {/* </ScrollView> */}
                <View style={{ flex: 2, width: '80%', alignSelf: 'center' }} >
                    <View style={{ flex: 1, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                loginDraft.setState('pending');
                                loginDraft.setLoadingState('Fetching LOV Data');
                                loginDraft.callToLovDataByKeyService(true)
                            }}
                            style={{ backgroundColor: "#5c666f", padding: 10, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: 'white' }}>
                                {Strings[context.isArabic ? 'ar' : 'en'].settings.reloadlov}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.3, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} />
                    <View style={{ flex: 1, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => AddEst()}
                            style={{ backgroundColor: "#5c666f", padding: 10, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: 'white' }}>
                                {Strings[context.isArabic ? 'ar' : 'en'].settings.reloadEst}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.3, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }} />
                    <View style={{ flex: 1, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                RealmController.deleteAllMergeTask(realm, () => {
                                });
                                myTasksDraft.setMergestate('pending')
                                myTasksDraft.setLoadingState('Merging Tasks')
                                myTasksDraft.callToMergeTask(context.isArabic, false);
                            }}
                            style={{ backgroundColor: "#5c666f", padding: 10, justifyContent: 'center', alignItems: 'center', width: '60%', borderRadius: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: 'white' }}>
                                {Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.mergeTask}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 0.5, width: '80%', alignSelf: 'center' }} />

                <View style={{ flex: 0.5, width: '80%', alignSelf: 'center' }} >
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: fontColor.TitleColor }}>{`Version ${loginDraft.verionNumber}`}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
    space: {
        flex: 0.0
    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(Settings);
