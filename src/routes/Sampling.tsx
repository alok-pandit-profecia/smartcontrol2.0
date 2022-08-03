import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, FlatList, ToastAndroid } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { useIsFocused } from '@react-navigation/native';
import { Context } from '../utils/Context';
import TableComponent from './../components/TableComponent';
import NavigationService from '../services/NavigationService';
import TaskSchema from './../database/TaskSchema';
import LoginSchema from './../database/LoginSchema';
import { RealmController } from './../database/RealmController';
import ModalComponent from './../components/ModalComponentSamplingReport/ModalComponent';
let realm = RealmController.getRealmInstance();
import Spinner from 'react-native-loading-spinner-overlay';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
let moment = require('moment');
const { Popover } = renderers

const Sampling = (props: any) => {

    const context = useContext(Context);
    const [serialNumber, setSerialNumber] = useState(0);
    const [taskDetails, setTaskDetails] = useState(Object());
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [samplingArray, setSamplingArray] = useState(Array());
    const isFocused = useIsFocused();
    const [samplingFlag, setSamplingFlag] = useState(false);
    const [title, setTitle] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, samplingDraft: rootStore.samplingModel, establishmentDraft: rootStore.establishmentModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, samplingDraft, establishmentDraft, bottomBarDraft } = useInject(mapStore)

    const setSamplingData = (taskData: any) => {
        // alert(JSON.stringify(taskData));
        // let mappingData = taskData && taskData.mappingData && typeof (taskData.mappingData) == 'string' ? JSON.parse(taskData.mappingData)['0'] && JSON.parse(taskData.mappingData)['0'].samplingReport.length > 0 ? (JSON.parse(taskData.mappingData)['0'].samplingReport) : [] : [] ;

        let mappingData = taskData.mappingData ? typeof (taskData.mappingData) == 'string' ? JSON.parse(taskData.mappingData)[0].samplingReport : taskData.mappingData[0].samplingReport : [{}];

        let displayArr: any = [];
        let temp = mappingData != '' ? mappingData : [];
        console.log('taskData ::' + JSON.stringify(temp));

        // samplingDraft.setSamplingArray(JSON.stringify(temp));

        if (temp.length) {
            for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                const elementTemp = temp[indexTemp];
                let Arr = [];
                Arr =
                    [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                displayArr.push(Arr);
            }
        }

        setSerialNumber(displayArr.length);
        setSamplingArray(displayArr);
    }

    useEffect(() => {
        // if (!myTasksDraft.foodalertSampling) {
        let data: any = {}, objArr: any = [], displayArr = [];
        if (myTasksDraft.selectedTask != '') {
            data = JSON.parse(myTasksDraft.selectedTask);
            // debugger
            // alert(data.samplingFlag)
            if (data.samplingFlag) {
                setSamplingFlag(true)
            }
            else {
                setSamplingFlag(false)
            }
            setTaskDetails(data);
        }
        if (props.route && props.route.params && props.route.params.SamplingData) {

            const samplingDetails = props.route && props.route.params && props.route.params.SamplingData ? props.route.params.SamplingData : {};

            if (samplingDraft.samplingArray != '') {
                let array = JSON.parse(samplingDraft.samplingArray);
                let index = array.findIndex((x: any) => x.serialNumber === samplingDetails.serialNumber);
                if (index == 0 || index > 0) {
                    array = [...array.slice(0, index), samplingDetails, ...array.slice(index + 1, array.length)]
                }
                else {
                    array.push(samplingDetails);
                }
                samplingDraft.setSamplingArray(JSON.stringify(array))
                let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                goBack(BusinessActivity, false, true);
            }
            else {
                // if (samplingDetails.productName) {
                let array = [];
                array.push(samplingDetails);
                samplingDraft.setSamplingArray(JSON.stringify(array))
                let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                goBack(BusinessActivity, false, true);
                // }
            }

            let temp = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];

            if (temp.length) {

                for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                    const elementTemp = temp[indexTemp];
                    let Arr = [];
                    Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                    displayArr.push(Arr);
                }
                // if (samplingDetails.productName) {
                //     objArr =
                //         [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: samplingDetails.serialNumber },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: samplingDetails.productName },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: samplingDetails.brandName }];
                //     displayArr.push(objArr);
                // }
            }
            else {
                // if (samplingDetails.productName) {
                objArr =
                    [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: samplingDetails.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: samplingDetails.sampleName },
                    {
                        keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: samplingDetails.type
                    }];
                displayArr.push(objArr);
                // }
            }
            setSerialNumber(displayArr.length);
            setSamplingArray(displayArr);
        }
        else {

            //         let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

            // taskDetails.mappingData = mappingData;
            // if (myTasksDraft.isMyTaskClick == 'CompletedTask' && inspectionDetails.mappingData && inspectionDetails.mappingData[0].samplingReport ) {
            //     console.log('inspectionDetails ::' + JSON.stringify(inspectionDetails))
            //     setSamplingData(inspectionDetails);
            // }
            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
            let inspectionDetails = taskData['0'] ? taskData['0'] : JSON.parse(myTasksDraft.selectedTask)
            setInspectionDetails(inspectionDetails);
            let mappingData = inspectionDetails.mappingData ? typeof (inspectionDetails.mappingData) == 'string' ? JSON.parse(inspectionDetails.mappingData) : inspectionDetails.mappingData : [{}];

            if (myTasksDraft.foodalertSampling) {

                let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];
                let array = Array();

                // console.log("mappingData.samplingArr>>>"+JSON.stringify(mappingData))
                if (mappingData[0].samplingArr && mappingData[0].samplingArr.length) {
                    array = mappingData[0].samplingArr;
                    samplingDraft.setSamplingArray(JSON.stringify(array))
                }
                else if (alertObject.samplingArr && alertObject.samplingArr.length) {
                    array = alertObject.samplingArr;
                    samplingDraft.setSamplingArray(JSON.stringify(array))
                }
                let temp = array;

                if (temp.length) {
                    for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                        const elementTemp = temp[indexTemp];
                        let Arr = [];
                        Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                        displayArr.push(Arr);
                    }
                }
                setSerialNumber(displayArr.length);
                setSamplingArray(displayArr);

            }
            else {
                // console.log('inspectionDetails :: ' + JSON.stringify(inspectionDetails));
                if (taskData && taskData['0']) {
                    setSamplingData(taskData['0']);
                    setSamplingFlag(taskData['0'].samplingFlag);
                }
                else {

                    if (samplingDraft.samplingArray != '') {
                        let array = JSON.parse(samplingDraft.samplingArray);
                        samplingDraft.setSamplingArray(JSON.stringify(array))
                    }

                    let temp = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];

                    if (temp.length) {
                        for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                            const elementTemp = temp[indexTemp];
                            let Arr = [];
                            Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementTemp.serialNumber },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementTemp.sampleName },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementTemp.type }]
                            displayArr.push(Arr);
                        }
                    }
                    setSerialNumber(displayArr.length);
                    setSamplingArray(displayArr);
                }
            }
        }
        const title = props.route && props.route.params && props.route.params.title ? props.route.params.title : '';
        setTitle(title);

    }, [isFocused])

    const getFormattedDate = (date: any) => {
        return ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
            ("00" + date.getDate()).slice(-2) + "/" +
            date.getFullYear() + " " +
            ("00" + date.getHours()).slice(-2) + ":" +
            ("00" + date.getMinutes()).slice(-2) + ":" +
            ("00" + date.getSeconds()).slice(-2)
    }

    const submit = async (flag: boolean, value: string) => {

        try {
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};
            let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

            let taskDetails = await { ...inspectionDetails };
            debugger;


            let payload: any = {
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
                if (taskDetails && taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection) {
                    let tempdata = { ...taskDetails }
                    let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                    // tempObjct['0'].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                    // tempObjct['0'].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                    tempObjct['0'].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
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
            debugger;
            samplingDraft.setState('done')
            myTasksDraft.callToSubmitTaskApi(payload, [], flag);

        } catch (error) {
            console.log("error submit::" + error)
            submit(true, value)
        }
    }

    useEffect(() => {
        if (samplingDraft.state == 'navigate') {
            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
            let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
            inspectionDetails.samplingFlag = true;
            //console.log("sampSubNavi::"+JSON.stringify(inspectionDetails.mappingData[0].samplingReport))
            myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))

            if (myTasksDraft.isMyTaskClick === 'myTask') {
                let newTaskArray = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setDataArray1(JSON.stringify(newTaskArray));

                let newTaskArrayPast = myTasksDraft.dataArray1Past != '' ? JSON.parse(myTasksDraft.dataArray1Past) : [];
                newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setDataArray1Past(JSON.stringify(newTaskArrayPast));
            }
            else if (myTasksDraft.isMyTaskClick === 'license') {
                let newTaskArray = myTasksDraft.NOCList != '' ? JSON.parse(myTasksDraft.NOCList) : [];
                newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setNocList(JSON.stringify(newTaskArray));

                let newTaskArrayPast = myTasksDraft.NOCListPast != '' ? JSON.parse(myTasksDraft.NOCListPast) : [];
                newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setNocListPast(JSON.stringify(newTaskArrayPast));
            }
            else if (myTasksDraft.isMyTaskClick === 'case') {
                let newTaskArray = myTasksDraft.complaintAndFoodPosioningList != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningList) : [];
                newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(newTaskArray));

                let newTaskArrayPast = myTasksDraft.complaintAndFoodPosioningListPast != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast) : [];
                newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setComplaintAndFoodPosioningListPast(JSON.stringify(newTaskArrayPast));
            }
            else if (myTasksDraft.isMyTaskClick === 'campaign') {
                let newTaskArray = myTasksDraft.campaignList != '' ? JSON.parse(myTasksDraft.campaignList) : [];
                newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.campaignTaskId);
                myTasksDraft.setCampaignList(JSON.stringify(newTaskArray));

                let newTaskArrayPast = myTasksDraft.campaignListPast != '' ? JSON.parse(myTasksDraft.campaignListPast) : [];
                newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setCampaignListPast(JSON.stringify(newTaskArrayPast));
            }
            else if (myTasksDraft.isMyTaskClick === 'tempPermit') {
                let newTaskArray = myTasksDraft.eventsList != '' ? JSON.parse(myTasksDraft.eventsList) : [];
                newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setEventsList(JSON.stringify(newTaskArray));

                let newTaskArrayPast = myTasksDraft.eventsListPast != '' ? JSON.parse(myTasksDraft.eventsListPast) : [];
                newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                myTasksDraft.setEventsListPast(JSON.stringify(newTaskArrayPast));
            }

            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task updated successfully ', 1000);
                samplingDraft.setState("done");
                if (inspectionDetails.TaskType.toLowerCase() == 'sampling') {
                    submit(true, 'withoutChecklist')
                }
                else {
                    NavigationService.goBack();
                }
            });
        }
    }, [samplingDraft.state])

    const exportPDF = () => {
        setIsModalVisible(false);
    }

    const closeAlert = () => {
        setIsModalVisible(false);
    }

    const renderData = (item: any, index: number) => {

        return (
            <View style={{ flex: 1, height: HEIGHT * 0.15, width: '100%', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 10 }}>
                <TableComponent isHeader={true}
                    isView={((myTasksDraft.isMyTaskClick == 'CompletedTask') || taskDetails.samplingFlag) ? true : false}
                    isEdit={((myTasksDraft.isMyTaskClick == 'CompletedTask') || taskDetails.samplingFlag) ? false : true}
                    editData={() => { editData(item) }}
                    // isDelete={((myTasksDraft.isMyTaskClick == 'CompletedTask') || taskDetails.samplingFlag) ? false : true}
                    // deleteData={() => { deleteData(item) }}
                    isArabic={context.isArabic} HeaderName={Strings[context.isArabic ? 'ar' : 'en'].detention.recordNumber + ' ' + (index + 1)}
                    data={item}
                    viewData={() => { editData(item) }}
                />
            </View>
        )
    }

    const goBack = (BusinessActivity: any, submit: boolean,fromDelete: boolean) => {//
        try {
            if (myTasksDraft.foodalertSampling) {
                let samplingArr = samplingDraft.samplingArray != "" ? JSON.parse(samplingDraft.samplingArray) : [];
                let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];
                alertObject.samplingArr = samplingArr;
                let inspectionDetailsTemp = { ...inspectionDetails }
                let mappingData = inspectionDetailsTemp.mappingData ? typeof (inspectionDetailsTemp.mappingData) == 'string' ? JSON.parse(inspectionDetailsTemp.mappingData) : inspectionDetailsTemp.mappingData : [{}];
                mappingData[0].samplingArr = samplingArr;
                inspectionDetailsTemp.mappingData = mappingData;
                setInspectionDetails(inspectionDetailsTemp);

                // console.log("savemappingData.samplingArr>>"+JSON.stringify(inspectionDetailsTemp.mappingData))
                myTasksDraft.setAlertObject(JSON.stringify(alertObject));
                RealmController.addTaskDetails(realm, inspectionDetailsTemp, TaskSchema.name, () => {
                });

                NavigationService.goBack();
            }
            else {
                let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

                let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
                // alert(JSON.stringify(inspection.mappingData))
                let mappingData = inspectionDetails.mappingData ? (typeof (inspectionDetails.mappingData) == 'string') ? JSON.parse(inspectionDetails.mappingData) : inspectionDetails.mappingData : [{}];
                mappingData[0].samplingReport = samplingDraft.samplingArray != "" ? JSON.parse(samplingDraft.samplingArray) : []
                inspectionDetails.mappingData = mappingData;

                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))

                if (myTasksDraft.isMyTaskClick === 'myTask') {
                    let newTaskArray = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                    newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setDataArray1(JSON.stringify(newTaskArray));

                    let newTaskArrayPast = myTasksDraft.dataArray1Past != '' ? JSON.parse(myTasksDraft.dataArray1Past) : [];
                    newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setDataArray1Past(JSON.stringify(newTaskArrayPast));
                }
                else if (myTasksDraft.isMyTaskClick === 'license') {
                    let newTaskArray = myTasksDraft.NOCList != '' ? JSON.parse(myTasksDraft.NOCList) : [];
                    newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setNocList(JSON.stringify(newTaskArray));

                    let newTaskArrayPast = myTasksDraft.NOCListPast != '' ? JSON.parse(myTasksDraft.NOCListPast) : [];
                    newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setNocListPast(JSON.stringify(newTaskArrayPast));
                }
                else if (myTasksDraft.isMyTaskClick === 'case') {
                    let newTaskArray = myTasksDraft.complaintAndFoodPosioningList != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningList) : [];
                    newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(newTaskArray));

                    let newTaskArrayPast = myTasksDraft.complaintAndFoodPosioningListPast != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast) : [];
                    newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setComplaintAndFoodPosioningListPast(JSON.stringify(newTaskArrayPast));
                }
                else if (myTasksDraft.isMyTaskClick === 'campaign') {
                    let newTaskArray = myTasksDraft.campaignList != '' ? JSON.parse(myTasksDraft.campaignList) : [];
                    newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.campaignTaskId);
                    myTasksDraft.setCampaignList(JSON.stringify(newTaskArray));

                    let newTaskArrayPast = myTasksDraft.campaignListPast != '' ? JSON.parse(myTasksDraft.campaignListPast) : [];
                    newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setCampaignListPast(JSON.stringify(newTaskArrayPast));
                }
                else if (myTasksDraft.isMyTaskClick === 'tempPermit') {
                    let newTaskArray = myTasksDraft.eventsList != '' ? JSON.parse(myTasksDraft.eventsList) : [];
                    newTaskArray = newTaskArray.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setEventsList(JSON.stringify(newTaskArray));

                    let newTaskArrayPast = myTasksDraft.eventsListPast != '' ? JSON.parse(myTasksDraft.eventsListPast) : [];
                    newTaskArrayPast = newTaskArrayPast.map((i: any) => i.TaskId == myTasksDraft.taskId ? inspectionDetails : i);
                    myTasksDraft.setEventsListPast(JSON.stringify(newTaskArrayPast));
                }

                RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                    // ToastAndroid.show('Task updated successfully ', 1000);
                    // alert(BusinessActivity)
                    if (BusinessActivity && (BusinessActivity != '') && submit) {
                        samplingDraft.callToSubmitSamplingService(taskDetails, BusinessActivity);
                    }
                    else {
                        // ToastAndroid.show('No BusinessActivity found', 1000);
                        if (fromDelete) {

                        }
                        else {
                            NavigationService.goBack();
                        }

                    }
                });
            }

        }
        catch (e) {
            console.warn("Sampling goback func >>" + e)
            // samplingDraft.callToSubmitSamplingService(taskDetails.TaskId, BusinessActivity);
        }
    }

    const editData = (item: any) => {
        samplingDraft.setClearData()
        let fullObj = JSON.parse(samplingDraft.samplingArray), serialNO = 0;
        debugger
        fullObj = fullObj.filter((x: any) => x.serialNumber == item[0].value)
        for (let index = 0; index < fullObj.length; index++) {
            const element = fullObj[index];
            debugger
            if (element.serialNumber == item[0].value) {
                samplingDraft.setSerialNumber(fullObj[index].serialNumber);
                samplingDraft.setSampleCollectionReason(fullObj[index].sampleCollectionReason);
                samplingDraft.setSampleName(fullObj[index].sampleName);
                samplingDraft.setDateofSample(fullObj[index].dateofSample);
                samplingDraft.setSampleState(fullObj[index].sampleState);
                samplingDraft.setSampleTemperature(fullObj[index].sampleTemperature);
                samplingDraft.setRemainingQuantity(fullObj[index].remainingQuantity);
                samplingDraft.setType(fullObj[index].type);
                samplingDraft.setUnit(fullObj[index].unit);
                samplingDraft.setquantity(fullObj[index].quantity);
                samplingDraft.setnetWeight(fullObj[index].netWeight);
                samplingDraft.setpackage(fullObj[index].package);
                samplingDraft.setbatchNumber(fullObj[index].batchNumber);
                samplingDraft.setbrandName(fullObj[index].brandName);
                samplingDraft.setproductionDate(fullObj[index].productionDate);
                samplingDraft.setExpiryDate(fullObj[index].expiryDate);
                samplingDraft.setCountryOfOrigin(fullObj[index].countryOfOrigin);
                samplingDraft.setremarks(fullObj[index].remarks);
                samplingDraft.setAttachment1(fullObj[index].attachment1);
                samplingDraft.setAttachment2(fullObj[index].attachment2);
                serialNO = fullObj[index].serialNumber;
            }
        }
        NavigationService.navigate('SamplingForm', { serialNumber: serialNO, title: title, viewOnly: samplingFlag });
    }

    const deleteData = (item: any) => {
        let samplingArrTemp = [...samplingArray];
        samplingArrTemp = samplingArrTemp.filter((i: any) => i.serialNumber != item.serialNumber)

        setSamplingArray(samplingArrTemp)
        samplingDraft.setSamplingArray(samplingArrTemp.length ? JSON.stringify(samplingArrTemp) : '')
        let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
        // goBack(BusinessActivity, false,true);
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {
                    isModalVisible ?
                        <ModalComponent
                            data={inspectionDetails}
                            sampling={true}
                            sampleArr={samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : []}
                            establishData={establishmentDraft}
                            createPdfMsg={Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.createPdfMsg}
                            closeAlert={closeAlert}
                            exportPDF={exportPDF}

                        />
                        : null
                }
                <Spinner
                    visible={samplingDraft.state == 'pending' ? true : false}
                    textContent={samplingDraft.loadingState != '' ? samplingDraft.loadingState : 'Loading ...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}

                />

                <View style={{ flex: 1.5 }}>
                    <Header
                        screenName={'sampling'}
                        goBack={() => {
                            let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                            // goBack(BusinessActivity, false);
                            goBack(BusinessActivity, false,false);

                        }}
                        isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.8 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{title}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
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

                <View style={{ flex: 7, width: '85%', alignSelf: 'center', }}>

                    {(myTasksDraft.isMyTaskClick == 'CompletedTask') || samplingFlag ? null :

                        <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: (samplingDraft.samplingArray != '' && JSON.parse(samplingDraft.samplingArray).length > 0) ? 'space-between' : 'center', alignItems: (samplingDraft.samplingArray != '' && JSON.parse(samplingDraft.samplingArray).length > 0) ? 'flex-start' : 'center' }}>

                            {

                                (samplingDraft.samplingArray != '' && (JSON.parse(samplingDraft.samplingArray).length > 0)) ?

                                    <TouchableOpacity
                                        disabled={samplingFlag ? true : false}
                                        onPress={() => {
                                            if (samplingDraft.samplingArray != '') {
                                                let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                                                // goBack(BusinessActivity, true);
                                                goBack(BusinessActivity, true,false);

                                            }
                                            // NavigationService.navigate('SamplingForm');
                                        }}
                                        style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                        <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.finalSubmit)}</Text>
                                    </TouchableOpacity>
                                    : <View style={{ height: 40, top: 9, width: "5%", justifyContent: 'center', alignSelf: "center" }} />
                            }


                            <TouchableOpacity
                                disabled={samplingFlag || (myTasksDraft.isMyTaskClick == 'CompletedTask') ? true : false}
                                onPress={() => {
                                    samplingDraft.setClearData();
                                    NavigationService.navigate('SamplingForm', { serialNumber: serialNumber + 1, title: title });
                                }}
                                style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.addRecord)}</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 5 }} >
                        <FlatList
                            data={samplingArray}
                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#565758', fontFamily: fontFamily.textFontFamily }}>{'No Records Found'}</Text>
                                    </View>
                                )
                            }}
                            // columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                            // initialNumToRender={5}
                            renderItem={({ item, index }) => {
                                return (
                                    renderData(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                        // numColumns={4}
                        />

                    </View>

                    {(inspectionDetails.samplingFlag || (samplingArray.length && (myTasksDraft.isMyTaskClick == 'CompletedTask'))) ?
                        <ButtonComponent
                            style={{
                                padding: 10, width: '50%', backgroundColor: 'red',
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => {
                                setIsModalVisible(true);

                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.print)}
                        />
                        : null
                    }
                </View>

                <View style={{ flex: 1 }} />

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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(Sampling);

