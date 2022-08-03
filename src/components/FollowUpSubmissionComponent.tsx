import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, PermissionsAndroid, Platform, ToastAndroid, FlatList } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();
import ImagePicker from 'react-native-image-picker';
import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import Dropdown from './../components/dropdown';
import ButtonComponent from './ButtonComponent';
import Strings from '../config/strings';

import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import TaskSchema from '../database/TaskSchema';
import { useIsFocused } from '@react-navigation/native';

const FollowUpSubmissionComponent = (props: any) => {

    const context = useContext(Context);
    let dropdownRef1 = useRef();

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, licenseDraft: rootStore.licenseMyTaskModel })
    const { myTasksDraft, licenseDraft } = useInject(mapStore);
    const [isEmiratesIdValid, setIsEmiratesIdValid] = useState(false);
    const [isPhoneNumberIsValid, setIsPhoneNumberValid] = useState(false);
    const [isContactNameIsValid, setContactNameValid] = useState(false);
    const [isCheck, setIsCheck] = useState({
        thermometer: false,
        flashLight: false,
        uvLight: false,
        luxMeter: false,
        dataLogger: false
    });

    const [documentArray, setDocumentArray] = useState([{ imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.thermometer, code: 'thermometer', thermoCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.flashLight, code: 'flashLight', flashCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.uvLight, code: 'uvLight', uvCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.luxMeter, code: 'luxMeter', luxCheck: false },
    { imageCheck: require('./../assets/images/startInspection/documentation/check.png'), image: require('./../assets/images/startInspection/documentation/unCheck.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.dataLogger, code: 'dataLogger', dataCheck: false },
    {}
    ])

    useEffect(() => {
        let taskData = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
        if (taskData && taskData['0']) {

            let dataLoggerCBValue = taskData['0'].mappingData ? JSON.parse(taskData['0'].mappingData)['0'] && JSON.parse(taskData['0'].mappingData)['0'].dataLoggerCBValue ? JSON.parse(taskData['0'].mappingData)['0'].dataLoggerCBValue : false : false;
            let flashlightCBValue = taskData['0'].mappingData ? JSON.parse(taskData['0'].mappingData)['0'] && JSON.parse(taskData['0'].mappingData)['0'].flashlightCBValue ? JSON.parse(taskData['0'].mappingData)['0'].flashlightCBValue : false : false;
            let luxmeterCBValue = taskData['0'].mappingData ? JSON.parse(taskData['0'].mappingData)['0'] && JSON.parse(taskData['0'].mappingData)['0'].luxmeterCBValue ? JSON.parse(taskData['0'].mappingData)['0'].luxmeterCBValue : false : false;
            let thermometerCBValue = taskData['0'].mappingData ? JSON.parse(taskData['0'].mappingData)['0'] && JSON.parse(taskData['0'].mappingData)['0'].thermometerCBValue ? JSON.parse(taskData['0'].mappingData)['0'].thermometerCBValue : false : false;
            let UVlightCBValue = taskData['0'].mappingData ? JSON.parse(taskData['0'].mappingData)['0'] && JSON.parse(taskData['0'].mappingData)['0'].UVlightCBValue ? JSON.parse(taskData['0'].mappingData)['0'].UVlightCBValue : false : false;

            // alert(dataLoggerCBValue + "," + flashlightCBValue + "," + luxmeterCBValue + "," + thermometerCBValue + "," + UVlightCBValue)
            myTasksDraft.setFlashlightValue(flashlightCBValue);
            myTasksDraft.setDataLoggerCBValue(dataLoggerCBValue);
            myTasksDraft.setLuxmeterCBValue(luxmeterCBValue);
            myTasksDraft.setThermometerCBValue(thermometerCBValue);
            myTasksDraft.setUVlightCBValue(UVlightCBValue);

            for (let index = 0; index < documentArray.length; index++) {
                const element = documentArray[index];
                if (element.code == 'thermometer') {
                    element.thermoCheck = thermometerCBValue
                }
                else if (element.code == 'flashLight') {
                    element.flashCheck = flashlightCBValue;
                }
                else if (element.code == 'luxMeter') {
                    element.luxCheck = luxmeterCBValue;
                }
                else if (element.code == 'uvLight') {
                    element.uvCheck = UVlightCBValue;
                }
                else if (element.code == 'dataLogger') {
                    element.dataCheck = dataLoggerCBValue;
                }
                documentArray[index] = element
            }

            setDocumentArray(documentArray);
            // alert(JSON.stringify(documentArray));
        }
    }, [])

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
                ).then((result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Smart control App',
                    message: 'You want to use the camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    selectImage(item);
                } else {
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const selectImage = (item: any) => {
        let options = {
            title: 'Select Image',
            noData: false,
            saveToPhotos: true,
            customButtons: [
                { name: 'Test', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        try {
            ImagePicker.launchCamera(options, async (response) => {
                if (response.didCancel) {
                    // //console.log('User cancelled image picker');
                } else if (response.error) {
                    // //console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    // //console.log('User tapped custom button: ', response.customButton);
                } else {
                    // // //console.log('ImageResponse: ', response);
                    debugger;
                    if (response.fileSize) {
                        if (item == 'evidance1') {
                            myTasksDraft.setEvidanceAttachment1(response.data)
                            myTasksDraft.setEvidanceAttachment1Url(response.uri)
                        }
                        else if (item == 'evidance2') {
                            myTasksDraft.setEvidanceAttachment2(response.data)
                            myTasksDraft.setEvidanceAttachment2Url(response.uri)
                        }
                        else if (item == 'licence1') {
                            myTasksDraft.setLicencesAttachment1(response.data)
                            myTasksDraft.setLicencesAttachment1Url(response.uri)
                        }
                        else if (item == 'licence2') {
                            myTasksDraft.setLicencesAttachment2(response.data)
                            myTasksDraft.setLicencesAttachment2Url(response.uri)
                        }
                        else if (item == 'emiratesId1') {
                            myTasksDraft.setEmiratesIdAttachment1(response.data)
                            myTasksDraft.setEmiratesIdAttachment1Url(response.uri)
                        }
                        else if (item == 'emiratesId2') {
                            myTasksDraft.setEmiratesIdAttachment2(response.data)
                            myTasksDraft.setEmiratesIdAttachment2Url(response.uri)
                        }
                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            debugger
            // alert((error))

        }
    }

    const validateEmiratesId = (str) => {

        let isErrorInEmirateId = false;
        str = str.trim().replace(/-/g, '');
        let emirateId = str;
        if (str && str.trim()) {
            if (str.length !== 15) {
                isErrorInEmirateId = true;
            }
            else {
                let chars = emirateId.split('');
                let numberMultiSum = 0;
                let remainingDigitSum = 0;
                for (let i = 1; i < chars.length; i += 2) {
                    let num = (parseInt(chars[i]) * 2).toString();
                    if (parseInt(num) > 9) {
                        let char1 = num.split('');
                        let tempSum = 0;
                        for (let j = 0; j < char1.length; j++) {
                            tempSum = tempSum + parseInt(char1[j]);
                        }
                        numberMultiSum = numberMultiSum + tempSum;
                    } else {
                        numberMultiSum = numberMultiSum + parseInt(num);
                    }
                }
                // System.out.println();
                for (let i = chars.length - 3; i >= 0; i -= 2) {
                    remainingDigitSum = remainingDigitSum + parseInt(chars[i]);
                }
                let totalSum = numberMultiSum + remainingDigitSum;
                let nextHighestNumber = 0;
                if (totalSum % 10 == 0) {
                    nextHighestNumber = totalSum;
                } else {
                    let tt = 10 - totalSum % 10;
                    nextHighestNumber = totalSum + tt;
                }
                try {
                    if ((nextHighestNumber - totalSum) === parseInt(chars[chars.length - 1])) {
                        isErrorInEmirateId = false;
                    }
                    else {
                        isErrorInEmirateId = true;
                    }
                }
                catch (e) {
                    //console.log("error e :", e);
                }
            }
        }
        else {
            isErrorInEmirateId = false;
        }
        return isErrorInEmirateId;
    }

    const validatePhone = (contactNumber: any) => {
        let isErrorInPhoneNumber = false;

        if (!contactNumber) {
            isErrorInPhoneNumber = true;
            return isErrorInPhoneNumber;
        }
        let contactNumberLen = contactNumber.length;
        if (contactNumberLen < 9 || contactNumberLen > 13) {
            isErrorInPhoneNumber = true;
            return isErrorInPhoneNumber;
        }
        else {
            isErrorInPhoneNumber = false;
            return isErrorInPhoneNumber
        }
    }

    const validateUsername = (str: string) => {
        debugger;
        let isErrorInUserName: any = false;
        if (str === '') {
            return true;
        }
        if (str && str.trim()) {
            debugger;
            let regex = new RegExp('^([a-zA-Z]).{0,30}$', 'g');
            if (!regex.test(str)) {
                isErrorInUserName = true;
            }
        }
        else {
            isErrorInUserName = true;
        }
        return isErrorInUserName;
    }

    const renderData = (item: any, index: number) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);

                    let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
                    // alert(JSON.stringify(inspection.mappingData))
                    let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
                    inspectionDetails.mappingData = mappingData;

                    if (item.code == 'flashLight') {
                        documentArray[index].flashCheck = !documentArray[index].flashCheck;
                        inspectionDetails.mappingData['0'].flashlightCBValue = documentArray[index].flashCheck;
                        myTasksDraft.setFlashlightValue(documentArray[index].flashCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'luxMeter') {
                        documentArray[index].luxCheck = !documentArray[index].luxCheck;
                        inspectionDetails.mappingData['0'].luxmeterCBValue = documentArray[index].luxCheck;
                        myTasksDraft.setLuxmeterCBValue(documentArray[index].luxCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'uvLight') {
                        documentArray[index].uvCheck = !documentArray[index].uvCheck;
                        inspectionDetails.mappingData['0'].UVlightCBValue = documentArray[index].uvCheck;
                        myTasksDraft.setUVlightCBValue(documentArray[index].uvCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'dataLogger') {
                        documentArray[index].dataCheck = !documentArray[index].dataCheck;
                        inspectionDetails.mappingData['0'].dataLoggerCBValue = documentArray[index].dataCheck;
                        myTasksDraft.setDataLoggerCBValue(documentArray[index].dataCheck);
                        setDocumentArray(documentArray);
                    }
                    else if (item.code == 'thermometer') {
                        documentArray[index].thermoCheck = !documentArray[index].thermoCheck;
                        inspectionDetails.mappingData['0'].thermometerCBValue = documentArray[index].thermoCheck;
                        myTasksDraft.setThermometerCBValue(documentArray[index].thermoCheck);
                        setDocumentArray(documentArray);
                    }

                    RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                        // ToastAndroid.show('Task updated successfully ', 1000);
                    });
                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    width: '100%', borderColor: 'transparent', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }}>

                <View style={{ flex: 0.8, width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={[styles.text, { fontSize: 12, textAlign: 'right', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

                <View style={{ flex: 0.01 }} />

                <View style={{ flex: 0.2, width: '100%', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        resizeMode={'contain'}
                        source={(item.thermoCheck == true || item.flashCheck == true || item.dataCheck == true || item.luxCheck == true || item.uvCheck == true) ? item.imageCheck : item.image} />
                </View>

            </TouchableOpacity>

        )
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>


            <View style={{ flex: 1, justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 3 }}>

                <FlatList
                    // nestedScrollEnabled={false}
                    data={documentArray}
                    contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                    columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                    initialNumToRender={5}
                    renderItem={({ item, index }) => {
                        return (
                            renderData(item, index)
                        )
                    }}
                    ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.03, width: WIDTH * 0.03 }} />)}
                    numColumns={3}
                />

            </View>

            <View style={styles.space} />

            <View style={{ flex: 2.5, justifyContent: 'center' }}>

                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.contactName} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.TextInputContainer}>

                        <TextInputComponent
                            placeholder={''}
                            maxLength={30}
                            style={{
                                height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            value={myTasksDraft.contactName}
                            onChange={(val: string) => {
                                if (!validateUsername(val)) {
                                    setContactNameValid(false);
                                }
                                else {
                                    setContactNameValid(true);
                                }
                                myTasksDraft.setContactName(val);
                            }}
                        />

                    </View>
                    {
                        isContactNameIsValid ?
                            <Text style={{ fontSize: 12, color: 'red' }}>{'Please enter valid Contact Name'}</Text>
                            : null
                    }
                </View>

                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.mobileNumber} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.TextInputContainer}>
                        <View
                            style={{
                                height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }} >
                            <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>

                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    maxLength={12}
                                    keyboardType={'number-pad'}
                                    value={myTasksDraft.mobileNumber}
                                    onChange={(val: string) => {
                                        if (!validatePhone(val)) {
                                            setIsPhoneNumberValid(false);
                                        }
                                        else {
                                            setIsPhoneNumberValid(true);
                                        }
                                        myTasksDraft.setMobileNumber(val);
                                    }}
                                />
                            </View>
                        </View>
                        {
                            isPhoneNumberIsValid ?
                                <Text style={{ fontSize: 12, color: 'red' }}>{'Please enter valid Contact Number'}</Text>
                                : null
                        }
                    </View>

                </View>

                <View style={styles.space} />

                <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>

                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text>

                    </View>

                    <View style={styles.space} />

                    <View style={styles.TextInputContainer}>
                        <View
                            style={{
                                height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }} >
                            <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>

                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    keyboardType={'number-pad'}
                                    maxLength={15}
                                    value={myTasksDraft.emiratesId}
                                    onChange={(val: string) => {
                                        // alert(validateEmiratesId(val));
                                        if (!validateEmiratesId(val)) {
                                            setIsEmiratesIdValid(false);
                                        }
                                        else {
                                            setIsEmiratesIdValid(true);
                                        }
                                        myTasksDraft.setEmiratesId(val);

                                    }}
                                />
                            </View>
                        </View>
                        {
                            isEmiratesIdValid ?
                                <Text style={{ fontSize: 12, color: 'red' }}>{'Please enter valid Emirates Id'}</Text>
                                : null
                        }
                    </View>

                </View>

            </View>

            <View style={{ flex: .2 }} />

            <View style={{ flex: 2.5, justifyContent: 'center' }}>

                <View style={{ flex: 1, height: 60, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.evidence} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('evidance1')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.evidanceAttachment1Url != '' ?
                                    { uri: myTasksDraft.evidanceAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 32, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.evidanceAttachment1Url != '' ? "stretch" : "contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.8 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('evidance2')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.evidanceAttachment2Url != '' ?
                                    { uri: myTasksDraft.evidanceAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.evidanceAttachment2Url != '' ? "stretch" : "contain"} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: .4 }} />

                <View style={{ flex: 1, height: 60, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.license} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('licence1')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.licencesAttachment1Url != '' ?
                                    { uri: myTasksDraft.licencesAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.licencesAttachment1Url != '' ? "stretch" : "contain"} />

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 0.8 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('licence2')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.licencesAttachment2Url != '' ?
                                    { uri: myTasksDraft.licencesAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.licencesAttachment2Url != '' ? "stretch" : "contain"} />
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: .4 }} />


                <View style={{ flex: 1, height: 60, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 2.5, width: '100%', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                        <View style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#5c666f', borderRadius: 8, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ color: 'white', fontSize: 11, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.emiratesId} </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: props.isArabic ? 'flex-start' : 'flex-end' }}>
                                <Image
                                    source={require("./../assets/images/startInspection/White/Attach_Icon_24x24.png")}
                                    style={{ height: 16, width: 16, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                    resizeMode={"contain"} />
                            </View>
                            <View style={{ flex: 0.2 }} />
                        </View>

                    </View>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('emiratesId1')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.EmiratesIdAttachment1Url != '' ?
                                    { uri: myTasksDraft.EmiratesIdAttachment1Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.EmiratesIdAttachment1Url != '' ? "stretch" : "contain"} />

                        </TouchableOpacity>

                    </View>
                    <View style={{ flex: 0.8 }} />

                    <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={() => {
                                attachedImageToAlertImageView('emiratesId2')
                            }}
                            style={{
                                flex: 1, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, padding: 5, borderRadius: 8
                            }}>

                            <Image
                                source={myTasksDraft.EmiratesIdAttachment2Url != '' ?
                                    { uri: myTasksDraft.EmiratesIdAttachment2Url } : require("./../assets/images/condemnation/attachmentImg.png")}
                                style={{ height: 35, width: WIDTH * 0.2, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={myTasksDraft.EmiratesIdAttachment2Url != '' ? "stretch" : "contain"} />

                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 0.3 }} />
                </View>

            </View>

            <View style={{ flex: .2 }} />

            <View style={{ flex: 0.8, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                {/* <View style={{ flex: 0.2 }} /> */}
              
                    <ButtonComponent
                        style={{
                            height: '80%', width: '40%', backgroundColor: fontColor.ButtonBoxColor,
                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center'
                        }}
                        disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                        buttonClick={() => {
                            props.submitButtonPress();
                            // ToastAndroid.show(Strings[context.isArabic?'ar':'en'].startInspection.checklistSubmittedSuccessfully, 1000);
                        }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                    />
              
                {/* <View style={{ flex: 0.1 }} /> */}

                {/* <ButtonComponent
                    style={{
                        height: '40%', width: '35%', backgroundColor: fontColor.ButtonBoxColor,
                        alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}

                    buttonClick={() => {
                        myTasksDraft.setCount('1');
                    }}
                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                /> */}

                {/* <View style={{ flex: 0.2 }} /> */}

            </View>



        </View>
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
    commentTextContainer: {
        flex: 0.2,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
});


export default observer(FollowUpSubmissionComponent);
