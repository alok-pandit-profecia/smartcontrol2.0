import React, { createRef, useRef, useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Modal, ScrollView, FlatList, TouchableOpacity, Text, ImageBackground, Dimensions, Linking, AppState, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath, mkdir, readDir } from 'react-native-fs';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import TextComponent from '../components/TextComponent';
import LocationPermissionModel from '../components/LocationPermissionModel';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import submissionPayload, { scoreCalculations, submissionPayloadFollow } from '../utils/payloads/ChecklistSubmitPayload';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor, isDev } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import CheckListSchema from './../database/CheckListSchema';
import LoginSchema from './../database/LoginSchema';
import FinalComponent from '../components/FinalComponent';
import ChecklistComponentStepOne from '../components/ChecklistComponentStepOne';
import AlertComponentForFoodAlert from '../components/AlertComponentForFoodAlert';
import DocumentationAndRecordComponent from '../components/DocumentationAndRecordComponent';
import SubmissionComponent from '../components/SubmissionComponent';
import AlertcomponentForFoodAlertSCD from '../components/AlertcomponentForFoodAlertSCD';
import TaskSchema from '../database/TaskSchema';
import EstablishmentSchema from './../database/EstablishmentSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import RNSettings from 'react-native-settings';
import AndroidOpenSettings from 'react-native-android-open-settings'
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import ButtonComponent from '../components/ButtonComponent';
import * as Animatable from 'react-native-animatable';
import TableComponent from './../components/TableComponent';
import FollowUpComponent from '../components/FollowUpComponent';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');
let clone = require('clone');
const { Popover } = renderers

let estSelectedItem: any = {};
let count1 = 0;

// a and b are javascript Date objects
function dateDiffInDaysSbl(a: any, b: any) {
    // Discard the time and time-zone information.
    let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    let temp = Math.floor((utc2 - utc1) / _MS_PER_DAY);
    let weekendCount = 0;
    for (let i = 0; i <= (temp); i++) {
        if (new Date(moment(utc1).add(i, 'day')).getDay() == 5 || new Date(moment(utc1).add(i, 'day')).getDay() == 6) {
            weekendCount++;
        }
    }

    let grace;
    if (temp < 0) {
        grace = 0;
    }
    else {
        grace = temp - weekendCount;
    }
    console.log("grace" + grace)
    return grace;
}

