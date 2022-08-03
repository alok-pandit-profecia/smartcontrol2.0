import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, Modal, ImageBackground, PermissionsAndroid, TouchableOpacity, AppState, Alert, Dimensions, FlatList, ToastAndroid, DatePickerAndroid, Linking, TextInput } from "react-native";
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor, AppVersion } from '../config/config';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import LoginDetailsSchema from '../database/LoginSchema';
import LocationPermissionModel from '../components/LocationPermissionModel';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import Spinner from 'react-native-loading-spinner-overlay';
import ModalComponent from './../components/ModalComponent/ModalComponent';
import ModalComponentSamplingReport from './../components/ModalComponentSamplingReport/ModalComponent';
import TaskSchema from '../database/TaskSchema';
import Dropdown from './../components/dropdown';
import EstablishmentSchema from '../database/EstablishmentSchema';
import AlertComponentForFoodAlert from '../components/AlertComponentForFoodAlert';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
import { useIsFocused } from '@react-navigation/native'
import axios from 'axios';
import InspectionDetails from './InspectionDetails';
import DocumentPicker from 'react-native-document-picker';
import Geolocation from 'react-native-geolocation-service';
import RNSettings from 'react-native-settings';
import AndroidOpenSettings from 'react-native-android-open-settings'
import CheckListSchema from '../database/CheckListSchema';
import SrDetailsSchema from '../database/SrDetailsSchema';
import * as Animatable from 'react-native-animatable';
import TextComponent from './../components/TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const { Popover } = renderers
let moment = require('moment');
let realm = RealmController.getRealmInstance();

var count: any = 0;
var listOfEst: any = []

