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
import { RealmController } from './../database/RealmController';
import TaskSchema from './../database/TaskSchema';
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
import LoginSchema from './../database/LoginSchema';
let moment = require('moment');
const { Popover } = renderers

const Condemnation = (props: any) => {

    const context = useContext(Context);
    const [CondemnationArray, setCondemnationArray] = useState(Array());
    const [serialNumber, setSerialNumber] = useState(0);
    const [condemnationFlag, setCondemnationFlag] = useState(false);
    const [taskDetails, setTaskDetails] = useState(Object());
    const [title, setTitle] = useState('');
    const [inspectionDetails, setInspectionDetails] = useState(Object());

    const isFocused = useIsFocused();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, condemnationDraft: rootStore.condemnationModel, establishmentDraft: rootStore.establishmentModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, condemnationDraft, establishmentDraft, bottomBarDraft } = useInject(mapStore)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const exportPDF = () => {
        setIsModalVisible(false);
    }

    const closeAlert = () => {
        setIsModalVisible(false);
    }
    const setCondemnationData = (taskData: any) => {

        let mappingData = taskData ? taskData.mappingData ? JSON.parse(taskData.mappingData)['0'].condemnationReport && JSON.parse(taskData.mappingData)['0'].condemnationReport.length > 0 ? (JSON.parse(taskData.mappingData)['0'].condemnationReport) : [] : [] : [];

        let displayArr: any = [];
        let temp = mappingData != '' ? mappingData : [];

        condemnationDraft.setCondemnationArray(JSON.stringify(temp));

        if (temp.length) {
            for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                const elementTemp = temp[indexTemp];
                let Arr = [];
                Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                displayArr.push(Arr);
            }
        }

        setSerialNumber(displayArr.length);
        setCondemnationArray(displayArr);
    }

    useEffect(() => {

        debugger;

        // let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

        // let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        // // alert(JSON.stringify(inspection.mappingData))
        // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        // inspectionDetails.mappingData = mappingData;

        // setTaskDetails(inspectionDetails);
        // if (!myTasksDraft.foodalertSampling) {

        let data: any = {}, objArr: any = [], displayArr = [];
        if (myTasksDraft.selectedTask != '') {
            data = JSON.parse(myTasksDraft.selectedTask);
            // debugger
            // alert(data.samplingFlag)
            if (data.condemnationFlag) {
                setCondemnationFlag(true)
            }
            else {
                setCondemnationFlag(false)
            }
            setTaskDetails(data);
        }

        if (props.route && props.route.params && props.route.params.condemnationData) {

            const condemnationDetails = props.route && props.route.params && props.route.params.condemnationData ? props.route.params.condemnationData : {};
            debugger;
            if (condemnationDraft.condemnationArray != '') {
                let array = JSON.parse(condemnationDraft.condemnationArray);
                let index = array.findIndex((x: any) => x.serialNumber === condemnationDetails.serialNumber);
                debugger
                if (index == 0 || index > 0) {
                    array = [...array.slice(0, index), condemnationDetails, ...array.slice(index + 1, array.length)]
                    debugger
                }
                else {
                    array.push(condemnationDetails);
                    debugger;
                }
                condemnationDraft.setCondemnationArray(JSON.stringify(array))
                let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                goBack(BusinessActivity, false, true);
            }
            else {
                debugger
                if (condemnationDetails.productName) {
                    let array = [];
                    array.push(condemnationDetails);
                    condemnationDraft.setCondemnationArray(JSON.stringify(array))
                    let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                    goBack(BusinessActivity, false, true);
                }
            }

            let temp = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];

            if (temp.length) {
                for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                    const elementTemp = temp[indexTemp];
                    let Arr = [];
                    Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                    displayArr.push(Arr);
                }
                // if (condemnationDetails.productName) {
                //     objArr =
                //         [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: condemnationDetails.serialNumber },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: condemnationDetails.productName },
                //         { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: condemnationDetails.brandName }];
                //     displayArr.push(objArr);
                // }
            }
            else {
                if (condemnationDetails.productName) {
                    objArr =
                        [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: condemnationDetails.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: condemnationDetails.productName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: condemnationDetails.brandName }];
                    displayArr.push(objArr);
                }
            }
            setSerialNumber(displayArr.length);
            setCondemnationArray(displayArr);
        }
        else {
            debugger;

            let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
            let inspectionDetails = taskData['0'] ? taskData['0'] : JSON.parse(myTasksDraft.selectedTask)
            setInspectionDetails(inspectionDetails);
            let mappingData = inspectionDetails.mappingData ? typeof (inspectionDetails.mappingData) == 'string' ? JSON.parse(inspectionDetails.mappingData) : inspectionDetails.mappingData : [{}];

            if (myTasksDraft.foodalertSampling) {

                let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];
                let array = Array();
                if (mappingData[0].condemnationArr && mappingData[0].condemnationArr.length) {
                    array = mappingData[0].condemnationArr;
                    condemnationDraft.setCondemnationArray(JSON.stringify(array))
                }
                else if (alertObject.condemnationArr && alertObject.condemnationArr.length) {
                    array = alertObject.condemnationArr;
                    condemnationDraft.setCondemnationArray(JSON.stringify(array))
                }

                let temp = array;

                if (temp.length) {
                    for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                        const elementTemp = temp[indexTemp];
                        let Arr = [];
                        Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                        displayArr.push(Arr);
                    }
                }
                setSerialNumber(displayArr.length);
                setCondemnationArray(displayArr);

            }
            else {

                // console.log('inspectionDetails :: ' + JSON.stringify(inspectionDetails));
                if (taskData && taskData['0']) {
                    setCondemnationData(taskData['0']);
                    setCondemnationFlag(taskData['0'].condemnationFlag);
                }
                else {
                    if (condemnationDraft.condemnationArray != '') {
                        let array = JSON.parse(condemnationDraft.condemnationArray);
                        condemnationDraft.setCondemnationArray(JSON.stringify(array))
                    }

                    let temp = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];

                    if (temp.length) {
                        for (let indexTemp = 0; indexTemp < temp.length; indexTemp++) {
                            const elementTemp = temp[indexTemp];
                            let Arr = [];
                            Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.serialNumber, value: elementTemp.serialNumber },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.productName, value: elementTemp.productName },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].detention.brandName, value: elementTemp.brandName }]
                            displayArr.push(Arr);
                        }
                    }
                    setSerialNumber(displayArr.length);
                    setCondemnationArray(displayArr);
                }
            }
        }
        const title = props.route ? props.route.params ? props.route.params.title : {} : {};
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
                    tempObjct['0'].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                    // tempObjct['0'].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                    // tempObjct['0'].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                    tempdata.mappingData = tempObjct;
                    RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                        // ToastAndroid.show('Task objct successfully ', 1000);
                    });

                }
            }
            catch (e) {
                console.log('exception' + e);
            }
            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
            condemnationDraft.setState('done')
            myTasksDraft.callToSubmitTaskApi(payload, [], flag);

        } catch (error) {
            console.log("error submit::" + error)
            submit(true, value)
        }
    }
    useEffect(() => {
        if (condemnationDraft.state == 'navigate') {
            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
            let inspectionDetails = objct['0'] ? objct['0'] : taskDetails;
            inspectionDetails.condemnationFlag = true;
            myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
            //console.log("conSubNavi::"+JSON.stringify(inspectionDetails.mappingData[0].condemnationReport))

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
                if (inspectionDetails.TaskType.toLowerCase() == 'condemnation') {
                    submit(true, 'withoutChecklist')
                }
                else {
                    NavigationService.goBack();
                }
                // NavigationService.goBack();
                condemnationDraft.setState('done')
            });
        }
    }, [condemnationDraft.state])

    const deleteData = (item: any) => {
        let condemnationArrTemp = [...CondemnationArray];
        condemnationArrTemp = condemnationArrTemp.filter((i: any) => i.serialNumber != item.serialNumber)

        setCondemnationArray(condemnationArrTemp)
        condemnationDraft.setCondemnationArray(condemnationArrTemp.length ? JSON.stringify(condemnationArrTemp) : '')
        let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
        goBack(BusinessActivity, false, true);
    }

    const renderData = (item: any, index: number) => {

        return (
            <View style={{ flex: 1, height: HEIGHT * 0.15, width: '100%', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 10 }}>
                <TableComponent isHeader={true} editData={() => { editData(item) }}
                    viewData={() => { viewData(item) }}
                    isView={((myTasksDraft.isMyTaskClick == 'CompletedTask') || taskDetails.condemnationFlag) ? true : false}
                    isEdit={((myTasksDraft.isMyTaskClick == 'CompletedTask') || taskDetails.condemnationFlag) ? false : true} isArabic={context.isArabic} HeaderName={Strings[context.isArabic ? 'ar' : 'en'].detention.recordNumber + ' ' + (index + 1)}
                    // isDelete={((myTasksDraft.isMyTaskClick == 'CompletedTask') || taskDetails.samplingFlag) ? false : true}
                    // deleteData={() => { deleteData(item) }}
                    data={item}
                />
            </View>
        )
    }
    const editData = (item: any) => {
        condemnationDraft.setClearData();
        let fullObj = condemnationDraft.condemnationArray != "" ? JSON.parse(condemnationDraft.condemnationArray) : [], serialNO = 0;
        debugger;
        // alert('attachment' + JSON.stringify(condemnationDraft.condemnationArray));
        // fullObj = fullObj.filter((x: any) => x.serialNumber == item[0].value)
        for (let index = 0; index < fullObj.length; index++) {
            const element = fullObj[index];
            debugger;
            if (element.serialNumber == item[0].value) {
                condemnationDraft.setSerialNumber(fullObj[index].serialNumber);
                condemnationDraft.setProductName(fullObj[index].productName);
                condemnationDraft.setUnit(fullObj[index].unit);
                condemnationDraft.setQuantity(fullObj[index].quantity);
                condemnationDraft.setNeWeight(fullObj[index].netWeight);
                condemnationDraft.setPackage(fullObj[index].package);
                condemnationDraft.setBatchNumber(fullObj[index].batchNumber);
                condemnationDraft.setBrandName(fullObj[index].brandName);
                condemnationDraft.setremarks(fullObj[index].remarks);
                condemnationDraft.setPlace(fullObj[index].place);
                condemnationDraft.setReason(fullObj[index].reason);
                condemnationDraft.setAttachment1(fullObj[index].attachment1);
                condemnationDraft.setAttachment2(fullObj[index].attachment2);
                serialNO = fullObj[index].serialNumber;
            }
        }
        NavigationService.navigate('CondemnationForm', { serialNumber: serialNO, 'view': false, title: title });
    }


    const viewData = (item: any) => {

        condemnationDraft.setClearData();
        let fullObj = condemnationDraft.condemnationArray != "" ? JSON.parse(condemnationDraft.condemnationArray) : [], serialNO = 0;
        debugger;
        // alert('attachment' + JSON.stringify(condemnationDraft.condemnationArray));
        // fullObj = fullObj.filter((x: any) => x.serialNumber == item[0].value)
        for (let index = 0; index < fullObj.length; index++) {
            const element = fullObj[index];
            debugger;
            if (element.serialNumber == item[0].value) {
                condemnationDraft.setSerialNumber(fullObj[index].serialNumber);
                condemnationDraft.setProductName(fullObj[index].productName);
                condemnationDraft.setUnit(fullObj[index].unit);
                condemnationDraft.setQuantity(fullObj[index].quantity);
                condemnationDraft.setNeWeight(fullObj[index].netWeight);
                condemnationDraft.setPackage(fullObj[index].package);
                condemnationDraft.setBatchNumber(fullObj[index].batchNumber);
                condemnationDraft.setBrandName(fullObj[index].brandName);
                condemnationDraft.setremarks(fullObj[index].remarks);
                condemnationDraft.setPlace(fullObj[index].place);
                condemnationDraft.setReason(fullObj[index].reason);
                condemnationDraft.setAttachment1(fullObj[index].attachment1);
                condemnationDraft.setAttachment2(fullObj[index].attachment2);
                serialNO = fullObj[index].serialNumber;
            }
        }
        NavigationService.navigate('CondemnationForm', { serialNumber: serialNO, view: true, title: title });
    }

    const goBack = (BusinessActivity: any, submit: boolean, fromDelete: boolean) => {
        debugger;
        try {
            if (myTasksDraft.foodalertSampling) {
                let condemnationArr = condemnationDraft.condemnationArray != "" ? JSON.parse(condemnationDraft.condemnationArray) : [];
                let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];
                alertObject.condemnationArr = condemnationArr;

                let inspectionDetailsTemp = { ...inspectionDetails }
                let mappingData = inspectionDetailsTemp.mappingData ? typeof (inspectionDetailsTemp.mappingData) == 'string' ? JSON.parse(inspectionDetailsTemp.mappingData) : inspectionDetailsTemp.mappingData : [{}];
                mappingData[0].condemnationArr = condemnationArr;
                inspectionDetailsTemp.mappingData = mappingData;
                setInspectionDetails(inspectionDetailsTemp);

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
                mappingData[0].condemnationReport = condemnationDraft.condemnationArray != "" ? JSON.parse(condemnationDraft.condemnationArray) : []

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
                    if (BusinessActivity && BusinessActivity != '' && submit) {
                        condemnationDraft.callToSubmitCondemnationService(taskDetails, BusinessActivity);
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
            if (BusinessActivity && BusinessActivity != '') {
                condemnationDraft.callToSubmitCondemnationService(taskDetails, BusinessActivity);
            }
        }
        // let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

        // let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        // // alert(JSON.stringify(inspection.mappingData))
        // let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];

        // if (inspectionDetails.mappingData && inspectionDetails.mappingData.length) {
        //     inspectionDetails.mappingData[0].condemnationReport = JSON.parse(condemnationDraft.condemnationArray)
        //     debugger;
        //     RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
        //         // ToastAndroid.show('Task updated successfully ', 1000);
        //         NavigationService.goBack();
        //     });
        // }
        // else {
        //     inspectionDetails.mappingData[0].condemnationReport = JSON.parse(condemnationDraft.condemnationArray)
        //     debugger;
        //     RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
        //         // ToastAndroid.show('Task updated successfully ', 1000);
        //         NavigationService.goBack();
        //     });
        // }

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={condemnationDraft.state == 'pending' ? true : false}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textContent={condemnationDraft.loadingState != '' ? condemnationDraft.loadingState : 'Loading ...'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
                {
                    isModalVisible ?
                        <ModalComponent
                            data={inspectionDetails}
                            condemnation={true}
                            sampleArr={condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : []}
                            establishData={establishmentDraft}
                            createPdfMsg={Strings[context.isArabic ? 'ar' : 'en'].establishmentDetails.createPdfMsg}
                            closeAlert={closeAlert}
                            exportPDF={exportPDF}

                        />
                        : null
                }

                <View style={{ flex: 1.5 }}>
                    <Header
                        screenName={'condemnation'}
                        goBack={() => {
                            let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                            goBack(BusinessActivity, false, false);

                        }}
                        isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{title}</Text>
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
                                <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                                <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuOptions>
                        </Menu>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 7, width: '85%', alignSelf: 'center', }}>

                    {(myTasksDraft.isMyTaskClick == 'CompletedTask') || condemnationFlag ? null :

                        <View style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: (condemnationDraft.condemnationArray != '' && JSON.parse(condemnationDraft.condemnationArray).length > 0) ? 'space-between' : 'center', alignItems: (condemnationDraft.condemnationArray != '' && JSON.parse(condemnationDraft.condemnationArray).length > 0) ? 'flex-start' : 'center' }}>

                            {(condemnationDraft.condemnationArray != '' && (JSON.parse(condemnationDraft.condemnationArray).length > 0)) ?
                                <TouchableOpacity
                                    disabled={condemnationFlag || (myTasksDraft.isMyTaskClick == 'CompletedTask') ? true : false}
                                    onPress={() => {
                                        if (condemnationDraft.condemnationArray != '') {
                                            let BusinessActivity = taskDetails.BusinessActivity ? taskDetails.BusinessActivity : ''
                                            debugger;
                                            goBack(BusinessActivity, true, false);

                                        }
                                        //     NavigationService.navigate('CondemnationForm');
                                    }}
                                    style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                    <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.finalSubmit)}</Text>
                                </TouchableOpacity>
                                : <View style={{ height: 40, top: 9, width: "2%", justifyContent: 'center', alignSelf: "center" }} />
                            }

                            <TouchableOpacity
                                disabled={condemnationFlag || (myTasksDraft.isMyTaskClick == 'CompletedTask') ? true : false}
                                onPress={() => {
                                    NavigationService.navigate('CondemnationForm', { serialNumber: serialNumber + 1, title: title });
                                }}
                                style={{ height: 40, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.addRecord)}</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 5 }} >

                        <FlatList
                            data={CondemnationArray}
                            // contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                            // columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                            // initialNumToRender={5}
                            ListEmptyComponent={() => {
                                return (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#565758', fontFamily: fontFamily.textFontFamily }}>{'No Records Found'}</Text>
                                    </View>
                                )
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    renderData(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                        // numColumns={4}
                        />

                    </View>

                    {(inspectionDetails.condemnationFlag || (CondemnationArray.length && (myTasksDraft.isMyTaskClick == 'CompletedTask'))) ?
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
                    <View style={{ flex: 1 }} />
                    {/* <View style={{flex:1}}>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationService.navigate('CondemnationForm');
                        }}
                        style={{height: 30, top: 9, backgroundColor: '#abcfbf', borderColor: '#ffffff', borderWidth: 5, width: "35%", borderRadius: 10, justifyContent: 'center', alignSelf: "center" }}>
                        <Text style={{ fontSize: 11, textAlign: 'center', color: fontColor.white, fontWeight: 'bold', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detention.addRecord)}</Text>
                    </TouchableOpacity>
                    </View> */}

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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(Condemnation);

