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
import TaskSchema from '../../database/TaskSchema';
import LoginSchema from '../../database/LoginSchema';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native';
let realm = RealmController.getRealmInstance();
let moment = require('moment');

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const ShowSrDetails = (props: any) => {

    const context = useContext(Context);
    const isFocused = useIsFocused();

    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [SRObject, setSRObject] = useState(Object());
    const [showCreatebtn, setshowCreatebtn] = useState(true);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, documantationDraft: rootStore.documentationAndReportModel, establishmentDraft: rootStore.establishmentModel, TemporaryPermitsServiceRequestDraft: rootStore.temporaryPermitsServiceRequestModel })
    const { myTasksDraft, TemporaryPermitsServiceRequestDraft, establishmentDraft, documantationDraft } = useInject(mapStore)

    useEffect(() => {
        const create = props.route ? props.route.params ? props.route.params.NoCreate : true : true;
        setshowCreatebtn(create);

        // setInspectionDetails(inspectionDetails);
        // TemporaryPermitsServiceRequestDraft.callToFecthSrDetails();
        if (TemporaryPermitsServiceRequestDraft.serviceRequrestObject != '') {
            setSRObject(JSON.parse(TemporaryPermitsServiceRequestDraft.serviceRequrestObject))
        }
    }, []);
    useEffect(() => {
        TemporaryPermitsServiceRequestDraft.setState('done')
        myTasksDraft.setState('done')
    }, [isFocused]);

    useEffect(() => {
        debugger;
        if (TemporaryPermitsServiceRequestDraft.state == "adhocSuccess") {
            myTasksDraft.setState('pending');

            myTasksDraft.setContactName('');
            myTasksDraft.setMobileNumber('');
            myTasksDraft.setEmiratesId('');
            myTasksDraft.setEvidanceAttachment1('')
            myTasksDraft.setEvidanceAttachment1Url('')
            myTasksDraft.setEvidanceAttachment2('')
            myTasksDraft.setEvidanceAttachment2Url('')
            myTasksDraft.setLicencesAttachment1('')
            myTasksDraft.setLicencesAttachment1Url('');
            myTasksDraft.setLicencesAttachment2('')
            myTasksDraft.setLicencesAttachment2Url('')
            myTasksDraft.setEmiratesIdAttachment1('')
            myTasksDraft.setEmiratesIdAttachment1Url('')
            myTasksDraft.setEmiratesIdAttachment2('')
            myTasksDraft.setEmiratesIdAttachment2Url('')
            myTasksDraft.setNoCheckList('')
            myTasksDraft.setResult('')
            myTasksDraft.setFinalComment('')
            myTasksDraft.setFlashlightValue(false)
            myTasksDraft.setThermometerCBValue(false)
            myTasksDraft.setDataLoggerCBValue(false)
            myTasksDraft.setLuxmeterCBValue(false)
            myTasksDraft.setUVlightCBValue(false)
            myTasksDraft.setIsAlertApplicableToCurrentEst(false)
            myTasksDraft.setLatitude('')
            myTasksDraft.setLongitude('')
            myTasksDraft.setPercentage('')
            myTasksDraft.setTotalScore('')
            myTasksDraft.setMaxScore('')
            myTasksDraft.setGrade('')
            documantationDraft.setFileBuffer('')

            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};

            let obj = {
                TaskId: TemporaryPermitsServiceRequestDraft.taskId,
                BusinessActivity: SRObject.BusinessActivity,
                Description: SRObject.BusinessActivity,
                EstablishmentName: SRObject.EnglishName,
                EstablishmentId: SRObject.Id,
                TaskType: 'Temporary Routine Inspection',
                TaskStatus: 'Scheduled',
                isAcknowledge: false,
                CreatedDate: moment().format('L'),
                LoginName: loginData.username,
                LicenseCode: SRObject.ListOfAdfcaAccountThinBc && SRObject.ListOfAdfcaAccountThinBc.Establishment[0].TradeLicenseNumberFull,
                LicenseNumber: SRObject.TradeLicenceNumber,
                ListOfAdfcaAccountThinBc: SRObject.ListOfAdfcaAccountThinBc,
                condemnationFlag: false,
                detentionFlag: false,
                RiskCategory: "High",
                samplingFlag: false,
                mappingData: [{
                    addressIDs: [
                        {
                            AddressLine1: "",
                            AddressLine2: "",
                            City: "",
                            Country: "",
                            lat: "",
                            long: "",
                            PostalCode: null
                        }
                    ],
                    Area: "",
                    completionDate: '',
                    completionDateWithDayRemaining: '',//pending
                    condemnationReport: [],
                    samplingReport: [],
                    detentionReport: [],
                    ContactName: "",//signature page 
                    ContactNumber: "",
                    CustomerName: SRObject.EnglishName,//Establishment
                    CustomerNameEnglish: SRObject.EnglishName,
                    EFSTFlag: false,//false compalsanglishry
                    EHSRiskClassification: "",//Establishment resp
                    EmiratesId: "",
                    EstablishmentClass: "",//Establishment resp
                    EstablishmentDetailsList: undefined,
                    EstablishmentId: SRObject.Id,
                    EstablishmentType: "",
                    finalResult: "",//lowest score
                    Grade: null,
                    grade: null,
                    grade_percentage: "",
                    inspectionForm: [],
                    InspectortobeEvaluatedId: null,
                    InspFullName: " ",
                    isCompltedOffline: false,
                    isuploadedToserver: false,
                    isViolated: "false",//score 0 asal tar
                    LicenseCode: SRObject.ListOfAdfcaAccountThinBc && SRObject.ListOfAdfcaAccountThinBc.Establishment[0].TradeLicenseNumberFull,
                    LicenseNumber: SRObject.TradeLicenceNumber, ListOfAdfcaAccountThinBc: SRObject.ListOfAdfcaAccountThinBc,
                    LicenseSource: "",
                    ManagerID: null,//contact page
                    ManagerMobile: null,
                    ManagerName: null,
                    MobileNumber: "",//Establishment resp
                    next_visit_date: "",//calculate
                    NumOfEST: '',
                    onlineReq: '',
                    onlineRes: [],
                    overallComments: "",
                    PendingRequests: [],
                    PlanAbuDhabi: null,
                    PlanAlAin: null,
                    PlanAlGharbia: null,
                    PlanEndDate: null,
                    PlanId: null,
                    PlanName: null,
                    PlanNumber: null,
                    PlanStartDate: null,
                    PlanStatus: null,
                    printingelementect: {
                        ActualInspectionDate: "",
                        Address: "",
                        BusinessActivity: SRObject.BusinessActivity,
                        CertificateExpDate: "",//Establishment resp
                        CertificateNo: SRObject.ListOfAdfcaAccountThinBc && SRObject.ListOfAdfcaAccountThinBc.Establishment[0].TradeLicenseNumberFull,
                        ClientName: '',//ContactName
                        CustomerSignature: "",
                        Duration: "",
                        EquipmentsUsed: "",
                        EstablishNameInArabic: "",
                        IdentificationNumber: "",
                        InspectionNearestGracePeriod: '',//finala grace peroid
                        InspectionNo: TemporaryPermitsServiceRequestDraft.taskId,//taskId
                        InspectionOverallInspectionComment: "",
                        InspectionResult: "",//final result
                        InspectionUserID: SRObject.LoginId,
                        InspectorName: SRObject.LoginName,
                        isSatisfactory: "",//depend on finalResult
                        LicenseExpiryDate: "",
                        MajorNonComplianceInspectionParameter: [],
                        MinorNonComplianceInspectionParameter: [],
                        ModerateNonComplianceInspectionParameter: [],
                        OmittedInspectionParameter: [],
                        PhoneNo: "",
                        ScheduledInspectionDate: "",//completionDate0
                        TypeofInspection: 'Temporary Routine Inspection'
                    },
                    printingReport: [],
                    ResponseSubmitted: null,
                    SampleSize: null,
                    Scope: "",// resp
                    Sector: null,
                    signatureBase64: "",
                    taskId: TemporaryPermitsServiceRequestDraft.taskId,
                    tempScore: '',//overall min score
                    TimeElapsed: "",//start checklist
                    timerStarted: "",
                    TimeStarted: "",//start checklist
                    total_score: '',
                    TradeExpiryDate: "",//Establishment resp
                    TradeLicenseCreatedDate: "",//Establishment resp
                    TradeLicenseNumber: "",// Establishment resp
                    dataLoggerCBValue: false,
                    luxmeterCBValue: false,
                    flashlightCBValue: false,//equipment page
                    thermometerCBValue: false,
                    UVlightCBValue: false,
                    Visittype: ""
                }],
                isCompleted: false
            }
            setInspectionDetails(obj)

            let allTask = myTasksDraft.getTaskApiResponse != '' ? JSON.parse(myTasksDraft.getTaskApiResponse) : [];
            allTask.push(obj)
            myTasksDraft.setMyTaskResponse(JSON.stringify(allTask));
            let temp1 = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : '';
            temp1 = temp1.length ? temp1.filter((i: any) => i.LicenseNumber == SRObject.TradeLicenceNumber) : []

            if (temp1 && temp1[0]) {
                let addressObj = temp1[0].addressObj && typeof (temp1[0].addressObj) == 'string' ? JSON.parse(temp1[0].addressObj) : []
                let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                establishmentDraft.setAddress(address)
                establishmentDraft.setEstablishmentId(temp1[0].Id ? temp1[0].Id : '')
                establishmentDraft.setArea(temp1[0].Area ? temp1[0].Area : '')
                establishmentDraft.setSector(temp1[0].Sector ? temp1[0].Sector : '')
                establishmentDraft.setContactDetails(temp1[0].Mobile ? temp1[0].Mobile : '')
                establishmentDraft.setEstablishmentName(context.isArabic ? temp1[0].ArabicName ? temp1[0].ArabicName : '' : temp1[0].EnglishName ? temp1[0].EnglishName : '')
                establishmentDraft.setLicenseEndDate(temp1[0].LicenseExpiryDate ? temp1[0].LicenseExpiryDate : '')
                establishmentDraft.setLicenseStartDate(temp1[0].LicenseRegDate ? temp1[0].LicenseRegDate : '')
                establishmentDraft.setLicenseNumber(temp1[0].LicenseNumber ? temp1[0].LicenseNumber : '')
                establishmentDraft.setLicenseSource(temp1[0].LicenseSource ? temp1[0].LicenseSource : '')
            }

            establishmentDraft.setEstablishmentName(SRObject.EnglishName ? SRObject.EnglishName : '')
            myTasksDraft.setSelectedTask(JSON.stringify(obj))
            myTasksDraft.setTaskId(TemporaryPermitsServiceRequestDraft.taskId)

            RealmController.addTaskDetails(realm, obj, TaskSchema.name, () => {

            });
            myTasksDraft.callToGetChecklistApi(obj, context.isArabic, false, obj.Description);

        }


    }, [TemporaryPermitsServiceRequestDraft.state])


    useEffect(() => {
        if (myTasksDraft.state === 'getChecklistSuccess') {
            // myTasksDraft.setState('pending')
            // myTasksDraft.setLoadingState('Fetching Checklist')
            NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': inspectionDetails, 'flag': true });
            // NavigationService.navigate('StartInspection');
        }

    }, [myTasksDraft.state === 'getChecklistSuccess']);

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={myTasksDraft.state == 'pending' ? true : false}
                    textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <Spinner
                    visible={TemporaryPermitsServiceRequestDraft.state == 'pending' ? true : false}
                    textContent={TemporaryPermitsServiceRequestDraft.loadingState != '' ? TemporaryPermitsServiceRequestDraft.loadingState : 'Loading...'}
                    // textContent={'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
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

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.requestNo + ": "}</Text>
                    </View>

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{SRObject.ADFCACertificateNo}</Text>
                    </View>

                    {/* <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Fujitsu India'}</Text>
                    </View> 
*/}
                    <View style={{ flex: 1 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf', backgroundColor: '#abcfbe', }}>

                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.applicationType + " Temporary Permit"}({SRObject.ApplicationType})</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                {/* <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.serviceReqNum)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.city)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange} />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.application)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.applicationType)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.creationDate)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.closedDate)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />


                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.permitStartDate)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}


                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2 }} />


                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.permitEndDate)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={50}
                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChange={props.onChange}
                            />
                        </View>

                    </View>

                </View> */}

                <View style={{
                    flex: 5.4, width: '85%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                    <TableComponent
                        isHeader={false}
                        isArabic={context.isArabic}
                        data={[{ keyName: (Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.certificateNo), value: SRObject.ADFCACertificateNo },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.certificatestartDate, value: SRObject.ADFCACertificateStartDate },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.certificateExpiryDate, value: SRObject.ADFCACertificateExpDate },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.noOfBooth, value: SRObject.ADFCANoOfBooth },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.applicationType, value: SRObject.ApplicationType },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.eventName, value: SRObject.ADFCAEventName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.location, value: SRObject.ADFCAEventLocation },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.eventType, value: SRObject.ADFCAEventType },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.premiseAddress, value: SRObject.ADFCAPremiseAddress },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.assignTo, value: SRObject.ADFCASRInspector },
                        ]}
                    />
                </View>

                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '40%', alignSelf: 'center' }}>

                    {/* <View style={{ flex: 0.5 }} /> */}

                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        {
                            showCreatebtn ?
                                <ButtonComponent
                                    style={{
                                        height: '80%', width: '100%', backgroundColor: 'red',
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        // NavigationService.navigate('ContactList')
                                        TemporaryPermitsServiceRequestDraft.callToAdhocInspection()
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.createAdhoc)}
                                />
                                :
                                null
                        }

                    </View>
                    {/* 
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
                                NavigationService.goBack();
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.cancel)}
                        />
                    </View>

                    <View style={{ flex: 0.2 }} /> */}
                    {/* <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                style={{
                                    height: '70%', width: '100%', backgroundColor: 'red',
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}

                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    NavigationService.navigate('InspectionDetails', { 'inspectionDetails': props.route.params.inspectionDetails });
                                }}
                                textstyle={{ textAlign: 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 8, color: fontColor.white }}
                                buttonText={
                                    (Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionDetailsbtn)}
                            />
                        </View> */}

                    {/* <View style={{ flex: 0.5 }} /> */}


                </View>


                <View style={{ flex: 0.5 }} />

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

export default observer(ShowSrDetails);

