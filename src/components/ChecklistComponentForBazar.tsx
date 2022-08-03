import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, FlatList, View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, ToastAndroid, PermissionsAndroid, Platform, Alert } from "react-native";
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import moment from 'moment';
import CheckListSchema from '../database/CheckListSchema';
import AlertComponentForError from '../components/AlertComponentForError';
import AlertComponentForComment from './AlertComponentForComment';
import AlertComponentForGrace from './AlertComponentForGrace';
import AlertComponentForInformation from '../components/AlertComponentForError';
import AlertComponentForScore from './AlertComponentForScore';
import AlertComponentForRegulation from './AlertComponentForRegulation';
import AlertComponentForAttachment from './AlertComponentForAttachment';
import ImagePicker from 'react-native-image-picker';
import PopoverTooltip from 'react-native-popover-tooltip';
const { Popover } = renderers
import { fontFamily, fontColor } from '../config/config';

import TextComponent from "./TextComponent/index";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

const ChecklistComponentForBazar = (props: any) => {

    const context = useContext(Context);
    const refrance = useRef(null);

    const [modifiedCheckListData, setModifiedCheckListData] = useState([]);
    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, bottomBarDraft } = useInject(mapStore);

    // individual section and index for checklist

    // alert alert components variables
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [showDescAlert, setShowDescAlert] = useState(false);
    // regulation array of checklist
    const [regulationString, setRegulationString] = useState('');
    const [touchableClick, setTouchableClick] = useState(false);

    const [base64One, setBase64One] = useState('');
    const [base64Two, setBase64two] = useState('');
    const [isCheck, setIsCheck] = useState(false);

    const [commentErrorIndex, setCommentErrorIndex] = useState(0);
    const [errorGraceAlert, setErrorGraceAlert] = useState(false);
    const [errorCommentAlert, setErrorCommentAlert] = useState(false);
    const [graceErrorIndex, setGraceErrorIndex] = useState(0);
    const [graceErrorSectionTitle, setGraceErrorSectionTtile] = useState('');
    const [commentErrorSectionTitle, setCommentErrorSectionTtile] = useState('');
    const [finalTime, setFinalTime] = useState('00:00:00');

    const [BazarInspectionArray, setBazarInspectionArray] = useState(Array());
    const [tableNameList, setTableNameList] = useState(Array());

    useEffect(() => {
        debugger;
        setBazarInspectionArray(props.data ? props.data : []);

    }, [props.data]);

    useEffect(() => {
        debugger;
        if (myTasksDraft.tableNameList != '') {
            setTableNameList(JSON.parse(myTasksDraft.tableNameList));

        }

    }, [myTasksDraft.tableNameList]);


    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date() - startTime);
            setFinalTime(finalTime => msToTime(diff));
        }, 1000);
    }

    const msToTime = (duration: any) => {

        let milliseconds = (parseFloat(duration) % 1000) / 100;
        let seconds = (parseFloat(duration) / 1000) % 60;
        let minutes = (parseFloat(duration) / (1000 * 60)) % 60;
        let hours = (parseFloat(duration) / (1000 * 60 * 60)) % 24;

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    useEffect(() => {
        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, props.selectedTaskId);
        debugger;
        if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
            timeStarted = checkListData['0'].timeStarted;
            timeElapsed = checkListData['0'].timeElapsed;
            let temp, time;
            if (timeStarted) {
                temp = new Date(timeStarted).getTime();
                time = new Date(timeElapsed).getTime() - temp;
            } else {
                temp = new Date().getTime();
                time = temp - new Date(timeElapsed).getTime();
            }
            startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
        } else {
            startTime = new Date();
        }
        displayCounter();
    }, []);

    const updateCommentValue = (val: any) => {
        let tempArray: any = [...modifiedCheckListData];
        // tempArray[currentSection].data[currentIndex].comment = val;
        setModifiedCheckListData(tempArray);
    }

    const onCommentImageClick = (item: any, index: any) => {

        let tempArray = [...modifiedCheckListData];

        let header = item.parameter_type;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        // setCurrentSection(sectionIndex);
        // setCurrentIndex(index);
        setShowCommentAlert(true);
        setShowGraceAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const attachedImageToAlertImageView = async (item: any) => {

        try {

            if (Platform.OS === 'ios') {
                selectImage(item);
            } else if (Platform.OS === 'android') {

                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ]
                ).then(async (result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

            }
        } catch (err) {
            console.warn(err);
        }
    }

    const selectImage = async (item: any) => {

        let options = {
            title: 'Select Image',
            noData: false,
            customButtons: [
                { name: 'Test', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        try {
            ImagePicker.launchCamera(options, (response) => {

                if (response.didCancel) {
                    // console.log('User cancelled image picker');
                } else if (response.error) {
                    // console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton);
                } else {
                    // console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {
                        if (item == 'one') {
                            let tempArray: any = [...modifiedCheckListData];
                            // tempArray[currentSection].data[currentIndex].image1 = response.fileName;
                            // tempArray[currentSection].data[currentIndex].image1Base64 = response.data;
                            // tempArray[currentSection].data[currentIndex].image1Base64 = response.uri;

                            setBase64One(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                        else {
                            let tempArray: any = [...modifiedCheckListData];
                            // tempArray[currentSection].data[currentIndex].image2 = response.fileName;
                            // tempArray[currentSection].data[currentIndex].image2Base64 = response.data;
                            // tempArray[currentSection].data[currentIndex].image2Base64 = response.uri;

                            setBase64two(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            // alert(JSON.stringify(error))

        }
    }

    const renderTableName = (item: any, index: number) => {

        return (

            <View
                style={{ height: 50, width: 60, borderRadius: 6, backgroundColor: '#abcfbe', justifyContent: 'center', top: 8 }}>

                {/* <TouchableOpacity
                    onPress={() => {
                        let tableNameListTemp = Array();
                        for (let indexTable = 0; indexTable < tableNameList.length; indexTable++) {
                            const element = tableNameList[indexTable];
                            // console.log('tableNameList' + JSON.stringify(tableNameList));
                            if (element == item) {
                                // console.log('tableNameList.splice(indexTable,0, element);' + 'indexTable' + indexTable + "..." + JSON.stringify(tableNameList.splice(indexTable, 0)))
                                tableNameList.splice(tableNameList.indexOf(element), 1);
                                break;
                            }
                        }
                        setTableNameList(tableNameList);
                        myTasksDraft.setTableNameList(JSON.stringify(tableNameList));
                    }}
                    style={{ flex: 1, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Image
                        resizeMode="contain"
                        source={require("./../assets/images/alert_images/close.png")}
                        style={{ height: 24, width: 24, top: 5, left: 5, alignSelf: 'flex-end' }}
                    />
                </TouchableOpacity> */}

                <View style={{ flex: 3, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: 'white', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                        label={item}
                    />
                </View>

            </View>
        )
    }

    const renderData = (item: any, index: number) => {

        if (item.Comment && item.Comment != '') {

            let searchTextArr = item.Comment.split(',')
            let tableName = Array()
            if (searchTextArr.length) {
                for (let index = 0; index < searchTextArr.length; index++) {
                    const element = searchTextArr[index];
                    tableName.push(element)
                }
            }

            item.tableNameList = tableName;
            // myTasksDraft.setTableNameList(JSON.stringify(tableNameList));
        }
        return (

            <View style={{ minHeight: 60, height: 'auto', alignItems: 'center', width: '95%', alignSelf: 'center', borderBottomColor: '#abcfbf', borderBottomWidth: 1 }}>

                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                        <TextComponent
                            textStyle={{ color: 'black', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }}
                            label={(index + 1) + ' ) ' + item.AttributeName}
                        />
                    </View>

                    <View style={{ flex: 2, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                        <View style={{ flex: 1.5, width: '100%', justifyContent: 'center' }}>
                            <FlatList
                                nestedScrollEnabled={true}
                                data={item.tableNameList}
                                horizontal={true}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderTableName(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => <View style={{ width: 18 }} />}
                                ListEmptyComponent={() => <TextComponent
                                    textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                                    label={"No Table Name Available"}
                                />}
                            />
                        </View>

                        <View style={{ flex: .5, width: '100%', justifyContent: 'center' }}>

                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask'}
                                onPress={() => {
                                    if (index == 11) {
                                        props.onCommentImageClick(item, index)
                                    }
                                    else {
                                        props.onTableNameAlertClick(item, index)
                                    }
                                }
                                }
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    resizeMode="contain"
                                    source={item.comment != '' ? require("./../assets/images/startInspection/Notesgreen.png") : require("./../assets/images/startInspection/Notes.png")}
                                    style={{ height: 24, width: 24 }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => props.onAttachmentImageClick(item, index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>

                                <Image
                                    resizeMode="contain"
                                    source={require("./../assets/images/startInspection/Attachment.png")}
                                    style={{ height: '60%', width: '60%' }} />

                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </View>
        )
    }

    return (

        <View style={{ flex: 1, width: '100%', alignSelf: 'center' }}>

            <ScrollView style={{ minHeight: HEIGHT * 0.2, height: 'auto' }}>

                {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            title={'Attachment'}
                            attachmentOne={async () => {
                                await attachedImageToAlertImageView('one');
                            }}
                            attachmentTwo={async () => {
                                await attachedImageToAlertImageView('two');
                            }}
                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask'}
                            base64One={''}
                            base64Two={''}
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                }
                {/* {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            title={'Attachment'}
                            attachmentOne={async () => {
                                await attachedImageToAlertImageView('one');
                            }}
                            attachmentTwo={async () => {
                                await attachedImageToAlertImageView('two');
                            }}
                            base64One={''}
                            base64Two={''}
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                } */}

                <View style={{ minHeight: HEIGHT * 0.25, height: 'auto' }}>

                    <FlatList
                        data={BazarInspectionArray}
                        contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                        initialNumToRender={5}
                        renderItem={({ item, index }) => {
                            return (
                                renderData(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => (<View style={{ width: 8 }} />)}
                    />

                </View>

                <View style={{ height: 15 }} />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    diamondView: {
        width: 45,
        height: 45,
        transform: [{ rotate: '45deg' }]
    },
    circularView: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 10,
    }
});

export default observer(ChecklistComponentForBazar);
