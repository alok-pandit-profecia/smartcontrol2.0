import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context, value } from '../utils/Context';
import Strings from '../config/strings';
import { fontFamily, fontColor, isDev } from '../config/config';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
import SearchComponent from '../../src/components/SearchComponent';
import EstablishmentSchema from '../database/EstablishmentSchema';
import AllEstablishmentSchema from '../database/AllEstablishmentSchema';
let realm = RealmController.getRealmInstance();
import Spinner from 'react-native-loading-spinner-overlay';
import TaskSchema from '../database/TaskSchema';
import Swipeout from 'react-native-swipeout';
import TextComponent from '../components/TextComponent';
import LOVSchema from '../database/LOVSchema';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');

const MyTasks = (props: any) => {
    const context: any = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sortType, setSortType] = useState('');
    const [filterBy, setFilterBy] = useState('');
    const [pastdays, setPastdays] = useState('Past 30 days');
    //let initialTaskList = Array();
    const [initialTaskList, setInitialTaskList] = useState(Array());
    const [item, setItem] = useState(Object());
    const [index, setIndex] = useState(0);

    let dropdownRef4 = useRef(null);
    let dropdownRef3 = useRef(null);
    let dropdownRef1 = useRef(null);
    let dropdownRef2 = useRef(null);
    const isFocused = useIsFocused();
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, efstDraft: rootStore.eftstModel, licenseMyTasksDraft: rootStore.licenseMyTaskModel, documantationDraft: rootStore.documentationAndReportModel, alertDraft: rootStore.foodAlertsModel, establishmentDraft: rootStore.establishmentModel, licenseDraft: rootStore.licenseMyTaskModel, condemnationDraft: rootStore.condemnationModel, samplingDraft: rootStore.samplingModel, detentionDraft: rootStore.detentionModel })
    const { myTasksDraft, alertDraft, establishmentDraft, licenseDraft, documantationDraft, efstDraft, licenseMyTasksDraft, condemnationDraft, detentionDraft, samplingDraft } = useInject(mapStore)

    const filterByArray = [{ label: 'No Filter', value: '' },
    { label: 'Sector', value: 'Sector' },
    { label: 'Licence Number', value: 'Licence Number' },
    { label: 'Inspection', value: 'Inspection' }
    ]
    const dateByArray = [{ label: 'Past 30 days', value: 'Past 30 days' }, { label: 'More than 30 days', value: 'More than 30 days' }, { label: 'All', value: 'All' }]

    useEffect(() => {
        if (myTasksDraft.dataArray1 == '') {
            setLoading(true)
            myTasksDraft.setState('pending')
            myTasksDraft.setLoadingState('Fetching Tasks')
        }
    }, [myTasksDraft.dataArray1])

    useEffect(() => {
        if (establishmentDraft.state == 'AccountSyncSuccess') {
            let currentInspection = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
            let objFromlist = Object();

            if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'temporary routine inspection') ) {
                if (isDev) {
                    myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description, establishmentDraft.ehsRiskClassification);
                }
                else {
                    myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description,  establishmentDraft.ehsRiskClassification );
                }
            }

            if (myTasksDraft.isMyTaskClick === 'myTask') {
                let newTaskArray = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                objFromlist = newTaskArray.filter((i: any) => i.TaskId == myTasksDraft.taskId);
                objFromlist = objFromlist.length ? objFromlist[0] : Object();
                objFromlist.EstablishmentName = establishmentDraft.establishmentName;
                objFromlist.LicenseCode = establishmentDraft.licenseCode;
                myTasksDraft.setSelectedTask(JSON.stringify(objFromlist));
                newTaskArray = newTaskArray.map((u: any) => u.TaskId !== objFromlist.TaskId ? u : objFromlist)
                myTasksDraft.setDataArray1(JSON.stringify(newTaskArray));
                myTasksDraft.setMyTaskCount(newTaskArray.length.toString());
                if ((currentInspection.TaskType.toString().toLowerCase() == 'routine inspection') || (currentInspection.TaskType.toString().toLowerCase() == 'temporary routine inspection')) {
                    myTasksDraft.callToMergeTask(context.isArabic, true)
                }
                setTaskList(newTaskArray);
            }
            else if (myTasksDraft.isMyTaskClick === 'license') {
                let newTaskArray = myTasksDraft.NOCList != '' ? JSON.parse(myTasksDraft.NOCList) : [];
                objFromlist = newTaskArray.filter((i: any) => i.TaskId == myTasksDraft.taskId);
                objFromlist = objFromlist.length ? objFromlist[0] : Object();
                objFromlist.EstablishmentName = establishmentDraft.establishmentName;
                objFromlist.LicenseCode = establishmentDraft.licenseCode;
                newTaskArray = newTaskArray.map((u: any) => u.TaskId !== objFromlist.TaskId ? u : objFromlist)
                myTasksDraft.setNocList(JSON.stringify(newTaskArray));
                myTasksDraft.setLicenseCount(newTaskArray.length.toString());
                setTaskList(newTaskArray);
            }
            else if (myTasksDraft.isMyTaskClick === 'case') {
                let newTaskArray = myTasksDraft.complaintAndFoodPosioningList != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningList) : [];
                objFromlist = newTaskArray.filter((i: any) => i.TaskId == myTasksDraft.taskId);
                objFromlist = objFromlist.length ? objFromlist[0] : Object();
                objFromlist.EstablishmentName = establishmentDraft.establishmentName;
                objFromlist.LicenseCode = establishmentDraft.licenseCode;
                newTaskArray = newTaskArray.map((u: any) => u.TaskId !== objFromlist.TaskId ? u : objFromlist)
                myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(newTaskArray));
                myTasksDraft.setCaseCount(newTaskArray.length.toString());
                setTaskList(newTaskArray);
            }
            else if (myTasksDraft.isMyTaskClick === 'campaign') {
                let newTaskArray = myTasksDraft.campaignList != '' ? JSON.parse(myTasksDraft.campaignList) : [];
                objFromlist = newTaskArray.filter((i: any) => i.TaskId == myTasksDraft.taskId);
                objFromlist = objFromlist.length ? objFromlist[0] : Object();
                objFromlist.EstablishmentName = establishmentDraft.establishmentName;
                objFromlist.LicenseCode = establishmentDraft.licenseCode;
                newTaskArray = newTaskArray.map((u: any) => u.TaskId !== objFromlist.TaskId ? u : objFromlist)
                myTasksDraft.setCampaignList(JSON.stringify(newTaskArray));
                myTasksDraft.setCampaignCount(newTaskArray.length.toString());
                setTaskList(newTaskArray);
            }
            establishmentDraft.setState('done')
        }
    }, [establishmentDraft.state])

    useEffect(() => {

        try {
            const searchText = props.route ? props.route.params ? props.route.params.filter : '' : '';

            if (searchText != '') {
                onChangeSearchAfterFilter(searchText)
                myTasksDraft.setIsMyTaskClick('myTask')
            }
            let currentTaskList = Array();
            debugger
            // myTasksDraft.setState('pending')
            if (myTasksDraft.isMyTaskClick == 'myTask') {
                if (pastdays == "More than 30 days") {
                    if (myTasksDraft.dataArray1Past != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        currentTaskList = JSON.parse(myTasksDraft.dataArray1Past);
                    }
                }
                else if (pastdays == "Past 30 days") {
                    if (myTasksDraft.dataArray1 != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        currentTaskList = JSON.parse(myTasksDraft.dataArray1);
                    }
                }
                else {
                    let a = myTasksDraft.dataArray1Past != '' ? JSON.parse(myTasksDraft.dataArray1Past) : [], b = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                    let tmp = Array()
                    if (myTasksDraft.dataArray1Past != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        tmp = [...tmp, ...a]
                    }
                    if (myTasksDraft.dataArray1 != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        tmp = [...tmp, ...b]
                    }
                    currentTaskList = tmp;
                }
            }
            else if (myTasksDraft.isMyTaskClick == 'case') {
                if (pastdays == "More than 30 days") {
                    if (myTasksDraft.complaintAndFoodPosioningListPast != '')
                        currentTaskList = JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast);
                }
                else if (pastdays == "Past 30 days") {
                    if (myTasksDraft.complaintAndFoodPosioningList != '')
                        currentTaskList = JSON.parse(myTasksDraft.complaintAndFoodPosioningList);
                }
                else {
                    let a = myTasksDraft.complaintAndFoodPosioningListPast != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast) : [], b = myTasksDraft.complaintAndFoodPosioningList != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningList) : [];
                    let tmp = Array()
                    if (myTasksDraft.complaintAndFoodPosioningListPast != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        tmp = [...tmp, ...a]
                    }
                    if (myTasksDraft.complaintAndFoodPosioningList != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.complaintAndFoodPosioningList));
                        tmp = [...tmp, ...b]
                    }
                    currentTaskList = tmp;
                }
            }
            else if (myTasksDraft.isMyTaskClick == 'license') {
                if (pastdays == "More than 30 days") {
                    if (myTasksDraft.NOCListPast != '')
                        // setTaskList(JSON.parse(myTasksDraft.NOCList));
                        currentTaskList = JSON.parse(myTasksDraft.NOCListPast);
                }
                else if (pastdays == "Past 30 days") {
                    if (myTasksDraft.NOCList != '')
                        // setTaskList(JSON.parse(myTasksDraft.NOCList));
                        currentTaskList = JSON.parse(myTasksDraft.NOCList);
                }
                else {
                    let a = myTasksDraft.NOCListPast != '' ? JSON.parse(myTasksDraft.NOCListPast) : [], b = myTasksDraft.NOCList != '' ? JSON.parse(myTasksDraft.NOCList) : [];
                    let tmp = Array()
                    if (myTasksDraft.NOCListPast != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        tmp = [...tmp, ...a]
                    }
                    if (myTasksDraft.NOCList != '') {
                        //    setTaskList(JSON.parse(myTasksDraft.NOCList));
                        tmp = [...tmp, ...b]
                    }
                    currentTaskList = tmp;
                }
            }
            else if (myTasksDraft.isMyTaskClick == 'tempPermit') {
                if (pastdays == "More than 30 days") {
                    if (myTasksDraft.eventsListPast != '')
                        //    setTaskList(JSON.parse(myTasksDraft.eventsList));
                        currentTaskList = JSON.parse(myTasksDraft.eventsListPast);
                }
                else if (pastdays == "Past 30 days") {
                    if (myTasksDraft.eventsList != '')
                        //    setTaskList(JSON.parse(myTasksDraft.eventsList));
                        currentTaskList = JSON.parse(myTasksDraft.eventsList);
                }
                else {
                    let tmp = Array()
                    let a = myTasksDraft.NOCListPast = '' ? JSON.parse(myTasksDraft.NOCListPast) : [], b = myTasksDraft.eventsList != '' ? JSON.parse(myTasksDraft.eventsList) : [];
                    if (myTasksDraft.NOCListPast != '') {
                        tmp = [...tmp, ...a]
                    }
                    if (myTasksDraft.eventsList != '') {
                        tmp = [...tmp, ...b]
                    }
                    currentTaskList = tmp;
                }
            }
            else if (myTasksDraft.isMyTaskClick == 'campaign') {
                if (pastdays == "More than 30 days") {
                    if (myTasksDraft.campaignListPast != '') {
                        // setTaskList(JSON.parse(myTasksDraft.campaignList));
                        currentTaskList = JSON.parse(myTasksDraft.campaignListPast);
                    }
                }
                else if (pastdays == "Past 30 days") {
                    if (myTasksDraft.campaignList != '') {
                        // setTaskList(JSON.parse(myTasksDraft.campaignList));
                        currentTaskList = JSON.parse(myTasksDraft.campaignList);
                    }
                }
                else {
                    let tmp = Array()
                    let a = myTasksDraft.campaignListPast != '' ? JSON.parse(myTasksDraft.campaignListPast) : [], b = myTasksDraft.campaignList != '' ? JSON.parse(myTasksDraft.campaignList) : [];
                    if (myTasksDraft.campaignListPast != '') {
                        tmp = [...tmp, ...a]
                    }
                    if (myTasksDraft.campaignList != '') {
                        tmp = [...tmp, ...b]
                    }
                    currentTaskList = tmp;
                }
            }
            else {
                if (pastdays == "More than 30 days") {
                    if (myTasksDraft.dataArray1Past != '')
                        // setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        currentTaskList = JSON.parse(myTasksDraft.dataArray1Past);
                }
                else if (pastdays == "Past 30 days") {
                    if (myTasksDraft.dataArray1 != '')
                        // setTaskList(JSON.parse(myTasksDraft.dataArray1));
                        currentTaskList = JSON.parse(myTasksDraft.dataArray1);
                }
                else if (pastdays == "All") {
                    let a = myTasksDraft.dataArray1Past != "" ? JSON.parse(myTasksDraft.dataArray1Past) : [], b = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                    let tmp = Array()
                    if (myTasksDraft.dataArray1Past != '') {
                        tmp = [...tmp, ...a]
                    }
                    if (myTasksDraft.dataArray1 != '') {
                        tmp = [...tmp, ...b]
                    }
                    currentTaskList = tmp;
                }
            }
            debugger
            let temp = currentTaskList

            setTaskList(temp);
            setInitialTaskList(temp);

        }
        catch (error) {
            console.log(error)
        }

    }, [pastdays, isFocused]);

    let mergedFollowUpsArray = RealmController.getMergeTask(realm);
    mergedFollowUpsArray = mergedFollowUpsArray['0'] ? Object.values(mergedFollowUpsArray) : Array()

    // useEffect(() => {

    // if (myTasksDraft.rescheduledTaskList != '' && JSON.parse(myTasksDraft.rescheduledTaskList).length > 0) {
    //     let rescheduledTaskList = JSON.parse(myTasksDraft.rescheduledTaskList);
    //     myTasksDraft.callToSubmitResheduledTasks(context.isArabic ? 'ARA' : 'ENU', rescheduledTaskList);
    // }

    // }, []);

    const sortArr = [
        { label: 'Status', value: 'Status' },
        { label: 'Date', value: 'Date' },
        { label: 'Priority', value: 'Priority' },
        { label: 'Sector', value: 'Sector' },
        // { label: 'Inspection', value: 'Inspection' },
    ];

    const sortArr1 = [
        { type: 'Direct Inspection', value: 'Direct Inspection' },
        { type: 'Routine Inspection', value: 'Routine Inspection' },
        { type: 'Follow-Up', value: 'Follow-Up' },
        { type: 'NOC', value: 'NOC' },
        { type: 'Food Poisoning', value: 'food pois' },
        { type: 'Complaints', value: 'Complaints' },
    ];

    // const swipeoutBtnRight =
    //     [{
    //         text: "Establishment Details",
    //         right: [
    //             { buttonWidth: '80%', text: 'Establishment Details', backgroundColor: '#abcfbf', color: '#abcfbf', onPress: function () { Alert.alert('Est pressed') }, },
    //         ],
    //         autoClose: true,
    //         onPress: () => {
    //             // alert(JSON.stringify(item));
    //             callToEstablishmentDetails(item, index, 'estClick');

    //         },
    //     }]

    // const swipeoutBtnLeft =
    //     [{
    //         text: "Inspection Details",
    //         left: [
    //             { buttonWidth: '80%', text: 'Inspection Details', type: 'primary', backgroundColor: '#abcfbf', color: '#abcfbf', onPress: function () { Alert.alert('Inspection pressed') }, },
    //         ],
    //         autoClose: true,
    //         onPress: () => {
    //             // alert(JSON.stringify(item));
    //             callToEstablishmentDetails(item, index, 'inspClick');

    //         },
    //     }]


    const swipeoutBtnRight =
        [{
            text: "Request for closure",
            right: [
                { buttonWidth: '80%', text: 'Establishment Details', backgroundColor: '#abcfbf', color: '#abcfbf', onPress: function () { Alert.alert('Est pressed') }, },
            ],
            autoClose: true,
            onPress: () => {

                let temp1 = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : '';
                temp1 = temp1.length ? temp1.filter((i: any) => i.LicenseNumber == item.LicenseNumber) : []
                if (temp1 && temp1[0]) {
                    establishmentDraft.setEstablishmentName(context.isArabic ? temp1[0].ArabicName ? temp1[0].ArabicName : '' : temp1[0].EnglishName ? temp1[0].EnglishName : '')
                }

                myTasksDraft.setTaskId(item.TaskId);
                myTasksDraft.setSelectedTask(JSON.stringify(item));

                NavigationService.navigate('RequestForClouser', { title: 'Request For Closure' })

            },
        }];

    const swipeoutBtnLeft =
        [{
            text: "On Hold Request",
            left: [
                { buttonWidth: '80%', text: 'Inspection Details', type: 'primary', backgroundColor: '#abcfbf', color: '#abcfbf', onPress: function () { Alert.alert('Inspection pressed') }, },
            ],
            autoClose: true,
            onPress: () => {
                // alert(JSON.stringify(item));
                let temp1 = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : '';
                temp1 = temp1.length ? temp1.filter((i: any) => i.LicenseNumber == item.LicenseNumber) : []
                if (temp1 && temp1[0]) {
                    establishmentDraft.setEstablishmentName(context.isArabic ? temp1[0].ArabicName ? temp1[0].ArabicName : '' : temp1[0].EnglishName ? temp1[0].EnglishName : '')
                }

                myTasksDraft.setTaskId(item.TaskId);

                myTasksDraft.setSelectedTask(JSON.stringify(item))
                NavigationService.navigate('OnHoldRequest', { title: 'On Hold Request' })
                // callToEstablishmentDetails(item, index, 'inspClick');

            },
        }]


    const onChangeSearchAfterFilter = (str: string) => {
        if (str != '') {
            let arr = Array()
            let inspType = str.split(',')[1] ? str.split(',')[1] : "", search = str.split(',')[0];
            setSearchText(str.split(',')[0]);
            console.log(str)

            if (inspType.toLowerCase() == 'complaints') {
                arr = myTasksDraft.complaintAndFoodPosioningList != '' ? JSON.parse(myTasksDraft.complaintAndFoodPosioningList) : [];
            }
            else if (inspType.toLowerCase() == 'noc') {
                arr = myTasksDraft.NOCList != '' ? JSON.parse(myTasksDraft.NOCList) : [];
            }
            else {
                arr = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
            }

            let temp = [];
            // alert(inspType+"::"+search)
            // alert(arr.length)
            inspType = inspType.toLowerCase();
            search = search.toLowerCase();
            temp = arr.filter((item) => {
                item.LicenseCode = item.LicenseCode ? item.LicenseCode : '';
                item.EstablishmentName = item.EstablishmentName ? item.EstablishmentName : '';

                if (((item.TaskType.toString().toLowerCase().indexOf(inspType) > -1)
                    && (item.EstablishmentName.toString().toLowerCase().indexOf(search) > -1)) ||
                    ((item.TaskType.toString().toLowerCase().indexOf(inspType) > -1)
                        && (item.LicenseCode.toString().toLowerCase().indexOf(search) > -1))
                    // || (item.EstablishmentNameAR ? item.EstablishmentNameAR.toString().indexOf(str) :-1 > -1)
                ) {
                    return item;
                }
            });
            setTaskList(temp);
        }
        // else {
        //     let temp = initialTaskList;
        //     if (temp.length) {
        //         setTaskList(initialTaskList);
        //     }
        // }
    }

    useEffect(() => {
        const searchText = props.route ? props.route.params ? props.route.params.filter : '' : '';

        if (searchText != '') {

            if (searchText.split(',')[1] == 'Complaints') {
                myTasksDraft.setIsMyTaskClick('case')
            }
            else if (searchText.split(',')[1] == 'noc') {
                myTasksDraft.setIsMyTaskClick('license')
            }
            else {
                myTasksDraft.setIsMyTaskClick('myTask')
            }
            onChangeSearchAfterFilter(searchText)
        }
    }, [initialTaskList]);

    // useEffect(() => {

    //     if ((myTasksDraft.getState() == "getBASuccess")) {
    //         myTasksDraft.setLoadingState('')
    //         if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'temporary routine inspection') || (item.TaskType.toString().toLowerCase() == 'complaints') || item.TaskType.toString().toLowerCase() == 'direct inspection') {
    //             myTasksDraft.callToGetChecklistApi(item, context.isArabic, false);
    //         }
    //     }
    // }, [myTasksDraft.state]);

    const onChangeSearch = (str: string) => {
        if (str && (str != '')) {
            let temp = [];
            // alert(str)
            str = str != "" ? str.toLowerCase() : "";
            temp = initialTaskList.filter((item) => {
                item.LicenseCode = item.LicenseCode ? item.LicenseCode : '';
                item.Sector = item.Sector ? item.Sector : '';
                item.BusinessActivity = item.BusinessActivity ? item.BusinessActivity : '';
                item.EstablishmentName = item.EstablishmentName ? item.EstablishmentName : '';
                item.Description = item.Description ? item.Description : '';

                if ((item.TaskId.toString().toLowerCase().indexOf(str) > -1) || (item.TaskType.toString().toLowerCase().indexOf(str) > -1)
                    || (item.TaskStatus.toString().toLowerCase().indexOf(str) > -1)
                    || (item.LicenseCode.toString().toLowerCase().indexOf(str) > -1)
                    || (item.Sector.toString().toLowerCase().indexOf(str) > -1)
                    || (item.BusinessActivity.toString().toLowerCase().indexOf(str) > -1) || (item.Description.toString().toLowerCase().indexOf(str) > -1) ||
                    (item.EstablishmentName.toString().toLowerCase().indexOf(str) > -1)
                    // || (item.EstablishmentNameAR ? item.EstablishmentNameAR.toString().indexOf(str) :-1 > -1)
                ) {
                    return item;
                }
            });
            setTaskList(temp);
        }
        else {
            let temp = initialTaskList;
            if (temp.length) {
                setTaskList(initialTaskList);
            }
        }
    }

    const onChangeInspectionSearch = (str: string) => {
        if (str && (str != '')) {
            let temp = [];
            // alert(str)
            str = str != "" ? str.toLowerCase() : "";
            temp = taskList.filter((item) => {
                item.LicenseCode = item.LicenseCode ? item.LicenseCode : '';
                item.BusinessActivity = item.BusinessActivity ? item.BusinessActivity : '';
                item.EstablishmentName = item.EstablishmentName ? item.EstablishmentName : '';
                item.Description = item.Description ? item.Description : '';

                if ((item.TaskId.toString().toLowerCase().indexOf(str) > -1) || (item.TaskType.toString().toLowerCase().indexOf(str) > -1)
                    || (item.TaskStatus.toString().toLowerCase().indexOf(str) > -1)
                    || (item.LicenseCode.toString().toLowerCase().indexOf(str) > -1)
                    || (item.BusinessActivity.toString().toLowerCase().indexOf(str) > -1) || (item.Description.toString().toLowerCase().indexOf(str) > -1) ||
                    (item.EstablishmentName.toString().toLowerCase().indexOf(str) > -1)
                    // || (item.EstablishmentNameAR ? item.EstablishmentNameAR.toString().indexOf(str) :-1 > -1)
                ) {
                    return item;
                }
            });
            setTaskList(temp);
        }
        else {
            let temp = initialTaskList;
            if (temp.length) {
                setTaskList(initialTaskList);
            }
        }
    }

    const addFilterSearch = (str: string) => {

        if (str && (str != '')) {
            let temp = [];
            // alert(str)
            str = str != "" ? str.toLowerCase() : "";

            if (str == 'Sector') {
                temp = taskList.filter((item) => {
                    item.Sector = item.Sector ? item.Sector : '';
                    if ((item.Sector.toString().toLowerCase().indexOf(searchText) > -1)) {
                        return item;
                    }
                });
                setTaskList(temp);
            }
            else if (str == 'Licence Number') {
                temp = taskList.filter((item) => {
                    item.LicenseCode = item.LicenseCode ? item.LicenseCode : '';
                    if ((item.LicenseCode.toString().toLowerCase().indexOf(searchText) > -1)) {
                        return item;
                    }
                });
                setTaskList(temp);
            }
            else if (str == 'Inspection') {
                temp = taskList.filter((item) => {
                    item.TaskType = item.TaskType ? item.TaskType : '';
                    if ((item.TaskType.toString().toLowerCase().indexOf(searchText) > -1)) {
                        return item;
                    }
                });
                setTaskList(temp);
            }

        }
        else {
            let temp = initialTaskList;
            if (temp.length) {
                setTaskList(initialTaskList);
            }
        }
    }

    const onSortBy = (value: string) => {

        let data;
        setSortType(value)
        if (value === 'Status') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskStatus.localeCompare(b.TaskStatus));

            setTaskList(temp);
            //console.log(value);

        }
        if (value === 'Sector') {

            let temp = [];
            temp = [...taskList].sort(function (a: any, b: any) {
                let txtA = a.Sector ? a.Sector : "", txtB = b.Sector ? b.Sector : "";
                console.log("a.Sector::" + (txtA) + ",,b.Sector::" + (txtB))
                // if (txtA && txtB) {
                return txtA.localeCompare(txtB);
                // }
                // else {
                //console.log(value);
                // }
            });
            setTaskList(temp);
        }
        if (value === 'Priority') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskPriority == null ? 0 : a.TaskPriority.localeCompare(b.TaskPriority));
            //console.log("after sorting priority", temp[0].TaskPriority, temp[1].TaskPriority, temp[2].TaskPriority);
            setTaskList(temp);
            //console.log(value);
        }
        if (value === 'Date') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => {
                let bVal = b.CompletionDate
                let aVal = a.CompletionDate

                return new Date(moment(aVal)).valueOf() - new Date(moment(bVal)).valueOf()
            });
            //console.log("after sorting", temp[0]);
            setTaskList(temp);
            //console.log(value);
        }
        if (value === 'Completion Date') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.CompletionDate.localeCompare(b.CompletionDate));
            setTaskList(temp);
            //console.log(value);
        }
    };

    const callToGetBA = (inspectionDetails: any) => {

        debugger;
        myTasksDraft.setTaskId(inspectionDetails.TaskId);

        if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'case') {

            debugger;

            if (inspectionDetails.TaskType == 'Complaints') {
                myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
                myTasksDraft.setTaskId(inspectionDetails.TaskId);
                if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                    myTasksDraft.setDesc(inspectionDetails.Description);
                    myTasksDraft.callToGetBAApi(inspectionDetails, false);
                    // myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic, false);
                }
                else {
                    ToastAndroid.show('No Checklist Available', 1000);
                }
            }
            // else if (inspectionDetails.TaskType == 'Temporary Routine Inspection') {

            //     if (inspectionDetails.EstablishmentId && inspectionDetails.EstablishmentId != '') {
            //         if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
            //             myTasksDraft.setDesc(inspectionDetails.Description);
            //             myTasksDraft.callToGetBAApi(inspectionDetails);
            //         }
            //     }
            //     else {
            //         myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic);
            //     }
            // }
            else if (inspectionDetails.TaskType.toLowerCase().includes('noc')) {

                licenseDraft.callToGetNocChecklist(inspectionDetails.TaskType, context.isArabic);
            }
            else {
                //console.log('callToGetNocChecklist')
                licenseDraft.setTaskId(inspectionDetails.TaskId);
                // if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                // myTasksDraft.setDesc(inspectionDetails.Description);
                licenseDraft.callToGetNocChecklist(inspectionDetails.TaskType, context.isArabic);
                // }
            }
        }
        else if (inspectionDetails.TaskType.toString().toLowerCase() == 'follow-up') {
            let TaskId = inspectionDetails.TaskId;
            // myTasksDraft.callToGetQuestionaries(context.isArabic ? 'ARA' : 'ENU', TaskId);
        }
        else if (inspectionDetails.TaskType.toString().toLowerCase() == 'bazar inspection') {
            let taskData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_BAZAR_TASK_ID'), taskIdArray = [];
            console.log('taskData' + JSON.stringify(taskData))
            if (taskData && taskData['0']) {
                let TaskId = taskData['0'].Value;
                // myTasksDraft.setTaskId(TaskId);
                myTasksDraft.callToGetAssessment(context.isArabic ? 'AR' : 'ENU', TaskId, inspectionDetails.TaskId);
            }
            else {
                Alert.alert('', 'no checklist');
            }
        }
        else if (inspectionDetails.TaskType.toString().toLowerCase() == 'campaign inspection') {
            let TaskId = inspectionDetails.TaskId;
            let campaignType = '';
            if (inspectionDetails.CampaignType == null) {
                campaignType = '';
            }
            else {
                campaignType = inspectionDetails.CampaignType;
            }
            //myTasksDraft.callToGetCampaignChecklistApi(campaignType);
        }
        else if (inspectionDetails.TaskType.toString().toLowerCase() == 'supervisory inspections' || inspectionDetails.TaskType.toString().toLowerCase() == 'monitor inspector performance') {
            let TaskId = inspectionDetails.TaskId;
            myTasksDraft.callToSupervisoryGetQuestionarie(context.isArabic ? 'AR' : 'ENU', TaskId);
            //myTasksDraft.callToGetCampaignChecklistApi(campaignType);
        }
        else {
            myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
            myTasksDraft.setTaskId(inspectionDetails.TaskId);

            if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                myTasksDraft.setDesc(inspectionDetails.Description);
                myTasksDraft.callToGetBAApi(inspectionDetails, false);
                // myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic);
            }
            else {
                // ToastAndroid.show('No Checklist Available', 1000);
            }
        }

    }

    const callToEstablishmentDetails = (item: any, index: number, isEstClick: boolean) => {

        // console.log('callToEstablishmentDetails item ::' + JSON.stringify(item.EstablishmentId))
        let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, item.EstablishmentId);
        let temp1 = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : '';
        temp1 = temp1.length ? temp1.filter((i: any) => ((i.LicenseNumber == item.LicenseNumber) && (i.LicenseCode == item.LicenseCode))) : []
        let retry = 0;
        myTasksDraft.setRetryCount(retry.toString());
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
        myTasksDraft.setFoodalertSampling(false);
        myTasksDraft.setThermometerCBValue(false)
        myTasksDraft.setDataLoggerCBValue(false)
        myTasksDraft.setLuxmeterCBValue(false)
        myTasksDraft.setUVlightCBValue(false)
        myTasksDraft.setIsAlertApplicableToCurrentEst(false)
        myTasksDraft.setIsAlertApplicableNoToCurrentEst(false)
        myTasksDraft.setLatitude('')
        myTasksDraft.setLongitude('')
        myTasksDraft.setPercentage('')
        myTasksDraft.setTotalScore('')
        myTasksDraft.setMaxScore('')
        myTasksDraft.setGrade('')
        documantationDraft.setFileBuffer('')
        myTasksDraft.setHistoryChecklist(false);
        licenseMyTasksDraft.setIsRejectBtnClick(false);
        establishmentDraft.setLicenseCode(item.LicenseCode ? item.LicenseCode : '');
        myTasksDraft.setTaskId(item.TaskId ? item.TaskId : '');
        myTasksDraft.setSelectedTask(JSON.stringify(item));
        myTasksDraft.setNoCheckList('');
        samplingDraft.setSamplingArray('')
        condemnationDraft.setCondemnationArray('')
        detentionDraft.setDetentionArray('')
        efstDraft.setEfstDataBlank()
        debugger;
        callToGetBA(item);

        let dbEHSRiskClassification = temp[0] && temp[0].EHSRiskClassification ? temp[0].EHSRiskClassification : '';
        let licenceEHSRiskClassification = temp1[0] && temp1[0].EHSRiskClassification ? temp1[0].EHSRiskClassification : '';
        if (myTasksDraft.isMyTaskClick == 'adhoc') {
            NavigationService.navigate('ViolationDetails')
        }
        else if (myTasksDraft.isMyTaskClick == 'campaign') {
            NavigationService.navigate('CampaignDetails', { 'inspectionDetails': item })
        }
        else {
            debugger

            if (temp && temp[0]) {

                // console.log(' temp[0] ::' + JSON.parse(temp[0].addressObj)[0].AddressLine1);
                let addressObj = temp[0].addressObj && typeof (temp[0].addressObj) == 'string' ? JSON.parse(temp[0].addressObj) : []
                let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                establishmentDraft.setAddress(address)
                // establishmentDraft.setAddress(temp[0].PrimaryAddressId ? temp[0].PrimaryAddressId : '')
                establishmentDraft.setEstablishmentId(temp[0].Id ? temp[0].Id : '')
                establishmentDraft.setArea(temp[0].Area ? temp[0].Area : '')
                establishmentDraft.setSector(item.Sector ? item.Sector : '')
                // establishmentDraft.setSector(temp[0].Sector ? temp[0].Sector : '')
                establishmentDraft.setContactDetails(temp[0].Mobile ? temp[0].Mobile : '')
                establishmentDraft.setEHSRiskClassification(dbEHSRiskClassification)
                establishmentDraft.setEstablishmentName(context.isArabic ? temp[0].ArabicName ? temp[0].ArabicName : '' : temp[0].EnglishName ? temp[0].EnglishName : '')
                establishmentDraft.setLicenseEndDate(temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '')
                establishmentDraft.setLicenseStartDate(temp[0].LicenseRegDate ? temp[0].LicenseRegDate : '')
                establishmentDraft.setLicenseNumber(temp[0].LicenseNumber ? temp[0].LicenseNumber : '')
                establishmentDraft.setLicenseSource(temp[0].LicenseSource ? temp[0].LicenseSource : '')
                if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'temporary routine inspection')) {
                    myTasksDraft.callToMergeTask(context.isArabic, true)
                }

                if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'temporary routine inspection') ) {
                    if (isDev) {
                        myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description, dbEHSRiskClassification);
                    }
                    else {
                        myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description,  dbEHSRiskClassification );
                    }
                }
            }
            else if (temp1 && temp1[0]) {
                let addressObj = temp1[0].addressObj && typeof (temp1[0].addressObj) == 'string' ? JSON.parse(temp1[0].addressObj) : []
                let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                establishmentDraft.setAddress(address)
                //establishmentDraft.setAddress(temp1[0].PrimaryAddressId ? temp1[0].PrimaryAddressId : '')
                establishmentDraft.setEstablishmentId(temp1[0].Id ? temp1[0].Id : '')
                establishmentDraft.setArea(temp1[0].Area ? temp1[0].Area : '')
                establishmentDraft.setSector(item.Sector ? item.Sector : '')
                // establishmentDraft.setSector(temp1[0].Sector ? temp1[0].Sector : '')
                establishmentDraft.setContactDetails(temp1[0].Mobile ? temp1[0].Mobile : '')
                establishmentDraft.setEHSRiskClassification(licenceEHSRiskClassification)
                establishmentDraft.setEstablishmentName(context.isArabic ? temp1[0].ArabicName ? temp1[0].ArabicName : '' : temp1[0].EnglishName ? temp1[0].EnglishName : '')
                establishmentDraft.setLicenseEndDate(temp1[0].LicenseExpiryDate ? temp1[0].LicenseExpiryDate : '')
                establishmentDraft.setLicenseStartDate(temp1[0].LicenseRegDate ? temp1[0].LicenseRegDate : '')
                establishmentDraft.setLicenseNumber(temp1[0].LicenseNumber ? temp1[0].LicenseNumber : '')
                establishmentDraft.setLicenseSource(temp1[0].LicenseSource ? temp1[0].LicenseSource : '')
                if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'temporary routine inspection')) {
                    myTasksDraft.callToMergeTask(context.isArabic, true)
                }

                if ((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'temporary routine inspection') ) {
                    if (isDev) {
                        myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description, licenceEHSRiskClassification);
                    }
                    else {
                        myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description,  licenceEHSRiskClassification );
                    }
                }
            }
            else {
                establishmentDraft.callToAccountSyncService(item.LicenseNumber, context.isArabic,true);
            }

            NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item, 'flag': isEstClick });
        }


        if ((item.TaskType.toString().toLowerCase() == 'complaints') || item.TaskType.toString().toLowerCase() == 'direct inspection') {
            if (isDev) {
                let EHSRiskClassification = (dbEHSRiskClassification && dbEHSRiskClassification != "") ? dbEHSRiskClassification : (licenceEHSRiskClassification && licenceEHSRiskClassification != "") ? licenceEHSRiskClassification : ""
                myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description, '');
            }
            else {
                myTasksDraft.callToGetChecklistApi(item, context.isArabic, false, item.Description, '');
            }
        }
        else if (item.TaskType.toString().toLowerCase() == 'condemnation') {
            myTasksDraft.callToGetFoodDisposal(item);
        }
        else if (item.TaskType.toString().toLowerCase() == 'follow-up') {
            let mergeTask = mergedFollowUpsArray.filter((itemMerg: any) => itemMerg.FollowupId == item.TaskId)
            if (mergeTask.length) {
                Alert.alert("", "This Task is merged with Task :- " + mergeTask[0].TaskId)
                RealmController.deleteTaskById(realm, item.TaskId, () => {
                    if (myTasksDraft.isMyTaskClick === 'myTask') {
                        let newTaskArray = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                        myTasksDraft.setDataArray1(JSON.stringify(newTaskArray));
                        myTasksDraft.setMyTaskCount(newTaskArray.length.toString());

                        let newTaskArrayPast = myTasksDraft.dataArray1Past != '' ? JSON.parse(myTasksDraft.dataArray1Past) : [];
                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                        myTasksDraft.setDataArray1Past(JSON.stringify(newTaskArrayPast));

                        setTaskList(newTaskArray)
                    }
                })
                NavigationService.goBack()
            } else {
                myTasksDraft.callToGetQuestionaries(context.isArabic ? 'ARA' : 'ENU', item.TaskId);
            }
        }
    }

    const renderMyTask = (item: any, index: number) => {
        let TaskType = item.TaskType ? item.TaskType : ''
        return (

            <Swipeout buttonWidth={150} onOpen={(sectionID, rowId, direction: string) => {
                setItem(item);
                setIndex(index);
            }} right={swipeoutBtnRight} left={swipeoutBtnLeft} autoClose={true} >

                <TouchableOpacity
                    onPress={() => {
                        setItem(item);
                        callToEstablishmentDetails(item, index, true);
                    }}
                    key={item.inspectionId}
                    style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                        height: 100, width: '100%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                    }]}>

                    {myTasksDraft.isMyTaskClick == 'adhoc' ? <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationID)} value={item.TaskId} /> : null}

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        {(item.TaskId && item.TaskId != '') ?
                            <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskId} />
                            : null}
                        {myTasksDraft.isMyTaskClick == 'adhoc' ? <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.status)} value={item.TaskStatus} />
                            : <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskType} />}
                    </View>

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        {item.completionDateWithDayRemaining && item.completionDateWithDayRemaining != '' ?
                            <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.completionDateWithDayRemaining} />
                            : null}
                        {item.LicenseCode && item.LicenseCode != '' ?
                            <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.LicenseCode ? item.LicenseCode : ''} />
                            : null}
                    </View>

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        {item.completionDateWithDayRemaining && item.completionDateWithDayRemaining != '' ?
                            <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.CompletionDate ? moment(item.CompletionDate).format('L') : null} />
                            : null}

                        <KeyValueComponent numberOfLines={2} isArabic={context.isArabic} keyName={''} value={ context.isArabic ? item.EstablishmentNameAR ? item.EstablishmentNameAR : (item.EstablishmentName ? item.EstablishmentName : null) :item.EstablishmentName ? item.EstablishmentName : null} />

                    </View>

                    <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start' }}>

                        {/* {(((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'direct inspection')) && (item.Description == '' || item.Description == null)) ? */}
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskStatus} taskStatus={true} />
                        {/* : null} */}
                    </View>

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        {(((TaskType.toString().toLowerCase() == 'routine inspection') || (TaskType.toString().toLowerCase() == 'direct inspection')) && (item.Description == '' || item.Description == null)) ?
                            <KeyValueComponent isError={true} isArabic={context.isArabic} keyName={''} value={'No Checklist'} />
                            : null}
                    </View>
                </TouchableOpacity>

            </Swipeout>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <Spinner
                    visible={((licenseDraft.state == 'pending') || (myTasksDraft.state == 'pending')) ? true : false}
                    textContent={'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 1.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'adhoc' ? Strings[context.isArabic ? 'ar' : 'en'].violationDetails.adhoc : myTasksDraft.isMyTaskClick == 'scheduled' ? Strings[context.isArabic ? 'ar' : 'en'].scheduled.scheduled : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : myTasksDraft.isMyTaskClick == 'campaign' ? Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaign : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>

                    <View style={{ flex: 0.6, width: '85%', alignSelf: 'center' }}>
                        <SearchComponent isArabic={context.isArabic}
                            onChangeSearch={(val: string) => {
                                if (sortType == 'Inspection') {
                                    onChangeInspectionSearch(val)
                                } else {
                                    onChangeSearch(val)
                                }
                                setSearchText(val)
                            }} />
                    </View>

                    <View style={{ flex: 0.5, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                dropdownRef4 && dropdownRef4.current.focus();
                            }}
                                style={{
                                    height: '100%', alignSelf: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                                }} >

                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].dashboard.sort) + ':'} </Text>
                                </View>

                                {/* <TouchableOpacity onPress={() => {
                                    dropdownRef4 && dropdownRef4.current.focus();
                                }} style={{ flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderRadius: 5 }}>

                                    <TouchableOpacity onPress={() => {
                                        dropdownRef4 && dropdownRef4.current.focus();
                                    }} style={{ width: '60%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            onChangeText={onSortBy}
                                            value={'Select'}
                                            itemTextStyle={{ width: '80%', height: '100%', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: context.isArabic ? 'center' : 'center', fontSize: 12, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                            data={sortArr}
                                        />
                                    </TouchableOpacity>
                                    
                                </TouchableOpacity> */}

                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef4 && dropdownRef4.current.focus();
                                    }}
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    style={{
                                        height: '70%', width: '65%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>

                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            onChangeText={onSortBy}
                                            value={'Select'}
                                            itemTextStyle={{ width: '80%', height: '100%', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: context.isArabic ? 'center' : 'center', fontSize: 12, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                            data={sortArr}
                                        />
                                    </View>

                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>

                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />

                                    </View>

                                </TouchableOpacity>

                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                dropdownRef3 && dropdownRef3.current.focus();
                            }}
                                style={{
                                    height: '100%', alignSelf: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                                }} >

                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].dashboard.filter) + ':'} </Text>
                                </View>

                                {/* <TouchableOpacity onPress={() => {
                                    dropdownRef4 && dropdownRef4.current.focus();
                                }} style={{ flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 0.2, borderRadius: 5 }}>

                                    <TouchableOpacity onPress={() => {
                                        dropdownRef4 && dropdownRef4.current.focus();
                                    }} style={{ width: '60%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            onChangeText={onSortBy}
                                            value={'Select'}
                                            itemTextStyle={{ width: '80%', height: '100%', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: context.isArabic ? 'center' : 'center', fontSize: 12, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'center' }}
                                            data={sortArr}
                                        />
                                    </TouchableOpacity>
                                    
                                </TouchableOpacity> */}

                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef3 && dropdownRef3.current.focus();
                                    }}
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    style={{
                                        height: '70%', width: '65%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>

                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef3}
                                            value={filterBy}
                                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                            onChangeText={(val: string) => {
                                                setFilterBy(val)
                                                addFilterSearch(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={filterByArray}
                                        />
                                    </View>

                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>

                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />

                                    </View>

                                </TouchableOpacity>

                            </TouchableOpacity>
                        </View>


                    </View >

                </View >

                {
                    myTasksDraft.isMyTaskClick == 'adhoc' ?
                        <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationList)} </Text>
                        </View>
                        :
                        myTasksDraft.isMyTaskClick == 'scheduled' ?
                            <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].scheduled.complaints)} </Text>
                            </View>
                            :
                            null
                    // <View style={{ flex: 0.4, flexDirection: 'row', width: '80%'}}/>
                }
                <View style={{ flex: 0.5, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'flex-start', alignSelf: 'center' }}>
                    <View style={{ flex: 0.9, justifyContent: 'center', alignItems: context.isArabic ? 'flex-start' : 'flex-end' }}>

                        {
                            filterBy == 'Inspection' ?
                                <TouchableOpacity onPress={() => {
                                    dropdownRef2 && dropdownRef2.current.focus();
                                }}
                                    style={{
                                        height: '100%', justifyContent: context.isArabic ? 'flex-start' : 'flex-end', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                                    }} >

                                    {/* <View style={{ justifyContent: 'center' }}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].dashboard.visibleTask) + ':'} </Text>
                            </View> */}

                                    <TouchableOpacity
                                        onPress={() => {
                                            dropdownRef2 && dropdownRef2.current.focus();
                                        }}
                                        disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                        style={{
                                            height: '70%', width: '75%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: context.isArabic ? 'flex-end' : 'flex-start',
                                            alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}>

                                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Dropdown
                                                ref={dropdownRef2}
                                                value={''}
                                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                                onChangeText={(val: string) => {
                                                    onChangeInspectionSearch(val);
                                                }}
                                                itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                                data={sortArr1}
                                            />
                                        </View>

                                        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                                            <Image
                                                source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                                style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                                resizeMode={"contain"} />

                                        </View>

                                    </TouchableOpacity>

                                </TouchableOpacity>
                                :
                                null
                        }

                    </View>

                    <View style={{ flex: 1.1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            dropdownRef1 && dropdownRef1.current.focus();
                        }}
                            style={{
                                height: '100%', alignSelf: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                            }} >

                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].dashboard.visibleTask) + ':'} </Text>
                            </View>

                            <TouchableOpacity
                                onPress={() => {
                                    dropdownRef1 && dropdownRef1.current.focus();
                                }}
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                style={{
                                    height: '70%', width: '60%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}>

                                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Dropdown
                                        ref={dropdownRef1}
                                        value={pastdays}
                                        disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                        onChangeText={(val: string) => {
                                            setPastdays(val);
                                        }}
                                        itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                        containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                        data={dateByArray}
                                    />
                                </View>

                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>

                                    <Image
                                        source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                        style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                        resizeMode={"contain"} />

                                </View>

                            </TouchableOpacity>

                        </TouchableOpacity>
                    </View>


                </View >


                <View style={{ flex: myTasksDraft.isMyTaskClick ? 5.1 : 6, width: '80%', alignSelf: 'center' }}>

                    <View style={{ height: myTasksDraft.isMyTaskClick ? 18 : 30 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        keyExtractor={(item, index) => item.TaskId}
                        data={taskList}
                        renderItem={({ item, index }) => {
                            return (
                                renderMyTask(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                        ListEmptyComponent={() => <TextComponent
                            textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                            label={"No Task Available"}
                        />}
                    />

                </View>
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground >

        </SafeAreaView >
    )
}


export default observer(MyTasks);