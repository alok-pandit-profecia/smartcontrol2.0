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
// import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"
import { RealmController } from '../database/RealmController';
import LOVSchema from '../database/LOVSchema';
import AlertComponentForAttachment from './../components/AlertComponentForAttachment';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers;

let realm = RealmController.getRealmInstance();
import RNFetchBlob from 'rn-fetch-blob';
import TaskSchema from '../database/TaskSchema';
import { useIsFocused } from '@react-navigation/core';

const Condemnation = (props: any) => {

    const context = useContext(Context);
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [unit, setUnit] = useState(Array());
    const [packageArr, setPackageArr] = useState(Array());
    const [places, setPlaces] = useState(Array());
    const [reason, setReason] = useState(Array());
    const [serialNumber, setSerialNumber] = useState(0);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [view, setView] = useState(false);
    const [attachmentClick, setAttachmentClick] = useState('one');
    const [title, setTitle] = useState('');
    const [taskType, setTaskType] = useState('');

    const mapStore = (rootStore: RootStoreModel) => ({ condemnationDraft: rootStore.condemnationModel, establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel })
    const { condemnationDraft, establishmentDraft, myTasksDraft } = useInject(mapStore);

    let dropdownRef = useRef(null);
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
                condemnationDraft.setProductName(alertObj.ProductList.ProductAlert[0].ProductName)
            }
        }
    }, [isFocused])

    useEffect(() => {

        const inspectionDetails = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        setSerialNumber(props.route ? props.route.params ? props.route.params.serialNumber : props.route.params.serialNumber : 0);


        let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        let taskType = objct['0'] ? objct['0'].TaskType : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : '';
        // console.log('taskType :::: ' + JSON.stringify(taskType));
        setTaskType(taskType);

        if (props.route.params && props.route.params.serialNumber) {
            let getType = typeof (props.route.params.serialNumber);
            if (getType == 'string') {
                condemnationDraft.setSerialNumber(props.route.params.serialNumber);
            }
            else {
                condemnationDraft.setSerialNumber(props.route && props.route.params ? ''.concat(props.route.params && props.route.params.serialNumber) : '0');
            }
        }

        if (props.route.params && props.route.params.view) {
            if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                setView(true);
            } else {
                setView(props.route.params.view);
            }
        }

        if (props.route.params && props.route.params.title) {
            setTitle(props.route.params.title);
        }
        // //console.log("SerialNO:" + condemnationDraft.serialNumber)
        debugger;
        setInspectionDetails(inspectionDetails);

        let placesData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_CONDEMNATION_PLACE'), placesArr = [];
        let packageData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'FINCORP_DEAL_APPROVAL_AUTH'), packageArrData = [];
        let reasonData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_CONDEMNATION_REASON'), reasonsArr = [];
        // let productNameData = RealmController.getLovDataByKey(realm,LOVSchema.name,'ADFCA_CONDEMNATION_PLACE');
        let unitData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'WEB_COLLAB_TYPE'), unitArr = [];

        for (let indexPlaces = 0; indexPlaces < placesData.length; indexPlaces++) {
            const element = placesData[indexPlaces];
            placesArr.push({ type: element.Value, value: element.Value })
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

        setPlaces(placesArr);
        setPackageArr(packageArrData);
        setUnit(unitArr);
        setReason(reasonsArr);

        return () => {
            if (taskType.toString().toLowerCase() != 'condemnation') {
                condemnationDraft.setClearData();
            }
        }

    }, [])

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
                            condemnationDraft.setAttachment1(JSON.stringify(imageData));
                        }
                        else {
                            imageData.image2 = response.fileName;
                            imageData.image2Base64 = response.data;
                            imageData.image2Uri = response.uri;
                            condemnationDraft.setAttachment2(JSON.stringify(imageData));
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

                if (condemnationDraft.attachment1 && condemnationDraft.attachment1 != '') {
                    setShowAttachmentAlert(true);
                }
                else {
                    attachmentAlert(item);
                }

            }
            else {

                if (condemnationDraft.attachment2 && condemnationDraft.attachment2 != '') {
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

        if (condemnationDraft.productName != '' && condemnationDraft.unit != '' && condemnationDraft.quantity != '' && condemnationDraft.netWeight != '' &&
            condemnationDraft.package != '' && condemnationDraft.batchNumber != '' && condemnationDraft.brandName != '' && condemnationDraft.remarks != '' && condemnationDraft.place != '' && condemnationDraft.reason) {

            let navigationScreenName = typeof (myTasksDraft.selectedTask) == 'string' ? JSON.parse(myTasksDraft.selectedTask) && JSON.parse(myTasksDraft.selectedTask).TaskType.toString().toLowerCase() == 'condemnation' ? "StartInspectionCondenation" : 'Condemnation' : 'Condemnation';

            if (navigationScreenName == 'StartInspectionCondenation') {

                let condemnationData = {
                    serialNumber: condemnationDraft.serialNumber,
                    productName: condemnationDraft.productName,
                    unit: condemnationDraft.unit,
                    quantity: condemnationDraft.quantity,
                    netWeight: condemnationDraft.netWeight,
                    package: condemnationDraft.package,
                    batchNumber: condemnationDraft.batchNumber,
                    brandName: condemnationDraft.brandName,
                    remarks: condemnationDraft.remarks,
                    place: condemnationDraft.place,
                    reason: condemnationDraft.reason,
                    attachment1: condemnationDraft.attachment1,
                    attachment2: condemnationDraft.attachment2
                }
                console.log('condemnationData  in if::' + JSON.stringify(condemnationDraft.condemnationArray));

                if (condemnationDraft.condemnationArray != '') {

                    let array = JSON.parse(condemnationDraft.condemnationArray);
                    let index = array.findIndex((x: any) => x.serialNumber === condemnationData.serialNumber);
                    debugger
                    if (index == 0 || index > 0) {
                        array = [...array.slice(0, index), condemnationData, ...array.slice(index + 1, array.length)]
                        debugger
                        condemnationDraft.setCondemnationArray(JSON.stringify(array));

                    }
                    else {
                        console.log('condemnationData ::' + JSON.stringify(array));
                        array.push(condemnationData);
                        console.log('condemnationData  array after push::' + JSON.stringify(array));
                        debugger;
                    }
                    condemnationDraft.setCondemnationArray(JSON.stringify(array));
                    NavigationService.navigate(navigationScreenName)
                }
                else {

                    debugger
                    // if (condemnationData.productName) {
                    let array = [];
                    array.push(condemnationData);
                    condemnationDraft.setCondemnationArray(JSON.stringify(array));
                    console.log('condemnationData  in if::' + navigationScreenName + ':::' + JSON.stringify(array));

                    NavigationService.navigate(navigationScreenName)

                    // }
                }

            }
            else {

                NavigationService.navigate(navigationScreenName, {
                    condemnationData: {
                        serialNumber: condemnationDraft.serialNumber,
                        productName: condemnationDraft.productName,
                        unit: condemnationDraft.unit,
                        quantity: condemnationDraft.quantity,
                        netWeight: condemnationDraft.netWeight,
                        package: condemnationDraft.package,
                        batchNumber: condemnationDraft.batchNumber,
                        brandName: condemnationDraft.brandName,
                        remarks: condemnationDraft.remarks,
                        place: condemnationDraft.place,
                        reason: condemnationDraft.reason,
                        attachment1: condemnationDraft.attachment1,
                        attachment2: condemnationDraft.attachment2
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
                                    JSON.parse(condemnationDraft.attachment1).image1Uri
                                    : JSON.parse(condemnationDraft.attachment2).image2Uri
                            }
                            base64One={
                                (attachmentClick == 'one') ?
                                    JSON.parse(condemnationDraft.attachment1).image1Base64
                                    : JSON.parse(condemnationDraft.attachment2).image2Base64
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


                {/* <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{'0123432'}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text>
                    </View>

                    <View style={{ flex: 0.8 }} />

                </View> */}
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
                                <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuOptions>

                        </Menu>

                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, backgroundColor: '#abcfbe', flexDirection: 'row', width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.title}</Text>

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
                                    editable={false}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    maxLength={27}
                                    value={condemnationDraft.serialNumber}
                                    // value={condemnationDraft.serialNumber}
                                    onChange={(val: string) => {
                                        // condemnationDraft.setSerialNumber(val);
                                    }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.productName)} </Text>
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
                                    value={condemnationDraft.productName}
                                    maxLength={27}
                                    onChange={(val: string) => {
                                        condemnationDraft.setProductName(val);
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
                                    onPress={() => {
                                        view ? null :
                                            dropdownRef4 && dropdownRef4.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}>
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            value={condemnationDraft.unit}
                                            onChangeText={(val: string) => {
                                                condemnationDraft.setUnit(val);
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            disabled={view ? true : false}
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
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    maxLength={27}
                                    keyboardType='number-pad'
                                    value={condemnationDraft.quantity}
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            condemnationDraft.setQuantity(val);
                                        }
                                        else if (validateNumber(val)) {
                                            condemnationDraft.setQuantity(val);
                                        }
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.netWeight)} </Text>
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
                                    maxLength={27}
                                    keyboardType='number-pad'
                                    value={condemnationDraft.netWeight}
                                    onChange={(val: string) => {
                                        if (val == '') {
                                            condemnationDraft.setNeWeight(val)
                                        }
                                        else if (validateNumber(val)) {
                                            condemnationDraft.setNeWeight(val)
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
                                    }}>

                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>

                                        <Dropdown
                                            ref={view ? null : dropdownRef1}
                                            value={condemnationDraft.package}
                                            onChangeText={(val: string) => {
                                                condemnationDraft.setPackage(val);
                                            }}
                                            disabled={view ? true : false}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
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
                                    placeholder={''}
                                    editable={view ? false : true}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    maxLength={27}
                                    // keyboardType='number-pad'
                                    onChange={(val: string) => {
                                        condemnationDraft.setBatchNumber(val);
                                    }}
                                    value={condemnationDraft.batchNumber}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.brandName)} </Text>
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
                                    maxLength={27}
                                    onChange={(val: string) => {
                                        condemnationDraft.setBrandName(val);
                                    }}
                                    value={condemnationDraft.brandName}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.remarks)}</Text>
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
                                    onChange={(val: string) => { condemnationDraft.setremarks(val) }}
                                    value={condemnationDraft.remarks}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.place)} </Text>
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
                                            value={condemnationDraft.place}
                                            onChangeText={(val: string) => { condemnationDraft.setPlace(val); }}
                                            disabled={view ? true : false}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={places}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.reason)} </Text>
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
                                            value={condemnationDraft.reason}
                                            onChangeText={(val: string) => { condemnationDraft.setReason(val) }}
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
                                        callToAttachment('one');
                                    }}
                                    disabled={view ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={condemnationDraft.attachment1 && condemnationDraft.attachment1 != '' ? { uri: JSON.parse(condemnationDraft.attachment1).image1Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
                                        style={{ height: 40, width: 40 }}
                                        resizeMode={"contain"} />

                                </TouchableOpacity>

                                <View style={styles.space} />

                                <TouchableOpacity
                                    onPress={() => {
                                        setAttachmentClick('two');
                                        callToAttachment('two');
                                    }}
                                    disabled={view ? true : false}
                                    style={{
                                        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 12, borderRadius: 8
                                    }}>

                                    <Image
                                        source={condemnationDraft.attachment2 && condemnationDraft.attachment2 != '' ? { uri: JSON.parse(condemnationDraft.attachment2).image2Uri } : require("./../assets/images/condemnation/attachmentImg.png")}
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
                            // taskType.toString().toLowerCase() == 'condemnation' ? submit() : (view && view == true) ?
                            // NavigationService.goBack() 
                            // : 
                            submit()
                        }}
                        buttonText={(taskType.toString().toLowerCase() == 'condemnation') ? Strings[context.isArabic ? 'ar' : 'en'].startInspection.next : (view && view == true) ? Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok : Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                    />

                    <View style={{ flex: 0.5 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            NavigationService.navigate('Condemnation')
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

export default observer(Condemnation);