const EstablishmentDetails = (props: any) => {

    const context: any = useContext(Context);
    const refrance = useRef();
    let dropdownRef2 = useRef();
    const isFocused = useIsFocused();
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [licenseNum, setLicenseNum] = useState(Object());
    const [isAcknowledge, setIsAcknowledge] = useState(Boolean);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [issSampleReportModalVisible, setIsSampleReportModalVisible] = useState(false);
    const [isgoLiveLoading, setIsgoLiveLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [inspectorName, setInspectorName] = useState('');
    const [isNeverAskLocationPermissionAlert, setNeverAskLocationPermissionAlert] = useState(false);
    const [showDeleteClecklist, setShowDeleteClecklist] = useState(false);
    const [password, setPassword] = useState('');

    const [masterPassword, setMasterPassword] = useState('smartcontrol@abudhabi#0000');
    const [showFoodAlert, setShowFoodAlert] = useState(false);

    const [navigateToStartInspection, setNavigateToStartInspection] = useState(false);
    const [listOfAdfcaAccount, setListOfAdfcaAccount] = useState(Object());
    const [listOfEstArray, setListOfEstArray] = useState(Array());
    const [listOfEstNames, setListOfEstNames] = useState(Array());

    const mapStore = (rootStore: RootStoreModel) => ({
        establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, actionDraft: rootStore.actionModel,
        licenseDraft: rootStore.licenseMyTaskModel, TemporaryPermitsServiceRequestDraft: rootStore.temporaryPermitsServiceRequestModel, efstDraft: rootStore.eftstModel, foodalertDraft: rootStore.foodAlertsModel, bottomBarDraft: rootStore.bottomBarModel
    })
    const { establishmentDraft, myTasksDraft, licenseDraft, efstDraft, foodalertDraft, actionDraft, TemporaryPermitsServiceRequestDraft } = useInject(mapStore)
    let foodAlertResponse = foodalertDraft.alertResponse != '' ? JSON.parse(foodalertDraft.alertResponse) : [];

    const [isClick, setIsClick] = useState({
        estClick: false,
        inspClick: true
    });

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''
    let taskStatus = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskStatus ? JSON.parse(myTasksDraft.selectedTask).TaskStatus : '' : ''

    useEffect(() => {
        if (inspectionDetails.TaskId) {
            myTasksDraft.setState('done');
        }

        console.log('TaskStatus ::' + taskStatus);
        // else{
        //     myTasksDraft.setState('pending')
        // }
    }, [inspectionDetails])

    useEffect(() => {

        myTasksDraft.setCreateAdhoc(false);
        myTasksDraft.setState('pending')
        setNavigateToStartInspection(false)
        let obj = RealmController.getLoginData(realm, LoginDetailsSchema.name);
        if (obj) {
            let detailsObj = JSON.parse(obj['0'].loginResponse);
            let userName = obj['0'] && (obj['0'].username != '') ? obj['0'].username : 'Guest';
            let inspectorName = obj['0'] && obj['0'].loginResponse && (detailsObj.InspectorName != '') ? detailsObj.InspectorName : 'Guest';
            setUserName(userName);
            setInspectorName(inspectorName);
        }
        myTasksDraft.setState('pending');
        const flag = props.route ? props.route.params ? props.route.params.flag : null : null;
        if (flag && flag != '' && flag != null) {
            if (flag == 'estClick') {
                myTasksDraft.setState('done');
                setIsClick(prevState => {
                    return { ...prevState, estClick: true, inspClick: false }
                });
            }
            else {
                myTasksDraft.setState('done');

                setIsClick(prevState => {
                    return { ...prevState, estClick: false, inspClick: true }
                });
            }

        }
        else {
            myTasksDraft.setState('done');
            setIsClick(prevState => {
                return { ...prevState, estClick: false, inspClick: true }
            });
        }
    }, [isFocused])

    let mergedFollowUpsArray = RealmController.getMergeTask(realm);
    mergedFollowUpsArray = mergedFollowUpsArray['0'] ? Object.values(mergedFollowUpsArray) : Array()

    useEffect(() => {

        try {
            if (navigateToStartInspection) {
                //console.log('sssss')
                if (inspectionDetails.TaskType == 'Follow-Up') {
                    // NavigationService.navigate('FollowUpStartInspection');
                    let mergeTask = mergedFollowUpsArray.filter((itemMerg: any) => itemMerg.FollowupId == inspectionDetails.TaskId)
                    if (mergeTask.length) {
                        Alert.alert("", "This Task is merged with Task :- " + mergeTask[0].TaskId)
                    }
                    else {
                        myTasksDraft.setLoadingState('Fetching Checklist')
                        NavigationService.navigate('StartInspection', { 'inspectionDetails': inspectionDetails });
                    }
                    // myTasksDraft.callToGetQuestionaries(context.isArabic,myTasksDraft.taskId)
                }
                else if (inspectionDetails.TaskType.toLowerCase() == 'closure inspection') {
                    NavigationService.navigate('ClosureInspection', { tradeName: establishmentDraft.establishmentName, address: establishmentDraft.address, licenseNum: establishmentDraft.licenseNumber });
                }
                else if ((inspectionDetails.TaskType.toLowerCase() == 'supervisory inspections' || inspectionDetails.TaskType.toLowerCase() == 'monitor inspector performance') && (inspectionDetails.TaskStatus.toLowerCase() != 'inprogress')) {
                    if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
                        ToastAndroid.show('No Checklist Available', 1000);
                    }
                    else {
                        NavigationService.navigate('AdhocEstablishmentAndVehical');
                    }
                }
                else {
                    myTasksDraft.setCheckListArray('');
                    if ((((inspectionDetails.TaskType.toString().toLowerCase() == 'routine inspection') || (inspectionDetails.TaskType.toString().toLowerCase() == 'direct inspection')) && (inspectionDetails.Description == '' || inspectionDetails.Description == null))) {
                        ToastAndroid.show('No Checklist Available', 1000);
                    }
                    else if (myTasksDraft.noCheckList === 'NocheckListAvailable') {
                        ToastAndroid.show('No Checklist Available', 1000);
                    }
                    else {
                        debugger
                        // if ((((inspectionDetails.TaskType.toString().toLowerCase() == 'routine inspection') || (inspectionDetails.TaskType.toString().toLowerCase() == 'direct inspection')))) {
                        if ((((inspectionDetails.TaskType.toString().toLowerCase() == 'routine inspection')))) {
                            myTasksDraft.setEfstUpdate(false)
                            myTasksDraft.setCheckListArray('')
                            // let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                            // if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData['0'] && tempInspectionDetail.mappingData['0'].EFSTFlag) {
                            myTasksDraft.setLoadingState('Fetching Checklist')
                            NavigationService.navigate('StartInspection')
                            // }
                            // else {
                            //     setIsClick(prevState => {
                            //         return { ...prevState, estClick: true, inspClick: false }
                            //     });
                            //     Alert.alert("", context.isArabic ? ` ارجو تحديث تدريب العاملين` : "Please update EFST")
                            //     setNavigateToStartInspection(false)
                            // }
                        }
                        else if (inspectionDetails.TaskType == 'Complaints') {
                            myTasksDraft.setCheckListArray('')
                            if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                                myTasksDraft.setLoadingState('Fetching Checklist')
                                NavigationService.navigate('StartInspection')
                            }
                            else {
                                ToastAndroid.show('No Checklist Available', 1000);
                            }
                        }
                        else {
                            myTasksDraft.setLoadingState('Fetching Checklist')
                            NavigationService.navigate('StartInspection')
                        }
                    }
                }
            }

        } catch (error) {

        }
    }, [navigateToStartInspection])

    useEffect(() => {
        // let arr = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        // alert( JSON.stringify(myTasksDraft.selectedTask));
        // const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        // setInspectionDetails(JSON.parse(myTasksDraft.selectedTask));

        count = 0;
        listOfEst = [];

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {}
        debugger

        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        setInspectionDetails(inspectionDetails);
        myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails));

        debugger;
        let taskData = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {}
        if ((taskData.isAcknowledge) || (taskData.TaskStatus && (taskData.TaskStatus.toLowerCase() == 'acknowledged'))) {
            setIsAcknowledge(true);
        }
        else {
            setIsAcknowledge(false)
        }
        // Alert.alert('isAcknowledge task' + taskData.isAcknowledge+taskData.TaskStatus);

        const licenseNum = props.route && props.route.params && props.route.params.inspectionDetails ? props.route.params.inspectionDetails.LicenseCode : '';
        //console.log("licemseNumber", licenseNum);
        setLicenseNum(licenseNum);

        if (taskType == "Campaign Inspection") {
            let listOfAdfcaAccountThinBc = (typeof props.route.params.inspectionDetails.ListOfAdfcaAccountThinBc == "object" ? props.route.params.inspectionDetails.ListOfAdfcaAccountThinBc : JSON.parse(props.route.params.inspectionDetails.ListOfAdfcaAccountThinBc))
            setListOfAdfcaAccount(listOfAdfcaAccountThinBc)
            establishmentDraft.setEstablishmentDataBlank()
        }

        if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
            if (inspectionDetails.TaskType.toLowerCase() == 'sampling') {
                inspectionDetails.samplingFlag = true;
                setInspectionDetails(inspectionDetails)
                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
            }
            else if (inspectionDetails.TaskType.toLowerCase() == 'condemnation') {
                inspectionDetails.condemnationFlag = true;
                setInspectionDetails(inspectionDetails)
                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
            }
            else if (inspectionDetails.TaskType.toLowerCase() == 'detention') {
                inspectionDetails.detentionFlag = true;
                setInspectionDetails(inspectionDetails)
                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
            }

        }
        return () => {
            establishmentDraft.setEstablishmentDataBlank()
            myTasksDraft.setCheckListArray('');
        }
    }, []);

    const closeAlert = () => {
        setIsModalVisible(false);
    }

    const exportPDF = () => {
        setIsModalVisible(false);
    }

    const inspectionHistoryArray = [
        { image: require('./../assets/images/startInspection/documentation/Condemnation.png'), title: Strings[context.isArabic ? 'ar' : 'en'].history.stopSync, code: 'stopSync' },
        { image: require('./../assets/images/startInspection/documentation/Sampling.png'), title: Strings[context.isArabic ? 'ar' : 'en'].history.reportTask, code: 'reportTask' },
        { image: require('./../assets/images/startInspection/documentation/Detention.png'), title: Strings[context.isArabic ? 'ar' : 'en'].history.printReport, code: 'printReport' },
        { image: require('./../assets/images/startInspection/documentation/OnHold.png'), title: Strings[context.isArabic ? 'ar' : 'en'].history.viewChecklist, code: 'viewChecklist' },
    ];

    const callToAccountSync = (i: any) => {

        if (listOfEstArray.length < 1 && listOfAdfcaAccount && listOfAdfcaAccount.Establishment && listOfAdfcaAccount.Establishment.length > 0) {

            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, listOfAdfcaAccount.Establishment[i].Alias);
            if (temp && temp[0]) {
                listOfEst.push(temp[0])

                count = count + 1
                if (listOfAdfcaAccount.Establishment.length - 1 >= count) {
                    callToAccountSync(count);
                }
                else {
                    let tempArray: any = [];
                    for (let i = 0; i < listOfEst.length; i++) {
                        let obj: any = {};
                        obj.type = i
                        obj.value = listOfEst[i].EnglishName
                        tempArray.push(obj)
                    }
                    setListOfEstNames(tempArray)
                    setListOfEstArray(listOfEst)

                }
            }
            // else {
            //     let licenseNumber = listOfAdfcaAccount.Establishment[i].Name
            //     if (licenseNumber == null) {
            //         let templicenseNo = listOfAdfcaAccount.Establishment[i].FinAcctCurrentBank
            //         templicenseNo = templicenseNo.split('-')
            //         licenseNumber = templicenseNo[1]
            //     }

            //     establishmentDraft.callToAccountSyncService(licenseNumber, context.isArabic,true);
            // }


        }

    }

    const setEstablishmentValues = (i: any) => {

        let temp = listOfEstArray[i]

        // //console.log("temp: ", temp)
        if (temp && temp[0]) {
            let addressObj = temp[0].addressObj && typeof (temp[0].addressObj) == 'string' ? JSON.parse(temp[0].addressObj) : []
            let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

            establishmentDraft.setAddress(address)
            // establishmentDraft.setAddress(temp.PrimaryAddressId ? temp.PrimaryAddressId : '')
            establishmentDraft.setArea(temp.Area ? temp.Area : '')
            establishmentDraft.setSector(temp.Sector ? temp.Sector : '')
            establishmentDraft.setContactDetails(temp.Mobile ? temp.Mobile : '')
            establishmentDraft.setEstablishmentName(context.isArabic ? temp.ArabicName ? temp.ArabicName : '' : temp.EnglishName ? temp.EnglishName : '')
            establishmentDraft.setLicenseEndDate(temp.LicenseExpiryDate ? temp.LicenseExpiryDate : '')
            establishmentDraft.setLicenseStartDate(temp.LicenseRegDate ? temp.LicenseRegDate : '')
            establishmentDraft.setLicenseNumber(temp.LicenseNumber ? temp.LicenseNumber : '')
            establishmentDraft.setLicenseSource(temp.LicenseSource ? temp.LicenseSource : '')

            myTasksDraft.setTaskId(temp.taskId)
            let object = RealmController.getTaskDetails(realm, TaskSchema.name, temp.taskId);
            if (object && object['0']) {
                let taskDetails = object['0']
                myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))

            } else {
                Alert.alert("No checklist Available")
            }
        }
        else {
            debugger;
            // establishmentDraft.callToAccountSyncService(item.LicenseNumber, context.isArabic,true);
        }
    }

    useEffect(() => {
        debugger;
        if (myTasksDraft.acknowledgeState == 'acknowledgeSuccess') {
            setIsAcknowledge(true);
            myTasksDraft.setAcknowledgeState('done')
        }
    }, [myTasksDraft.acknowledgeState == 'acknowledgeSuccess']);

    const fetchEfstData = () => {
        let licenseCode = licenseNum;
        // //console.log("licenseCode", licenseCode);
        efstDraft.callToFetchEfstDataService(licenseCode);
        NavigationService.navigate('efstDetails', { 'licenseNum': licenseCode });
    }

    const goLiveClicked = () => {
        let roomId = '';
        setIsgoLiveLoading(true);

        let ts = (new Date).getTime();

        if (inspectionDetails.TaskId.indexOf("T_") != -1) {
            roomId = inspectionDetails.TaskId.split('_');
        }
        else {
            roomId = inspectionDetails.TaskId.split('-');
        }
        roomId = roomId[1] + ts;

        let dataObj: any = {};

        try {

            axios.get('https://api.ipify.org?format=json')
                .then(function (data) {
                    //console.log("Data", data.data.ip);
                    setIsgoLiveLoading(false);
                    dataObj.CALLER_IP = data.data.ip;
                    dataObj.ID = roomId;
                    dataObj.DATE = moment().format('DD MMM YYYY');
                    dataObj.START_TIME = new moment().format("HH:mm:ss");
                    dataObj.LICENSE_NO = inspectionDetails.mappingData[0].LicenseCode;
                    dataObj.EST_NAME = inspectionDetails.mappingData[0].CustomerName;
                    dataObj.TASK_ID = inspectionDetails.TaskId;
                    dataObj.CALLER_NAME = userName;

                    let options = {
                        method: "POST",
                        url: 'https://adremoteinspection.com/api/update',
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8",
                            "Accept": "application/json"
                        },
                        data: JSON.stringify(dataObj)
                    }

                    axios(options).then(function (response) {
                        // handle success
                        let resp = response.data.status;
                        let status = ""
                        if (resp == "successs") {
                            status = " cdr Success";
                            getDeviceIds(roomId);
                        } else {
                            status = " cdr Failed";
                            Alert.alert("Status :" + status);
                        }
                    })
                        .catch(function (error) {
                            // handle error
                            Alert.alert(error.message);
                        });
                })
                .catch(function (error) {
                    //console.log(error);
                })
        }
        catch (err) {
            Alert.alert(err);
        }
        // }


    }

    const getDeviceIds = (roomId: any) => {
        let obj = { "LicenseNo": "CN-564345" }    //dev

        let options = {
            method: "POST",
            url: 'https://services.adafsa.gov.ae/ADFCACustomerAppServiceBus1.13/ADFCASelfInspectionServices.svc/1234567890/1234567890/GetDeviceDetailsByLicenseNo',
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Accept": "application/json"
            },
            data: JSON.stringify(obj)
        }

        setIsgoLiveLoading(true);

        axios(options).then(function (resp: any) {
            //resp = { "GetDeviceDetailsByLicenseNoResult": { "ErrorCode": "0", "ErrorDesc": "Success", "DeviceDetails": [{ "DeviceToken": "c_GDXfup0uY:APA91bFehrKF2jvzQlZ8rixArjoh3QIDgx8LyTMLe1aQY_PlXsxMQwjEXwg7YY4m8VPZnEkoapzA90BWmgklpbCFOSOQSoukUZZ6_Tabwk_yKLPhfhfEcLXjoYlyOTwcwV8CzkfzrQso", "DeviceType": "ANDROID", "Email": "jihad.abumahmoud@adfca.ae", "ID": "32806", "LicenseNO": "CN-564345" }, { "DeviceToken": null, "DeviceType": null, "Email": null, "ID": null, "LicenseNO": null }] } }

            setIsgoLiveLoading(false);
            var userList: any = [];
            // hideProgress('myTaskFISMask', 'myTaskMaskFIS');
            if (resp.data.GetDeviceDetailsByLicenseNoResult.ErrorDesc == "Success") {
                resp = resp.data.GetDeviceDetailsByLicenseNoResult.DeviceDetails;
                for (let j = 0; j < resp.length; j++) {
                    let obj: any = {};
                    if (resp[j].DeviceType) {
                        obj.deviceType = resp[j].DeviceType;
                    }
                    if (resp[j].DeviceToken) {
                        obj.deviceToken = resp[j].DeviceToken;
                        userList.push(obj);
                    }
                }

                if (userList.length) {
                    //console.log("UserList", userList);
                    var url = "https://adremoteinspection.com/?uname=" + inspectorName + "&roomId=" + roomId;
                    Linking.canOpenURL(url).then(supported => {
                        if (supported) {
                            //console.log("Url supportefd", url)
                            sendPushes(userList, roomId);
                            Linking.openURL(url);
                        } else {
                            Alert.alert("Unable to open this url");
                        }
                    });
                }
                else {
                    Alert.alert("No self inspection user for this establishment");
                }
            }
        })
            .catch(function (error) {
                // handle error
                Alert.alert(error.message);
            });

    }

    const sendPushes = (users: any, roomId: any) => {
        let tokensIOSArray = [];
        let tokensAndroidArray = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].deviceToken != "") {
                if (users[i].deviceType == "IOS") {
                    tokensIOSArray.push(users[i].deviceToken);
                } else {
                    tokensAndroidArray.push(users[i].deviceToken);
                }
            }
        }

        if (tokensIOSArray.length > 0) {
            //console.log("Device is ios", tokensIOSArray);
            sendPushToIOSDevice(tokensIOSArray, roomId);
        }

        if (tokensAndroidArray.length > 0) {
            //console.log("Device is android", tokensAndroidArray);
            sendPushToAndroidDevice(tokensAndroidArray, roomId);
        }

    }

    const sendPushToIOSDevice = (tokensIOSArray: any, roomId: any) => {
        let objIOS = {
            "registration_ids": tokensIOSArray,
            "badge": 0,
            "priority": "high",
            "data": {
                "badge": 0,
                "body": "Tap to interact",
                "title": "Incoming Call",
                "color": "#00ACD4",
                "caller": inspectorName,
                "roomId": roomId,
                "priority": "high",
                "icon": "luncher_icon",
                "sound": "default",
                "notificationId": "id",
                "show_in_foreground": true,
                "location": "VideoScreen",
                "channelId": "test-channel"
            },
            "content_available": true
        }
        let optionsIOS = {
            method: "post",
            url: "https://fcm.googleapis.com/fcm/send",
            //For devloper account use below headers
            headers: {
                "Authorization": "key=AAAAk8AQQig:APA91bFoPf1mMrzWR8tN9wCT0dax_WKZ-ADYdo5bPR-30szrgWs4buvFGp8sIldXnQ52yYCeTAioY-i8wBDBJH5VvkUHRhD6BZh_BE4wJTIJF99Zc38TNVnn-E7tN9LeVEMlnYu6kLm6",
                "Content-Type": "application/json"
            },
            //for Prod account use below headers
            // headers: {
            //     "Authorization": "key=AAAAy6ntruE:APA91bFQfMsy2JybOhCiVg9FKejfaEkdSh30rc_4i2mUqnAIPJb-k0pLq4VyasS1Gw7z7r9kA5RQhIqMq27rGv6YROIl-orOUjUp5L7eix16bmShJh5u9Fz1lvS5vfQwoGW6k1XDJShd",
            //     "Content-Type": "application/json"
            // },
            data: JSON.stringify(objIOS)
        }
        axios(optionsIOS).then(function (resp: any) {
            //console.log("res ios 1", resp);

        }).catch(function (error) {
            // handle error
            Alert.alert(error.message);
        });


        let objIOS2 = {
            "registration_ids": tokensIOSArray,
            "badge": 0,
            "priority": "high",
            "notification": {
                "badge": 0,
                "body": "Tap to interact",
                "title": "Incoming Call",
                "color": "#00ACD4",
                "caller": inspectorName,
                "roomId": roomId,
                "icon": "luncher_icon",
                "sound": "default",
                "fcmMessageType": "notifType",
                "notificationId": "id",
                "show_in_foreground": true,
                "vibrate": 500,
                "location": "VideoScreen",
                "channelId": "test-channel",
                "content_available": 1
            },
            "data": {
                "badge": 1,
                "body": "Tap to interact",
                "title": "Incoming Call",
                "color": "#00ACD4",
                "caller": inspectorName,
                "roomId": roomId,
                "priority": "high",
                "icon": "luncher_icon",
                "sound": "default",
                "notificationId": "id",
                "show_in_foreground": true,
                "location": "VideoScreen",
                "channelId": "test-channel"
            },
            "content_available": true
        }
        let optionsIOS2 = {
            method: "post",
            url: "https://fcm.googleapis.com/fcm/send",
            //For devloper account use below headers
            headers: {
                "Authorization": "key=AAAAk8AQQig:APA91bFoPf1mMrzWR8tN9wCT0dax_WKZ-ADYdo5bPR-30szrgWs4buvFGp8sIldXnQ52yYCeTAioY-i8wBDBJH5VvkUHRhD6BZh_BE4wJTIJF99Zc38TNVnn-E7tN9LeVEMlnYu6kLm6",
                "Content-Type": "application/json"
            },
            //for Prod account use below headers
            // headers: {
            //     "Authorization": "key=AAAAy6ntruE:APA91bFQfMsy2JybOhCiVg9FKejfaEkdSh30rc_4i2mUqnAIPJb-k0pLq4VyasS1Gw7z7r9kA5RQhIqMq27rGv6YROIl-orOUjUp5L7eix16bmShJh5u9Fz1lvS5vfQwoGW6k1XDJShd",
            //     "Content-Type": "application/json"
            // },
            data: JSON.stringify(objIOS2)
        }

        axios(optionsIOS2).then(function (resp: any) {
            //console.log("res ios 2", resp);


        }).catch(function (error) {
            // handle error
            Alert.alert(error.message);
        });
    }

    const sendPushToAndroidDevice = (tokensAndroidArray: any, roomId: any) => {
        let objAndroid = {
            "registration_ids": tokensAndroidArray,
            "badge": 1,
            "priority": "high",
            "data": {
                "badge": 1,
                "body": "Tap to interact ",
                "title": "Incoming Call",
                "color": "#00ACD4",
                "caller": inspectorName,
                "roomId": roomId,
                "priority": "high",
                "icon": "luncher_icon",
                "sound": "default",
                "notificationId": "id",
                "show_in_foreground": true,
                "location": "VideoScreen",
                "channelId": "test-channel"
            },
            "content_available": true
        }

        let optionsAndroid = {
            method: "post",
            url: "https://fcm.googleapis.com/fcm/send",
            headers: {
                "Authorization": "key=AAAAjumLTT8:APA91bEunsdJXwAvglQ3pzx5WBC74UUOrkp61zFxNwSvREtQwbKWXaacrnc6ELkUaF14VgyaeXRWw0dYIVPu8jfANxcVuLxeTv5u-t5YehJ2LMBf3jXag1WmoFIxQNzBrBV2k63n5P9v",
                "Content-Type": "application/json"
            },
            data: JSON.stringify(objAndroid)
        }

        axios(optionsAndroid).then(function (resp: any) {
            //console.log("res and", resp);
        }).catch(function (error) {
            // handle error
            Alert.alert(error.message);
        });
    }

    const shwSrDetails = () => {
        let estArray = Array()
        let srFromDB = RealmController.getSrDetails(realm, SrDetailsSchema.name);
        if (srFromDB && srFromDB['0']) {
            let temp = Object.values(srFromDB);
            estArray = temp;
            console.log(temp.length)
        }

        let loginData = RealmController.getLoginData(realm, LoginDetailsSchema.name);
        loginData = loginData['0'] ? loginData['0'] : {};

        if (estArray.length) {
            let eventArray = Object();
            let disp = '';
            let k = 0;
            let flag = true;
            z: for (var i = 0; i < estArray.length; i++) {
                //if (estArray[i].TaskId == inspectionDetails.TaskId) {
                if (estArray[i].SiebSRId == inspectionDetails.ActivitySRId) {
                    k = i;
                    flag = false;
                    break z;
                }
                else {
                    flag = true;
                }
            }
            if (!flag) {
                eventArray = estArray[k];
            }
            else {

                let msg = 'No permit Details Available. Possible reasons:';
                let reason1 = '1. Permit (SR) is not assigned to you.'
                let reason2 = '2. Permit (SR) has been expired.'
                let reason3 = '3. Permit (SR) is still pending in the system.'
                let final = 'Please contact unit head / lead inspector for assistance.'

                Alert.alert(msg, reason1 + reason2 + reason3 + final);
                // disp += '<p style="text-align: center; font-size: large;">' + msg + '<br/></p>';
                // disp += '<p style="font-size: large;">' + reason1 + '<br/>' + reason2 + '<br/>' + reason3 + '<br/></p>';

                // disp += '<p style="font-size: large;">' + final + '<br/></p>';
                // $("#showAlertMoreInfo").html(disp);
                // $(".FAMask").show();
                // $("#showAlertMoreInfo").show();
                return;
            }

            //if (eventArray.ADFCAExbFromDate && (new Date(eventArray.ADFCAExbFromDate) > new Date())) {
            if (eventArray.ADFCACertificateStartDate && (new Date(eventArray.ADFCACertificateStartDate) > new Date())) {
                let msg = 'This SR begins on ' + eventArray.ADFCACertificateStartDate;
                Alert.alert("", msg);
                return;
            }
            //if (eventArray.ADFCAExbToDate && (new Date(eventArray.ADFCAExbToDate) < new Date())) {
            if (eventArray.ADFCACertificateExpDate && (new Date(eventArray.ADFCACertificateExpDate) < new Date())) {
                let msg = 'This SR expired on ' + eventArray.ADFCACertificateExpDate;
                Alert.alert("", msg);
                return;
            }
            if (eventArray.ADFCASRInspector != loginData.username) {
                let msg = 'This SR is for ' + eventArray.ADFCASRInspector;
                Alert.alert("", msg);
                return;
            }


            if (eventArray.Application == "Temporary Permit" || eventArray.Application == "Canteen Permt in Urban Project" || eventArray.Application == "Permit UAE Food Activity") {

                TemporaryPermitsServiceRequestDraft.setServiceRequestObject(JSON.stringify(eventArray))
                NavigationService.navigate('ShowSrDetails', { NoCreate: false })

            }
            else {
                Alert.alert("", "No Details Available")
            }

        } else {
            Alert.alert("", "No Details Available")
        }
    }

    const renderData = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    // NavigationService.navigate(item.navigationScreenName)
                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                    width: '100%', borderColor: 'transparent'
                }}>

                <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }}
                        resizeMode={'contain'}
                        source={item.image} />
                </View>

                <View style={{ flex: 0.3, height: 5 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

            </TouchableOpacity>

        )
    }

    const exportSamplePDF = () => {
        setIsSampleReportModalVisible(false);
    }

    const closeSampleAlert = () => {
        setIsSampleReportModalVisible(false);
    }

    const confirmAlert = () => {
        if (password === masterPassword) {
            // RealmController.deleteCheckListById(realm,myTasksDraft.taskId,()=>{
            if ((taskType.toLowerCase() == 'routine inspection') || (taskType.toLowerCase() == 'temporary routine inspection')) {
                let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                let checkList = checkListData['0'] && checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();

                let ehsCount = 0, tempChecklistWOEHS = Array(), tempChecklistWithEHS = Array(), tempCheckList = Array();
                if (checkList.length) {
                    for (let index = 0; index < checkList.length; index++) {
                        const element = checkList[index];
                        if (element.parameter_type == "EHS") {
                            ehsCount = ehsCount + 1;
                            tempChecklistWithEHS.push(element)
                        }
                        else {
                            tempChecklistWOEHS.push(element)
                        }
                    }
                    if (ehsCount < 4) {
                        tempCheckList = [...tempChecklistWOEHS]
                    }
                    else {
                        tempCheckList = [...tempChecklistWOEHS, ...tempChecklistWithEHS]
                    }

                    let obj: any = {};
                    obj.checkList = JSON.stringify(tempCheckList);
                    obj.taskId = myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId;
                    obj.timeElapsed = checkListData['0'].timeElapsed.toString();
                    obj.timeStarted = checkListData['0'].startTime.toString();
                    obj.isCompleted = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : "";
                    obj.sign = checkListData['0'].sign ? checkListData['0'].sign : "";
                    obj.overallcomment = checkListData['0'].overallcomment ? checkListData['0'].overallcomment : "";
                    obj.contactname = checkListData['0'].contactname ? checkListData['0'].contactname : "";
                    obj.contactnumber = checkListData['0'].contactnumber ? checkListData['0'].contactnumber : "";
                    obj.eid = checkListData['0'].eid ? checkListData['0'].eid : "";
                    RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                    });

                }
                setShowDeleteClecklist(false)
                ToastAndroid.show("Success", 1000)
            }
            // })
        } else {
            ToastAndroid.show("Password didn't match", 1000)
        }
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={establishmentDraft.state == 'pending' ? true : false}
                    textContent={establishmentDraft.loadingState != '' ? establishmentDraft.loadingState : 'Loading'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <Spinner
                    visible={licenseDraft.state == 'pending' ? true : false}
                    textContent={licenseDraft.loadingState != '' ? licenseDraft.loadingState : 'Loading ...'}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                />

                {
                    issSampleReportModalVisible ?
                        <ModalComponentSamplingReport
                            data={inspectionDetails}
                            sampling={(taskType.toLowerCase() == 'sampling') ? true : (taskType.toLowerCase() == 'condemnation') ? true : (taskType.toLowerCase() == 'detention') ? true : false}
                            sampleArr={(taskType.toLowerCase() == 'sampling') ? inspectionDetails.mappingData[0].samplingReport : (taskType.toLowerCase() == 'condemnation') ? inspectionDetails.mappingData[0].condemnationReport : (taskType.toLowerCase() == 'detention') ? inspectionDetails.mappingData[0].detentionReport : []}
                            establishData={establishmentDraft}
                            createPdfMsg={Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.createPdfMsg}
                            closeAlert={closeSampleAlert}
                            exportPDF={exportSamplePDF}

                        />
                        : null
                }
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

                <Modal
                    visible={showDeleteClecklist}
                    transparent={true}
                >
                    <TouchableOpacity onPress={() => { }} style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, justifyContent: 'center', zIndex: 8, alignItems: 'center', }}>
                        <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.25, zIndex: 999, borderRadius: 20 }]}>
                            <View style={{ flex: 5, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: context.isArabic ? 'row-reverse' : 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                    <View style={{ flex: 9, justifyContent: 'center' }}>
                                        <TextComponent
                                            textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                            label={"Delete Checklist"}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => setShowDeleteClecklist(false)}
                                        style={{ flex: 1, justifyContent: 'center' }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require("./../assets/images/alert_images/close.png")}
                                            style={{ height: '80%', width: '80%' }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: HEIGHT * 0.15, justifyContent: 'center', padding: 8 }}>

                                    <TextInput
                                        style={{ borderRadius: 5, borderWidth: 0.5, padding: 5, textAlign: context.isArabic ? 'right' : 'left', fontSize: 12, backgroundColor: '#e0e0e0', borderColor: 'gray', height: props.height ? props.height : 40 }}
                                        onChangeText={(val) => {
                                            setPassword(val);

                                        }}
                                        placeholder={'Enter Master Password'}
                                        multiline={false}
                                        numberOfLines={2}
                                        // value={grace ? grace.toString() : ''}
                                        // keyboardType={'number-pad'}
                                        // editable={!props.disabled}
                                        maxLength={32}
                                    />

                                </View>
                            </View>

                            <View style={{ height: HEIGHT * 0.07, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', padding: 10 }}>
                                <TouchableOpacity
                                    onPress={confirmAlert}
                                    style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 5 }}>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Ok</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setShowDeleteClecklist(false)}
                                    style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 5 }}>
                                    <Text style={{ fontWeight: 'bold', color: 'white' }}>Cancle</Text>
                                </TouchableOpacity>
                            </View>

                        </Animatable.View>
                    </TouchableOpacity>
                </Modal>

                <Spinner
                    visible={myTasksDraft.state == 'pending' ? true : false}
                    textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                />

                <Spinner
                    visible={myTasksDraft.acknowledgeState == 'pending' ? true : false}
                    textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                />

                <Spinner
                    visible={isgoLiveLoading}
                    textContent={'Loading ...'}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                />

                {
                    showFoodAlert ?
                        <AlertComponentForFoodAlert
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Food Alert'}
                            comment={''}
                            message={''}
                            uik={() => {
                                setShowFoodAlert(false);
                            }}
                            showAlertComponentForFoodAlertSCD={(value: boolean) => {
                                setShowFoodAlert(false)
                                setNavigateToStartInspection(true)
                                // setAlertApplicableToCurrentTask(value)
                                // setShowFoodAlertForSCD(value);
                            }}
                        />
                        :
                        null
                }

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        {/* <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' ? 1.1 : myTasksDraft.isMyTaskClick == 'history' ? 0.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'history' ? Strings[context.isArabic ? 'ar' : 'en'].taskList.history : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View> */}

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: (inspectionDetails && inspectionDetails.TaskType && inspectionDetails.TaskType.length) > 10 ? 12 : 14, fontWeight: 'bold' }}>{inspectionDetails && inspectionDetails.TaskType ? inspectionDetails.TaskType.toUpperCase() : ' - '}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.003, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>

                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger style={styles.menuTrigger}>
                                <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                                {/* <MenuOption onSelect={() => { }} > */}
                                <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                                {/* </MenuOption> */}

                            </MenuOptions>
                        </Menu>

                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, height: '100%', backgroundColor: isClick.inspClick ? '#abcfbe' : 'white', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, estClick: false, inspClick: true }
                                });
                            }}
                            style={{ width: '100%', height: '100%', backgroundColor: isClick.inspClick ? '#abcfbe' : 'white', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} >
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionDetails}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1, height: '100%', justifyContent: 'center', backgroundColor: isClick.estClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, estClick: true, inspClick: false }
                                });
                                if (taskType == "Campaign Inspection") {
                                    callToAccountSync(0)
                                }
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.estClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.establishmentDetails}</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                {
                    isModalVisible ?
                        <ModalComponent
                            data={inspectionDetails}
                            establishData={establishmentDraft}
                            createPdfMsg={Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.createPdfMsg}
                            closeAlert={closeAlert}
                            exportPDF={exportPDF}

                        />
                        : null
                }

                {isClick.estClick ?

                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.establishmentName)} </Text>
                            </View>

                            <View style={styles.space} />

                            {taskType != "Campaign Inspection" ? <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.establishmentName}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                                :
                                <View style={styles.textInputContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dropdownRef2 && dropdownRef2.current.focus();
                                        }}
                                        style={{
                                            height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }} >
                                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Dropdown
                                                ref={dropdownRef2}
                                                value={establishmentDraft.establishmentName}
                                                onChangeText={(val: string, type: string) => {
                                                    setEstablishmentValues(type)
                                                }}
                                                itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                                data={listOfEstNames}
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
                            }
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseSource)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    isArabic={context.isArabic}
                                    value={establishmentDraft.licenseSource}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange} />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseStartDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.licensestartDate}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseEndDate)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.licenseEndDate}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.licenseNumber)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.licenseNumber}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.contactDetails)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.contactDetails}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                // onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.address)} </Text>
                            </View>
                            <View style={styles.space} />
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("", establishmentDraft.address, [

                                        { text: "OK", onPress: () => { } }
                                    ],
                                        { cancelable: false })
                                }}
                                style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.address}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 0.2 }} />

                        {myTasksDraft.isMyTaskClick == 'tempPermit' ? null :

                            <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={styles.textContainer}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.area)} </Text>
                                </View>

                                <View style={styles.space} />

                                <View style={styles.textInputContainer}>
                                    <TextInputComponent
                                        style={{
                                            height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        isArabic={context.isArabic}
                                        editable={false}
                                        value={establishmentDraft.area}
                                        maxLength={props.maxLength}
                                        numberOfLines={props.numberOfLines}
                                        placeholder={''}
                                        keyboardType={props.keyboardType}
                                        onChange={props.onChange}
                                    />
                                </View>
                            </View>
                        }
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.sector)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={establishmentDraft.sector}
                                    placeholder={''}
                                />
                            </View>

                        </View>

                    </View>
                    :
                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskId)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.TaskId}
                                    onChange={(val) => { }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskType)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.TaskType}
                                    onChange={(val) => { }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.creationDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.CreatedDate}
                                    onChange={(val) => { }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.businessActivity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <TouchableOpacity
                                style={styles.textInputContainer}
                                onPress={() => {
                                    Alert.alert("", inspectionDetails.BusinessActivity, [

                                        { text: "OK", onPress: () => { } }
                                    ],
                                        { cancelable: false })
                                }}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={inspectionDetails.BusinessActivity != 'null' ? inspectionDetails.BusinessActivity : '-'}
                                    editable={false}
                                    onChange={(val) => { }}
                                />
                            </TouchableOpacity>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.subbusinessActivity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={inspectionDetails.BusinessActivity}
                                    onChange={(val) => { }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.description)} </Text>
                            </View>

                            <View style={styles.space} />

                            <TouchableOpacity
                                style={styles.textInputContainer}
                                onPress={() => {
                                    Alert.alert("", inspectionDetails.Description, [

                                        { text: "OK", onPress: () => { } }
                                    ],
                                        { cancelable: false })
                                }}
                            >
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val) => { }}
                                    editable={false}
                                    value={inspectionDetails.Description}
                                />
                            </TouchableOpacity>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.risk)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val) => { }}
                                    editable={false}
                                    value={inspectionDetails.RiskCategory}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.sheduledDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val) => { }}
                                    editable={false}
                                    value={inspectionDetails.CompletionDate ? moment(inspectionDetails.CompletionDate).format('L') : '-'}

                                />
                            </View>

                        </View>

                    </View>

                }

                <View style={{ flex: 0.2 }} />

                {isClick.estClick ?
                    <React.Fragment >
                        <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '90%', alignSelf: 'center' }}>

                            <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                                <ButtonComponent
                                    style={{
                                        height: '80%', width: '100%', backgroundColor: 'red',
                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        establishmentDraft.callToGetContactList(establishmentDraft.licenseCode)
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.contact)}
                                />
                            </View>

                            {/* <View style={{ flex: 0.1 }} />
                            {
                                inspectionDetails.TaskType.toLowerCase() == 'routine inspection' ?
                                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                                        <ButtonComponent
                                            style={{
                                                height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                fetchEfstData()
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.efst)}
                                        />
                                    </View>
                                    : null
                            } */}


                            <View style={{ flex: 0.1 }} />
                            {
                                (taskStatus == 'Completed') || (taskStatus == 'Failed') ?
                                    null
                                    :
                                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                                        <ButtonComponent
                                            style={{
                                                height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                NavigationService.navigate('OnHoldRequest', { title: 'On Hold Request' })
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.onHoldRequest)}
                                        />

                                    </View>
                            }
                            <View style={{ flex: 0.1 }} />
                        </View>

                        <View style={{ flex: 0.5, flexDirection: 'row' }} >
                            <View style={{ flex: 0.1 }} />
                            {
                                (taskStatus == 'Completed') || (taskStatus == 'Failed') ?
                                    null
                                    :
                                    ((myTasksDraft.isMyTaskClick == 'myTask') || (inspectionDetails.TaskType == 'Temporary Routine Inspection')) || (myTasksDraft.isMyTaskClick == 'campaign') ?

                                        <View style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                            <ButtonComponent
                                                style={{
                                                    height: '100%', width: '100%', backgroundColor: 'red',
                                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                    textAlign: 'center'
                                                }}
                                                isArabic={context.isArabic}
                                                buttonClick={() => {
                                                    NavigationService.navigate('RequestForClouser', { title: 'Request For Closure' })
                                                }}
                                                textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.requestforClosure)}
                                            />

                                        </View>

                                        : null
                            }
                            <View style={{ flex: 0.1 }} />
                            {
                                myTasksDraft.isMyTaskClick != 'CompletedTask' ?
                                    <View style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                        <ButtonComponent
                                            style={{
                                                height: '100%', width: '100%', backgroundColor: 'red',
                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={async () => {

                                                try {

                                                    if (AppState.currentState === "active") {
                                                        try {

                                                            const granted = await PermissionsAndroid.requestMultiple(
                                                                [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                                                                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                                                                ]
                                                            ).then(async (result) => {

                                                                if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
                                                                    && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {

                                                                    RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
                                                                        if (result == RNSettings.ENABLED) {

                                                                            Geolocation.getCurrentPosition(
                                                                                (position: any) => {
                                                                                    myTasksDraft.setLatitude(position.coords.latitude.toString())
                                                                                    myTasksDraft.setLongitude(position.coords.longitude.toString())
                                                                                    let payload = {
                                                                                        "Longitude": position.coords.latitude.toString(),
                                                                                        "Attrib3": "",
                                                                                        "License": inspectionDetails.LicenseNumber,
                                                                                        "EstSiebelId": establishmentDraft.establishmentId,
                                                                                        "Attrib2": "",
                                                                                        "Latitude": position.coords.longitude.toString(),
                                                                                        "Attrib5": "",
                                                                                        "Attrib4": "",
                                                                                        "Attrib1": ""
                                                                                    }
                                                                                    console.log(position.coords.latitude + ':' + position.coords.longitude + "inspectionDetails.EstablishmentId>>" + JSON.stringify(inspectionDetails.EstablishmentId));
                                                                                    if (establishmentDraft.establishmentId) {
                                                                                        myTasksDraft.callToUpdateLocation(payload)
                                                                                    }
                                                                                },
                                                                                async (error) => {
                                                                                    //console.log(error.code, error.message);
                                                                                },
                                                                                {
                                                                                    enableHighAccuracy: false,
                                                                                    timeout: 10000,
                                                                                    maximumAge: 100000,
                                                                                    forceRequestLocation: true,
                                                                                    showLocationDialog: true
                                                                                }
                                                                            );

                                                                        } else {
                                                                            Alert.alert("Turn on Location", "Please turn on location to fetch current location", [
                                                                                {
                                                                                    text: "Cancel",
                                                                                    onPress: () => { },
                                                                                    style: "cancel"
                                                                                },
                                                                                { text: "OK", onPress: () => AndroidOpenSettings.locationSourceSettings() }
                                                                            ],
                                                                                { cancelable: false })
                                                                        }
                                                                    });
                                                                    debugger;
                                                                }
                                                                else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'denied'
                                                                    || result['android.permission.ACCESS_FINE_LOCATION']
                                                                    === 'denied') {
                                                                    debugger;
                                                                    setNeverAskLocationPermissionAlert(true);
                                                                }
                                                                else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again'
                                                                    || result['android.permission.ACCESS_FINE_LOCATION']
                                                                    === 'never_ask_again') {
                                                                    debugger;
                                                                    setNeverAskLocationPermissionAlert(true);
                                                                }
                                                            });
                                                        } catch (err) {
                                                            console.warn('exception ::' + err);
                                                        }
                                                    }


                                                } catch (err) {
                                                    console.warn('exception 1::' + err);

                                                }

                                                // setIsModalVisible(true);
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.updateLocation)}
                                        />

                                    </View>
                                    :
                                    null
                            }
                            <View style={{ flex: 0.1 }} />
                        </View>
                        <View style={{ flex: 0.1 }} />
                    </React.Fragment>
                    :
                    <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 1.1 : 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', width: '85%', alignSelf: 'center' }}>

                        {myTasksDraft.isMyTaskClick == 'history' ?

                            <View style={{ flex: 1, justifyContent: 'center', borderRadius: 8, borderWidth: 0.5, borderColor: '#abcfbf', padding: 5 }}>

                                <FlatList
                                    data={inspectionHistoryArray}
                                    contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                    columnWrapperStyle={{ flexDirection: context.isArabic ? 'row-reverse' : 'row' }}
                                    initialNumToRender={5}
                                    renderItem={({ item, index }) => {
                                        return (
                                            renderData(item, index)
                                        )
                                    }}
                                    ItemSeparatorComponent={() => (<View style={{ width: 8 }} />)}
                                    numColumns={4}
                                />

                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '95%', alignSelf: 'center' }}>

                                {
                                    (taskStatus == 'Completed') || (taskStatus == 'Failed') ?

                                        (taskType != "Campaign Inspection") ?

                                            <View style={{ flex: 2, width: '100%', justifyContent: 'center' }}>
                                                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                                    {/* <View style={{ flex: 0.1 }} /> */}

                                                    {
                                                        (taskStatus == 'Completed') ?
                                                            <View style={{ flex: 3, height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                                                <ButtonComponent
                                                                    style={{
                                                                        height: '100%', width: '100%', backgroundColor: 'red',
                                                                        borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                        textAlign: 'center'
                                                                    }}
                                                                    isArabic={context.isArabic}
                                                                    buttonClick={async () => {
                                                                        let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                                                                        let temp: any;
                                                                        let time: any;
                                                                        if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData['0'] && tempInspectionDetail.mappingData['0'].reqResponseArr) {
                                                                            let reqResponseArr = typeof (tempInspectionDetail.mappingData['0'].reqResponseArr) == 'string' && (tempInspectionDetail.mappingData['0'].reqResponseArr != '') ? JSON.parse(tempInspectionDetail.mappingData['0'].reqResponseArr) : {};
                                                                            temp = new Date().valueOf();
                                                                            time = temp - new Date(tempInspectionDetail.CompletionDate).valueOf();
                                                                        }
                                                                        let diff = Math.abs(time) / 1000
                                                                        // alert(diff)
                                                                        if (diff < 20) {
                                                                            ToastAndroid.show("Please wait " + (20 - diff) + " Second", 1000);
                                                                            return;
                                                                        } else {
                                                                            try {

                                                                                const granted = await PermissionsAndroid.requestMultiple(
                                                                                    [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                                                                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                                                                                    ]
                                                                                ).then(async (result) => {

                                                                                    if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
                                                                                        && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {

                                                                                        myTasksDraft.callToGetInspectionReport();

                                                                                    }
                                                                                    else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
                                                                                        || result['android.permission.READ_EXTERNAL_STORAGE']
                                                                                        === 'denied') {
                                                                                        debugger;

                                                                                    }
                                                                                    else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again'
                                                                                        || result['android.permission.READ_EXTERNAL_STORAGE']
                                                                                        === 'never_ask_again') {
                                                                                        debugger;
                                                                                    }
                                                                                });
                                                                            } catch (err) {
                                                                                console.warn('exception 2::' + err);

                                                                            }
                                                                        }
                                                                    }}
                                                                    textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.printSibleReport)}
                                                                />

                                                            </View>
                                                            : null
                                                    }
                                                    <View style={{ flex: 0.1 }} />

                                                    <View style={{ flex: 2, height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                                        <ButtonComponent
                                                            style={{
                                                                height: '100%', width: '100%', backgroundColor: 'red',
                                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                textAlign: 'center'
                                                            }}
                                                            isArabic={context.isArabic}
                                                            buttonClick={() => {
                                                                if ((taskType == "Campaign Inspection" && establishmentDraft.establishmentName != "") || taskType != "Campaign Inspection") {
                                                                    setIsModalVisible(true);
                                                                }
                                                                else if ((taskType.toLowerCase() == 'sampling') || (taskType.toLowerCase() == 'condemnation') || (taskType.toLowerCase() == 'detention')) {
                                                                    setIsSampleReportModalVisible(true);
                                                                }
                                                                else {
                                                                    Alert.alert("Please select establishment name")
                                                                }

                                                            }}
                                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.print)}
                                                        />

                                                    </View>

                                                    <View style={{ flex: 0.1 }} />

                                                    <View style={{ flex: 3, height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                                        <ButtonComponent
                                                            style={{
                                                                height: '100%', width: '100%', backgroundColor: 'red',
                                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                textAlign: 'center'
                                                            }}
                                                            isArabic={context.isArabic}
                                                            buttonClick={() => {
                                                                myTasksDraft.setTaskSubmited(false);

                                                                console.log('taskType', JSON.stringify(inspectionDetails.TaskType));

                                                                if (inspectionDetails.TaskType == 'Follow-Up') {
                                                                    myTasksDraft.setLoadingState('Fetching Checklist')
                                                                    NavigationService.navigate('StartInspection', { 'inspectionDetails': inspectionDetails });
                                                                }
                                                                else if (inspectionDetails.TaskType.toLowerCase() == 'closure inspection') {
                                                                    NavigationService.navigate('ClosureInspection');
                                                                }
                                                                else if ((inspectionDetails.TaskType == "Campaign Inspection" && establishmentDraft.establishmentName != "")) {
                                                                    myTasksDraft.setLoadingState('Fetching Checklist')
                                                                    NavigationService.navigate('StartInspection');
                                                                }
                                                                else if (inspectionDetails.TaskType.toLowerCase() == 'sampling') {
                                                                    NavigationService.navigate('Sampling', { title: Strings[context.isArabic ? 'ar' : 'en'].startInspection.sampling })
                                                                }
                                                                else if (inspectionDetails.TaskType.toLowerCase() == 'condemnation') {
                                                                    NavigationService.navigate('Condemnation', { title: Strings[context.isArabic ? 'ar' : 'en'].startInspection.condemnation })
                                                                }
                                                                else if (inspectionDetails.TaskType.toLowerCase() == 'detention') {
                                                                    NavigationService.navigate('Detention', { title: Strings[context.isArabic ? 'ar' : 'en'].startInspection.detention })
                                                                }
                                                                else {
                                                                    if (myTasksDraft.checkListArray == '') {
                                                                        myTasksDraft.setLoadingState('Fetching Checklist')
                                                                    }
                                                                    NavigationService.navigate('StartInspection');
                                                                }
                                                                // setIsModalVisible(true);
                                                            }}
                                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.viewChecklist)}
                                                        />
                                                    </View>

                                                    <View style={{ flex: 0.1 }} />

                                                </View>
                                                {/* {
                                                    inspectionDetails.TaskStatus == 'Failed' ? */}
                                                <View style={{ flex: 0.1 }} />
                                                {/* :
                                                        null
                                                } */}
                                                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>

                                                    {/* {
                                                        inspectionDetails.TaskStatus == 'Failed' ? */}
                                                    <View style={{ flex: 3, height: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                                        <ButtonComponent
                                                            style={{
                                                                height: '100%', width: '100%', backgroundColor: 'red',
                                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                textAlign: 'center'
                                                            }}
                                                            isArabic={context.isArabic}
                                                            buttonClick={async () => {

                                                                try {

                                                                    const granted = await PermissionsAndroid.requestMultiple(
                                                                        [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                                                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                                                                        ]
                                                                    ).then((result) => {

                                                                        if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
                                                                            && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {
                                                                            myTasksDraft.setState('pending');
                                                                            myTasksDraft.setLoadingState('Reporting Task');
                                                                            let taskDetails = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
                                                                            taskDetails = (taskDetails['0']);

                                                                            let arrayTemp = RealmController.getbase64ListForTaskId(realm, myTasksDraft.taskId)
                                                                            let base64TEmp = (arrayTemp['0']);

                                                                            let checklistTemp = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, myTasksDraft.taskId)
                                                                            let checklist = (checklistTemp['0']);


                                                                            let temp = {
                                                                                inspectionDetails: taskDetails,
                                                                                imageBase64: base64TEmp,
                                                                                checklist: checklist,
                                                                                attachmentReqqRes: ""
                                                                            }

                                                                            var path = DownloadDirectoryPath + '/' + myTasksDraft.taskId + "_ReportTask.json";

                                                                            let submitFlag = false;
                                                                            try {
                                                                                let loginData = RealmController.getLoginData(realm, LoginDetailsSchema.name);
                                                                                loginData = loginData[0] ? loginData[0] : {};

                                                                                writeFile(path, JSON.stringify(temp), 'utf8')
                                                                                    .then((success) => {
                                                                                        console.log('FILE WRITTEN!');
                                                                                        readFile(path, 'base64').then(async (success) => {
                                                                                            // console.log("success"+JSON.stringify(success));
                                                                                            myTasksDraft.callToReportThisTask(success);

                                                                                        })
                                                                                    })
                                                                                    .catch((err) => {
                                                                                        // self.state = 'done';
                                                                                        console.log('222' + err);
                                                                                    });
                                                                            }
                                                                            catch (e) {
                                                                                console.log('Error ::' + e);
                                                                            }

                                                                        }
                                                                        else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
                                                                            || result['android.permission.READ_EXTERNAL_STORAGE']
                                                                            === 'denied') {
                                                                            debugger;

                                                                        }
                                                                        else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again'
                                                                            || result['android.permission.READ_EXTERNAL_STORAGE']
                                                                            === 'never_ask_again') {
                                                                            debugger;
                                                                        }
                                                                    });
                                                                } catch (err) {
                                                                    console.warn('exception3 ::' + err);
                                                                }

                                                                // setIsModalVisible(true);
                                                            }}
                                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.reportThisTask)}
                                                        />

                                                    </View>
                                                    {/* :
                                                            null
                                                    } */}

                                                    <View style={{ flex: 0.1 }} />

                                                    <View style={{ flex: 3, height: '60%', alignItems: 'center', justifyContent: 'center' }}>

                                                    </View>

                                                    <View style={{ flex: 0.1 }} />

                                                </View>

                                            </View>
                                            :
                                            null
                                        // <View style={{ flex: 3, height: '60%', alignItems: 'center', justifyContent: 'center' }}>

                                        //     <ButtonComponent
                                        //         style={{
                                        //             height: '100%', width: '100%', backgroundColor: 'red',
                                        //             borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        //             textAlign: 'center'
                                        //         }}
                                        //         isArabic={context.isArabic}
                                        //         buttonClick={() => {
                                        //             myTasksDraft.callToReportThisTask()
                                        //             // setIsModalVisible(true);
                                        //         }}
                                        //         textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        //         buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.reportThisTask)}
                                        //     />


                                        // </View>
                                        :
                                        <React.Fragment >

                                            {
                                                isAcknowledge ?
                                                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                                        <View style={{ flex: 0.1 }} />

                                                        <View style={{ flex: 3, height: myTasksDraft.isMyTaskClick == 'tempPermit' ? '90%' : '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                            <ButtonComponent
                                                                style={{
                                                                    height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                    textAlign: 'center'
                                                                }}
                                                                isArabic={context.isArabic}
                                                                buttonClick={async () => {
                                                                    try {

                                                                        if (AppState.currentState === "active") {
                                                                            try {

                                                                                const granted = await PermissionsAndroid.requestMultiple(
                                                                                    [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                                                                                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                                                                                    ]
                                                                                ).then(async (result) => {

                                                                                    if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
                                                                                        && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {

                                                                                        RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
                                                                                            if (result == RNSettings.ENABLED) {

                                                                                                Geolocation.getCurrentPosition(
                                                                                                    (position: any) => {
                                                                                                        actionDraft.setLatitude(position.coords.latitude.toString())
                                                                                                        actionDraft.setLongitude(position.coords.longitude.toString())
                                                                                                        NavigationService.navigate('Action')

                                                                                                    },
                                                                                                    async (error) => {
                                                                                                        //console.log(error.code, error.message);
                                                                                                    },
                                                                                                    {
                                                                                                        enableHighAccuracy: false,
                                                                                                        timeout: 10000,
                                                                                                        maximumAge: 100000,
                                                                                                        forceRequestLocation: true,
                                                                                                        showLocationDialog: true
                                                                                                    }
                                                                                                );

                                                                                            } else {
                                                                                                Alert.alert("Turn on Location", "Please turn on location to fetch current location", [
                                                                                                    {
                                                                                                        text: "Cancel",
                                                                                                        onPress: () => { },
                                                                                                        style: "cancel"
                                                                                                    },
                                                                                                    { text: "OK", onPress: () => AndroidOpenSettings.locationSourceSettings() }
                                                                                                ],
                                                                                                    { cancelable: false })
                                                                                            }
                                                                                        });
                                                                                        debugger;
                                                                                    }
                                                                                    else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'denied'
                                                                                        || result['android.permission.ACCESS_FINE_LOCATION']
                                                                                        === 'denied') {
                                                                                        debugger;
                                                                                        setNeverAskLocationPermissionAlert(true);
                                                                                    }
                                                                                    else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again'
                                                                                        || result['android.permission.ACCESS_FINE_LOCATION']
                                                                                        === 'never_ask_again') {
                                                                                        debugger;
                                                                                        setNeverAskLocationPermissionAlert(true);
                                                                                    }
                                                                                });
                                                                            } catch (err) {
                                                                                console.warn('exception ::' + err);
                                                                            }
                                                                        }


                                                                    } catch (err) {
                                                                        console.warn('exception 1::' + err);

                                                                    }
                                                                }}
                                                                textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.action)}
                                                            />

                                                        </View>

                                                        <View style={{ flex: 0.1 }} />

                                                        <View style={{ flex: 3, height: myTasksDraft.isMyTaskClick == 'tempPermit' ? '90%' : '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                            <ButtonComponent
                                                                style={{
                                                                    height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                    textAlign: 'center'
                                                                }}
                                                                isArabic={context.isArabic}
                                                                buttonClick={() => {
                                                                    // callToGetBA();
                                                                    myTasksDraft.setIsAlertApplicableToCurrentEst(false)
                                                                    myTasksDraft.setTaskSubmited(false);

                                                                    if (inspectionDetails.TaskType.toLowerCase() == 'routine inspection' || inspectionDetails.TaskType == 'Follow-Up' || inspectionDetails.TaskType.toLowerCase().includes('food')
                                                                        || inspectionDetails.TaskType.toLowerCase() == 'complaints' || inspectionDetails.TaskType.toLowerCase() == 'temporary routine inspection' || inspectionDetails.TaskType.toLowerCase() == 'direct inspection') {
                                                                        if (myTasksDraft.isAlertApplicableNoToAll) {
                                                                            setNavigateToStartInspection(true)
                                                                        }
                                                                        else {
                                                                            if (foodAlertResponse.length && !myTasksDraft.isAlertApplicable && myTasksDraft.isMyTaskClick != 'CompletedTask') {
                                                                                setShowFoodAlert(true);
                                                                            }
                                                                            else {
                                                                                setNavigateToStartInspection(true)
                                                                            }
                                                                        }
                                                                    }
                                                                    else if (inspectionDetails.TaskType.toLowerCase() == 'sampling') {
                                                                        NavigationService.navigate('Sampling', { title: Strings[context.isArabic ? 'ar' : 'en'].startInspection.sampling })
                                                                    }
                                                                    else if (inspectionDetails.TaskType.toLowerCase() == 'condemnation') {
                                                                        NavigationService.navigate('Condemnation', { title: Strings[context.isArabic ? 'ar' : 'en'].startInspection.condemnation })
                                                                    }
                                                                    else if (inspectionDetails.TaskType.toLowerCase() == 'detention') {
                                                                        NavigationService.navigate('Detention', { title: Strings[context.isArabic ? 'ar' : 'en'].startInspection.detention })
                                                                    }
                                                                    else {
                                                                        setNavigateToStartInspection(true)
                                                                    }

                                                                }}
                                                                textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.startInpection)}
                                                            />

                                                        </View>

                                                        <View style={{ flex: 0.1 }} />

                                                        {
                                                            AppVersion === "1.0.11" && ((taskType.toLowerCase() == 'routine inspection') || (taskType.toLowerCase() == 'temporary routine inspection')) ?
                                                                <View style={{ flex: 2.8, height: myTasksDraft.isMyTaskClick == 'tempPermit' ? '90%' : '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                                    {/* <ButtonComponent
                                                                style={{
                                                                    height: '100%', width: '100%', backgroundColor: "#ffd700",
                                                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                    textAlign: 'center'
                                                                }}
                                                                golive={true}
                                                                isArabic={context.isArabic}
                                                                buttonClick={() => {
                                                                    goLiveClicked();
                                                                }}
                                                                textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: "#000000" }}
                                                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.goLive)}
                                                            /> */}
                                                                    {
                                                                        AppVersion === "1.0.11" && ((taskType.toLowerCase() == 'routine inspection') || (taskType.toLowerCase() == 'temporary routine inspection')) ?
                                                                            <ButtonComponent
                                                                                style={{
                                                                                    height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                                    textAlign: 'center'
                                                                                }}
                                                                                // golive={true}
                                                                                isArabic={context.isArabic}
                                                                                buttonClick={() => {
                                                                                    Alert.alert('', 'Do you want to delete checklist.', [
                                                                                        {
                                                                                            text: "Ok",
                                                                                            onPress: () => {
                                                                                                setShowDeleteClecklist(true)
                                                                                            },
                                                                                            style: "cancel"
                                                                                        },
                                                                                        {
                                                                                            text: "Cancle", onPress: () => {
                                                                                            }
                                                                                        }
                                                                                    ],
                                                                                        { cancelable: false })
                                                                                }}
                                                                                textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: "#000000" }}
                                                                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.deleteCheck)}
                                                                            />
                                                                            :
                                                                            null
                                                                    }


                                                                </View>
                                                                :
                                                                null
                                                        }

                                                        <View style={{ flex: 0.1 }} />

                                                        {/* <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                        <ButtonComponent
                                            style={{
                                                height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                myTasksDraft.callToGetAcknowlege(myTasksDraft.taskId);
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.acknowledge)}
                                        />

                                    </View> */}

                                                    </View>

                                                    :
                                                    <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                                        <ButtonComponent
                                                            style={{
                                                                height: '50%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                textAlign: 'center'
                                                            }}
                                                            isArabic={context.isArabic}
                                                            buttonClick={() => {
                                                                myTasksDraft.callToGetAcknowlege(myTasksDraft.taskId);
                                                            }}
                                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.acknowledge)}
                                                        />

                                                    </View>
                                            }

                                            {
                                                myTasksDraft.isMyTaskClick == 'tempPermit' ?
                                                    <View style={{ flex: 0.1 }} />
                                                    :
                                                    null
                                            }

                                            {
                                                myTasksDraft.isMyTaskClick == 'tempPermit' ?
                                                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                                        <View style={{ flex: 0.1 }} />

                                                        <View style={{ flex: 3, height: '90%', alignItems: 'center', justifyContent: 'center' }}>

                                                            <ButtonComponent
                                                                style={{
                                                                    height: '100%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                                                    textAlign: 'center'
                                                                }}
                                                                isArabic={context.isArabic}
                                                                buttonClick={shwSrDetails}
                                                                textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.details)}
                                                            />

                                                        </View>

                                                        <View style={{ flex: 0.1 }} />

                                                        <View style={{ flex: 3, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                        </View>

                                                        <View style={{ flex: 0.1 }} />

                                                        <View style={{ flex: 2.8, height: '50%', alignItems: 'center', justifyContent: 'center' }}>

                                                        </View>

                                                        <View style={{ flex: 0.1 }} />

                                                    </View>
                                                    : null
                                            }

                                        </React.Fragment >
                                }
                            </View>

                        }
                    </View>

                }

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    textModal: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        position: 'absolute',
        // height: HEIGHT * 0.50,
        width: WIDTH * 0.85,
        // borderRadius: 15,
        //marginTop: 200,
        // backgroundColor: '#003a5d',
        backgroundColor: 'white',
        borderRadius: 5,
        zIndex: 8
    },
    alerttext: {
        fontSize: 18,
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        // textAlign: 'justify',
        // marginBottom: '5%',
        fontWeight: 'bold',
        color: 'white'
    },
    confirmMsg: {
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        fontSize: 15,
        color: 'black',
    },
    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    },
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
    },
    container: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(EstablishmentDetails);