const StartInspection = (props: any) => {
    const context = useContext(Context);
    const checklistComponentStepOneRef = useRef(null);
    const documentRef = useRef(null);
    const isFocused = useIsFocused();

    // let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, efstDraft: rootStore.eftstModel, foodalertDraft: rootStore.foodAlertsModel, completedTaskDraft: rootStore.completdMyTaskModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, establishmentDraft: rootStore.establishmentModel, licenseMyTasksDraft: rootStore.licenseMyTaskModel, bottomBarDraft: rootStore.bottomBarModel, documantationDraft: rootStore.documentationAndReportModel, condemnationDraft: rootStore.condemnationModel, samplingDraft: rootStore.samplingModel, detentionDraft: rootStore.detentionModel })
    const { licenseMyTasksDraft, myTasksDraft, completedTaskDraft, adhocTaskEstablishmentDraft, efstDraft, foodalertDraft, establishmentDraft, bottomBarDraft, documantationDraft, condemnationDraft, detentionDraft, samplingDraft } = useInject(mapStore)
    let taskDetails: any = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
    // taskDetails.mappingData = taskDetails.mappingData && taskDetails.mappingData.length ? taskDetails.mappingData : [{}]
    let scoreGiven = false;

    const [modifiedCheckListData, setModifiedCheckListData] = useState(Array());
    const [sendModifiedCheckListData, setSendModifiedCheckListData] = useState(Array());
    const [taskLoading, setTaskLoading] = useState(true);
    const [priview, setPriview] = useState(false);
    const [skipSampling, setSkipSampling] = useState(false);
    const [skipCond, setSkipCond] = useState(false);
    const [skipDet, setSkipDet] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [alertObject, setAlertObject] = useState(Object());

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [count, setCount] = useState(0);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        Address: null
    });
    const [previewCheckList, setpreviewCheckList] = useState(Array());

    // alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [submitButtonClick, setSubmitButtonClick] = useState(false);
    const [showFoodAlert, setShowFoodAlert] = useState(false);
    const [alertApplicableToCurrentTask, setAlertApplicableToCurrentTask] = useState(false);
    const [showFoodAlertForSCD, setShowFoodAlertForSCD] = useState(false);
    const [turnOnLocation, setTurnOnLocation] = useState(false);
    const [isNeverAskLocationPermissionAlert, setNeverAskLocationPermissionAlert] = useState(false);
    const [allowedClick, setAllowedClick] = useState(true);
    const [turnOnNavigationButton, setTurnOnNavigationButton] = useState(false);
    const [submitBtnPress, setIsSubmitBtnPress] = useState(false);

    // regulation array of checklist
    const [regulationString, setRegulationString] = useState('');
    const [finalTime, setFinalTime] = useState('00:00:00');
    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''
    let taskStatus = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskStatus ? JSON.parse(myTasksDraft.selectedTask).TaskStatus : '' : ''

    let foodAlertResponse = foodalertDraft.alertResponse != '' ? JSON.parse(foodalertDraft.alertResponse) : [];
    let timerCounter: any;

    // let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];

    const _handleAppStateChange = async () => {
        debugger
        if (AppState.currentState === "active") {
            try {
                setTurnOnNavigationButton(false)
                // setMarkerLocation('')

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
                                    (position) => {
                                        myTasksDraft.setLatitude(position.coords.latitude.toString())
                                        myTasksDraft.setLongitude(position.coords.longitude.toString())

                                        //console.log(position.coords.latitude + ':' + position.coords.longitude);
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
                                        onPress: () => { NavigationService.navigate('Dashboard') },
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
                console.warn(err);
            }
        }
    };

    useEffect(() => {

        if (myTasksDraft.alertObject != '') {
            setAlertObject(JSON.parse(myTasksDraft.alertObject))
        }

    }, [myTasksDraft.alertObject])

    useEffect(() => {

        try {
            if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                if ((((taskType.toString().toLowerCase() == 'routine inspection')))) {
                    // myTasksDraft.setCheckListArray('')
                    let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                    if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData[0] && (tempInspectionDetail.mappingData[0].EFSTFlag == false)) {

                        if (modifiedCheckListData.length) {

                            if (!myTasksDraft.efstUpdate) {
                                Alert.alert("", context.isArabic ? ` ارجو تحديث تدريب العاملين` : "Please update EFST", [{
                                    text: "Ok",
                                    onPress: () => { fetchEfstData() },
                                    style: "cancel"
                                }], { cancelable: false })
                            }
                            //     setNavigateToStartInspection(false)
                        }
                    }
                }
            }
        } catch (error) {
            console.log("errorUseeffectisFocused>>" + error)

        }

    }, [isFocused])

    const displayCounter = () => {
        // console.log("timerCounter::" + typeof (startTime) + ",startTime>>" + startTime)
        timerCounter = setInterval(() => {
            if (typeof (startTime) == 'object') {
                let diff = Math.abs(Date.now() - startTime) / 1000;
                setFinalTime(finalTime => msToTime(diff))
            }
        }, 1000);
    }

    const backButtonHandler = (modifiedCheckListData: any) => {

        let timeElapsed = new Date();
        let obj: any = {};
        if (modifiedCheckListData.length) {
            obj.checkList = JSON.stringify(modifiedCheckListData);
            obj.taskId = myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId;
            obj.timeElapsed = timeElapsed.toString();
            obj.timeStarted = startTime.toString();
            debugger;
            // myTasksDraft.setCheckListArray(JSON.stringify(modifiedCheckListData))
            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            });
        }

    }

    const backButtonHandlerApp = () => {

        let timeElapsed = new Date();
        let obj: any = {};
        if (modifiedCheckListData.length) {
            obj.checkList = JSON.stringify(modifiedCheckListData);
            obj.taskId = myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId;
            obj.timeElapsed = timeElapsed.toString();
            obj.timeStarted = startTime.toString();
            debugger;
            console.log("obj.timeStarted" + obj.timeStarted)
            // myTasksDraft.setCheckListArray(JSON.stringify(modifiedCheckListData))
            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                NavigationService.goBack()
            });
        }

    }
    // console.log("myTasksDraft.campaignMappingData>>>>>>>>"+myTasksDraft.campaignMappingData)

    useEffect(() => {
        try {
            debugger;
            setAllowedClick(true);
            if (myTasksDraft.getIsSuccess()) {

                if (myTasksDraft.isMyTaskClick == 'campaign') {

                    myTasksDraft.setDataBlank()
                    saveDataInDB('')
                    setSubmitButtonClick(false)

                    let estListArray = JSON.parse(myTasksDraft.getEstListArray());
                    estSelectedItem.isUploaded = "true"
                    estSelectedItem.taskId = myTasksDraft.taskId
                    let arrayTemp: any = [];
                    arrayTemp.push(estSelectedItem);

                    RealmController.addEstablishmentDetails(realm, arrayTemp, EstablishmentSchema.name, () => {
                        // ToastAndroid.show('Task acknowldged successfully ', 1000);
                        let isUploaded = estListArray.map((item: any) => {
                            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, item.Id);

                            if (temp && temp['0']) {
                                return temp['0'].isUploaded
                            }
                        });
                        let temp = isUploaded.some((item: any) => item === 'false');

                        let flag = false, countOfCompleted = 0, mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                        if (mappingData.length) {
                            for (let index = 0; index < mappingData.length; index++) {
                                const element = mappingData[index];
                                if (element.isCompltedOffline) {
                                    countOfCompleted = countOfCompleted + 1;
                                }
                            }
                        }
                        if (countOfCompleted == mappingData.length) {

                            let taskDetails = { ...JSON.parse(myTasksDraft.selectedTask) }
                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                            // taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].isCompltedOffline = true;
                            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                            taskDetails.mappingData = mappingData;

                            // taskDetails.isCompleted = true;
                            // taskDetails.TaskStatus = 'Completed';
                            taskDetails.TaskId = myTasksDraft.campaignTaskId
                            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))

                            let newTaskArray = myTasksDraft.campaignList != '' ? JSON.parse(myTasksDraft.campaignList) : [];
                            newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.campaignTaskId);
                            myTasksDraft.setCampaignList(JSON.stringify(newTaskArray));
                            myTasksDraft.setCampaignCount(newTaskArray.length.toString())
                            // //console.log("stInsp2::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
                            // //console.log("stInsp2::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                            // //console.log("stInsp2::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                                NavigationService.navigate('Dashboard');

                            });
                        }
                        else {
                            let taskDetails = { ...JSON.parse(myTasksDraft.selectedTask) }
                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].isCompltedOffline = true;
                            // taskDetails.mappingData = true;


                            // taskDetails.isCompleted = false;
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.TaskId = myTasksDraft.taskId

                            taskDetails.mappingData = mappingData;
                            // console.log("stInsp1::" + JSON.stringify(myTasksDraft.campaignMappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)]))
                            // //console.log("stInsp1::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                            // //console.log("stInsp1::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                                NavigationService.navigate('CampaignDetails');

                            });
                        }
                        // if (temp) {

                        //     let taskDetails = { ...JSON.parse(myTasksDraft.selectedTask) }
                        //     let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                        //     mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].isCompltedOffline = true;
                        //     // taskDetails.mappingData = true;


                        //     taskDetails.isCompleted = false;
                        //     taskDetails.TaskStatus = 'InProgress';
                        //     taskDetails.TaskId = myTasksDraft.taskId

                        //     taskDetails.mappingData = mappingData;
                        //     // console.log("stInsp1::" + JSON.stringify(myTasksDraft.campaignMappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)]))
                        //     // //console.log("stInsp1::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                        //     // //console.log("stInsp1::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                        //     myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                        //     RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                        //         NavigationService.navigate('CampaignDetails');

                        //     });

                        // }
                        // else {

                        //     let taskDetails = { ...JSON.parse(myTasksDraft.selectedTask) }
                        //     let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                        //     // taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                        //     mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].isCompltedOffline = true;
                        //     myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                        //     taskDetails.mappingData = mappingData;

                        //     taskDetails.isCompleted = true;
                        //     taskDetails.TaskStatus = 'Completed';
                        //     taskDetails.TaskId = myTasksDraft.campaignTaskId
                        //     myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))

                        //     // //console.log("stInsp2::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
                        //     // //console.log("stInsp2::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                        //     // //console.log("stInsp2::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                        //     RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                        //         NavigationService.navigate('Dashboard');

                        //     });
                        // }


                        debugger

                        // NavigationService.navigate('Dashboard');

                    });
                }
            }

            if (myTasksDraft.state == 'navigate') {

                let taskDetails = { ...inspectionDetails }
                myTasksDraft.setState('pending');
                debugger;
                taskDetails.isCompleted = true;
                let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                mappingData.isCompltedOffline = true;
                taskDetails.mappingData = mappingData;

                let CompletedTaskArray = completedTaskDraft.completedTaskArray == '' ? [] : JSON.parse(completedTaskDraft.completedTaskArray)
                CompletedTaskArray.push(taskDetails);
                completedTaskDraft.setCompletedTaskArray(JSON.stringify(CompletedTaskArray));
                debugger
                licenseMyTasksDraft.setIsRejectBtnClick(false);
                setSubmitButtonClick(false)

                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                    licenseMyTasksDraft.setIsRejectBtnClick(false);
                    NavigationService.navigate('Dashboard');
                });
                // }
            }
            else if (myTasksDraft.state == 'failedToSubmit') {
                setSubmitButtonClick(false)
                Alert.alert("Failed to submit task", "Do you want to try again", [
                    {
                        text: "Cancel",
                        onPress: () => {
                            try {
                                if (myTasksDraft.taskSubmitted) {

                                    taskDetails.isCompleted = true;
                                    taskDetails.TaskStatus = 'Failed';
                                    const format1 = "lll"
                                    taskDetails.CompletionDate = moment().format(format1);

                                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                    });

                                    if (myTasksDraft.isMyTaskClick === 'myTask') {
                                        let newTaskArray = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setDataArray1(JSON.stringify(newTaskArray));
                                        myTasksDraft.setMyTaskCount(newTaskArray.length.toString());

                                        let newTaskArrayPast = myTasksDraft.dataArray1Past != '' ? JSON.parse(myTasksDraft.dataArray1Past) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setDataArray1Past(JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (myTasksDraft.isMyTaskClick === 'license') {
                                        let newTaskArray = myTasksDraft.NOCList != '' ? JSON.parse(myTasksDraft.NOCList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setNocList(JSON.stringify(newTaskArray));
                                        myTasksDraft.setLicenseCount(newTaskArray.length.toString());

                                        let newTaskArrayPast = myTasksDraft.NOCListPast != '' ? JSON.parse(myTasksDraft.NOCListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setNocListPast(JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (myTasksDraft.isMyTaskClick === 'case') {
                                        let newTaskArray = myTasksDraft.complaintAndFoodPosioningList != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(newTaskArray));
                                        myTasksDraft.setCaseCount(newTaskArray.length.toString());

                                        let newTaskArrayPast = myTasksDraft.complaintAndFoodPosioningListPast != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setComplaintAndFoodPosioningListPast(JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (myTasksDraft.isMyTaskClick === 'campaign') {
                                        let newTaskArray = myTasksDraft.campaignList != '' ? JSON.parse(myTasksDraft.campaignList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.campaignTaskId);
                                        myTasksDraft.setCampaignList(JSON.stringify(newTaskArray));
                                        // myTasksDraft.setCaseCount(newTaskArray.length.toString());

                                        let newTaskArrayPast = myTasksDraft.campaignListPast != '' ? JSON.parse(myTasksDraft.campaignListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setCampaignListPast(JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (myTasksDraft.isMyTaskClick === 'tempPermit') {
                                        let newTaskArray = myTasksDraft.eventsList != '' ? JSON.parse(myTasksDraft.eventsList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setTempPermitCount(newTaskArray.length.toString());
                                        myTasksDraft.setEventsList(JSON.stringify(newTaskArray));

                                        let newTaskArrayPast = myTasksDraft.eventsListPast != '' ? JSON.parse(myTasksDraft.eventsListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                        myTasksDraft.setEventsListPast(JSON.stringify(newTaskArrayPast));
                                    }

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
                                    myTasksDraft.setTaskSubmited(false)
                                    myTasksDraft.setLatitude('')
                                    myTasksDraft.setLongitude('')
                                    myTasksDraft.setPercentage('')
                                    myTasksDraft.setTotalScore('')
                                    myTasksDraft.setGrade('')
                                    myTasksDraft.setMaxScore('')
                                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                        NavigationService.navigate('Dashboard');
                                    });

                                }
                                else {
                                    NavigationService.goBack()
                                }
                            }
                            catch (error) {

                            }

                            // submitButtonPress(false) 
                        },
                        style: "cancel"
                    },
                    {
                        text: "Try again", onPress: () => {
                            myTasksDraft.setRetryCount((parseInt(myTasksDraft.retryCount) + 1).toString());
                            submitButtonPress(true, '')
                        }
                    }
                ],
                    { cancelable: false })
            }
        }
        catch (error) {
            setSubmitButtonClick(false)
            //console.log(error)
        }

    }, [myTasksDraft.state]);

    if ((myTasksDraft.isMyTaskClick != 'CompletedTask') && (finalTime == '00:00:00') && ((myTasksDraft.checkListArray != '') || (licenseMyTasksDraft.checkListArray != ''))) {
        displayCounter()
    }

    useEffect(() => {

        try {
            estSelectedItem = adhocTaskEstablishmentDraft.getSelectedItem() != '' ? JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()) : {};
            myTasksDraft.setCount("1");
            setAllowedClick(false);
            // if (myTasksDraft.isMyTaskClick == 'campaign') {
            //     clearData()
            // }
            myTasksDraft.setLoadingState('Fetching Checklist')
            if (foodAlertResponse.length && !myTasksDraft.isAlertApplicable && myTasksDraft.isMyTaskClick != 'CompletedTask') {
                if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection') {
                    setShowFoodAlert(true);
                }
            }
            debugger;
            if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
                debugger
                NavigationService.goBack();
                // setTaskLoading(false);
                // myTasksDraft.setState('pending')
            }
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
            if (checkListData && checkListData['0']) {
                myTasksDraft.setLoadingState('')
                let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false;
                if (completedTask) {
                    myTasksDraft.setIsMyTaskClick('CompletedTask')
                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                        myTasksDraft.setFinalComment(checkListData['0'].overallcomment ? checkListData['0'].overallcomment : '')
                        myTasksDraft.setContactName(checkListData['0'].contactname ? checkListData['0'].contactname : '')
                        myTasksDraft.setMobileNumber(checkListData['0'].contactnumber ? checkListData['0'].contactnumber : '')
                        myTasksDraft.setEmiratesId(checkListData['0'].eid ? checkListData['0'].eid : '')
                        documantationDraft.setFileBuffer(checkListData['0'].sign ? checkListData['0'].sign : '')
                    }
                }
                else {
                    if (taskType.toLowerCase() == "supervisory inspections") {
                        let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
                        let inspectionDetails = objct['0'] ? objct['0'] : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                        let mappingData = inspectionDetails.mappingData ? typeof (inspectionDetails.mappingData) == 'string' ? JSON.parse(inspectionDetails.mappingData) : inspectionDetails.mappingData : [{}];

                        if (mappingData[0].superVisorySelectedEst) {
                            myTasksDraft.setVisitType(mappingData[0].superVisorySelectedEst)
                        }
                    }
                }
                timeStarted = checkListData['0'].timeStarted;
                timeElapsed = checkListData['0'].timeElapsed;

                let temp, time: any;
                if (timeStarted != '') {
                    temp = new Date(timeStarted).getTime();
                    time = new Date(timeElapsed).getTime() - temp;
                } else {
                    temp = new Date().getTime();
                    time = temp - new Date(timeElapsed).getTime();
                }
                // startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
                setStartTime(moment().subtract((parseInt(time) / 1000), 'seconds').toDate())

                setModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                setSendModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                myTasksDraft.setCheckListArray(checkListData['0'] ? (checkListData['0'].checkList) : '');
                if (myTasksDraft.isAlertApplicable || myTasksDraft.isMyTaskClick == 'CompletedTask') {
                    setTaskLoading(false)
                }
                if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                    displayCounter()
                }

            }
            else {
                setStartTime(new Date());
                // myTasksDraft.setLoadingState('')
                if (myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isAlertApplicable) {
                    setTaskLoading(false)
                }
                if ((myTasksDraft.isMyTaskClick != 'CompletedTask') && (myTasksDraft.checkListArray != '' || licenseMyTasksDraft.checkListArray != '')) {
                    displayCounter()
                    if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                        if ((((taskType.toString().toLowerCase() == 'routine inspection')))) {
                            // myTasksDraft.setCheckListArray('')
                            let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                            if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData[0] && (tempInspectionDetail.mappingData[0].EFSTFlag == false)) {
                                // myTasksDraft.setLoadingState('Fetching Checklist')
                                // NavigationService.navigate('StartInspection')
                                // }
                                // else {
                                //     setIsClick(prevState => {
                                //         return { ...prevState, estClick: true, inspClick: false }
                                //     });
                                Alert.alert("", context.isArabic ? ` ارجو تحديث تدريب العاملين` : "Please update EFST", [{
                                    text: "Ok",
                                    onPress: () => { fetchEfstData() },
                                    style: "cancel"
                                }], { cancelable: false })
                                //     setNavigateToStartInspection(false)
                                // }
                            }
                        }
                    }
                }
            }
            if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                if (myTasksDraft.checkListArray != '' || licenseMyTasksDraft.checkListArray != '') {
                    myTasksDraft.setLoadingState('')
                    displayCounter();
                }
            }
            if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                // myTasksDraft.setLoadingState('')
                RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
                    if (result == RNSettings.ENABLED) {

                        Geolocation.getCurrentPosition(
                            (position) => {
                                myTasksDraft.setLatitude(position.coords.latitude.toString())
                                myTasksDraft.setLongitude(position.coords.longitude.toString())

                                //console.log(position.coords.latitude + ':' + position.coords.longitude);
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
                                onPress: () => { NavigationService.navigate('Dashboard') },
                                style: "cancel"
                            },
                            { text: "OK", onPress: () => AndroidOpenSettings.locationSourceSettings() }
                        ],
                            { cancelable: false })
                    }
                });

                _handleAppStateChange()

                AppState.addEventListener("focus", _handleAppStateChange);
            }
        } catch (error) {
            console.log("errorUseeffect[]>>" + error)
        }
        return () => {
            clearInterval(timerCounter)
            AppState.removeEventListener("focus", _handleAppStateChange);
        };
    }, []);


    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backButtonHandlerApp);
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", backButtonHandlerApp);
        };
    }, [backButtonHandlerApp]);

    useEffect(() => {
        if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
            myTasksDraft.setLoadingState('')
            myTasksDraft.setState('done')
            NavigationService.goBack()
        }
    }, [myTasksDraft.noCheckList]);

    const dateDiffInDays = (a: any, b: any) => {
        // Discard the time and time-zone information.
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        a = new Date(a);
        var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);

    }

    const fetchEfstData = () => {
        try {
            let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
            let licenseCode = inspectionDetails.LicenseCode ? inspectionDetails.LicenseCode : tempInspectionDetail.LicenseCode;
            efstDraft.callToFetchEfstDataService(licenseCode);
            NavigationService.navigate('efstDetails', { 'licenseNum': licenseCode });

        } catch (error) {
            console.log("fetchEfstDataerror", error);
        }
    }

    useEffect(() => {
        debugger;
        try {
            // alert(myTasksDraft.noCheckList)
            if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
                debugger
                myTasksDraft.setLoadingState('')
                NavigationService.goBack()
                // setTaskLoading(false)
                // myTasksDraft.setState('pending')
            }
            if ((myTasksDraft.checkListArray != '') || (licenseMyTasksDraft.checkListArray != '')) {
                setTaskLoading(false)
                myTasksDraft.setLoadingState('')

                setAllowedClick(true);
                // let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : "";
                let temp: any = Array();
                let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
                let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)

                let mappingData = [];
                if (myTasksDraft.isMyTaskClick == 'campaign') {
                    mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : ''
                } else {
                    mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
                }
                inspectionDetails.mappingData = mappingData;

                let mappingDataIndex = '0';
                if (myTasksDraft.isMyTaskClick == 'campaign') {
                    mappingDataIndex = myTasksDraft.campaignSelectedEstIndex;
                }
                let dataLoggerCBValue = mappingData[mappingDataIndex].dataLoggerCBValue ? mappingData[mappingDataIndex].dataLoggerCBValue : false;
                let flashlightCBValue = mappingData[mappingDataIndex].flashlightCBValue ? mappingData[mappingDataIndex].flashlightCBValue : false;
                let luxmeterCBValue = mappingData[mappingDataIndex].luxmeterCBValue ? mappingData[mappingDataIndex].luxmeterCBValue : false;
                let thermometerCBValue = mappingData[mappingDataIndex].thermometerCBValue ? mappingData[mappingDataIndex].thermometerCBValue : false;
                let UVlightCBValue = mappingData[mappingDataIndex].UVlightCBValue ? mappingData[mappingDataIndex].UVlightCBValue : false;
                if (mappingData && mappingData[mappingDataIndex]) {
                    if (mappingData[mappingDataIndex].samplingReport) {
                        samplingDraft.setSamplingArray(JSON.stringify(mappingData[mappingDataIndex].samplingReport))
                    }
                    // alert(JSON.stringify(mappingData[mappingDataIndex].condemnationReport))
                    if (mappingData[mappingDataIndex].condemnationReport) {
                        condemnationDraft.setCondemnationArray(JSON.stringify(mappingData[mappingDataIndex].condemnationReport))
                    }
                    if (mappingData[mappingDataIndex].detentionReport) {
                        detentionDraft.setDetentionArray(JSON.stringify(mappingData[mappingDataIndex].detentionReport))
                    }
                    // //console.log("detanArr::" + JSON.stringify(mappingData[mappingDataIndex].detentionReport))
                }

                // tempObjct[mappingDataIndex].condemnationReport = JSON.parse(condemnationDraft.condemnationArray)
                // tempObjct[mappingDataIndex].detentionReport = JSON.parse(detentionDraft.detentionArray)
                // tempObjct[mappingDataIndex].samplingReport = JSON.parse(samplingDraft.samplingArray)
                let contactName = mappingData[mappingDataIndex] && mappingData[mappingDataIndex].ContactName ? mappingData[mappingDataIndex].ContactName : '';

                let contactNumber = mappingData[mappingDataIndex] && mappingData[mappingDataIndex].ContactNumber ? mappingData[mappingDataIndex].ContactNumber : '';
                let emirateId = mappingData[mappingDataIndex] && mappingData[mappingDataIndex].EmiratesId ? mappingData[mappingDataIndex].EmiratesId : '';
                if (inspectionDetails.mappingData && inspectionDetails.mappingData[mappingDataIndex] && inspectionDetails.mappingData[mappingDataIndex].finalResult) {
                    myTasksDraft.setResult(inspectionDetails.mappingData[mappingDataIndex].finalResult.toString())
                }

                if (!myTasksDraft.historyChecklist) {
                    myTasksDraft.setContactName(contactName);
                    myTasksDraft.setMobileNumber(contactNumber.toString());
                    myTasksDraft.setEmiratesId(emirateId);

                    myTasksDraft.setFlashlightValue(flashlightCBValue);
                    myTasksDraft.setDataLoggerCBValue(dataLoggerCBValue);
                    myTasksDraft.setLuxmeterCBValue(luxmeterCBValue);
                    myTasksDraft.setThermometerCBValue(thermometerCBValue);
                    myTasksDraft.setUVlightCBValue(UVlightCBValue);
                }

                if ((taskType.toLowerCase() == "noc inspection_ara" || taskType.toLowerCase() == "noc inspection" || taskType.toLowerCase() == "temporary noc inspection" || taskType == 'تفتيش ترخيص' || taskType == 'تفتيش ترخيص مؤقت' || taskType.toLowerCase() == "food poisoning" || taskType.toLowerCase() == "food poison")) {
                    setTaskLoading(false);
                    // if ((myTasksDraft.isMyTaskClick != 'CompletedTask') && (myTasksDraft.checkListArray != '' || licenseMyTasksDraft.checkListArray != '')) {
                    //     setStartTime(moment().format('llll'));
                    //     displayCounter()
                    // }
                    debugger
                    // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
                    // inspectionDetails.mappingData = mappingData;

                    setInspectionDetails(inspectionDetails);
                    myTasksDraft.setFinalComment(inspectionDetails.mappingData['0'].overallComments)
                    // documantationDraft.setFileBuffer((inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) ? inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64 : '')
                    if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) {
                        documantationDraft.setFileBuffer(inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64)
                    }
                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                    if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
                        let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false
                        if (completedTask) {
                            myTasksDraft.setIsMyTaskClick('CompletedTask')
                        }
                        timeStarted = checkListData['0'].timeStarted;
                        timeElapsed = checkListData['0'].timeElapsed;
                        let temp, time: any;
                        if (timeStarted != '') {
                            temp = new Date(timeStarted).getTime();
                            time = new Date(timeElapsed).getTime() - temp;
                        } else {
                            temp = new Date().getTime();
                            time = temp - new Date(timeElapsed).getTime();
                        }

                        setStartTime(moment().subtract(parseInt(time / 1000), 'seconds').toDate())
                        // startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
                        // console.warn("startTimed;dddddddddd::" + startTime + "timeStarted::" + checkListData['0'].timeStarted + "," + "timeElapsed::" + checkListData['0'].timeElapsed + "time::" + time)
                        setModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                        setSendModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                    }
                    else {
                        temp = licenseMyTasksDraft.checkListArray != '' ? JSON.parse(licenseMyTasksDraft.checkListArray) : [];
                        setModifiedCheckListData(temp);
                        setSendModifiedCheckListData(temp);
                        displayCounter();

                    }
                }
                else if ((taskType.toLowerCase() == "supervisory inspections" || taskType.toLowerCase() == "monitor inspector performance")) {

                    setTaskLoading(false);

                    debugger;
                    // alert(JSON.stringify(inspection.mappingData))
                    // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
                    // inspectionDetails.mappingData = mappingData;

                    setInspectionDetails(inspectionDetails);
                    myTasksDraft.setFinalComment(inspectionDetails.mappingData['0'].overallComments)
                    // documantationDraft.setFileBuffer((inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) ? inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64 : '')
                    if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) {
                        documantationDraft.setFileBuffer(inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64)
                    }
                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                    if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].superVisorySelectedEst) {
                        myTasksDraft.setVisitType(inspectionDetails.mappingData['0'].superVisorySelectedEst)
                    }

                    try {

                        if (checkListData && checkListData['0']) {
                            let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false
                            if (completedTask) {
                                myTasksDraft.setIsMyTaskClick('CompletedTask')
                            }
                            timeStarted = checkListData['0'].timeStarted;
                            timeElapsed = checkListData['0'].timeElapsed;
                            let temp, time: any;
                            if (timeStarted != '') {
                                temp = new Date(timeStarted).getTime();
                                time = new Date(timeElapsed).getTime() - temp;
                            } else {
                                temp = new Date().getTime();
                                time = temp - new Date(timeElapsed).getTime();
                            }

                            setStartTime(moment().subtract(parseInt(time / 1000), 'seconds').toDate())
                            // startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
                            console.warn("startTime::" + startTime + "timeStarted::" + checkListData['0'].timeStarted + "," + "timeElapsed::" + checkListData['0'].timeElapsed + "time::" + time)
                            setModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                            setSendModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);

                        }
                        else {

                            temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
                            setModifiedCheckListData(temp);
                            setSendModifiedCheckListData(temp);

                        }
                    }
                    catch (e) {
                        console.log(e)
                    }
                }
                else if ((taskType.toLowerCase() == "bazar inspection")) {

                    setTaskLoading(false);

                    debugger;
                    // alert(JSON.stringify("inspection.mappingData"))
                    // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
                    // inspectionDetails.mappingData = mappingData;

                    setInspectionDetails(inspectionDetails);

                    if (inspectionDetails.mappingData && inspectionDetails.mappingData['0']) {

                        myTasksDraft.setFinalComment(inspectionDetails.mappingData['0'].overallComments ? inspectionDetails.mappingData['0'].overallComments : "")
                        // documantationDraft.setFileBuffer((inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) ? inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64 : '')
                        if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) {
                            documantationDraft.setFileBuffer(inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64)
                        }
                    }

                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                    // alert(JSON.stringify(checkListData['0'].checkList));

                    try {

                        if (checkListData && checkListData['0']) {
                            let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false;
                            if (completedTask) {
                                myTasksDraft.setIsMyTaskClick('CompletedTask')
                            }
                            timeStarted = checkListData['0'].timeStarted;
                            timeElapsed = checkListData['0'].timeElapsed;
                            let temp, time: any;
                            if (timeStarted != '') {
                                temp = new Date(timeStarted).getTime();
                                time = new Date(timeElapsed).getTime() - temp;
                            } else {
                                temp = new Date().getTime();
                                time = temp - new Date(timeElapsed).getTime();
                            }

                            setStartTime(moment().subtract(parseInt(time / 1000), 'seconds').toDate())
                            // startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
                            console.warn("startTime::" + startTime + "timeStarted::" + checkListData['0'].timeStarted + "," + "timeElapsed::" + checkListData['0'].timeElapsed + "time::" + time)
                            setModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                            setSendModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
                            console.log('setSendModifiedCheckListData ::' + JSON.parse(checkListData['0'].checkList).length);

                        }
                        else {

                            temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
                            setModifiedCheckListData(temp);
                            setSendModifiedCheckListData(temp);

                        }
                    }
                    catch (e) {
                        console.log(e)
                    }
                }
                else {
                    temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];

                    let mappingDataIndex = '0';

                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                        mappingDataIndex = myTasksDraft.campaignSelectedEstIndex;
                    }

                    let mappingData = [];
                    if (myTasksDraft.isMyTaskClick == 'campaign') {
                        mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : []
                        if (mappingData.length) {
                            if (mappingData && mappingData[mappingDataIndex] && mappingData[mappingDataIndex].overallComments) {
                                myTasksDraft.setFinalComment(mappingData[mappingDataIndex].overallComments)
                            }
                            if (mappingData && mappingData[mappingDataIndex] && mappingData[mappingDataIndex].signatureBase64) {
                                documantationDraft.setFileBuffer(mappingData[mappingDataIndex].signatureBase64)
                            }
                            // console.log('campaignFileBuffer ::' + mappingData[mappingDataIndex].signatureBase64 + "<<<<<" + mappingData[mappingDataIndex].overallComments)
                        }
                        inspectionDetails.mappingData = mappingData;
                    }
                    else {
                        if (inspectionDetails.mappingData && inspectionDetails.mappingData[mappingDataIndex] && inspectionDetails.mappingData[mappingDataIndex].overallComments) {
                            myTasksDraft.setFinalComment(inspectionDetails.mappingData[mappingDataIndex].overallComments)
                        }
                        if (inspectionDetails.mappingData && inspectionDetails.mappingData[mappingDataIndex] && inspectionDetails.mappingData[mappingDataIndex].signatureBase64) {
                            documantationDraft.setFileBuffer(inspectionDetails.mappingData[mappingDataIndex].signatureBase64)
                        }
                        if (inspectionDetails.mappingData && inspectionDetails.mappingData[mappingDataIndex] && inspectionDetails.mappingData[mappingDataIndex].grade_percentage) {
                            myTasksDraft.setPercentage(inspectionDetails.mappingData[mappingDataIndex].grade_percentage.toString())
                        }
                        if (inspectionDetails.mappingData && inspectionDetails.mappingData[mappingDataIndex] && inspectionDetails.mappingData[mappingDataIndex].total_score) {
                            myTasksDraft.setTotalScore(inspectionDetails.mappingData[mappingDataIndex].total_score.toString())
                        }
                    }

                    // //console.log('inspectionDetails' + JSON.stringify(inspectionDetails.mappingData[mappingDataIndex]))

                    debugger

                    let taskDetails = { ...inspectionDetails }
                    // let temp: any = [];
                    // alert(JSON.stringify(myTasksDraft.checkListArray))
                    if (temp && temp.length > 0) {

                        debugger;
                        // let Obj = { ...taskDetails };
                        let mappingData = [];
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : []
                        } else {
                            mappingData = (taskDetails.mappingData && (taskDetails.mappingData != '') && (typeof (taskDetails.mappingData) == 'string')) ? JSON.parse(taskDetails.mappingData) : [{}];
                        }
                        debugger;

                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                        // alert(JSON.stringify(checkListData['0'].checkList));

                        try {

                            if (checkListData && checkListData['0']) {
                                let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false
                                if (completedTask) {
                                    myTasksDraft.setIsMyTaskClick('CompletedTask')
                                }
                                timeStarted = checkListData['0'].timeStarted;
                                timeElapsed = checkListData['0'].timeElapsed;
                                let temp, time: any;
                                if (timeStarted != '') {
                                    temp = new Date(timeStarted).getTime();
                                    time = new Date(timeElapsed).getTime() - temp;
                                }
                                else {
                                    temp = new Date().getTime();
                                    time = temp - new Date(timeElapsed).getTime();
                                }

                                setStartTime(moment().subtract(parseInt(time / 1000), 'seconds').toDate())
                                // startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
                                console.warn("startTime::" + startTime + "timeStarted::" + checkListData['0'].timeStarted + "," + "timeElapsed::" + checkListData['0'].timeElapsed + "time::" + time)
                                let checkListArr: any = checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : [];
                                if (taskType == 'Follow-Up') {
                                    for (let i = 0; i < checkListArr.length; i++) {
                                        if (checkListArr[i].GracePeriodDate) {
                                            let g = dateDiffInDays(new Date(), new Date(checkListArr[i].GracePeriodDate));
                                            if (g < 0) {
                                                g = 0;
                                            }
                                            checkListArr[i].GracePeriod = g;
                                        }
                                        else {
                                            checkListArr[i].GracePeriod = '';
                                        }
                                    }
                                    setModifiedCheckListData(checkListArr);
                                    setSendModifiedCheckListData(checkListArr);
                                    if (checkListArr.length) {
                                        saveDataInDB('');
                                    }

                                    if (myTasksDraft.isMyTaskClick != 'CompletedTask') {

                                        if ((((taskType.toString().toLowerCase() == 'routine inspection')))) {
                                            // myTasksDraft.setCheckListArray('')
                                            let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                                            if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData[0] && (tempInspectionDetail.mappingData[0].EFSTFlag == false)) {
                                                // myTasksDraft.setLoadingState('Fetching Checklist')
                                                // NavigationService.navigate('StartInspection')
                                                // }
                                                // else {
                                                //     setIsClick(prevState => {
                                                //         return { ...prevState, estClick: true, inspClick: false }
                                                //     });
                                                Alert.alert("", context.isArabic ? ` ارجو تحديث تدريب العاملين` : "Please update EFST", [{
                                                    text: "Ok",
                                                    onPress: () => { fetchEfstData() },
                                                    style: "cancel"
                                                }], { cancelable: false })
                                                //     setNavigateToStartInspection(false)
                                                // }
                                            }
                                        }
                                    }
                                }
                                else {
                                    setModifiedCheckListData(checkListArr);
                                    setSendModifiedCheckListData(checkListArr);
                                    if (myTasksDraft.isMyTaskClick != 'CompletedTask') {

                                        if ((((taskType.toString().toLowerCase() == 'routine inspection')))) {
                                            // myTasksDraft.setCheckListArray('')
                                            let tempInspectionDetail = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                                            if (tempInspectionDetail.mappingData && tempInspectionDetail.mappingData[0] && (tempInspectionDetail.mappingData[0].EFSTFlag == false)) {
                                                // myTasksDraft.setLoadingState('Fetching Checklist')
                                                // NavigationService.navigate('StartInspection')
                                                // }
                                                // else {
                                                //     setIsClick(prevState => {
                                                //         return { ...prevState, estClick: true, inspClick: false }
                                                //     });
                                                Alert.alert("", context.isArabic ? ` ارجو تحديث تدريب العاملين` : "Please update EFST", [{
                                                    text: "Ok",
                                                    onPress: () => { fetchEfstData() },
                                                    style: "cancel"
                                                }], { cancelable: false })
                                                //     setNavigateToStartInspection(false)
                                                // }
                                            }
                                        }
                                    }
                                }

                            }
                            else {

                                temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
                                if (taskType == 'Follow-Up') {
                                    for (let i = 0; i < temp.length; i++) {
                                        // let objTemp = element.data[i];
                                        if (temp[i].GracePeriodDate) {
                                            // let g = dateDiffInDaysSbl(new Date(), new Date(temp[i].GracePeriodDate));
                                            let g = dateDiffInDays(new Date(), new Date(temp[i].GracePeriodDate));
                                            if (g < 0) {
                                                g = 0;
                                            }
                                            temp[i].GracePeriod = g;
                                        }
                                        else {
                                            temp[i].GracePeriod = '';
                                        }
                                    }
                                    setModifiedCheckListData(temp);
                                    setSendModifiedCheckListData(temp);
                                    if (temp.length) {
                                        saveDataInDB('');
                                    }
                                }
                                else {
                                    setModifiedCheckListData(temp);
                                    setSendModifiedCheckListData(temp);
                                }

                            }
                        }
                        catch (e) {
                            console.log(e)
                        }
                        // startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
                        // console.warn("startTime::" + startTime + "timeStarted::" + checkListData['0'].timeStarted + "," + "timeElapsed::" + checkListData['0'].timeElapsed + "time::" + time)

                        if (mappingData) {
                            // taskDetails.mappingData = mappingData;
                            if (myTasksDraft.isMyTaskClick == 'campaign') {
                                mappingData[mappingDataIndex].inspectionForm = temp;
                                taskDetails.mappingData = mappingData;
                                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                            }
                            else {
                                for (let index = 0; index < taskDetails.mappingData.length; index++) {
                                    taskDetails.mappingData[mappingDataIndex].inspectionForm = temp;
                                }
                            }
                            // taskDetails.mappingData['0'] = newData;
                            debugger;
                        }
                        else {
                            if (taskDetails.TaskId) {
                                taskDetails.mappingData = [{
                                    inspectionForm: temp
                                }]
                            }
                            else {
                                taskDetails = JSON.parse(myTasksDraft.selectedTask)
                                taskDetails.mappingData = [{
                                    inspectionForm: temp
                                }]
                            }
                        }

                        myTasksDraft.setState('done');

                        // alert((( (taskDetails.mappingData))))

                        // alert(JSON.stringify(taskDetails.mappingData));
                        // let obj: any = {};
                        // obj.checkList = JSON.stringify(temp);
                        // obj.taskId = myTasksDraft.taskId;
                        // obj.timeElapsed = '';
                        // obj.timeStarted = '';

                        // RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                        //     // ToastAndroid.show('Task added to db successfully', 1000);
                        // });

                        // //console.log("stInsp6::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
                        // //console.log("stInsp6::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                        // //console.log("stInsp6::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                            // ToastAndroid.show('Task objct successfully ', 1000);
                        });
                        if ((taskType.toLowerCase() == 'direct inspection') && (myTasksDraft.isMyTaskClick != 'CompletedTask')) {
                            callToInProgress(inspectionDetails)
                        }
                        setInspectionDetails(inspectionDetails);

                        // setModifiedCheckListData(temp);
                        // setTaskLoading(false)
                        // setSendModifiedCheckListData(temp);
                    }
                }
                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))

                if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                    if (myTasksDraft.checkListArray != '' || licenseMyTasksDraft.checkListArray != '') {
                        displayCounter();

                    }
                    setTaskLoading(false)

                }
                else {

                    if (myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isAlertApplicable) {
                        myTasksDraft.setLoadingState('')
                        setTaskLoading(false)
                    }
                    else {
                        setTaskLoading(true)
                        // myTasksDraft.setLoadingState('')

                    }
                }
                myTasksDraft.setState('done');
                // }
            }
        }
        catch (e) {
            console.log('Exception ::::' + e);
        }
    }, [myTasksDraft.checkListArray, myTasksDraft.noCheckList, licenseMyTasksDraft.checkListArray]);//myTasksDraft.checkListArray


    // useEffect(() => {

    //     if (samplingDraft.state == 'navigate' && submitBtnPress && submitBtnPress == true) {
    //         let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
    //         let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
    //         inspectionDetails.samplingFlag = true;
    //         //console.log("sampSubNavi::"+JSON.stringify(inspectionDetails.mappingData[0].samplingReport))
    //         myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
    //         RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
    //             // ToastAndroid.show('Task updated successfully ', 1000);
    //             samplingDraft.setState("done");
    //             submit(true, '', 'samplinSuccess');
    //         });
    //     }
    //     else if (samplingDraft.state == 'error'&& submitBtnPress && submitBtnPress == true) {
    //         submit(true, '', 'samplinSuccess');
    //     }

    // }, [isFocused, samplingDraft.state])
    // setInterval(()=>{ 
    //     if (modifiedCheckListData.length) {
    //         let tempArray: any = [...modifiedCheckListData], taskDetails = { ...inspectionDetails };
    //         debugger
    //         if (taskDetails.mappingData) {
    //             let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
    //             mappingData['0'].inspectionForm = tempArray;
    //             taskDetails.mappingData = mappingData;
    //             // RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
    //                 saveDataInDB();
    //                 // ToastAndroid.show('Task objct successfully ', 1000);
    //             // });
    //         }
    //         setInspectionDetails(taskDetails);
    //         setModifiedCheckListData(tempArray);
    //     }
    // },30000)

    const msToTime = (duration: any) => {

        let milliseconds = (parseInt(duration) % 1000) / 100;
        let seconds: any = Math.floor((parseInt(duration) / 1) % 60);
        let minutes: any = Math.floor((parseInt(duration) / (1 * 60)) % 60);
        let hours: any = Math.floor((parseInt(duration) / (1 * 60 * 60)) % 24);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    const onRegulationClick = (item: any) => {
        debugger
        let tempArray: any = [...modifiedCheckListData];
        let header = item.parameterno;
        let sectionIndex = tempArray.findIndex((item: any) => item.parameterno == header);
        debugger

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(sectionIndex);

        let regulationArray = tempArray[sectionIndex].regulation;
        let tempRegulationString = '';
        if (regulationArray && regulationArray.length > 0) {
            for (let index = 0; index < regulationArray.length; index++) {
                debugger
                if (index == 0) {
                    tempRegulationString = regulationArray[index];
                }
                if (index == 1) {
                    tempRegulationString = tempRegulationString + ", " + regulationArray[index];
                }
            }
            setRegulationString(tempRegulationString)
        }

        setShowRegulationAlert(true);
        setShowScoreAlert(false);
        setShowCommentAlert(false);
        setShowInformationAlert(false);
        setShowGraceAlert(false);
    }

    const callToInProgress = (taskDetails: any) => {
        try {
            if (taskDetails && taskDetails.TaskStatus != 'InProgress') {
                let temp = [], temp1 = [];
                taskDetails.TaskStatus = 'InProgress';
                if (myTasksDraft.isMyTaskClick == 'myTask') {
                    if (myTasksDraft.dataArray1 != '') {
                        temp = JSON.parse(myTasksDraft.dataArray1);
                        let sectionIndex = temp.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        console.log('onClickScoreListItem' + JSON.stringify(sectionIndex));
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp[sectionIndex] = taskDetails;
                            myTasksDraft.setDataArray1(JSON.stringify(temp));
                        }
                    }
                    if (myTasksDraft.dataArray1Past != '') {
                        temp1 = JSON.parse(myTasksDraft.dataArray1Past);
                        let sectionIndex = temp1.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp1[sectionIndex] = taskDetails;
                            myTasksDraft.setDataArray1Past(JSON.stringify(temp1));
                        }
                    }
                }
                else if (myTasksDraft.isMyTaskClick == 'case') {
                    if (myTasksDraft.complaintAndFoodPosioningList != '') {
                        temp = JSON.parse(myTasksDraft.complaintAndFoodPosioningList);
                        temp1 = JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast);
                        let sectionIndex = JSON.parse(myTasksDraft.complaintAndFoodPosioningList).findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp[sectionIndex] = taskDetails;
                            temp1[sectionIndex] = taskDetails;
                            myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(temp));
                        }
                    }
                    if (myTasksDraft.complaintAndFoodPosioningListPast != '') {
                        temp1 = JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast);
                        let sectionIndex = temp1.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp1[sectionIndex] = taskDetails;
                            myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(temp1));
                        }
                    }

                }
                else if (myTasksDraft.isMyTaskClick == 'license') {

                    if (myTasksDraft.NOCList != '') {
                        temp = JSON.parse(myTasksDraft.NOCList);
                        let sectionIndex = JSON.parse(myTasksDraft.NOCList).findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp[sectionIndex] = taskDetails;
                            myTasksDraft.setNocList(JSON.stringify(temp));
                        }
                    }
                    if (myTasksDraft.NOCListPast != '') {
                        temp1 = JSON.parse(myTasksDraft.NOCListPast);
                        let sectionIndex = temp1.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp1[sectionIndex] = taskDetails;
                            myTasksDraft.setNocListPast(JSON.stringify(temp1));
                        }
                    }

                }
                else if (myTasksDraft.isMyTaskClick == 'tempPermit') {
                    if (myTasksDraft.eventsList != '') {
                        temp = JSON.parse(myTasksDraft.eventsList);
                        let sectionIndex = temp.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp[sectionIndex] = taskDetails;
                            myTasksDraft.setEventsList(JSON.stringify(temp));
                        }
                    }
                    if (myTasksDraft.eventsListPast != '') {
                        temp1 = JSON.parse(myTasksDraft.eventsListPast);
                        let sectionIndex = temp1.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp1[sectionIndex] = taskDetails;
                            myTasksDraft.setEventsListPast(JSON.stringify(temp1));
                        }
                    }

                }
                else if (myTasksDraft.isMyTaskClick == 'campaign') {
                    if (myTasksDraft.campaignList != '') {
                        temp = JSON.parse(myTasksDraft.campaignList);
                        let sectionIndex = temp.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp[sectionIndex] = taskDetails;
                            myTasksDraft.setCampaignList(JSON.stringify(temp));
                        }
                    }
                    if (myTasksDraft.campaignListPast != '') {
                        temp1 = JSON.parse(myTasksDraft.campaignListPast);
                        let sectionIndex = temp1.findIndex((item: any) => item.TaskId == taskDetails.TaskId);
                        if (sectionIndex > -1) {
                            taskDetails.TaskStatus = 'InProgress';
                            taskDetails.completionDateWithDayRemaining = temp[sectionIndex].completionDateWithDayRemaining;
                            taskDetails.CompletionDate = temp[sectionIndex].CompletionDate;
                            temp1[sectionIndex] = taskDetails;
                            myTasksDraft.setCampaignListPast(JSON.stringify(temp));
                        }
                    }
                }

                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                    // ToastAndroid.show('Task objct successfully ', 1000);
                });
            }
        } catch (error) {

        }
    }

    const onClickScoreListItem = (item: any) => {
        setShowScoreAlert(false);
        let tempArray: any = [...modifiedCheckListData];
        debugger;
        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        // setComment(tempArray[currentSection].comment);
        debugger
        let taskDetails = { ...inspectionDetails };
        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            if (myTasksDraft.isMyTaskClick == 'campaign') {
                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                taskDetails.mappingData = mappingData;
            }
            else {
                mappingData['0'].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
            }
            // console.log("stInsp8::" + (taskDetails.mappingData))
            //console.log("stInsp8::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
            //console.log("stInsp8::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }
        scoreGiven = true;


        callToInProgress(taskDetails);

        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const onComplianceClick = (item: any) => {

        let tempArray: any = [...modifiedCheckListData];

        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

            let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            debugger
            // alert(JSON.stringify(item))
            let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
            inspectionDetails.mappingData = mappingData;

            debugger;
            tempArray = tempArray.map((u: any) => u.NOC_parameter_sl_no !== item.NOC_parameter_sl_no ? u : item);
            // setComment(tempArray[currentSection].comment);
        }
        else if (taskType.toLowerCase() == 'supervisory inspections') {

            let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            debugger
            // alert(JSON.stringify(inspection.mappingData))
            let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
            inspectionDetails.mappingData = mappingData;

            debugger;
            tempArray = tempArray.map((u: any) => u.Order !== item.Order ? u : item);

        }
        let taskDetails = { ...inspectionDetails };

        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            if (myTasksDraft.isMyTaskClick == 'campaign') {
                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                taskDetails.mappingData = mappingData;

            }
            else {
                mappingData['0'].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
            }
            debugger
            //console.log("stInsp9::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
            //console.log("stInsp9::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
            //console.log("stInsp9::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }

        callToInProgress(taskDetails);


        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const onNAClick = (item: any) => {
        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        debugger
        // alert(JSON.stringify(inspection.mappingData))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        let tempArray: any = [...modifiedCheckListData];
        debugger;
        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            tempArray = tempArray.map((u: any) => u.NOC_parameter_sl_no !== item.NOC_parameter_sl_no ? u : item);
        }
        else {
            tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        }
        // setComment(tempArray[currentSection].comment);

        let taskDetails = { ...inspectionDetails };

        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            if (myTasksDraft.isMyTaskClick == 'campaign') {
                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                taskDetails.mappingData = mappingData;
            }
            else {
                mappingData['0'].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
            } debugger
            //console.log("stInsp10::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
            //console.log("stInsp10::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
            //console.log("stInsp10::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }

        callToInProgress(taskDetails);


        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const onNIClick = (item: any) => {

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        debugger
        // alert(JSON.stringify(inspection.mappingData))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        let tempArray: any = [...modifiedCheckListData];
        debugger;
        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            tempArray = tempArray.map((u: any) => u.NOC_parameter_sl_no !== item.NOC_parameter_sl_no ? u : item);
        }
        else if (taskType.toLowerCase() == 'follow-up') {
            tempArray = tempArray.map((u: any) => u.ParameterNumber !== item.ParameterNumber ? u : item);
        }
        else {
            tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        }
        // setComment(tempArray[currentSection].comment);

        let taskDetails = { ...inspectionDetails };

        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            if (myTasksDraft.isMyTaskClick == 'campaign') {
                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                taskDetails.mappingData = mappingData;
            }
            else {
                mappingData['0'].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
            }
            debugger
            //console.log("stInsp11::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
            //console.log("stInsp11::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
            //console.log("stInsp11::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }

        callToInProgress(taskDetails);


        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const updateGraceValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];
        let taskDetails = { ...inspectionDetails };

        if (taskType.toLowerCase() == 'follow-up') {
            tempArray = tempArray.map((u: any) => u.ParameterNumber !== item.ParameterNumber ? u : item);
        }
        else {
            // tempArray = (item);
            console.log("tempArraytempArraytempArraytempArraytempArray>>>>>>>" + item.length)
            tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        }
        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            if (myTasksDraft.isMyTaskClick == 'campaign') {
                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                taskDetails.mappingData = mappingData;
            }
            else {
                mappingData['0'].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
            }

            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }
        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const updateAttachment = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];
        let inspectionDetails: any = Array();

        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

            let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

            inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            debugger
            // alert(JSON.stringify(inspection.mappingData))
            let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
            inspectionDetails.mappingData = mappingData;


            debugger;
            // tempArray = item;
            tempArray = tempArray.map((u: any) => u.NOC_parameter_sl_no !== item.NOC_parameter_sl_no ? u : item);
            // setComment(tempArray[currentSection].comment);
        }
        else if (taskType.toLowerCase() == 'supervisory inspections') {

            let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

            inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            debugger
            // alert(JSON.stringify(inspection.mappingData))
            let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
            inspectionDetails.mappingData = mappingData;


            debugger;
            // tempArray = item;
            tempArray = tempArray.map((u: any) => u.Order !== item.Order ? u : item);
            // setComment(tempArray[currentSection].comment);
        }
        else if (taskType.toLowerCase() == 'follow-up') {
            tempArray = tempArray.map((u: any) => u.ParameterNumber !== item.ParameterNumber ? u : item);
        }
        else {
            // tempArray = item;
            tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        }

        let taskDetails = { ...inspectionDetails };

        if (taskDetails.mappingData) {
            if (myTasksDraft.isMyTaskClick == 'campaign') {
                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : []
                mappingData[myTasksDraft.campaignSelectedEstIndex].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
            } else {
                let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                mappingData['0'].inspectionForm = tempArray;
                taskDetails.mappingData = mappingData;
            }

            // //console.log("stInsp13::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
            // //console.log("stInsp13::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
            // //console.log("stInsp13::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
            // RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            //     // ToastAndroid.show('Task objct successfully ', 1000);
            // });
        }
        // setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const updateCommentValue = (item: any) => {
        try {
            let tempArray: any = [...modifiedCheckListData];
            let inspectionDetailsTemp: any = Array();

            // console.log("item.parameterno" + JSON.stringify(tempArray['0']))
            if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

                let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

                inspectionDetailsTemp = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)

                let mappingData = (inspectionDetailsTemp.mappingData && (inspectionDetailsTemp.mappingData != '') && (typeof (inspectionDetailsTemp.mappingData) == 'string')) ? JSON.parse(inspectionDetailsTemp.mappingData) : [{}];
                inspectionDetailsTemp.mappingData = mappingData;

                // tempArray = item;
                tempArray = tempArray.map((u: any) => u.NOC_parameter_sl_no !== item.NOC_parameter_sl_no ? u : item);
                // setComment(tempArray[currentSection].comment);
            }
            else if (taskType.toLowerCase() == 'bazar inspection') {

                // tempArray = item;
                tempArray = tempArray.map((u: any) => u.Order !== item.Order ? u : item);
                // setComment(tempArray[currentSection].comment);
            }
            else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {
                let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

                inspectionDetailsTemp = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)

                // alert(JSON.stringify(inspection.mappingData))
                let mappingData = (inspectionDetailsTemp.mappingData && (inspectionDetailsTemp.mappingData != '') && (typeof (inspectionDetailsTemp.mappingData) == 'string')) ? JSON.parse(inspectionDetailsTemp.mappingData) : [{}];
                inspectionDetailsTemp.mappingData = mappingData;

                // tempArray = item;
                tempArray = tempArray.map((u: any) => u.Order !== item.Order ? u : item);
            }
            else if (taskType.toLowerCase() == 'follow-up') {
                tempArray = tempArray.map((u: any) => u.ParameterNumber !== item.ParameterNumber ? u : item);
            }
            else {
                // tempArray = item;
                tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
            }
            let taskDetails = { ...inspectionDetails };

            if (taskDetails.mappingData) {
                if (myTasksDraft.isMyTaskClick == 'campaign') {
                    let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : []
                    mappingData[myTasksDraft.campaignSelectedEstIndex].inspectionForm = tempArray;
                    taskDetails.mappingData = mappingData;
                    myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData))
                } else {
                    let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
                    mappingData['0'].inspectionForm = tempArray;
                    taskDetails.mappingData = mappingData;
                }
                //console.log("stInsp14::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
                //console.log("stInsp14::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                //console.log("stInsp14::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                // RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                //     // ToastAndroid.show('Task objct successfully ', 1000);
                // });
            }
            // console.log("taskDetails::" + JSON.stringify(taskDetails))
            setInspectionDetails(taskDetails);
            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails));
            setModifiedCheckListData(tempArray);
            backButtonHandler(tempArray);
        } catch (error) {
            console.log("commentERrr+" + error)
        }
    }

    const saveDataInDB = (item: any) => {

        let timeElapsed = new Date();
        let obj: any = {};

        if (modifiedCheckListData.length) {
            obj.checkList = JSON.stringify(modifiedCheckListData)
            obj.taskId = myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId;
            obj.timeElapsed = timeElapsed.toString();
            obj.timeStarted = startTime.toString();
            debugger;
            // myTasksDraft.setCheckListArray(JSON.stringify(modifiedCheckListData))
            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                if (item && item == 'noc') {
                    NavigationService.goBack();
                }
            });
        }
    }

    const submit = async (flag: boolean, value: string, samplingSuccess: string) => {

        if (myTasksDraft.latitude == '') {

            setSubmitButtonClick(false)
            if (AppState.currentState === "active") {
                try {
                    setTurnOnNavigationButton(false)
                    // setMarkerLocation('')

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
                                        (position) => {
                                            myTasksDraft.setLatitude(position.coords.latitude.toString())
                                            myTasksDraft.setLongitude(position.coords.longitude.toString())
                                            submit(true, '', '');
                                            //console.log(position.coords.latitude + ':' + position.coords.longitude);
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
                                            onPress: () => { NavigationService.navigate('Dashboard') },
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
                    console.warn(err);
                }
            }
        }
        else {

            const granted = await PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                ]
            ).then(async (result) => {

                if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
                    && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {

                    readDir(DownloadDirectoryPath + "/smartcontrol/attachments")
                        .then((res: any) => {
                            console.log(">>" + res)
                        })
                        .catch((res: any) => {
                            console.log("error>" + res)
                            if (res == 'Error: Folder does not exist') {

                                mkdir(DownloadDirectoryPath + "/smartcontrol/attachments/")
                                    .then((res: any) => {
                                        console.log(">>" + res)
                                    })
                                    .catch((res: any) => {
                                        console.log("error>" + res)
                                        if (res == 'Error: Folder does not exist') {

                                            // mkdir("/storage/emulated/0/Android/data/ae.adafsa.smartcontrol/files/attachments/"+myTasksDraft.taskId+'/')
                                        }
                                    })
                            }
                        })
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
            try {
                let TaskItem = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                // let loginData = RealmController.getLoginData(realm, LoginSchema.name);
                // loginData = loginData['0'] ? loginData['0'] : {};
                // let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

                let taskDetails = await { ...inspectionDetails };
                // let tempArray = Array();
                // let checkListData = await RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                // if (checkListData && checkListData['0']) {
                //     tempArray = (checkListData['0'].checkList != '') ? JSON.parse(checkListData['0'].checkList) : modifiedCheckListData;
                // }

                if (myTasksDraft.isMyTaskClick == "campaign") {

                    if (estSelectedItem.EnglishName && estSelectedItem.EnglishName != '') {
                        TaskItem.tradeEnglishName = estSelectedItem.EnglishName
                    }
                    else {
                        TaskItem.tradeEnglishName = ''
                    }

                }

                let payload: any = {}

                if (taskType.toLowerCase() == 'bazar inspection') {

                    let tempdata = { ...taskDetails }
                    let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                    let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, tempdata.EstablishmentId);

                    tempObjct['0'].total_score = '',//payload.InspectionCheckList.Inspection.Score;
                        tempObjct['0'].signatureBase64 = documantationDraft.fileBuffer;
                    tempObjct['0'].ContactName = myTasksDraft.contactName;
                    tempObjct['0'].finalResult = '';
                    tempObjct['0'].ContactNumber = myTasksDraft.mobileNumber;
                    tempObjct['0'].EmiratesId = myTasksDraft.emiratesId;
                    tempObjct['0'].grade_percentage = '';
                    tempObjct['0'].TradeExpiryDate = temp.LicenseExpiryDate;
                    tempObjct['0'].CustomerName = temp.EnglishName;
                    tempObjct['0'].CustomerNameEnglish = temp.EnglishName;
                    tempObjct['0'].flashlightCBValue = myTasksDraft.flashlightCBValue;
                    tempObjct['0'].thermometerCBValue = myTasksDraft.thermometerCBValue;
                    tempObjct['0'].luxmeterCBValue = myTasksDraft.luxmeterCBValue;
                    tempObjct['0'].dataLoggerCBValue = myTasksDraft.dataLoggerCBValue;
                    tempObjct['0'].UVlightCBValue = myTasksDraft.UVlightCBValue;
                    tempObjct['0'].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                    tempObjct['0'].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                    tempObjct['0'].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                    tempObjct['0'].ViolationDate = '';
                    tempObjct['0'].ViolationTime = '';
                    tempObjct['0'].GracePeriod = '';
                    tempObjct['0'].next_visit_date = myTasksDraft.nextVisit,//payload.InspectionCheckList.Inspection.NearestDate ? payload.InspectionCheckList.Inspection.NearestDate : '';
                        // delete tempdata.mappingData;
                        tempObjct['0'].overallComments = myTasksDraft.finalComment;
                    tempdata.mappingData = tempObjct;
                    tempdata.samplingFlag = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).samplingFlag : false;
                    tempdata.condemnationFlag = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).condemnationFlag : false;
                    tempdata.detentionFlag = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).detentionFlag : false;

                    RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                        // ToastAndroid.show('Task objct successfully ', 1000);
                    });

                    payload = {
                        "InterfaceID": "ADFCA_CRM_SBL_066",
                        "AssesmentChecklist": {
                            "Inpsection": {
                                "DataLogger": myTasksDraft.dataLoggerCBValue == true ? 'Y' : 'N',
                                "Flashlight": myTasksDraft.flashlightCBValue == true ? 'Y' : 'N',
                                "LuxMeter": myTasksDraft.luxmeterCBValue == true ? 'Y' : 'N',
                                "UVLight": myTasksDraft.UVlightCBValue == true ? 'Y' : 'N',
                                "TaskID": myTasksDraft.taskId,
                                "Thermometer": myTasksDraft.thermometerCBValue == true ? 'Y' : 'N',
                                "InspectorId": loginData.username,
                                "InspectorName": "",
                                "LanguageType": context.isArabic ? "AR" : "ENU",
                                "ListOfSalesAssessment": {
                                    "AssessmentChecklist": {
                                        "AssessmentScore": "",
                                        "Description": "",
                                        "MaxScore": "",
                                        "Name": "",
                                        "Percent": "",
                                        "TemplateName": "Bazar Inspection-Food",
                                        "ListOfSalesAssessmentValue": {
                                            "AssessmentChecklistValues": modifiedCheckListData
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                try {

                    if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                            tempObjct['0'].signatureBase64 = documantationDraft.fileBuffer;
                            tempdata.mappingData = tempObjct;

                            tempdata.mappingData = tempObjct;
                            //console.log("stInsp15::" + JSON.stringify(taskDetails.mappingData['0'].detentionReport))
                            //console.log("stInsp15::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
                            //console.log("stInsp15::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });

                        }
                    }
                    else if (myTasksDraft.isMyTaskClick == 'campaign') {
                        // mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                        // taskDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)] = mappingData;
                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : []

                            tempObjct[parseInt(myTasksDraft.campaignSelectedEstIndex)].signatureBase64 = documantationDraft.fileBuffer;
                            tempObjct[parseInt(myTasksDraft.campaignSelectedEstIndex)].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                            tempObjct[parseInt(myTasksDraft.campaignSelectedEstIndex)].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                            tempObjct[parseInt(myTasksDraft.campaignSelectedEstIndex)].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                            tempdata.mappingData = tempObjct;
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });

                        }
                    }
                    else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {
                        // mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].inspectionForm = tempArray;
                        // taskDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)] = mappingData;
                        try {


                            if (taskDetails && taskDetails.mappingData) {
                                let tempdata = { ...taskDetails }
                                let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]

                                tempObjct[0].signatureBase64 = documantationDraft.fileBuffer;
                                tempObjct[0].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                                tempObjct[0].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                                tempObjct[0].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                                tempdata.mappingData = tempObjct;
                                if (tempObjct && tempObjct[0] && tempObjct[0].superVisorySelectedEst) {
                                    myTasksDraft.setVisitType(tempObjct[0].superVisorySelectedEst)
                                }
                                RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                });

                            }
                        } catch (e) {
                            console.log('Exceptiom ::' + e)
                        }

                    }
                    else {

                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                            tempObjct['0'].signatureBase64 = documantationDraft.fileBuffer;
                            tempObjct['0'].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                            tempObjct['0'].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                            tempObjct['0'].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                            tempdata.mappingData = tempObjct;
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });
                        }
                    }
                }
                catch (e) {
                    // alert('exception' + e);
                }
                myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                debugger;
                // //console.log(JSON.stringify(payload))
                // if (documantationDraft.fileBuffer === '') {
                //     Alert.alert("", "Signature is mandatory")
                // }
                // else
                if (myTasksDraft.contactName === '') {
                    Alert.alert("", "Contact name is mandatory")
                }
                else if (myTasksDraft.mobileNumber === '') {
                    Alert.alert("", "Mobile number is mandatory")
                }
                else {
                    // if (samplingSuccess == '' && JSON.parse(samplingDraft.samplingArray).length > 0 && (JSON.parse(myTasksDraft.selectedTask).samplingFlag == false || JSON.parse(myTasksDraft.selectedTask).samplingFlag == null)) {
                    //     console.log('sampling flag ::');
                    //     // if (BusinessActivity && BusinessActivity != '') {
                    //     let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : '';
                    //     samplingDraft.callToSubmitSamplingService(taskDetails, BusinessActivity);
                    // }
                    // else {

                    if (isDev) {
                        const granted = await PermissionsAndroid.requestMultiple(
                            [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                            ]
                        ).then(async (result) => {

                            if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
                                && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {

                                myTasksDraft.callToSubmitTaskApi(payload, modifiedCheckListData, flag, value, finalTime, licenseMyTasksDraft.rejectBtnClick);

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
                    }
                    else {
                        myTasksDraft.callToSubmitTaskApi(payload, modifiedCheckListData, flag, value, finalTime, licenseMyTasksDraft.rejectBtnClick);
                    }

                    // console.log('sampling flag ::' + JSON.parse(samplingDraft.samplingArray).length + 'JSON.parse(samplingDraft.samplingArray).length' + JSON.parse(myTasksDraft.selectedTask).samplingFlag);
                    // }
                    // console.log("payloa::d"+JSON.stringify(payload))
                }
            }
            catch (error) {
                console.log("error submit::" + error)
                // submit(true, value)
            }
        }

    }

    const submitButtonPress = async (flag: boolean, value: string) => {

        try {
            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            let tempFlag = false;

            if (foodAlertResponse.length) {

                if (myTasksDraft.isAlertApplicable) {
                    let flag = false;

                    if ((alertObject.Sampling == 'Y') && !alertObject.samplingArr) {
                        flag = true
                    }
                    else if ((alertObject.Condemnation == 'Y') && !alertObject.condemnationArr) {
                        flag = true
                    }
                    else if ((alertObject.Detention == 'Y') && !alertObject.detentionArr) {
                        flag = true
                    }

                    if (flag) {
                        setShowFoodAlertForSCD(true);
                        setSubmitButtonClick(false)
                    }
                    else {
                        tempFlag = true
                    }
                }
                else {
                    tempFlag = true
                }
            }
            else {
                tempFlag = true
            }

            if (tempFlag) {
                if (myTasksDraft.isAlertApplicable && alertApplicableToCurrentTask) {

                    // alert(inspectionDetails.samplingFlag)
                    if (myTasksDraft.isAlertApplicable) {
                        let flag = false;

                        if ((alertObject.Sampling == 'Y') && !alertObject.samplingArr) {
                            flag = true
                        }
                        else if ((alertObject.Condemnation == 'Y') && !alertObject.condemnationArr) {
                            flag = true
                        }
                        else if ((alertObject.Detention == 'Y') && !alertObject.detentionArr) {
                            flag = true
                        }

                        if (flag) {
                            setSubmitButtonClick(false)
                            setShowFoodAlertForSCD(true);
                        }
                        else {
                            submit(flag, value, '')
                        }
                    }
                    else {
                        submit(flag, value, '')
                    }
                }
                else {
                    submit(flag, value, '')
                }
            }

        } catch (error) {
            // alert(error)
        }
    }


    const renderScoreData = ({ item, index }: any) => {
        // if (item.Answers.toString() === '4') {
        //     return;
        // }

        return (
            item.Score === 'N' || item.NIValue == 'Y' || item.NAValue == 'Y'
                ?
                <View
                    style={{
                        height: HEIGHT * 0.2, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                        shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                    }}>
                    {
                        taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') ?
                            <TableComponent
                                numberOfLines={3}
                                isHeader={false}
                                isArabic={context.isArabic}
                                data={[
                                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.parano, value: parseInt(item.parameterno) + 1 },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.question, value: item.NOC_parameter_sl_no + ":" + item.NOC_parameter_category + ":" + item.NOC_parameter_regulation_article_no },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.score, value: item.NIValue == 'Y' || item.NAValue == 'Y' ? "Unsatisfactory" : item.Score },
                                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.grace, value: item.grace },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.comments, value: item.comment },
                                ]}
                            />
                            :
                            <TableComponent
                                numberOfLines={3}
                                isHeader={false}
                                isArabic={context.isArabic}
                                data={[
                                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.parano, value: parseInt(item.NOC_parameter_regulation_article_no) + 1 },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.question, value: item.AttributeName },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.score, value: item.Score },
                                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.grace, value: item.grace },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.comments, value: item.Comment2 },
                                ]}
                            />
                    }

                </View>
                :
                (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') && item.Score !== '' && item.Score !== 'Satisfactory' ?
                    <View
                        style={{
                            height: HEIGHT * 0.2, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                            shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                        }}>
                        {

                            <TableComponent
                                numberOfLines={3}
                                isHeader={false}
                                isArabic={context.isArabic}
                                data={[
                                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.parano, value: parseInt(item.NOC_parameter_regulation_article_no) + 1 },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.question, value: item.AttributeName },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.score, value: item.Score },
                                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.grace, value: item.grace },
                                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.comments, value: item.Comment2 },
                                ]}
                            />
                        }

                    </View>
                    :
                    null
            // <View
            //     style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', minHeight: HEIGHT * 0.07, borderBottomWidth: 1, borderBottomColor: '#5c666f' }}>
            //     <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
            //         <TextComponent
            //             textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
            //             label={item.Answers}
            //         />
            //     </View>
            //     <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
            //         <TextComponent
            //             textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
            //             label={item.parameter}
            //         />
            //     </View>
            //     <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center' }}>
            //         <TextComponent
            //             textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
            //             label={item.comment}
            //         />
            //     </View>

            // </View>
        );
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={(myTasksDraft.state == 'pending') || (samplingDraft.state == 'pending') ? true : false}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : (samplingDraft.loadingState != '') ? samplingDraft.loadingState : 'Loading ...'}
                ////customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <Spinner
                visible={submitButtonClick}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                ////customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <Spinner
                visible={taskLoading}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                ////customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />

            <Modal
                visible={priview}
                onRequestClose={() => setPriview(false)}
                transparent={true}
            >
                <View style={{ height: HEIGHT * 0.98, width: WIDTH * 0.98, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, alignSelf: 'center', alignItems: 'center', }}>
                    <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 1, width: WIDTH * 1, zIndex: 999 }]}>

                        <ScrollView>
                            <View style={{ flex: 1, height: 'auto', justifyContent: 'center', borderRadius: 20 }}>

                                <View style={{ height: 'auto', justifyContent: 'center', padding: 5 }}>
                                    <View style={{ height: 10 }} />
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={previewCheckList}
                                            ItemSeparatorComponent={() => {
                                                return (<View style={{ height: 1, }} />);
                                            }}
                                            renderItem={renderScoreData}
                                        // ListEmptyComponent={listEmptyView}
                                        />
                                    </View>
                                    {/* </View> */}
                                </View>
                            </View>
                        </ScrollView>

                        <View style={{ height: HEIGHT * 0.06, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 1, height: '80%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'center' }}>

                                <View style={{ flex: 2, alignSelf: 'center' }}>
                                    <ButtonComponent
                                        style={{
                                            backgroundColor: 'red',
                                            borderRadius: 8, alignSelf: 'center', padding: 10, width: '30%', textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        buttonClick={() => {
                                            setPriview(false)
                                        }}
                                        textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.edit)}
                                    />
                                </View>

                                {/* <View style={{ flex: 0.1 }} /> */}

                                <View style={{ flex: 2, alignSelf: 'center' }}>
                                    <ButtonComponent
                                        style={{
                                            backgroundColor: fontColor.ButtonBoxColor,
                                            borderRadius: 8, alignSelf: 'center', padding: 10, width: '30%', textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        buttonClick={() => {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count + 1;
                                            if (count <= 3 && count >= 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                            setPriview(false)
                                        }}
                                        textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok)}
                                    />
                                </View>

                                {/* <View style={{ flex: 0.1 }} /> */}
                            </View>

                        </View>
                    </Animatable.View>
                </View>

            </Modal>

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
                        startInspection={true}
                        screenName={myTasksDraft.selectedTask != "" ? taskType.toLowerCase().includes('noc') ? 'noc' : taskType.toLowerCase() == 'supervisory inspections' ? 'supervisory' : taskType.toLowerCase() == 'monitor inspector performance' ? 'monitor' : '' : {}}
                        isArabic={context.isArabic} goBack={(item: any) => backButtonHandlerApp()} />
                </View>

                {/* {
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
                                setAlertApplicableToCurrentTask(value)
                                // setShowFoodAlertForSCD(value);
                            }}
                        />
                        :
                        null
                }  */}
                {
                    myTasksDraft.isAlertApplicable && showFoodAlertForSCD ?
                        <AlertcomponentForFoodAlertSCD
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Food Alert'}
                            comment={''}
                            closeAlert={() => {
                                setShowFoodAlert(false);
                            }}
                            alertObject={alertObject}
                            okAlert={() => {
                                setShowFoodAlert(false);
                            }}
                            showAlertComponentForFoodAlertSCD={(value: boolean) => {
                                setShowFoodAlertForSCD(value);
                            }}
                            hideAlertComponentForFoodAlertSCD={(value: boolean) => {
                                setShowFoodAlertForSCD(value);
                            }}
                            YesNo={(value: boolean) => {
                                myTasksDraft.setFoodalertSampling(true);
                                if (value) {
                                    NavigationService.navigate("Sampling", { title: "Sampling" })
                                }
                                else {
                                    let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];
                                    alertObject.samplingArr = [];
                                    myTasksDraft.setAlertObject(JSON.stringify(alertObject))
                                }
                            }}
                            message={(alertObject.Sampling == 'Y') && !alertObject.samplingArr ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS1 : alertObject.Condemnation == 'Y' && !alertObject.condemnationArr ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgC1 : (alertObject.Detention == 'Y') && !alertObject.detentionArr ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgD1 : Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS1}
                            message1={Strings[context.isArabic ? 'ar' : 'en'].sampling.msg2}
                            message2={Strings[context.isArabic ? 'ar' : 'en'].sampling.msg3}
                            message3={(alertObject.Sampling == 'Y') && !alertObject.samplingArr ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS4 : alertObject.Condemnation == 'Y' && !alertObject.condemnationArr ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgC4 : (alertObject.Detention == 'Y') && !alertObject.detentionArr ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgD4 : Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS4}
                        />
                        :
                        null
                }
                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        {/*   <View style={{ flex: myTasksDraft.isMyTaskClick == 'scheduledroutlineInspection' ? 0.4 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                        {
                            myTasksDraft.isMyTaskClick == 'scheduledfollowUp' ?
                                <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                    <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.scheduled)} </Text>
                                    </View>
                                    <View style={{ flex: 0.008, height: '20%', alignSelf: 'center', borderWidth: 0.5, borderColor: '#5C666F' }} />
                                    <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.followUp)} </Text>
                                    </View>
                                </View> :

                                myTasksDraft.isMyTaskClick == 'scheduledroutlineInspection' ?

                                    <View style={{ flex: 2.2, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                        <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.scheduled)} </Text>
                                        </View>

                                        <View style={{ flex: 0.008, height: '20%', alignSelf: 'center', borderWidth: 0.5, borderColor: '#5C666F' }} />
                                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text numberOfLines={1} style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.routineInspection)} </Text>
                                        </View>
                                    </View> :

                                    myTasksDraft.isMyTaskClick == 'license' ?
                                        <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                           
                                            <View style={{ flex: 0.9, alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.license)} </Text>
                                            </View>
                                        </View>
                                        :

                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'campaign' ? Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaignInspection : Strings[context.isArabic ? 'ar' : 'en'].taskList.routineInspection}</Text>
                                        </View>
                        }
                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'scheduledroutlineInspection' ? 0.4 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View> */}
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

                    {/* <View style={{ flex: 0.2 }} /> */}

                    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskId + ":-"}</Text>
                    </View> */}

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.003, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger style={styles.menuTrigger}>
                                {
                                    myTasksDraft.isMyTaskClick == 'CompletedTask' ?
                                        <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                                        :
                                        <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{finalTime}</Text>
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

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <TouchableOpacity
                        onPress={() => {
                            //nexr fr arabic
                            if (context.isArabic) {

                                if (taskType.toLowerCase().includes('noc')) {
                                    let flag = false;
                                    let flagNo = false;
                                    let scoreflag = false;
                                    let naFlag = false;
                                    let questionNo = 0;
                                    for (let index = 0; index < modifiedCheckListData.length; index++) {
                                        const element: any = modifiedCheckListData[index];
                                        if (element.Score == 'N' && element.comment == '') {
                                            flag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        if (element.Score == 'N') {
                                            flagNo = true;
                                        }
                                        if (element.NAValue == 'Y') {
                                            naFlag = true;
                                        }
                                        else if ((element.Score == '' || element.Score == '-') && (element.NAValue == '' || element.NAValue == 'N')) {
                                            scoreflag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    if (flag) {
                                        Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else if (scoreflag) {
                                        Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else {
                                        debugger;
                                        // if (naFlag && !flagNo) {
                                        //     licenseMyTasksDraft.setIsScoreN('N');
                                        // }
                                        let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                        debugger;
                                        if (finalResult.action.toLowerCase() == 'satisfactory') {
                                            licenseMyTasksDraft.setIsScoreN('N');
                                        }
                                        else {
                                            licenseMyTasksDraft.setIsScoreN('Y');
                                        }
                                        if (licenseMyTasksDraft.rejectBtnClick) {
                                            myTasksDraft.setResult('UnSatisfactory');
                                        }
                                        else {
                                            myTasksDraft.setResult(finalResult.action);
                                        }
                                        let count = parseInt(myTasksDraft.count);

                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                        if (count == 1) {
                                            let flag = false;
                                            let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                            setpreviewCheckList(checkList);
                                            for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                const element = checkList[indexPreview];
                                                if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                    flag = true;
                                                    break;
                                                }
                                                else if (element.NAValue == "Y") {
                                                    flag = true;
                                                    break;
                                                }
                                            }

                                            if (flag) {
                                                if (taskStatus != 'Completed') {
                                                    setPriview(true)
                                                }
                                                else {
                                                    count = count + 1;
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                count = count + 1;
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else if (count == 2) {
                                            documentRef.current && documentRef.current.saveSign();
                                            // saveDataInDB('')

                                        } else if (count <= 3 && count >= 1) {
                                            saveDataInDB('');
                                            count = count + 1;
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
                                }
                                else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {

                                    let flag = false;
                                    let flagNo = false;
                                    let scoreflag = false;
                                    let naFlag = false;
                                    let questionNo = 0;
                                    for (let index = 0; index < modifiedCheckListData.length; index++) {
                                        const element: any = modifiedCheckListData[index];

                                        if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na') && element.Comment2 == '') {
                                            flag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else if (element.Score == '' || element.Score == '-') {
                                            scoreflag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    if (flag) {
                                        Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else if (scoreflag) {
                                        Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else {
                                        debugger;
                                        // if (naFlag && !flagNo) {
                                        //     licenseMyTasksDraft.setIsScoreN('N');
                                        // }
                                        let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                        debugger;

                                        myTasksDraft.setResult(finalResult.action);
                                        let count = parseInt(myTasksDraft.count);
                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                        if (count == 1) {
                                            let flag = false;
                                            let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                            setpreviewCheckList(checkList);

                                            for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                const element = checkList[indexPreview];
                                                if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na' || element.Score.toLowerCase() === '')) {
                                                    flag = true;
                                                    break;
                                                }
                                                // else if (element.NAValue == "Y") {
                                                //     flag = true;
                                                //     break;
                                                // }
                                            }

                                            if (flag) {
                                                if (taskStatus != 'Completed') {
                                                    setPriview(true)
                                                }
                                                else {
                                                    count = count + 1;
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                count = count + 1;
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else if (count == 2) {
                                            documentRef.current && documentRef.current.saveSign();
                                            // saveDataInDB('')
                                        }
                                        else if (count <= 3 && count >= 1) {
                                            count = count + 1;
                                            saveDataInDB('');
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }

                                }
                                else if (taskType.toLowerCase().includes('food')) {
                                    let flag = false;
                                    let questionNo = 0;
                                    for (let index = 0; index < modifiedCheckListData.length; index++) {
                                        const element: any = modifiedCheckListData[index];
                                        if (element.Score == 'N' && element.comment == '') {
                                            flag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    if (flag) {
                                        Alert.alert("", 'comment is mandatory for question number ' + questionNo);
                                    }
                                    else {

                                        let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                        debugger;
                                        myTasksDraft.setResult(finalResult.action);

                                        let count = parseInt(myTasksDraft.count);
                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                        if (count == 1) {
                                            let flag = false;
                                            let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                            setpreviewCheckList(checkList);
                                            for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                const element = checkList[indexPreview];
                                                if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                    flag = true;
                                                    break;
                                                }
                                                else if (element.NAValue == "Y") {
                                                    flag = true;
                                                    break;
                                                }
                                            }

                                            if (flag) {
                                                if (taskStatus != 'Completed') {
                                                    setPriview(true)
                                                }
                                                else {
                                                    count = count + 1;
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                count = count + 1;
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else if (count == 2) {
                                            documentRef.current && documentRef.current.saveSign();
                                            // saveDataInDB('')
                                        } else if (count <= 3 && count >= 1) {
                                            count = count + 1;
                                            saveDataInDB('');
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
                                }
                                else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection' || myTasksDraft.isMyTaskClick == 'campaign') {


                                    let count = parseInt(myTasksDraft.count);

                                    console.log('count  start::' + count.toString())
                                    if (count == 1) {

                                        checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.callToChecklistValidation(modifiedCheckListData, inspectionDetails);
                                        // saveDataInDB('')
                                    }
                                    else if (count == 2) {
                                        let taskDetails = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : inspectionDetails;
                                        let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                                        let flag = true;
                                        console.log("taskDetails.samplingFlag1>>" + taskDetails.samplingFlag);

                                        if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                            flag = true;
                                        }
                                        else {
                                            if (!skipSampling) {
                                                if (mappingData[0].samplingReport && mappingData[0].samplingReport.length) {
                                                    if (taskDetails.samplingFlag) {
                                                        // documentRef.current && documentRef.current.saveSign();
                                                    }
                                                    else {
                                                        flag = false;
                                                        Alert.alert('', 'Please Submit Sampling First.', [
                                                            {
                                                                text: "Ok",
                                                                onPress: () => {
                                                                    NavigationService.navigate("Sampling", { title: "Sampling" })
                                                                },
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Skip", onPress: () => {
                                                                    setSkipSampling(true)
                                                                }
                                                            }
                                                        ],
                                                            { cancelable: false })
                                                        return;
                                                    }
                                                }
                                            }

                                            if (!skipCond) {
                                                if (mappingData[0].condemnationReport && mappingData[0].condemnationReport.length) {
                                                    if (taskDetails.condemnationFlag) {
                                                        // documentRef.current && documentRef.current.saveSign();
                                                    } else {
                                                        flag = false;
                                                        Alert.alert('', 'Please Submit Condemnation First.', [
                                                            {
                                                                text: "Ok",
                                                                onPress: () => {
                                                                    NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                                                },
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Skip", onPress: () => {
                                                                    setSkipCond(true)
                                                                }
                                                            }
                                                        ],
                                                            { cancelable: false })
                                                        return;
                                                    }
                                                }
                                            }

                                            if (!skipDet) {
                                                if (mappingData[0].detentionReport && mappingData[0].detentionReport.length) {
                                                    if (taskDetails.detentionFlag) {
                                                        // documentRef.current && documentRef.current.saveSign();
                                                    } else {
                                                        flag = false;
                                                        Alert.alert('', 'Please Submit Detention First.', [
                                                            {
                                                                text: "Ok",
                                                                onPress: () => {
                                                                    NavigationService.navigate("Detention", { title: "Detention" })
                                                                },
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Skip", onPress: () => {
                                                                    setSkipDet(true)
                                                                }
                                                            }
                                                        ],
                                                            { cancelable: false })
                                                        return;
                                                    }
                                                }
                                            }
                                        }

                                        if (skipSampling && skipCond && skipDet) {
                                            flag = true;
                                        }

                                        if (flag) {
                                            documentRef.current && documentRef.current.saveSign();
                                        }
                                        // documentRef.current && documentRef.current.saveSign();
                                        // saveDataInDB('')
                                    }
                                    else {
                                        // if (isValidated) {
                                        count = count + 1;
                                        // alert(count)
                                        //((taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'direct inspection'))
                                        if (count <= 3 && count >= 1) {
                                            myTasksDraft.setCount(count.toString())
                                            saveDataInDB('');
                                        }
                                    }
                                    // }
                                    // }
                                }
                                else if (taskType.toLowerCase() == 'follow-up') {

                                    // if (context.isArabic) {
                                    //     let count = parseInt(myTasksDraft.count);
                                    //     count = count - 1;
                                    //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    //         myTasksDraft.setCount(count.toString())
                                    //     }
                                    // }
                                    // else {
                                    let count = parseInt(myTasksDraft.count);

                                    if (count == 1) {
                                        checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.calculateScore(inspectionDetails);
                                        // saveDataInDB('')
                                    }
                                    else if (count == 2) {
                                        documentRef.current && documentRef.current.saveSign();
                                        // saveDataInDB('')
                                    }
                                    else {
                                        count = count + 1;
                                        if (count <= 3 && count >= 1) {
                                            myTasksDraft.setCount(count.toString())
                                            saveDataInDB('');
                                        }
                                    }
                                    // }
                                    // }
                                }
                                else {
                                    // if (context.isArabic) {
                                    //     let count = parseInt(myTasksDraft.count);
                                    //     count = count - 1;
                                    //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    //         myTasksDraft.setCount(count.toString())
                                    //     }
                                    // }
                                    // else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;

                                    myTasksDraft.isMyTaskClick == 'campaign'
                                    if (count == 2) {
                                        documentRef.current && documentRef.current.saveSign();
                                        // saveDataInDB('')
                                    }
                                    else if (count <= 3 && count >= 1) {
                                        // let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                        // myTasksDraft.setResult(finalresult.action)
                                        myTasksDraft.setCount(count.toString())
                                        saveDataInDB('');
                                    }
                                    // }
                                }
                            }
                            else {
                                let count = parseInt(myTasksDraft.count);
                                count = count - 1;
                                if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    myTasksDraft.setCount(count.toString())
                                    saveDataInDB('');
                                }
                            }
                            // }
                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}

                    >
                        <Image style={{ alignSelf: 'center', transform: [{ rotate: '180deg' }] }} source={require('./../assets/images/startInspection/arrow.png')} />
                        {/* */}
                    </TouchableOpacity>

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c4ddd2' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'right' }}>{parseInt(myTasksDraft.count) == 1 ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklist :
                            parseInt(myTasksDraft.count) == 2 ? myTasksDraft.isMyTaskClick == "History" ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.finalResult : Strings[context.isArabic ? 'ar' : 'en'].startInspection.documentation :
                                Strings[context.isArabic ? 'ar' : 'en'].startInspection.submission}</Text>

                    </View>

                    <TouchableOpacity
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopRightRadius: 18, borderBottomRightRadius: 18 }}
                        onPress={() => {

                            if (context.isArabic) {
                                let count = parseInt(myTasksDraft.count);
                                count = count - 1;
                                if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    myTasksDraft.setCount(count.toString())
                                    saveDataInDB('');
                                }
                            }
                            else {
                                if (taskType.toLowerCase().includes('noc')) {
                                    let flag = false;
                                    let flagNo = false;
                                    let scoreflag = false;
                                    let naFlag = false;
                                    let questionNo = 0;
                                    for (let index = 0; index < modifiedCheckListData.length; index++) {
                                        const element: any = modifiedCheckListData[index];
                                        if (element.Score == 'N' && element.comment == '') {
                                            flag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        if (element.Score == 'N') {
                                            flagNo = true;
                                        }
                                        if (element.NAValue == 'Y') {
                                            naFlag = true;
                                        }
                                        else if ((element.Score == '' || element.Score == '-') && (element.NAValue == '' || element.NAValue == 'N')) {
                                            scoreflag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    if (flag) {
                                        Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else if (scoreflag) {
                                        Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else {
                                        debugger;
                                        // if (naFlag && !flagNo) {
                                        //     licenseMyTasksDraft.setIsScoreN('N');
                                        // }
                                        let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                        debugger;
                                        if (finalResult.action.toLowerCase() == 'satisfactory') {
                                            licenseMyTasksDraft.setIsScoreN('N');
                                        }
                                        else {
                                            licenseMyTasksDraft.setIsScoreN('Y');
                                        }
                                        if (licenseMyTasksDraft.rejectBtnClick) {
                                            myTasksDraft.setResult('UnSatisfactory');
                                        }
                                        else {
                                            myTasksDraft.setResult(finalResult.action);
                                        }
                                        let count = parseInt(myTasksDraft.count);

                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                                        if (count == 1) {
                                            let flag = false;
                                            let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                            setpreviewCheckList(checkList);
                                            for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                const element = checkList[indexPreview];
                                                if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                    flag = true;
                                                    break;
                                                }
                                                else if (element.NAValue == "Y") {
                                                    flag = true;
                                                    break;
                                                }
                                            }

                                            if (flag) {
                                                if (taskStatus != 'Completed') {
                                                    setPriview(true)
                                                }
                                                else {
                                                    count = count + 1;
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                count = count + 1;
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else if (count == 2) {
                                            documentRef.current && documentRef.current.saveSign();
                                            // saveDataInDB('')
                                        } else if (count < 3 && count >= 1) {
                                            count = count + 1;
                                            saveDataInDB('');
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
                                }
                                else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {

                                    let flag = false;
                                    let flagNo = false;
                                    let scoreflag = false;
                                    let naFlag = false;
                                    let questionNo = 0;
                                    for (let index = 0; index < modifiedCheckListData.length; index++) {
                                        const element: any = modifiedCheckListData[index];

                                        if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na') && element.Comment2 == '') {
                                            flag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else if (element.Score == '' || element.Score == '-') {
                                            scoreflag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    if (flag) {
                                        Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else if (scoreflag) {
                                        Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                        // licenseMyTasksDraft.setIsScoreN('Y');
                                    }
                                    else {
                                        debugger;
                                        // if (naFlag && !flagNo) {
                                        //     licenseMyTasksDraft.setIsScoreN('N');
                                        // }
                                        let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                        debugger;

                                        myTasksDraft.setResult(finalResult.action);
                                        let count = parseInt(myTasksDraft.count);
                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                        if (count == 1) {
                                            let flag = false;
                                            let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();

                                            setpreviewCheckList(checkList);
                                            for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                const element = checkList[indexPreview];
                                                if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na' || element.Score.toLowerCase() === '')) {
                                                    flag = true;
                                                    break;
                                                }
                                                // else if (element.NAValue == "Y") {
                                                //     flag = true;
                                                //     break;
                                                // }
                                            }

                                            if (flag) {
                                                if (taskStatus != 'Completed') {
                                                    setPriview(true)
                                                }
                                                else {
                                                    count = count + 1;
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                count = count + 1;
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else if (count == 2) {
                                            documentRef.current && documentRef.current.saveSign();
                                            // saveDataInDB('')
                                        }
                                        else if (count < 3 && count >= 1) {
                                            count = count + 1;
                                            saveDataInDB('');
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }

                                }
                                else if (taskType.toLowerCase().includes('food')) {
                                    let flag = false;
                                    let questionNo = 0;
                                    for (let index = 0; index < modifiedCheckListData.length; index++) {
                                        const element: any = modifiedCheckListData[index];
                                        if (element.Score == 'N' && element.comment == '') {
                                            flag = true;
                                            questionNo = (index + 1);
                                            break;
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                    if (flag) {
                                        Alert.alert("", 'comment is mandatory for question number ' + questionNo);
                                    }
                                    else {
                                        let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                        debugger;
                                        myTasksDraft.setResult(finalResult.action);

                                        let count = parseInt(myTasksDraft.count);
                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                        if (count == 1) {
                                            let flag = false;
                                            let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                            setpreviewCheckList(checkList);
                                            for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                const element = checkList[indexPreview];
                                                if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                    flag = true;
                                                    break;
                                                }
                                                else if (element.NAValue == "Y") {
                                                    flag = true;
                                                    break;
                                                }
                                            }

                                            if (flag) {
                                                if (taskStatus != 'Completed') {
                                                    setPriview(true)
                                                }
                                                else {
                                                    count = count + 1;
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                count = count + 1;
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else if (count == 2) {
                                            documentRef.current && documentRef.current.saveSign();
                                            // saveDataInDB('')
                                        } else if (count <= 3 && count >= 1) {
                                            count = count + 1;
                                            saveDataInDB('');
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
                                }
                                else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection' || myTasksDraft.isMyTaskClick == 'campaign') {

                                    // if (context.isArabic) {
                                    //     let count = parseInt(myTasksDraft.count);
                                    //     count = count - 1;
                                    //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    //         myTasksDraft.setCount(count.toString())
                                    //     }
                                    // }
                                    // else {
                                    let count = parseInt(myTasksDraft.count);

                                    if (count == 1) {

                                        checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.callToChecklistValidation(modifiedCheckListData, inspectionDetails);
                                        // saveDataInDB('')
                                    }
                                    else if (count == 2) {
                                        let taskDetails = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : inspectionDetails;
                                        let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                                        console.log("taskDetails.samplingFlag2>>" + taskDetails.samplingFlag);
                                        let flag = true;

                                        if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                            flag = true;
                                        }
                                        else {
                                            if (!skipSampling) {
                                                if (mappingData[0].samplingReport && mappingData[0].samplingReport.length) {
                                                    if (taskDetails.samplingFlag) {
                                                        // documentRef.current && documentRef.current.saveSign();
                                                    }
                                                    else {
                                                        flag = false;
                                                        Alert.alert('', 'Please Submit Sampling First.', [
                                                            {
                                                                text: "Ok",
                                                                onPress: () => {
                                                                    NavigationService.navigate("Sampling", { title: "Sampling" })
                                                                },
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Skip", onPress: () => {
                                                                    setSkipSampling(true)
                                                                }
                                                            }
                                                        ],
                                                            { cancelable: false })
                                                        return;
                                                    }
                                                }
                                            }

                                            if (!skipCond) {
                                                if (mappingData[0].condemnationReport && mappingData[0].condemnationReport.length) {
                                                    if (taskDetails.condemnationFlag) {
                                                        // documentRef.current && documentRef.current.saveSign();
                                                    } else {
                                                        flag = false;
                                                        Alert.alert('', 'Please Submit Condemnation First.', [
                                                            {
                                                                text: "Ok",
                                                                onPress: () => {
                                                                    NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                                                },
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Skip", onPress: () => {
                                                                    setSkipCond(true)
                                                                }
                                                            }
                                                        ],
                                                            { cancelable: false })
                                                        return;
                                                    }
                                                }
                                            }

                                            if (!skipDet) {
                                                if (mappingData[0].detentionReport && mappingData[0].detentionReport.length) {
                                                    if (taskDetails.detentionFlag) {
                                                        // documentRef.current && documentRef.current.saveSign();
                                                    } else {
                                                        flag = false;
                                                        Alert.alert('', 'Please Submit Detention First.', [
                                                            {
                                                                text: "Ok",
                                                                onPress: () => {
                                                                    NavigationService.navigate("Detention", { title: "Detention" })
                                                                },
                                                                style: "cancel"
                                                            },
                                                            {
                                                                text: "Skip", onPress: () => {
                                                                    setSkipDet(true)
                                                                }
                                                            }
                                                        ],
                                                            { cancelable: false })
                                                        return;
                                                    }
                                                }
                                            }
                                        }

                                        if (skipSampling && skipCond && skipDet) {
                                            flag = true;
                                        }

                                        if (flag) {
                                            documentRef.current && documentRef.current.saveSign();
                                        }
                                        // documentRef.current && documentRef.current.saveSign();
                                        // saveDataInDB('')
                                    }
                                    else {
                                        // if (isValidated) {
                                        count = count + 1;
                                        // alert(count)
                                        //((taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'direct inspection'))
                                        if (count <= 3 && count >= 1) {
                                            myTasksDraft.setCount(count.toString())
                                            saveDataInDB('');
                                        }
                                    }
                                    // }
                                    // }
                                }
                                else if (taskType.toLowerCase() == 'follow-up') {

                                    // if (context.isArabic) {
                                    //     let count = parseInt(myTasksDraft.count);
                                    //     count = count - 1;
                                    //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    //         myTasksDraft.setCount(count.toString())
                                    //     }
                                    // }
                                    // else {
                                    let count = parseInt(myTasksDraft.count);

                                    if (count == 1) {
                                        checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.calculateScore(inspectionDetails);
                                        // saveDataInDB('')
                                    }
                                    else if (count == 2) {
                                        documentRef.current && documentRef.current.saveSign();
                                        // saveDataInDB('')
                                    }
                                    else {
                                        count = count + 1;
                                        if (count <= 3 && count >= 1) {
                                            myTasksDraft.setCount(count.toString())
                                            saveDataInDB('');
                                        }
                                    }
                                    // }
                                    // }
                                }
                                else {
                                    // if (context.isArabic) {
                                    //     let count = parseInt(myTasksDraft.count);
                                    //     count = count - 1;
                                    //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                    //         myTasksDraft.setCount(count.toString())
                                    //     }
                                    // }
                                    // else {
                                    let count = parseInt(myTasksDraft.count);
                                    myTasksDraft.isMyTaskClick == 'campaign'
                                    if (count == 2) {
                                        documentRef.current && documentRef.current.saveSign();
                                        // saveDataInDB('')
                                    } else if (count <= 3 && count >= 1) {
                                        count = count + 1;
                                        // let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                        // myTasksDraft.setResult(finalresult.action)
                                        myTasksDraft.setCount(count.toString())
                                        saveDataInDB('');
                                    }
                                    // }
                                }
                            }
                        }}
                    >

                        <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/arrow.png')} />

                    </TouchableOpacity>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 7.1, width: '85%', alignSelf: 'center' }}>
                    {
                        parseInt(myTasksDraft.count) == 1 ?
                            sendModifiedCheckListData.length ?
                                taskType.toLowerCase() == 'follow-up' ?
                                    <FollowUpComponent
                                        ref={checklistComponentStepOneRef}
                                        DocumentationAndRecordComponent={onRegulationClick}
                                        onClickScoreListItem={(item: any) => { onClickScoreListItem(item) }}
                                        updateGraceValue={(item: any) => { updateGraceValue(item) }}
                                        onAttachmentImageClick={(item: any) => { updateAttachment(item) }}
                                        updateCommentValue={(item: any) => { updateCommentValue(item) }}
                                        onNIClick={(item: any) => { onNIClick(item) }}
                                        modifiedCheckListData={sendModifiedCheckListData}
                                        inspDetails={inspectionDetails}
                                        isArabic={context.isArabic}
                                        allowedClick={allowedClick}
                                    />
                                    :
                                    <ChecklistComponentStepOne
                                        ref={checklistComponentStepOneRef}
                                        DocumentationAndRecordComponent={onRegulationClick}
                                        onClickScoreListItem={(item: any) => { onClickScoreListItem(item) }}
                                        onNAClick={(item: any) => { onNAClick(item) }}
                                        onNIClick={(item: any) => { onNIClick(item) }}
                                        onAttachmentImageClick={(item: any) => { updateAttachment(item) }}
                                        onComplianceClick={(item: any) => { onComplianceClick(item) }}
                                        updateGraceValue={(item: any) => { updateGraceValue(item) }}
                                        updateCommentValue={(item: any) => { updateCommentValue(item) }}
                                        modifiedCheckListData={sendModifiedCheckListData}
                                    />

                                :
                                <TextComponent textStyle={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }} label={Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklistNotAvailable} />
                            :
                            parseInt(myTasksDraft.count) == 2 ?
                                //  Strings[context.isArabic ? 'ar' : 'en'].startInspection.submission}</Text>
                                <DocumentationAndRecordComponent modifiedCheckListData={modifiedCheckListData} ref={documentRef} isArabic={context.isArabic} submit={() => {
                                    setIsSubmitBtnPress(true);
                                    submitButtonPress(true, '')
                                }}
                                // setCheckList={()=>setCheckList()} 
                                />

                                :
                                parseInt(myTasksDraft.count) == 3 ?
                                    <SubmissionComponent modifiedCheckListData={modifiedCheckListData} submitButtonPress={(value: any) => {
                                        setIsSubmitBtnPress(true);
                                        setSubmitButtonClick(true)
                                        submitButtonPress(true, value)
                                    }}
                                        isArabic={context.isArabic} /> : null
                    }
                </View>

                {/* {
                    myTasksDraft.isMyTaskClick == 'CompletedTask' ?
                        null
                        : */}
                <View style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ flex: 0.1 }} />

                    {context.isArabic ?
                        (parseInt(myTasksDraft.count) < 3) ?
                            <View style={{ flexDirection: 'row', flex: 1, height: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>

                                <ButtonComponent
                                    style={{
                                        height: '100%', width: parseInt(myTasksDraft.count) <= 3 ? '30%' : '18%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        if (context.isArabic) {

                                            if (taskType.toLowerCase().includes('noc')) {
                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    if (element.Score == 'N') {
                                                        flagNo = true;
                                                    }
                                                    if (element.NAValue == 'Y') {
                                                        naFlag = true;
                                                    }
                                                    else if (element.Score == '' && element.NAValue == '') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                                }
                                                else if (scoreflag) {
                                                    Alert.alert("", 'Please enter score for question number ' + questionNo);
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    // else  if (!naFlag && flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    // else {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    if (finalResult.action.toLowerCase() == 'satisfactory') {
                                                        licenseMyTasksDraft.setIsScoreN('N');
                                                    }
                                                    else {
                                                        licenseMyTasksDraft.setIsScoreN('Y');
                                                    }

                                                    debugger;
                                                    if (licenseMyTasksDraft.rejectBtnClick) {
                                                        myTasksDraft.setResult('UnSatisfactory');
                                                    }
                                                    else {
                                                        myTasksDraft.setResult(finalResult.action);
                                                    }
                                                    let count = parseInt(myTasksDraft.count);

                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            else if (element.NAValue == "Y") {
                                                                flag = true;
                                                                break;
                                                            }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {

                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];

                                                    if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na') && element.Comment2 == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else if (element.Score == '' || element.Score == '-') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                                }
                                                else if (scoreflag) {
                                                    Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    debugger;

                                                    myTasksDraft.setResult(finalResult.action);
                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();

                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na' || element.Score.toLowerCase() === '')) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            // else if (element.NAValue == "Y") {
                                                            //     flag = true;
                                                            //     break;
                                                            // }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    }
                                                    else if (count < 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }

                                            }
                                            else if (taskType.toLowerCase().includes('food')) {
                                                let flag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                                }
                                                else {

                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    debugger;
                                                    myTasksDraft.setResult(finalResult.action);

                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            else if (element.NAValue == "Y") {
                                                                flag = true;
                                                                break;
                                                            }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection' || myTasksDraft.isMyTaskClick == 'campaign') {

                                                // if (context.isArabic) {
                                                //     let count = parseInt(myTasksDraft.count);
                                                //     count = count - 1;
                                                //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                //         myTasksDraft.setCount(count.toString())
                                                //     }
                                                // }
                                                // else {
                                                let count = parseInt(myTasksDraft.count);

                                                if (count == 1) {
                                                    checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.callToChecklistValidation(modifiedCheckListData, inspectionDetails);
                                                    // saveDataInDB('')
                                                }
                                                else if (count == 2) {
                                                    let taskDetails = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : inspectionDetails;
                                                    let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                                                    console.log("taskDetails.samplingFlag3>>" + taskDetails.samplingFlag);
                                                    let flag = true;

                                                    if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                                        flag = true;
                                                    }
                                                    else {
                                                        if (!skipSampling) {
                                                            if (mappingData[0].samplingReport && mappingData[0].samplingReport.length) {
                                                                if (taskDetails.samplingFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                }
                                                                else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Sampling First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Sampling", { title: "Sampling" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipSampling(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }

                                                        if (!skipCond) {
                                                            if (mappingData[0].condemnationReport && mappingData[0].condemnationReport.length) {
                                                                if (taskDetails.condemnationFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                } else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Condemnation First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipCond(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }

                                                        if (!skipDet) {
                                                            if (mappingData[0].detentionReport && mappingData[0].detentionReport.length) {
                                                                if (taskDetails.detentionFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                } else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Detention First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Detention", { title: "Detention" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipDet(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (skipSampling && skipCond && skipDet) {
                                                        flag = true;
                                                    }
                                                    console.log("flag>>" + flag)
                                                    if (flag) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                    }
                                                    // }
                                                    // saveDataInDB('')
                                                }
                                                else {
                                                    // if (isValidated) {
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                        myTasksDraft.setResult(finalresult.action)
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                                // }
                                                // }
                                            }
                                            else if (taskType.toLowerCase() == 'follow-up') {


                                                let count = parseInt(myTasksDraft.count);

                                                if (count == 1) {
                                                    checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.calculateScore(inspectionDetails);
                                                    // saveDataInDB('')
                                                }
                                                else if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                }
                                                else {
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                                // }

                                            }
                                            else {

                                                let count = parseInt(myTasksDraft.count);
                                                if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                } else if (count <= 3 && count >= 1) {
                                                    count = count + 1;
                                                    // if (taskType.toLowerCase() != 'follow-up') {
                                                    //     let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                    //     myTasksDraft.setResult(finalresult.action)
                                                    // }
                                                    myTasksDraft.setCount(count.toString())
                                                    saveDataInDB('');
                                                }

                                            }
                                        }
                                        else {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                                // saveDataInDB();
                                            }
                                        }
                                    }}
                                    imageStyle={{ right: 3, height: '42%', width: '42%', alignSelf: 'center', transform: [{ rotate: '180deg' }] }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.back)}
                                    image={require('./../assets/images/startInspection/rightIcon32.png')}

                                />

                            </View>
                            :
                            <View style={{ flexDirection: 'row', flex: 1, height: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }} />
                        :
                        (parseInt(myTasksDraft.count) > 1) ?
                            <View style={{ flexDirection: 'row', flex: 1, height: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }}>

                                <ButtonComponent
                                    style={{
                                        height: '100%', width: parseInt(myTasksDraft.count) <= 3 ? '30%' : '18%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        if (context.isArabic) {

                                            if (taskType.toLowerCase().includes('noc')) {
                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    if (element.Score == 'N') {
                                                        flagNo = true;
                                                    }
                                                    if (element.NAValue == 'Y') {
                                                        naFlag = true;
                                                    }
                                                    else if (element.Score == '' && element.NAValue == '') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                                }
                                                else if (scoreflag) {
                                                    Alert.alert("", 'Please enter score for question number ' + questionNo);
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    // else  if (!naFlag && flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    // else {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    if (finalResult.action.toLowerCase() == 'satisfactory') {
                                                        licenseMyTasksDraft.setIsScoreN('N');
                                                    }
                                                    else {
                                                        licenseMyTasksDraft.setIsScoreN('Y');
                                                    }

                                                    debugger;
                                                    if (licenseMyTasksDraft.rejectBtnClick) {
                                                        myTasksDraft.setResult('UnSatisfactory');
                                                    }
                                                    else {
                                                        myTasksDraft.setResult(finalResult.action);
                                                    }
                                                    let count = parseInt(myTasksDraft.count);

                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            else if (element.NAValue == "Y") {
                                                                flag = true;
                                                                break;
                                                            }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        saveDataInDB('');
                                                        count = count + 1;
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {

                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];

                                                    if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na') && element.Comment2 == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else if (element.Score == '' || element.Score == '-') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                                }
                                                else if (scoreflag) {
                                                    Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    debugger;

                                                    myTasksDraft.setResult(finalResult.action);
                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();

                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na' || element.Score.toLowerCase() === '')) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            // else if (element.NAValue == "Y") {
                                                            //     flag = true;
                                                            //     break;
                                                            // }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    }
                                                    else if (count < 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }

                                            }
                                            else if (taskType.toLowerCase().includes('food')) {
                                                let flag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                                }
                                                else {

                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    debugger;
                                                    myTasksDraft.setResult(finalResult.action);

                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            else if (element.NAValue == "Y") {
                                                                flag = true;
                                                                break;
                                                            }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection' || myTasksDraft.isMyTaskClick == 'campaign') {

                                                // if (context.isArabic) {
                                                //     let count = parseInt(myTasksDraft.count);
                                                //     count = count - 1;
                                                //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                //         myTasksDraft.setCount(count.toString())
                                                //     }
                                                // }
                                                // else {
                                                let count = parseInt(myTasksDraft.count);

                                                if (count == 1) {

                                                    checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.callToChecklistValidation(modifiedCheckListData, inspectionDetails);
                                                    // saveDataInDB('')
                                                }
                                                else if (count == 2) {
                                                    let taskDetails = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : inspectionDetails;
                                                    let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                                                    console.log("taskDetails.samplingFlag4>>" + taskDetails.samplingFlag);
                                                    let flag = true;

                                                    if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                                        flag = true;
                                                    }
                                                    else {
                                                        if (!skipSampling) {
                                                            if (mappingData[0].samplingReport && mappingData[0].samplingReport.length) {
                                                                if (taskDetails.samplingFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                }
                                                                else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Sampling First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Sampling", { title: "Sampling" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipSampling(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }

                                                        if (!skipCond) {
                                                            if (mappingData[0].condemnationReport && mappingData[0].condemnationReport.length) {
                                                                if (taskDetails.condemnationFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                } else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Condemnation First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipCond(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }

                                                        if (!skipDet) {
                                                            if (mappingData[0].detentionReport && mappingData[0].detentionReport.length) {
                                                                if (taskDetails.detentionFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                } else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Detention First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Detention", { title: "Detention" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipDet(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (skipSampling && skipCond && skipDet) {
                                                        flag = true;
                                                    }

                                                    if (flag) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                    }
                                                    // documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                }
                                                else {
                                                    // if (isValidated) {
                                                    count = count + 1;
                                                    // alert(count)
                                                    //((taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'direct inspection'))
                                                    if (count <= 3 && count >= 1) {
                                                        let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                        myTasksDraft.setResult(finalresult.action)
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                                // }
                                                // }
                                            }
                                            else if (taskType.toLowerCase() == 'follow-up') {

                                                if (context.isArabic) {
                                                    let count = parseInt(myTasksDraft.count);
                                                    count = count - 1;
                                                    if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                                else {
                                                    let count = parseInt(myTasksDraft.count);

                                                    if (count == 1) {
                                                        checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.calculateScore(inspectionDetails);
                                                        // saveDataInDB('')
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    }
                                                    else {
                                                        count = count + 1;
                                                        if (count <= 3 && count >= 1) {
                                                            myTasksDraft.setCount(count.toString())
                                                            saveDataInDB('');
                                                        }
                                                    }
                                                    // }
                                                }
                                            }
                                            else {
                                                if (context.isArabic) {
                                                    let count = parseInt(myTasksDraft.count);
                                                    count = count - 1;
                                                    if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                                else {
                                                    let count = parseInt(myTasksDraft.count);
                                                    if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        count = count + 1;
                                                        // if (taskType.toLowerCase() != 'follow-up') {
                                                        //     let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                        //     myTasksDraft.setResult(finalresult.action)
                                                        // }
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                            }
                                        }
                                        else {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                                // saveDataInDB();
                                            }
                                        }
                                    }}
                                    imageStyle={{ right: 3, height: '42%', width: '42%', alignSelf: 'center', transform: [{ rotate: '180deg' }] }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.back)}
                                    image={require('./../assets/images/startInspection/rightIcon32.png')}

                                />

                            </View>
                            :
                            <View style={{ flexDirection: 'row', flex: 1, height: '90%', alignItems: 'flex-start', justifyContent: 'flex-start' }} />

                    }
                    <View style={{ flex: 0.1 }} />

                    {context.isArabic ?
                        (parseInt(myTasksDraft.count) > 1) ?
                            <View style={{ flexDirection: 'row', flex: 1, height: '90%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <ButtonComponent
                                    style={{
                                        height: '100%', width: parseInt(myTasksDraft.count) >= 1 ? '30%' : '17%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {

                                        if (context.isArabic) {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                                // saveDataInDB();
                                            }
                                        }
                                        else {
                                            if (taskType.toLowerCase().includes('noc')) {
                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    if (element.Score == 'N') {
                                                        flagNo = true;
                                                    }
                                                    if (element.NAValue == 'Y') {
                                                        naFlag = true;
                                                    }
                                                    else if (element.Score == '' && element.NAValue == '') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                                }
                                                else if (scoreflag) {
                                                    Alert.alert("", 'Please enter score for question number ' + questionNo);
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    // else  if (!naFlag && flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    // else {
                                                    //     licenseMyTasksDraft.setIsScoreN('Y');
                                                    // }
                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    if (finalResult.action.toLowerCase() == 'satisfactory') {
                                                        licenseMyTasksDraft.setIsScoreN('N');
                                                    }
                                                    else {
                                                        licenseMyTasksDraft.setIsScoreN('Y');
                                                    }

                                                    debugger;
                                                    if (licenseMyTasksDraft.rejectBtnClick) {
                                                        myTasksDraft.setResult('UnSatisfactory');
                                                    }
                                                    else {
                                                        myTasksDraft.setResult(finalResult.action);
                                                    }
                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            else if (element.NAValue == "Y") {
                                                                flag = true;
                                                                break;
                                                            }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    } else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {

                                                let flag = false;
                                                let flagNo = false;
                                                let scoreflag = false;
                                                let naFlag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];

                                                    if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na') && element.Comment2 == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else if (element.Score == '' || element.Score == '-') {
                                                        scoreflag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                                }
                                                else if (scoreflag) {
                                                    Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                                    // licenseMyTasksDraft.setIsScoreN('Y');
                                                }
                                                else {
                                                    debugger;
                                                    // if (naFlag && !flagNo) {
                                                    //     licenseMyTasksDraft.setIsScoreN('N');
                                                    // }
                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    debugger;

                                                    myTasksDraft.setResult(finalResult.action);
                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();

                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na' || element.Score.toLowerCase() === '')) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            // else if (element.NAValue == "Y") {
                                                            //     flag = true;
                                                            //     break;
                                                            // }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    }
                                                    else if (count < 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }

                                            }
                                            else if (taskType.toLowerCase().includes('food')) {
                                                let flag = false;
                                                let questionNo = 0;
                                                for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                    const element: any = modifiedCheckListData[index];
                                                    if (element.Score == 'N' && element.comment == '') {
                                                        flag = true;
                                                        questionNo = (index + 1);
                                                        break;
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                                if (flag) {
                                                    Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                                }
                                                else {

                                                    let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                    debugger;
                                                    myTasksDraft.setResult(finalResult.action);

                                                    let count = parseInt(myTasksDraft.count);
                                                    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                    if (count == 1) {
                                                        let flag = false;
                                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                        setpreviewCheckList(checkList);
                                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                            const element = checkList[indexPreview];
                                                            if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                                flag = true;
                                                                break;
                                                            }
                                                            else if (element.NAValue == "Y") {
                                                                flag = true;
                                                                break;
                                                            }
                                                        }

                                                        if (flag) {
                                                            if (taskStatus != 'Completed') {
                                                                setPriview(true)
                                                            }
                                                            else {
                                                                count = count + 1;
                                                                myTasksDraft.setCount(count.toString())
                                                            }
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else if (count == 2) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                        // saveDataInDB('')
                                                    } else if (count <= 3 && count >= 1) {
                                                        count = count + 1;
                                                        saveDataInDB('');
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                            }
                                            else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection' || myTasksDraft.isMyTaskClick == 'campaign') {

                                                // if (context.isArabic) {
                                                //     let count = parseInt(myTasksDraft.count);
                                                //     count = count - 1;
                                                //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                //         myTasksDraft.setCount(count.toString())
                                                //     }
                                                // }
                                                // else {
                                                let count = parseInt(myTasksDraft.count);

                                                if (count == 1) {
                                                    checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.callToChecklistValidation(modifiedCheckListData, inspectionDetails);
                                                    // saveDataInDB('')
                                                }
                                                else if (count == 2) {
                                                    let taskDetails = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : inspectionDetails;
                                                    let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                                                    let flag = true;
                                                    console.log("taskDetails.samplingFlag5>>" + taskDetails.samplingFlag);

                                                    if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                                        flag = true;
                                                    }
                                                    else {
                                                        if (!skipSampling) {
                                                            if (mappingData[0].samplingReport && mappingData[0].samplingReport.length) {
                                                                if (taskDetails.samplingFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                }
                                                                else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Sampling First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Sampling", { title: "Sampling" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipSampling(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }

                                                        if (!skipCond) {
                                                            if (mappingData[0].condemnationReport && mappingData[0].condemnationReport.length) {
                                                                if (taskDetails.condemnationFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                } else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Condemnation First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipCond(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }

                                                        if (!skipDet) {
                                                            if (mappingData[0].detentionReport && mappingData[0].detentionReport.length) {
                                                                if (taskDetails.detentionFlag) {
                                                                    // documentRef.current && documentRef.current.saveSign();
                                                                } else {
                                                                    flag = false;
                                                                    Alert.alert('', 'Please Submit Detention First.', [
                                                                        {
                                                                            text: "Ok",
                                                                            onPress: () => {
                                                                                NavigationService.navigate("Detention", { title: "Detention" })
                                                                            },
                                                                            style: "cancel"
                                                                        },
                                                                        {
                                                                            text: "Skip", onPress: () => {
                                                                                setSkipDet(true)
                                                                            }
                                                                        }
                                                                    ],
                                                                        { cancelable: false })
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (skipSampling && skipCond && skipDet) {
                                                        flag = true;
                                                    }


                                                    if (flag) {
                                                        documentRef.current && documentRef.current.saveSign();
                                                    }
                                                    // documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                }
                                                else {
                                                    // if (isValidated) {
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                        myTasksDraft.setResult(finalresult.action)
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                                // }
                                                // }
                                            }
                                            else if (taskType.toLowerCase() == 'follow-up') {

                                                // if (context.isArabic) {
                                                //     let count = parseInt(myTasksDraft.count);
                                                //     count = count - 1;
                                                //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                //         myTasksDraft.setCount(count.toString())
                                                //     }
                                                // }
                                                // else {
                                                let count = parseInt(myTasksDraft.count);

                                                if (count == 1) {
                                                    checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.calculateScore(inspectionDetails);
                                                    // saveDataInDB('')
                                                }
                                                else if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                }
                                                else {
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                                // }
                                                // }
                                            }
                                            else {
                                                // if (context.isArabic) {
                                                //     let count = parseInt(myTasksDraft.count);
                                                //     count = count - 1;
                                                //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                //         myTasksDraft.setCount(count.toString())
                                                //     }
                                                // }
                                                // else {
                                                let count = parseInt(myTasksDraft.count);
                                                if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                } else if (count <= 3 && count >= 1) {
                                                    count = count + 1;
                                                    // if (taskType.toLowerCase() != 'follow-up') {
                                                    //     let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                    //     myTasksDraft.setResult(finalresult.action)
                                                    // }
                                                    myTasksDraft.setCount(count.toString())
                                                    saveDataInDB('');
                                                    // }
                                                }
                                            }
                                            // }
                                        }
                                    }}
                                    imageStyle={{ left: 3, height: '42%', width: '42%', alignSelf: 'center' }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    image={require('./../assets/images/startInspection/rightIcon32.png')}
                                />

                            </View>
                            :
                            <View style={{ flexDirection: 'row', flex: 1 }} />
                        :
                        parseInt(myTasksDraft.count) < 3 ?
                            <View style={{ flexDirection: 'row', flex: 1, height: '90%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>

                                <ButtonComponent
                                    style={{
                                        height: '100%', width: parseInt(myTasksDraft.count) >= 1 ? '30%' : '17%', backgroundColor: fontColor.ButtonBoxColor,
                                        borderRadius: 40, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                        textAlign: 'center'
                                    }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {
                                        if (context.isArabic) {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                                // saveDataInDB();
                                            }
                                        } else if (taskType.toLowerCase().includes('noc')) {
                                            let flag = false;
                                            let flagNo = false;
                                            let scoreflag = false;
                                            let naFlag = false;
                                            let questionNo = 0;
                                            for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                const element: any = modifiedCheckListData[index];
                                                if (element.Score == 'N' && element.comment == '') {
                                                    flag = true;
                                                    questionNo = (index + 1);
                                                    break;
                                                }
                                                if (element.Score == 'N') {
                                                    flagNo = true;
                                                }
                                                if (element.NAValue == 'Y') {
                                                    naFlag = true;
                                                }
                                                else if (element.Score == '' && element.NAValue == '') {
                                                    scoreflag = true;
                                                    questionNo = (index + 1);
                                                    break;
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            if (flag) {
                                                Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                            }
                                            else if (scoreflag) {
                                                Alert.alert("", 'Please enter score for question number ' + questionNo);
                                            }
                                            else {
                                                debugger;
                                                // if (naFlag && !flagNo) {
                                                //     licenseMyTasksDraft.setIsScoreN('N');
                                                // }
                                                // else  if (!naFlag && flagNo) {
                                                //     licenseMyTasksDraft.setIsScoreN('Y');
                                                // }
                                                // else {
                                                //     licenseMyTasksDraft.setIsScoreN('Y');
                                                // }
                                                let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                if (finalResult.action.toLowerCase() == 'satisfactory') {
                                                    licenseMyTasksDraft.setIsScoreN('N');
                                                }
                                                else {
                                                    licenseMyTasksDraft.setIsScoreN('Y');
                                                }

                                                debugger;
                                                if (licenseMyTasksDraft.rejectBtnClick) {
                                                    myTasksDraft.setResult('UnSatisfactory');
                                                }
                                                else {
                                                    myTasksDraft.setResult(finalResult.action);
                                                }
                                                let count = parseInt(myTasksDraft.count);
                                                let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                                                if (count == 1) {
                                                    let flag = false;
                                                    let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                    setpreviewCheckList(checkList);
                                                    for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                        const element = checkList[indexPreview];
                                                        if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                            flag = true;
                                                            break;
                                                        }
                                                        else if (element.NAValue == "Y") {
                                                            flag = true;
                                                            break;
                                                        }
                                                    }

                                                    if (flag) {
                                                        if (taskStatus != 'Completed') {
                                                            setPriview(true)
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else {
                                                        count = count + 1;
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                                else if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                } else if (count <= 3 && count >= 1) {
                                                    count = count + 1;
                                                    saveDataInDB('');
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                        }
                                        else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {

                                            let flag = false;
                                            let flagNo = false;
                                            let scoreflag = false;
                                            let naFlag = false;
                                            let questionNo = 0;
                                            for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                const element: any = modifiedCheckListData[index];

                                                if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na') && element.Comment2 == '') {
                                                    flag = true;
                                                    questionNo = (index + 1);
                                                    break;
                                                }
                                                else if (element.Score == '' || element.Score == '-') {
                                                    scoreflag = true;
                                                    questionNo = (index + 1);
                                                    break;
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            if (flag) {
                                                Alert.alert("", 'Please Enter Comment for question number ' + questionNo);
                                                // licenseMyTasksDraft.setIsScoreN('Y');
                                            }
                                            else if (scoreflag) {
                                                Alert.alert("", 'Please Enter Score for question number ' + questionNo);
                                                // licenseMyTasksDraft.setIsScoreN('Y');
                                            }
                                            else {
                                                debugger;
                                                // if (naFlag && !flagNo) {
                                                //     licenseMyTasksDraft.setIsScoreN('N');
                                                // }
                                                let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                debugger;

                                                myTasksDraft.setResult(finalResult.action);
                                                let count = parseInt(myTasksDraft.count);
                                                let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                if (count == 1) {
                                                    let flag = false;
                                                    let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                    setpreviewCheckList(checkList);


                                                    for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                        const element = checkList[indexPreview];
                                                        if ((element.Score.toLowerCase() == 'unsatisfactory' || element.Score.toLowerCase() == 'na' || element.Score.toLowerCase() === '')) {
                                                            flag = true;
                                                            break;
                                                        }
                                                        // else if (element.NAValue == "Y") {
                                                        //     flag = true;
                                                        //     break;
                                                        // }
                                                    }

                                                    if (flag) {
                                                        if (taskStatus != 'Completed') {
                                                            setPriview(true)
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else {
                                                        count = count + 1;
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                                else if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                }
                                                else if (count < 3 && count >= 1) {
                                                    count = count + 1;
                                                    saveDataInDB('');
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }

                                        }
                                        else if (taskType.toLowerCase().includes('food')) {
                                            let flag = false;
                                            let questionNo = 0;
                                            for (let index = 0; index < modifiedCheckListData.length; index++) {
                                                const element: any = modifiedCheckListData[index];
                                                if (element.Score == 'N' && element.comment == '') {
                                                    flag = true;
                                                    questionNo = (index + 1);
                                                    break;
                                                }
                                                else {
                                                    continue;
                                                }
                                            }
                                            if (flag) {
                                                Alert.alert("", 'Please enter comment for question number ' + questionNo);
                                            }
                                            else {

                                                let finalResult: any = scoreCalculations(modifiedCheckListData, inspectionDetails);
                                                debugger;
                                                myTasksDraft.setResult(finalResult.action);

                                                let count = parseInt(myTasksDraft.count);
                                                let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

                                                if (count == 1) {
                                                    let flag = false;
                                                    let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                                    setpreviewCheckList(checkList);
                                                    for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                                        const element = checkList[indexPreview];
                                                        if (element.Score !== 'N' && parseInt(element.Answers) < 4) {
                                                            flag = true;
                                                            break;
                                                        }
                                                        else if (element.NAValue == "Y") {
                                                            flag = true;
                                                            break;
                                                        }
                                                    }

                                                    if (flag) {
                                                        if (taskStatus != 'Completed') {
                                                            setPriview(true)
                                                        }
                                                        else {
                                                            count = count + 1;
                                                            myTasksDraft.setCount(count.toString())
                                                        }
                                                    }
                                                    else {
                                                        count = count + 1;
                                                        myTasksDraft.setCount(count.toString())
                                                    }
                                                }
                                                else if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                } else if (count <= 3 && count >= 1) {
                                                    count = count + 1;
                                                    saveDataInDB('');
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                        }
                                        else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'complaints' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection' || myTasksDraft.isMyTaskClick == 'campaign') {

                                            // if (context.isArabic) {
                                            //     let count = parseInt(myTasksDraft.count);
                                            //     count = count - 1;
                                            //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                            //         myTasksDraft.setCount(count.toString())
                                            //     }
                                            // }
                                            // else {
                                            let count = parseInt(myTasksDraft.count);

                                            if (count == 1) {
                                                checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.callToChecklistValidation(modifiedCheckListData, inspectionDetails);
                                                // saveDataInDB('')
                                            }
                                            else if (count == 2) {
                                                let taskDetails = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : inspectionDetails;
                                                let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];
                                                let flag = true;
                                                console.log("taskDetails.samplingFlag6>>" + taskDetails.samplingFlag);

                                                if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                                                    flag = true;
                                                }
                                                else {
                                                    if (!skipSampling) {
                                                        if (mappingData[0].samplingReport && mappingData[0].samplingReport.length) {
                                                            if (taskDetails.samplingFlag) {
                                                                // documentRef.current && documentRef.current.saveSign();
                                                            }
                                                            else {
                                                                flag = false;
                                                                Alert.alert('', 'Please Submit Sampling First.', [
                                                                    {
                                                                        text: "Ok",
                                                                        onPress: () => {
                                                                            NavigationService.navigate("Sampling", { title: "Sampling" })
                                                                        },
                                                                        style: "cancel"
                                                                    },
                                                                    {
                                                                        text: "Skip", onPress: () => {
                                                                            setSkipSampling(true)
                                                                        }
                                                                    }
                                                                ],
                                                                    { cancelable: false })
                                                                return;
                                                            }
                                                        }
                                                    }

                                                    if (!skipCond) {
                                                        if (mappingData[0].condemnationReport && mappingData[0].condemnationReport.length) {
                                                            if (taskDetails.condemnationFlag) {
                                                                // documentRef.current && documentRef.current.saveSign();
                                                            } else {
                                                                flag = false;
                                                                Alert.alert('', 'Please Submit Condemnation First.', [
                                                                    {
                                                                        text: "Ok",
                                                                        onPress: () => {
                                                                            NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                                                        },
                                                                        style: "cancel"
                                                                    },
                                                                    {
                                                                        text: "Skip", onPress: () => {
                                                                            setSkipCond(true)
                                                                        }
                                                                    }
                                                                ],
                                                                    { cancelable: false })
                                                                return;
                                                            }
                                                        }
                                                    }

                                                    if (!skipDet) {
                                                        if (mappingData[0].detentionReport && mappingData[0].detentionReport.length) {
                                                            if (taskDetails.detentionFlag) {
                                                                // documentRef.current && documentRef.current.saveSign();
                                                            } else {
                                                                flag = false;
                                                                Alert.alert('', 'Please Submit Detention First.', [
                                                                    {
                                                                        text: "Ok",
                                                                        onPress: () => {
                                                                            NavigationService.navigate("Detention", { title: "Detention" })
                                                                        },
                                                                        style: "cancel"
                                                                    },
                                                                    {
                                                                        text: "Skip", onPress: () => {
                                                                            setSkipDet(true)
                                                                        }
                                                                    }
                                                                ],
                                                                    { cancelable: false })
                                                                return;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (skipSampling && skipCond && skipDet) {
                                                    flag = true;
                                                }


                                                if (flag) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                }
                                                // documentRef.current && documentRef.current.saveSign();
                                                // saveDataInDB('')
                                            }
                                            else {
                                                // if (isValidated) {
                                                count = count + 1;
                                                if (count <= 3 && count >= 1) {
                                                    let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                    myTasksDraft.setResult(finalresult.action)
                                                    myTasksDraft.setCount(count.toString())
                                                    saveDataInDB('');
                                                }
                                            }
                                            // }
                                            // }
                                        }
                                        else if (taskType.toLowerCase() == 'follow-up') {

                                            if (context.isArabic) {
                                                let count = parseInt(myTasksDraft.count);
                                                count = count - 1;
                                                if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                            }
                                            else {
                                                let count = parseInt(myTasksDraft.count);

                                                if (count == 1) {
                                                    checklistComponentStepOneRef.current && checklistComponentStepOneRef.current.calculateScore(inspectionDetails);
                                                    // saveDataInDB('')
                                                }
                                                else if (count == 2) {
                                                    documentRef.current && documentRef.current.saveSign();
                                                    // saveDataInDB('')
                                                }
                                                else {
                                                    count = count + 1;
                                                    if (count <= 3 && count >= 1) {
                                                        myTasksDraft.setCount(count.toString())
                                                        saveDataInDB('');
                                                    }
                                                }
                                                // }
                                            }
                                        }
                                        else {
                                            // if (context.isArabic) {
                                            //     let count = parseInt(myTasksDraft.count);
                                            //     count = count - 1;
                                            //     if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                            //         myTasksDraft.setCount(count.toString())
                                            //     }
                                            // }
                                            // else {
                                            let count = parseInt(myTasksDraft.count);
                                            if (count == 2) {
                                                documentRef.current && documentRef.current.saveSign();
                                                // saveDataInDB('')
                                            } else if (count <= 3 && count >= 1) {
                                                count = count + 1;
                                                // if (taskType.toLowerCase() != 'follow-up') {
                                                //     let finalresult: any = scoreCalculations(modifiedCheckListData, inspectionDetails)
                                                //     myTasksDraft.setResult(finalresult.action)
                                                // }
                                                myTasksDraft.setCount(count.toString())
                                                saveDataInDB('');
                                            }
                                            // }
                                        }
                                    }
                                    }
                                    // }
                                    imageStyle={{ left: 3, height: '42%', width: '42%', alignSelf: 'center' }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    image={require('./../assets/images/startInspection/rightIcon32.png')}
                                />

                            </View>
                            :
                            <View style={{ flexDirection: 'row', flex: 1 }} />

                    }
                    <View style={{ flex: 0.1 }} />

                </View>
                {/* } */}

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >
    )
}

export default observer(StartInspection);

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
    diamondView: {
        width: 45,
        height: 45,
        // transform: [{ rotate: '45deg' }]
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});