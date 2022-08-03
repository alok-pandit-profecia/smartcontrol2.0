import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, PermissionsAndroid, Platform, ToastAndroid, FlatList } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();
import ImagePicker from 'react-native-image-picker';
import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import Dropdown from './../components/dropdown';
import ButtonComponent from './ButtonComponent';
import Strings from '../config/strings';

import CheckListSchema from '../database/CheckListSchema';

import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import TaskSchema from '../database/TaskSchema';
import { useIsFocused } from '@react-navigation/native';
import LOVSchema from '../database/LOVSchema';
import RNTextDetector from "react-native-text-detector";
import { DownloadDirectoryPath, readFile } from 'react-native-fs';

const SubmissionComponent = (props: any) => {

    const context = useContext(Context);
    let dropdownRef1 = useRef();
    let dropdownRef2 = useRef();
    let dropdownRef3 = useRef();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, documantationDraft: rootStore.documentationAndReportModel, licenseDraft: rootStore.licenseMyTaskModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, licenseDraft, bottomBarDraft, documantationDraft } = useInject(mapStore);
    const [isEmiratesIdValid, setIsEmiratesIdValid] = useState(false);
    const [isPhoneNumberNotValid, setIsPhoneNumberValid] = useState(false);
    const [isContactNameIsValid, setContactNameValid] = useState(false);
    const [base64Array, setBase64Array] = useState(Array());
    const [taskDetails, setTaskDetails] = useState(Object());
    const [visitType, setVisitTypeArray] = useState(Array());
    const [scopeData, setScopeDataArray] = useState(Array());
    const [isCheck, setIsCheck] = useState({
        thermometer: false,
        flashLight: false,
        uvLight: false,
        luxMeter: false,
        dataLogger: false
    });
    const isFocused = useIsFocused();

    const [documentArray, setDocumentArray] = useState([{ imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.thermometer, code: 'thermometer', thermoCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.flashLight, code: 'flashLight', flashCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.uvLight, code: 'uvLight', uvCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.luxMeter, code: 'luxMeter', luxCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.dataLogger, code: 'dataLogger', dataCheck: false },
    {}
    ])

    const [otherArray, setOtherArray] = useState(Array());
    const [evidanceDropdown, setEvidanceDropdown] = useState('');

    let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
    let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
    let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
    inspectionDetails.mappingData = mappingData;

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''
    let taskStatus = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskStatus ? JSON.parse(myTasksDraft.selectedTask).TaskStatus : '' : ''

    useEffect(() => {

        let visitTypeData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'INSP_TYPE'), visitTypeArr = [];
        let scopeData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'INSP_SCOPE'), scopeArrayData = [];

        let base64List = RealmController.getbase64ListForTaskId(realm, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
        if (base64List && base64List['0']) {
            setBase64Array(Object.values(base64List))
        }

        for (let indexVisit = 0; indexVisit < visitTypeData.length; indexVisit++) {
            const element = visitTypeData[indexVisit];
            visitTypeArr.push({ type: element.Value, value: element.Value })
        }

        for (let indexScope = 0; indexScope < scopeData.length; indexScope++) {
            const element = scopeData[indexScope];
            scopeArrayData.push({ type: element.Value, value: element.Value })
        }

        let array = [{ type: 'Emirates Id', value: 'Emirates Id' }, { type: 'Other', value: 'Other' }];
        setOtherArray(array);
        setVisitTypeArray(visitTypeArr);
        setScopeDataArray(scopeArrayData);

        // alert(JSON.stringify(visitTypeData) + ',' + JSON.stringify(scopeData))
        let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

        let allowedClickTemp: any = props.allowedClick;

        if (taskType == "Follow-Up" && allowedClickTemp) {

            for (let index = 0; index < documentArray.length; index++) {
                const element = documentArray[index];
                if (element.code == 'thermometer') {
                    element.thermoCheck = myTasksDraft.thermometerCBValue;
                } else if (element.code == 'flashLight') {
                    element.flashCheck = myTasksDraft.flashlightCBValue;
                }
                else if (element.code == 'luxMeter') {
                    element.luxCheck = myTasksDraft.luxmeterCBValue;
                }
                else if (element.code == 'uvLight') {
                    element.uvCheck = myTasksDraft.UVlightCBValue;
                }
                else if (element.code == 'dataLogger') {
                    element.dataCheck = myTasksDraft.dataLoggerCBValue;
                }

                documentArray[index] = element
            }
            setDocumentArray(documentArray);

        }
        else {
            if (taskData && taskData['0']) {
                let taskDetails = taskData['0'];
                let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                taskDetails.mappingData = mappingData;
                setTaskDetails(taskDetails);

                if (!validatePhone(myTasksDraft.mobileNumber)) {
                    setIsPhoneNumberValid(false);
                }
                else {
                    setIsPhoneNumberValid(true);
                }

                if (!validateUsername(myTasksDraft.contactName)) {
                    setContactNameValid(false);
                }
                else {
                    setContactNameValid(true);
                }

                let emirateId = mappingData[0].EmiratesId ? mappingData[0].EmiratesId : myTasksDraft.emiratesId;
                if (!validateEmiratesId(emirateId)) {
                    setIsEmiratesIdValid(false);
                }
                else {
                    setIsEmiratesIdValid(true);
                }
                // let contactName = mappingData.ContactName ? mappingData.ContactName : '';
                // alert('ggfg' + myTasksDraft.contactName)

                // let contactNumber = mappingData.ContactNumber ? mappingData.ContactNumber : '';
                // let emirateId = mappingData.EmiratesId ? mappingData.EmiratesId : '';
                // myTasksDraft.setContactName(contactName);
                // myTasksDraft.setMobileNumber(contactNumber);
                // myTasksDraft.setEmiratesId(emirateId);

                // myTasksDraft.setFlashlightValue(flashlightCBValue);
                // myTasksDraft.setDataLoggerCBValue(dataLoggerCBValue);
                // myTasksDraft.setLuxmeterCBValue(luxmeterCBValue);
                // myTasksDraft.setThermometerCBValue(thermometerCBValue);
                // myTasksDraft.setUVlightCBValue(UVlightCBValue);

                for (let index = 0; index < documentArray.length; index++) {
                    const element = documentArray[index];
                    if (element.code == 'thermometer') {
                        element.thermoCheck = myTasksDraft.thermometerCBValue
                    }
                    else if (element.code == 'flashLight') {
                        element.flashCheck = myTasksDraft.flashlightCBValue;
                    }
                    else if (element.code == 'luxMeter') {
                        element.luxCheck = myTasksDraft.luxmeterCBValue;
                    }
                    else if (element.code == 'uvLight') {
                        element.uvCheck = myTasksDraft.UVlightCBValue;
                    }
                    else if (element.code == 'dataLogger') {
                        element.dataCheck = myTasksDraft.dataLoggerCBValue;
                    }
                    documentArray[index] = element
                }

                setDocumentArray(documentArray);
            }
        }
    }, [isFocused])

    const attachedImageToAlertImageView = async (item: any) => {
        try {
            if (Platform.OS === 'ios') {
                selectImage(item);
            } else if (Platform.OS === 'android') {

                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ]
                ).then((result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        // selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Smart control App',
                    message: 'You want to use the camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    selectImage(item);
                } else {
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const validateNumber = (val: string) => {
        let regex = new RegExp(/^([0-9]+)$/, 'g');
        // alert(regex.test(str))
        if (regex.test(val)) {
            return true;
        }

    }

    const detectText = async (uri: string, base64data: string) => {
        try {
            const options = {
                quality: 0.8,
                base64: true,
                skipProcessing: true,
            };
            // const { uri } = await this.camera.takePictureAsync(options);
            const visionResp = await RNTextDetector.detectFromUri(uri);
            if (visionResp.length) {
                for (let index = 0; index < visionResp.length; index++) {
                    const element = visionResp[index];
                    if (element.text && element.text.includes("784-")) {

                        myTasksDraft.setEmiratesIdAttachment1(base64data)
                        myTasksDraft.setEmiratesIdAttachment1Url(uri)

                        let emiratesId = element.text.substring((element.text.indexOf('-') - 3), (element.text.indexOf('-') + 15))
                        myTasksDraft.setEmiratesId(emiratesId);
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = emiratesId;
                            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                            inspectionDetails.mappingData = mappingData;
                            // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = emiratesId;
                        }
                        else {
                            inspectionDetails.mappingData['0'].EmiratesId = emiratesId;
                        }

                        RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                            backButtonHandlerApp()
                            // ToastAndroid.show('Task updated successfully ', 1000);
                        });
                        //console.log("eID:="+emiratesId)
                        // break;
                    }
                    if (element.text && element.text.includes("Name")) {
                        let name = element.text.replace("Name:", '');
                        myTasksDraft.setContactName(name);
                        validateUsername(name)
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactName = name;
                            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                            inspectionDetails.mappingData = mappingData;
                            // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactName = name;
                        }
                        else {
                            inspectionDetails.mappingData['0'].ContactName = name;
                        }

                        // inspectionDetails.mappingData['0'].ContactName = name;

                        RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                            backButtonHandlerApp()
                            // ToastAndroid.show('Task updated successfully ', 1000);
                        });
                        console.log("eID:=" + name)
                        // break;
                    }
                }
            }
            // console.log('visionResp:' + JSON.stringify(visionResp));
        } catch (e) {
            console.warn(e);
        }
    };

    const getPercentageDed = (data: string) => {
        switch (data) {
            case 'Violation':
                return 20;
            case 'First Warning':
                return 10;
            case 'Final Warning':
                return 10;
            case 'Notice':
                return 5;
            default:
                return 0;
        }
    }

    const selectImage = (item: any) => {
        let options = {
            title: 'Select Image',
            noData: false,
            saveToPhotos: true,
            quality: 0.8,
            cameraType: "back",
            customButtons: [
                { name: 'SmartControl', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        try {
            ImagePicker.launchCamera(options, async (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else if (response.error) {
                    console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    console.log('User tapped custom button: ', response.customButton);
                } else {
                    // console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {

                        if (item == 'evidance1') {
                            myTasksDraft.setEvidanceAttachment1(response.data);
                            myTasksDraft.setEvidanceAttachment1Url(response.uri);
                            base64Array.push({
                                uniqueQuestionId: "evidence_1",
                                buffer: response.data
                            })
                        }
                        else if (item == 'evidance2') {
                            myTasksDraft.setEvidanceAttachment2(response.data);
                            myTasksDraft.setEvidanceAttachment2Url(response.uri);
                            base64Array.push({
                                uniqueQuestionId: "evidence_2",
                                buffer: response.data
                            })
                        }
                        else if (item == 'scan') {

                            detectText(response.uri, response.data)
                        }
                        else if (item == 'licence1') {
                            myTasksDraft.setLicencesAttachment1(response.data);
                            myTasksDraft.setLicencesAttachment1Url(response.uri);
                            base64Array.push({
                                uniqueQuestionId: "licence_1",
                                buffer: response.data
                            })
                        }
                        else if (item == 'licence2') {
                            myTasksDraft.setLicencesAttachment2(response.data)
                            myTasksDraft.setLicencesAttachment2Url(response.uri)
                            base64Array.push({
                                uniqueQuestionId: "licence_2",
                                buffer: response.data
                            })
                        }
                        else if (item == 'emiratesId1') {
                            myTasksDraft.setEmiratesIdAttachment1(response.data)
                            myTasksDraft.setEmiratesIdAttachment1Url(response.uri)
                            base64Array.push({
                                uniqueQuestionId: "emiratesId+1",
                                buffer: response.data
                            })
                        }
                        else if (item == 'emiratesId2') {
                            myTasksDraft.setEmiratesIdAttachment2(response.data)
                            myTasksDraft.setEmiratesIdAttachment2Url(response.uri)
                            base64Array.push({
                                uniqueQuestionId: "emiratesId_2",
                                buffer: response.data
                            })
                        }

                        // let objBase64 = {
                        //     base64List: JSON.stringify(base64Array),
                        //     taskId: (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId)
                        // }
                        // // console.log("ssss" + JSON.stringify(objBase64))
                        // RealmController.addbase64ListInDB(realm, objBase64, () => {

                        // })

                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            debugger
            // alert((error))

        }
    }

    const getGrade = (scorePercentage: any) => {
        let grade = 'E';
        if (scorePercentage >= 90 && scorePercentage <= 100) {
            grade = 'A';
        } else if (scorePercentage >= 75 && scorePercentage < 90) {
            grade = 'B';
        } else if (scorePercentage >= 60 && scorePercentage < 75) {
            grade = 'C';
        } else if (scorePercentage >= 45 && scorePercentage < 60) {
            grade = 'D';
        } else if (scorePercentage < 45) {
            grade = 'E';
        }
        return grade;
    }

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

    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

    const backButtonHandlerApp = () => {

        if (checkListData && checkListData['0']) {
            let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false
            if (completedTask) {
                myTasksDraft.setIsMyTaskClick('CompletedTask')
            }

            let obj = {
                checkList: JSON.stringify(props.modifiedCheckListData),
                taskId: (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId),
                timeStarted: checkListData['0'].timeStarted,
                timeElapsed: checkListData['0'].timeElapsed,
                sign: documantationDraft.fileBuffer,
                overallcomment: myTasksDraft.finalComment,
                contactname: myTasksDraft.contactName,
                contactnumber: myTasksDraft.mobileNumber,
                eid: myTasksDraft.emiratesId,
            }
            debugger;
            // myTasksDraft.setCheckListArray(JSON.stringify(modifiedCheckListData))
            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            });
        }


    }

    const renderData = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {

                    if (item.code == 'flashLight') {
                        documentArray[index].flashCheck = !documentArray[index].flashCheck;

                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].flashlightCBValue = documentArray[index].flashCheck;
                        }
                        else {
                            inspectionDetails.mappingData['0'].flashlightCBValue = documentArray[index].flashCheck;

                        }
                        myTasksDraft.setFlashlightValue(documentArray[index].flashCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'luxMeter') {
                        documentArray[index].luxCheck = !documentArray[index].luxCheck;
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].luxmeterCBValue = documentArray[index].luxCheck;
                        }
                        else {
                            inspectionDetails.mappingData['0'].luxmeterCBValue = documentArray[index].luxCheck;
                        }
                        myTasksDraft.setLuxmeterCBValue(documentArray[index].luxCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'uvLight') {
                        documentArray[index].uvCheck = !documentArray[index].uvCheck;
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].UVlightCBValue = documentArray[index].uvCheck;
                        }
                        else {
                            inspectionDetails.mappingData['0'].UVlightCBValue = documentArray[index].uvCheck;
                        }
                        myTasksDraft.setUVlightCBValue(documentArray[index].uvCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'dataLogger') {
                        documentArray[index].dataCheck = !documentArray[index].dataCheck;
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].dataLoggerCBValue = documentArray[index].dataCheck;
                        }
                        else {
                            inspectionDetails.mappingData['0'].dataLoggerCBValue = documentArray[index].dataCheck;
                        }
                        inspectionDetails.mappingData['0'].dataLoggerCBValue = documentArray[index].dataCheck;
                        myTasksDraft.setDataLoggerCBValue(documentArray[index].dataCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'thermometer') {
                        documentArray[index].thermoCheck = !documentArray[index].thermoCheck;
                        if (myTasksDraft.isMyTaskClick == 'campaign') {

                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].thermometerCBValue = documentArray[index].thermoCheck;
                            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                            inspectionDetails.mappingData = mappingData;
                            // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].thermometerCBValue = documentArray[index].thermoCheck;
                        }
                        else {
                            inspectionDetails.mappingData['0'].thermometerCBValue = documentArray[index].thermoCheck;
                        }
                        // inspectionDetails.mappingData['0'].thermometerCBValue = documentArray[index].thermoCheck;
                        myTasksDraft.setThermometerCBValue(documentArray[index].thermoCheck);
                        setDocumentArray(documentArray);
                    }

                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                        backButtonHandlerApp()
                        // ToastAndroid.show('Task updated successfully ', 1000);
                    });

                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    width: '100%', borderColor: 'transparent', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }}
                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
            >

                <View style={{ flex: 0.8, width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={[styles.text, { fontSize: 12, textAlign: 'right', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

                <View style={{ flex: 0.01 }} />

                <View style={{ flex: 0.2, width: '100%', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        resizeMode={'contain'}
                        source={(item.thermoCheck == true || item.flashCheck == true || item.dataCheck == true || item.luxCheck == true || item.uvCheck == true) ? item.imageCheck : item.image} />
                </View>

            </TouchableOpacity>

        )
    }

    return (

        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={{ flex: 1.2, justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 3 }}>

                <FlatList
                    data={documentArray}
                    contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                    columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                    initialNumToRender={5}
                    renderItem={({ item, index }) => {
                        return (
                            renderData(item, index)
                        )
                    }}
                    ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.03, width: WIDTH * 0.03 }} />)}
                    numColumns={3}
                />

            </View>

            <View style={styles.space} />

            <ScrollView style={{ height: HEIGHT * 0.3 }}>

                <View style={{ flex: 3.3, justifyContent: 'center' }}>

                    <View style={styles.space} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.contactName} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <View
                                style={{
                                    height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }} >
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
                                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactName = val;
                                            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                            inspectionDetails.mappingData = mappingData;
                                            // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactName = val;
                                        }
                                        else {
                                            inspectionDetails.mappingData['0'].ContactName = val;
                                        }
                                        myTasksDraft.setContactName(val);

                                        RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                                            backButtonHandlerApp()
                                            // ToastAndroid.show('Task updated successfully ', 1000);
                                        });
                                    }}
                                />

                            </View>
                        </View>

                        {/* {
                            isContactNameIsValid ?
                                <Text style={{ fontSize: 12, color: 'red' }}>{'Please enter valid Contact Name'}</Text>
                                : null
                        } */}
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
                                }} >
                                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>

                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        maxLength={12}
                                        editable={(taskStatus == 'Completed') ? false : true}
                                        keyboardType={'number-pad'}
                                        value={myTasksDraft.mobileNumber}
                                        onChange={(val: string) => {
                                            if (!validatePhone(val)) {
                                                setIsPhoneNumberValid(false);
                                            }
                                            else {
                                                setIsPhoneNumberValid(true);
                                            }
                                            if (val == '') {
                                                myTasksDraft.setMobileNumber(val);
                                                if (myTasksDraft.isMyTaskClick == 'campaign') {

                                                    let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                    mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactNumber = val;
                                                    myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                    inspectionDetails.mappingData = mappingData;
                                                    // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactNumber = val;
                                                }
                                                else {
                                                    inspectionDetails.mappingData['0'].ContactNumber = val;
                                                }
                                            }
                                            else if (validateNumber(val)) {
                                                myTasksDraft.setMobileNumber(val);
                                                if (myTasksDraft.isMyTaskClick == 'campaign') {

                                                    let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                    mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactNumber = val;
                                                    myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                    inspectionDetails.mappingData = mappingData;
                                                    // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].ContactNumber = val;
                                                }
                                                else {
                                                    inspectionDetails.mappingData['0'].ContactNumber = val;
                                                }
                                            }

                                            // inspectionDetails.mappingData['0'].ContactNumber = val;
                                            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                                                backButtonHandlerApp()
                                                // ToastAndroid.show('Task updated successfully ', 1000);
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                            {/* {
                                isPhoneNumberNotValid ?
                                    <Text style={{ fontSize: 12, color: 'red' }}>{'Please enter valid Contact Number'}</Text>
                                    : null
                            } */}
                        </View>

                    </View>

                    <View style={styles.space} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>

                            <TouchableOpacity
                                onPress={() => {
                                    dropdownRef3 && dropdownRef3.current.focus();
                                }}
                                disabled={(taskStatus == 'Completed') ? true : false}
                                style={{
                                    height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}>

                                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Dropdown
                                        ref={dropdownRef3}
                                        value={myTasksDraft.otherValue}
                                        disabled={(taskStatus == 'Completed') ? true : false}
                                        onChangeText={(val: string) => {
                                            // if (val.toLowerCase() == 'other') {
                                            //     myTasksDraft.setEmiratesId('');
                                            // }
                                            // myTasksDraft.setOtherValue(val);
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

                            {/* <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'center' : 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text> */}

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
                                        editable={(taskStatus == 'Completed') ? false : true}
                                        maxLength={20}
                                        value={myTasksDraft.emiratesId}
                                        onChange={(val: string) => {
                                            // alert(validateEmiratesId(val));
                                            if (evidanceDropdown.toLowerCase() == 'other') {
                                                if (val == '') {
                                                    myTasksDraft.setEmiratesId(val);
                                                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                                                        let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                        mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                        myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                        inspectionDetails.mappingData = mappingData;
                                                        // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                    }
                                                    else {
                                                        inspectionDetails.mappingData['0'].EmiratesId = val;
                                                    }
                                                }
                                                else if (validateNumber(val)) {
                                                    myTasksDraft.setEmiratesId(val);
                                                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                                                        let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                        mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                        myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                        inspectionDetails.mappingData = mappingData;
                                                        // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                    }
                                                    else {
                                                        inspectionDetails.mappingData['0'].EmiratesId = val;
                                                    }
                                                }

                                            }
                                            else {
                                                if (!validateEmiratesId(val)) {
                                                    setIsEmiratesIdValid(false);
                                                }
                                                else {
                                                    setIsEmiratesIdValid(true);
                                                }

                                                if (val == '') {
                                                    myTasksDraft.setEmiratesId(val);
                                                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                                                        let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                        mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                        myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                        inspectionDetails.mappingData = mappingData;
                                                        // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                    }
                                                    else {
                                                        inspectionDetails.mappingData['0'].EmiratesId = val;
                                                    }
                                                }
                                                else if (validateNumber(val)) {
                                                    myTasksDraft.setEmiratesId(val);
                                                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                                                        let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                        mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                        myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                        inspectionDetails.mappingData = mappingData;
                                                        // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].EmiratesId = val;
                                                    }
                                                    else {
                                                        inspectionDetails.mappingData['0'].EmiratesId = val;
                                                    }
                                                }
                                            }

                                            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                                                backButtonHandlerApp()
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
                                            onPress={() => attachedImageToAlertImageView("scan")}
                                            disabled={(taskStatus == 'Completed') ? true : false}
                                            style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                source={require("./../assets/images/scan.png")}
                                                // style={{ transform: [{ rotate: '90deg' }] }}
                                                resizeMode={"contain"} />
                                        </TouchableOpacity>
                                }
                            </View>
                            {/* {
                                evidanceDropdown.toLowerCase() == 'other' ?
                                    null
                                    :
                                    isEmiratesIdValid ?
                                        <Text style={{ fontSize: 12, color: 'red' }}>{'Please enter valid Emirates Id'}</Text>
                                        : null
                            } */}
                        </View>

                    </View>

                    {/* //ChangeHEre */}
                    {/* <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={{ flex: 0.4, justifyContent: 'center' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    dropdownRef3 && dropdownRef3.current.focus();
                                }}
                                style={{
                                    height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}>

                                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Dropdown
                                        ref={dropdownRef3}
                                        value={myTasksDraft.otherValue}
                                        onChangeText={(val: string) => {
                                            if (val.toLowerCase() == 'other') {
                                                myTasksDraft.setEmiratesId('');
                                            }
                                            myTasksDraft.setOtherValue(val);
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


                        {myTasksDraft.otherValue.toLowerCase() == 'other' ?
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    maxLength={12}
                                    editable={(taskStatus == 'Completed') ? false : true}
                                    keyboardType={'number-pad'}
                                    value={myTasksDraft.otherTextValue}
                                    onChange={(val: string) => {
                                        myTasksDraft.setOtherTextValue(val);
                                    }}
                                />
                            </View>
                            : null
                        }

                    </View> */}

                </View>

                <View style={{ flex: .2 }} />

                {taskType.toLowerCase() == 'monitor inspector performance' ?

                    <View style={{ flex: 2.5, justifyContent: 'center' }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.visitType} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef1 && dropdownRef1.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef1}
                                            value={myTasksDraft.visitType}
                                            onChangeText={(val: string) => {
                                                myTasksDraft.setVisitType(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={visitType}
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

                        </View>


                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.scope} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef2 && dropdownRef2.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef2}
                                            value={myTasksDraft.scope}
                                            onChangeText={(val: string) => {
                                                myTasksDraft.setScope(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={scopeData}
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

                        </View>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>

                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.noOfVisits} </Text>

                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <View
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <TextInputComponent
                                            placeholder={''}
                                            style={{
                                                height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }}
                                            keyboardType={'number-pad'}
                                            maxLength={15}
                                            value={myTasksDraft.noOfVisits.toString()}
                                            onChange={(val: string) => {
                                                // alert(validateEmiratesId(val));
                                                myTasksDraft.setNoOfVisits(val);
                                            }}
                                        />
                                    </View>
                                </View>

                            </View>

                        </View>



                    </View>

                    :

                    <View style={{ flex: 3.2, justifyContent: 'center' }}>

                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                                <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.evidence} </Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                        <Image
                                            source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                    <View style={{ flex: 0.2 }} />
                                </View>

                            </View>

                            <View style={{ flex: 0.5 }} />

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        attachedImageToAlertImageView('evidance1')
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                                    }}>

                                    <Image
                                        source={myTasksDraft.evidanceAttachment1Url != '' ?
                                            { uri: myTasksDraft.evidanceAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 32, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={myTasksDraft.evidanceAttachment1Url != '' ? "stretch" : "contain"} />

                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: 0.8 }} />

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        attachedImageToAlertImageView('evidance2')
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                                    }}>

                                    <Image
                                        source={myTasksDraft.evidanceAttachment2Url != '' ?
                                            { uri: myTasksDraft.evidanceAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={myTasksDraft.evidanceAttachment2Url != '' ? "stretch" : "contain"} />

                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.3 }} />

                        </View>

                        <View style={{ height: 10 }} />

                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                                <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.license} </Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                        <Image
                                            source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                    <View style={{ flex: 0.2 }} />
                                </View>

                            </View>

                            <View style={{ flex: 0.5 }} />

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        attachedImageToAlertImageView('licence1')
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                                    }}>

                                    <Image
                                        source={myTasksDraft.licencesAttachment1Url != '' ?
                                            { uri: myTasksDraft.licencesAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={myTasksDraft.licencesAttachment1Url != '' ? "stretch" : "contain"} />

                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: 0.8 }} />

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        attachedImageToAlertImageView('licence2')
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                                    }}>

                                    <Image
                                        source={myTasksDraft.licencesAttachment2Url != '' ?
                                            { uri: myTasksDraft.licencesAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={myTasksDraft.licencesAttachment2Url != '' ? "stretch" : "contain"} />
                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: 0.3 }} />

                        </View>

                        <View style={{ height: 10 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                                <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                                    <View style={{ flex: 2 }}>
                                        <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text>
                                    </View>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                        <Image
                                            source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                    <View style={{ flex: 0.2 }} />
                                </View>

                            </View>

                            <View style={{ flex: 0.5 }} />

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        attachedImageToAlertImageView('emiratesId1')
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                                    }}>

                                    <Image
                                        source={myTasksDraft.EmiratesIdAttachment1Url != '' ?
                                            { uri: myTasksDraft.EmiratesIdAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={myTasksDraft.EmiratesIdAttachment1Url != '' ? "stretch" : "contain"} />

                                </TouchableOpacity>

                            </View>
                            <View style={{ flex: 0.8 }} />

                            <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                                <TouchableOpacity
                                    onPress={() => {
                                        attachedImageToAlertImageView('emiratesId2')
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                                    }}>

                                    <Image
                                        source={myTasksDraft.EmiratesIdAttachment2Url != '' ?
                                            { uri: myTasksDraft.EmiratesIdAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                        resizeMode={myTasksDraft.EmiratesIdAttachment2Url != '' ? "stretch" : "contain"} />

                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: 0.3 }} />
                        </View>

                        <View style={{ height: 10 }} />
                        {((taskType.toLowerCase() == 'direct inspection') || (taskType.toLowerCase() == 'routine inspection') && !myTasksDraft.historyChecklist) ?
                            <View style={{ height: HEIGHT * 0.25, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ width: '45%' }}>

                                    {/* <View style={styles.textContainer}> */}
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.beforeDeduction} </Text>
                                    {/* </View> */}

                                    <View style={{ height: 5 }} />


                                    <View style={styles.space} />

                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.totalScore} :{myTasksDraft.totalScore}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />
                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.percentage} :{myTasksDraft.percentage}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />
                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.grade} :{myTasksDraft.grade != '' ? myTasksDraft.grade : getGrade(myTasksDraft.percentage)}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />
                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                Deduction Reason :{myTasksDraft.result}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />

                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                Deduction {getPercentageDed(myTasksDraft.result)}%
                                            </Text>

                                        </View>

                                    </View>


                                </View>

                                <View style={{ width: '2.5%' }} />

                                <View style={{ width: '45%' }}>

                                    {/* <View style={styles.textContainer}> */}
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.afterDeduction} </Text>
                                    {/* </View> */}

                                    <View style={{ height: 5 }} />


                                    <View style={styles.space} />

                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.totalScore} :{myTasksDraft.totalScore}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />
                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.percentage} :{(parseFloat(myTasksDraft.percentage) - getPercentageDed(myTasksDraft.result)).toFixed(2)}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />
                                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.grade} :{getGrade((parseFloat(myTasksDraft.percentage) - getPercentageDed(myTasksDraft.result)).toFixed(2))}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />
                                    <View style={{ flex: 1.2, height: HEIGHT * 0.08, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                        <View
                                            style={{
                                                height: '100%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                            }} >
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>
                                                {Strings[context.isArabic ? 'ar' : 'en'].startInspection.finalInspectionResult} :{myTasksDraft.result}
                                            </Text>

                                        </View>

                                    </View>

                                    <View style={styles.space} />

                                    <View style={{ flex: 0.8, height: HEIGHT * 0.04, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                    </View>

                                </View>

                            </View>
                            :
                            null
                        }


                    </View>

                }
            </ScrollView>
            <View style={{ flex: .1 }} />

            {myTasksDraft.isMyTaskClick == 'CompletedTask' ?
                <View style={{ flex: 0.6 }} >
                    {
                        taskStatus == 'Failed' ?
                            <ButtonComponent
                                delayPressOut={4000}
                                style={{
                                    height: '80%', width: '40%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                buttonClick={() => {
                                    if (validateUsername(myTasksDraft.contactName)) {
                                        Alert.alert("", 'Please enter valid Contact Name')
                                    }
                                    else if (isPhoneNumberNotValid) {
                                        Alert.alert("", 'Please enter valid Contact Number')
                                    }
                                    else if (isEmiratesIdValid && (evidanceDropdown.toLowerCase() != 'other')) {
                                        Alert.alert("", 'Please enter valid Emirates Id')
                                    }
                                    else {

                                        try {
                                            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

                                            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
                                            let mappingData = inspectionDetails.mappingData && typeof (inspectionDetails.mappingData) == 'string' ? JSON.parse(inspectionDetails.mappingData) : inspectionDetails.mappingData;
                                            console.log(JSON.stringify(mappingData))
                                            if (mappingData[0] && mappingData[0].reqResponseArr) {
                                                let reqResponseArr = JSON.parse(mappingData[0].reqResponseArr)
                                                // alert((reqResponseArr[0].TaskSubmitApiResponse && reqResponseArr[0].TaskSubmitApiResponse.Status && (reqResponseArr[0].TaskSubmitApiResponse.Status == 'Success')))
                                                myTasksDraft.setTaskSubmited((reqResponseArr[0].TaskSubmitApiResponse && reqResponseArr[0].TaskSubmitApiResponse.Status && (reqResponseArr[0].TaskSubmitApiResponse.Status == 'Success')) ? true : false)
                                            }
                                            // let path = DownloadDirectoryPath + "/smartcontrol/attachments/1-6697849079_AttachmentPayload.txt";
                                            let path = DownloadDirectoryPath + "/smartcontrol/attachments/" + myTasksDraft.taskId + "_AttachmentPayload.txt";
                                            let attachments = Array()
                                            readFile(path, 'utf8').then(async (success: any) => {
                                                attachments = JSON.parse(success)
                                                console.log("success" + JSON.stringify(success));
                                            })
                                            let tempFailedAttachment = attachments.filter((item: any) => item.getQuestionarieAttachmentResponse.Status != "Success")
                                            if (tempFailedAttachment.length) {
                                                myTasksDraft.setAttachmentSubmittedFailed(true);
                                                let normalAttachment = Array(), voilationAttachment = Array();
                                                for (let index = 0; index < tempFailedAttachment.length; index++) {
                                                    const element = tempFailedAttachment[index].payloadAttachment;
                                                    if (element.ListOfViolationAttachments) {
                                                        voilationAttachment.push(element)
                                                    }
                                                    else {
                                                        normalAttachment.push(element)
                                                    }
                                                }

                                                if (normalAttachment.length) {
                                                    myTasksDraft.setFailedAttachmentArray(JSON.stringify(normalAttachment))
                                                }
                                                if (voilationAttachment.length) {
                                                    myTasksDraft.setVoilationFailedAttachmentArray(JSON.stringify(voilationAttachment))
                                                }
                                            }
                                            props.submitButtonPress();
                                        }
                                        catch (error) {
                                            props.submitButtonPress();
                                        }
                                    }
                                }}
                                disabled={taskStatus == 'Failed' ? false : true}
                                buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                            />
                            :
                            null
                    }

                </View>
                :

                <View style={{ flex: 1, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    {taskType.toLowerCase().includes('noc') ?

                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            {licenseDraft.isScoreN == 'N' ?
                                <ButtonComponent
                                    delayPressOut={4000}
                                    style={{
                                        height: '60%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    buttonClick={() => {
                                        licenseDraft.setIsRejectBtnClick(true);

                                        if (validateUsername(myTasksDraft.contactName)) {
                                            Alert.alert("", 'Please enter valid Contact Name')
                                        }
                                        else if (isPhoneNumberNotValid) {
                                            Alert.alert("", 'Please enter valid Contact Number')
                                        }
                                        else if (isEmiratesIdValid && (evidanceDropdown.toLowerCase() != 'other')) {
                                            Alert.alert("", 'Please enter valid Emirates Id')
                                        }
                                        else {
                                            props.submitButtonPress();
                                        }
                                    }}
                                    buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.reject}
                                />
                                :

                                null
                            }

                            <View style={{ flex: 0.1 }} />

                            <ButtonComponent
                                style={{
                                    height: '60%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                                    alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                disabled={((taskStatus == 'Completed')) ? true : false}
                                buttonClick={() => {

                                    if (validateUsername(myTasksDraft.contactName)) {
                                        Alert.alert("", 'Please enter valid Contact Name')
                                    }
                                    else if (isPhoneNumberNotValid) {
                                        Alert.alert("", 'Please enter valid Contact Number')
                                    }
                                    else if (isEmiratesIdValid && (evidanceDropdown.toLowerCase() != 'other')) {
                                        Alert.alert("", 'Please enter valid Emirates Id')
                                    }
                                    else {
                                        props.submitButtonPress();
                                    }
                                }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit)}
                            />

                            <View style={{ flex: 0.2 }} />
                        </View>

                        :
                        taskType.toLowerCase() == 'direct inspection' ?

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <ButtonComponent
                                    style={{
                                        height: '60%', width: '45%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    disabled={(taskStatus == 'Completed') ? true : false}
                                    delayPressOut={4000}
                                    buttonClick={() => {
                                        if (validateUsername(myTasksDraft.contactName)) {
                                            Alert.alert("", 'Please enter valid Contact Name')
                                        }
                                        else if (isPhoneNumberNotValid) {
                                            Alert.alert("", 'Please enter valid Contact Number')
                                        }
                                        else if (isEmiratesIdValid && (evidanceDropdown.toLowerCase() != 'other')) {
                                            Alert.alert("", 'Please enter valid Emirates Id')
                                        }
                                        else {
                                            props.submitButtonPress('withoutChecklist');
                                        }
                                    }}
                                    buttonText={Strings[context.isArabic ? 'ar' : 'en'].action.submitWC}
                                />

                                <View style={{ flex: 0.1 }} />

                                <ButtonComponent
                                    style={{
                                        height: '60%', width: '40%', backgroundColor: fontColor.ButtonBoxColor,
                                        alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    delayPressOut={4000}
                                    buttonClick={() => {

                                        if (validateUsername(myTasksDraft.contactName)) {
                                            Alert.alert("", 'Please enter valid Contact Name')
                                        }
                                        else if (isPhoneNumberNotValid) {
                                            Alert.alert("", 'Please enter valid Contact Number')
                                        }
                                        else if (isEmiratesIdValid && (evidanceDropdown.toLowerCase() != 'other')) {
                                            Alert.alert("", 'Please enter valid Emirates Id')
                                        }
                                        else {
                                            props.submitButtonPress();
                                        }

                                    }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit)}
                                />

                                <View style={{ flex: 0.2 }} />

                            </View>
                            :
                            <ButtonComponent
                                style={{
                                    height: '80%', width: '40%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                delayPressOut={4000}
                                buttonClick={() => {
                                    if (validateUsername(myTasksDraft.contactName)) {
                                        Alert.alert("", 'Please enter valid Contact Name')
                                    }
                                    else if (isPhoneNumberNotValid) {
                                        Alert.alert("", 'Please enter valid Contact Number')
                                    }
                                    else if (isEmiratesIdValid && (evidanceDropdown.toLowerCase() != 'other')) {
                                        Alert.alert("", 'Please enter valid Emirates Id')
                                    }
                                    else {
                                        props.submitButtonPress();
                                    }
                                }}
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                            />
                    }

                </View>
            }

        </View>
    )
}

const styles = StyleSheet.create({
    containter: {
        flex: 1

    },
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

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
});


export default observer(SubmissionComponent);
