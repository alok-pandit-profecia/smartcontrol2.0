import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid, PermissionsAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from './../components/dropdown';
import ImagePicker from 'react-native-image-picker';
// import DocumentPicker from 'react-native-document-picker';
import { RootStoreModel } from '../store/rootStore';
import DateComponent from '../components/DateComponent';
import useInject from "../hooks/useInject"
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import LOVSchema from '../database/LOVSchema';
import AlertComponentForAttachment from './../components/AlertComponentForAttachment';
import { useIsFocused } from '@react-navigation/native';

import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
import TaskSchema from '../database/TaskSchema';
const { Popover } = renderers

const SamplingForm = (props: any) => {

    const context = useContext(Context);
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [serialNumber, setSerialNumber] = useState(0);

    const [country, setCountry] = useState(Array());
    const [reasonArr, setReasonArr] = useState(Array());
    const [unit, setUnit] = useState(Array());
    const [packageArr, setPackageArr] = useState(Array());

    const [attachmentClick, setAttachmentClick] = useState('one');
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [title, setTitle] = useState('');
    const [viewOnly, setViewOnly] = useState(false);
    const [taskType, setTaskType] = useState('');

    const [view, setView] = useState(false);

    const mapStore = (rootStore: RootStoreModel) => ({ samplingDraft: rootStore.samplingModel, myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel })
    const { samplingDraft, myTasksDraft, establishmentDraft } = useInject(mapStore);

    let dropdownRef = useRef(null);
    let dropdownRef1 = useRef(null);
    let dropdownRef2 = useRef(null);
    let dropdownRef3 = useRef(null);
    let dropdownRef4 = useRef(null);
    let dropdownRef5 = useRef(null);

    const isFocused = useIsFocused();

    const remainingQuantityArr = [
        { type: 'Detained', value: 'Detained' },
        { type: 'Not Detained', value: 'Not Detained' },
    ]

    useEffect(() => {

        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setSerialNumber(props.route ? props.route.params ? props.route.params.serialNumber : props.route.params.serialNumber : 0);

        let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        let taskType = objct['0'] ? objct['0'].TaskType : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : '';

        console.log('taskType :::: ' + JSON.stringify(taskType));

        setTaskType(taskType);

        if (props.route.params && props.route.params.serialNumber) {
            let getType = typeof (props.route.params && props.route.params.serialNumber);
            let viewOnly = (props.route.params && props.route.params.viewOnly);
            if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                setView(true);
            } else {
                setView(viewOnly);
            }

            if (getType == 'string') {
                samplingDraft.setSerialNumber(props.route.params.serialNumber);
            }
            else {
                samplingDraft.setSerialNumber(props.route && props.route.params ? ''.concat(props.route.params && props.route.params.serialNumber) : '0');
            }
        }

        if (props.route.params && props.route.params.view) {
            if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                setView(true);
            } else {
                setView(props.route.params.view);
            }
        }
        // //console.log("SerialNO:" + samplingDraft.serialNumber)
        setInspectionDetails(inspectionDetails);

        const title = props.route ? props.route.params ? props.route.params.title : {} : {};
        setTitle(title);

        let packageArrData = []
        let countryData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'COUNTRY'), countryArr = [];
        let packageArr = RealmController.getLovDataByKey(realm, LOVSchema.name, 'FINCORP_DEAL_APPROVAL_AUTH'), remainingQuantityArrData: any = [];
        let reasonData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_CONDEMNATION_REASON'), reasonsArr = [];
        let unitData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'WEB_COLLAB_TYPE'), unitArr = [];

        debugger
        for (let indexunit = 0; indexunit < unitData.length; indexunit++) {
            const element = unitData[indexunit];
            unitArr.push({ type: element.Value, value: element.Value })
        }
        setUnit(unitArr);

        for (let indexPlaces = 0; indexPlaces < countryData.length; indexPlaces++) {
            const element = countryData[indexPlaces];
            countryArr.push({ type: element.Value, value: element.Value })
        }
        for (let indexremainingQuantity = 0; indexremainingQuantity < packageArr.length; indexremainingQuantity++) {
            const element = packageArr[indexremainingQuantity];
            packageArrData.push({ type: element.Value, value: element.Value })
        }
        for (let indexreason = 0; indexreason < reasonData.length; indexreason++) {
            const element = reasonData[indexreason];
            reasonsArr.push({ type: element.Value, value: element.Value })
        }
        // for (let indexunit = 0; indexunit < unitData.length; indexunit++) {
        //     const element = unitData[indexunit];
        //     unitArr.push({ type: element.Value, value: element.Value })
        // }

        setCountry(countryArr);
        setPackageArr(packageArrData);
        // setUnit(unitArr);
        setReasonArr(reasonsArr);

        let alertObj = Object();
        if (myTasksDraft.isAlertApplicable) {
            alertObj = myTasksDraft.alertObject != '' ? JSON.parse(myTasksDraft.alertObject) : {}
            if (alertObj.ProductList && alertObj.ProductList.ProductAlert) {
                samplingDraft.setSampleName(alertObj.ProductList.ProductAlert[0].ProductName)
            }
        }
        return () => {
            if (taskType.toString().toLowerCase() != 'sampling') {
                samplingDraft.setClearData();
            }

        }

    }, [isFocused])

    const selectImage = async (item: any) => {

        let imageData: any = {};
        let options = {
            title: 'Select Image',
            noData: false,
            customButtons: [
                { name: 'Cancel', title: 'Cancel' },
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
                            samplingDraft.setAttachment1(JSON.stringify(imageData));
                        }
                        else {
                            imageData.image2 = response.fileName;
                            imageData.image2Base64 = response.data;
                            imageData.image2Uri = response.uri;
                            samplingDraft.setAttachment2(JSON.stringify(imageData));
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

                if (samplingDraft.attachment1 && samplingDraft.attachment1 != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            else {

                if (samplingDraft.attachment2 && samplingDraft.attachment2 != '') {
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

    const submit = () => {
        debugger;

        if (samplingDraft.sampleCollectionReason != '' && samplingDraft.sampleName != '' && samplingDraft.dateofSample != '' && samplingDraft.sampleState != '' &&
            samplingDraft.sampleTemperature != '' && samplingDraft.remainingQuantity != '' && samplingDraft.type != '' && samplingDraft.remarks != '' && samplingDraft.countryOfOrigin != '' && samplingDraft.unit != '' && samplingDraft.quantity != '' && samplingDraft.netWeight != '' && samplingDraft.package != '' && samplingDraft.batchNumber != '' && samplingDraft.brandName != '' && samplingDraft.productionDate != '' && samplingDraft.expiryDate != '') {


            let navigationScreenName = typeof (myTasksDraft.selectedTask) == 'string' ? JSON.parse(myTasksDraft.selectedTask) && JSON.parse(myTasksDraft.selectedTask).TaskType.toString().toLowerCase() == 'sampling' ? "StartInspectionCondenation" : 'Sampling' : 'Sampling';

            if (navigationScreenName == 'StartInspectionCondenation') {

                let samplingData = {
                    serialNumber: samplingDraft.serialNumber,
                    sampleCollectionReason: samplingDraft.sampleCollectionReason,
                    sampleName: samplingDraft.sampleName,
                    dateofSample: samplingDraft.dateofSample,
                    sampleState: samplingDraft.sampleState,
                    sampleTemperature: samplingDraft.sampleTemperature,
                    remainingQuantity: samplingDraft.remainingQuantity,
                    type: samplingDraft.type,
                    unit: samplingDraft.unit,
                    quantity: samplingDraft.quantity,
                    netWeight: samplingDraft.netWeight,
                    package: samplingDraft.package,
                    batchNumber: samplingDraft.batchNumber,
                    brandName: samplingDraft.brandName,
                    productionDate: samplingDraft.productionDate,
                    expiryDate: samplingDraft.expiryDate,
                    countryOfOrigin: samplingDraft.countryOfOrigin,
                    remarks: samplingDraft.remarks,
                    attachment1: samplingDraft.attachment1,
                    attachment2: samplingDraft.attachment2,
                }
                if (samplingDraft.samplingArray != '') {
                    let array = JSON.parse(samplingDraft.samplingArray);
                    let index = array.findIndex((x: any) => x.serialNumber === samplingData.serialNumber);
                    if (index == 0 || index > 0) {
                        array = [...array.slice(0, index), samplingData, ...array.slice(index + 1, array.length)]
                    }
                    else {
                        array.push(samplingData);
                    }
                    samplingDraft.setSamplingArray(JSON.stringify(array));
                    NavigationService.navigate(navigationScreenName);
                }
                else {
                    if (samplingData.sampleName) {
                        let array = [];
                        array.push(samplingData);
                        samplingDraft.setSamplingArray(JSON.stringify(array));
                        NavigationService.navigate(navigationScreenName);
                    }
                }
            }
            else {

                NavigationService.navigate(navigationScreenName, {

                    SamplingData: {
                        serialNumber: samplingDraft.serialNumber,
                        sampleCollectionReason: samplingDraft.sampleCollectionReason,
                        sampleName: samplingDraft.sampleName,
                        dateofSample: samplingDraft.dateofSample,
                        sampleState: samplingDraft.sampleState,
                        sampleTemperature: samplingDraft.sampleTemperature,
                        remainingQuantity: samplingDraft.remainingQuantity,
                        type: samplingDraft.type,
                        unit: samplingDraft.unit,
                        quantity: samplingDraft.quantity,
                        netWeight: samplingDraft.netWeight,
                        package: samplingDraft.package,
                        batchNumber: samplingDraft.batchNumber,
                        brandName: samplingDraft.brandName,
                        productionDate: samplingDraft.productionDate,
                        expiryDate: samplingDraft.expiryDate,
                        countryOfOrigin: samplingDraft.countryOfOrigin,
                        remarks: samplingDraft.remarks,
                        attachment1: samplingDraft.attachment1,
                        attachment2: samplingDraft.attachment2,
                    }
                })
            }
        }
        else {
            ToastAndroid.show('All fields are mandatory', 1000);
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
                                    JSON.parse(samplingDraft.attachment1).image1Uri
                                    : JSON.parse(samplingDraft.attachment2).image2Uri
                            }
                            base64One={
                                (attachmentClick == 'one') ?
                                    JSON.parse(samplingDraft.attachment1).image1Base64
                                    : JSON.parse(samplingDraft.attachment2).image2Base64
                            }
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                            attachmentClick={attachmentClick}
                            fromScreen={'sampling'}
                        />
                        :
                        null
                }

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

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].samplingForm.title}</Text>

                </View>

                <View style={{ flex: 0.2 }} />
                {/* 
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.2 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].samplingForm.title}</Text>
                        </View>

                        <View style={{ flex: 0.2 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View> */}


                <View style={{ flex: 5.4, width: '80%', alignSelf: 'center' }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    value={samplingDraft.serialNumber}
                                    onChange={(val: string) => {
                                        samplingDraft.setSerialNumber(val);
                                    }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleCollectionReason)} </Text>
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
                                            value={samplingDraft.sampleCollectionReason}
                                            onChangeText={(val: string) => {
                                                samplingDraft.setSampleCollectionReason(val);
                                            }}
                                            disabled={view}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={reasonArr}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={samplingDraft.sampleName}
                                    onChange={(val: string) => {
                                        samplingDraft.setSampleName(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleDateCollectionName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <DateComponent disabled={view} value={samplingDraft.dateofSample} updateDate={(val: any) => samplingDraft.setDateofSample(val)} />

                                {/* <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={samplingDraft.dateofSample}
                                    onChange={(val: string) => {
                                        samplingDraft.setDateofSample(val);
                                    }}
                                /> */}
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleStatusCollected)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={samplingDraft.sampleState}
                                    onChange={(val: string) => {
                                        samplingDraft.setSampleState(val)
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleTemp)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType='number-pad'
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            samplingDraft.setSampleTemperature(val);                                            
                                        }
                                        else if (validateNumber(val)) {
                                            samplingDraft.setSampleTemperature(val);                                            
                                        }
                                    }}
                                    value={samplingDraft.sampleTemperature}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.remainingQuantities)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? undefined : () => {
                                        dropdownRef1 && dropdownRef1.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef1}
                                            value={samplingDraft.remainingQuantity}
                                            onChangeText={(val: string) => {
                                                samplingDraft.setRemainingQuantity(val);
                                            }}
                                            disabled={view}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={remainingQuantityArr}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val: string) => {
                                        samplingDraft.setType(val);
                                    }}
                                    value={samplingDraft.type}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.unit)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? undefined : () => {
                                        dropdownRef2 && dropdownRef2.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef2}
                                            value={samplingDraft.unit}
                                            onChangeText={(val: string) => {
                                                samplingDraft.setUnit(val);
                                            }}
                                            disabled={view}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.quantity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType='number-pad'
                                    value={samplingDraft.quantity}
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            samplingDraft.setquantity(val);
                                        }
                                        else if (validateNumber(val)) {
                                            samplingDraft.setquantity(val);
                                        }
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.netWeight)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType='number-pad'
                                    value={samplingDraft.netWeight}
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            samplingDraft.setnetWeight(val);
                                        }
                                        else if (validateNumber(val)) {
                                            samplingDraft.setnetWeight(val);
                                        }

                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.package)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? undefined : () => {
                                        dropdownRef && dropdownRef.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef}
                                            value={samplingDraft.package}
                                            onChangeText={(val: string) => {
                                                samplingDraft.setpackage(val);
                                            }}
                                            disabled={view}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.batchNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    // keyboardType='number-pad'
                                    value={samplingDraft.batchNumber}
                                    onChange={(val: string) => {
                                        // if (val == '') {
                                        //     samplingDraft.setbatchNumber(val);
                                        // }
                                        // else if (validateNumber(val)) {
                                            samplingDraft.setbatchNumber(val);
                                        // }
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.brandName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={samplingDraft.brandName}
                                    onChange={(val: string) => {
                                        samplingDraft.setbrandName(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.productionDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <DateComponent disabled={view} value={samplingDraft.productionDate} updateDate={(val: any) => samplingDraft.setproductionDate(val)} />

                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.expiryDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <DateComponent disabled={view || samplingDraft.productionDate == ''} minimumDate={new Date(samplingDraft.productionDate)} value={samplingDraft.expiryDate} updateDate={(val: any) => samplingDraft.setExpiryDate(val)} />

                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.countryOrigin)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>

                                <TouchableOpacity
                                    disabled={view ? true : false}
                                    onPress={view ? undefined : () => {
                                        dropdownRef5 && dropdownRef5.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef5}
                                            value={samplingDraft.countryOfOrigin}
                                            onChangeText={(val: string) => {
                                                samplingDraft.setCountryOfOrigin(val);
                                            }}
                                            disabled={view}
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
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    onChange={(val: string) => { samplingDraft.setremarks(val) }}
                                    value={samplingDraft.remarks}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 2, height: HEIGHT * 0.08, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].samplingForm.attachments)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 0.7 }} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('one')
                                        callToAttachment('one');
                                    }}
                                    disabled={view}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={samplingDraft.attachment1 && samplingDraft.attachment1 != '' ? { uri: JSON.parse(samplingDraft.attachment1).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                                <View style={styles.space} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('two')
                                        callToAttachment('two');
                                    }}
                                    disabled={view}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={samplingDraft.attachment2 && samplingDraft.attachment2 != '' ? { uri: JSON.parse(samplingDraft.attachment2).image2Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                            </View>

                        </View>


                    </ScrollView>

                </View>

                <View style={{ flex: 0.22 }} />

                <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.2 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            taskType.toString().toLowerCase() == 'sampling' ? submit() : (view && view == true) ?
                                NavigationService.goBack() : submit()
                        }}
                        buttonText={(taskType.toString().toLowerCase() == 'sampling') ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.next : (view && view == true) ? Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok : Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                    />

                    <View style={{ flex: 0.5 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            NavigationService.navigate('Sampling')
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                    />

                    <View style={{ flex: 0.2 }} />

                </View>


                <View style={{ flex: 0.1 }} />


                <View style={{ flex: 1 }}>
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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(SamplingForm);

