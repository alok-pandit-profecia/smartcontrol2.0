import React, { useContext, useState, useEffect } from 'react';
import {
    View, ToastAndroid,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image, ScrollView,
    FlatList
} from 'react-native';
import { fontColor, fontFamily } from './../../config/config';
import Strings from './../../config/strings';
import moment from 'moment';
// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
var fs = 20;
// imports
import * as Animatable from 'react-native-animatable';
import TextComponent from '../TextComponent';
import strings from '../../config/strings';
import { Context } from '../../utils/Context';
import ViewShot from "react-native-view-shot";
import RNImageToPdf from 'react-native-image-to-pdf';
import Share from "react-native-share";
import FileViewer from 'react-native-file-viewer';
import InspectionDetails from '../../routes/InspectionDetails';
import LoginSchema from './../../database/LoginSchema';
import CheckListSchema from './../../database/CheckListSchema';
import { RealmController } from './../../database/RealmController';
import TableComponent from '../TableComponent';
let realm = RealmController.getRealmInstance();

const ModalComponent = (props: any) => {
    let ChecklistScore: any = {}
    ChecklistScore.MajorArray = [];
    ChecklistScore.ModerateArray = [];
    ChecklistScore.MinorArray = [];
    ChecklistScore.OmittedArray = [];

    let context = useContext(Context);
    const [isClick, setIsClick] = useState({
        pdfCreated: false,
    })

    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [establishedData, setEstablishedData] = useState(Object());
    const [mappingData, setMappingData] = useState(Object());
    const [checklist, setchecklist] = useState(Array());
    const [equipmentUsed, setEquipmentUsed] = useState(String());
    const [loginName, setLoginName] = useState(String());
    const [signature, setSignature] = useState(String());

    const [majorArray, setMajorArray] = useState(Array())
    const [minorArray, setMinorArray] = useState(Array())
    const [moderateArray, setModerateArray] = useState(Array())
    const [omittedArray, setOmittedArray] = useState(Array());
    const [samplingArray, setSamplingArray] = useState(Array());
    const [condemnationArray, setCondemnationArray] = useState(Array());
    const [detentionArray, setDetentionArray] = useState(Array());

    const [imageUri, setImageUri] = useState(Object());
    const [pdfPath, SetPdfPath] = useState(Object());

    useEffect(() => {

        let establishData = props.establishData;
        // //console.log("Establish Data ", establishData);
        setEstablishedData(establishData);
        let tempMappingData = props.data.mappingData !== '' ? typeof (props.data.mappingData) == 'string' ? JSON.parse(props.data.mappingData) : props.data.mappingData : [];
        let temp = []
        // alert(JSON.stringify(mappingData))
        if (tempMappingData[0].taskId) {
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, tempMappingData[0].taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                temp = JSON.parse(checkListData['0'].checkList);

            }
            // let temp = tempMappingData[0].inspectionForm            
        }

        var signatureBase64 = 'data:image/png;base64,' + tempMappingData[0].signatureBase64;
        // //console.log("Signature",signatureBase64);
        setSignature(signatureBase64);

        let samplingReport = tempMappingData['0'].samplingReport ? tempMappingData['0'].samplingReport : [];
        let samplingArr = [];

        if (samplingReport.length) {

            for (let indexSampling = 0; indexSampling < samplingReport.length; indexSampling++) {
                const elementSampling = samplingReport[indexSampling];
                let Arr = [];
                Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementSampling.serialNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementSampling.sampleName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementSampling.type },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleCollectionReason, value: elementSampling.sampleCollectionReason },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.expiryDate, value: elementSampling.dateofSample },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleDateCollectionName, value: elementSampling.sampleState },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleTemp, value: elementSampling.sampleTemperature },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.quantity, value: elementSampling.remainingQuantity },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.unit, value: elementSampling.unit },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.quantity, value: elementSampling.quantity },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.netWeight, value: elementSampling.netWeight },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.package, value: elementSampling.package },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.batchNumber, value: elementSampling.batchNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.brandName, value: elementSampling.brandName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.productionDate, value: elementSampling.productionDate },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.expiryDate, value: elementSampling.expiryDate },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.countryOrigin, value: elementSampling.countryOfOrigin },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.remarks, value: elementSampling.remarks }
                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.attachments, value: elementSampling.attachment1 },
                    // { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.attachments, value: elementSampling.attachment2 }

                ]
                samplingArr.push(Arr);
            }

        }

        // alert(JSON.stringify(samplingReport));
        setSamplingArray(samplingArr);


        let condemnationReport = tempMappingData['0'].condemnationReport ? tempMappingData['0'].condemnationReport : [];
        let condemnationArr = [];

        if (condemnationReport.length) {

            for (let indexCondemation = 0; indexCondemation < condemnationReport.length; indexCondemation++) {
                const elementCondemnation = condemnationReport[indexCondemation];
                let Arr = [];
                Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.serialNumber, value: elementCondemnation.serialNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleName, value: elementCondemnation.productName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.type, value: elementCondemnation.unit },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleCollectionReason, value: elementCondemnation.quantity },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.expiryDate, value: elementCondemnation.netWeight },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleDateCollectionName, value: elementCondemnation.package },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.sampleTemp, value: elementCondemnation.batchNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.quantity, value: elementCondemnation.brandName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.unit, value: elementCondemnation.remarks },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.quantity, value: elementCondemnation.place },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.netWeight, value: elementCondemnation.reason }
                ]
                condemnationArr.push(Arr);
            }

        }

        // alert(JSON.stringify(condemnationArr));
        setCondemnationArray(condemnationArr);
        // alert('Sampling Array' + JSON.stringify(tempMappingData['0'].samplingReport));
        let detentionReport = tempMappingData['0'].detentionReport ? tempMappingData['0'].detentionReport : [];
        let detentionArr = [];

        if (detentionReport.length) {

            for (let indexDetention = 0; indexDetention < detentionReport.length; indexDetention++) {
                const elementDetention = detentionReport[indexDetention];
                let Arr = [];
                Arr = [{ keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.serialNumber, value: elementDetention.serialNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.type, value: elementDetention.type },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.unit, value: elementDetention.unit },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.quantity, value: elementDetention.quantity },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.netWeight, value: elementDetention.netWeight },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.package, value: elementDetention.package },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.batchNumber, value: elementDetention.batchNumber },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.brandName, value: elementDetention.brandName },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.productionDate, value: elementDetention.productionDate },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.productionDate, value: elementDetention.expiryDate },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.reason, value: elementDetention.reason },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.countryOrigin, value: elementDetention.countryOfOrigin },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].samplingForm.remarks, value: elementDetention.remarks },
                { keyName: Strings[context.isArabic ? 'ar' : 'en'].detentionForm.decisions, value: elementDetention.decisions }
                ]
                detentionArr.push(Arr);
            }

        }

        setDetentionArray(detentionArr);

        let loginData = RealmController.getLoginData(realm, LoginSchema.name);
        loginData = loginData['0'] ? loginData['0'] : {};
        setchecklist(temp);

        let tempData = props.data;
        let name = tempData.LoginName ? tempData.LoginName : loginData.username;
        let name1 = name.replace(".", " ");
        setLoginName(name1);
        // //console.log("LoginName", name1);
        setInspectionDetails(tempData);


        // let tempMappingData = props.data.mappingData[0];

        let equpmentused = " "
        if (tempMappingData[0].thermometerCBValue) {

            equpmentused = equpmentused + "Thermometer" + ",";
        }
        if (tempMappingData[0].dataLoggerCBValue) {

            equpmentused = equpmentused + " DataLogger" + ",";
        }
        if (tempMappingData[0].UVlightCBValue) {

            equpmentused = equpmentused + " UVlight" + ",";
        }
        if (tempMappingData[0].flashlightCBValue) {

            equpmentused = equpmentused + " FlashLight" + ",";
        }
        if (tempMappingData[0].luxmeterCBValue) {

            equpmentused = equpmentused + " LuxMeter" + ",";
        }

        // //console.log("EquipmentUsed", equpmentused);
        let updatedEquipt = equpmentused.slice(0, -1);
        setEquipmentUsed(updatedEquipt);
        // //console.log("EquipmentUsed global", equipmentUsed);
        setMappingData(tempMappingData[0]);

        // console.log(":grace,::", JSON.stringify(temp.length));

        for (let i = 0; i < temp.length; i++) {
            let score = (temp[i].Answers || (temp[i].Answers == 0)) ? temp[i].Answers.toString() : "";
        console.log(":temp[i].Answers,::", JSON.stringify(temp[i].Answers));

            if (temp[i].parameter_type && (temp[i].parameter_type === 'EHS')) {
                // return
            }
            else {
                if ((temp[i].NI == 'Y') || temp[i].isNotAnswered) {
                    score = '5';
                }

                if (score === '0') {
                    var MajorNonComplianceParameters: any = new Object();
                    console.log(":temp:", JSON.stringify(temp[i]));

                    if (tempData.TaskType == "Follow-Up") {
                        // if (temp[i].Comments != 'Satisfactory') {
                        MajorNonComplianceParameters.ParameterNo = temp[i].ParameterNumber;
                        MajorNonComplianceParameters.ParameterName = temp[i].QuestionNameEnglish.replace(/&amp;/g, '&');
                        MajorNonComplianceParameters.ParameterComment = temp[i].Comments;
                        ChecklistScore.MajorArray.push(MajorNonComplianceParameters)
                        // }
                    }
                    else {
                        // if (temp[i].Comment != 'Satisfactory') {
                        MajorNonComplianceParameters.ParameterNo = temp[i].parameter_reference;
                        MajorNonComplianceParameters.ParameterName = temp[i].parameter.replace(/&amp;/g, '&');
                        MajorNonComplianceParameters.ParameterComment = temp[i].comment;
                        ChecklistScore.MajorArray.push(MajorNonComplianceParameters)
                        // }
                    }
                    if (temp[i].image1) {
                        MajorNonComplianceParameters.img1 = temp[i].image1;
                    }
                    if (temp[i].image2) {
                        MajorNonComplianceParameters.img2 = temp[i].image2;
                    }
                }
                else if ((score === '1') || (score === '2')) {
                    // // //console.log("Ibnside if")
                    var ModerateNonComplianceParameters: any = new Object();

                    if (tempData.TaskType == "Follow-Up") {
                        // if (temp[i].Comments != "Satisfactory") {
                        ModerateNonComplianceParameters.ParameterNo = temp[i].ParameterNumber;
                        ModerateNonComplianceParameters.ParameterName = temp[i].QuestionNameEnglish.replace(/&amp;/g, '&');
                        ModerateNonComplianceParameters.ParameterComment = temp[i].Comments;
                        // }
                        ChecklistScore.ModerateArray.push(ModerateNonComplianceParameters);
                    }
                    else {
                        // if (temp[i].Comment != "Satisfactory") {
                        ModerateNonComplianceParameters.ParameterNo = temp[i].parameter_reference;
                        ModerateNonComplianceParameters.ParameterName = temp[i].parameter.replace(/&amp;/g, '&');
                        ModerateNonComplianceParameters.ParameterComment = temp[i].comment;
                        // }
                        ChecklistScore.ModerateArray.push(ModerateNonComplianceParameters);
                    }
                    // //console.log("Checkliosy arrat", ChecklistScore);
                }
                else if (score === '3') {
                    var MinorNonComplianceParameters: any = new Object();
                    if (tempData.TaskType == "Follow-Up") {
                        // if (temp[i].Comments != "Satisfactory") {
                        MinorNonComplianceParameters.ParameterNo = temp[i].ParameterNumber;
                        MinorNonComplianceParameters.ParameterName = temp[i].QuestionNameEnglish.replace(/&amp;/g, '&');
                        MinorNonComplianceParameters.ParameterComment = temp[i].Comments;
                        // }
                        ChecklistScore.MinorArray.push(MinorNonComplianceParameters);
                    }
                    else {
                        // if (temp[i].Comment != "Satisfactory") {
                        MinorNonComplianceParameters.ParameterNo = temp[i].parameter_reference;
                        MinorNonComplianceParameters.ParameterName = temp[i].parameter.replace(/&amp;/g, '&');
                        MinorNonComplianceParameters.ParameterComment = temp[i].comment;
                        ChecklistScore.MinorArray.push(MinorNonComplianceParameters);
                        // }
                    }
                }
                else if (score === '5') {
                    var OmittedParameters: any = new Object();

                    if (tempData.TaskType == "Follow-Up") {
                        // if (temp[i].Comments != "Satisfactory") {
                        OmittedParameters.ParameterNo = temp[i].ParameterNumber;
                        OmittedParameters.ParameterName = temp[i].QuestionNameEnglish.replace(/&amp;/g, '&');
                        OmittedParameters.ParameterComment = temp[i].Comments;
                        ChecklistScore.OmittedArray.push(OmittedParameters);
                        // }
                    }
                    else {
                        // if (temp[i].Comment != "Satisfactory") {
                        OmittedParameters.ParameterNo = temp[i].parameter_reference;
                        OmittedParameters.ParameterName = temp[i].parameter.replace(/&amp;/g, '&');
                        OmittedParameters.ParameterComment = temp[i].comment;
                        ChecklistScore.OmittedArray.push(OmittedParameters);
                        // }
                    }
                }
            }

            // // //console.log("Checkliosy arrat1   ", ChecklistScore);
        }
        // alert(JSON.stringify(ChecklistScore.OmittedArray))

        setMajorArray(ChecklistScore.MajorArray);
        setMinorArray(ChecklistScore.MinorArray);
        setModerateArray(ChecklistScore.ModerateArray);
        setOmittedArray(ChecklistScore.OmittedArray);

        // //console.log("setchecklist", checklist.length);
        //  loginName = inspectionDetails.LoginName.replace(".", " "); 

    }, []);

    const cancelAlert = () => {
        props.closeAlert();
    }

    const shareOptions = () => {
        // //console.log("Click on share", pdfPath);

        Share.open({
            url: 'file://' + pdfPath
        })
    }
    const viewPDF = () => {

        const path: any = pdfPath
        // const path: any = 'file://' + pdfPath
        FileViewer.open(path)
            .then(() => {
                // //console.log("Click on view success");
            })
            .catch(error => {
                // //console.log("Error", error);
            });
    }

    const myAsyncPDFFunction = async () => {
        // //console.log("Image path", imageUri);    
        try {
            const options = {
                imagePaths: [imageUri.toString()],
                name: inspectionDetails.TaskId + '.pdf',
                maxSize: { // optional maximum image dimension - larger images will be resized
                    width: 900,
                    height: Math.round(HEIGHT / WIDTH * 900),
                },
                quality: 1, // optional compression paramter
            };
            const pdf = await RNImageToPdf.createPDFbyImages(options);

            setIsClick(prevState => {
                return { ...prevState, pdfCreated: true }
            });
            ToastAndroid.show(Strings[props.isArabic ? 'ar' : 'en'].completedTasks.pdfCreated, 1000);

            // //console.log("Success", pdf);
            SetPdfPath(pdf.filePath);
        } catch (e) {
            // //console.log("Errior", e);
        }
    }
    const renderData = (item: any, index: number) => {
        // alert('Item' + JSON.stringify(item));
        return (
            <View style={{ flex: 1, height: HEIGHT * 0.8, width: '100%', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 10 }}>
                <TableComponent isHeader={true}
                    isView={false}
                    isEdit={false}
                    editData={() => { }}
                    isArabic={context.isArabic} HeaderName={Strings[context.isArabic ? 'ar' : 'en'].detention.recordNumber + ' ' + (index + 1)}
                    data={item}
                    viewData={() => { }}
                />
            </View>
        )
    }

    const onCapture = (uri: any) => {
        let newUri = uri.substring(7)
        setImageUri(newUri);
        // //console.log("do something with ", uri);
    }

    const renderScorelist = (item: any, index: number) => {

        return (

            <TouchableOpacity
                key={item.ContactName}
                style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                    height: 'auto', padding: 10, flexDirection: "row", width: '95%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0

                }]}>

                <View style={[{
                    height: 'auto', width: '15%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterNo ? item.ParameterNo : ''} </Text>
                </View>
                <View style={[{
                    height: 'auto', width: '30%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterName ? item.ParameterName : ''} </Text>
                </View>
                <View style={[{
                    height: 'auto', width: '55%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterComment ? item.ParameterComment : ''} </Text>
                </View>


            </TouchableOpacity>
        )
    }

    const renderViolationQuestionList = (item: any, index: number) => {
        return (

            <TouchableOpacity
                key={item.ContactName}
                style={[{
                    height: HEIGHT * 0.05, flexDirection: "row", width: '90%', alignSelf: 'center', justifyContent: 'center', shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0

                }]}>


                <View style={[{
                    height: 'auto', width: '85%', justifyContent: 'flex-start', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text
                        style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "left" }}>{item.ParameterName ? item.ParameterName : ''} </Text>
                </View>

                <View style={[{
                    height: 'auto', width: '15%', justifyContent: 'flex-end', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.ParameterNo ? item.ParameterNo : ''} </Text>
                </View>


            </TouchableOpacity>
        )
    }


    return (
        <View style={{ height: 'auto', width: WIDTH, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, zIndex: 8, position: 'absolute', ...StyleSheet.absoluteFillObject }}>

            <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.90, borderRadius: 20 }]}>

                <View style={{ flex: 1, height: HEIGHT, justifyContent: 'center', backgroundColor: fontColor.greenShade, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>


                    <TouchableOpacity
                        onPress={() => {
                            cancelAlert()
                        }}
                        style={{ height: HEIGHT * 0.04, width: '20%', alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                        <Image
                            resizeMode="contain"
                            source={require("./../../assets/images/alert_images/close.png")}
                            style={{ height: '70%', width: '70%', flexDirection: 'row', alignSelf: 'center' }} />

                    </TouchableOpacity>

                    <ScrollView
                        contentContainerStyle={{ marginBottom: 10, width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}
                        style={{ backgroundColor: 'white' }}>


                        <View style={{ width: '100%', height: 'auto' }}>

                            <ViewShot onCapture={onCapture}
                                //   captureMode="continuous"
                                captureMode="mount"
                                options={{ format: "jpg", quality: 1 }}
                            >

                                <View style={{ height: HEIGHT * 0.16, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: 'white' }}>

                                    <View style={{ height: HEIGHT * 0.15, marginVertical: 20, width: '100%', marginHorizontal: '5%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: 'white' }}>
                                        {/* <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"ABU DHABI FOOD CONTROL AUTHIRITY"} </Text>
                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"سلطة أبو ظبي في الرقابة الغذائية"} </Text> */}

                                        <Image
                                            resizeMode="contain"
                                            source={require("./../../assets/images/adfca_new_logo.png")}
                                            style={{ height: '100%', width: '100%', flexDirection: 'row', alignSelf: 'center' }} />

                                    </View>

                                    {/* <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: fontColor.greenShade }}>
                                        <Image
                                            resizeMode="contain"
                                            source={require("./../../assets/images/logo-size/SmartControl_Logo.png")}
                                            style={{ height: '70%', width: '70%', flexDirection: 'row', alignSelf: 'center' }} />


                                    </View> */}

                                </View>

                                <View style={{ backgroundColor: fontColor.greenShade, height: HEIGHT * 0.002, width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}></View>


                                <View style={{
                                    width: '100%', alignSelf: 'center', justifyContent: 'flex-start',
                                    shadowRadius: 1, backgroundColor: fontColor.white,
                                }}>

                                    {(inspectionDetails.TaskType == "Follow-Up" || inspectionDetails.TaskType == 'Routine Inspection' || inspectionDetails.TaskType == 'Direct Inspection') && mappingData.finalResult == "Violation" ?
                                        <View>

                                            <View style={{ marginTop: 10, height: HEIGHT * 0.03, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                                <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Violation Form"} </Text>
                                                </View>

                                                <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{" ضبط مخالفة "} </Text>
                                                </View>
                                            </View>

                                            <View style={{
                                                marginTop: 10,
                                                height: HEIGHT * 0.60, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                                shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                            }}>


                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"No"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.TaskId}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم"}  </Text>
                                                    </View>

                                                </View>

                                                <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Name"} </Text>
                                                    </View>
                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{establishedData.establishmentName ? establishedData.establishmentName : '-'}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المؤسسة"}</Text>
                                                    </View>


                                                </View>

                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Address"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{establishedData.area ? establishedData.area : '-'}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"عنوان"}</Text>
                                                    </View>

                                                </View>


                                                <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Phone"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactNumber ? mappingData.ContactNumber : '-'}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"هاتف"}</Text>
                                                    </View>
                                                </View>

                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Contact Name"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactName ? mappingData.ContactName : '-'}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم العميل"}</Text>
                                                    </View>

                                                </View>

                                                <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Emirates Id"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.EmiratesId ? mappingData.EmiratesId : '-'}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم التعريف"}</Text>
                                                    </View>

                                                </View>



                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License No"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.LicenseCode ? mappingData.LicenseCode : inspectionDetails.LicenseCode}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم الرخصة"}</Text>
                                                    </View>

                                                </View>

                                                <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License Expiry Date"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.TradeExpiryDate ? mappingData.TradeExpiryDate : '-'}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ انتهاء الترخيص"}</Text>
                                                    </View>

                                                </View>


                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Phone"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{establishedData.contactDetails ? establishedData.contactDetails : '-'}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم"}  </Text>
                                                    </View>

                                                </View>

                                                <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Violation Date"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ViolationDate ? mappingData.ViolationDate : '-'}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'تاريخ'}</Text>
                                                    </View>

                                                </View>

                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Violation Time"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ViolationTime ? mappingData.ViolationTime : '-'}</Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم"}  </Text>
                                                    </View>

                                                </View>

                                            </View>

                                            <View style={{ height: HEIGHT * 0.05, flexDirection: 'row', width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}>

                                                <View style={{ height: HEIGHT * 0.07, width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"تم ضبط المخالفات التالية:"}</Text>
                                                </View>
                                            </View>


                                            {majorArray.length ?

                                                <View style={{
                                                    height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                                    borderWidth: 1, borderColor: fontColor.greenShade,
                                                    shadowRadius: 1,
                                                    // backgroundColor: fontColor.ButtonBoxColor,
                                                    borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                                }} >
                                                    <FlatList
                                                        nestedScrollEnabled={true}
                                                        data={majorArray}
                                                        renderItem={({ item, index }) => {
                                                            return (
                                                                renderViolationQuestionList(item, index)
                                                            )
                                                        }}
                                                        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                                    />

                                                </View> : null}






                                            <View style={{ height: HEIGHT * 0.10, flexDirection: 'row', width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}>

                                                <View style={{ height: HEIGHT * 0.07, width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"وقد أقر المشتكي عليه بجميع بنود المخالفة سالفة الذكر ، وعليه حررت هذه المخالفة استنادا الى نصوص القانون رقم 2 لسنة 2008 في شأن الغذاء في إمارة أبوظبي."} </Text>
                                                </View>
                                            </View>


                                            <View style={{
                                                marginTop: 10,
                                                height: HEIGHT * 0.20, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                                shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                            }}>


                                                <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Contact Name"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactName ? mappingData.ContactName : '-'}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم العميل"}</Text>
                                                    </View>

                                                </View>
                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Signature"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}> - </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"أحرز هدفا"}</Text>
                                                    </View>

                                                </View>


                                                <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"User ID"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ color: 'black', textAlign: 'center' }}> {inspectionDetails.LoginName}  </Text>
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"فترة السماح"}</Text>
                                                    </View>

                                                </View>
                                                <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                                    <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Signature"} </Text>
                                                    </View>

                                                    <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>

                                                        <Image resizeMode="contain" style={{ height: '100%', width: '100%' }} source={{ uri: signature }} />
                                                    </View>

                                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"توقيع التفتيش"}  </Text>
                                                    </View>

                                                </View>

                                            </View>



                                            <View style={{ height: HEIGHT * 0.10, flexDirection: 'row', width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}>

                                                <View style={{ height: HEIGHT * 0.07, width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"للاستفسارات أو الملاحظات أو للتظلم على هذا التقرير , الرجاء مراجعة الجهاز خلال 5 أيام من تاريخ تحرير المخالفة"} </Text>
                                                </View>
                                            </View>


                                            <View style={{ height: HEIGHT * 0.025, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                                <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Format No: F9-FCACD-FIP-01"} </Text>
                                                </View>

                                                <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Edition No : 02"} </Text>
                                                </View>
                                            </View>




                                            <View style={{ height: HEIGHT * 0.025, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                                <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Issue No : 05"} </Text>
                                                </View>

                                                <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Issue Date: 20.12.2017"} </Text>
                                                </View>
                                            </View>



                                            <View style={{ margin: 10, backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}></View>

                                        </View> : null}


                                    <View style={{ height: HEIGHT * 0.025, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Final Inspection Report"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"تقرير الفحص النهائي"} </Text>
                                        </View>
                                    </View>

                                    <View style={{ height: HEIGHT * 0.03, width: '100%', justifyContent: 'flex-start', alignItems: 'center', }}>

                                        <Text style={{ height: 'auto', marginTop: 10, color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{mappingData.finalResult ? mappingData.finalResult : ''} </Text>
                                    </View>

                                    <View style={{ marginTop: 10, backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '90%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '5%' }}></View>

                                    <View style={{
                                        marginTop: 10,
                                        height: HEIGHT * 0.6, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>


                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.TaskId}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم"}  </Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Date"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.CompletionDate}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'تاريخ'}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Name"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{establishedData.establishmentName ? establishedData.establishmentName : '-'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المؤسسة"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Activity"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.BusinessActivity}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نشاط"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Client Name"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactName ? mappingData.ContactName : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم العميل"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Identification No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.EmiratesId ? mappingData.EmiratesId : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم التعريف"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Address"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{establishedData.area ? establishedData.area : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"عنوان"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Phone"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.ContactNumber ? mappingData.ContactNumber : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"هاتف"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.LicenseCode ? mappingData.LicenseCode : inspectionDetails.LicenseCode}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"رقم الرخصة"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License Expiry Date"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.TradeExpiryDate ? mappingData.TradeExpiryDate : '-'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ انتهاء الترخيص"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Type Of Inspection"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.TaskType}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نوع الفحص"}</Text>
                                            </View>

                                        </View>



                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Date Of Inspection"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.CompletionDate}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ الفحص"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Name Of inspector"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{loginName}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المفتش"}</Text>
                                            </View>

                                        </View>

                                    </View>

                                    <Text style={{ margin: 10, color: fontColor.TitleColor, fontSize: 16, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Description of Inspection"} </Text>

                                    <Text style={{ marginHorizontal: 10, color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"This inspection has been carried out as per the requiorements of the following inspection method.related temp and other criteria as applicable"} </Text>


                                    <Text style={{ margin: 10, color: fontColor.TitleColor, fontSize: 16, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"وصف التفتيش"} </Text>

                                    <Text style={{ marginHorizontal: 10, color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"تم إجراء هذا الفحص وفقًا لمتطلبات طريقة الفحص التالية: قائمة المراجعة ذات الصلة والمعايير الأخرى حسب الاقتضاء"} </Text>


                                    <View style={{ marginVertical: 10, backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '95%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2.5%' }}></View>

                                    <View style={{ height: HEIGHT * 0.03, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Inspection Method Used"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"طريقة الفحص المستخدمة"} </Text>
                                        </View>
                                    </View>

                                    <View style={{ height: HEIGHT * 0.03, width: '95%', justifyContent: 'center', alignItems: 'center' }}>

                                        <Text style={{ width: '100%', textAlign: "center", color: fontColor.TitleColor, fontSize: 14, fontWeight: 'bold' }}>{equipmentUsed}</Text>
                                    </View>

                                    <View style={{ marginVertical: 10, backgroundColor: fontColor.grey, height: HEIGHT * 0.002, width: '95%', justifyContent: 'center', alignItems: 'center', marginHorizontal: '2.5%' }}></View>

                                    <View style={{ height: HEIGHT * 0.02, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Inspection Results"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                        </View>
                                    </View>

                                    {majorArray.length ?
                                        <View style={{
                                            margin: 10,
                                            height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%', justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey, borderWidth: 1, borderColor: fontColor
                                                .greenShade, borderRadius: 5
                                        }}>
                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Major Non conformance Parameters"} </Text>
                                            </View>

                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                            </View>
                                        </View>
                                        : null}


                                    {majorArray.length ?
                                        <View style={{
                                            height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                            borderWidth: 1, borderColor: fontColor.greenShade,
                                            shadowRadius: 1,
                                            // backgroundColor: fontColor.ButtonBoxColor,
                                            borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                        }} >
                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={majorArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                            />

                                        </View> : null}

                                    {moderateArray.length ?
                                        <View style={{
                                            margin: 10,
                                            height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%', justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey, borderWidth: 1, borderColor: fontColor
                                                .greenShade, borderRadius: 5
                                        }}>
                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Moderate Non conformance Parameters"} </Text>
                                            </View>

                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                            </View>
                                        </View> : null}

                                    {moderateArray.length ?
                                        <View style={{
                                            height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                            borderWidth: 1, borderColor: fontColor.greenShade,
                                            shadowRadius: 1, backgroundColor: fontColor.white,
                                            borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                        }} >

                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={moderateArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                            />

                                        </View> : null}

                                    {minorArray.length ?
                                        <View style={{
                                            margin: 10,
                                            height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%',
                                            justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey,
                                            borderWidth: 1, borderColor: fontColor.greenShade, borderRadius: 5,
                                        }}>
                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Minor Non conformance Parameters"} </Text>
                                            </View>

                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>

                                            </View>
                                        </View> : null}

                                    {minorArray.length ?
                                        <View style={{
                                            height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                            borderWidth: 1, borderColor: fontColor.greenShade,
                                            shadowRadius: 1, backgroundColor: fontColor.white,
                                            borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                        }} >

                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={minorArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                                            />

                                        </View> : null}

                                    {omittedArray.length ?
                                        <View style={{
                                            margin: 10,
                                            height: HEIGHT * 0.05, flexDirection: 'row', width: '95%', marginHorizontal: '2.5%', justifyContent: 'center', alignItems: 'center', backgroundColor: fontColor.lightGrey, borderWidth: 1, borderColor: fontColor
                                                .greenShade, borderRadius: 5
                                        }}>
                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Parameters omitted from the scope of inspection "} </Text>
                                            </View>

                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"نتائج التفتيش"} </Text>
                                            </View>
                                        </View> : null}

                                    {/* <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"[List of all the NI questions]"} </Text> */}

                                    {omittedArray.length ?
                                        <View style={{
                                            height: 'auto', width: '95%', alignSelf: 'center', paddingVertical: 10,
                                            borderWidth: 1, borderColor: fontColor.greenShade,
                                            shadowRadius: 1, backgroundColor: fontColor.white,
                                            borderRadius: 5, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                        }} >

                                            <FlatList
                                                nestedScrollEnabled={true}
                                                data={omittedArray}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        renderScorelist(item, index)
                                                    )
                                                }}
                                                ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
                                            />

                                        </View> : null}

                                    <View style={{
                                        marginTop: 10, padding: 10,
                                        height: 'auto', width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 1, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>

                                        <View style={{ height: 'auto', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>

                                            <View style={{ height: 'auto', width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'left', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"Inspection Comments"} </Text>
                                            </View>

                                            <View style={{ height: 'auto', width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'right', fontWeight: '600', fontFamily: fontFamily.textFontFamily }}>{"طريقة الفحص المستخدمة"} </Text>
                                            </View>

                                        </View>

                                        <View style={{ marginTop: 10, height: 'auto', width: '95%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ width: '100%', color: fontColor.TitleColor, fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>{mappingData.overallComments ? mappingData.overallComments : ''}</Text>
                                        </View>

                                    </View>

                                    {/* <View style={{
                                        width: '95%', alignSelf: 'center'
                                    }}>

                                        <Text style={{ fontSize: 14, color: '#5C666F' }}> {'Sampling Array'} </Text>
                                        <FlatList
                                            data={samplingArray}
                                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                            ListEmptyComponent={() => {
                                                return (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#565758', fontFamily: fontFamily.textFontFamily }}>{'No Records Found'}</Text>
                                                    </View>
                                                )
                                            }}
                                            // columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                                            // initialNumToRender={5}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    renderData(item, index)
                                                )
                                            }}
                                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                                        // numColumns={4}
                                        />

                                    </View>

                                    <View style={{
                                        width: '95%', alignSelf: 'center'
                                    }}>

                                        <Text style={{ fontSize: 14, color: '#5C666F' }}> {'Condemnation Array'} </Text>
                                        <FlatList
                                            data={condemnationArray}
                                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                            ListEmptyComponent={() => {
                                                return (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#565758', fontFamily: fontFamily.textFontFamily }}>{'No Records Found'}</Text>
                                                    </View>
                                                )
                                            }}
                                            // columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                                            // initialNumToRender={5}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    renderData(item, index)
                                                )
                                            }}
                                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                                        // numColumns={4}
                                        />

                                    </View>

                                    <View style={{
                                        width: '95%', alignSelf: 'center'
                                    }}>

                                        <Text style={{ fontSize: 14, color: '#5C666F' }}> {'Detention Array'} </Text>
                                        <FlatList
                                            data={detentionArray}
                                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                            ListEmptyComponent={() => {
                                                return (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center', color: '#565758', fontFamily: fontFamily.textFontFamily }}>{'No Records Found'}</Text>
                                                    </View>
                                                )
                                            }}
                                            // columnWrapperStyle={{ flexDirection: props.isArabic ? 'row-reverse' : 'row' }}
                                            // initialNumToRender={5}
                                            renderItem={({ item, index }) => {
                                                return (
                                                    renderData(item, index)
                                                )
                                            }}
                                            ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                                        // numColumns={4}
                                        />

                                    </View> */}

                                    <View style={{
                                        marginTop: 10,
                                        height: HEIGHT * 0.3, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>

                                        <View style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Final Inspection Result"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.finalResult ? mappingData.finalResult : ''}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نتيجة الفحص النهائية"}</Text>
                                            </View>

                                        </View>
                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Score"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>  {mappingData.ScorePercent ? (mappingData.ScorePercent !='') && !isNaN(parseFloat(mappingData.ScorePercent)) ? parseFloat(mappingData.ScorePercent).toFixed(2): '' : '-'} </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"أحرز هدفا"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Grace Period"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}> {mappingData.GracePeriod ? (mappingData.GracePeriod == 1) ? '-' :mappingData.GracePeriod : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"فترة السماح"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Next Visit Date"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}> {mappingData.next_visit_date ? mappingData.next_visit_date : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ الزيارة القادمة"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Adfca inspector sign"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"توقيع التفتيش"}  </Text>
                                            </View>

                                        </View>



                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Client Sign"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                {/* <Text style={{ color: 'black', textAlign: 'center' }}>  </Text>
                                                
                                               
                                                */}
                                                <Image resizeMode="contain" style={{ height: '100%', width: '100%' }} source={{ uri: signature }} />
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تسجيل العميل إنشاء"}</Text>
                                            </View>

                                        </View>

                                    </View>

                                    <View style={{ marginTop: 10, height: HEIGHT * 0.1, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: fontColor.greenShade }}>

                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"Note :To make any complaints(or) to appeal against the result of this inspection report,please call 800555"} </Text>

                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"ملاحظة: لتقديم أي شكوى (أو) للاستئناف على نتيجة تقرير التفتيش هذا ، يرجى الاتصال على 800555"} </Text>

                                    </View>

                                </View>
                            </ViewShot>
                        </View>
                    </ScrollView>

                </View>

                {isClick.pdfCreated ?
                    <View style={{ height: HEIGHT * 0.05, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: "space-evenly", alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={viewPDF}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14, width: '100%', textAlign: 'center' }}>{"View PDF"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={shareOptions}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14, width: '100%', textAlign: 'center' }}>{"Share PDF"}</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <View style={{ height: HEIGHT * 0.05, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={myAsyncPDFFunction}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 14, width: '100%', textAlign: 'center' }}>{"Create PDF"}</Text>
                        </TouchableOpacity>
                    </View>
                }
            </Animatable.View>
        </View >
    );
}

const styles = StyleSheet.create({
    textModal: {
        position: 'absolute',
        width: WIDTH * 0.9,
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        top: HEIGHT * 0.02,
        zIndex: 8
    },
    alerttext: {
        fontSize: 18,
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        // textAlign: 'justify',
        // marginBottom: '5%',
        fontWeight: 'bold',
        color: 'white'
    },
    confirmMsg: {
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        fontSize: 15,
        color: 'black',
    },
    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    }
});

export default ModalComponent;