import React, { useState, useEffect, useContext, useRef, createRef, } from 'react';
import { PermissionsAndroid, Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from '../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from '../components/ButtonComponent';
import TextInputComponent from '../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from '../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import LoginSchema from '../database/LoginSchema';
import SignatureCapture from 'react-native-signature-capture';
let realm = RealmController.getRealmInstance();
import ImagePicker from 'react-native-image-picker';
import AlertComponentForAttachment from './../components/AlertComponentForAttachment';
import submissionPayload from '../utils/payloads/ChecklistSubmitPayload';
import Spinner from 'react-native-loading-spinner-overlay';
import TaskSchema from '../database/TaskSchema';
import EstablishmentSchema from '../database/EstablishmentSchema';

const ClosureInspection = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, licenseDraft: rootStore.licenseMyTaskModel, closureInspectionDraft: rootStore.closureInspectionModel, documantationDraft: rootStore.documentationAndReportModel, bottomBarDraft: rootStore.bottomBarModel })
    const { establishmentDraft, myTasksDraft, closureInspectionDraft, documantationDraft, bottomBarDraft } = useInject(mapStore);

    const sign = createRef();
    const [taskId, setTaskId] = useState('');
    const [inspectorName, setInspectorName] = useState('');
    const [licensesCode, setLicenseCode] = useState('');
    const [address, setAddress] = useState('');
    const [tradeName, setTradeName] = useState('');
    const [attachmentClick, setAttachmentClick] = useState('one');
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [approvalClick, setApprovalClick] = useState(false);
    const [action, setAction] = useState('');
    const [signbase64, setSignbase64] = useState('');
    const [inspectionDetails, setInspectionDetails] = useState(Object());

    let signData: string = '';

    useEffect(() => {

        let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, JSON.parse(myTasksDraft.selectedTask).EstablishmentId);
        if (temp && temp[0]) {
            setLicenseCode(temp[0].LicenseNumber ? temp[0].LicenseNumber : '');
            setAddress(temp[0].PrimaryAddressId ? temp[0].PrimaryAddressId : '');
            setTradeName(context.isArabic ? temp[0].ArabicName ? temp[0].ArabicName : '' : temp[0].EnglishName ? temp[0].EnglishName : '');
            closureInspectionDraft.setLicenseNumber(temp[0].LicenseNumber ? temp[0].LicenseNumber : '');
        }

        let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

        if (taskData && taskData['0']) {

            let inspectionDetails = taskData['0'] ? taskData['0'] : JSON.parse(myTasksDraft.selectedTask);
            setInspectionDetails(inspectionDetails);

            //console.log('inspectionDetails' + (inspectionDetails.base));

            let comment = taskData['0'].comment ? taskData['0'].comment : '';
            closureInspectionDraft.setComment(comment);

            let nameOfBusinessOperator = taskData['0'].nameOfFoodBusinessOperator ? taskData['0'].nameOfFoodBusinessOperator : '';
            closureInspectionDraft.setNameOfBusinessOperator(nameOfBusinessOperator);

            let mappingData = taskData['0'].mappingData ? JSON.parse(taskData['0'].mappingData) : '';
            // //console.log('mappingData useEffect' + JSON.stringify(mappingData));
            closureInspectionDraft.setFileBuffer(mappingData['0'].signatureBase64)
            setSignbase64(mappingData['0'].signatureBase64);
    
            let attachment = taskData['0'].attachment ? taskData['0'].attachment : '';
            if (attachment != '') {
                closureInspectionDraft.setAttachmentOne(JSON.parse(attachment)['0']);
                closureInspectionDraft.setAttachmentTwo(JSON.parse(attachment)['1']);
                closureInspectionDraft.setAttachmentThree(JSON.parse(attachment)['2']);
                closureInspectionDraft.setAttachmentFour(JSON.parse(attachment)['3']);
                closureInspectionDraft.setAttachmentFive(JSON.parse(attachment)['4']);
            }

            let inspectionApproved = (typeof taskData['0'].inspectionApproved !== 'undefined' && taskData['0'].inspectionApproved == true) ? 'Inspection Approved' : (typeof taskData['0'].inspectionApproved !== 'undefined' && taskData['0'].inspectionApproved == false) ? 'Inspection Rejected' : '';
            if (inspectionApproved != '') {
                setApprovalClick(taskData['0'].inspectionApproved);
                setAction(inspectionApproved);
            }
        }
     
        return () => {
            establishmentDraft.setEstablishmentDataBlank()
        }

    }, []);

    useEffect(() => {
        let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
        // //console.log("loginInfo", loginInfo[0].loginResponse);
        let inspectorName = JSON.parse(loginInfo[0].loginResponse).InspectorName;
        setInspectorName(inspectorName);
    }, []);

    const [error, setError] = useState({
        inspectionIdError: '',
        commentError: ''
    });

    const saveSign = () => {
        sign.current.saveImage();
        closureInspectionDraft.setSaveImageFlag("true");
    };

    const resetSign = () => {
        setSignbase64('')
        if (closureInspectionDraft.fileBuffer !== '') {
            closureInspectionDraft.setFileBuffer('')
        }
        else {
            sign.current.resetImage();
        }
    };

    const onSaveEvent = (result: any) => {

        signData = result.encoded;
        setSignbase64(result.encoded);
        closureInspectionDraft.setFileBuffer(result.encoded);

        let taskDetails = { ...inspectionDetails };
        let mappingData = taskDetails.mappingData ? JSON.parse(taskDetails.mappingData) : [{}];
        mappingData['0'].signatureBase64 = closureInspectionDraft.fileBuffer;

        taskDetails.mappingData = JSON.stringify(mappingData);
        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
        });

    };


    const onDragEvent = () => {
        saveSign()
    };
    /* const onClickImage =() =>{
         Alert.alert('Hiii I am in image');
 
     }*/

    const onImageClick = () => {
        var options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {
            // //console.log('Response = ', response);

            if (response.didCancel) {
                // //console.log('User cancelled image picker');
            } else if (response.error) {
                // //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // //console.log('User tapped custom button: ', response.customButton);
                Alert.alert(response.customButton);
            } else {
                let source = response;

            }
        });
    };

    const selectImage = async (item) => {

        let imageData: any = {};
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
                    // //console.log('User cancelled image picker');
                } else if (response.error) {
                    // //console.log('ImagePicker Error: '+ response.error);
                } else if (response.customButton) {
                    // //console.log('User tapped custom button: ', response.customButton);
                } else {
                    // //console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {

                        if (item == 'one') {
                            imageData.image1 = response.fileName;
                            imageData.image1Base64 = response.data;
                            imageData.image1Uri = response.uri;
                            closureInspectionDraft.setAttachmentOne(JSON.stringify(imageData));

                        }
                        else if (item == 'two') {
                            imageData.image2 = response.fileName;
                            imageData.image2Base64 = response.data;
                            imageData.image2Uri = response.uri;
                            closureInspectionDraft.setAttachmentTwo(JSON.stringify(imageData));
                        }
                        else if (item == 'three') {
                            imageData.image3 = response.fileName;
                            imageData.image3Base64 = response.data;
                            imageData.image3Uri = response.uri;
                            closureInspectionDraft.setAttachmentThree(JSON.stringify(imageData));
                        }
                        else if (item == 'four') {
                            imageData.image4 = response.fileName;
                            imageData.image4Base64 = response.data;
                            imageData.image4Uri = response.uri;
                            closureInspectionDraft.setAttachmentFour(JSON.stringify(imageData));
                        }
                        else {
                            imageData.image5 = response.fileName;
                            imageData.image5Base64 = response.data;
                            imageData.image5Uri = response.uri;
                            closureInspectionDraft.setAttachmentFive(JSON.stringify(imageData));
                        }

                        let taskDetails = { ...inspectionDetails };
                        taskDetails.attachment = JSON.stringify([closureInspectionDraft.attachmentOne, closureInspectionDraft.attachmentTwo, closureInspectionDraft.attachmentThree, closureInspectionDraft.attachmentFour, closureInspectionDraft.attachmentFive]);

                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                            // ToastAndroid.show('Task objct successfully ', 1000);
                            debugger;
                        });
                    }
                    else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            // alert(JSON.stringify(error))

        }
    }


    const attachmentAlert = async (item) => {

        const granted = await PermissionsAndroid.request(

            PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'Smart Control',
            message: 'You want to use the camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            //console.log("You can use the camera")
            selectImage(item);

        }
        else {
            //console.log("Camera permission denied")
        }
    }

    const callToAttachment = async (item: string) => {

        try {

            if (item == 'one') {

                if (closureInspectionDraft.attachmentOne && closureInspectionDraft.attachmentOne != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }
            }
            else if (item == 'two') {

                if (closureInspectionDraft.attachmentTwo && closureInspectionDraft.attachmentTwo != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            if (item == 'three') {

                if (closureInspectionDraft.attachmentThree && closureInspectionDraft.attachmentThree != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            if (item == 'four') {

                if (closureInspectionDraft.attachmentFour && closureInspectionDraft.attachmentFour != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            else {

                if (closureInspectionDraft.attachmentFive && closureInspectionDraft.attachmentFive != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
        }
        catch (e) {
            //console.log('Exception' + e);
        }
    }

    const onSubmit = async () => {

        let flag = true;
        try {

            if (closureInspectionDraft.comment == '') {
                Alert.alert('', 'Please enter the comment');
                flag = false;
            }
            else if (closureInspectionDraft.nameOfBusinessOperator == '') {
                Alert.alert('', 'Please enter the Name of the food business operator');
                flag = false;
            }
            else if (signbase64 == '') {
                Alert.alert("", "Signature is mandatory")
                flag = false;
            }
            else if (closureInspectionDraft.attachmentOne == '' && closureInspectionDraft.attachmentTwo == '' && closureInspectionDraft.attachmentThree == '' && closureInspectionDraft.attachmentFour == '' && closureInspectionDraft.attachmentFive == '') {
                Alert.alert('', 'Atlease one attachment is mandatory');
                flag = false;
            }
            else if (action == '') {
                Alert.alert('', 'Please give the answer of approval');
                flag = false;
            }

            if (flag) {
                Alert.alert(
                    'Confirm Submission',
                    'Are you sure want to submit inspection ? Action' + action,
                    [
                        {
                            text: '',
                            onPress: () => {}
                        },
                        {
                            text: 'Cancel',
                            onPress: () => {},
                            // style: 'cancel'
                        },
                        {
                            text: 'OK', onPress: async () => {

                                let TaskItem = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : '';

                                let finalTime = new Date().getTime().toString();
                                let payload: any = await submissionPayload('',[], myTasksDraft.taskId, TaskItem, inspectorName, '', '', '', finalTime, closureInspectionDraft.comment, false, '', '', '', '', '', myTasksDraft.latitude, myTasksDraft.longitude, closureInspectionDraft.nameOfBusinessOperator, action.toString, '', '', '', '', '', '', '', '', '', '');

                                let attachmentOne = closureInspectionDraft.attachmentOne != '' ? JSON.parse(closureInspectionDraft.attachmentOne).image1Base64 : '';
                                let attachmentTwo = closureInspectionDraft.attachmentTwo != '' ? JSON.parse(closureInspectionDraft.attachmentTwo).image2Base64 : '';
                                let attachmentThree = closureInspectionDraft.attachmentThree != '' ? JSON.parse(closureInspectionDraft.attachmentThree).image3Base64 : '';
                                let attachmentFour = closureInspectionDraft.attachmentFour != '' ? JSON.parse(closureInspectionDraft.attachmentFour).image4Base64 : '';
                                let attachmentFive = closureInspectionDraft.attachmentFive != '' ? JSON.parse(closureInspectionDraft.attachmentFive).image5Base64 : '';
                                let base64 = [attachmentOne, attachmentTwo, attachmentThree, attachmentFour, attachmentFive];
                                debugger;

                                try {
                                    let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

                                    let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask);
                                    //ithe
                                    let mappingData = inspectionDetails.mappingData ? JSON.parse(inspectionDetails.mappingData) : [{}];
                                    mappingData['0'].signatureBase64 = closureInspectionDraft.fileBuffer;
                                    // //console.log('mappingData', mappingData['0']);
                                    inspectionDetails.comment = closureInspectionDraft.comment;
                                    inspectionDetails.nameOfFoodBusinessOperator = closureInspectionDraft.nameOfBusinessOperator;
                                    inspectionDetails.attachment = JSON.stringify([closureInspectionDraft.attachmentOne, closureInspectionDraft.attachmentTwo, closureInspectionDraft.attachmentThree, closureInspectionDraft.attachmentFour, closureInspectionDraft.attachmentFive]);
                                    inspectionDetails.inspectionApproved = action.toLowerCase() == 'inspection approved' ? true : false;
                                    inspectionDetails.address = address;
                                    inspectionDetails.mappingData = JSON.stringify(mappingData);

                                    //console.log('inspectionDetails' + (inspectionDetails.mappingData));
                                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                                        // ToastAndroid.show('Task objct successfully ', 1000);
                                        debugger;
                                        closureInspectionDraft.callToAttachmentApi(myTasksDraft.taskId, base64, inspectorName, payload, inspectionDetails);

                                        // NavigationService.navigate('EstablishmentDetails');
                                    });

                                }
                                catch (e) {
                                    //console.log(e);
                                }



                            }
                        }
                    ],
                    { cancelable: false }
                );

            }
        }
        catch (e) {
            console.log(e);
        }

    }

    const onClickYes = () => {

        let s = 'Satisfactory';
        setAction('Inspection Approved');
        setApprovalClick(true);

        let taskDetails = { ...inspectionDetails };
        taskDetails.inspectionApproved = approvalClick && action.toLowerCase() == 'inspection approved' ? true : false;
        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            // ToastAndroid.show('Task objct successfully ', 1000);
            debugger;
            // NavigationService.navigate('EstablishmentDetails');
        });

        Alert.alert('Confirm Submission', 'Are you sure want to submit inspection ? Action ' + s);

    }

    const onClickNo = () => {
        let s = 'Unsatisfactory';
        setAction('Inspection Rejected');
        setApprovalClick(false);

        let taskDetails = { ...inspectionDetails };
        taskDetails.inspectionApproved = approvalClick && action.toLowerCase() == 'inspection approved' ? true : false;
        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            // ToastAndroid.show('Task objct successfully ', 1000);
            debugger;
            // NavigationService.navigate('EstablishmentDetails');
        });

        Alert.alert('Confirm Submission', 'Are you sure want to submit inspection ? Action ' + s);

    }


    const goBack = () => {

        try {
            let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

            let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask);
            setInspectionDetails(inspectionDetails);

            inspectionDetails.comment = closureInspectionDraft.comment;
            inspectionDetails.nameOfFoodBusinessOperator = closureInspectionDraft.nameOfBusinessOperator;
            inspectionDetails.attachment = JSON.stringify([closureInspectionDraft.attachmentOne, closureInspectionDraft.attachmentTwo, closureInspectionDraft.attachmentThree, closureInspectionDraft.attachmentFour, closureInspectionDraft.attachmentFive]);
            inspectionDetails.inspectionApproved = approvalClick && (action.toLowerCase() == 'inspection approved') ? true : false;
            inspectionDetails.address = address;

            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                // ToastAndroid.show('Task objct successfully ', 1000);
                debugger;
                NavigationService.goBack();
            });
        }
        catch (e) {
            alert(e);
        }

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>


                <Spinner
                    visible={closureInspectionDraft.state == 'pending' ? true : false}
                    textContent={closureInspectionDraft.loadingState != '' ? closureInspectionDraft.loadingState : 'Loading ...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            title={'Attachment'}
                            attachmentOne={async () => {
                                await attachmentAlert('one');
                            }}
                            attachmentTwo={async () => {
                                await attachmentAlert('two');
                            }}
                            image1Uri={
                                (attachmentClick == 'one') ?
                                    JSON.parse(closureInspectionDraft.attachmentOne).image1Uri :
                                    (attachmentClick == 'two') ?
                                        JSON.parse(closureInspectionDraft.attachmentTwo).image2Uri :
                                        (attachmentClick == 'three') ?
                                            JSON.parse(closureInspectionDraft.attachmentThree).image3Uri :
                                            (attachmentClick == 'four') ?
                                                JSON.parse(closureInspectionDraft.attachmentFour).image4Uri :
                                                JSON.parse(closureInspectionDraft.attachmentFive).image5Uri
                            }
                            base64One={
                                (attachmentClick == 'one') ?
                                    JSON.parse(closureInspectionDraft.attachmentOne).image1Base64 :
                                    (attachmentClick == 'two') ?
                                        JSON.parse(closureInspectionDraft.attachmentTwo).image2Base64 :
                                        (attachmentClick == 'three') ?
                                            JSON.parse(closureInspectionDraft.attachmentThree).image3Base64 :
                                            (attachmentClick == 'four') ?
                                                JSON.parse(closureInspectionDraft.attachmentFour).image4Base64 :
                                                JSON.parse(closureInspectionDraft.attachmentFive).image5Base64
                            }
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                            attachmentClick={attachmentClick}
                            fromScreen={'condemnation'}
                        />
                        :
                        null
                }

                <View style={{ flex: 2.5 }}>
                    <Header isArabic={context.isArabic} screenName={'clouser'} goBack={goBack} />
                </View>

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].closureInspection.title}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.9, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.7, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 2.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 11, fontWeight: 'bold' }}>{myTasksDraft.taskId}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 1.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Fujitsu India'}</Text>
                    </View>

                    <View style={{ flex: 0.8 }} />

                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 6, width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 2.5, height: HEIGHT * 0.05, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.tradeName)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 5, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={tradeName}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={myTasksDraft.isMyTaskClick.toLowerCase() == 'completedtask' ? false : true}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    // onHoldRequestDraft.setInspectionId(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />

                        </View>

                    </View>

                    <View style={{ flex: 0.9 }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.address)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={address}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={myTasksDraft.isMyTaskClick.toLowerCase() == 'completedtask' ? false : true}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    // onHoldRequestDraft.setType(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />

                        </View>

                    </View>

                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.licenseNo)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={myTasksDraft.isMyTaskClick.toLowerCase() == 'completedtask' ? false : true}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                value={licensesCode}
                                onChange={(val: string) => {
                                    closureInspectionDraft.setLicenseNumber(val);
                                    //onHoldRequestDraft.setCreatedBy(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />

                        </View>

                    </View>


                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.05, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.comment)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={closureInspectionDraft.comment}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={myTasksDraft.isMyTaskClick.toLowerCase() == 'completedtask' ? false : true}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {

                                    closureInspectionDraft.setComment(val);
                                    let taskDetails = { ...inspectionDetails }
                                    taskDetails.comment = val;

                                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                    });

                                    setError(prevState => {
                                        return { ...prevState, commentError: '' }
                                    });
                                }}
                            />

                        </View>

                    </View>
                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.nameoffoodbusinessoperator)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                editable={myTasksDraft.isMyTaskClick.toLowerCase() == 'completedtask' ? false : true}
                                isArabic={context.isArabic}
                                value={closureInspectionDraft.nameOfBusinessOperator}
                                maxLength={props.maxLength ? props.maxLength : 15}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {

                                    closureInspectionDraft.setNameOfBusinessOperator(val);

                                    let taskDetails = { ...inspectionDetails }
                                    taskDetails.nameOfFoodBusinessOperator = val;

                                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                    });

                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });

                                }}
                            />
                        </View>

                    </View>
                    <View style={{ flex: 0.9, }} />

                    <View style={{ flex: 2.5, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.inspectorName)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '100%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={inspectorName}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                editable={false}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                }}
                            />

                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.5, alignItems: 'flex-start', justifyContent: 'center', paddingLeft: 30 }}>
                    <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold', textAlign: 'left' }}>{'Enter Signature'}</Text>
                </View>

                <View style={{ flex: 0.1 }} />

                <View style={{ flex: 3.5, justifyContent: 'center', paddingLeft: 30, paddingRight: 30, paddingBottom: 30 }}>

                    <View style={{ flex: 7, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderColor: '#c0c0c0' }}>

                        {
                            closureInspectionDraft.fileBuffer !== '' ?
                                <Image
                                    source={{ uri: `data:image/jpeg;base64,${closureInspectionDraft.fileBuffer}` }}
                                    style={{
                                        height: '100%', alignSelf: 'center', width: '100%', padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                                    }}
                                />
                                :
                                <SignatureCapture
                                    style={{
                                        height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                                    }}
                                    ref={sign}
                                    onSaveEvent={onSaveEvent}
                                    onDragEvent={onDragEvent}
                                    saveImageFileInExtStorage={false}
                                    showNativeButtons={false}
                                    showTitleLabel={false}
                                />
                        }

                    </View>

                    <View style={{ backgroundColor: '#c0c0c0', flex: 2.5, justifyContent: 'center', borderBottomLeftRadius: 6, borderBottomRightRadius: 6, height: '100%' }}>

                        <View style={{ backgroundColor: '#c0c0c0', alignSelf: props.isArabic ? 'flex-start' : 'flex-end', width: '35%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', height: '100%', paddingTop: 2, paddingBottom: 2 }}>

                            <View style={{ flex: .4 }} />

                            <View style={{ flex: .6, justifyContent: 'center', backgroundColor: '#5c666f', height: '100%' }}>

                                <TouchableOpacity
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    onPress={() => {
                                        resetSign();
                                    }} >
                                    <Image style={{ alignSelf: 'center' }} source={require('./../assets/images/startInspection/delete.png')} />
                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: .2 }} />

                        </View>

                        <View style={{ flex: .2 }} />

                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', width: '90%', alignSelf: 'center' }}>

                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                onPress={() => {
                                    setAttachmentClick('one');
                                    callToAttachment('one')
                                }}
                                style={{
                                    flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                }}>

                                <Image
                                    source={closureInspectionDraft.attachmentOne && closureInspectionDraft.attachmentOne != '' ? { uri: JSON.parse(closureInspectionDraft.attachmentOne).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                    style={{ height: 32, width: 32, transform: [{ rotateY: props.isArabic ? '180deg' : '1deg' }] }}
                                    resizeMode={"contain"} />

                            </TouchableOpacity>

                        </View>

                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                onPress={() => {
                                    setAttachmentClick('two');
                                    callToAttachment('two')
                                }}
                                style={{
                                    flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                }}>

                                <Image
                                    source={closureInspectionDraft.attachmentTwo && closureInspectionDraft.attachmentTwo != '' ? { uri: JSON.parse(closureInspectionDraft.attachmentTwo).image2Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                    style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />

                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                onPress={() => {
                                    setAttachmentClick('three');
                                    callToAttachment('three');
                                }}
                                style={{
                                    flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                }}>

                                <Image
                                    source={closureInspectionDraft.attachmentThree && closureInspectionDraft.attachmentThree != '' ? { uri: JSON.parse(closureInspectionDraft.attachmentThree).image3Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                    style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />

                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                onPress={() => {
                                    setAttachmentClick('four');
                                    callToAttachment('four')
                                    // //console.log('here is 4 st image');
                                }}
                                style={{
                                    flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                }}>

                                <Image
                                    source={closureInspectionDraft.attachmentFour && closureInspectionDraft.attachmentFour != '' ? { uri: JSON.parse(closureInspectionDraft.attachmentFour).image4Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                    style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />

                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                onPress={() => {
                                    setAttachmentClick('five');
                                    callToAttachment('five')
                                }}
                                style={{
                                    flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 20, borderRadius: 8
                                }}>

                                <Image
                                    source={closureInspectionDraft.attachmentFive && closureInspectionDraft.attachmentFive != '' ? { uri: JSON.parse(closureInspectionDraft.attachmentFive).image5Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                    style={{ height: 24, width: 24, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />

                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={{ flex: 1, justifyContent: 'center', height: '100%', margin: 3.5, alignItems: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.msg)} </Text>
                        </View>



                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '100%', alignSelf: 'center' }}>

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: approvalClick && action.toLocaleLowerCase() == 'inspection approved' ? 'green' : '#5c666f', height: '100%', borderRadius: 5 }}>

                                <TouchableOpacity
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    onPress={() => {
                                        onClickYes();
                                    }}
                                    style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}

                                >
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', padding: 2 }}>{Strings[props.isArabic ? 'ar' : 'en'].closureInspection.yes}</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{ flex: .2 }} />

                            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: !approvalClick && action.toLocaleLowerCase() == 'inspection rejected' ? 'red' : '#5c666f', height: '100%', alignItems: 'center', borderRadius: 5 }}>
                                <TouchableOpacity
                                    disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                                    onPress={() => {
                                        onClickNo();
                                    }}
                                    style={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}
                                >
                                    <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', textAlign: 'center', padding: 2 }}>{Strings[props.isArabic ? 'ar' : 'en'].closureInspection.no}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ flex: .2 }} />

                        </View>


                    </View>

                </View>

                <View style={{ flex: 0.5 }} />

                {myTasksDraft.isMyTaskClick == 'CompletedTask' ? <View style={{ flex: 0.5 }} /> :

                    <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.2 }} />

                        <ButtonComponent
                            style={{ height: '100%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                            buttonClick={() => {
                                onSubmit();
                            }}
                            // buttonClick={() => }
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                        />

                        <View style={{ flex: 0.2 }} />

                        <ButtonComponent
                            style={{ height: '100%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                            buttonClick={() => {
                                NavigationService.goBack();
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                        />

                        <View style={{ flex: 0.2 }} />

                    </View>
                }

                <View style={{ flex: 0.7 }} />

                <View style={{ flex: 1.8 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

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
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',
    },
    space: {
        flex: 0.1,
    },

    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },

});

export default observer(ClosureInspection);

