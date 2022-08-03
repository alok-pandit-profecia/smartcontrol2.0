import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, TouchableOpacity, Dimensions, FlatList } from "react-native";
import NavigationService from '../../services/NavigationService';
import Header from './../../components/Header';
import ButtonComponent from './../../components/ButtonComponent';
import TableComponent from './../../components/TableComponent';
import BottomComponent from './../../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import { fontFamily, fontColor } from '../../config/config';
import Strings from '../../config/strings';
import { RealmController } from '../../database/RealmController';
import EstablishmentSchema from '../../database/EstablishmentSchema';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
import SrDetailsSchema from '../../database/SrDetailsSchema';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const EstablishmentDetailsTempPermit = (props: any) => {

    const context = useContext(Context);

    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [SRList, setSRList] = useState(Array());

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, TemporaryPermitsServiceRequestDraft: rootStore.temporaryPermitsServiceRequestModel })
    const { myTasksDraft, TemporaryPermitsServiceRequestDraft, establishmentDraft } = useInject(mapStore)

    const [isClick, setIsClick] = useState({
        estClick: true,
        inspClick: false
    });
    let allEstablishment = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : []


    useEffect(() => {
        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setInspectionDetails(inspectionDetails);
        let srFromDB = RealmController.getSrDetails(realm, SrDetailsSchema.name);
        if (srFromDB && srFromDB['0']) {
            let temp = Object.values(srFromDB);
            console.log(temp.length)
            parseSRDetails(temp);
        }

    }, []);

    function parseSRDetails(row: any) {

        if (!row.length) {

            return [];

        }

        let SRArray = [];

        for (let i = 0; i < row.length; i++) {

            let obj = Object();

            let item = row[i];

            if (item.ListOfAdfcaActionThinBc != '' && item.ListOfAdfcaActionThinBc != null && item.ListOfAdfcaActionThinBc != 'null') {

                obj.ListOfAdfcaActionThinBc = JSON.parse(unescape(item.ListOfAdfcaActionThinBc));
            }
            if (item.ListOfAdfcaAccountThinBc != '' && item.ListOfAdfcaAccountThinBc != null && item.ListOfAdfcaAccountThinBc != 'null') {
                obj.ListOfAdfcaAccountThinBc = JSON.parse(unescape(item.ListOfAdfcaAccountThinBc));

                obj.EstId = obj.ListOfAdfcaAccountThinBc.Establishment[0].Id;
            }
            if (item.ListOfAdfcaActionThinBc != '' && item.ListOfAdfcaActionThinBc != null && item.ListOfAdfcaActionThinBc != 'null') {
                a: for (let j = 0; j < obj.ListOfAdfcaActionThinBc.Inspection.length; j++) {

                    if (obj.ListOfAdfcaActionThinBc.Inspection[j].TaskType == 'Temporary Routine Inspection') {

                        obj.TaskId = obj.ListOfAdfcaActionThinBc.Inspection[j].TaskId;

                        obj.BusinessActivity = obj.ListOfAdfcaActionThinBc.Inspection[j].Description;

                        break a;
                    }
                }
            }
            if (item.ListOfAdfcaAccountThinBc != '' && item.ListOfAdfcaAccountThinBc != null && item.ListOfAdfcaAccountThinBc != 'null') {
                let tradeLicenseNumberFullVar = obj.ListOfAdfcaAccountThinBc.Establishment[0].TradeLicenseNumberFull;
                if (tradeLicenseNumberFullVar != null && tradeLicenseNumberFullVar != "null") {
                    obj.TradeLicenseNumber = obj.ListOfAdfcaAccountThinBc.Establishment[0].TradeLicenseNumberFull;
                }
            }
            else {
                obj.TradeLicenseNumber = '';
            }
            if (item.ADFCACertificateExpDate != null && item.ADFCACertificateExpDate != "null") {
                obj.ADFCACertificateExpDate = item.ADFCACertificateExpDate;
            }
            else {
                obj.ADFCACertificateExpDate = '';
            }
            if (item.ADFCACertificateNo != null && item.ADFCACertificateNo != "null") {
                obj.ADFCACertificateNo = item.ADFCACertificateNo;
            }
            else {
                obj.ADFCACertificateNo = '';
            }
            if (item.ADFCACertificateStartDate != null && item.ADFCACertificateStartDate != "null") {
                obj.ADFCACertificateStartDate = item.ADFCACertificateStartDate;
            }
            else {
                obj.ADFCACertificateStartDate = '';
            }

            if (item.ADFCAEventLocation != null && item.ADFCAEventLocation != "null") {
                obj.ADFCAEventLocation = item.ADFCAEventLocation;
            }
            else {
                obj.ADFCAEventLocation = '';
            }
            if (item.ADFCAEventName != null && item.ADFCAEventName != "null") {
                obj.ADFCAEventName = item.ADFCAEventName;
            }
            else {
                obj.ADFCAEventName = '';
            }
            if (item.ADFCAEventType != null && item.ADFCAEventType != "null") {
                obj.ADFCAEventType = item.ADFCAEventType;
            }
            else {
                obj.ADFCAEventType = '';
            }
            if (item.ADFCAExbFromDate != null && item.ADFCAExbFromDate != "null") {
                obj.ADFCAExbFromDate = item.ADFCAExbFromDate;
            }
            else {
                obj.ADFCAExbFromDate = '';
            }
            if (item.ADFCAExibitionToDate != null && item.ADFCAExibitionToDate != "null") {
                obj.ADFCAExbToDate = item.ADFCAExibitionToDate;
            }
            else {
                obj.ADFCAExbToDate = '';
            }
            if (item.ADFCANoOfBooth != null && item.ADFCANoOfBooth != "null") {
                obj.ADFCANoOfBooth = item.ADFCANoOfBooth;
            }
            else {
                obj.ADFCANoOfBooth = '';
            }
            if (item.ADFCAPremiseAddress != null && item.ADFCAPremiseAddress != "null") {
                obj.ADFCAPremiseAddress = item.ADFCAPremiseAddress;
            }
            else {
                obj.ADFCAPremiseAddress = '';
            }
            if (item.ADFCAPuposeOfVisit != null && item.ADFCAPuposeOfVisit != "null") {
                obj.ADFCAPuposeOfVisit = item.ADFCAPuposeOfVisit;
            }
            else {
                obj.ADFCAPuposeOfVisit = '';
            }
            if (item.ADFCASRInspector != null && item.ADFCASRInspector != "null") {
                obj.ADFCASRInspector = item.ADFCASRInspector;
            }
            else {
                obj.ADFCASRInspector = '';
            }
            if (item.Application != null && item.Application != "null") {
                obj.Application = item.Application;
            }
            else {
                obj.Application = '';
            }
            if (item.ApplicationType != null && item.ApplicationType != "null") {
                obj.ApplicationType = item.ApplicationType;
            }
            else {
                obj.ApplicationType = '';
            }
            if (item.OpenedDate != null && item.OpenedDate != "null") {
                obj.OpenedDate = item.OpenedDate;
            }
            else {
                obj.OpenedDate = '';
            }

            if (item.Status != null && item.Status != "null") {
                obj.Status = item.Status;
            }
            else {
                obj.Status = '';
            }

            if (item.SiebSRId != null && item.SiebSRId != "null") {
                obj.SiebSRId = item.SiebSRId;
            }
            else {
                obj.SiebSRId = '';
            }

            if (obj.ADFCACertificateExpDate && (new Date(obj.ADFCACertificateExpDate) >= new Date())) {
                SRArray.push(obj);
            }

        }
        //console.log("SRArray::" + JSON.stringify(SRArray))

        populateSRDetailsFromEstId(0, SRArray, function (SRArray: any) {

            // App.estArray =  SRArray;
            TemporaryPermitsServiceRequestDraft.setServiceRequestArray(JSON.stringify(SRArray))
            setSRList(SRArray);

        });
    }

    function populateSRDetailsFromEstId(index: number, SRArray: any, CB: any) {

        if (index < SRArray.length) {
            if (SRArray[index].EstId) {

                let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, SRArray[index].EstId);

                let estData = allEstablishment.filter((e: any) => e.LicenseSource == SRArray[index].TradeLicenceNumber)

                if (temp && temp['0']) {

                    let item = temp['0'];

                    SRArray[index].LicenseExpiryDate = item.LicenseExpiryDate;

                    SRArray[index].EnglishName = item.EnglishName;

                    SRArray[index].LicenseSource = item.LicenseSource;

                    SRArray[index].TradeLicenceNumber = item.LicenseCode;

                    SRArray[index].AccountClass = item.AccountClass;

                    SRArray[index].Area = item.Area;

                    SRArray[index].Sector = item.Sector;

                    populateSRDetailsFromEstId(++index, SRArray, CB);

                }
                else if (estData.length) {
                    let item = estData[0];

                    SRArray[index].LicenseExpiryDate = item.LicenseExpiryDate;

                    SRArray[index].EnglishName = item.EnglishName;

                    SRArray[index].LicenseSource = item.LicenseSource;

                    SRArray[index].TradeLicenceNumber = item.LicenseCode;

                    SRArray[index].AccountClass = item.AccountClass;

                    SRArray[index].Area = item.Area;

                    SRArray[index].Sector = item.Sector;

                    populateSRDetailsFromEstId(++index, SRArray, CB);
                }
                else {

                    populateSRDetailsFromEstId(++index, SRArray, CB);

                }

            }
            else {

                populateSRDetailsFromEstId(++index, SRArray, CB);

            }
        }
        else {

            CB(SRArray);

        }

    }
