import React, { useContext, useState, useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, TouchableOpacity, Dimensions, FlatList, ToastAndroid, CheckBox, Alert } from "react-native";
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import TaskSchema from '../database/TaskSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import TableComponent from './../components/TableComponent';
let realm = RealmController.getRealmInstance();
import EstablishmentSchema from '../database/EstablishmentSchema';
import { useIsFocused } from '@react-navigation/native';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

var count: any = 0;
var listOfEst: any = []

const CampaignDetail = (props: any) => {

    const context = useContext(Context);

    const [campaignDetails, setCampaignDetails] = useState(Object());
    const [listOfAdfcaAccount, setListOfAdfcaAccount] = useState(Object());
    const [isAcknowledge, setIsAcknowledge] = useState(Boolean);
    const [listOfEstArray, setListOfEstArray] = useState(Array());
    const [actionSelected, setActionSelected] = useState(false);

    const isFocused = useIsFocused();

    const mapStore = (rootStore: RootStoreModel) => ({ establishmentDraft: rootStore.establishmentModel, myTasksDraft: rootStore.myTasksModel, licenseDraft: rootStore.licenseMyTaskModel, efstDraft: rootStore.eftstModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, bottomBarDraft: rootStore.bottomBarModel })
    const { establishmentDraft, myTasksDraft, adhocTaskEstablishmentDraft, bottomBarDraft } = useInject(mapStore)

    const [isClick, setIsClick] = useState({
        campaignClick: false,
        estListClick: true
    });

    useEffect(() => {
        // const campaignDetailsTemp = props.route ? props.route.params ? props.route.params.inspectionDetails : {} : {};
        const campaignDetailsTemp = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};

        let mappingData = campaignDetailsTemp.mappingData && (typeof (campaignDetailsTemp.mappingData) == 'string') ? JSON.parse(campaignDetailsTemp.mappingData) : campaignDetailsTemp.mappingData ? campaignDetailsTemp.mappingData : [];
        let tempMapping = Array();

        let estdata = typeof campaignDetailsTemp.ListOfAdfcaAccountThinBc == "object" ? campaignDetailsTemp.ListOfAdfcaAccountThinBc : JSON.parse(campaignDetailsTemp.ListOfAdfcaAccountThinBc);
        setListOfAdfcaAccount(estdata);

        // console.log('324234 ::' + mappingData.length);

        let presentedMappingData = Array();
        if (estdata.Establishment.length) {
            for (let index = 0; index < estdata.Establishment.length; index++) {
                const elementMain = estdata.Establishment[index];

                if (mappingData && !mappingData.length) {
                    // console.log('elementMain' + JSON.stringify(elementMain));

                    let obj = {
                        addressIDs: [
                            {
                                AddressLine1: "",
                                AddressLine2: "",
                                City: "",
                                Country: "",
                                lat: "",
                                long: "",
                                PostalCode: null
                            }
                        ],
                        Area: "",
                        completionDate: '',
                        completionDateWithDayRemaining: '',//pending
                        condemnationReport: [],
                        samplingReport: [],
                        detentionReport: [],
                        ContactName: "",//signature page 
                        ContactNumber: "",
                        CustomerName: elementMain.EstablishmentName,//Establishment
                        CustomerNameEnglish: elementMain.EstablishmentName,
                        EFSTFlag: false,//false compalsary
                        EHSRiskClassification: "",//Establishment resp
                        EmiratesId: "",
                        EstablishmentClass: "",//Establishment resp
                        EstablishmentDetailsList: undefined,
                        EstablishmentId: elementMain.Id,
                        EstablishmentType: "",
                        finalResult: "",//lowest score
                        Grade: null,
                        grade: null,
                        grade_percentage: "",
                        inspectionForm: [],
                        InspectortobeEvaluatedId: null,
                        InspFullName: " ",
                        isCompltedOffline: false,
                        isuploadedToserver: false,
                        isViolated: "false",//score 0 asal tar
                        LicenseCode: elementMain.LicenseCode,
                        LicenseNumber: elementMain.LicenseNumber,
                        LicenseSource: "",
                        ManagerID: null,//contact page
                        ManagerMobile: null,
                        ManagerName: null,
                        MobileNumber: "",//Establishment resp
                        next_visit_date: "",//calculate
                        NumOfEST: elementMain.NumOfEST,
                        onlineReq: '',
                        onlineRes: [],
                        overallComments: "",
                        PendingRequests: [],
                        PlanAbuDhabi: null,
                        PlanAlAin: null,
                        PlanAlGharbia: null,
                        PlanEndDate: null,
                        PlanId: null,
                        PlanName: null,
                        PlanNumber: null,
                        PlanStartDate: null,
                        PlanStatus: null,
                        printingelementect: {
                            ActualInspectionDate: "",
                            Address: "",
                            BusinessActivity: campaignDetails.BusinessActivity,
                            CertificateExpDate: "",//Establishment resp
                            CertificateNo: elementMain.LicenseCode,//LicenseCode
                            ClientName: '',//ContactName
                            CustomerSignature: "",
                            Duration: "",
                            EquipmentsUsed: "",
                            EstablishNameInArabic: "",
                            IdentificationNumber: "",
                            InspectionNearestGracePeriod: '',//finala grace peroid
                            InspectionNo: campaignDetails.TaskId,//taskId
                            InspectionOverallInspectionComment: "",
                            InspectionResult: "",//final result
                            InspectionUserID: '',
                            InspectorName: '',
                            isSatisfactory: "",//depend on finalResult
                            LicenseExpiryDate: "",
                            MajorNonComplianceInspectionParameter: [],
                            MinorNonComplianceInspectionParameter: [],
                            ModerateNonComplianceInspectionParameter: [],
                            OmittedInspectionParameter: [],
                            PhoneNo: "",
                            ScheduledInspectionDate: "",//completionDate0
                            TypeofInspection: campaignDetails.TaskType
                        },
                        printingReport: [],
                        ResponseSubmitted: null,
                        SampleSize: null,
                        Scope: "",// resp
                        Sector: null,
                        signatureBase64: "",
                        taskId: campaignDetails.TaskId,
                        tempScore: '',//overall min score
                        TimeElapsed: "",//start checklist
                        timerStarted: "",
                        TimeStarted: "",//start checklist
                        total_score: '',
                        TradeExpiryDate: "",//Establishment resp
                        TradeLicenseCreatedDate: "",//Establishment resp
                        TradeLicenseNumber: "",// Establishment resp
                        dataLoggerCBValue: false,
                        luxmeterCBValue: false,
                        flashlightCBValue: false,//equipment page
                        thermometerCBValue: false,
                        UVlightCBValue: false,
                        Visittype: ""
                    }
                    tempMapping.push(obj);
                }
            }
        }
        if (tempMapping.length == 0) {
            tempMapping = campaignDetailsTemp.mappingData && (typeof (campaignDetailsTemp.mappingData) == 'string') ? JSON.parse(campaignDetailsTemp.mappingData) : campaignDetailsTemp.mappingData ? campaignDetailsTemp.mappingData : [];
        }
        campaignDetailsTemp.mappingData = JSON.stringify(tempMapping);
        myTasksDraft.setCampaignMappingData(JSON.stringify(tempMapping))
        // console.error("campaignDetailsTemptempMapping.length::" + JSON.stringify(tempMapping[1]))
        // //console.log("stInsp1::" + JSON.stringify(taskDetails.mappingData['0'].condemnationReport))
        // //console.log("stInsp1::" + JSON.stringify(taskDetails.mappingData['0'].samplingReport))

        if (mappingData < 1) {
            RealmController.addTaskDetails(realm, campaignDetailsTemp, TaskSchema.name, () => {

            });
        }
        setCampaignDetails(campaignDetailsTemp);

        count = 0;
        listOfEst = [];
        bottomBarDraft.setProfileClisk(false)
        // callToAccountSync(0)            
        if (campaignDetailsTemp) {
            myTasksDraft.setSelectedTask(JSON.stringify(campaignDetailsTemp))
        }

        if (myTasksDraft.getIsSuccess()) {
            myTasksDraft.setState("done")
            myTasksDraft.setIsSuccess(false)
            setListOfEstArray([])
            setIsClick(prevState => {
                return { ...prevState, campaignClick: false, estListClick: true }
            });
            callToAccountSync(0)
            if (campaignDetails.TaskId) {
                myTasksDraft.setCampaignTaskId(campaignDetails.TaskId)
            }
        }

        return () => {
            myTasksDraft.setIsMyTaskClick('campaign')
            establishmentDraft.setEstablishmentDataBlank()
            adhocTaskEstablishmentDraft.setSelectedItem('')
        }
    }, [isFocused]);

    // const clearData = () => {
    //     myTasksDraft.setContactName('');
    //     myTasksDraft.setMobileNumber('');
    //     myTasksDraft.setEmiratesId('');
    //     myTasksDraft.setEvidanceAttachment1('')
    //     myTasksDraft.setEvidanceAttachment1Url('')
    //     myTasksDraft.setEvidanceAttachment2('')
    //     myTasksDraft.setEvidanceAttachment2Url('')
    //     myTasksDraft.setLicencesAttachment1('')
    //     myTasksDraft.setLicencesAttachment1Url('');
    //     myTasksDraft.setLicencesAttachment2('')
    //     myTasksDraft.setLicencesAttachment2Url('')
    //     myTasksDraft.setEmiratesIdAttachment1('')
    //     myTasksDraft.setEmiratesIdAttachment1Url('')
    //     myTasksDraft.setEmiratesIdAttachment2('')
    //     myTasksDraft.setEmiratesIdAttachment2Url('')
    //     myTasksDraft.setNoCheckList('')
    //     myTasksDraft.setResult('')
    //     myTasksDraft.setFinalComment('')
    //     myTasksDraft.setFlashlightValue(false)
    //     myTasksDraft.setThermometerCBValue(false)
    //     myTasksDraft.setDataLoggerCBValue(false)
    //     myTasksDraft.setLuxmeterCBValue(false)
    //     myTasksDraft.setUVlightCBValue(false)
    //     myTasksDraft.setIsAlertApplicableToCurrentEst(false)
    //     myTasksDraft.setIsAlertApplicableNoToCurrentEst(false)
    //     myTasksDraft.setLatitude('')
    //     myTasksDraft.setLongitude('')
    //     myTasksDraft.setPercentage('')
    //     myTasksDraft.setTotalScore('')
    //     myTasksDraft.setMaxScore('')
    //     myTasksDraft.setGrade('')
    //     documantationDraft.setFileBuffer('')
    // }

    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'getChecklistSuccess') {
            // clearData()
            NavigationService.navigate('StartInspection');
            myTasksDraft.setState('done');
        }
    }, [myTasksDraft.state == 'getChecklistSuccess']);


    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'getCampaignChecklistSuccess') {
            // clearData()
            NavigationService.navigate('StartInspection');
        }
    }, [myTasksDraft.state == 'getCampaignChecklistSuccess']);

    useEffect(() => {
        debugger;
        if (myTasksDraft.state == 'acknowledgeSuccess') {
            setIsAcknowledge(true);
        }
    }, [myTasksDraft.state == 'acknowledgeSuccess']);

    const callToAccountSync = (i: any) => {

        // alert(listOfEstArray.length)
        if (listOfEstArray.length < 1 && listOfAdfcaAccount && listOfAdfcaAccount.Establishment && listOfAdfcaAccount.Establishment.length > 0) {
            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, listOfAdfcaAccount.Establishment[i].Alias);

            // console.log('temp' + JSON.stringify(temp));

            if (temp && temp[0]) {
                listOfEst.push(temp[0])
                // console.log("/jdgytaduywajdo;lead::" + JSON.stringify(temp[0]))
                count = count + 1
                if (listOfAdfcaAccount.Establishment.length - 1 >= count) {

                    callToAccountSync(count)

                } else {
                    setListOfEstArray(listOfEst)
                }
            }
            else {
                let licenseNumber = listOfAdfcaAccount.Establishment[i].Name
                if (licenseNumber == null) {
                    let templicenseNo = listOfAdfcaAccount.Establishment[i].FinAcctCurrentBank
                    templicenseNo = templicenseNo.split('-')
                    licenseNumber = templicenseNo[1]
                }

                establishmentDraft.callToAccountSyncService(licenseNumber, context.isArabic,true);
            }
        }
    }
    callToAccountSync(0)

    useEffect(() => {
        debugger;
        if (establishmentDraft.state == 'AccountSyncSuccess') {
            count = count + 1
            // //console.log("Count: ", count)

            if (establishmentDraft.response && establishmentDraft.response != "") {
                let res = JSON.parse(establishmentDraft.response)

                listOfEst.push(res[0])

                // }
            }

            if (listOfAdfcaAccount.Establishment.length - 1 >= count) {

                callToAccountSync(count)
            }
            else {

                setListOfEstArray(listOfEst)
                callToAccountSync(0)
                // //console.log("est Response: ", listOfEst)
            }

        }
    }, [establishmentDraft.state == 'AccountSyncSuccess']);

    const splitDate = (date: any) => {
        let tempDate1 = '';
        if (date && date != "") {
            let tempDate = date.split(" ")
            tempDate1 = tempDate[0].split("/")

        }
        return tempDate1;
    }

    const callToGetChecklist = () => {

        debugger;

        // //console.log("campaignDetails selectedTask: ",myTasksDraft.selectedTask)
        // //console.log("campaignDetails TaskId: ",campaignDetails.TaskId)
        myTasksDraft.setCheckListArray('')
        if (campaignDetails.TaskId) {
            myTasksDraft.setTaskId(campaignDetails.TaskId);
        }
        let campaignType = '';
        if (campaignDetails.CampaignType == null) {
            campaignType = '';
        }
        else {
            campaignType = campaignDetails.CampaignType;
        }
        if (listOfEstArray) {
            myTasksDraft.setEstListArray(JSON.stringify(listOfEstArray));
        }
        let selectedEst = listOfEstArray.filter((i: any, indx: number) => i.isSelected == true)
        let curr = ''
        for (let index = 0; index < listOfEstArray.length; index++) {
            const element = listOfEstArray[index];
            if (element.isSelected == true)
                curr = index
        }


        selectedEst = selectedEst[0] ? selectedEst[0] : {}
        // console.log("listOfEstArray: ", JSON.stringify(selectedEst) + "::" + (curr))
        myTasksDraft.setCampaignSelectedEstIndex(curr.toString());
        myTasksDraft.callToGetCampaignChecklistApi(campaignType, selectedEst, curr, campaignDetails, context.isArabic);

    }

    const renderListOfEst = (item: any, index: number) => {
        let mappingdatatmp = campaignDetails && campaignDetails.mappingData && campaignDetails.mappingData[index] ? campaignDetails.mappingData[index] : [];
        // let viewchecklistArr = mappingdatatmp.filter((itemmapping: any, inde: number) => itemmapping.EstablishmentId == item.Id)
        item.viewchecklist = mappingdatatmp.isCompltedOffline ? mappingdatatmp.isCompltedOffline : false
        // console.log("viewchecklistArr[0].isCompltedOffline:::" + index + "fdsfdsfds" + JSON.stringify(JSON.parse(myTasksDraft.campaignMappingData)[index]));

        return (

            <TouchableOpacity
                onPress={() => {
                    //console.log("renderListOfEst: ", JSON.stringify(item))
                    // if (!bottomBarDraft.profileClick) {
                    adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))
                    NavigationService.navigate('AdhocEstablishmentDetails')
                    // }
                }}
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.16, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.tradeLicense, value: item.LicenseCode },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseSource, value: item.LicenseSource },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentName, value: item.EnglishName },
                    {
                        keyName: Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.action, value:
                            <View style={{ flexDirection: 'row', height: '80%', flex: 1 }}>
                                {/* {item.isUploaded == "false" ? */}
                                {myTasksDraft.campaignMappingData != '' ? ((JSON.parse(myTasksDraft.campaignMappingData)[index]) && (JSON.parse(myTasksDraft.campaignMappingData)[index].isCompltedOffline == true)) ?
                                    <View style={{
                                        height: 30, width: 70, justifyContent: 'center',
                                    }}>
                                        <ButtonComponent

                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))

                                                const updated = listOfEstArray.map((item, i) => {
                                                    // item.isSelected = false;
                                                    if (i === index) {
                                                        if (item.isSelected) {
                                                            item.isSelected = false
                                                            setActionSelected(item.isSelected)
                                                        } else {
                                                            item.isSelected = true;
                                                            setActionSelected(item.isSelected)
                                                        }
                                                        setActionSelected(item.isSelected)
                                                    } else {
                                                        item.isSelected = false;
                                                        setActionSelected(item.isSelected)
                                                    }
                                                    return item;
                                                });

                                                setListOfEstArray(updated);
                                                callToGetChecklist()
                                            }}
                                            style={{ backgroundColor: 'transparent' }}
                                            viewchecklist={true}
                                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 10, fontWeight: 'bold', color: fontColor.TitleColor }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.view)}
                                        />
                                    </View>
                                    :
                                    <CheckBox
                                        value={item.isSelected}
                                        onValueChange={() => {

                                            adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))

                                            const updated = listOfEstArray.map((item, i) => {
                                                // item.isSelected = false;
                                                if (i === index) {
                                                    if (item.isSelected) {
                                                        item.isSelected = false
                                                        setActionSelected(item.isSelected)
                                                    } else {
                                                        item.isSelected = true;
                                                        setActionSelected(item.isSelected)
                                                    }
                                                    setActionSelected(item.isSelected)
                                                } else {
                                                    item.isSelected = false;
                                                    setActionSelected(item.isSelected)
                                                }
                                                return item;
                                            });

                                            setListOfEstArray(updated)
                                        }}
                                    />
                                    :
                                    <CheckBox
                                        value={item.isSelected}
                                        onValueChange={() => {
                                            adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))

                                            const updated = listOfEstArray.map((item, i) => {
                                                // item.isSelected = false;
                                                if (i === index) {
                                                    if (item.isSelected) {
                                                        item.isSelected = false
                                                        setActionSelected(item.isSelected)
                                                    } else {
                                                        item.isSelected = true;
                                                        setActionSelected(item.isSelected)
                                                    }
                                                    setActionSelected(item.isSelected)
                                                } else {
                                                    item.isSelected = false;
                                                    setActionSelected(item.isSelected)
                                                }
                                                return item;
                                            });

                                            setListOfEstArray(updated)
                                        }}
                                    />
                                }

                            </View>
                    },
                    ]}
                />

            </TouchableOpacity>
        )
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <Spinner
                    visible={establishmentDraft.state == 'pending' ? true : false}
                    textContent={establishmentDraft.loadingState != '' ? establishmentDraft.loadingState : 'Loading ...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' ? 1.1 : myTasksDraft.isMyTaskClick == 'history' ? 0.5 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaign}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'history' ? 0.8 : 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{campaignDetails.TaskId}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{''}</Text>
                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '86%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, height: '100%', justifyContent: 'center', backgroundColor: isClick.estListClick ? '#abcfbe' : 'white', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, campaignClick: false, estListClick: true }
                                });

                                callToAccountSync(0)
                                myTasksDraft.setCampaignTaskId(campaignDetails.TaskId)
                            }}
                            style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.estListClick ? '#abcfbe' : 'white', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }}>
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.listOfEstablishment}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ flex: 1, height: '100%', backgroundColor: isClick.campaignClick ? '#abcfbe' : 'white', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>

                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, campaignClick: true, estListClick: false }
                                });
                            }}
                            style={{ width: '100%', height: '100%', backgroundColor: isClick.campaignClick ? '#abcfbe' : 'white', justifyContent: 'center', borderTopRightRadius: 16, borderBottomRightRadius: 16 }} >
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.campaignPlanDetails}</Text>
                        </TouchableOpacity>

                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                {isClick.estListClick ?
                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ height: 1 }} />
                        <FlatList
                            nestedScrollEnabled={true}
                            data={listOfEstArray}
                            renderItem={({ item, index }) => {
                                return (
                                    renderListOfEst(item, index)
                                )
                            }}
                            extraData={true}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    </View>
                    :
                    null
                }

                {isClick.campaignClick ?

                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.planNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={campaignDetails.TaskId}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.comments)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    editable={false}
                                    isArabic={context.isArabic}
                                    value={campaignDetails.Comment}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange} />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.planStartDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CreatedDate)[1]}
                                        onChange={(val: string) => {

                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CreatedDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CreatedDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.expectedCompletionDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CompletionDate)[1]}
                                        onChange={(val: string) => {

                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CompletionDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CompletionDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.CompletionDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CompletionDate)[1]}
                                        onChange={(val: string) => {

                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CompletionDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        editable={false}
                                        value={splitDate(campaignDetails.CompletionDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>
                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.priority)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={campaignDetails.TaskPriority}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.Description)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.textInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    editable={false}
                                    value={campaignDetails.Description}
                                    maxLength={props.maxLength}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={''}
                                    keyboardType={props.keyboardType}
                                    onChange={props.onChange}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                    </View>
                    :
                    null
                }

                <View style={{ flex: 0.2 }} />

                {
                    campaignDetails.isCompleted ?
                        null
                        :
                        isClick.estListClick ?
                            <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '30%', alignSelf: 'center' }}>

                                <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                                    <ButtonComponent
                                        style={{
                                            height: '80%', width: '100%',
                                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        buttonClick={() => {
                                            myTasksDraft.setIsMyTaskClick('campaign')
                                            let isSelected = listOfEstArray.some((item) => item.isSelected === true)
                                            if (isSelected) {
                                                callToGetChecklist()
                                            } else {
                                                Alert.alert("", "Please select establishment to proceed..")
                                            }

                                        }}
                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.TitleColor }}
                                        buttonText={myTasksDraft.isMyTaskClick == 'CompletedTask' ? (Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.view) : (Strings[context.isArabic ? 'ar' : 'en'].campaignDetails.startCampaign)}
                                    />
                                </View>

                            </View>
                            : null
                }
                <View style={{ flex: 0.1 }} />

                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    space: {
        flex: 0.0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center"
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    }
});

export default observer(CampaignDetail);

