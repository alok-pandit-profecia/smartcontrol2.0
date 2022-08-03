import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import FollowUpComponent from './../components/FollowUpComponent';
// import FollowUpDocumentationComponent from './../components/FollowUpDocumentationComponent';
// import FollowUpSubmissionComponent from './../components/FollowUpSubmissionComponent';
import DocumentationAndRecordComponent from '../components/DocumentationAndRecordComponent';
import SubmissionComponent from '../components/SubmissionComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { submissionPayloadFollow } from '../utils/payloads/ChecklistSubmitPayload'
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import CheckListSchema from './../database/CheckListSchema';
import LoginSchema from './../database/LoginSchema';
let realm = RealmController.getRealmInstance();
import TaskSchema from '../database/TaskSchema';
import EstablishmentSchema from './../database/EstablishmentSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertComponentForFoodAlert from '../components/AlertComponentForFoodAlert';
import AlertcomponentForFoodAlertSCD from '../components/AlertcomponentForFoodAlertSCD';

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');
const { Popover } = renderers

let estSelectedItem: any = {}

const FollowUpStartInspection = (props: any) => {

    const context = useContext(Context);
    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, foodalertDraft: rootStore.foodAlertsModel, completedTaskDraft: rootStore.completdMyTaskModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, establishmentDraft: rootStore.establishmentModel, licenseMyTasksDraft: rootStore.licenseMyTaskModel, bottomBarDraft: rootStore.bottomBarModel, documantationDraft: rootStore.documentationAndReportModel, condemnationDraft: rootStore.condemnationModel, samplingDraft: rootStore.samplingModel, detentionDraft: rootStore.detentionModel })
    const { licenseMyTasksDraft, myTasksDraft, completedTaskDraft, adhocTaskEstablishmentDraft, foodalertDraft, establishmentDraft, bottomBarDraft, documantationDraft, condemnationDraft, detentionDraft, samplingDraft } = useInject(mapStore)

    const followUpOneref = useRef(null);
    const documentRef = useRef(null);

    const [modifiedCheckListData, setModifiedCheckListData] = useState([]);
    const [sendModifiedCheckListData, setSendModifiedCheckListData] = useState([]);
    const [taskLoading, setTaskLoading] = useState(true);
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [allowedClick, setAllowedClick] = useState(true);

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scoreArray, setScoreArray] = useState([]);
    const [count, setCount] = useState(1);

    // alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);

    const [showFoodAlert, setShowFoodAlert] = useState(false);
    const [alertApplicableToCurrentTask, setAlertApplicableToCurrentTask] = useState(false);
    const [showFoodAlertForSCD, setShowFoodAlertForSCD] = useState(false);

    // regulation array of checklist
    const [regulationString, setRegulationString] = useState('');

    const [base64One, setBase64One] = useState('');
    const [base64Two, setBase64two] = useState('');

    const [commentErrorIndex, setCommentErrorIndex] = useState(0);
    const [errorGraceAlert, setErrorGraceAlert] = useState(false);
    const [errorCommentAlert, setErrorCommentAlert] = useState(false);
    const [graceErrorIndex, setGraceErrorIndex] = useState(0);
    const [graceErrorSectionTitle, setGraceErrorSectionTtile] = useState('');
    const [commentErrorSectionTitle, setCommentErrorSectionTtile] = useState('');
    const [finalTime, setFinalTime] = useState('00:00:00');

    const [comment, setComment] = useState('');
    const [grace, setGrace] = useState('');
    const [score, setScore] = useState('');
    const [info, setInfo] = useState('');
    const [attachment, setAttachment] = useState('');


    let foodAlertResponse = foodalertDraft.alertResponse != '' ? JSON.parse(foodalertDraft.alertResponse) : [];

    const backButtonHandler: any = (modifiedCheckListData: any) => {

        // setTimeout(() => {

        let timeElapsed = new Date();

        let obj: any = {};
        obj.checkList = JSON.stringify(modifiedCheckListData);
        obj.taskId = myTasksDraft.taskId;
        obj.timeElapsed = timeElapsed.toString();
        obj.timeStarted = startTime.toString();

        RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            // props.updateLoding(false);
        });

        // }, 2000)

    }
    // if (myTasksDraft.state === 'navigate') {
    //     NavigationService.navigate('Dashboard');
    //}

    useEffect(() => {
        setAllowedClick(true);
        try {
            debugger;
            if (myTasksDraft.state == 'navigate') {

                if (myTasksDraft.isMyTaskClick == 'campaign') {

                    myTasksDraft.setDataBlank()
                    let estListArray = JSON.parse(myTasksDraft.getEstListArray());
                    estSelectedItem.isUploaded = "true"
                    let arrayTemp: any = [];
                    arrayTemp.push(estSelectedItem);

                    RealmController.addEstablishmentDetails(realm, arrayTemp, EstablishmentSchema.name, () => {
                        // ToastAndroid.show('Task acknowldged successfully ', 1000);
                        let isUploaded = estListArray.map((item: any) => {
                            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, item.Id);
                            // //console.log("temp ", temp[0])

                            if (temp && temp[0]) {
                                return temp[0].isUploaded
                            }
                        });
                        let temp = isUploaded.some((item: any) => item === 'false');
                        if (temp) {
                            NavigationService.navigate('CampaignDetails');
                        }
                        else {
                            NavigationService.navigate('Dashboard');
                        }
                    });
                } else {
                    let taskDetails = { ...inspectionDetails }
                    // let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
                    // if (objct && objct['0']) {

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
                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task objct successfully ', 1000);
                        debugger;
                        licenseMyTasksDraft.setIsRejectBtnClick(false);
                        NavigationService.navigate('Dashboard');
                    });
                }
            }
            else if (myTasksDraft.state == 'failedToSubmit') {
                Alert.alert("Failed to submit task", "Do you want to try again", [
                    {
                        text: "Cancel",
                        onPress: () => { submitButtonPress(false) },
                        style: "cancel"
                    },
                    { text: "Try again", onPress: () => submitButtonPress(true) }
                ],
                    { cancelable: false })
            }
        }
        catch (error) {
            //console.log(error)
        }

    }, [myTasksDraft.state]);

    // const _handleAppStateChange = async (nextAppState: any) => {
    //     debugger
    //     if (AppState.currentState === "active") {
    //         try {

    //             const granted = await PermissionsAndroid.requestMultiple(
    //                 [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    //                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //                 ]
    //             ).then(async (result) => {

    //                 if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
    //                     && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {

    //                     RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
    //                         if (result == RNSettings.ENABLED) {

    //                             Geolocation.getCurrentPosition(
    //                                 (position) => {
    //                                     myTasksDraft.setLatitude(position.coords.latitude.toString())
    //                                     myTasksDraft.setLongitude(position.coords.longitude.toString())
    //                                     setLocation(prevState => {
    //                                         return { ...prevState, latitude: (position.coords.latitude), longitude: (position.coords.longitude) }
    //                                     });
    //                                     //console.log(position.coords.latitude+':'+ position.coords.longitude);
    //                                 },
    //                                 async (error) => {
    //                                     //console.log(error.code, error.message);
    //                                 },
    //                                 {
    //                                     enableHighAccuracy: false,
    //                                     timeout: 10000,
    //                                     maximumAge: 100000,
    //                                     forceRequestLocation: true,
    //                                     showLocationDialog: true
    //                                 }
    //                             );

    //                         } else {
    //                             setTurnOnLocation(true)
    //                         }
    //                     });
    //                     debugger;
    //                 }
    //                 else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'denied'
    //                     || result['android.permission.ACCESS_FINE_LOCATION']
    //                     === 'denied') {
    //                     debugger;
    //                     setNeverAskLocationPermissionAlert(true);
    //                 }
    //                 else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again'
    //                     || result['android.permission.ACCESS_FINE_LOCATION']
    //                     === 'never_ask_again') {
    //                     debugger;
    //                     setNeverAskLocationPermissionAlert(true);
    //                 }
    //             });
    //         } catch (err) {
    //             console.warn(err);
    //         }
    //     }
    // };

    useEffect(() => {
        setAllowedClick(true);

        estSelectedItem = adhocTaskEstablishmentDraft.getSelectedItem() != '' ? JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()) : {};
        myTasksDraft.setCount("1");

        if (foodAlertResponse.length && !myTasksDraft.isAlertApplicable && myTasksDraft.isMyTaskClick != 'CompletedTask') {
            setShowFoodAlert(true);
        }
        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, myTasksDraft.taskId);
        debugger;
        if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
            debugger
            NavigationService.goBack();
            setTaskLoading(false);
            // myTasksDraft.setState('pending')
        }

        if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {


            timeStarted = checkListData['0'].timeStarted;
            timeElapsed = checkListData['0'].timeElapsed;
            let temp, time: any;
            if (timeStarted) {
                temp = new Date(timeStarted).getTime();
                time = new Date(timeElapsed).getTime() - temp;
            } else {
                temp = new Date().getTime();
                time = temp - new Date(timeElapsed).getTime();
            }
            startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
            setModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
            setSendModifiedCheckListData(checkListData['0'] ? JSON.parse(checkListData['0'].checkList) : []);
            if (myTasksDraft.isAlertApplicable || myTasksDraft.isMyTaskClick == 'CompletedTask') {
                setTaskLoading(false)
            }
        }
        else {
            startTime = new Date();
            if (myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isAlertApplicable) {
                setTaskLoading(false)
            }
        }
        displayCounter();

        // RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
        //     if (result == RNSettings.ENABLED) {

        //         Geolocation.getCurrentPosition(
        //             (position) => {
        //                 myTasksDraft.setLatitude(position.coords.latitude.toString())
        //                 myTasksDraft.setLongitude(position.coords.longitude.toString())

        //                 setLocation(prevState => {
        //                     return { ...prevState, latitude: (position.coords.latitude), longitude: (position.coords.longitude) }
        //                 });
        //                 //console.log(position.coords.latitude+':'+ position.coords.longitude);
        //             },
        //             async (error) => {
        //                 //console.log(error.code, error.message);
        //             },
        //             {
        //                 enableHighAccuracy: false,
        //                 timeout: 10000,
        //                 maximumAge: 100000,
        //                 forceRequestLocation: true,
        //                 showLocationDialog: true
        //             }
        //         );

        //     } else {
        //         Alert.alert("Turn on Location","Please turn on location to fetch location",[
        //             {
        //               text: "Cancel",
        //               onPress: () => {NavigationService.goBack()},
        //               style: "cancel"
        //             },
        //             { text: "OK", onPress: () => AndroidOpenSettings.locationSourceSettings() }
        //           ],
        //           { cancelable: false })
        //     }
        // });

        // AppState.addEventListener("focus", _handleAppStateChange);

        // return () => {
        //     AppState.removeEventListener("focus", _handleAppStateChange);
        // };
    }, []);

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : "";

    useEffect(() => {
        setAllowedClick(true);
        debugger;
        // alert(myTasksDraft.noCheckList)
        let temp: any = Array();

        temp = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : myTasksDraft.selectedTask ? JSON.parse(myTasksDraft.selectedTask) : {}
        debugger
        // alert(JSON.stringify(inspection.mappingData))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        // myTasksDraft.setContactName(inspectionDetails.mappingData['0'].ContactName);
        // myTasksDraft.setMobileNumber(inspectionDetails.mappingData['0'].ContactNumber);
        // myTasksDraft.setEmiratesId(inspectionDetails.mappingData['0'].EmiratesId);

        // myTasksDraft.setDataLoggerCBValue(inspectionDetails.mappingData['0'].dataLoggerCBValue);
        // myTasksDraft.setFlashlightValue(inspectionDetails.mappingData['0'].flashlightCBValue);
        // myTasksDraft.setLuxmeterCBValue(inspectionDetails.mappingData['0'].luxmeterCBValue);
        // myTasksDraft.setThermometerCBValue(inspectionDetails.mappingData['0'].thermometerCBValue);
        // myTasksDraft.setUVlightCBValue(inspectionDetails.mappingData['0'].UVlightCBValue);

        // myTasksDraft.setFinalComment(inspectionDetails.mappingData['0'].overallComments)
        // documantationDraft.setFileBuffer((inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64) ? inspectionDetails.mappingData['0'] && inspectionDetails.mappingData['0'].signatureBase64 : '')

        setInspectionDetails(inspectionDetails);
        debugger

        let taskDetails = { ...inspectionDetails }
        // let temp: any = [];
        // alert(JSON.stringify(myTasksDraft.checkListArray))
        if (temp && temp.length > 0) {

            debugger;
            // let Obj = { ...taskDetails };
            let mappingData = (taskDetails.mappingData && (taskDetails.mappingData != '') && (typeof (taskDetails.mappingData) == 'string')) ? JSON.parse(taskDetails.mappingData) : [{}];
            debugger;

            if (mappingData) {
                // taskDetails.mappingData = mappingData;
                for (let index = 0; index < taskDetails.mappingData.length; index++) {
                    taskDetails.mappingData[0].inspectionForm = temp;
                }
                // taskDetails.mappingData[0] = newData;
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

            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
            // setInspectionDetails(taskDetails);
            // }
            setModifiedCheckListData(temp);
            setTaskLoading(false)
            setSendModifiedCheckListData(temp);
        }

        myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
        if (myTasksDraft.noCheckList == 'NocheckListAvailable') {
            debugger
            NavigationService.goBack()
            setTaskLoading(false)
            // myTasksDraft.setState('pending')
        }
        // }
        // }
    }, [myTasksDraft.checkListArray, myTasksDraft.noCheckList, licenseMyTasksDraft.checkListArray]);//myTasksDraft.checkListArray

    // setInterval(() => {
    //     if (modifiedCheckListData.length) {
    //         let tempArray: any = [...modifiedCheckListData], taskDetails = { ...inspectionDetails };
    //         debugger
    //         if (taskDetails.mappingData) {
    //             let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
    //             mappingData[0].inspectionForm = tempArray;
    //             taskDetails.mappingData = mappingData;
    //             RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
    //                 // ToastAndroid.show('Task objct successfully ', 1000);
    //             });
    //         }
    //         setInspectionDetails(taskDetails);
    //         setModifiedCheckListData(tempArray);
    //     }
    // }, 30000)

    useEffect(() => {
        setTaskLoading(false);
        setAllowedClick(true);
        if (myTasksDraft.selectedTask != '') {

            let taskId = JSON.parse(myTasksDraft.selectedTask).TaskId;
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, myTasksDraft.taskId);

            //console.log(JSON.stringify("checklistDtaa"));
            //  debugger;
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                let tempData = JSON.parse(checkListData[0].checkList);

                //  debugger;
                if (tempData && tempData.length > 0) {
                    setModifiedCheckListData(tempData);
                    setSendModifiedCheckListData(tempData);
                }
                //console.log("Inside if start follow", JSON.stringify(tempData))

            }
            else {
                //console.log("inside elde start foll")
                let tempModifiedCheckListData: any = [];
                let temp: any = myTasksDraft.checkListArray != '' ? JSON.parse(myTasksDraft.checkListArray) : [];
                debugger
                // let temp: any = [];
                if (temp && temp.length > 0) {
                    //console.log("Temo lenghth", temp.length);

                    setModifiedCheckListData(temp);
                    setSendModifiedCheckListData(temp);
                    //console.log("Inside else start follow", JSON.stringify(temp))

                }
            }
        }
    }, []);

    useEffect(() => {
        if (props.route && props.route.params && props.route.params.inspectionDetails) {
            setTaskLoading(false);
            //console.log("ndsjhfgwief,bggeliyrgb")
            setAllowedClick(false);

            //console.log("Infirst")
            let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {}
            debugger
            // alert(JSON.stringify(inspection.mappingData))
            let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
            inspectionDetails.mappingData = mappingData;

            setInspectionDetails(inspectionDetails);
            setSendModifiedCheckListData(mappingData[0].inspectionForm);
            setModifiedCheckListData(mappingData[0].inspectionForm);
            //console.log("Final", JSON.stringify(mappingData[0].inspectionForm))
            myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails));
        }


    }, [])

    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date().valueOf() - startTime);
            setFinalTime(finalTime => msToTime(diff))
        }, 1000);
    }

    const msToTime = (duration: any) => {

        let milliseconds = (parseInt(duration) % 1000) / 100;
        let seconds = Math.round((parseInt(duration) / 1000) % 60);
        let minutes = Math.round((parseInt(duration) / (1000 * 60)) % 60);
        let hours = Math.round((parseInt(duration) / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;

    }

    const onRegulationClick = (item: any) => {
        //  debugger
        let tempArray: any = [...modifiedCheckListData];
        //console.log("tempArray", tempArray);
        let header = item.parameterno;
        //console.log("header", header);
        let sectionIndex = tempArray.findIndex((item: any) => item.parameterno == header);
        //console.log("sectionIndex ", sectionIndex);
        // debugger

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(sectionIndex);

        let regulationArray = tempArray[sectionIndex].regulation;
        //console.log("regulationArray", regulationArray);
        let tempRegulationString = '';
        if (regulationArray && regulationArray.length > 0) {
            for (let index = 0; index < regulationArray.length; index++) {
                // debugger
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

    const onNIClick = (item: any) => {

        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        debugger
        // alert(JSON.stringify(item.ParameterNumber))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        let tempArray: any = [...modifiedCheckListData];
        debugger;
        tempArray = tempArray.map((u: any) => u.ParameterNumber !== item.ParameterNumber ? u : item);
        // setComment(tempArray[currentSection].comment);

        let taskDetails = { ...inspectionDetails };

        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData[0].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            debugger
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            });
        }
        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    // useEffect(() => {
    //     let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, props.selectedTaskId);
    //     // debugger;
    //     if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
    //         timeStarted = checkListData['0'].timeStarted;
    //         timeElapsed = checkListData['0'].timeElapsed;
    //         let temp, time;
    //         if (timeStarted) {
    //             temp = new Date(timeStarted).getTime();
    //             time = new Date(timeElapsed).getTime() - temp;
    //         } else {
    //             temp = new Date().getTime();
    //             time = temp - new Date(timeElapsed).getTime();
    //         }
    //         startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
    //     } else {
    //         startTime = new Date();
    //     }
    //     displayCounter();
    // }, []);


    const onClickScoreListItem = (item: any) => {
        // setShowScoreAlert(false);

        let tempArray: any = [...modifiedCheckListData];
        // debugger;
        // //console.log("tempArray", tempArray);
        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        // setComment(tempArray[currentSection].comment);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray)
    }

    const updateGraceValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        //console.log("tempArray", tempArray);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray)

    }

    const updateCommentValue = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray)
    }

    const backPress = () => {
        // props.updateLoding(true);

        // setTimeout(() => {
        let timeElapsed = new Date();

        let obj: any = {};
        obj.checkList = JSON.stringify(modifiedCheckListData);
        obj.taskId = myTasksDraft.taskId;
        obj.timeElapsed = timeElapsed.toString();
        obj.timeStarted = startTime.toString();
        // debugger;
        RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            // props.updateLoding(false);
            // myTasksDraft.setCount("1");
            // NavigationService.goBack();
        });

        // }, 2000)

    }

    const updateAttachment = (item: any) => {
        let tempArray: any = [...modifiedCheckListData];
        let inspectionDetails: any = Array();

        tempArray = tempArray.map((u: any) => u.parameterno !== item.parameterno ? u : item);

        let taskDetails = { ...inspectionDetails };

        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData[0].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }
        setInspectionDetails(taskDetails);
        setModifiedCheckListData(tempArray);
        backButtonHandler(tempArray);
    }

    const submit = async (flag: boolean) => {

        let TaskItem = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : '';
        let loginData = RealmController.getLoginData(realm, LoginSchema.name);
        loginData = loginData[0] ? loginData[0] : {};

        let taskDetails = { ...inspectionDetails };
        let tempArray = [...modifiedCheckListData];

        if (taskDetails.mappingData) {
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData[0].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
            });
        }

        let scoreFollowArray = myTasksDraft.scoreFollow;
        //console.log("ScoreFollow QArray", scoreFollowArray);


        // if (documantationDraft.fileBuffer === '') {
        //     Alert.alert("", "Signature is mandatory");
        //     return;
        // }

        if (myTasksDraft.contactName == "") {
            Alert.alert("", "Please enter contact name");
            return;
        }
        else if (myTasksDraft.mobileNumber == "") {
            Alert.alert("", "Please enter mobile number");
            return;
        }

        debugger;
        if (myTasksDraft.isMyTaskClick == "campaign") {

            if (estSelectedItem.EnglishName && estSelectedItem.EnglishName != '') {
                TaskItem.tradeEnglishName = estSelectedItem.EnglishName
            } else {
                TaskItem.tradeEnglishName = ''
            }

            // //console.log("estSelectedItem", JSON.stringify(estSelectedItem))
        }

        // //console.log("payload1: ", TaskItem)

        let payload: any = await submissionPayloadFollow(scoreFollowArray, taskDetails, tempArray, TaskItem.TaskId, TaskItem, loginData.username, myTasksDraft.contactName, myTasksDraft.mobileNumber, myTasksDraft.emiratesId, finalTime, myTasksDraft.finalComment, myTasksDraft.result, myTasksDraft.flashlightCBValue, myTasksDraft.thermometerCBValue, myTasksDraft.dataLoggerCBValue, myTasksDraft.luxmeterCBValue, myTasksDraft.UVlightCBValue, myTasksDraft.latitude, myTasksDraft.longitude);
        //console.log("taskDetails ", taskDetails);

        //console.log("Payload follow", payload);

        // let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
        debugger;

        if (taskDetails && taskDetails.mappingData) {

            let date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
            let ViolationDateArr = date.split(" ");
            let vioDate = ViolationDateArr[0];
            let vioTime = ViolationDateArr[1];


            let tempdata = { ...taskDetails }
            let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, tempdata.EstablishmentId);

            tempObjct[0].total_score = payload.InspectionCheckList.Inspection.Score;
            tempObjct[0].signatureBase64 = documantationDraft.fileBuffer;
            tempObjct[0].ContactName = myTasksDraft.contactName;
            tempObjct[0].ContactNumber = myTasksDraft.mobileNumber;
            tempObjct[0].EmiratesId = myTasksDraft.emiratesId;
            tempObjct[0].overallComments = myTasksDraft.finalComment;
            tempObjct[0].flashlightCBValue = myTasksDraft.flashlightCBValue;
            tempObjct[0].thermometerCBValue = myTasksDraft.thermometerCBValue;
            tempObjct[0].luxmeterCBValue = myTasksDraft.luxmeterCBValue;
            tempObjct[0].dataLoggerCBValue = myTasksDraft.dataLoggerCBValue;
            tempObjct[0].UVlightCBValue = myTasksDraft.UVlightCBValue;
            tempObjct[0].inspectionResult = payload.InspectionCheckList.Inspection.InspectionStatus;
            tempObjct[0].grade_percentage = payload.InspectionCheckList.Inspection.ScorePercent;
            tempObjct[0].finalResult = myTasksDraft.result;
            tempObjct[0].next_visit_date = payload.InspectionCheckList.Inspection.NearestDate;
            tempObjct[0].TradeExpiryDate = temp[0].LicenseExpiryDate;
            tempObjct[0].CustomerName = temp[0].EnglishName;
            tempObjct[0].CustomerNameEnglish = temp[0].EnglishName;
            tempObjct[0].ViolationDate = vioDate;
            tempObjct[0].ViolationTime = vioTime;
            tempObjct[0].GracePeriod = payload.InspectionCheckList.Inspection.GracePeriod;
            tempObjct[0].ScorePercent = payload.InspectionCheckList.Inspection.ScorePercent;
            tempdata.mappingData = tempObjct;
            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {

                // ToastAndroid.show('Task objct successfully ', 1000);
            });

        }
        debugger;
        myTasksDraft.setSelectedTask(JSON.stringify(taskDetails));
        myTasksDraft.callToSubmitTaskApi(payload, modifiedCheckListData, flag);

    }

    const submitButtonPress = async (flag: boolean) => {

        try {
            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
            let tempFlag = false;

            if (foodAlertResponse.length) {
                //console.log("Flags:::" + inspectionDetails.samplingFlag + ",," + inspectionDetails.condemnationFlag + ",," + inspectionDetails.detentionFlag)
                if (myTasksDraft.isAlertApplicable) {
                    if ((!inspectionDetails.samplingFlag) || (!inspectionDetails.condemnationFlag)) {
                        setShowFoodAlertForSCD(true);
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
                        setInspectionDetails(inspectionDetails);
                        //
                        if ((!inspectionDetails.samplingFlag) || (!inspectionDetails.condemnationFlag) || (!inspectionDetails.detentionFlag)) {
                            setShowFoodAlertForSCD(true);
                        }
                        else {
                            submit(flag)
                        }
                    }
                    else {
                        submit(flag)
                    }
                }
                else {
                    submit(flag)
                }
            }

        } catch (error) {
            // alert(error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={(taskLoading || myTasksDraft.state == 'pending') ? true : false}
                textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                ////customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
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
                                setAlertApplicableToCurrentTask(value)
                                // setShowFoodAlertForSCD(value);
                            }}
                        />
                        :
                        null
                }
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
                            okAlert={() => {
                                setShowFoodAlert(false);
                            }}
                            showAlertComponentForFoodAlertSCD={(value: boolean) => {
                                setShowFoodAlertForSCD(value);
                            }}
                            hideAlertComponentForFoodAlertSCD={(value: boolean) => {
                                setShowFoodAlertForSCD(value);
                            }}
                            message={!inspectionDetails.samplingFlag ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS1 : !inspectionDetails.condemnationFlag ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgC1 : !inspectionDetails.detentionFlag ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgD1 : Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS1}
                            message1={Strings[context.isArabic ? 'ar' : 'en'].sampling.msg2}
                            message2={Strings[context.isArabic ? 'ar' : 'en'].sampling.msg3}
                            message3={!inspectionDetails.samplingFlag ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS4 : !inspectionDetails.condemnationFlag ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgC4 : !inspectionDetails.detentionFlag ? Strings[context.isArabic ? 'ar' : 'en'].sampling.msgD4 : Strings[context.isArabic ? 'ar' : 'en'].sampling.msgS4}
                        />
                        :
                        null
                }
                <View style={{ flex: 1.5, alignSelf: 'center', width: '90%' }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1.1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].scheduled.followUp}</Text>
                        </View>

                        <View style={{ flex: 1.1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>
                {/* 
                <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                   

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View> */}


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

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <TouchableOpacity
                        onPress={() => {

                            if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'tempPermit') {
                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 2 && count >= 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                } else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) <= 2 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                            else {
                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 3 && count >= 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                } else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} >
                        <Image style={{ alignSelf: 'center', transform: [{ rotate: '180deg' }] }} source={require('./../assets/images/startInspection/arrow.png')} />
                    </TouchableOpacity>

                    <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: '#c4ddd2' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'right' }}>{parseInt(myTasksDraft.count) == 1 ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.checklist :
                            parseInt(myTasksDraft.count) == 2 ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.documentation :
                                Strings[context.isArabic ? 'ar' : 'en'].startInspection.submission}</Text>

                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'tempPermit') {

                                if (context.isArabic) {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count - 1;
                                    if (parseInt(myTasksDraft.count) < 2 && parseInt(myTasksDraft.count) > 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                                else {
                                    let count = parseInt(myTasksDraft.count);
                                    count = count + 1;
                                    if (count <= 2 && count >= 1) {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                            }
                            else {
                                if (parseInt(myTasksDraft.count) == 1) {
                                    followUpOneref.current && followUpOneref.current.calculateScore();

                                }
                                else {
                                    documentRef.current && documentRef.current.saveSign();
                                }
                            }

                        }}
                        style={{ flex: 0.5, backgroundColor: '#abcfbe', justifyContent: 'center', borderTopRightRadius: 18, borderBottomRightRadius: 18 }} >
                        <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/arrow.png')} />
                    </TouchableOpacity>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 8, backgroundColor: 'white', width: '85%', alignSelf: 'center', }}>
                    {


                        parseInt(myTasksDraft.count) == 1 ?
                            sendModifiedCheckListData && sendModifiedCheckListData.length ?
                                <FollowUpComponent
                                    allowedClick={allowedClick}
                                    ref={followUpOneref}
                                    DocumentationAndRecordComponent={onRegulationClick}
                                    onClickScoreListItem={(item: any) => { onClickScoreListItem(item) }}
                                    updateGraceValue={(item: any) => { updateGraceValue(item) }}
                                    onAttachmentImageClick={(item: any) => { updateAttachment(item) }}
                                    updateCommentValue={(item: any) => { updateCommentValue(item) }}
                                    onNIClick={(item: any) => { onNIClick(item) }}
                                    modifiedCheckListData={sendModifiedCheckListData}
                                    inspDetails={inspectionDetails}
                                    isArabic={context.isArabic}
                                />

                                : null

                            :
                            parseInt(myTasksDraft.count) == 2 ?

                                <DocumentationAndRecordComponent ref={documentRef} isArabic={context.isArabic} submit={() => submitButtonPress(true)} />

                                :
                                parseInt(myTasksDraft.count) == 3 ?
                                    <SubmissionComponent
                                        allowedClick={allowedClick}
                                        submitButtonPress={() => submitButtonPress(true)} isArabic={context.isArabic} /> : null
                    }
                </View>

                <View style={{ flex: 0.8, justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '85%', alignSelf: 'center', flexDirection: 'row' }}>
                    <View style={{ flex: 0.4, height: '100%', justifyContent: 'center', alignItems: 'flex-start', alignContent: 'center', width: '100%', alignSelf: 'center' }}>

                        {parseInt(myTasksDraft.count) > 1 ?
                            <TouchableOpacity
                                onPress={() => {

                                    if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'tempPermit') {
                                        if (context.isArabic) {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count + 1;
                                            if (count <= 2 && count >= 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        } else {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) <= 2 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                    }
                                    else {
                                        if (context.isArabic) {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count + 1;
                                            if (count <= 3 && count >= 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        } else {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) <= 3 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                    }
                                }}
                                style={{ height: 50, width: 50, backgroundColor: fontColor.ButtonBoxColor, justifyContent: 'center', borderRadius: 50 }} >
                                <Image style={{ alignSelf: 'center', transform: [{ rotate: '180deg' }] }} source={require('./../assets/images/startInspection/rightIcon32.png')} />
                            </TouchableOpacity> : null}



                    </View>

                    <View style={{ height: '100%', flex: 0.2, justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: '100%', alignSelf: 'center' }}>
                    </View>

                    <View style={{ height: '100%', flex: 0.4, justifyContent: 'center', alignItems: 'flex-end', alignContent: 'center', width: '100%', alignSelf: 'center' }}>

                        {parseInt(myTasksDraft.count) < 3 ?
                            <TouchableOpacity
                                onPress={() => {
                                    if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'tempPermit') {

                                        if (context.isArabic) {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count - 1;
                                            if (parseInt(myTasksDraft.count) < 2 && parseInt(myTasksDraft.count) > 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else {
                                            let count = parseInt(myTasksDraft.count);
                                            count = count + 1;
                                            if (count <= 2 && count >= 1) {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                    }
                                    else {
                                        if (parseInt(myTasksDraft.count) == 1) {
                                            followUpOneref.current && followUpOneref.current.calculateScore();

                                        }
                                        else {
                                            documentRef.current && documentRef.current.saveSign();
                                        }
                                    }

                                }}
                                style={{ height: 50, width: 50, backgroundColor: fontColor.ButtonBoxColor, alignItems: "center", justifyContent: 'center', borderRadius: 50 }} >
                                <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/rightIcon32.png')} />
                            </TouchableOpacity> : null}

                    </View>

                </View>

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >
    )
}


export default observer(FollowUpStartInspection);

const styles = StyleSheet.create({
    diamondView: {
        width: 45,
        height: 45,
        transform: [{ rotate: '45deg' }]
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});