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
    let loginData = RealmController.getLoginData(realm, LoginSchema.name);
    loginData = loginData['0'] ? loginData['0'] : {};

    useEffect(() => {

        let establishData = props.establishData;
        setEstablishedData(establishData);
        let tempMappingData = ((typeof (props.data.mappingData) == 'string') && (props.data.mappingData !== '')) ? JSON.parse(props.data.mappingData) : props.data.mappingData;
        let temp = []
        // alert(JSON.stringify(mappingData))


        var signatureBase64 = 'data:image/png;base64,' + tempMappingData[0].signatureBase64;
        // //console.log("Signature",signatureBase64);
        setSignature(signatureBase64);

        let samplingReport = tempMappingData['0'].samplingReport && tempMappingData['0'].samplingReport.length ? tempMappingData['0'].samplingReport : props.sampleArr;
        let samplingArr = [];

        if (samplingReport.length) {

            for (let indexSampling = 0; indexSampling < samplingReport.length; indexSampling++) {
                const elementSampling = samplingReport[indexSampling];
                let Arr = [];
                Arr = [
                    { ArabicName: Strings['ar'].samplingForm.sampleCollectionReason, EnglishName: Strings['en'].samplingForm.sampleCollectionReason, value: elementSampling.sampleCollectionReason },
                    { ArabicName: Strings['ar'].samplingForm.sampleName, EnglishName: Strings['en'].samplingForm.sampleName, value: elementSampling.sampleName },
                    { ArabicName: Strings['ar'].samplingForm.sampleDateCollectionName, EnglishName: Strings['en'].samplingForm.sampleDateCollectionName, value: elementSampling.dateofSample },
                    { ArabicName: Strings['ar'].samplingForm.sampleStatusCollected, EnglishName: Strings['en'].samplingForm.sampleStatusCollected, value: elementSampling.sampleState },
                    { ArabicName: Strings['ar'].samplingForm.sampleTemp, EnglishName: Strings['en'].samplingForm.sampleTemp, value: elementSampling.sampleTemperature },
                    { ArabicName: Strings['ar'].samplingForm.remainingQuantities, EnglishName: Strings['en'].samplingForm.remainingQuantities, value: elementSampling.remainingQuantity },
                    { ArabicName: Strings['ar'].samplingForm.serialNumber, EnglishName: Strings['en'].samplingForm.serialNumber, value: elementSampling.serialNumber },
                    { ArabicName: Strings['ar'].samplingForm.type, EnglishName: Strings['en'].samplingForm.type, value: elementSampling.type },
                    { ArabicName: Strings['ar'].samplingForm.unit, EnglishName: Strings['en'].samplingForm.unit, value: elementSampling.unit },
                    { ArabicName: Strings['ar'].samplingForm.quantity, EnglishName: Strings['en'].samplingForm.quantity, value: elementSampling.quantity },
                    { ArabicName: Strings['ar'].samplingForm.netWeight, EnglishName: Strings['en'].samplingForm.netWeight, value: elementSampling.netWeight },
                    { ArabicName: Strings['ar'].samplingForm.package, EnglishName: Strings['en'].samplingForm.package, value: elementSampling.package },
                    { ArabicName: Strings['ar'].samplingForm.batchNumber, EnglishName: Strings['en'].samplingForm.batchNumber, value: elementSampling.batchNumber },
                    { ArabicName: Strings['ar'].samplingForm.brandName, EnglishName: Strings['en'].samplingForm.brandName, value: elementSampling.brandName },
                    { ArabicName: Strings['ar'].samplingForm.productionDate, EnglishName: Strings['en'].samplingForm.productionDate, value: elementSampling.productionDate },
                    { ArabicName: Strings['ar'].samplingForm.expiryDate, EnglishName: Strings['en'].samplingForm.expiryDate, value: elementSampling.expiryDate },
                    { ArabicName: Strings['ar'].samplingForm.countryOrigin, EnglishName: Strings['en'].samplingForm.countryOrigin, value: elementSampling.countryOfOrigin },
                    { ArabicName: Strings['ar'].samplingForm.typeOfAnalysis, EnglishName: Strings['en'].samplingForm.typeOfAnalysis, value: 'Sampling' },
                    { ArabicName: Strings['ar'].samplingForm.remarks, EnglishName: Strings['en'].samplingForm.remarks, value: elementSampling.remarks }
                    // { ArabicName:Strings['ar'].,EnglishName: Strings['en'].samplingForm.attachments, value: elementSampling.attachment1 },
                    // { ArabicName:Strings['ar'].,EnglishName: Strings['en'].samplingForm.attachments, value: elementSampling.attachment2 }

                ]
                samplingArr.push(Arr);
            }

        }
        setSamplingArray(samplingArr);

        let condemnationReport = tempMappingData['0'].condemnationReport && tempMappingData['0'].condemnationReport.length ? tempMappingData['0'].condemnationReport : props.sampleArr;

        // let condemnationReport = tempMappingData['0'].condemnationReport ? tempMappingData['0'].condemnationReport : [];
        let condemnationArr = [];

        if (condemnationReport.length) {

            for (let indexCondemation = 0; indexCondemation < condemnationReport.length; indexCondemation++) {
                const elementCondemnation = condemnationReport[indexCondemation];
                let Arr = [];
                Arr = [
                    // { ArabicName:Strings['ar'].,EnglishName: Strings['en'].samplingForm.serialNumber, value: elementCondemnation.serialNumber },
                    { ArabicName: Strings['ar'].condemnationForm.productName, EnglishName: Strings['en'].condemnationForm.productName, value: elementCondemnation.productName },
                    { ArabicName: Strings['ar'].samplingForm.unit, EnglishName: Strings['en'].samplingForm.unit, value: elementCondemnation.unit },
                    { ArabicName: Strings['ar'].samplingForm.quantity, EnglishName: Strings['en'].samplingForm.quantity, value: elementCondemnation.quantity },
                    { ArabicName: Strings['ar'].samplingForm.netWeight, EnglishName: Strings['en'].samplingForm.netWeight, value: elementCondemnation.netWeight },
                    { ArabicName: Strings['ar'].samplingForm.package, EnglishName: Strings['en'].samplingForm.package, value: elementCondemnation.package },
                    { ArabicName: Strings['ar'].samplingForm.batchNumber, EnglishName: Strings['en'].samplingForm.batchNumber, value: elementCondemnation.batchNumber },
                    { ArabicName: Strings['ar'].samplingForm.brandName, EnglishName: Strings['en'].samplingForm.brandName, value: elementCondemnation.brandName },
                    { ArabicName: Strings['ar'].samplingForm.remarks, EnglishName: Strings['en'].samplingForm.remarks, value: elementCondemnation.remarks },
                    { ArabicName: Strings['ar'].condemnationForm.place, EnglishName: Strings['en'].condemnationForm.place, value: elementCondemnation.place },
                    { ArabicName: Strings['ar'].condemnationForm.reason, EnglishName: Strings['en'].condemnationForm.reason, value: elementCondemnation.reason }
                ]
                condemnationArr.push(Arr);
            }
        }

        setCondemnationArray(condemnationArr);
        let detentionReport = tempMappingData['0'].detentionReport && tempMappingData['0'].detentionReport.length ? tempMappingData['0'].detentionReport : props.sampleArr;

        // let detentionReport = tempMappingData['0'].detentionReport ? tempMappingData['0'].detentionReport : [];
        let detentionArr = [];

        if (detentionReport.length) {

            for (let indexDetention = 0; indexDetention < detentionReport.length; indexDetention++) {
                const elementDetention = detentionReport[indexDetention];
                let Arr = [];
                Arr = [
                    // { ArabicName:Strings['ar'].detentionForm.serialNumber,EnglishName: Strings['en'].detentionForm.serialNumber, value: elementDetention.serialNumber },
                    { ArabicName: Strings['ar'].detentionForm.type, EnglishName: Strings['en'].detentionForm.type, value: elementDetention.type },
                    { ArabicName: Strings['ar'].detentionForm.unit, EnglishName: Strings['en'].detentionForm.unit, value: elementDetention.unit },
                    { ArabicName: Strings['ar'].detentionForm.quantity, EnglishName: Strings['en'].detentionForm.quantity, value: elementDetention.quantity },
                    { ArabicName: Strings['ar'].detentionForm.netWeight, EnglishName: Strings['en'].detentionForm.netWeight, value: elementDetention.netWeight },
                    { ArabicName: Strings['ar'].detentionForm.package, EnglishName: Strings['en'].detentionForm.package, value: elementDetention.package },
                    { ArabicName: Strings['ar'].detentionForm.batchNumber, EnglishName: Strings['en'].detentionForm.batchNumber, value: elementDetention.batchNumber },
                    { ArabicName: Strings['ar'].detentionForm.brandName, EnglishName: Strings['en'].detentionForm.brandName, value: elementDetention.brandName },
                    { ArabicName: Strings['ar'].detentionForm.productionDate, EnglishName: Strings['en'].detentionForm.productionDate, value: elementDetention.productionDate },
                    { ArabicName: Strings['ar'].samplingForm.expiryDate, EnglishName: Strings['en'].samplingForm.expiryDate, value: elementDetention.expiryDate },
                    { ArabicName: Strings['ar'].detentionForm.reason, EnglishName: Strings['en'].detentionForm.reason, value: elementDetention.reason },
                    { ArabicName: Strings['ar'].samplingForm.countryOrigin, EnglishName: Strings['en'].samplingForm.countryOrigin, value: elementDetention.countryOfOrigin },
                    { ArabicName: Strings['ar'].samplingForm.remarks, EnglishName: Strings['en'].samplingForm.remarks, value: elementDetention.remarks },
                    { ArabicName: Strings['ar'].detentionForm.decisions, EnglishName: Strings['en'].detentionForm.decisions, value: elementDetention.decisions }
                ]
                detentionArr.push(Arr);
            }

        }

        setDetentionArray(detentionArr);

        let tempData = props.data;
        let name = tempData.LoginName ? tempData.LoginName : loginData.username;
        let name1 = name.replace(".", " ");
        setLoginName(name1);
        setInspectionDetails(tempData);
        setMappingData(tempMappingData[0]);

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
            <View style={{ backgroundColor: (index % 2) ? 'white' : fontColor.lightGrey, height: HEIGHT * 0.055, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{item.EnglishName} </Text>
                </View>

                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                    <Text style={{ color: 'black', textAlign: 'center' }}>{item.value ? item.value : '-'}  </Text>
                </View>

                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{item.ArabicName}</Text>
                </View>

            </View>
        )
    }

    const onCapture = (uri: any) => {
        let newUri = uri.substring(7)
        setImageUri(newUri);
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


                                    <View style={{ height: HEIGHT * 0.025, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{props.condemnation ? "Condemnation Report" : props.detention ? "Detention Report" : "Sample Collection Form"} </Text>
                                        </View>

                                        <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                            <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{" استمارة جمع عينات "} </Text>
                                        </View>
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
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{establishedData.establishmentName ? establishedData.establishmentName : '-'}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم العميل"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Identification Number"} </Text>
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
                                                {/* <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{props.condemnation ? 'Certificate No' : props.detention ? 'ADFCA  Certificate No:' : "License No"} </Text> */}
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"License No"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{mappingData.LicenseCode ? mappingData.LicenseCode : inspectionDetails.LicenseCode}  </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                {/* <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{props.detention ? 'رقم شهادة رقابة الأغذية:' : props.condemnation ? "رقم الرخصة" : 'رقم شهادة رقابة الأغذية:'} </Text> */}
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'رقم شهادة رقابة الأغذية:'} </Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                {/* <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}> {props.condemnation ? "Certificate Expiry Date:" : props.detention ? 'ADFCA Certificate Expiry Date' : "License Expiry Date"} </Text> */}
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}> {"License Expiry Date"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{props.condemnation ? 'trade expiry date' : mappingData.TradeExpiryDate ? mappingData.TradeExpiryDate : '-'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                {/* <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{props.detention ? 'تاريخ إنتهاء شهادة رقابة الأغذية:' : props.condemnation ? "تاريخ انتهاء الترخيص" : "تاريخ إنتهاء شهادة رقابة الأغذية:"}</Text> */}
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ انتهاء الترخيص"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: 'white', height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Type Of Inspection"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{'Sampling'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"نوع الفحص"}</Text>
                                            </View>

                                        </View>

                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                {/* <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{props.condemnation ? "Date of condemnation" : "Date Of detention"} </Text> */}
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{props.condemnation ? "Date of condemnation" : "Date Of detention"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.CompletionDate}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{props.condemnation ? "تاريخ الحجز" : "تاريخ الاتلاف:"}</Text>
                                            </View>

                                        </View>


                                        {/* <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Name Of inspector"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{loginName}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المفتش"}</Text>
                                            </View>

                                        </View> */}

                                    </View>

                                    <View style={{ height: 20 }} />

                                    {props.condemnation ?

                                        <View style={{ height: 'auto', flex: 1, borderWidth: 0 }}>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'بعد التفتيش على المواد الغذائية المذكورة ادناه تبين أنها غير مطابقة للمواصفات / غير مستوفية وعليه سيتم اتلافها بموافقة صاحب الشأن'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'Upon inspection of the below mentioned foodstuff, it has been found unfit / non-compliance. Therefore below mentioned food stuff are to be condemned with the agreement of the food establishment owner:'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'بعد التفتيش على المواد المذكورة ادناه تبين انها غير صالحة/غير مطابقة وعليه سيتم اتلافها بعد موافقة صاحب الشأن وتفاصيل ذلك كما يلي '}</Text>
                                            </View>

                                        </View>

                                        : null
                                    }

                                    {props.detention ?

                                        <View style={{ height: 'auto', flex: 1, borderWidth: 0 }}>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{`:تعهد بحجز الأغذية المذكورة أدناه
- أنا أوافق على حجز المواد الغذائية المذكورة أدناه وأتعهد بأن المواد الغذائية المذكورة أدناه لن يسمح بإستخدامها أو التصرف بها لحين تلقي تقارير مستوفية للفحص المخبري وأنا أوافق أيضاً على إتلاف المواد الغذائية المذكورة أدناه، إذا كانت تقارير الفحص المخبري غير مستوفية وفقا لأحكام قانون الغذاء رقم 2 لعام 2008.
`}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'Undertaking for Detention of below mentioned Food:'}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{'I hereby agree for detention of below mentioned Food items. I hereby undertake that below mentioned food items will not be allowed for use until receipt of satisfactory laboratory test report. I further agree for condemnation of below mentioned food stuff, if laboratory test reports are not satisfactory according to the Food Law No. 2 of 2008. '}</Text>
                                            </View>

                                        </View>

                                        : null
                                    }

                                    <View style={{ height: 20 }} />
                                    {props.detention ?

                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Details of Detained Food:"} </Text>
                                            </View>

                                            <View style={{ flex: 0.1, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                {/* <Text style={{ color: 'black', textAlign: 'center' }}>{loginName}</Text> */}
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تفاصيل المادة الغذائية المحجوزة"}</Text>
                                            </View>

                                        </View>
                                        : null
                                    }

                                    <View style={{ height: 20 }} />

                                    <View style={{
                                        width: '95%', alignSelf: 'center', borderWidth: 2, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>

                                        {/* <Text style={{ fontSize: 14, color: '#5C666F' }}> {'Sampling Array'} </Text> */}
                                        {
                                            props.sampling &&
                                                samplingArray.length ?
                                                samplingArray.map((item: any, index: number) => (
                                                    <FlatList
                                                        data={item}
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
                                                    // ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                                                    // numColumns={4}
                                                    />

                                                ))
                                                :
                                                null

                                        }

                                        {
                                            props.condemnation && condemnationArray.length ?
                                                condemnationArray.map((item: any, index: number) => (
                                                    <FlatList
                                                        data={item}
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
                                                    // ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                                                    // numColumns={4}
                                                    />

                                                ))
                                                : null}

                                        {
                                            props.detention && detentionArray.length ?
                                                detentionArray.map((item: any, index: number) => (
                                                    <FlatList
                                                        data={item}
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
                                                    // ItemSeparatorComponent={() => (<View style={{ height: 10 }} />)}
                                                    // numColumns={4}
                                                    />

                                                ))
                                                :
                                                null
                                        }


                                    </View>


                                    <View style={{ height: 20 }} />

                                    {/* <View style={{
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
                                    {/* 
                                    {props.condemnation ?
                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Reason:"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{condemnationArray[0].reason}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"سبب"}</Text>
                                            </View>

                                        </View>
                                        : null
                                    } */}

                                    {/* {props.detention ?
                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Reason of detention::"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{ }</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"أسباب الحجز"}</Text>
                                            </View>

                                        </View>

                                        : null
                                    } */}

                                    {/* {props.detention ?
                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Remarks:"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{ }</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"ملاحظات"}</Text>
                                            </View>

                                        </View>

                                        : null
                                    }
                                    {props.detention ?
                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Decisions:"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{ }</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"القرارات"}</Text>
                                            </View>

                                        </View>

                                        : null
                                    } */}
                                    <View style={{
                                        marginTop: 10,
                                        height: HEIGHT * 0.3, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                        shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                    }}>

                                        <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Name Of inspector"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>{loginData.username}</Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"اسم المفتش"}</Text>
                                            </View>

                                        </View>

                                        {props.condemnation ? null :
                                            <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Adfca inspector sign"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Image resizeMode="contain" style={{ height: '100%', width: '100%' }} source={{ uri: signature }} />
                                                    {/* <Text style={{ color: 'black', textAlign: 'center' }}>  </Text> */}
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"توقيع التفتيش"}  </Text>
                                                </View>

                                            </View>
                                        }

                                        {props.condemnation ? null :
                                            <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"ADFCA Employment Id no"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ color: 'black', textAlign: 'center' }}> {'-'}  </Text>
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"	الرقم الوظيفي للمفتش"}</Text>
                                                </View>

                                            </View>
                                        }
                                        <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                            <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Client Signature"} </Text>
                                            </View>

                                            <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                <Text style={{ color: 'black', textAlign: 'center' }}>   </Text>
                                            </View>

                                            <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"توقيع صاحب العلاقة"}</Text>
                                            </View>

                                        </View>

                                        {props.condemnation||props.sampling ? null :
                                            <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>

                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Establishment Client Sign"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    {/* <Text style={{ color: 'black', textAlign: 'center' }}>  </Text>
                                                
                                               
                                                */}
                                                    {/* <Image resizeMode="contain" style={{ height: '100%', width: '100%' }} source={{ uri: signature }} /> */}
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تسجيل العميل إنشاء"}</Text>
                                                </View>

                                            </View>
                                        }

                                        {props.condemnation ?
                                            <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>

                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Division Director Signature:"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Image resizeMode="contain" style={{ height: '100%', width: '100%' }} source={{ uri: signature }} />
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"توقيع مدير الإدارة:"}</Text>
                                                </View>

                                            </View>
                                            : null}
                                    </View>

                                    {props.condemnation ?

                                        <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"ملاحظة: للشكاوي (أو) التظلم بخصوص نتائج تقرير التفتيش، يرجى الإتصال على 800555"} </Text>
                                        </View>

                                        : null
                                    }

                                    {props.condemnation ? null :
                                        <View style={{ height: HEIGHT * 0.06, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-start' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{"Sample Management Section"} </Text>
                                            </View>

                                            <View style={{ height: HEIGHT * 0.05, width: '45%', justifyContent: 'center', alignItems: 'flex-end' }}>

                                                <Text style={{ color: fontColor.TitleColor, fontSize: 14, textAlign: 'right', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{" قسم إدارة العينات"} </Text>
                                            </View>
                                        </View>
                                    }

                                    {props.condemnation ? null :
                                        <View style={{
                                            marginTop: 10,
                                            height: HEIGHT * 0.3, width: '95%', alignSelf: 'center', justifyContent: 'flex-start', borderWidth: 2, borderColor: fontColor.greenShade,
                                            shadowRadius: 1, backgroundColor: fontColor.white, borderRadius: 10, shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                                        }}>

                                            <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Sample Receipt date"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ color: 'black', textAlign: 'center' }}>{inspectionDetails.CompletionDate}</Text>
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"تاريخ استلام العينة"}</Text>
                                                </View>

                                            </View>

                                            <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Time of sample receipt"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ color: 'black', textAlign: 'center' }}>  </Text>
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{" وقت استلام العينة"}  </Text>
                                                </View>

                                            </View>

                                            <View style={{ backgroundColor: fontColor.white, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Name "} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ color: 'black', textAlign: 'center' }}> {'-'}  </Text>
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"الاسم"}</Text>
                                                </View>

                                            </View>

                                            <View style={{ backgroundColor: fontColor.lightGrey, height: 'auto', flex: 1, flexDirection: 'row', borderWidth: 0, borderColor: fontColor.grey }}>
                                                <View style={{ flex: 0.3, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: "center" }}>{"Signature"} </Text>
                                                </View>

                                                <View style={{ flex: 0.4, justifyContent: 'center', borderRightColor: fontColor.greenShade, borderRightWidth: 2 }}>
                                                    <Text style={{ color: 'black', textAlign: 'center' }}>   </Text>
                                                </View>

                                                <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'black', textAlign: 'center' }}>{"التوقيع "}</Text>
                                                </View>

                                            </View>

                                        </View>
                                    }
                                    <View style={{ marginTop: 10, height: HEIGHT * 0.1, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', backgroundColor: fontColor.greenShade }}>

                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"ملاحظة: للشكاوي (أو) التظلم بخصوص نتائج تقرير التفتيش، يرجى الإتصال على 800555"} </Text>

                                        <Text style={{ color: "#58595b", fontSize: 14, textAlign: 'center', fontWeight: '600', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{"Note:  To make any complaints (or) to appeal against the result of this inspection report, please call 800555"} </Text>

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