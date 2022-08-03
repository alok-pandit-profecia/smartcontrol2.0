import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import NavigationService from '../services/NavigationService';
import Header from '../components/Header';
import KeyValueComponent from '../components/KeyValueComponent';
import BottomComponent from '../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context, value } from '../utils/Context';
import Strings from '../config/strings';
import { fontFamily, fontColor, alertResponse } from '../config/config';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
import SearchComponent from '../components/SearchComponent';
import EstablishmentSchema from '../database/EstablishmentSchema';
import AllEstablishmentSchema from '../database/AllEstablishmentSchema';
let realm = RealmController.getRealmInstance();
import Spinner from 'react-native-loading-spinner-overlay';


const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let moment = require('moment');

const SupervisoryMyTask = (props: any) => {
    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    //let initialTaskList = Array();
    const [initialTaskList, setInitialTaskList] = useState(Array());

    let dropdownRef4 = useRef(null);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, alertDraft: rootStore.foodAlertsModel, establishmentDraft: rootStore.establishmentModel, licenseDraft: rootStore.licenseMyTaskModel })
    const { myTasksDraft, alertDraft, establishmentDraft, licenseDraft } = useInject(mapStore)

    useEffect(() => {

        debugger
        let temp = myTasksDraft.getSupervisoryEstResponse && myTasksDraft.getSupervisoryEstResponse != '' ? JSON.parse(myTasksDraft.getSupervisoryEstResponse) : '';
        setTaskList(temp);
        setInitialTaskList(temp);

    }, []);

    const sortArr = [
        { type: 'Status', value: 'Status' },
        { type: 'Date', value: 'Date' },
        { type: 'Priority', value: 'Priority' },
        { type: 'Completion Date', value: 'Completion Date' },
    ];

    const swipeoutBtns =
    {
        text: "sampling",
        right: [
            { text: 'Sampling', type: 'primary', backgroundColor: '#5C666F', color: '#abcfbf', onPress: function () { Alert.alert('sampling pressed') }, },
            { text: 'Condemnation', type: 'secondary', backgroundColor: '#5C666F', color: '#abcfbf', onPress: function () { Alert.alert('sdadsa pressed') }, },
            { text: 'Detention', type: 'delete', backgroundColor: '#5C666F', color: '#abcfbf', onPress: function () { Alert.alert('sfseffsf pressed') }, }
        ],
        autoClose: true,
    }

    // useEffect(() => {
    //     if (myTasksDraft.state === 'getBASuccess') {
    //         myTasksDraft.callToGetChecklistApi(myTasksDraft.desc);
    //         myTasksDraft.setState('done');
    //     }
    // }, [myTasksDraft.state === 'getBASuccess']);

    // useEffect(() => {
    //     debugger;
    //     if (myTasksDraft.state == 'getChecklistSuccess') {
    //         NavigationService.navigate('EstablishmentDetails');
    //         myTasksDraft.setState('done');
    //     }
    // }, [myTasksDraft.state == 'getChecklistSuccess']);

    const onChangeSearch = (str: string) => {
        if (str != '') {

            let temp = [];
            // alert(str)
            str = str.toLowerCase();
            temp = initialTaskList.filter((item) => {
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

    const onSortBy = (value: string) => {

        let data;

        if (value === 'Status') {
            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskStatus.localeCompare(b.TaskStatus));

            setTaskList(temp);
            //console.log(value);

        }
        if (value === 'Date') {

            let temp = [];
            temp = [...taskList].sort((a: any, b: any) => a.TaskId.localeCompare(b.TaskId));
            setTaskList(temp);
            //console.log(value);
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
            temp = [...taskList].sort((a: any, b: any) => a.TaskId.localeCompare(b.TaskId));
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

        if (myTasksDraft.isMyTaskClick == 'adhoc') {
            // NavigationService.navigate('ViolationDetails')
        }
        else if (myTasksDraft.isMyTaskClick == 'myTask' && inspectionDetails.TaskType == 'Closure Inspection') {
            let licenseCode = inspectionDetails.LicenseCode;
            // NavigationService.navigate('ClosureInspection', { 'licenseNum': licenseCode });
        }
        else {

            if (myTasksDraft.isMyTaskClick == 'license' || myTasksDraft.isMyTaskClick == 'case') {

                debugger;

                if (inspectionDetails.TaskType == 'Complaints' || inspectionDetails.TaskType == 'Follow-Up') {
                    myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails))
                    myTasksDraft.setTaskId(inspectionDetails.TaskId);
                    if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                        myTasksDraft.setDesc(inspectionDetails.Description);
                        myTasksDraft.callToGetBAApi(inspectionDetails,false);
                    }
                    else {
                        ToastAndroid.show('No Checklist Available', 1000);
                    }
                }
                else if (inspectionDetails.TaskType == 'Temporary Routine Inspection') {

                    if (inspectionDetails.EstablishmentId && inspectionDetails.EstablishmentId != '') {
                        if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                            myTasksDraft.setDesc(inspectionDetails.Description);
                            myTasksDraft.callToGetBAApi(inspectionDetails,false);
                        }
                    }
                    else {
                        myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic,false,inspectionDetails.Description,"");
                    }
                }
                else if (inspectionDetails.TaskType.toLowerCase() == 'noc inspection' || inspectionDetails.TaskType.toLowerCase() == "temporary noc inspection") {

                    licenseDraft.callToGetNocChecklist(inspectionDetails.TaskType, context.isArabic);
                }
                else {
                    licenseDraft.setTaskId(inspectionDetails.TaskId);
                    if (inspectionDetails.Description != '' && inspectionDetails.Description != null && inspectionDetails.Description != 'null') {
                        myTasksDraft.setDesc(inspectionDetails.Description);
                        licenseDraft.callToGetNocChecklist(inspectionDetails.TaskType, context.isArabic);
                    }
                }
            }
            else if (inspectionDetails.TaskType.toString().toLowerCase() == 'follow-up') {
                let TaskId = inspectionDetails.TaskId;
                myTasksDraft.callToGetQuestionaries(context.isArabic ? 'ARA' : 'ENU', TaskId);
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
                    myTasksDraft.callToGetBAApi(inspectionDetails,false);
                    // myTasksDraft.callToGetChecklistApi(inspectionDetails, context.isArabic);
                }
                else {
                    // ToastAndroid.show('No Checklist Available', 1000);
                }
            }
        }
    }

    const renderMyTask = (item: any, index: number) => {

        return (
            // <Swipeout right={swipeoutBtns.right} left={swipeoutBtns.left} autoClose={swipeoutBtns.autoClose}>

            <TouchableOpacity
                onPress={() => {
                    // alert(item.TaskId);
                    NavigationService.navigate('StartInspection');
                    // myTasksDraft.callToSupervisoryGetQuestionarie(context.isArabic ? 'AR' : 'ENU', item.TaskId);
                }}
                key={item.inspectionId}
                style={
                    [context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                        height: 100, width: '100%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                    }]} >

                { myTasksDraft.isMyTaskClick == 'adhoc' ? <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationID)} value={item.TaskId} /> : null}

                < View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }
                }>
                    {(item.TaskId && item.TaskId != '') ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskId} />
                        : null}
                    {
                        myTasksDraft.isMyTaskClick == 'adhoc' ? <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.status)} value={item.TaskStatus} />
                            : <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskType} />
                    }
                </View >

                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                    {item.completionDateWithDayRemaining && item.completionDateWithDayRemaining != '' ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.completionDateWithDayRemaining} />
                        : null}
                    {item.LicenseNumber && item.LicenseNumber != '' ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.LicenseNumber ? item.LicenseCode : ''} />
                        : null}
                </View>

                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                    {item.completionDateWithDayRemaining && item.completionDateWithDayRemaining != '' ?
                        <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.CompletionDate ? moment(item.CompletionDate).format('L') : null} />
                        : null}

                    <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.EstablishmentName ? item.EstablishmentName : null} />

                </View>

                <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    {(((item.TaskType.toString().toLowerCase() == 'routine inspection') || (item.TaskType.toString().toLowerCase() == 'direct inspection')) && (item.Description == '' || item.Description == null)) ?
                        <KeyValueComponent isError={true} isArabic={context.isArabic} keyName={''} value={'No Checklist'} />
                        : null}
                </View>
            </TouchableOpacity >

            // </Swipeout>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={licenseDraft.state == 'pending' || myTasksDraft.state == 'pending' ? true : false}
                    textContent={licenseDraft.loadingState != '' ? licenseDraft.loadingState : 'Loading ...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1.5 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 1.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>

                </View>

                <View style={{ flex: myTasksDraft.isMyTaskClick ? 5.6 : 6, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: myTasksDraft.isMyTaskClick ? 18 : 30 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={taskList}
                        renderItem={({ item, index }) => {
                            return (
                                renderMyTask(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                    />

                </View>

                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView>
    )
}


export default observer(SupervisoryMyTask);