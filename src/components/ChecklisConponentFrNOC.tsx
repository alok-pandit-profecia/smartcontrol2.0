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

import TextComponent from "./TextComponent/index";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

const ChecklisConponentFrNOC = (props: any) => {

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
    const [NocArray, setNocArray] = useState(Array());
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

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''

    //compliance  - score
    //if score - N (anyone - reject btn hide)
    //check Score blank = please Enter Score mandatory
    //if N - comment mandatory
    //score & weightage 
    //not grace 
    useEffect(() => {
        debugger;
        setNocArray(props.data ? props.data : []);
    }, [props.data]);


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

    const renderData = (item: any, index: number) => {

        // console.log('index' + item.NOC_parameter_category);

        return (

            <View style={{ minHeight: 60, height: 'auto', alignItems: 'center', width: '95%', alignSelf: 'center', borderBottomColor: '#abcfbf', borderBottomWidth: 1 }}>

                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%', justifyContent: 'center' }}>
                        <TextComponent
                            textStyle={{ color: 'black', textAlign: props.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }}
                            label={(index + 1) + ')  ' + item.NOC_parameter_category}
                        />
                    </View>

                    <View style={{ flex: 2, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => props.onInfoImageClick(item, index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                source={require("./../assets/images/startInspection/info.png")}
                                style={{ height: "60%", width: "60%" }}
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>

                        <View style={{ flex: 0.2 }} />

                        {taskType.toLowerCase().includes('food') ?
                            <TouchableOpacity
                                // disabled={props.item.informationDisableForEHS}
                                onPress={() => {
                                    if (item.Score == 'Y') {
                                        item.Score = 'N';
                                    }
                                    else {
                                        item.Score = 'Y';
                                        item.NAValue = 'N';
                                        item.NIValue = 'N';
                                        item.comment = '';
                                    }
                                    props.onScoreImageClick(item, index);
                                }}
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                style={[styles.circularView, { width: 65, height: 30, flexDirection: context.isArabic ? 'row-reverse' : 'row', backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }]}>

                                <Image
                                    source={item.Score == 'Y' ? require("./../assets/images/startInspection/Check.png") : require("./../assets/images/startInspection/Uncheck.png")}
                                    style={{ height: 25, width: 25, alignSelf: 'center' }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                            :
                            <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>

                                <MenuTrigger onPress={() => { }} disabled={((myTasksDraft.isMyTaskClick == 'CompletedTask') || (item.NAValue == 'Y')) ? true : false} style={styles.menuTrigger}>

                                    <View
                                        style={{ width: 40, padding: 5, borderRadius: 15, backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }}>

                                        <TextComponent
                                            textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                            label={item.Score ? (item.Score == '4' ? 'Y' : item.Score == '0' ? 'N' : item.Score) : '-'}
                                        />

                                    </View>

                                </MenuTrigger>

                                <MenuOptions style={styles.menuOptions}>

                                    <MenuOption onSelect={() => { setTouchableClick(false); props.onComplianceClick(item, index, '-') }}>
                                        <TextComponent
                                            textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                            label={' - '}
                                        />
                                    </MenuOption>

                                    <MenuOption onSelect={() => {
                                        setTouchableClick(false);
                                        item.NAValue = 'N';
                                        item.comment = '';
                                        props.onComplianceClick(item, index, 'Y')
                                    }}>
                                        <TextComponent
                                            textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                            label={'Y'}
                                        />
                                    </MenuOption>

                                    <MenuOption onSelect={() => {
                                        setTouchableClick(false);
                                        item.NAValue = 'N';
                                        props.onComplianceClick(item, index, 'N')
                                    }}>
                                        <TextComponent
                                            textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                            label={'N'}
                                        />
                                    </MenuOption>

                                </MenuOptions>

                            </Menu>
                        }
                        <TouchableOpacity
                            onPress={() => props.onCommentImageClick(item, index)}

                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                resizeMode="contain"
                                source={item.comment != '' ? require("./../assets/images/startInspection/Notesgreen.png") : require("./../assets/images/startInspection/Notes.png")}
                                style={{ height: 24, width: 24 }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false} // disabled={props.item.informationDisableForEHS}
                            onPress={() => {
                                if (item.NAValue == 'Y') {
                                    item.NAValue = 'N';
                                    item.Score = '';
                                }
                                else {
                                    item.NAValue = 'Y';
                                    item.NIValue = 'N';
                                    item.Score = '';
                                }
                                props.onNAClick(item, index);
                            }}
                            style={[styles.circularView, { width: 65, height: 30, flexDirection: context.isArabic ? 'row-reverse' : 'row', backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }]}>
                            <TextComponent
                                textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal', alignSelf: 'center' }}
                                label={'N/A'}
                            />
                            <Image
                                source={item.NAValue == 'Y' ? require("./../assets/images/startInspection/Check.png") : require("./../assets/images/startInspection/Uncheck.png")}
                                style={{ height: 25, width: 25, alignSelf: 'center' }}
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>

                        {taskType.toLowerCase().includes('food') ?
                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                onPress={() => {
                                    if (item.NIValue == 'Y') {
                                        item.NIValue = 'N';
                                        item.Score = '';
                                        item.comment = '';
                                    }
                                    else {
                                        item.NIValue = 'Y';
                                        item.NAValue = 'N';
                                        item.Score = '';
                                        item.comment = '';
                                    }
                                    props.onNIClick(item, index);
                                }}
                                style={[styles.circularView, { width: 65, height: 30, flexDirection: context.isArabic ? 'row-reverse' : 'row', backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }]}>
                                <TextComponent
                                    textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal', alignSelf: 'center' }}
                                    label={'N/I'}
                                />
                                <Image
                                    source={item.NIValue == 'Y' ? require("./../assets/images/startInspection/Check.png") : require("./../assets/images/startInspection/Uncheck.png")}
                                    style={{ height: 25, width: 25, alignSelf: 'center' }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                            : null}

                        <TouchableOpacity
                            onPress={() => props.onAttachmentImageClick(item, index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>

                            <Image
                                resizeMode="contain"
                                source={(item.image1Uri || item.image2Uri) ? require("./../assets/images/startInspection/Attachementgreen.png") : require("./../assets/images/startInspection/Attachment.png")}
                                style={{ height: '60%', width: '60%' }} />

                        </TouchableOpacity>

                        {taskType.toLowerCase().includes('food') ?
                            null :
                            <TouchableOpacity
                                onPress={() => props.onDescImageClick(item, index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require("./../assets/images/startInspection/Description.png")}
                                    style={{ height: "60%", width: "60%" }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                        }
                    </View>

                </View>

            </View >
        )
    }

    return (

        <View style={{ flex: 1, width: '100%', alignSelf: 'center' }}>


            <ScrollView style={{ minHeight: HEIGHT * 0.2, height: 'auto' }}>
                {
                    errorGraceAlert
                        ?
                        <AlertComponentForError
                            showMessage={true}
                            title={'Warning'}
                            message={`Select grace for question number ${graceErrorIndex + 1} from section ${graceErrorSectionTitle}`}
                            closeAlert={() => {
                                setErrorGraceAlert(false);
                            }}
                        />
                        :
                        null
                }
                {
                    errorCommentAlert
                        ?
                        <AlertComponentForError
                            showMessage={true}
                            title={'Warning'}
                            message={`Select comment for question number ${commentErrorIndex + 1} from section ${commentErrorSectionTitle}`}
                            closeAlert={() => {
                                setErrorCommentAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showCommentAlert ?
                        <AlertComponentForComment
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Comment'}
                            comment={''}
                            message={'Enter comment'}
                            updateCommentValue={updateCommentValue}
                            closeAlert={() => {
                                setShowCommentAlert(false);
                            }}
                            okAlert={() => {
                                setShowCommentAlert(false);
                            }}
                        />
                        :
                        null
                }
                {
                    showInformationAlert
                        ?
                        <AlertComponentForInformation
                            showMessage={true}
                            title={'Information'}
                            message={''}
                            closeAlert={() => {
                                setShowInformationAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showRegulationAlert
                        ?
                        <AlertComponentForRegulation
                            title={'Regulation'}
                            message={regulationString}
                            closeAlert={() => {
                                setShowRegulationAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showDescAlert
                        ?
                        <AlertComponentForRegulation
                            title={'Regulation'}
                            message={regulationString}
                            closeAlert={() => {
                                setShowRegulationAlert(false);
                            }}
                        />
                        :
                        null
                }
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
                            base64One={''}
                            base64Two={''}
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                }

                <View style={{ minHeight: HEIGHT * 0.25, height: 'auto' }}>

                    <FlatList
                        data={NocArray}
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

export default observer(ChecklisConponentFrNOC);
