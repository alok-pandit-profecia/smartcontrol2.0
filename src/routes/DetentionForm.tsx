import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid, PermissionsAndroid } from "react-native";
import BottomComponent from '../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from '../components/ButtonComponent';
import TextInputComponent from '../components/TextInputComponent';
import DateComponent from '../components/DateComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from '../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import ImagePicker from 'react-native-image-picker';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import LOVSchema from '../database/LOVSchema';

import AlertComponentForComment from './../components/AlertComponentForComment';
import AlertComponentForAttachment from './../components/AlertComponentForAttachment';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import FoodAlertsStore from '../models/foodAlert/foodAlertsModel';
import TaskSchema from '../database/TaskSchema';
import { useIsFocused } from '@react-navigation/core';
const { Popover } = renderers

const DetentionForm = (props: any) => {

    const context = useContext(Context);
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [unit, setUnit] = useState(Array());
    const [country, setCountry] = useState(Array());
    const [packageArr, setPackageArr] = useState(Array());
    const [reason, setReason] = useState(Array());
    const [serialNumber, setSerialNumber] = useState(0);
    const [isCheck, setIsCheck] = useState(false);
    const [view, setView] = useState(false);
    const [taskType, setTaskType] = useState('');

    const mapStore = (rootStore: RootStoreModel) => ({ detentionDraft: rootStore.detentionModel, myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, bottomBarDraft: rootStore.bottomBarModel })
    const { detentionDraft, myTasksDraft, establishmentDraft, bottomBarDraft } = useInject(mapStore);

    const [attachmentClick, setAttachmentClick] = useState('one');
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [title, setTitle] = useState('');

    let dropdownRef1 = useRef(null);
    let dropdownRef2 = useRef(null);
    let dropdownRef3 = useRef(null);
    let dropdownRef4 = useRef(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        let alertObj = Object();
        if (myTasksDraft.isAlertApplicable) {
            alertObj = myTasksDraft.alertObject != '' ? JSON.parse(myTasksDraft.alertObject) : {}
            if (alertObj.ProductList && alertObj.ProductList.ProductAlert) {
                detentionDraft.setProductname(alertObj.ProductList.ProductAlert[0].ProductName)
            }
        }
    }, [isFocused])

    useEffect(() => {
        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setInspectionDetails(inspectionDetails);

        const title = props.route ? props.route.params ? props.route.params.title : {} : {};
        setTitle(title);
    }, []);

    useEffect(() => {
        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setSerialNumber(props.route ? props.route.params ? props.route.params.serialNumber : props.route.params.serialNumber : 0);

        let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        let taskType = objct['0'] ? objct['0'].TaskType : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : '';

        console.log('taskType :::: ' + JSON.stringify(taskType));

        setTaskType(taskType);

        if (props.route.params && props.route.params.serialNumber) {
            let getType = typeof (props.route.params.serialNumber);
            if (getType == 'string') {
                detentionDraft.setSerialNumber(props.route.params.serialNumber);
            }
            else {
                detentionDraft.setSerialNumber(props.route && props.route.params ? ''.concat(props.route.params && props.route.params.serialNumber) : '0');
            }
        }

        if (props.route.params && props.route.params.view) {
            if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                setView(true);
            } else {
                setView(props.route.params.view);
            }
            setIsCheck(true);

        }
        // //console.log("SerialNO:" + detentionDraft.serialNumber)
        debugger
        setInspectionDetails(inspectionDetails);

        let countryData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'COUNTRY'), countryArr = [];
        let packageData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'FINCORP_DEAL_APPROVAL_AUTH'), packageArrData = [];
        let reasonData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_CONDEMNATION_REASON'), reasonsArr = [];
        // let productNameData = RealmController.getLovDataByKey(realm,LOVSchema.name,'ADFCA_CONDEMNATION_PLACE');
        let unitData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'WEB_COLLAB_TYPE'), unitArr = [];

        for (let indexPlaces = 0; indexPlaces < countryData.length; indexPlaces++) {
            const element = countryData[indexPlaces];
            countryArr.push({ type: element.Value, value: element.Value })
        }
        for (let indexpackage = 0; indexpackage < packageData.length; indexpackage++) {
            const element = packageData[indexpackage];
            packageArrData.push({ type: element.Value, value: element.Value })
        }
        for (let indexreason = 0; indexreason < reasonData.length; indexreason++) {
            const element = reasonData[indexreason];
            reasonsArr.push({ type: element.Value, value: element.Value })
        }
        for (let indexunit = 0; indexunit < unitData.length; indexunit++) {
            const element = unitData[indexunit];
            unitArr.push({ type: element.Value, value: element.Value })
        }

        setCountry(countryArr);
        setPackageArr(packageArrData);
        setUnit(unitArr);
        setReason(reasonsArr);

        return () => {
            if (taskType.toString().toLowerCase() != 'detention') {
                detentionDraft.setClearData();
            }
        }
    }, [])

    const selectImage = async (item: any) => {

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
                            detentionDraft.setAttachment1(JSON.stringify(imageData));
                        }
                        else {
                            imageData.image2 = response.fileName;
                            imageData.image2Base64 = response.data;
                            imageData.image2Uri = response.uri;
                            detentionDraft.setAttachment2(JSON.stringify(imageData));
                        }
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

    const attachmentAlert = async (item: any) => {

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

    const validateNumber =(val:string) =>{
        let regex = new RegExp(/^([0-9]+)$/, 'g');
            // alert(regex.test(str))
            if (regex.test(val)) {
                return true;
            }

    }

    const callToAttachment = async (item: string) => {

        try {

            if (item == 'one') {

                if (detentionDraft.attachment1 && detentionDraft.attachment1 != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            else {

                if (detentionDraft.attachment2 && detentionDraft.attachment2 != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
        }
        catch (e) {
            // alert('Exception' + e);
        }
    }

    const submit = () => {
        debugger;
        if (!isCheck) {
            ToastAndroid.show('Please Accept Terms and Conditions', 1000);
        }
        else if (detentionDraft.unit == '' && detentionDraft.quantity == '' && detentionDraft.netWeight == '' &&
            detentionDraft.package == '' && detentionDraft.batchNumber == '' && detentionDraft.brandName == '') {
            ToastAndroid.show('All fields are mandatory', 1000);
        }
        else if (detentionDraft.unit != '' && detentionDraft.quantity != '' && detentionDraft.netWeight != '' &&
            detentionDraft.package != '' && detentionDraft.batchNumber != '' && detentionDraft.brandName != '') {


            let navigationScreenName = typeof (myTasksDraft.selectedTask) == 'string' ? JSON.parse(myTasksDraft.selectedTask) && JSON.parse(myTasksDraft.selectedTask).TaskType.toString().toLowerCase() == 'detention' ? "StartInspectionCondenation" : 'Detention' : 'Detention';

            if (navigationScreenName == 'StartInspectionCondenation') {
                let detentionData = {
                    serialNumber: detentionDraft.serialNumber,
                    type: detentionDraft.type,
                    unit: detentionDraft.unit,
                    quantity: detentionDraft.quantity,
                    netWeight: detentionDraft.netWeight,
                    package: detentionDraft.package,
                    batchNumber: detentionDraft.batchNumber,
                    brandName: detentionDraft.brandName,
                    productionDate: detentionDraft.productionDate,
                    expiryDate: detentionDraft.expiryDate,
                    reason: detentionDraft.reason,
                    countryOfOrigin: detentionDraft.countryOfOrigin,
                    remarks: detentionDraft.remarks,
                    decisions: detentionDraft.decisions,
                    attachment1: detentionDraft.attachment1,
                    attachment2: detentionDraft.attachment2
                }
                if (detentionDraft.detentionArray != '') {
                    let array = JSON.parse(detentionDraft.detentionArray);
                    let index = array.findIndex((x: any) => x.serialNumber === detentionData.serialNumber);
                    debugger
                    if (index == 0 || index > 0) {
                        array = [...array.slice(0, index), detentionData, ...array.slice(index + 1, array.length)]
                        debugger
                    }
                    else {
                        console.log('detention ::' + JSON.stringify(array));
                        array.push(detentionData);
                        console.log('detentionDetails  array after push::' + JSON.stringify(array));
                        debugger
                    }
                    detentionDraft.setDetentionArray(JSON.stringify(array));
                    NavigationService.navigate(navigationScreenName);
                }
                else {
                    debugger
                    // console.log('detentionDetails  in if::' + JSON.stringify(array));
                    if (detentionData.unit) {
                        let array = [];
                        array.push(detentionData);
                        // console.log('detentionDetails  in if afetr pusj::' + JSON.stringify(array));
                        detentionDraft.setDetentionArray(JSON.stringify(array))
                        NavigationService.navigate(navigationScreenName);

                    }
                }

            }
            else {

                NavigationService.navigate(navigationScreenName, {
                    DetentionData: {
                        serialNumber: detentionDraft.serialNumber,
                        type: detentionDraft.type,
                        unit: detentionDraft.unit,
                        quantity: detentionDraft.quantity,
                        netWeight: detentionDraft.netWeight,
                        package: detentionDraft.package,
                        batchNumber: detentionDraft.batchNumber,
                        brandName: detentionDraft.brandName,
                        productionDate: detentionDraft.productionDate,
                        expiryDate: detentionDraft.expiryDate,
                        reason: detentionDraft.reason,
                        countryOfOrigin: detentionDraft.countryOfOrigin,
                        remarks: detentionDraft.remarks,
                        decisions: detentionDraft.decisions,
                        attachment1: detentionDraft.attachment1,
                        attachment2: detentionDraft.attachment2
                    }
                })
            }
        }
        else {
            let navigationScreenName = typeof (myTasksDraft.selectedTask) == 'string' ? JSON.parse(myTasksDraft.selectedTask) && JSON.parse(myTasksDraft.selectedTask).TaskType.toString().toLowerCase() == 'detention' ? "StartInspectionCondenation" : 'Detention' : 'Detention';

            if (navigationScreenName == 'StartInspectionCondenation') {
                let detentionData = {
                    serialNumber: detentionDraft.serialNumber,
                    type: detentionDraft.type,
                    unit: detentionDraft.unit,
                    quantity: detentionDraft.quantity,
                    netWeight: detentionDraft.netWeight,
                    package: detentionDraft.package,
                    batchNumber: detentionDraft.batchNumber,
                    brandName: detentionDraft.brandName,
                    productionDate: detentionDraft.productionDate,
                    expiryDate: detentionDraft.expiryDate,
                    reason: detentionDraft.reason,
                    countryOfOrigin: detentionDraft.countryOfOrigin,
                    remarks: detentionDraft.remarks,
                    decisions: detentionDraft.decisions,
                    attachment1: detentionDraft.attachment1,
                    attachment2: detentionDraft.attachment2
                }
                if (detentionDraft.detentionArray != '') {
                    let array = JSON.parse(detentionDraft.detentionArray);
                    let index = array.findIndex((x: any) => x.serialNumber === detentionData.serialNumber);
                    debugger
                    if (index == 0 || index > 0) {
                        array = [...array.slice(0, index), detentionData, ...array.slice(index + 1, array.length)]
                        debugger
                    }
                    else {
                        console.log('detention ::' + JSON.stringify(array));
                        array.push(detentionData);
                        console.log('detentionDetails  array after push::' + JSON.stringify(array));
                        debugger
                    }
                    detentionDraft.setDetentionArray(JSON.stringify(array));
                    NavigationService.navigate(navigationScreenName);

                }
                else {
                    debugger
                    // console.log('detentionDetails  in if::' + JSON.stringify(array));
                    if (detentionData.unit) {
                        let array = [];
                        array.push(detentionData);
                        console.log('detentionDetails  in if afetr pusj::' + JSON.stringify(array));
                        detentionDraft.setDetentionArray(JSON.stringify(array))
                        NavigationService.navigate(navigationScreenName);

                    }
                }

            }
            else {

                NavigationService.navigate(navigationScreenName, {
                    DetentionData: {
                        serialNumber: detentionDraft.serialNumber,
                        type: detentionDraft.type,
                        unit: detentionDraft.unit,
                        quantity: detentionDraft.quantity,
                        netWeight: detentionDraft.netWeight,
                        package: detentionDraft.package,
                        batchNumber: detentionDraft.batchNumber,
                        brandName: detentionDraft.brandName,
                        productionDate: detentionDraft.productionDate,
                        expiryDate: detentionDraft.expiryDate,
                        reason: detentionDraft.reason,
                        countryOfOrigin: detentionDraft.countryOfOrigin,
                        remarks: detentionDraft.remarks,
                        decisions: detentionDraft.decisions,
                        attachment1: detentionDraft.attachment1,
                        attachment2: detentionDraft.attachment2
                    }
                })
            }
        }

    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

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
                                    JSON.parse(detentionDraft.attachment1).image1Uri
                                    : JSON.parse(detentionDraft.attachment2).image2Uri
                            }
                            base64One={
                                (attachmentClick == 'one') ?
                                    JSON.parse(detentionDraft.attachment1).image1Base64
                                    : JSON.parse(detentionDraft.attachment2).image2Base64
                            }
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                            attachmentClick={attachmentClick}
                            fromScreen={'detention'}
                        />
                        :
                        null
                }

                {
                    showCommentAlert
                        ?
                        <AlertComponentForComment
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Terms & Condition'}
                            comment={
                                'I , the undersigned ,is committed not to handle,use ,or sell the above mentioned material until safe and proper disposal by following the instruction below : 1.Return the detained material(s) to the supplier and keep the related document   2.Dispose the detained  material(s) by Environment Services Providers (ESps),licensed by Center for Waste  Management - Abu dhabi .Where Required the person concern will communicate with ESps to coordinate the process of disposing.'
                            }
                            disabled={bottomBarDraft.profileClick}
                            message={''}
                            closeAlert={() => {
                                setShowCommentAlert(false);
                            }}
                            okAlert={() => {
                                setShowCommentAlert(false);
                            }}
                            screenName={'detention'}
                        />
                        :
                        null
                }
                {/* <View style={{ flex: 1.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '90%', alignSelf: 'flex-end' }}>
                    <View style={{ flex: 0.3 }}>

                        <View style={{ flex: 0.8 }} />

                        <TouchableOpacity
                            onPress={() => {
                                NavigationService.goBack();
                            }}
                            style={{ flex: 0.5, justifyContent: 'center', alignSelf: 'flex-start', alignItems: 'center' }}>
                            <Image style={{ transform: [{ rotate: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/login/back.png')} />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1.7, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-end' }}>
                        <Image source={require('./../assets/images/logo-size/SmartControlLogo64.png')} />
                    </View>

                    <View style={{ flex: 0.5 }}>

                        <View style={{ flex: 1.5, justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: 'center' }}>
                            <Image source={require('./../assets/images/login/ProfileIcon.png')} />
                        </View>

                        <View style={{ flex: 0.5, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 10, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.welcome)} </Text>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 10, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.guest)} </Text>
                        </View>

                        <View style={{ flex: 0.2 }} />

                    </View>

                </View> */}

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
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

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, backgroundColor: '#abcfbe', flexDirection: 'row', width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.title}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.4, width: '80%', alignSelf: 'center' }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.serialNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={detentionDraft.serialNumber}
                                    onChange={(val: string) => {
                                        detentionDraft.setSerialNumber(val);
                                    }}
                                />

                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.type)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={view ? false : true}
                                    value={detentionDraft.type}
                                    onChange={(val: string) => {
                                        detentionDraft.setType(val);
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.unit)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? undefined : () => {
                                        dropdownRef4 && dropdownRef4.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            value={detentionDraft.unit}
                                            onChangeText={(val: string) => {
                                                detentionDraft.setUnit(val);
                                            }}
                                            disabled={view ? true : false}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={unit}
                                        />
                                    </View>

                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>

                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.quantity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    editable={view ? false : true}
                                    placeholder={detentionDraft.quantity}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType="number-pad"
                                    value={detentionDraft.quantity}
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            detentionDraft.setQuantity(val);
                                        }
                                        else if (validateNumber(val)) {
                                            detentionDraft.setQuantity(val);
                                        }
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.netWeight)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    editable={view ? false : true}
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType="number-pad"
                                    value={detentionDraft.netWeight}
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            detentionDraft.setNeWeight(val);
                                        }
                                        else if (validateNumber(val)) {
                                            detentionDraft.setNeWeight(val);
                                        }
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.package)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? null : () => {
                                        dropdownRef1 && dropdownRef1.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef1}
                                            value={detentionDraft.package}
                                            onChangeText={(val: string) => {
                                                detentionDraft.setPackage(val);
                                            }}
                                            disabled={view ? true : false}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={packageArr}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.batchNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    editable={view ? false : true}
                                    placeholder={detentionDraft.batchNumber}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    // keyboardType="number-pad"
                                    onChange={(val: string) => {
                                        // if (val == '') {
                                        //     detentionDraft.setBatchNumber(val);
                                        // }
                                        // else if (validateNumber(val)) {
                                            detentionDraft.setBatchNumber(val);
                                        // }
                                    }}
                                    value={detentionDraft.batchNumber}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.brandName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    editable={view ? false : true}
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val: string) => {
                                        detentionDraft.setBrandName(val);
                                    }}
                                    value={detentionDraft.brandName}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.productionDate)}</Text>
                            </View>

                            <View style={styles.space} />

                            <View style={[styles.TextInputContainer, { flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between' }]}>

                                <DateComponent disabled={view ? true : false} value={detentionDraft.productionDate} updateDate={(val: any) => detentionDraft.setProductionDate(val)} />

                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.expiryDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <DateComponent disabled={view ? true : false} minimumDate={detentionDraft.productionDate != '' ? new Date(detentionDraft.productionDate) : new Date()} value={detentionDraft.expiryDate} updateDate={(val: any) => detentionDraft.setExpiryDate(val)} />

                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.reason)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? null : () => {
                                        dropdownRef3 && dropdownRef3.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef3}
                                            value={detentionDraft.reason}
                                            onChangeText={(val: string) => {
                                                detentionDraft.setReason(val);
                                            }}
                                            disabled={view ? true : false}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={reason}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.countryOrigin)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? null : () => {
                                        dropdownRef2 && dropdownRef2.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef2}
                                            value={detentionDraft.countryOfOrigin}
                                            onChangeText={(val: string) => {
                                                detentionDraft.setCountryOfOrigin(val);
                                            }}
                                            disabled={view ? true : false}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={country}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.remarks)}</Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={view ? false : true}
                                    onChange={(val: string) => { detentionDraft.setRemarks(val) }}
                                    value={detentionDraft.remarks}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].detentionForm.decisions)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={view ? false : true}
                                    onChange={(val: string) => { detentionDraft.setDecisions(val) }}
                                    value={detentionDraft.decisions}
                                />
                            </View>

                        </View>

                        {/* <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.reason)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef3 && dropdownRef3.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef3}
                                            value={'Customer Unavailable'}
                                            onChangeText={() => { }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={temp}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View> */}

                        <View style={{ flex: 0.4, height: HEIGHT * 0.01, }} />

                        <View style={{ flex: 2, height: HEIGHT * 0.08, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.attachments)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 0.7 }} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('one');
                                        callToAttachment('one')
                                    }}
                                    disabled={view ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={detentionDraft.attachment1 && detentionDraft.attachment1 != '' ? { uri: JSON.parse(detentionDraft.attachment1).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                                <View style={styles.space} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('two');
                                        callToAttachment('two')
                                    }}
                                    disabled={view ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={detentionDraft.attachment2 && detentionDraft.attachment2 != '' ? { uri: JSON.parse(detentionDraft.attachment2).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                            </View>

                        </View>


                    </ScrollView>

                </View>

                <View style={{ flex: 0.15 }} />


                <View style={{ flex: 0.2 }} >

                    <View
                        style={{ height: HEIGHT * 0.05, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setIsCheck(!isCheck);
                            }}
                            disabled={view ? true : false}
                            style={{ flex: 0.3, alignItems: 'center', justifyContent: 'flex-end', flexDirection: props.isArabic ? 'row-reverse' : 'row' }} >
                            <Image
                                source={isCheck ? require("./../assets/images/detention/check.png") : require("./../assets/images/detention/uncheck.png")}
                                resizeMode={"contain"} />
                        </TouchableOpacity>

                        <View style={{ width: WIDTH * 0.02 }} />

                        <View
                            style={{ flex: 0.6, alignItems: 'center', justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }} >

                            <Text style={[{ color: 'black', fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: 'center', alignSelf: 'center' }]}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.termsAndCondition} </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setShowCommentAlert(true);
                            }}
                         //   disabled={view ? true : FoodAlertsStore}
                            style={{ flex: 0.4, alignItems: 'flex-start', justifyContent: 'center' }}
                        >
                            <Text style={[{ color: '#ee3e43', fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: 'center' }]}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.clickToView}</Text>
                        </TouchableOpacity>

                        <View style={{ flex: 0.1 }} />
                    </View >

                </View>


                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.2 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            // taskType.toString().toLowerCase() == 'detention' ? submit() : (view && view == true) ?
                            // NavigationService.goBack() 
                            // : 
                            submit()
                        }}
                        buttonText={(taskType.toString().toLowerCase() == 'detention') ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.next : (view && view == true) ? Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok : Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                    />

                    <View style={{ flex: 0.5 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            NavigationService.navigate('Detention');
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                    />

                    <View style={{ flex: 0.2 }} />


                </View>


                <View style={{ flex: 0.2 }} />

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground >

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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(DetentionForm);