import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, Dimensions, FlatList } from "react-native";
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import TableComponent from './../components/TableComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import KeyValueComponent from './../components/KeyValueComponent';
import { RootStoreModel } from '../store/rootStore';
import TaskSchema from '../database/TaskSchema';
import useInject from "../hooks/useInject";
import NavigationService from '../services/NavigationService';
import Spinner from 'react-native-loading-spinner-overlay';
import validator from './../config/validator';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import { RealmController } from '../database/RealmController';
// import InspectionDetails from './InspectionDetails';
let realm = RealmController.getRealmInstance();
const { Popover } = renderers

const efstDetails = (props: any) => {

    const context = useContext(Context);

    const mapStore = (rootStore: RootStoreModel) => ({ establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, efstDraft: rootStore.eftstModel })
    const { establishmentDraft, myTasksDraft, efstDraft } = useInject(mapStore)

    const [error, setError] = useState({
        trainedError: '',
        certifiedError: '',
        FoodHandlerCountError: '',
    });
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [licensesCode, setLicenseCode] = useState(Object());
    const [efstDetailsResponse, setEfstDetailsResponse] = useState(Array());
    // const [foodHandlerCount, setFoodHandlerCount] = useState(Number);
    const [foodHandlerCount, setFoodHandlerCount] = useState('');
    const [trainedCount, setTrainedCount] = useState('');
    const [certifiedCount, setCertifiedCount] = useState('');

    useEffect(() => {
        const licensesCode = props.route ? props.route.params ? props.route.params.licenseNum : {} : {};
        // //console.log("licenseNumber", licensesCode);
        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);
        let inspectionDetails = objct['0'] ? objct['0'] : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : []
        debugger
        // alert(JSON.stringify(inspection.mappingData))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        setInspectionDetails(inspectionDetails);

        setLicenseCode(licensesCode);
        return () => {
            // establishmentDraft.setEstablishmentDataBlank()
        }
    }, []);

    useEffect(() => {
        if (efstDraft.state == 'navigate') {
            debugger
            let taskDetails: any = { ...inspectionDetails }
            taskDetails.mappingData[0].EFSTFlag = true;
            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
            myTasksDraft.setEfstUpdate(true)
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
                NavigationService.goBack()
            });
        }
    }, [efstDraft.state]);


    useEffect(() => {
        let efstDetailsArray = [];
        let efstDetailsResponse = efstDraft.efstDataResponse;
        if (efstDetailsResponse != '') {
            let efstDetails1 = efstDetailsResponse ? JSON.parse(efstDetailsResponse) : '';
            let foodHandlerCount = efstDetails1.length;
            setFoodHandlerCount(foodHandlerCount);
            // //console.log("efstarray", efstDetails1)
            // //console.log("foodHandlerCount", foodHandlerCount)
            for (let index = 0; index < efstDetails1.length; index++) {
                let element = efstDetails1[index];
                let obj = Object();
                obj.FoodHanlderId = element.FoodHanlderId;
                obj.EmiratesID = element.EmiratesID;
                obj.FoodHandlerName = element.FoodHandlerName;
                obj.Gender = element.Gender;
                obj.PassPercentage = element.PassPercentage;
                obj.Nationality = element.Nationality;
                obj.PassportNumber = element.PassportNumber;
                obj.TrainingScheduleAttendanceID = element.TrainingScheduleAttendanceID;
                obj.ExamAttendanceID = element.ExamAttendanceID;
                efstDetailsArray.push(obj);
            }
            setEfstDetailsResponse(efstDetailsArray);
        }
    }, [efstDraft.efstDataResponse]);

    const renderRecentNews = (item: any, index: number) => {

        return (

            <View
                style={{
                    height: HEIGHT * 0.22, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.foodHandlerId, value: item.FoodHanlderId },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.emiratesId, value: item.EmiratesID },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.foodHandlerName, value: item.FoodHandlerName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.gender, value: item.Gender },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.passPercentage, value: item.PassPercentage },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.nationality, value: item.Nationality },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].efstDetails.passPercentage, value: item.ExamAttendanceID },
                    ]}
                />
            </View>
        )
    }

    const UpdateFoodHandlerCount = () => {

        let flag = true;

        if (validator.validateEfstCount(efstDraft.trained)) {
            flag = false;
            let res = validator.validateEfstCount(efstDraft.trained);
            if (res == "invalid") {
                setError(prevState => {
                    return { ...prevState, trainedError: 'invalid' }
                });
            }
            else {
                setError(prevState => {
                    return { ...prevState, trainedError: 'required' }
                });
            }
        }
        if (validator.validateEfstCount(efstDraft.certified)) {
            flag = false
            let res = validator.validateEfstCount(efstDraft.certified);
            if (res == "invalid") {
                setError(prevState => {
                    return { ...prevState, certifiedError: 'invalid' }
                });
            }
            else {
                setError(prevState => {
                    return { ...prevState, certifiedError: 'required' }
                });
            }
        }
        if (validator.validateEfstCount(efstDraft.foodHandlerCount)) {
            flag = false
            let res = validator.validateEfstCount(efstDraft.foodHandlerCount);
            if (res == "invalid") {
                setError(prevState => {
                    return { ...prevState, FoodHandlerCountError: 'invalid' }
                });
            }
            else {
                setError(prevState => {
                    return { ...prevState, FoodHandlerCountError: 'required' }
                });
            }
        }
        if (flag) {

            let trainedCount = efstDraft.trained;
            let certifiedCount = efstDraft.certified;
            let foodHandlerCount = efstDraft.foodHandlerCount;
            let licensesCode1 = licensesCode;
            // // //console.log("payload",payload);
            // //console.log("trainedUpdatedCount", trainedCount);
            // //console.log("certifiedUpdatedCount", certifiedCount);
            // //console.log("foodHandlerUpdatedCount", foodHandlerCount);
            // //console.log("licensesCode1", licensesCode1);
            let taskDetails: any = { ...inspectionDetails }
            debugger
            taskDetails.mappingData[0].EFSTFlag = true;
            myTasksDraft.setEfstUpdate(true)
            myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            });
            efstDraft.callToUpdateFoodHandlerCountService(trainedCount, certifiedCount, foodHandlerCount, licensesCode1);
        }

    }


    return (

        <SafeAreaView style={{ flex: 1 }}>
            
            <Spinner
                visible={efstDraft.state == 'pending' ? true : false}
                textContent={'Loading...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.7 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 1.4 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'history' ? Strings[context.isArabic ? 'ar' : 'en'].taskList.history : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
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
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].efstDetails.efstDetails)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                {foodHandlerCount != '' ?
                    <View
                        style={{
                            height: HEIGHT * 0.23, width: '80%', alignSelf: 'center'
                        }}>

                        <View style={{ height: 1 }} />
                        <FlatList
                            nestedScrollEnabled={true}
                            data={efstDetailsResponse}
                            renderItem={({ item, index }) => {
                                return (
                                    renderRecentNews(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    </View> :

                    <View style={{ flex: 1, width: '80%', alignSelf: 'center', alignItems: 'center', justifyContent: 'center' }} >
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{'No FoodHandler is Available'} </Text>

                    </View>
                }
                <View style={{ flex: 0.3 }} />
                {/* {myTasksDraft.isMyTaskClick == 'History' ? <View style={{ flex: 1.5 }} />
                    : */}
                <View style={{ flex: 1.5, width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].efstDetails.trained)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={efstDraft.trained}
                                maxLength={50}
                                editable={(myTasksDraft.isMyTaskClick == 'CompletedTask') ? false : true}
                                keyboardType={'default'}
                                onChange={(val: string) => {
                                    efstDraft.setTrained(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}

                            />
                            {error.trainedError == 'required' || error.trainedError == 'invalid' ?
                                error.trainedError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.trainedError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null}
                        </View>
                    </View>
                    <View style={{ flex: 0.1 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].efstDetails.certified)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={efstDraft.certified}
                                editable={(myTasksDraft.isMyTaskClick == 'CompletedTask') ? false : true}
                                maxLength={50}
                                keyboardType={'default'}
                                onChange={(val: string) => {
                                    efstDraft.setCertified(val);
                                    setError(prevState => {
                                        return { ...prevState, certifiedError: '' }
                                    });
                                }}
                            />
                            {error.certifiedError == 'required' || error.certifiedError == 'invalid' ?
                                error.certifiedError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.certifiedError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null}
                        </View>
                    </View>
                    <View style={{ flex: 0.1 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].efstDetails.foodHandlerCount)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={efstDraft.foodHandlerCount}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                editable={(myTasksDraft.isMyTaskClick == 'CompletedTask') ? false : true}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    efstDraft.setFoodHandlerCount(val);
                                    setError(prevState => {
                                        return { ...prevState, FoodHandlerCountError: '' }
                                    });
                                }}
                            />
                            {error.FoodHandlerCountError == 'required' || error.FoodHandlerCountError == 'invalid' ?
                                error.FoodHandlerCountError == 'required' ? <Text style={{ fontSize: 10, top: 1, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.FoodHandlerCountError == 'invalid' ? <Text style={{ fontSize: 10, top: 1, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null}
                        </View>
                    </View>
                </View>
                {/* } */}
                <View style={{ flex: 0.2 }} />
                {/* {myTasksDraft.isMyTaskClick == 'History' ? <View style={{ flex: 0.7 }} />
                    : */}
                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 2, height: '80%', flexDirection: 'row' }}>
                        {
                            (myTasksDraft.isMyTaskClick == 'CompletedTask') ?
                                null
                                :
                                <ButtonComponent
                                    style={{ height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {

                                        let taskDetails: any = { ...inspectionDetails }
                                        debugger
                                        taskDetails.mappingData[0].EFSTFlag = true;
                                        myTasksDraft.setSelectedTask(JSON.stringify(taskDetails))
                                        myTasksDraft.setEfstUpdate(true)
                                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                            // ToastAndroid.show('Task objct successfully ', 1000);
                                            NavigationService.goBack();
                                        });
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].efstDetails.noUpdates)}
                                />
                        }

                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 2, height: '80%', flexDirection: 'row' }}>
                        {
                            (myTasksDraft.isMyTaskClick == 'CompletedTask') ?
                                null
                                :
                                <ButtonComponent
                                    style={{ height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                                    isArabic={context.isArabic}
                                    buttonClick={() => {

                                        UpdateFoodHandlerCount();
                                    }}
                                    textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].efstDetails.update)}
                                />
                        }
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
                {/* } */}
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

export default observer(efstDetails);

