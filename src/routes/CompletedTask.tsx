import React, { useContext, useEffect, useState, } from 'react';
import { Image, Alert, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import ButtonComponent from '../components/ButtonComponent';
import TextComponent from '../components/TextComponent';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import TableComponent from '../components/TableComponent';
import NavigationService from '../services/NavigationService';
import SearchComponent from '../../src/components/SearchComponent';
import { FlatList } from 'react-native-gesture-handler';
import KeyValueComponent from '../components/KeyValueComponent';
import { RootStoreModel } from '../store/rootStore';
import { RealmController } from '../database/RealmController';
import TaskSchema from '../database/TaskSchema';
import useInject from "../hooks/useInject";
import EstablishmentSchema from '../database/EstablishmentSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import SearchInput, { createFilter } from 'react-native-search-filter';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let realm = RealmController.getRealmInstance();
import { useIsFocused } from '@react-navigation/native';
let moment = require('moment');


const KEYS_TO_SEARCH_FILTERS = [
    "TaskId",
    "TaskType",
    "TaskStaus",
    "TaskPriority",
    "CreatedDate",
    "TradeLicenseNumber",
    "CustomerName",
    "TaskTypeDisplayValue"
]
    ;

const CompletedTask = (props: any) => {
    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    const [searchTaskList, setSearchTaskList] = useState(Array());
    const [tempSearchTaskList, setTempSearchTaskList] = useState(Array());
    const [fullTaskList, setfullTaskList] = useState(Array());
    const [searchText, setSearchText] = useState('');
    const [isClick, setIsClick] = useState({
        allTasks: true, failedTask: false, queuedTask: false
    })

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, completedTaskDraft: rootStore.completdMyTaskModel, establishmentDraft: rootStore.establishmentModel })
    const { myTasksDraft, establishmentDraft, completedTaskDraft } = useInject(mapStore)

    const isFocused = useIsFocused();

    useEffect(() => {

        let taskArray: any = [];
        debugger;
        completedTaskDraft.setState('pending')
        taskArray = completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray) : Array();
        // taskArray = RealmController.getTasks(realm, TaskSchema.name);
        let completedTaskArray = [];
        debugger;

        if (taskArray && taskArray[0]) {
            // completedTaskArray = Object.values(taskArray)
            // completedTaskArray = completedTaskArray.filter((i: any) => i.isCompleted == true);
            // myTasksDraft.setIsCompletedOfflineList(JSON.stringify(completedTaskArray));
            for (let i = 0; i < taskArray.length; i++) {
                if (taskArray[i].TaskStaus != "Failed") {
                    completedTaskArray.push(taskArray[i])
                }
            }
            // // setTaskList(completedTaskArray.reverse());
            //setTaskList(taskArray.sort(function(a:any,b:any){ return new Date(b.CompletionDate).valueOf() - new Date(a.CompletionDate).valueOf()}))
            //setfullTaskList(taskArray.sort(function(a:any,b:any){ return new Date(b.CompletionDate).valueOf() - new Date(a.CompletionDate).valueOf()}))
            // let newArr = taskArray.sort(function (a: any, b: any) {
            //     var c = new Date(a.CompletionDate.toString());
            //     var d = new Date(b.CompletionDate.toString());
            //     return c - d;
            // });
            let newArr = taskArray.sort(function (a, b) {
                let bVal = b.CompletionDate
                let aVal = a.CompletionDate

                return new Date(moment(bVal)).valueOf() - new Date(moment(aVal)).valueOf()
            });
            let tem = Array()
            // tem = newArr.reverse()
            setTaskList(newArr);
            setfullTaskList(newArr);
        }
        else {
            let Arr = completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray) : Array()
            //setTaskList(Arr.sort(function(a:any,b:any){ return new Date(b.CompletionDate).valueOf() - new Date(a.CompletionDate).valueOf()}))
            setTaskList(Arr);
        }
        completedTaskDraft.setState('done')

    }, []);

    useEffect(() => {

        let taskArray: any = [];
        debugger;
        completedTaskDraft.setState('pending')
        taskArray = completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray) : Array();
        // taskArray = RealmController.getTasks(realm, TaskSchema.name);
        let completedTaskArray = [];
        debugger;

        if (taskArray && taskArray[0]) {
            // completedTaskArray = Object.values(taskArray)
            // completedTaskArray = completedTaskArray.filter((i: any) => i.isCompleted == true);
            // myTasksDraft.setIsCompletedOfflineList(JSON.stringify(completedTaskArray));
            for (let i = 0; i < taskArray.length; i++) {
                if (taskArray[i].TaskStaus != "Failed") {
                    completedTaskArray.push(taskArray[i])
                }
            }
            // // setTaskList(completedTaskArray.reverse());
            //setTaskList(taskArray.sort(function(a:any,b:any){ return new Date(b.CompletionDate).valueOf() - new Date(a.CompletionDate).valueOf()}))
            //setfullTaskList(taskArray.sort(function(a:any,b:any){ return new Date(b.CompletionDate).valueOf() - new Date(a.CompletionDate).valueOf()}))
            // let newArr = taskArray.sort(function (a: any, b: any) {
            //     var c = new Date(a.CompletionDate.toString());
            //     var d = new Date(b.CompletionDate.toString());
            //     return c - d;
            // });
            let newArr = taskArray.sort(function (a, b) {
                let bVal = b.CompletionDate
                let aVal = a.CompletionDate
                return new Date(moment(bVal)).valueOf() - new Date(moment(aVal)).valueOf()
            });
            let tem = Array()
            // tem = newArr.reverse()
            setTaskList(newArr);
            setfullTaskList(newArr);
        }
        else {
            let Arr = completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray) : Array()
            //setTaskList(Arr.sort(function(a:any,b:any){ return new Date(b.CompletionDate).valueOf() - new Date(a.CompletionDate).valueOf()}))
            setTaskList(Arr);
        }
        completedTaskDraft.setState('done')

    }, [isFocused, completedTaskDraft.completedTaskArray]);


    const onChangeSearch = (str: string) => {
        setSearchText(str);
        const filteredTResult = tempSearchTaskList.filter(createFilter(searchText, KEYS_TO_SEARCH_FILTERS))
        setSearchTaskList(filteredTResult);
    }

    const CallSortedArray = (val: any) => {
        setTaskList(fullTaskList);

        let tempSortArr: any = [];

        // //console.log("CallSortedArray: ", val);

        if (val == 1) {
            for (let i = 0; i < fullTaskList.length; i++) {
                tempSortArr.push(fullTaskList[i])
            }
        } else if (val == 2) {
            for (let i = 0; i < fullTaskList.length; i++) {
                if (fullTaskList[i].TaskStatus == "Failed") {
                    tempSortArr.push(fullTaskList[i])
                }
            }
        } else if (val == 3) {
            for (let i = 0; i < fullTaskList.length; i++) {
                if (fullTaskList[i].errorMessage == "Queued") {
                    tempSortArr.push(fullTaskList[i])
                }
            }
        }
        setTaskList(tempSortArr);
        // // //console.log("taskList: ", taskList);
    }

    const renderCompletedTask = (item: any, index: number) => {

        // //console.log('item.CompletionDate' + item.CompletionDate)
        return (

            <TouchableOpacity
                key={item.CompletionDate}
                onPress={() => {
                    let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, item.EstablishmentId);
                    let temp1 = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : '';
                    temp1 = temp1.length ? temp1.filter((i: any) => i.LicenseSource == item.LicenseSource) : []
                    myTasksDraft.setTaskId(item.TaskId);
                    myTasksDraft.setSelectedTask(JSON.stringify(item))
                    // console.log("comp:::"+JSON.stringify(item));

                    debugger
                    if (myTasksDraft.isMyTaskClick == 'adhoc') {
                        NavigationService.navigate('ViolationDetails')
                    }
                    else if (item.TaskType.toLowerCase() == 'campaign inspection') {
                        NavigationService.navigate('CampaignDetails', { 'inspectionDetails': item })
                    }
                    else {
                        debugger
                        if (temp && temp[0]) {
                            let addressObj = temp[0].addressObj && typeof (temp[0].addressObj) == 'string' ? JSON.parse(temp[0].addressObj) : []
                            let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                            establishmentDraft.setAddress(address)
                            establishmentDraft.setArea(temp[0].Area ? temp[0].Area : '')
                            establishmentDraft.setSector(temp[0].Sector ? temp[0].Sector : '')
                            establishmentDraft.setContactDetails(temp[0].Mobile ? temp[0].Mobile : '')
                            establishmentDraft.setEstablishmentName(context.isArabic ? temp[0].ArabicName ? temp[0].ArabicName : '' : temp[0].EnglishName ? temp[0].EnglishName : '')
                            establishmentDraft.setLicenseEndDate(temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '')
                            establishmentDraft.setLicenseStartDate(temp[0].LicenseRegDate ? temp[0].LicenseRegDate : '')
                            establishmentDraft.setLicenseNumber(temp[0].LicenseNumber ? temp[0].LicenseNumber : '')
                            establishmentDraft.setLicenseSource(temp[0].LicenseSource ? temp[0].LicenseSource : '')
                        }
                        else if (temp1 && temp1[0]) {
                            let addressObj = temp1[0].addressObj && typeof (temp1[0].addressObj) == 'string' ? JSON.parse(temp1[0].addressObj) : []
                            let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                            establishmentDraft.setAddress(address)
                            establishmentDraft.setArea(temp1[0].Area ? temp1[0].Area : '')
                            establishmentDraft.setSector(temp1[0].Sector ? temp1[0].Sector : '')
                            establishmentDraft.setContactDetails(temp1[0].Mobile ? temp1[0].Mobile : '')
                            establishmentDraft.setEstablishmentName(context.isArabic ? temp1[0].ArabicName ? temp1[0].ArabicName : '' : temp1[0].EnglishName ? temp1[0].EnglishName : '')
                            establishmentDraft.setLicenseEndDate(temp1[0].LicenseExpiryDate ? temp1[0].LicenseExpiryDate : '')
                            establishmentDraft.setLicenseStartDate(temp1[0].LicenseRegDate ? temp1[0].LicenseRegDate : '')
                            establishmentDraft.setLicenseNumber(temp1[0].LicenseNumber ? temp1[0].LicenseNumber : '')
                            establishmentDraft.setLicenseSource(temp1[0].LicenseSource ? temp1[0].LicenseSource : '')
                        }
                        else {
                            debugger;
                            establishmentDraft.callToAccountSyncService(item.LicenseNumber, context.isArabic,true);
                        }
                        NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                    }
                    debugger
                    // myTasksDraft.setTaskId(JSON.stringify(item.TaskId))
                    // myTasksDraft.setSelectedTask(JSON.stringify(item))
                    // NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                }}
                // key={item.inspectionId}
                style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                    height: 65, width: '100%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }]}>

                <View style={[{
                    flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.inspectionId)} value={item.TaskId} />
                    {/* <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskId} /> */}
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.type)} value={item.TaskType} />
                    {/* <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={''} value={item.TaskType} /> */}
                </View>

                <View style={[{
                    flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} value={item.TaskStatus} />
                    {/* <KeyValueComponent isArabic={context.isArabic} keyName={''} value={item.TaskStatus} /> */}
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].completedTasks.date)} value={item.CompletionDate} />
                    {/* <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={''} value={item.CompletionDate} /> */}
                </View>

            </TouchableOpacity>
        )
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>
            <Spinner
                visible={completedTaskDraft.state == 'pending' ? true : false}
                textContent={'Loading...'}
                // textContent={completedTaskDraft.loadingState != '' ? completedTaskDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isDashborad={true} isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.7 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].completedTasks.completedTasks)}</Text>
                        </View>

                        <View style={{ flex: 0.7 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.6, width: '90%', alignSelf: 'center' }}>
                    <SearchComponent isArabic={context.isArabic}
                        searchText={searchText}
                        onChangeSearch={(val: string) => {
                            onChangeSearch(val)
                        }}

                    />
                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.35, flexDirection: 'row', width: '85%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, height: '100%', backgroundColor: isClick.allTasks ? '#abcfbe' : 'white', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}>

                        <TouchableOpacity
                            onPress={() => {
                                CallSortedArray(1);
                                setIsClick(prevState => {
                                    return { ...prevState, allTasks: true, failedTask: false, queuedTask: false }
                                });
                            }}
                            style={{ width: '100%', height: '100%', backgroundColor: isClick.allTasks ? '#abcfbe' : 'white', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }} >
                            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].completedTasks.all}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{
                        flex: 1, height: '100%', justifyContent: 'center', borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#abcfbe',
                        backgroundColor: isClick.failedTask ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16
                    }}>
                        <TouchableOpacity
                            onPress={() => {
                                CallSortedArray(2);
                                setIsClick(prevState => {
                                    return { ...prevState, allTasks: false, failedTask: true, queuedTask: false }
                                });
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.failedTask ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].completedTasks.failed}</Text>
                        </TouchableOpacity>
                    </View>


                    {/* <View style={{ flex: 1, height: '100%', justifyContent: 'center', backgroundColor: isClick.queuedTask ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                        <TouchableOpacity
                            onPress={() => {
                                CallSortedArray(3);
                                setIsClick(prevState => {
                                    return { ...prevState, allTasks: false, failedTask: false, queuedTask: true }
                                });
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.queuedTask ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                            <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].completedTasks.queued}</Text>
                        </TouchableOpacity>
                    </View> */}



                </View>

                <View style={{ flex: 0.2 }} />

                {/* <View style={{ flex: 1.8, width: '85%', alignSelf: 'center',borderWidth:1,borderColor:'#abcfbf',borderRadius:10 }}>

                   
                </View> */}


                {searchText.length < 3 ?
                    <View style={{ flex: 5.7, width: '85%', alignSelf: 'center' }} >
                        <View style={{ height: 5 }} />
                        {taskList.length ?
                            <FlatList
                                nestedScrollEnabled={true}
                                data={taskList}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderCompletedTask(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                            /> : null
                        }

                    </View> :
                    <View style={{ flex: 5.7, width: '85%', alignSelf: 'center' }} >
                        <View style={{ height: 5 }} />
                        {searchTaskList.length ?
                            <FlatList
                                nestedScrollEnabled={true}
                                data={searchTaskList}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderCompletedTask(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                            /> : null
                        }

                    </View>
                }

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

});

export default observer(CompletedTask);