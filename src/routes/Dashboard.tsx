
import React, { useState, useEffect, useContext } from 'react';
import { Image, View, FlatList, BackHandler, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from './../services/NavigationService';
import SearchComponent from '../components/SearchComponent';
import Header from './../components/Header';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import Spinner from 'react-native-loading-spinner-overlay';
import AlertComponentWithoutHeader from './../components/AlertComponentWithoutHeader/AlertComponentWithoutHeader';
import { RealmController } from '../database/RealmController';
import LoginSchema from '../database/LoginSchema';
import ButtonComponent from './../components/ButtonComponent';
import TaskSchema from '../database/TaskSchema';
import { fetchGetQuestionarieApi, followUpMergeApi, fetchAcknowldgeApi } from './../services/WebServices';
import ClosureInspection from './ClosureInspection';
import CheckListSchema from '../database/CheckListSchema';
import { useIsFocused } from '@react-navigation/native';
import EstablishmentSchema from '../database/EstablishmentSchema';
let realm = RealmController.getRealmInstance();

const Dashboard = (props: any) => {

    const context = useContext(Context);

    let loginData = RealmController.getLoginData(realm, LoginSchema.name);
    loginData = loginData['0'] ? loginData['0'] : {};

    const [DashBoardIcons, setDashBoardIcons] = useState([
        { image: require('./../assets/images/Dashboard_images/dashboard/myTask.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.myTasks, navigationScreenName: 'MyTasks' },
        { image: require('./../assets/images/Dashboard_images/dashboard/licenses.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses },
        { image: require('./../assets/images/Dashboard_images/dashboard/cases.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases },
        { image: require('./../assets/images/Dashboard_images/dashboard/campaign.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.campaign },
        { image: require('./../assets/images/Dashboard_images/dashboard/temporaryPermits.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits },
        { image: require('./../assets/images/Dashboard_images/dashboard/adhocTasks.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.adhocTasks },
        { image: require('./../assets/images/Dashboard_images/dashboard/foodAlerts.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.foodAlerts },
        { image: require('./../assets/images/Dashboard_images/dashboard/completedTask.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk },
        { image: require('./../assets/images/Dashboard_images/dashboard/history.png'), name: Strings[context.isArabic ? 'ar' : 'en'].dashboard.history },
    ]);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, loginDraft: rootStore.loginModel, TemporaryPermitsServiceRequestDraft: rootStore.temporaryPermitsServiceRequestModel, foodalertDraft: rootStore.foodAlertsModel, completedTaskDraft: rootStore.completdMyTaskModel, licenseMyTasksDraft: rootStore.licenseMyTaskModel, actionTaskDraft: rootStore.actionModel, bottomBarDraft: rootStore.bottomBarModel, documantationDraft: rootStore.documentationAndReportModel, closureInspectionDraft: rootStore.closureInspectionModel })
    const { licenseMyTasksDraft, myTasksDraft, foodalertDraft, completedTaskDraft, actionTaskDraft, establishmentDraft, loginDraft, bottomBarDraft, TemporaryPermitsServiceRequestDraft, documantationDraft, closureInspectionDraft } = useInject(mapStore);

    const isFocused = useIsFocused();
    const [myTaskCount, setMyTaskCount] = useState('0');
    const [licenseCount, setLicenseCount] = useState('0');
    const [caseCount, setCaseCount] = useState('0');
    const [campaignCount, setCampaignCount] = useState('0');
    const [tempPermitCount, setTempPermit] = useState('0');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [spinnerVisible, setSpinnerVisible] = useState(false);
    // const [dataArray, setDataArray] = useState(Array());

    // useEffect(() => {
    //     bottomBarDraft.setDashboardClisk(true)
    //     bottomBarDraft.setCalenderClisk(false)
    //     bottomBarDraft.setCategoryClisk(false)
    //     bottomBarDraft.setProfileClisk(false)
    // }, [isFocused])

    useEffect(() => {
        if (myTasksDraft.getTaskApiResponse != '') {
            // setLoading(true)
            // myTasksDraft.setState('pending')
            // myTasksDraft.setLoadingState('Fetching Tasks')
            myTasksDraft.callToMergeTask(context.isArabic, false);
        }
        // else{
        //     // setLoading(true)
        //     myTasksDraft.setState('pending')
        //     myTasksDraft.setLoadingState('Fetching Tasks')
        // }
    }, [myTasksDraft.getTaskApiResponse])

    useEffect(() => {
        loginDraft.callAppVersion();
        
        let allest = RealmController.getAllEstablishments(realm, EstablishmentSchema.name);
        establishmentDraft.setAllEstablishmentData(JSON.stringify(allest));

        foodalertDraft.callToFetchFoodAlertService();
        if (!loginDraft.isOnline) {
            let obj = {
                username: loginData.username,
                password: loginData.password
            }
            myTasksDraft.callToLoginService(obj);
        }
        myTasksDraft.callToGetTaskApi(loginData, false, context.isArabic);
        // myTasksDraft.setSelectedTask('')
        TemporaryPermitsServiceRequestDraft.callToFecthSrDetails();
        establishmentDraft.callToAccountSyncService("", context.isArabic, false);

        debugger
        bottomBarDraft.setDashboardClisk(true)
        bottomBarDraft.setCalenderClisk(false)
        bottomBarDraft.setCategoryClisk(false)
        bottomBarDraft.setProfileClisk(false)

    }, [])

    useEffect(() => {
        setMyTaskCount(myTasksDraft.myTaskCount)
        setLicenseCount(myTasksDraft.licenseCount)
        setCaseCount(myTasksDraft.caseCount)
        setCampaignCount(myTasksDraft.campaignCount)
        setTempPermit(myTasksDraft.tempPermit)
    }, [myTasksDraft.myTaskCount, myTasksDraft.caseCount, myTasksDraft.licenseCount, myTasksDraft.campaignCount, myTasksDraft.tempPermit])

    useEffect(() => {
        try {
            debugger
            if (myTasksDraft.getIsSuccess() || myTasksDraft.state == 'navigate' || actionTaskDraft.state == 'navigate' || closureInspectionDraft.state == 'clouserSubmit') {
                setSpinnerVisible(false)
                // myTasksDraft.setContactName('');
                // myTasksDraft.setMobileNumber('');
                // myTasksDraft.setEmiratesId('');
                // myTasksDraft.setEvidanceAttachment1('')
                // myTasksDraft.setEvidanceAttachment1Url('')
                // myTasksDraft.setEvidanceAttachment2('')
                // myTasksDraft.setEvidanceAttachment2Url('')
                // myTasksDraft.setLicencesAttachment1('')
                // myTasksDraft.setLicencesAttachment1Url('');
                // myTasksDraft.setLicencesAttachment2('')
                // myTasksDraft.setLicencesAttachment2Url('')
                // myTasksDraft.setEmiratesIdAttachment1('')
                // myTasksDraft.setEmiratesIdAttachment1Url('')
                // myTasksDraft.setEmiratesIdAttachment2('')
                // myTasksDraft.setEmiratesIdAttachment2Url('')
                // myTasksDraft.setNoCheckList('')
                // myTasksDraft.setResult('')
                // myTasksDraft.setFinalComment('')
                // myTasksDraft.setFlashlightValue(false)
                // myTasksDraft.setThermometerCBValue(false)
                // myTasksDraft.setDataLoggerCBValue(false)
                // myTasksDraft.setLuxmeterCBValue(false)
                // myTasksDraft.setUVlightCBValue(false)
                // myTasksDraft.setLatitude('')
                // myTasksDraft.setLongitude('')
                // myTasksDraft.setPercentage('')
                // myTasksDraft.setTotalScore('')
                // myTasksDraft.setGrade('')
                // myTasksDraft.setMaxScore('')
                documantationDraft.setFileBuffer('')
                licenseMyTasksDraft.setIsRejectBtnClick(false);

                if (!actionTaskDraft.isPostPoned) {
                    let CompletedTaskArray = completedTaskDraft.completedTaskArray == '' ? [] : JSON.parse(completedTaskDraft.completedTaskArray)
                    if (CompletedTaskArray.length) {
                        let newArray = Array()
                        newArray = CompletedTaskArray.filter((e: any) => e.TaskId == myTasksDraft.taskId)
                        if (newArray.length == 0) {
                            CompletedTaskArray.push(JSON.parse(myTasksDraft.selectedTask))
                            completedTaskDraft.setCompletedTaskArray(JSON.stringify(CompletedTaskArray));
                        }
                    }
                    else {
                        CompletedTaskArray.push(JSON.parse(myTasksDraft.selectedTask))
                        completedTaskDraft.setCompletedTaskArray(JSON.stringify(CompletedTaskArray));
                    }
                }
                if (actionTaskDraft.state == 'navigate') {
                    try {
                        if (myTasksDraft.taskId != '') {
                            let temp = [], temp1 = [];
                            if (myTasksDraft.isMyTaskClick == 'myTask') {
                                if (myTasksDraft.dataArray1 != '') {
                                    temp = JSON.parse(myTasksDraft.dataArray1);
                                    let sectionIndex = temp.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setMyTaskCount(sectionIndex.length.toString());
                                    myTasksDraft.setDataArray1(JSON.stringify(sectionIndex));
                                }
                                if (myTasksDraft.dataArray1Past != '') {
                                    temp1 = JSON.parse(myTasksDraft.dataArray1Past);
                                    let sectionIndex = temp1.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setDataArray1Past(JSON.stringify(sectionIndex));
                                }
                            }
                            else if (myTasksDraft.isMyTaskClick == 'case') {
                                if (myTasksDraft.complaintAndFoodPosioningList != '') {
                                    temp = JSON.parse(myTasksDraft.complaintAndFoodPosioningList);
                                    temp1 = JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast);
                                    let sectionIndex = JSON.parse(myTasksDraft.complaintAndFoodPosioningList).filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setCaseCount(sectionIndex.length.toString());
                                    myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(sectionIndex));
                                }
                                if (myTasksDraft.complaintAndFoodPosioningListPast != '') {
                                    temp1 = JSON.parse(myTasksDraft.complaintAndFoodPosioningListPast);
                                    let sectionIndex = temp1.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setComplaintAndFoodPosioningList(JSON.stringify(sectionIndex));
                                }

                            }
                            else if (myTasksDraft.isMyTaskClick == 'license') {

                                if (myTasksDraft.NOCList != '') {
                                    temp = JSON.parse(myTasksDraft.NOCList);
                                    let sectionIndex = JSON.parse(myTasksDraft.NOCList).filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setLicenseCount(sectionIndex.length.toString());
                                    myTasksDraft.setNocList(JSON.stringify(sectionIndex));

                                }
                                if (myTasksDraft.NOCListPast != '') {
                                    temp1 = JSON.parse(myTasksDraft.NOCListPast);
                                    let sectionIndex = temp1.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setNocListPast(JSON.stringify(sectionIndex));

                                }

                            }
                            else if (myTasksDraft.isMyTaskClick == 'tempPermit') {
                                if (myTasksDraft.eventsList != '') {
                                    temp = JSON.parse(myTasksDraft.eventsList);
                                    let sectionIndex = temp.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setTempPermitCount(sectionIndex.length.toString());
                                    myTasksDraft.setEventsList(JSON.stringify(sectionIndex));

                                }
                                if (myTasksDraft.eventsListPast != '') {
                                    temp1 = JSON.parse(myTasksDraft.eventsListPast);
                                    let sectionIndex = temp1.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setEventsListPast(JSON.stringify(sectionIndex));

                                }

                            }
                            else if (myTasksDraft.isMyTaskClick == 'campaign') {
                                if (myTasksDraft.campaignList != '') {
                                    temp = JSON.parse(myTasksDraft.campaignList);
                                    let sectionIndex = temp.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setCampaignCount(sectionIndex.length.toString());
                                    myTasksDraft.setCampaignList(JSON.stringify(sectionIndex));

                                }
                                if (myTasksDraft.campaignListPast != '') {
                                    temp1 = JSON.parse(myTasksDraft.campaignListPast);
                                    let sectionIndex = temp1.filter((i: any) => i.TaskId != myTasksDraft.taskId);
                                    myTasksDraft.setCampaignListPast(JSON.stringify(sectionIndex));

                                }
                            }

                            // RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                            //     // ToastAndroid.show('Task objct successfully ', 1000);
                            // });
                        }
                    } catch (error) {

                    }
                }
                myTasksDraft.setState('done');
                bottomBarDraft.setProfileClisk(false);
                actionTaskDraft.setIsPostPoned(false)
            }
            if (myTasksDraft.state != 'pending') {
                setSpinnerVisible(false)
            }
        }
        catch (error) {
            //console.log(error);
        }
    }, [myTasksDraft.state, actionTaskDraft.state, closureInspectionDraft.state]);

    // const backButtonHandler: any = () => {

    //     let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

    //     if (loginInfo && loginInfo['0'] && loginInfo['0'].username && loginInfo['0'].password &&
    //         loginInfo['0'].username != "" && loginInfo['0'].password != "") {
    //         BackHandler.exitApp()
    //     }
    //     else {

    //     }
    // }

    // useEffect(() => {
    //     if (myTasksDraft.getTaskApiResponse != '') {
    //         // dataArray = (JSON.parse(myTasksDraft.getTaskApiResponse));
    //         // mergingTask()
    //     }
    // }, [myTasksDraft.getTaskApiResponse]);

    const renderRowIcons = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    NavigationService.navigate(item.navigationScreenName)
                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                    width: '100%', borderColor: 'transparent'
                }}>

                <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                    <Image resizeMode={'contain'}
                        source={item.image} />
                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.name}</Text>
                </View>

            </TouchableOpacity>
        )
    }

    const onChangeSearchText = (searchText: string) => {
        NavigationService.navigate('SearchScreen', { 'searchText': searchText });
    }

    const closeAlert = () => {
        setIsAlertVisible(false);
    }

    const okAlert = () => {
        setIsAlertVisible(false);
    }

    const createAdhocClick = () => {
        // myTasksDraft.setIsMyTaskClick('tempPermit');
        // setIsAlertVisible(false);
        // NavigationService.navigate('MyTasks');
        setIsAlertVisible(false);
        NavigationService.navigate('EstablishmentDetailsTempPermit');
    }

    const perfExisting = () => {
        // setIsAlertVisible(false);
        // NavigationService.navigate('EstablishmentDetailsTempPermit');
        myTasksDraft.setIsMyTaskClick('tempPermit');
        setIsAlertVisible(false);
        NavigationService.navigate('MyTasks');
    }

    const reloadTasks = () => {
        let obj = RealmController.getLoginData(realm, LoginSchema.name);
        obj = obj['0'] ? obj['0'] : {};
        console.log('aa')
        myTasksDraft.setState('pending');
        myTasksDraft.setLoadingState('Fetching Tasks');
        myTasksDraft.callToGetTaskApi(obj, true, context.isArabic);
        setSpinnerVisible(true)

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {
                    myTasksDraft.loadingState != 'Logging In' ?
                        <Spinner
                            visible={myTasksDraft.state == 'pending' ? true : false}
                            textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                            //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                            overlayColor={'rgba(0,0,0,0.3)'}
                            color={'#b6a176'}
                            textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                        />
                        :
                        null
                }

                <Spinner
                    visible={spinnerVisible}
                    textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading ...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
                {
                    isAlertVisible ?
                        <AlertComponentWithoutHeader
                            title={Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.alertTitle}
                            okmsg={Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.performExisting}
                            cancelmsg={Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.createAdhoc}
                            closeAlert={closeAlert}
                            okAlert={okAlert}
                            createAdhoc={createAdhocClick}
                            perfExisting={perfExisting}
                        />
                        : null
                }

                <View style={{ flex: 1.5 }}>
                    <Header reloadTasks={() => reloadTasks()} isArabic={context.isArabic} isDashboradSync={true} isDashborad={true} />
                </View>

                <View style={{ flex: 0.1 }} />

                <View style={styles.container1}>
                    <SearchComponent isArabic={context.isArabic} onChangeSearch={onChangeSearchText} />
                </View>

                <View style={{ flex: 0.5 }} >
                    {/* <TouchableOpacity
                        onPress={() => {
                            myTasksDraft.callToGetTaskApi(loginData,true);
                        }}
                        style={{ position: 'absolute', right: 50 }}>
                        <Image style={{ height: 32, width: 32 }} source={require('./../assets/images/sync.png')} />

                    </TouchableOpacity> */}
                    {/* <ButtonComponent
                        style={{
                            height: '80%', width: '20%',position:'absolute',right:20, backgroundColor: "#ffd700",
                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center'
                        }}
                        golive={true}
                        isArabic={context.isArabic}
                        buttonClick={() => {
                            myTasksDraft.setState('pending')
                            myTasksDraft.setLoadingState('Merging Tasks')
                            myTasksDraft.callToMergeTask(context.isArabic);
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: "#000000" }}
                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.mergeTask)}
                    /> */}
                </View>

                <View style={{ flex: 4, width: '100%', alignSelf: 'center', justifyContent: 'center' }}>

                    <TouchableOpacity
                        onPress={() => {
                            myTasksDraft.setIsMyTaskClick('myTask');
                            NavigationService.navigate('MyTasks');
                        }}
                        style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                            <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red' }}>
                                <Text style={[styles.text, { color: 'white', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 10 }]}>{myTaskCount}</Text>
                            </View>

                            <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>
                                <Image resizeMode={'contain'}
                                    source={require('./../assets/images/Dashboard_images/dashboard/myTasksNew.png')} />
                            </View>
                        </View>

                        <View style={{ height: WIDTH * 0.015 }} />

                        <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>
                            {Strings[context.isArabic ? 'ar' : 'en'].dashboard.myTasks}
                        </Text>

                    </TouchableOpacity>

                    <View

                        style={{ flex: 1, width: '100%', justifyContent: 'space-evenly', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <TouchableOpacity
                            onPress={() => {
                                myTasksDraft.setIsMyTaskClick('license');
                                NavigationService.navigate('MyTasks');
                                // NavigationService.navigate('SearchScreen');
                            }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                                <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                    <Text style={[styles.text, { color: 'white', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 10 }]}>{licenseCount}</Text>
                                </View>

                                <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>
                                    <Image resizeMode={'contain'}
                                        source={require('./../assets/images/Dashboard_images/dashboard/licensesNew.png')} />
                                </View>

                            </View>

                            <View style={{ height: WIDTH * 0.05, width: WIDTH * 0.25, justifyContent: 'center', alignItems: 'center', }} >

                                <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses}</Text>

                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                myTasksDraft.setIsMyTaskClick('case');
                                NavigationService.navigate('MyTasks');
                            }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>
                                {/* <View style={{
                                    height: WIDTH * 0.15, width: WIDTH * 0.15, right: -20, top: -15, borderWidth: 0, borderRadius: 25, borderColor: 'transparent', position: 'absolute', backgroundColor: 'transparent', zIndex: 99999999, justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
                                }}>
                                    <View style={{ height: WIDTH * 0.08, width: WIDTH * 0.08, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                        <Text style={[styles.text, { color: 'white' }]}>{'2'}</Text>
                                    </View>
                                </View> */}
                                <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                    <Text style={[styles.text, { color: 'white', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 10 }]}>{caseCount}</Text>
                                </View>

                                <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>
                                    <Image resizeMode={'contain'}
                                        source={require('./../assets/images/Dashboard_images/dashboard/casesNew.png')} />
                                </View>

                            </View>

                            <View style={{ height: WIDTH * 0.05, width: WIDTH * 0.25, justifyContent: 'center', alignItems: 'center', }} >

                                <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases}</Text>

                            </View>

                        </TouchableOpacity>

                    </View>

                    {isAlertVisible ?

                        <View

                            style={{ flex: 1, width: '100%', justifyContent: 'center' }}>

                            <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                                <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                    <Text style={[styles.text, { color: 'white' }]}>{tempPermitCount}</Text>
                                </View>

                                <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>

                                    <Image resizeMode={'contain'}
                                        source={require('./../assets/images/Dashboard_images/dashboard/temporaryPermitsNew.png')} />
                                </View>

                            </View>

                            <View style={{ height: WIDTH * 0.015 }} />

                            <Text numberOfLines={2} style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits}</Text>

                        </View>
                        :
                        <TouchableOpacity
                            onPress={() => {
                                setIsAlertVisible(true);
                            }}
                            style={{ flex: 1, width: '100%', justifyContent: 'center' }}>

                            <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                                <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                    <Text style={[styles.text, { color: 'white', fontSize: 10 }]}>{tempPermitCount}</Text>
                                </View>

                                <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>

                                    <Image resizeMode={'contain'}
                                        source={require('./../assets/images/Dashboard_images/dashboard/temporaryPermitsNew.png')} />
                                </View>

                            </View>

                            <View style={{ height: WIDTH * 0.015 }} />

                            <Text numberOfLines={2} style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits}</Text>

                        </TouchableOpacity>
                    }

                    <View style={{ flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <TouchableOpacity
                            onPress={() => {
                                myTasksDraft.setIsMyTaskClick('campaign');
                                NavigationService.navigate('MyTasks');
                                // NavigationService.navigate('FoodAlertDetails')
                            }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                                <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                    <Text style={[styles.text, { color: 'white', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 10 }]}>{campaignCount}</Text>
                                </View>

                                <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>

                                    <Image resizeMode={'contain'}
                                        source={require('./../assets/images/Dashboard_images/dashboard/campaignNew.png')} />
                                </View>

                            </View>

                            <View style={{ height: WIDTH * 0.015 }} />

                            <View style={{ height: WIDTH * 0.05, width: WIDTH * 0.25, justifyContent: 'center', alignItems: 'center', }} >
                                <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.campaign}</Text>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                myTasksDraft.setIsMyTaskClick('History');
                                NavigationService.navigate('AdhocEstablishmentAndVehical');
                            }}
                            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                                {/* <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}> */}

                                <Image resizeMode={'contain'}
                                    source={require('./../assets/images/Dashboard_images/dashboard/historyNew.png')} />
                                {/* </View> */}

                            </View>

                            <View style={{ height: WIDTH * 0.015 }} />

                            <Text numberOfLines={2} style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].dashboard.history}</Text>

                        </TouchableOpacity>

                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            myTasksDraft.setIsMyTaskClick('CompletedTask');
                            NavigationService.navigate('CompletedTask');
                        }}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                        <View style={{ height: WIDTH * 0.18, width: WIDTH * 0.18, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'white', borderWidth: 0.2, alignSelf: 'center', shadowOpacity: 15, shadowColor: 'grey', elevation: 10 }}>

                            <View style={{ height: WIDTH * 0.06, width: WIDTH * 0.06, right: context.isArabic ? +25 : -25, top: -8, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: 'red', borderWidth: 0.2, alignSelf: 'center' }}>
                                <Text style={[styles.text, { color: 'white', fontSize: 10 }]}>{completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray).length : '0'}</Text>
                            </View>

                            <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}>

                                <Image resizeMode={'contain'}
                                    source={require('./../assets/images/Dashboard_images/dashboard/adhocTasksNew.png')} />
                            </View>

                        </View>

                        <View style={{ height: WIDTH * 0.015 }} />

                        <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].bottomText.completedTasks}</Text>

                    </TouchableOpacity>


                    {/* <FlatList
                        // nestedScrollEnabled={false}
                        data={DashBoardIcons}
                        initialNumToRender={5}
                        renderItem={({ item, index }) => {
                            return (
                                renderRowIcons(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.08, width: WIDTH * 0.08 }} />)}
                        numColumns={3}
                    /> */}

                </View>

                <View style={{ flex: 1 }} />

                <BottomComponent isArabic={context.isArabic} />


            </ImageBackground>

        </SafeAreaView >

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
    scrollview: {
        backgroundColor: 'transparent'
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        fontWeight: '500',
        color: fontColor.TitleColor,
        // fontFamily: fontFamily.textFontFamily
    },
    container2: {
        flex: 1,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: "center"

    },
    container1: {
        flex: 0.6,
        width: '85%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: "center"

    }
});

export default observer(Dashboard);