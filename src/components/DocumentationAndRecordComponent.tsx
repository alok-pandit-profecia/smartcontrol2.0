import React, { createRef, useContext, useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();

import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';
import NavigationService from '../services/NavigationService';
import TaskSchema from '../database/TaskSchema';
import CheckListSchema from '../database/CheckListSchema';

import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import ButtonComponent from './ButtonComponent';
import Strings from '../config/strings';
import SignatureCapture from 'react-native-signature-capture';
import condemnation from '../models/condemnation/condemnation';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const DocumentationAndRecordComponent = forwardRef((props: any, ref) => {

    const context = useContext(Context);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, efstDraft: rootStore.eftstModel, documantationDraft: rootStore.documentationAndReportModel, licenseDraft: rootStore.licenseMyTaskModel, bottomBarDraft: rootStore.bottomBarModel, samplingDraft: rootStore.samplingModel, condemnationDraft: rootStore.condemnationModel })
    const { myTasksDraft, documantationDraft, licenseDraft, condemnationDraft, bottomBarDraft, samplingDraft, efstDraft } = useInject(mapStore)
    const [taskId, setTaskId] = useState('');
    const [signbase64, setSignbase64] = useState('');
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const sign = createRef();
    let signData: string = '';

    useEffect(() => {

        let taskId = JSON.parse(myTasksDraft.selectedTask).TaskId;
        let inspectionDetails = JSON.parse(myTasksDraft.selectedTask);

        setInspectionDetails(inspectionDetails);
        setTaskId(taskId);
        documantationDraft.setTaskId(taskId);
        setSignbase64(documantationDraft.fileBuffer);

    }, []);

    useImperativeHandle(
        ref,
        () => ({

            saveSign() {
                if (myTasksDraft.isMyTaskClick == 'CompletedTask') {
                    let count = parseInt(myTasksDraft.count);

                    count = count + 1;
                    if (count <= 3 && count >= 1) {
                        myTasksDraft.setCount(count.toString())
                    }
                } else {
                    if (signbase64 == '') {
                        Alert.alert("", "Signature is mandatory")
                    }
                    else {
                        documantationDraft.setFileBuffer(signbase64);
                        let taskDetails = { ...inspectionDetails }
                        let mappingData = taskDetails.mappingData && typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData ? taskDetails.mappingData : [{}];
                        if (myTasksDraft.isMyTaskClick == 'campaign') {
                            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].signatureBase64 = signbase64;
                            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                            console.log(mappingData.length)
                            taskDetails.mappingData = mappingData;
                        }
                        else {
                            mappingData['0'].signatureBase64 = signbase64;
                        }

                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                            backButtonHandlerApp()
                        });
                        let count = parseInt(myTasksDraft.count);
                        count = count + 1;
                        if (count <= 3 && count >= 1) {
                            myTasksDraft.setCount(count.toString())
                        }
                    }
                }
            }

        })

    )

    const validateUsername = (str: string) => {
        debugger;
        let isErrorInUserName: any = false;
        if (str === '') {
            return true;
        }
        if (str && str.trim()) {
            debugger;
            let regex = new RegExp('^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z ]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_\. ]*$', 'g');
            // alert(regex.test(str))
            if (!regex.test(str)) {
                isErrorInUserName = true;
            }
        }
        else {
            isErrorInUserName = true;
        }
        return isErrorInUserName;
    }

    let saveImageFlag = false;

    const saveSign = () => {
        sign.current.saveImage();
        documantationDraft.setSaveImageFlag("true");
    };

    const resetSign = () => {
        setSignbase64('')
        if (documantationDraft.fileBuffer !== '') {
            documantationDraft.setFileBuffer('')
        }
        else {
            sign.current.resetImage();
        }
    };

    const onSaveEvent = (result: any) => {
        signData = result.encoded;
        setSignbase64(result.encoded)
        let taskDetails = { ...inspectionDetails }
        let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
        if (myTasksDraft.isMyTaskClick == 'campaign') {
            let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
            mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].signatureBase64 = signbase64;
            myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
            taskDetails.mappingData = mappingData;
        }
        else {
            mappingData[0].signatureBase64 = signbase64;

        }
        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
            backButtonHandlerApp()
        });
    };


    const onDragEvent = () => {
        saveSign()
    };

    /*  const saveSign = () => {
          sign.current.saveImage();
      }; */

    const documentArray = [
        { image: require('./../assets/images/startInspection/documentation/Condemnation.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.condemnation, code: 'condemnation', navigationScreenName: 'Condemnation' },
        { image: require('./../assets/images/startInspection/documentation/Sampling.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.sampling, code: 'sampling', navigationScreenName: 'Sampling' },
        { image: require('./../assets/images/startInspection/documentation/Detention.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.detention, code: 'detention', navigationScreenName: 'Detention' },
        { image: require('./../assets/images/startInspection/documentation/OnHold.png'), title: Strings[props.isArabic ? 'ar' : 'en'].establishmentDetails.efst, code: 'EFST', navigationScreenName: 'EFST' },
        // { image: require('./../assets/images/startInspection/documentation/Closure.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.requestforClosure, code: 'request', navigationScreenName: 'RequestForClouser' }
    ]

    const documentCasesArray = [
        { image: require('./../assets/images/startInspection/documentation/Condemnation.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.condemnation, code: 'condemnation', navigationScreenName: 'Condemnation' },
        { image: require('./../assets/images/startInspection/documentation/Sampling.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.sampling, code: 'sampling', navigationScreenName: 'Sampling' },
        { image: require('./../assets/images/startInspection/documentation/Detention.png'), title: Strings[props.isArabic ? 'ar' : 'en'].startInspection.detention, code: 'detention', navigationScreenName: 'Detention' },
        { image: require('./../assets/images/startInspection/documentation/OnHold.png'), title: Strings[props.isArabic ? 'ar' : 'en'].establishmentDetails.efst, code: 'EFST', navigationScreenName: 'EFST' }
    ]

    const renderData = (item: any, index: number) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (myTasksDraft.isAlertApplicable) {
                        let alertObject = myTasksDraft.alertObject != "" ? JSON.parse(myTasksDraft.alertObject) : [];
                        let taskDetails = myTasksDraft.selectedTask != "" ? JSON.parse(myTasksDraft.selectedTask) : {}

                        if (item.code == 'condemnation') {
                            // if ( (alertObject.Sampling == 'Y') && alertObject.samplingArr) {
                                NavigationService.navigate(item.navigationScreenName, { title: item.title })
                            // }
                            // else {
                                // Alert.alert("", Strings[props.isArabic ? 'ar' : 'en'].sampling.msgSamplingFirst)
                            // }
                        }
                        if (item.code == 'detention') {
                            
                            // if ((alertObject.Sampling == 'Y') && alertObject.samplingArr && (alertObject.Condemnation == 'Y') && alertObject.condemnationArr && !alertObject.condemnationArr.length) {
                            //     Alert.alert("", Strings[props.isArabic ? 'ar' : 'en'].sampling.msgSamplingDetentionFirst)
                            // }
                            // else if ((alertObject.Condemnation == 'Y') && alertObject.condemnationArr && !alertObject.condemnationArr.length) {
                            //     Alert.alert("", Strings[props.isArabic ? 'ar' : 'en'].sampling.msgCondemnationFirst)
                            // }
                            // else {
                                NavigationService.navigate(item.navigationScreenName)
                            // }
                        }
                        if (item.code == 'EFST') {
                            let licenseCode = inspectionDetails.LicenseCode;
                            // //console.log("licenseCode", licenseCode);
                            efstDraft.callToFetchEfstDataService(licenseCode);
                            NavigationService.navigate('efstDetails', { 'licenseNum': licenseCode });
                            // NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'request') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'onHoldRequest') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'sampling') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                    }
                    else {
                        if (item.code == 'condemnation') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'detention') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'request') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'EFST') {
                            let licenseCode = inspectionDetails.LicenseCode;
                            // //console.log("licenseCode", licenseCode);
                            efstDraft.callToFetchEfstDataService(licenseCode);
                            NavigationService.navigate('efstDetails', { 'licenseNum': licenseCode });
                            // NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                        if (item.code == 'sampling') {
                            NavigationService.navigate(item.navigationScreenName, { title: item.title })
                        }
                    }// NavigationService.navigate(item.navigationScreenName, { title: item.title })

                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                    width: '100%', borderColor: 'transparent'
                }}>

                <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                    <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                        resizeMode={'contain'}
                        source={item.image} />
                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

            </TouchableOpacity>

        )
    }

    let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

    const backButtonHandlerApp = () => {

        if (checkListData && checkListData['0']) {
            let completedTask = checkListData['0'].isCompleted ? checkListData['0'].isCompleted : false
            if (completedTask) {
                myTasksDraft.setIsMyTaskClick('CompletedTask')
            }

            let obj = {
                checkList: JSON.stringify(props.modifiedCheckListData),
                taskId: (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId),
                timeStarted: checkListData['0'].timeStarted,
                timeElapsed: checkListData['0'].timeElapsed,
                sign: documantationDraft.fileBuffer,
                overallcomment: myTasksDraft.finalComment,
                contactname: myTasksDraft.contactName,
                contactnumber: myTasksDraft.mobileNumber,
                eid: myTasksDraft.emiratesId,
            }
            debugger;
            // myTasksDraft.setCheckListArray(JSON.stringify(modifiedCheckListData))
            RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
            });
        }


    }
    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={{ flex: inspectionDetails && inspectionDetails.TaskType && inspectionDetails.TaskType.toLowerCase().includes('food') ? 4 : 3.5, justifyContent: 'center' }}>

                <View style={{ flex: 8, justifyContent: 'center', backgroundColor: fontColor.TextInputBoxColor, borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>

                    {/*  <TextInputComponent
                        placeholder={Strings[props.isArabic ? 'ar' : 'en'].documentAndRecord.signHere}
                        style={{
                            height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderTopLeftRadius: 6, borderTopRightRadius: 6
                        }}
                        onChange={(val) => { }}
                        value={''}
                    /> */}
                    {
                        documantationDraft.fileBuffer !== '' || myTasksDraft.isMyTaskClick == 'CompletedTask' ?
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${documantationDraft.fileBuffer}` }}
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


            {
                inspectionDetails.TaskType == 'Bazar Inspection' ?
                    <View style={{ flex: 2.5, justifyContent: 'center' }} />
                    :
                    <View style={{ flex: 2.5, justifyContent: 'center' }}>

                        <View style={styles.space} />

                        {inspectionDetails && inspectionDetails.TaskType && inspectionDetails.TaskType.toLowerCase().includes('food') ? null :

                            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={styles.textContainer}>

                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].startInspection.finalResult} </Text>

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
                                        value={myTasksDraft.result}
                                        onChange={(val: string) => {
                                            myTasksDraft.setResult(val)
                                        }}
                                    />

                                </View>
                            </View>
                        }
                        <View style={styles.space} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.commentTextContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].documentAndRecord.finalComment} </Text>
                            </View>

                            <View style={{ flex: 0.3, justifyContent: 'center', alignItems: props.isArabic ? 'flex-end' : 'flex-start' }}>
                                <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/startInspection/commentCheck.png')} />
                            </View>

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    isMultiline={true}
                                    placeholder={''}
                                    maxLength={200}
                                    style={{
                                        height: '90%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={(myTasksDraft.isMyTaskClick == 'CompletedTask') ? false : true}
                                    value={myTasksDraft.finalComment}
                                    onChange={(val: string) => {
                                        if (!validateUsername(val)) {
                                            myTasksDraft.setFinalComment(val);
                                            // inspectionDetails.mappingData['0'].overallComments = val;

                                            if (myTasksDraft.isMyTaskClick == 'campaign') {
                                                let mappingData = myTasksDraft.campaignMappingData != '' ? JSON.parse(myTasksDraft.campaignMappingData) : [];
                                                mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].overallComments = val;
                                                myTasksDraft.setCampaignMappingData(JSON.stringify(mappingData));
                                                inspectionDetails.mappingData = mappingData;


                                                // inspectionDetails.mappingData[parseInt(myTasksDraft.campaignSelectedEstIndex)].overallComments = val;
                                            }
                                            else {
                                                inspectionDetails.mappingData[0].overallComments = val;

                                            }
                                            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                                                // ToastAndroid.show('Task updated successfully ', 1000);
                                                backButtonHandlerApp()
                                            });
                                        }

                                    }}
                                />

                            </View>
                        </View>

                    </View>
            }

            {myTasksDraft.isMyTaskClick == 'license' ?
                <View style={{ flex: .8 }} />
                : <View style={{ flex: 0.3 }} />
            }

            {
                (inspectionDetails.TaskType == 'Bazar Inspection') || (myTasksDraft.isMyTaskClick == 'license') ?
                    null
                    :
                    myTasksDraft.isMyTaskClick == 'myTask' || myTasksDraft.isMyTaskClick == 'case' || myTasksDraft.isMyTaskClick == 'campaign' || myTasksDraft.isMyTaskClick == 'History' ?

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'myTask' ? 2.5 : 2.5, justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 5 }}>

                            <FlatList
                                // nestedScrollEnabled={false}
                                data={myTasksDraft.isMyTaskClick == 'myTask' ? documentArray : (inspectionDetails && inspectionDetails.TaskType && (inspectionDetails.TaskType == 'Temporary Routine Inspection')) ? documentArray : myTasksDraft.isMyTaskClick == 'case' ? documentCasesArray : myTasksDraft.isMyTaskClick == 'campaign' ? documentArray : documentCasesArray}
                                contentContainerStyle={{ padding: 2, justifyContent: 'center' }}
                                columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                                initialNumToRender={5}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderData(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.01, width: WIDTH * 0.03 }} />)}
                                numColumns={3}
                            />

                        </View>
                        :
                        (((myTasksDraft.isMyTaskClick == 'myTask' || myTasksDraft.isMyTaskClick == 'cases' || myTasksDraft.isMyTaskClick == 'campaign' || inspectionDetails.TaskType == 'Temporary Routine Inspection')) || myTasksDraft.isMyTaskClick == 'CompletedTask') ?
                            <View style={{ flex: 2.5, justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 5 }}>

                                <FlatList
                                    // nestedScrollEnabled={false}
                                    data={documentCasesArray}
                                    contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                    columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                                    initialNumToRender={5}
                                    renderItem={({ item, index }) => {
                                        return (
                                            renderData(item, index)
                                        )
                                    }}
                                    ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.01, width: WIDTH * 0.03 }} />)}
                                    numColumns={3}
                                />

                            </View>
                            :
                            myTasksDraft.isMyTaskClick == 'license' ?
                                null
                                :
                                <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }} />

            }
            {bottomBarDraft.profileClick ? <View style={{ flex: 3.5, justifyContent: 'center' }} />
                : null}

            <View style={{ flex: 0.1 }} />

        </View>
    )
})

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


export default observer(DocumentationAndRecordComponent);