// //console.log(SRList.length)
    const renderRecentNews = (item: any, index: number) => {

        return (

            <View
                key={index}
                style={{
                    height: HEIGHT * 0.35, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: (Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.tradeLicenseNumb), value: item.TradeLicenceNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.licenseExpiryDate, value: item.LicenseExpiryDate },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.mainBA, value: item.BusinessActivity },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.sector, value: item.Sector },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.custName, value: item.EnglishName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.estType, value: item.ListOfAdfcaAccountThinBc.Establishment && item.ListOfAdfcaAccountThinBc.Establishment[0] && item.ListOfAdfcaAccountThinBc.Establishment[0].EstablishmentType },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.licenseSource, value: item.LicenseSource },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.area, value: item.Area },
                    ]}
                />
                <View style={{height:5}}/>
                <ButtonComponent
                    style={{
                        padding: 5, width: '30%', backgroundColor: 'red',
                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}
                    isArabic={context.isArabic}
                    buttonClick={() => {
                        NavigationService.navigate('ShowSrDetails')
                        TemporaryPermitsServiceRequestDraft.setServiceRequestObject(JSON.stringify(item))
                    }}
                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.showSr)}
                />
                <View style={{height:5}}/>
            </View>
        )
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.serviceRequestList}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf', backgroundColor: '#abcfbe', }}>

                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.establishmentDetails}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 6.5, width: '85%', alignSelf: 'center' }} >
                    <FlatList
                        nestedScrollEnabled={true}
                        data={SRList}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={{ flex: 0.2 }} />

                {/* 
                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>

                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '80%', width: '100%', backgroundColor: 'red',
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => {
                                NavigationService.navigate('ShowSrDetails')
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.showSr)}
                        />
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => {
                                NavigationService.goBack()
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.cancel)}
                        />
                    </View>

                    <View style={{ flex: 0.2 }} />
               
                </View>


                <View style={{ flex: 0.5 }} /> */}

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    space: {
        flex: 0.0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center"
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    }
});

export default observer(EstablishmentDetailsTempPermit);

