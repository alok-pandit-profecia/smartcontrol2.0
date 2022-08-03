import React, { createRef, useRef, useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, Linking, AppState, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";

import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';

import LocationPermissionModel from '../components/LocationPermissionModel';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import submissionPayload, { scoreCalculations, submissionPayloadFollow } from '../utils/payloads/ChecklistSubmitPayload';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import Spinner from 'react-native-loading-spinner-overlay';
import SignatureCapture from 'react-native-signature-capture';
import LoginSchema from './../database/LoginSchema';
import { useIsFocused } from '@react-navigation/native';


import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
;
import TextInputComponent from '../components/TextInputComponent';
import TaskSchema from '../database/TaskSchema';
import Dropdown from '../components/dropdown';
import ButtonComponent from '../components/ButtonComponent';
import NavigationService from '../services/NavigationService';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');
let clone = require('clone');
const { Popover } = renderers

let estSelectedItem: any = {};

const StartInspectionCondenation = (props: any) => {

    const context = useContext(Context);
    const checklistComponentStepOneRef = useRef(null);
    const dropdownRef1 = useRef(null);
    const sign = createRef();
    const isFocused = useIsFocused();

    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, foodalertDraft: rootStore.foodAlertsModel, completedTaskDraft: rootStore.completdMyTaskModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, establishmentDraft: rootStore.establishmentModel, licenseMyTasksDraft: rootStore.licenseMyTaskModel, bottomBarDraft: rootStore.bottomBarModel, documentationDraft: rootStore.documentationAndReportModel, condemnationDraft: rootStore.condemnationModel, samplingDraft: rootStore.samplingModel, detentionDraft: rootStore.detentionModel })
    const { licenseMyTasksDraft, myTasksDraft, completedTaskDraft, adhocTaskEstablishmentDraft, foodalertDraft, establishmentDraft, bottomBarDraft, documentationDraft, condemnationDraft, detentionDraft, samplingDraft } = useInject(mapStore)
    let taskDetails: any = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
    // taskDetails.mappingData = taskDetails.mappingData && taskDetails.mappingData.length ? taskDetails.mappingData : [{}]
    let scoreGiven = false;
    let signData: string = '';

    const [modifiedCheckListData, setModifiedCheckListData] = useState(Array());
    const [inspectionDetails, setInspectionDetails] = useState(Object());

    // individual section and index for checklist
    const [isEmiratesIdValid, setIsEmiratesIdValid] = useState(false);
    const [isPhoneNumberNotValid, setIsPhoneNumberValid] = useState(false);
    const [isContactNameIsValid, setContactNameValid] = useState(false);
    const [otherArray, setOtherArray] = useState(Array());
    const [evidanceDropdown, setEvidanceDropdown] = useState('');
    const [signbase64, setSignbase64] = useState('');

    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        Address: null
    });


    const [isNeverAskLocationPermissionAlert, setNeverAskLocationPermissionAlert] = useState(false);
    const [finalTime, setFinalTime] = useState('00:00:00');
    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''

    useEffect(() => {
        let array = [{ type: 'Emirates Id', value: 'Emirates Id' }, { type: 'Other', value: 'Other' }];
        setOtherArray(array);
    }, [])

    useEffect(() => {
        if (samplingDraft.state == 'navigate') {
            NavigationService.navigate('MyTasks');
        }
    }, [samplingDraft.state]);

    useEffect(() => {

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)

        let mappingData = [];
        mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        setInspectionDetails(inspectionDetails);

        if (inspectionDetails.mappingData && inspectionDetails.mappingData['0']) {


            console.log('inspectionDetails.mappingData :::' + JSON.stringify(inspectionDetails.mappingData['0']));
            myTasksDraft.setContactName(inspectionDetails.mappingData['0'].ContactName ? inspectionDetails.mappingData['0'].ContactName : "");

            myTasksDraft.setMobileNumber(inspectionDetails.mappingData['0'].ContactNumber ? inspectionDetails.mappingData['0'].ContactNumber : "");

            myTasksDraft.setEmiratesId(inspectionDetails.mappingData['0'].EmiratesId ? inspectionDetails.mappingData['0'].EmiratesId : "")
            // documantationDraft.setFileBuffer((inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) ? inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64 : '')
            if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) {
                documentationDraft.setFileBuffer(inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64)
            }
        }
    }, [isFocused])

    const validateEmiratesId = (str: any) => {

        let isErrorInEmirateId = false;
        str = str.trim().replace(/-/g, '');
        let emirateId = str;
        if (str && str.trim()) {
            if (str.length !== 15) {
                isErrorInEmirateId = true;
            }
            else {
                let chars = emirateId.split('');
                let numberMultiSum = 0;
                let remainingDigitSum = 0;
                for (let i = 1; i < chars.length; i += 2) {
                    let num = (parseInt(chars[i]) * 2).toString();
                    if (parseInt(num) > 9) {
                        let char1 = num.split('');
                        let tempSum = 0;
                        for (let j = 0; j < char1.length; j++) {
                            tempSum = tempSum + parseInt(char1[j]);
                        }
                        numberMultiSum = numberMultiSum + tempSum;
                    } else {
                        numberMultiSum = numberMultiSum + parseInt(num);
                    }
                }
                // System.out.println();
                for (let i = chars.length - 3; i >= 0; i -= 2) {
                    remainingDigitSum = remainingDigitSum + parseInt(chars[i]);
                }
                let totalSum = numberMultiSum + remainingDigitSum;
                let nextHighestNumber = 0;
                if (totalSum % 10 == 0) {
                    nextHighestNumber = totalSum;
                } else {
                    let tt = 10 - totalSum % 10;
                    nextHighestNumber = totalSum + tt;
                }
                try {
                    if ((nextHighestNumber - totalSum) === parseInt(chars[chars.length - 1])) {
                        isErrorInEmirateId = false;
                    }
                    else {
                        isErrorInEmirateId = true;
                    }
                }
                catch (e) {
                    //console.log("error e :", e);
                }
            }
        }
        else {
            isErrorInEmirateId = false;
        }
        return isErrorInEmirateId;
    }

    const validatePhone = (contactNumber: any) => {
        let isErrorInPhoneNumber = false;

        if (!contactNumber) {
            isErrorInPhoneNumber = true;
            return isErrorInPhoneNumber;
        }
        let contactNumberLen = contactNumber.length;
        if (contactNumberLen < 9 || contactNumberLen > 13) {
            isErrorInPhoneNumber = true;
            return isErrorInPhoneNumber;
        }
        else {
            isErrorInPhoneNumber = false;
            return isErrorInPhoneNumber
        }
    }

    const validateUsername = (str: string) => {
        debugger;
        let isErrorInUserName: any = false;
        if (str === '') {
            return true;
        }
        if (str && str.trim()) {
            debugger;
            let regex = new RegExp('^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z ]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_\. ]*$', 'g');
            // alert(regex.test(str))
            if (!regex.test(str)) {
                isErrorInUserName = true;
            }
        }
        else {
            isErrorInUserName = true;
        }
        return isErrorInUserName;
    }

    const resetSign = () => {
        setSignbase64('')
        if (documentationDraft.fileBuffer !== '') {
            documentationDraft.setFileBuffer('')
        }
        else {
            sign.current.resetImage();
        }
    };

    const saveSign = () => {
        sign.current.saveImage();
        // console.log('22222222222222222');

        documentationDraft.setFileBuffer(signbase64);
        documentationDraft.setSaveImageFlag("true");
    };

    const onDragEvent = () => {
        saveSign()
    };

    const getFormattedDate = (date: any) => {
        return ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2)
    }

    const submitInspection = async (flag: boolean, value: string) => {

        try {
            // console.log('documentationDraft.fileBuffer' + JSON.stringify(documentationDraft.fileBuffer));

            console.log('In Submit Inspection :::::::::::::::::::::::::::::::::')
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};
            let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

            if (myTasksDraft.contactName === '') {
                Alert.alert("", "Contact Name is mandatory")
            }
            else if (myTasksDraft.mobileNumber === '') {
                Alert.alert("", "Mobile number is mandatory")
            }
            else if (documentationDraft.fileBuffer === '') {
                Alert.alert("", "Signature is mandatory")
            }
            else {
                let taskDetails = await { ...inspectionDetails };
                debugger;
                let payload: any;
                if (taskType.toLowerCase() == 'sampling') {
                    payload = {
                        "InterfaceID": "ADFCA_CRM_SBL_007",
                        "TimeStamp": '',
                        "LegalRepName": "",
                        "InspectionCheckList": {
                            "Inspection": {
                                "OPADesc": '',
                                "InspectorId": loginInfo.username,
                                "NearestDate": '',
                                "InspectorName": loginInfo.username,
                                "LanguageType": "ENU",
                                "GracePeriod": "",
                                "TaskId": myTasksDraft.taskId,
                                "Thermometer": 'N',
                                "Flashlight": 'N',
                                "DataLogger": 'N',
                                "LuxMeter": 'N',
                                "UVLight": 'N',
                                "ActualInspectionDate": getFormattedDate(new Date()),
                                "ScorePercent": '',
                                "ContactName": myTasksDraft.contactName,
                                "MobileNumber": myTasksDraft.mobileNumber,
                                "EmiratesId": myTasksDraft.emiratesId,
                                "Latitude": myTasksDraft.latitude,
                                "Longitude": myTasksDraft.longitude,
                                "Grade": '',
                                "Comment": '',
                                "Score": '',
                                "Action": '',
                                "InspectionStatus": 'done',
                                "ListOfFsExpenseItem": ''
                            }
                        },
                        "IsReschedule": ""
                    }

                    try {
                        let date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
                        let ViolationDateArr = date.split(" ");
                        let vioDate = ViolationDateArr['0'];
                        let vioTime = ViolationDateArr['1'];
                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]

                            tempObjct['0'].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];

                            tempObjct['0'].ContactName = myTasksDraft.contactName;
                            tempObjct['0'].ContactNumber = myTasksDraft.mobileNumber;
                            tempObjct['0'].signatureBase64 = signbase64;

                            tempdata.mappingData = tempObjct;
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });

                        }
                    }
                    catch (e) {
                        // alert('exception' + e);
                    }
                    myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                    samplingDraft.setState('done');

                }
                else if (taskType.toLowerCase() == 'condemnation') {

                    payload = {
                        "InterfaceID": "ADFCA_CRM_SBL_007",
                        "TimeStamp": '',
                        "LegalRepName": "",
                        "InspectionCheckList": {
                            "Inspection": {
                                "OPADesc": '',
                                "InspectorId": loginInfo.username,
                                "NearestDate": '',
                                "InspectorName": loginInfo.username,
                                "LanguageType": "ENU",
                                "GracePeriod": "",
                                "TaskId": myTasksDraft.taskId,
                                "Thermometer": 'N',
                                "Flashlight": 'N',
                                "DataLogger": 'N',
                                "LuxMeter": 'N',
                                "UVLight": 'N',
                                "ActualInspectionDate": getFormattedDate(new Date()),
                                "ScorePercent": '',
                                "ContactName": '',
                                "MobileNumber": '',
                                "EmiratesId": '',
                                "Latitude": myTasksDraft.latitude,
                                "Longitude": myTasksDraft.longitude,
                                "Grade": '',
                                "Comment": '',
                                "Score": '',
                                "Action": '',
                                "InspectionStatus": 'done',
                                "ListOfFsExpenseItem": ''
                            }
                        },
                        "IsReschedule": ""
                    }

                    try {
                        let date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
                        let ViolationDateArr = date.split(" ");
                        let vioDate = ViolationDateArr['0'];
                        let vioTime = ViolationDateArr[1];
                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                            tempObjct['0'].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                            tempObjct['0'].ContactName = myTasksDraft.contactName;
                            tempObjct['0'].ContactNumber = myTasksDraft.mobileNumber;
                            tempObjct['0'].signatureBase64 = signbase64;

                            tempdata.mappingData = tempObjct;
                            console.log('task details in condemation ::' + JSON.stringify(tempdata))
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });

                        }
                    }
                    catch (e) {
                        // alert('exception' + e);
                    }
                    myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                    debugger;
                    condemnationDraft.setState('done')
                }
                else if (taskType.toString().toLowerCase() == 'detention') {
                    payload = {
                        "InterfaceID": "ADFCA_CRM_SBL_007",
                        "TimeStamp": '',
                        "LegalRepName": "",
                        "InspectionCheckList": {
                            "Inspection": {
                                "OPADesc": '',
                                "InspectorId": loginInfo.username,
                                "NearestDate": '',
                                "InspectorName": loginInfo.username,
                                "LanguageType": "ENU",
                                "GracePeriod": "",
                                "TaskId": myTasksDraft.taskId,
                                "Thermometer": 'N',
                                "Flashlight": 'N',
                                "DataLogger": 'N',
                                "LuxMeter": 'N',
                                "UVLight": 'N',
                                "ActualInspectionDate": getFormattedDate(new Date()),
                                "ScorePercent": '',
                                "ContactName": '',
                                "MobileNumber": '',
                                "EmiratesId": '',
                                "Latitude": myTasksDraft.latitude,
                                "Longitude": myTasksDraft.longitude,
                                "Grade": '',
                                "Comment": '',
                                "Score": '',
                                "Action": '',
                                "InspectionStatus": 'done',
                                "ListOfFsExpenseItem": ''
                            }
                        },
                        "IsReschedule": ""
                    }
                    try {

                        let date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
                        let ViolationDateArr = date.split(" ");
                        let vioDate = ViolationDateArr['0'];
                        let vioTime = ViolationDateArr[1];
                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                            tempObjct['0'].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                            tempObjct['0'].ContactName = myTasksDraft.contactName;
                            tempObjct['0'].ContactNumber = myTasksDraft.mobileNumber;
                            tempObjct['0'].signatureBase64 = signbase64;


                            // tempObjct['0'].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                            tempdata.mappingData = tempObjct;

                            console.log('tempData :: ' + JSON.stringify(tempdata));
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });

                        }
                    }
                    catch (e) {
                        // alert('exception' + e);
                    }
                    myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                    debugger;
                    detentionDraft.setState('done')
                }

                console.log('payload ::' + JSON.stringify(payload))
                // myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                debugger;
                // samplingDraft.setClearData();   // data clear 
                myTasksDraft.callToSubmitTaskApi(payload, [], flag);
            }
        } catch (error) {
            console.log("error submit::" + error)
            // submit(true, value)
        }
    }

    const onSaveEvent = (result: any) => {

        console.log('111111111111');
        signData = result.encoded;

        setSignbase64(result.encoded);
        documentationDraft.setFileBuffer(signData);

        // let taskDetails = { ...inspectionDetails }
        let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
        mappingData['0'].signatureBase64 = result.encoded;
        mappingData['0'].ContactName = myTasksDraft.contactName;
        mappingData['0'].ContactNumber = myTasksDraft.mobileNumber;

        taskDetails.mappingData = mappingData;

        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            // backButtonHandlerApp()
        });
    };

    const goBack = () => {
        if (taskType.toLowerCase() == 'sampling') {
            NavigationService.navigate('SamplingForm');
        }
        else if (taskType.toLowerCase() == 'condemnation') {
            NavigationService.navigate('CondemnationForm')
        }
        else if (taskType.toLowerCase() == 'detention') {
            NavigationService.navigate('DetentionForm')

        }
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={(myTasksDraft.state == 'pending') ? true : false}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                ////customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />

            {
                isNeverAskLocationPermissionAlert ?
                    <LocationPermissionModel
                        okmsg={('Allow')}
                        isArabic={context.isArabic}
                        cancelmsg={('Cancle')}
                        message={('App need to access your live location')}
                        okAlert={() => {
                            setNeverAskLocationPermissionAlert(false);
                            Linking.openSettings();
                        }}
                        closeAlert={() => {
                            setNeverAskLocationPermissionAlert(true);
                            // BackHandler.exitApp()
                        }}
                    />
                    : null
            }
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 2, alignSelf: 'center', width: '90%' }}>
                    <Header
                        screenName={'sampling'}
                        goBack={goBack}
                        isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{myTasksDraft.selectedTask != '' ? taskType.toString().toUpperCase() : ' - '}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>

                </View>


                <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>


                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.003, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger style={styles.menuTrigger}>
                                {
                                    // myTasksDraft.isMyTaskClick == 'CompletedTask' ?
                                        <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                                        // :
                                        // <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{finalTime}</Text>
                                }
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                                {/* <MenuOption onSelect={() => { }} > */}
                                {
                                    myTasksDraft.isMyTaskClick == 'CompletedTask' ?
                                        <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                                        :
                                        <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{finalTime}</Text>
                                }
                                {/* </MenuOption> */}

                            </MenuOptions>
                        </Menu>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, backgroundColor: '#abcfbe', flexDirection: 'row', width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{taskType.toString().toLowerCase() == 'sampling' ? Strings[context.isArabic ? 'ar' : 'en'].samplingForm.title : taskType.toString().toLowerCase() == 'condemnation' ? Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.title : Strings[context.isArabic ? 'ar' : 'en'].detentionForm.title}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 7.1, width: '85%', alignSelf: 'center' }}>

                    <View style={{ flex: 3, width: '85%', justifyContent: 'center' }}>
                        {
                            documentationDraft.fileBuffer !== '' ?
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${documentationDraft.fileBuffer}` }}
                                    style={{
                                        height: '100%', alignSelf: 'center', width: '100%', padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                                    }}
                                />
                                :
                                <SignatureCapture
                                    style={{
                                        height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                                    }}
                                    ref={sign}
                                    onSaveEvent={onSaveEvent}
                                    onDragEvent={onDragEvent}
                                    saveImageFileInExtStorage={false}
                                    showNativeButtons={false}
                                    showTitleLabel={false}
                                />

                        }

                    </View>

                    <View style={{ backgroundColor: '#c0c0c0', flex: 0.5, justifyContent: 'center', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, height: '100%' }}>

                        <View style={{ backgroundColor: '#c0c0c0', alignSelf: props.isArabic ? 'flex-start' : 'flex-end', width: '35%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', height: '100%', paddingTop: 2, paddingBottom: 2 }}>

                            <View style={{ flex: .4 }} />

                            <View style={{ flex: .6, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%' }}>

                                <TouchableOpacity
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    onPress={() => {
                                        resetSign();
                                    }} >
                                    <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/delete.png')} />
                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: .2 }} />

                        </View>

                        <View style={{ flex: .2 }} />

                    </View>


                    <View style={{ flex: 3, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.contactName} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <View
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>

                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={myTasksDraft.contactName}
                                        editable={myTasksDraft.isMyTaskClick == 'CompletedTask' ? false : true}
                                        onChange={(val: string) => {

                                            if (!validateUsername(val)) {
                                                setContactNameValid(false);
                                            }
                                            else {
                                                setContactNameValid(true);
                                            }

                                            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                                            mappingData['0'].ContactName = val;
                                            mappingData['0'].ContactNumber = myTasksDraft.mobileNumber;
                                            mappingData['0'].signatureBase64 = signbase64;

                                            taskDetails.mappingData = mappingData;
                                            myTasksDraft.setContactName(val);

                                            console.log('taskDetails.mappingData  ::' + JSON.stringify(taskDetails.mappingData))

                                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                                // backButtonHandlerApp()
                                                // ToastAndroid.show('Task updated successfully ', 1000);
                                            });
                                        }}
                                    />

                                </View>

                            </View>

                        </View>

                        <View style={styles.space} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.mobileNumber} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <View
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>

                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>

                                        <TextInputComponent
                                            placeholder={''}
                                            style={{
                                                height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }}
                                            maxLength={12}
                                            editable={myTasksDraft.isMyTaskClick == 'CompletedTask' ? false : true}
                                            keyboardType={'number-pad'}
                                            value={myTasksDraft.mobileNumber}
                                            onChange={(val: string) => {
                                                if (!validatePhone(val)) {
                                                    setIsPhoneNumberValid(false);
                                                }
                                                else {
                                                    setIsPhoneNumberValid(true);
                                                }
                                                myTasksDraft.setMobileNumber(val);

                                                let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                                                mappingData['0'].ContactNumber = val;
                                                mappingData['0'].ContactName = myTasksDraft.contactName;
                                                mappingData['0'].signatureBase64 = signbase64;
                                                taskDetails.mappingData = mappingData;

                                                console.log('taskDetails.mappingData  ::' + JSON.stringify(taskDetails.mappingData))
                                                // inspectionDetails.mappingData['0'].ContactNumber = val;
                                                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                                    // backButtonHandlerApp()
                                                    // ToastAndroid.show('Task updated successfully ', 1000);
                                                });
                                            }}
                                        />

                                    </View>

                                </View>

                            </View>

                        </View>

                        <View style={styles.space} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>

                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef1 && dropdownRef1.current.focus();
                                    }}
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>

                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef1}
                                            value={myTasksDraft.otherValue}
                                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                            onChangeText={(val: string) => {

                                                setEvidanceDropdown(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={otherArray}
                                        />
                                    </View>

                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>

                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />

                                    </View>

                                </TouchableOpacity>

                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <View
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center',
                                    }} >
                                    <View style={{ width: evidanceDropdown.toLowerCase() == 'other' ? "100%" : '80%', justifyContent: 'center', alignItems: 'center', }}>

                                        <TextInputComponent
                                            placeholder={''}
                                            style={{
                                                height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }}
                                            keyboardType={'number-pad'}
                                            editable={myTasksDraft.isMyTaskClick == 'CompletedTask' ? false : true}
                                            maxLength={20}
                                            value={myTasksDraft.emiratesId}
                                            onChange={(val: string) => {
                                                // alert(validateEmiratesId(val));
                                                if (evidanceDropdown.toLowerCase() == 'other') {
                                                    myTasksDraft.setEmiratesId(val);

                                                } else {
                                                    if (!validateEmiratesId(val)) {
                                                        setIsEmiratesIdValid(false);
                                                    }
                                                    else {
                                                        setIsEmiratesIdValid(true);
                                                    }
                                                    myTasksDraft.setEmiratesId(val);

                                                }

                                                let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                                                mappingData['0'].EmiratesId = val;
                                                taskDetails.mappingData = mappingData;

                                                console.log('taskDetails ::' + JSON.stringify(taskDetails));

                                                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                                    // backButtonHandlerApp()
                                                    // ToastAndroid.show('Task updated successfully ', 1000);
                                                });

                                            }}
                                        />

                                    </View>
                                    {
                                        evidanceDropdown.toLowerCase() == 'other' ?
                                            null
                                            :
                                            <TouchableOpacity
                                                // onPress={() => {}}
                                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                                style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                                <Image
                                                    source={require("./../assets/images/scan.png")}
                                                    // style={{ transform: [{ rotate: '90deg' }] }}
                                                    resizeMode={"contain"} />
                                            </TouchableOpacity>
                                    }
                                </View>

                            </View>

                        </View>

                    </View>

                    <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.2 }} />

                        <ButtonComponent
                            style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                            buttonClick={() => {
                                // (view && view == true) ?
                                if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                    if (taskType.toString().toLowerCase() == 'sampling') {
                                        NavigationService.navigate('Sampling');
                                    }
                                    else if (taskType.toString().toLowerCase() == 'condemnation') {
                                        NavigationService.navigate('Condemnation');
                                    }
                                    else if (taskType.toString().toLowerCase() == 'detention') {
                                        NavigationService.navigate('Detention');
                                    }
                                }
                                else {
                                    submitInspection(true, 'withoutChecklist');
                                }
                            }}
                            buttonText={((taskType.toString().toLowerCase() == 'sampling' || taskType.toString().toLowerCase() == 'condemnation' || taskType.toString().toLowerCase() == 'detention') && myTasksDraft.isMyTaskClick == 'CompletedTask') ? Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok : Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}

                            // buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        />

                        <View style={{ flex: 0.5 }} />

                        <ButtonComponent
                            style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                            buttonClick={() => {
                                if (taskType.toString().toLowerCase() == 'sampling') {
                                    NavigationService.navigate('SamplingForm');
                                }
                                else if (taskType.toString().toLowerCase() == 'condemnation') {
                                    NavigationService.navigate('CondemnationForm');
                                }
                                else if (taskType.toString().toLowerCase() == 'detention') {
                                    NavigationService.navigate('DetentionForm');
                                }
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.back)}
                        />

                        <View style={{ flex: 0.2 }} />

                    </View>

                </View>

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >
    )
}

export default observer(StartInspectionCondenation);

const styles = StyleSheet.create({
    diamondView: {
        width: 45,
        height: 45,
        // transform: [{rotate: '45deg' }]
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    },
    space: {
        flex: 0.1,

    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    commentTextContainer: {
        flex: 0.2,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    }
});