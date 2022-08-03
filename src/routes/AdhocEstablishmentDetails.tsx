import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, BackHandler, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
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
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"
import { RealmController } from './../database/RealmController';
import TaskSchema from './../database/TaskSchema';
import LoginSchema from './../database/LoginSchema';
let realm = RealmController.getRealmInstance();
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native';
let moment = require('moment');
import LOVSchema from '../database/LOVSchema';
import EstablishmentSchema from '../database/EstablishmentSchema';

const AdhocEstablishmentDetails = (props: any) => {

    const context = useContext(Context);
    const isFocused = useIsFocused();
    let dropdownRef1 = useRef(null);
    let dropdownRef2 = useRef(null);
    let dropdownRef3 = useRef();
    let dropdownRef4 = useRef(null);
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const mapStore = (rootStore: RootStoreModel) => ({
        myTasksDraft: rootStore.myTasksModel,
        adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, establishmentDraft: rootStore.establishmentModel,
        adhocTaskEstablishmentDetailsDraft: rootStore.adhocTaskEstablishmentDetailsModel, documantationDraft: rootStore.documentationAndReportModel
    })
    const { myTasksDraft, adhocTaskEstablishmentDraft, establishmentDraft, adhocTaskEstablishmentDetailsDraft, documantationDraft } = useInject(mapStore)

    const establishmentHistoryArray = [
        { image: require('./../assets/images/History/ServiceRequest.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.serviceRequest, code: 'serviceRequest' },
        { image: require('./../assets/images/History/Violation.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.violation, code: 'violation' },
        { image: require('./../assets/images/History/VehicleDetail.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.vehicleDetails, code: 'vehicleDetail' },
        { image: require('./../assets/images/History/Inspection.png'), title: Strings[props.isArabic ? 'ar' : 'en'].history.inspection, code: 'Inspection' },

    ]

    const unitArr = [
        { type: 'Direct Inspection', value: 'Direct Inspection' },
        { type: 'Bazar Inspection', value: 'Bazar Inspection' },
        { type: 'Sampling', value: 'Sampling' },
        { type: 'Condemnation', value: 'Condemnation' },
        { type: 'Detention', value: 'Detention' },
    ]

    const [clickedItemArray, setClickedItemArray] = useState(Object());
    const [businessActivityArray, setBusinessActivityArray] = useState(Array());
    const [bazarNameArray, setBazarNameArray] = useState(Array());
    const [subBusinessActivityArray, setsubBusinessActivityArray] = useState(Array());
    const [address, setAddress] = useState("");
    const [riskCategory, setRiskCategory] = useState("");
    const [hasBAActivity, setHasActivity] = useState(false);
    const [BASuccessFlag, setBASuccessFlag] = useState(false);
    const [isCampaign, setIsCampaign] = useState(false);
    const [isButtonClick, setIsButtonClick] = useState(false);
    const [spinner, setSpinner] = useState(false);

    // useEffect(() => {
    //     if (establishmentDraft.response != '') {
    //         let tempArray = Array()
    //         tempArray = JSON.parse(establishmentDraft.response)
    //         // setClickedItemArray(tempArray)
    //         let est = JSON.parse(adhocTaskEstablishmentDraft.clikedItem);
    //         console.log("aaaaaaaaaaaaaaaaaaaaa:::" + JSON.stringify(tempArray))
    //         console.log("aaaaaaaaaaaaaaaaaaaaesta:::" + JSON.stringify(est))
    //         for (let index = 0; index < tempArray.length; index++) {
    //             const element = tempArray[index];
    //             if ((element.LicenseNumber == est.LicenseNumber)&&(element.LicenseCode == est.LicenseCode)) {
    //                 setClickedItemArray(element);
    //                 break;
    //             }
    //         }

    //         if (myTasksDraft.isMyTaskClick == 'campaign') {

    //             setIsCampaign(true)
    //         }
    //         else {
    //             // console.log("tempArray[0]:::" + JSON.stringify(tempArray[0]))
    //             let tempA = Object();
    //             for (let index = 0; index < tempArray.length; index++) {
    //                 const element = tempArray[index];
    //                 if ((element.LicenseNumber == est.LicenseNumber)&&(element.LicenseCode == est.LicenseCode)) {
    //                      tempA = element;
    //                     break;
    //                 }
    //             }
    //             if (tempA) {

    //                 let tempAddress: any = (tempA.addressObj && (tempA.addressObj != '')) ? (JSON.parse(tempA.addressObj) && JSON.parse(tempA.addressObj).length ? JSON.parse(tempA.addressObj)[0] : {}) : {}
    //                 // let tempAddress: any = temp.EstablishmentAddress[0]
    //                 adhocTaskEstablishmentDetailsDraft.setLicenseNumber(tempA.LicenseCode ? tempA.LicenseCode : '')
    //                 adhocTaskEstablishmentDetailsDraft.setAccountType(tempA.AccountType ? tempA.AccountType : '')
    //                 adhocTaskEstablishmentDetailsDraft.setLicenseStartDate(tempA.LicenseRegDate ? tempA.LicenseRegDate : '')
    //                 adhocTaskEstablishmentDetailsDraft.setLicenseEndDate(tempA.LicenseExpiryDate ? tempA.LicenseExpiryDate : "")
    //                 adhocTaskEstablishmentDetailsDraft.setAddress1(tempAddress.AddressLine1 ? tempAddress.AddressLine1 : "")
    //                 adhocTaskEstablishmentDetailsDraft.setAddress2(tempAddress.AddressLine2 ? tempAddress.AddressLine2 : "")
    //                 adhocTaskEstablishmentDetailsDraft.setCity(tempA.City ? tempA.City : '')
    //                 setAddress((tempAddress.AddressLine1 ? tempAddress.AddressLine1 : "") + " " + (tempAddress.AddressLine2 ? tempAddress.AddressLine2 : "") + " " + (tempAddress.PostalCode ? tempAddress.PostalCode : "") + " " + (tempAddress.City ? tempAddress.City : "") + " " + (tempAddress.State ? tempAddress.State : "") + " " + (tempAddress.Country ? tempAddress.Country : ""))
    //             }
    //         }
    //     }
    // }, [establishmentDraft.response]);

    useEffect(() => {
        // console.log("focusue>>" + myTasksDraft.getBusinessActivityResponse + isButtonClick)
        if (!BASuccessFlag && !hasBAActivity) {
            let tempArray: any = [];
            if ((adhocTaskEstablishmentDraft.getSelectedItem() &&
                adhocTaskEstablishmentDraft.getSelectedItem() != "")) {

                tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))

                setSpinner(true)
                myTasksDraft.setState('pending');
                myTasksDraft.setLoadingState('Fetching BA');
                myTasksDraft.callToGetBAApi(JSON.parse(adhocTaskEstablishmentDraft.clikedItem), false);
            }
        }
        // if (myTasksDraft.getBusinessActivityRes() && myTasksDraft.getBusinessActivityRes() != "" && (businessActivityArray.length == 0)) {
        //     setBusinessActivityArray(myTasksDraft.businessActivityArray != '' ? JSON.parse(myTasksDraft.businessActivityArray) : [])
        // }
    }, [isFocused]);

    const FetchBa = () => {
        if ((adhocTaskEstablishmentDraft.getSelectedItem() &&
            adhocTaskEstablishmentDraft.getSelectedItem() != "")) {
            let tempArray: any = [];

            tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))

            // adhocTaskEstablishmentDetailsDraft.setarabicEstablishmentName(tempArray[0].ArabicName || '')
            // adhocTaskEstablishmentDetailsDraft.setEmailId(tempArray[0].Email || '')
            // adhocTaskEstablishmentDetailsDraft.setContactDetails(tempArray[0].Mobile || '')
            // adhocTaskEstablishmentDetailsDraft.setEstablishmentName(tempArray[0].TradeEngName || '')
            // adhocTaskEstablishmentDetailsDraft.setLicenseNumber(tempArray[0].TradeLicense || '')
            bussinessactivivyData()
            myTasksDraft.setState('pending');
            myTasksDraft.setLoadingState('Fetching BA');
            myTasksDraft.callToGetBAApi(JSON.parse(adhocTaskEstablishmentDraft.clikedItem), false);
            setSpinner(true)
        }
    }

    useEffect(() => {
        debugger;
        try {
            let tempArray: any = [];
            if (unitArr[0].value) {
                adhocTaskEstablishmentDetailsDraft.setTaskType(unitArr[0].value)
            }

            if (adhocTaskEstablishmentDraft.clikedItem != '') {
                let tempA = JSON.parse(adhocTaskEstablishmentDraft.clikedItem)
                let tempAddress: any = (tempA.addressObj && (tempA.addressObj != '')) ? (JSON.parse(tempA.addressObj) && JSON.parse(tempA.addressObj).length ? JSON.parse(tempA.addressObj)[0] : {}) : {}
                // let tempAddress: any = temp.EstablishmentAddress[0]
                adhocTaskEstablishmentDetailsDraft.setLicenseNumber(tempA.LicenseCode ? tempA.LicenseCode : '')
                adhocTaskEstablishmentDetailsDraft.setAccountType(tempA.AccountType ? tempA.AccountType : '')
                adhocTaskEstablishmentDetailsDraft.setLicenseStartDate(tempA.LicenseRegDate ? tempA.LicenseRegDate : '')
                adhocTaskEstablishmentDetailsDraft.setLicenseEndDate(tempA.LicenseExpiryDate ? tempA.LicenseExpiryDate : "")
                adhocTaskEstablishmentDetailsDraft.setAddress1(tempAddress.AddressLine1 ? tempAddress.AddressLine1 : "")
                adhocTaskEstablishmentDetailsDraft.setAddress2(tempAddress.AddressLine2 ? tempAddress.AddressLine2 : "")
                adhocTaskEstablishmentDetailsDraft.setCity(tempA.City ? tempA.City : '')
                setAddress((tempAddress.AddressLine1 ? tempAddress.AddressLine1 : "") + " " + (tempAddress.AddressLine2 ? tempAddress.AddressLine2 : "") + " " + (tempAddress.PostalCode ? tempAddress.PostalCode : "") + " " + (tempAddress.City ? tempAddress.City : "") + " " + (tempAddress.State ? tempAddress.State : "") + " " + (tempAddress.Country ? tempAddress.Country : ""))
                tempArray.push(tempA)
                setClickedItemArray(tempA)
                // myTasksDraft.setState('pending')
                // myTasksDraft.setLoadingState('Fetching Missing EstblishmentDetails')
                // establishmentDraft.callToAccountSyncService(JSON.parse(adhocTaskEstablishmentDraft.clikedItem).LicenseNumber, context.isArabic,true);
                // myTasksDraft.setLoadingState('')
            }
            myTasksDraft.setState('done');
            adhocTaskEstablishmentDetailsDraft.setState('done')
            if ((adhocTaskEstablishmentDraft.getSelectedItem() &&
                adhocTaskEstablishmentDraft.getSelectedItem() != "")) {

                // tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))
                // adhocTaskEstablishmentDetailsDraft.setTaskType("Direct Inspection")

                // setClickedItemArray(tempArray[0])

                // if (myTasksDraft.isMyTaskClick == 'campaign') {

                //     setIsCampaign(true)
                // } else {
                //     console.log("tempArray[0]:::"+JSON.stringify(tempArray[0]))
                //     // if (tempArray[0].ListOfCutAddress) {

                //     //     let temp: any = tempArray[0].ListOfCutAddress
                //     //     let tempAddress: any = temp.EstablishmentAddress[0]

                //     //     adhocTaskEstablishmentDetailsDraft.setAddress1(tempAddress.AddressLine1)
                //     //     adhocTaskEstablishmentDetailsDraft.setAddress2(tempAddress.AddressLine2)
                //     //     adhocTaskEstablishmentDetailsDraft.setCity(tempAddress.City)
                //     //     setAddress(tempAddress.AddressLine1 + " " + tempAddress.AddressLine2 + " " + tempAddress.PostalCode + " " + tempAddress.City + " " + tempAddress.State + " " + tempAddress.Country)
                //     // }
                // if (tempArray[0].City && tempArray[0].City!='') {
                //     adhocTaskEstablishmentDetailsDraft.setCity(tempArray[0].City)
                //     setAddress(tempArray[0].Area + " " + tempArray[0].Sector + " " + tempArray[0].City)
                // }
                // adhocTaskEstablishmentDetailsDraft.setarabicEstablishmentName(tempArray[0].ArabicName || '')
                // adhocTaskEstablishmentDetailsDraft.setEmailId(tempArray[0].Email || '')
                // adhocTaskEstablishmentDetailsDraft.setContactDetails(tempArray[0].Mobile || '')
                // adhocTaskEstablishmentDetailsDraft.setEstablishmentName(tempArray[0].TradeEngName || '')
                // adhocTaskEstablishmentDetailsDraft.setLicenseNumber(tempArray[0].TradeLicense || '')
                // bussinessactivivyData()
                myTasksDraft.setState('pending');
                myTasksDraft.setLoadingState('Fetching BA');
                myTasksDraft.callToGetBAApi(JSON.parse(adhocTaskEstablishmentDraft.clikedItem), false);
                setSpinner(true)
            }

            let bazarNameData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_BAZAR_NAME'), bazarNameArr = [];

            for (let indexBazarName = 0; indexBazarName < bazarNameData.length; indexBazarName++) {
                const element = bazarNameData[indexBazarName];
                bazarNameArr.push({ type: element.Value, value: element.Value })
            }
            console.log("bazarNameArr::" + JSON.stringify(bazarNameArr))
            setBazarNameArray(bazarNameArr)
            // }
            // myTasksDraft.setState('done')
        } catch (error) {
            console.log("" + error)
        }

    }, [])
    // console.log("aaaasssssdasdasss>>" + myTasksDraft.state + isButtonClick)

    useEffect(() => {
        debugger;
        try {
            console.log("aaaasssssdasdasssmyTasksDraft.createAdhoc>>" + myTasksDraft.createAdhoc + isButtonClick)

            // if (((myTasksDraft.state == "getBASuccess") && isButtonClick)) {
            //     console.log("aa>>>>>>>>>" + myTasksDraft.state + isButtonClick)
            //     // myTasksDraft.setLoadingState('')
            //     // adhocTaskEstablishmentDetailsDraft.setState('pending')
            //     // console.log("aaaassss")
            //     // setBusinessActivityArray(myTasksDraft.businessActivityArray != '' ? JSON.parse(myTasksDraft.businessActivityArray) : [])
            //     // bussinessactivivyData()
            //     let tempObj = {
            //         Description: adhocTaskEstablishmentDetailsDraft.businessActivity,
            //         BusinessActivity: adhocTaskEstablishmentDetailsDraft.businessActivity,
            //         TaskType: 'Direct Inspection'
            //     }

            //     if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {

            //         if (adhocTaskEstablishmentDetailsDraft.getTaskType().toLowerCase() == 'bazar inspection') {
            //             adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
            //         }
            //     }
            //     else {
            //         myTasksDraft.setState('pending')
            //         myTasksDraft.setLoadingState('Fetching Checklist')
            //         myTasksDraft.callToGetChecklistApi(tempObj, context.isArabic, true, adhocTaskEstablishmentDetailsDraft.businessActivity);
            //     }

            // }
            // else 
            if (((myTasksDraft.bastate == "getBASuccess"))) {
                myTasksDraft.setLoadingState('')
                setBASuccessFlag(true)
                // console.log("aaaasssssdasdas")
                setBusinessActivityArray(myTasksDraft.businessActivityArray != '' ? JSON.parse(myTasksDraft.businessActivityArray) : [])
                // bussinessactivivyData()
                // adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
                setSpinner(false)

            }
            else {
                setSpinner(false)
                console.log("aaaasssssdasdasss>>" + myTasksDraft.bastate + "," + myTasksDraft.bastate + isButtonClick)
            }
        } catch (error) {
            console.log("", error)

        }

    }, [myTasksDraft.bastate])

    useEffect(() => {

        try {
            // console.log('adhocTaskEstablishmentDetailsDraft.getState() ::' + adhocTaskEstablishmentDetailsDraft.getState())
            if (adhocTaskEstablishmentDetailsDraft.getState() == "adhocSuccess") {
                if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {
                    myTasksDraft.setState('pending')
                }
                else {
                    adhocTaskEstablishmentDetailsDraft.setState('pending')
                }
                // setSpinner(false)

                myTasksDraft.setContactName('');
                myTasksDraft.setMobileNumber('');
                myTasksDraft.setEmiratesId('');
                myTasksDraft.setEvidanceAttachment1('')
                myTasksDraft.setEvidanceAttachment1Url('')
                myTasksDraft.setEvidanceAttachment2('')
                myTasksDraft.setEvidanceAttachment2Url('')
                myTasksDraft.setLicencesAttachment1('')
                myTasksDraft.setLicencesAttachment1Url('');
                myTasksDraft.setLicencesAttachment2('')
                myTasksDraft.setLicencesAttachment2Url('')
                myTasksDraft.setEmiratesIdAttachment1('')
                myTasksDraft.setEmiratesIdAttachment1Url('')
                myTasksDraft.setEmiratesIdAttachment2('')
                myTasksDraft.setEmiratesIdAttachment2Url('')
                myTasksDraft.setNoCheckList('')
                myTasksDraft.setResult('')
                myTasksDraft.setFinalComment('')
                myTasksDraft.setFlashlightValue(false)
                myTasksDraft.setThermometerCBValue(false)
                myTasksDraft.setDataLoggerCBValue(false)
                myTasksDraft.setLuxmeterCBValue(false)
                myTasksDraft.setUVlightCBValue(false)
                myTasksDraft.setIsAlertApplicableToCurrentEst(false)
                myTasksDraft.setLatitude('')
                myTasksDraft.setLongitude('')
                myTasksDraft.setPercentage('')
                myTasksDraft.setTotalScore('')
                myTasksDraft.setMaxScore('')
                myTasksDraft.setGrade('')
                documantationDraft.setFileBuffer('')

                establishmentDraft.setEstablishmentName(isCampaign ? clickedItemArray.EnglishName : clickedItemArray.EnglishName)
                myTasksDraft.setTaskId(adhocTaskEstablishmentDetailsDraft.taskId)

                let loginData = RealmController.getLoginData(realm, LoginSchema.name);
                loginData = loginData['0'] ? loginData['0'] : {};
                let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

                let tempObj = {
                    TaskId: adhocTaskEstablishmentDetailsDraft.taskId,
                    BusinessActivity: adhocTaskEstablishmentDetailsDraft.businessActivity,
                    Description: adhocTaskEstablishmentDetailsDraft.businessActivity,
                    EstablishmentName: clickedItemArray.EnglishName,
                    EstablishmentId: clickedItemArray.Id,
                    TaskType: adhocTaskEstablishmentDetailsDraft.getTaskType(),
                    CreatedDate: moment().format('L'),
                    CompletionDate: moment().format('L'),
                    TaskStatus: 'Scheduled',
                    isAcknowledge: false,
                    LoginName: loginData.username,
                    LicenseCode: adhocTaskEstablishmentDetailsDraft.licenseNumber,
                    LicenseNumber: clickedItemArray.LicenseNumber,
                    ListOfAdfcaAccountThinBc: clickedItemArray.ListOfAdfcaAccountThinBc,
                    condemnationFlag: false,
                    detentionFlag: false,
                    samplingFlag: false,
                    RiskCategory: riskCategory,
                    mappingData: [{
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
                        ContactName: adhocTaskEstablishmentDetailsDraft.getTaskType().toLowerCase() == 'bazar inspection' ? adhocTaskEstablishmentDetailsDraft.bazarName : "",//signature page 
                        ContactNumber: "",
                        CustomerName: clickedItemArray.EnglishName,//Establishment
                        CustomerNameEnglish: clickedItemArray.EnglishName,
                        EFSTFlag: false,//false compalsanglishry
                        EHSRiskClassification: "",//Establishment resp
                        EmiratesId: "",
                        EstablishmentClass: "",//Establishment resp
                        EstablishmentDetailsList: undefined,
                        EstablishmentId: clickedItemArray.Id,
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
                        LicenseCode: clickedItemArray.LicenseCode,
                        LicenseNumber: clickedItemArray.LicenseNumber,
                        ListOfAdfcaAccountThinBc: clickedItemArray.ListOfAdfcaAccountThinBc,
                        LicenseSource: "",
                        ManagerID: null,//contact page
                        ManagerMobile: null,
                        ManagerName: null,
                        MobileNumber: "",//Establishment resp
                        next_visit_date: "",//calculate
                        NumOfEST: '',
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
                            BusinessActivity: adhocTaskEstablishmentDetailsDraft.businessActivity,
                            CertificateExpDate: "",//Establishment resp
                            CertificateNo: '',
                            ClientName: '',//ContactName
                            CustomerSignature: "",
                            Duration: "",
                            EquipmentsUsed: "",
                            EstablishNameInArabic: "",
                            IdentificationNumber: "",
                            InspectionNearestGracePeriod: '',//finala grace peroid
                            InspectionNo: adhocTaskEstablishmentDetailsDraft.taskId,//taskId
                            InspectionOverallInspectionComment: "",
                            InspectionResult: "",//final result
                            InspectionUserID: loginInfo.UserId,
                            InspectorName: loginData.username,
                            isSatisfactory: "",//depend on finalResult
                            LicenseExpiryDate: "",
                            MajorNonComplianceInspectionParameter: [],
                            MinorNonComplianceInspectionParameter: [],
                            ModerateNonComplianceInspectionParameter: [],
                            OmittedInspectionParameter: [],
                            PhoneNo: "",
                            ScheduledInspectionDate: "",//completionDate0
                            TypeofInspection: adhocTaskEstablishmentDetailsDraft.getTaskType()
                        },
                        printingReport: [],
                        ResponseSubmitted: null,
                        SampleSize: null,
                        Scope: "",// resp
                        Sector: null,
                        signatureBase64: "",
                        taskId: adhocTaskEstablishmentDetailsDraft.taskId,
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
                    }],
                    isCompleted: false
                }

                setInspectionDetails(tempObj)
                myTasksDraft.setSelectedTask(JSON.stringify(tempObj))

                myTasksDraft.setTaskId(adhocTaskEstablishmentDetailsDraft.taskId)
                //console.log(JSON.stringify(adhocTaskEstablishmentDetailsDraft.taskId))
                let allTask = myTasksDraft.getTaskApiResponse != '' ? JSON.parse(myTasksDraft.getTaskApiResponse) : [];
                allTask.push(tempObj)
                let temp = Array()
                if (clickedItemArray.Id) {
                    temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, clickedItemArray.Id);
                }
                let temp1 = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : '';
                temp1 = temp1.length ? temp1.filter((i: any) => i.LicenseCode == clickedItemArray.LicenseCode) : []

                if (temp && temp[0]) {
                    let addressObj = temp[0].addressObj && typeof (temp[0].addressObj) == 'string' ? JSON.parse(temp[0].addressObj) : []
                    let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                    establishmentDraft.setAddress(address)
                    establishmentDraft.setEstablishmentId(temp[0].Id ? temp[0].Id : '')
                    establishmentDraft.setArea(temp[0].Area ? temp[0].Area : '')
                    establishmentDraft.setSector(temp[0].Sector ? temp[0].Sector : '')
                    establishmentDraft.setContactDetails(temp[0].Mobile ? temp[0].Mobile : '')
                    establishmentDraft.setEstablishmentName(context.isArabic ? temp[0].ArabicName ? temp[0].ArabicName : '' : temp[0].EnglishName ? temp[0].EnglishName : '')
                    establishmentDraft.setLicenseEndDate(temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '')
                    establishmentDraft.setLicenseStartDate(temp[0].LicenseRegDate ? temp[0].LicenseRegDate : '')
                    establishmentDraft.setLicenseNumber(temp[0].LicenseNumber ? temp[0].LicenseNumber : '')
                    establishmentDraft.setLicenseSource(temp[0].LicenseSource ? temp[0].LicenseSource : '')
                }
                else if (temp1 && temp1[0]) {
                    let addressObj = temp1[0].addressObj && typeof (temp1[0].addressObj) == 'string' ? JSON.parse(temp1[0].addressObj) : []
                    let address = addressObj[0] ? ((addressObj[0].AddressLine1 ? addressObj[0].AddressLine1 : '') + ',' + (addressObj[0].AddressLine2 ? addressObj[0].AddressLine2 : '')) : '';

                    establishmentDraft.setAddress(address)
                    establishmentDraft.setEstablishmentId(temp1[0].Id ? temp1[0].Id : '')
                    establishmentDraft.setArea(temp1[0].Area ? temp1[0].Area : '')
                    establishmentDraft.setSector(temp1[0].Sector ? temp1[0].Sector : '')
                    establishmentDraft.setContactDetails(temp1[0].Mobile ? temp1[0].Mobile : '')
                    establishmentDraft.setEstablishmentName(context.isArabic ? temp1[0].ArabicName ? temp1[0].ArabicName : '' : temp1[0].EnglishName ? temp1[0].EnglishName : '')
                    establishmentDraft.setLicenseEndDate(temp1[0].LicenseExpiryDate ? temp1[0].LicenseExpiryDate : '')
                    establishmentDraft.setLicenseStartDate(temp1[0].LicenseRegDate ? temp1[0].LicenseRegDate : '')
                    establishmentDraft.setLicenseNumber(temp1[0].LicenseNumber ? temp1[0].LicenseNumber : '')
                    establishmentDraft.setLicenseSource(temp1[0].LicenseSource ? temp1[0].LicenseSource : '')
                }
                myTasksDraft.setMyTaskResponse(JSON.stringify(allTask));

                RealmController.addTaskDetails(realm, tempObj, TaskSchema.name, () => {

                    myTasksDraft.setIsMyTaskClick('myTask')
                    let newTaskArray = myTasksDraft.dataArray1 != '' ? JSON.parse(myTasksDraft.dataArray1) : [];
                    newTaskArray.push(tempObj);
                    myTasksDraft.setDataArray1(JSON.stringify(newTaskArray));
                    myTasksDraft.setMyTaskCount(newTaskArray.length.toString());
                });

                if (adhocTaskEstablishmentDetailsDraft.taskType == 'Sampling') {
                    NavigationService.navigate('Sampling', { title: 'Sampling' });
                }
                else if (adhocTaskEstablishmentDetailsDraft.taskType == 'Condemnation') {
                    NavigationService.navigate('Condemnation', { title: 'Condemnation' });
                }
                else if (adhocTaskEstablishmentDetailsDraft.taskType == 'Detention') {
                    NavigationService.navigate('Detention', { title: 'Detention' });
                }
                else {
                    console.log(adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase())
                    if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {

                        if (adhocTaskEstablishmentDetailsDraft.getTaskType().toLowerCase() == 'bazar inspection') {
                            let taskData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_BAZAR_TASK_ID'), taskIdArray = [];
                            console.log('taskData' + JSON.stringify(taskData))
                            if (taskData && taskData['0']) {
                                let TaskId = taskData['0'].Value;
                                myTasksDraft.setTaskId(TaskId);
                                myTasksDraft.callToGetAssessment(context.isArabic ? 'AR' : 'ENU', TaskId, adhocTaskEstablishmentDetailsDraft.taskId);
                            }
                            else {
                                Alert.alert('', 'no checklist');
                            }
                            // myTasksDraft.callToGetAssessment(context.isArabic ? "Arabic (Saudi Arabia)" : "ENU", adhocTaskEstablishmentDetailsDraft.taskId);
                        }
                    }
                    else {

                        if (myTasksDraft.checkliststate == "checklistLength") {
                            let obj: any = {};
                            obj.checkList = myTasksDraft.checkListArray;
                            obj.taskId = adhocTaskEstablishmentDetailsDraft.taskId;
                            obj.timeElapsed = '';
                            obj.timeStarted = '';

                            RealmController.addCheckListInDB(realm, obj, () => {
                                // myTasksDraft.setcheckliststate('');
                                adhocTaskEstablishmentDetailsDraft.callToScheduleTaskDetails()
                            });
                        }
                    }
                }
            }
            else if (adhocTaskEstablishmentDetailsDraft.getState() == "scheduleTaskSuccess") {
                myTasksDraft.setState('pending')

                if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {
                    let taskData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'ADFCA_BAZAR_TASK_ID'), taskIdArray = [];

                    if (taskData && taskData['0']) {
                        let TaskId = taskData['0'].Value;
                        myTasksDraft.setTaskId(TaskId);
                        myTasksDraft.callToGetAssessment(context.isArabic ? 'AR' : 'ENU', TaskId, adhocTaskEstablishmentDetailsDraft.taskId);
                    }
                    else {
                        Alert.alert('', 'no checklist');
                    }
                    // myTasksDraft.callToGetAssessment(context.isArabic ? "Arabic (Saudi Arabia)" : "ENU", adhocTaskEstablishmentDetailsDraft.taskId);
                }
                else {
                    setSpinner(false)
                    // myTasksDraft.callToGetChecklistApi(tempObj, context.isArabic, true, adhocTaskEstablishmentDetailsDraft.businessActivity);
                    NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': inspectionDetails, 'flag': true });
                }
            }
        } catch (e) {
            console.log('Exception ::' + e)
        }

    }, [adhocTaskEstablishmentDetailsDraft.state])

    useEffect(() => {
        if (myTasksDraft.createAdhoc) {
            console.log("aa>>>>>>>>>" + myTasksDraft.state + isButtonClick)

            let tempObj = {
                Description: adhocTaskEstablishmentDetailsDraft.businessActivity,
                BusinessActivity: adhocTaskEstablishmentDetailsDraft.businessActivity,
                TaskType: 'Direct Inspection'
            }

            if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {

                if (adhocTaskEstablishmentDetailsDraft.getTaskType().toLowerCase() == 'bazar inspection') {
                    adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
                }
            }
            else {
                myTasksDraft.setState('pending')
                myTasksDraft.setLoadingState('Fetching Checklist')
                // console.log("tempObj>>>>>" + JSON.stringify(tempObj))
                myTasksDraft.callToGetChecklistApi(tempObj, context.isArabic, true, adhocTaskEstablishmentDetailsDraft.businessActivity,"");
            }
        }
    }, [myTasksDraft.createAdhoc])

    useEffect(() => {
        if ((myTasksDraft.getState() == "getAssessmentSuccess")) {
            console.log("aa>>>fdffd>>>>>>" + myTasksDraft.state + isButtonClick + "," + myTasksDraft.checkliststate)

            if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {
            }
            // else {
            //     adhocTaskEstablishmentDetailsDraft.setState('pending');
            // }
            // console.log('self.state BA 1111:::' + JSON.stringify(myTasksDraft.state));
            myTasksDraft.setHistoryChecklist(false);
            myTasksDraft.setLoadingState('')

            if (adhocTaskEstablishmentDetailsDraft.taskType.toLowerCase() == 'bazar inspection') {
                NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': inspectionDetails, 'flag': true });
            }
            // else {
            //     if (myTasksDraft.checkliststate == "checklistLength") {
            //         adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
            //     }
            // }
            // NavigationService.navigate('StartInspection');
        }
        else if (myTasksDraft.state == 'error') {
            setSpinner(false);
        }
    }, [myTasksDraft.state]);

    useEffect(() => {
        if ((myTasksDraft.noCheckList == "NocheckListAvailable")) {
            setSpinner(false);
        }
    }, [myTasksDraft.noCheckList]);

    useEffect(() => {
        if (myTasksDraft.checkliststate == "checklistLength") {
            console.log("aa>>>fdffd>>>>>>" + myTasksDraft.state + isButtonClick + "," + myTasksDraft.checkliststate)
            adhocTaskEstablishmentDetailsDraft.setState('pending');

            myTasksDraft.setHistoryChecklist(false);
            myTasksDraft.setLoadingState('')

            adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()

            // NavigationService.navigate('StartInspection');
        }

    }, [myTasksDraft.checkliststate]);

    // myTasksDraft.callToGetChecklistApi
    const bussinessactivivyData = () => {
        // console.log("bussinessactivivyData: ", myTasksDraft.getBusinessActivityRes())

        // try {
        //     if (myTasksDraft.getBusinessActivityRes() && myTasksDraft.getBusinessActivityRes() != "") {
        //         // setBusinessActivityArray(JSON.parse(myTasksDraft.getBusinessActivityRes()))

        //         let tempBusinessActivityArray: any = myTasksDraft.getBusinessActivityRes() != '' ? JSON.parse(myTasksDraft.getBusinessActivityRes()) : []
        //         let tempArray1: any = [];

        //         // console.log("businessActivityArray: ", JSON.stringify(tempBusinessActivityArray))
        //         let AdfcaActionAccount = tempBusinessActivityArray[0].AdfcaActionAccount
        //         let businessActivitiesArray: any = [];
        //         for (let i = 0; i < AdfcaActionAccount.length; i++) {
        //             // console.log("AdfcaActionAccount[i].BusinessActivity: ", JSON.stringify(AdfcaActionAccount[i]))

        //             let obj: any = {};
        //             obj.lable = AdfcaActionAccount[i].BusinessActivity
        //             obj.value = AdfcaActionAccount[i].Description ? AdfcaActionAccount[i].Description : ''
        //             obj.RiskCategory = AdfcaActionAccount[i].RiskCategory

        //             tempArray1.push(obj)

        //             if (AdfcaActionAccount[i].SubActivityFlag == 'Y') {
        //                 businessActivitiesArray.push(AdfcaActionAccount[i].Description)
        //             }
        //         }

        //         let tempBusinessActivitySorted = Array();
        //         // console.log('tempArray1 :: ' + JSON.stringify(tempArray1));
        //         // for (let index = 0; index < result.length; index++) {
        //         // const elementResult = result[index];
        //         a: for (let index1 = 0; index1 < tempArray1.length; index1++) {
        //             const element = tempArray1[index1];
        //             let flag = false;
        //             b: if (tempBusinessActivitySorted.length) {
        //                 for (let index = 0; index < tempBusinessActivitySorted.length; index++) {
        //                     const elementTemp = tempBusinessActivitySorted[index];
        //                     if (elementTemp.value == element.value) {
        //                         flag = true;
        //                         break b;
        //                     }
        //                 }
        //                 if (!flag) {
        //                     tempBusinessActivitySorted.push(element);
        //                 }
        //             }
        //             else {
        //                 tempBusinessActivitySorted.push(element);
        //             }
        //         }
        //         if (tempBusinessActivitySorted.length) {
        //             setHasActivity(true)
        //         }
        //         console.log('tempBusinessActivitySorted ::' + JSON.stringify(tempBusinessActivitySorted[0]))
        //         setBusinessActivityArray(tempBusinessActivitySorted);
        //         // if (tempArray1.length) {
        //         //     console.log('tempArray1[0].value setBusinessActivityArray::::::::::::: ' + tempArray1[0].value);
        //         //     adhocTaskEstablishmentDetailsDraft.setBusinessActivity(tempArray1[0].value)
        //         //     setRiskCategory(tempArray1[0].RiskCategory)
        //         // }

        //         setsubBusinessActivityArray(businessActivitiesArray)
        //         // console.log("businessActivityArray1: ", JSON.stringify(businessActivityArray))
        //     }
        // } catch (error) {
        //     console.log("error:" + error)
        // }
    }

    const splitDate = (date: any) => {
        let tempDate1 = '';
        if (date && date != "") {
            let tempDate = date.split("-")
            tempDate1 = tempDate;//[0].split("-")
            console.log(tempDate)
        }
        return tempDate1;
    }

    const renderData = (item: any, index: number) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.code == 'serviceRequest') {
                        NavigationService.navigate('ServiceRequstList')
                    }
                    if (item.code == 'violation') {
                        NavigationService.navigate('ViolationList')
                    }
                    if (item.code == 'vehicleDetail') {
                        NavigationService.navigate('VehicleDetails')
                    }
                    if (item.code == 'Inspection') {
                        NavigationService.navigate('InspectionList')
                    }
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

                <View style={{ flex: 0.3, height: 5 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

            </TouchableOpacity>

        )
    }

    const placeArr = [
        { type: 'Burning Area', value: 'Burning Area' },
        { type: 'In Site', value: 'In Site' },
    ]

    const reasonsArr = [
        { type: 'Damaged', value: 'Damaged' },
        { type: 'Expired', value: 'Expired' },
        { type: 'Non-Compliant', value: 'Non-Compliant' },
    ]

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={((myTasksDraft.state == 'pending')) ? true : false}
                    textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
                <Spinner
                    visible={spinner}
                    textContent={myTasksDraft.loadingState != '' ? myTasksDraft.loadingState : 'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
                <Spinner
                    visible={adhocTaskEstablishmentDetailsDraft.state == 'pending' ? true : false}
                    textContent={adhocTaskEstablishmentDetailsDraft.loadingState != '' ? adhocTaskEstablishmentDetailsDraft.loadingState : 'Loading...'}
                    // textContent={'Loading...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header adhocestDetails={true} isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 1.2 : 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.8 : 1.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(myTasksDraft.isMyTaskClick == 'History' ? Strings[context.isArabic ? 'ar' : 'en'].history.history : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.adhocTask)}</Text>
                        </View>
                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 1.2 : 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>
                </View>

                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{isCampaign ? clickedItemArray.EnglishName : clickedItemArray.EnglishName}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.4, backgroundColor: '#abcfbe', flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentDetails}</Text>

                </View>

                <View style={{ flex: 0.2 }} />


                <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 4.6 : 5, width: '80%', alignSelf: 'center' }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(isCampaign ? Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.custName : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentName)} </Text>
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
                                    value={isCampaign ? clickedItemArray.EnglishName : clickedItemArray.EnglishName}
                                    onChange={(val: string) => {
                                        adhocTaskEstablishmentDetailsDraft.setEstablishmentName(val)
                                    }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseNumber)} </Text>
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
                                    value={isCampaign ? clickedItemArray.LicenseCode : clickedItemArray.LicenseCode}
                                    onChange={(val: string) => {
                                        adhocTaskEstablishmentDetailsDraft.setLicenseNumber(val)
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseStartDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        editable={false}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign ? "" : splitDate(clickedItemArray.LicenseRegDate)[1]}
                                        onChange={(val: string) => {

                                        }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        editable={false}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign ? "" : splitDate(clickedItemArray.LicenseRegDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        editable={false}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign ? "" : splitDate(clickedItemArray.LicenseRegDate)[2]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseEndDate)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: "center", alignSelf: 'center', }}>
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        editable={false}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign ? "" : splitDate(clickedItemArray.LicenseExpiryDate)[1]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.25, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        editable={false}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign ? "" : splitDate(clickedItemArray.LicenseExpiryDate)[0]}
                                        onChange={(val: string) => { }}
                                    />
                                </View>
                                <View style={{ flex: 0.05 }} />
                                <View style={{ flex: 0.4, height: "100%" }}>
                                    <TextInputComponent
                                        placeholder={''}
                                        editable={false}
                                        style={{
                                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }}
                                        value={isCampaign ? "" : splitDate(clickedItemArray.LicenseExpiryDate)[2]}
                                        onChange={(val: string) => { }}
                                    />

                                </View>
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        {!isCampaign ? <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.businessActivity)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        if ((myTasksDraft.getBusinessActivityRes() != '')) {
                                            bussinessactivivyData()
                                            dropdownRef2 && dropdownRef2.current.focus();
                                        }
                                        else if ((businessActivityArray.length == 0) && !BASuccessFlag) {
                                            FetchBa()
                                        }
                                        else if ((businessActivityArray.length == 0) && BASuccessFlag) {
                                            Alert.alert("", (Strings[context.isArabic ? 'ar' : 'en'].adhocTask.bussinessActivitynotfound));
                                        }
                                        else {
                                            dropdownRef2 && dropdownRef2.current.focus();
                                        }
                                    }}
                                    style={{
                                        height: '70%', width: '100%', zIndex: 100, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            focus={() => {
                                                if ((myTasksDraft.getBusinessActivityRes() != '')) {
                                                    bussinessactivivyData()
                                                    dropdownRef2 && dropdownRef2.current.focus();
                                                }
                                                else if ((businessActivityArray.length == 0) && !BASuccessFlag) {
                                                    FetchBa()
                                                }
                                                else if ((businessActivityArray.length == 0) && BASuccessFlag) {
                                                    Alert.alert("", (Strings[context.isArabic ? 'ar' : 'en'].adhocTask.bussinessActivitynotfound));
                                                }
                                                else {
                                                    dropdownRef2 && dropdownRef2.current.focus();
                                                }
                                            }}
                                            ref={dropdownRef2}
                                            value={adhocTaskEstablishmentDetailsDraft.businessActivity != '' ? adhocTaskEstablishmentDetailsDraft.businessActivity : Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.selectBusinessActivity}
                                            onChangeText={(val: string) => {

                                                if (val == "") {
                                                    Alert.alert("", "Unable to proceed. The description of this bussiness activity is null. Please contact FIS administrator.")
                                                } else {
                                                    adhocTaskEstablishmentDetailsDraft.setBusinessActivity(val)
                                                    let businessActivityArray = myTasksDraft.businessActivityArray != '' ? JSON.parse(myTasksDraft.businessActivityArray) : []
                                                    let temp = businessActivityArray.filter((item: any) => (item.value == val))

                                                    if (temp.length) {
                                                        setRiskCategory(temp[0].RiskCategory)
                                                        console.log(JSON.stringify(temp[0]))
                                                    }
                                                    setIsButtonClick(false)
                                                }

                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={myTasksDraft.businessActivityArray != '' ? JSON.parse(myTasksDraft.businessActivityArray) : []}
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
                            : null}

                        <View style={{ flex: 0.2, }} />

                        {/* {!isCampaign ? <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.selectVehicle)} </Text>
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
                                            value={adhocTaskEstablishmentDetailsDraft.selectVehicle}
                                            onChangeText={(val: string) => {
                                                adhocTaskEstablishmentDetailsDraft.setSelectVehicle(val)
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={reasonsArr}
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

                        </View> : null}


                        <View style={{ flex: 0.2, }} /> */}

                        {!isCampaign ? <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.taskType)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef4 && dropdownRef4.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef4}
                                            value={adhocTaskEstablishmentDetailsDraft.taskType}
                                            onChangeText={(val: string) => {
                                                adhocTaskEstablishmentDetailsDraft.setTaskType(val)
                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={unitArr}
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

                        </View> : null}

                        <View style={{ flex: 0.2, }} />

                        {!isCampaign && (adhocTaskEstablishmentDetailsDraft.taskType == 'Bazar Inspection') ?
                            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={styles.textContainer}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.selectBazar)} </Text>
                                </View>

                                <View style={styles.space} />

                                <View style={styles.TextInputContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            dropdownRef1 && dropdownRef1.current.focus();
                                        }}
                                        style={{
                                            height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                        }} >
                                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Dropdown
                                                ref={dropdownRef1}
                                                value={adhocTaskEstablishmentDetailsDraft.bazarName}
                                                onChangeText={(val: string) => {
                                                    adhocTaskEstablishmentDetailsDraft.setBazarName(val)
                                                }}
                                                itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                                data={bazarNameArray}
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
                            : null
                        }

                        {!isCampaign ? <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.arabicEstablishmentName)} </Text>
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
                                    value={clickedItemArray.ArabicName}
                                    onChange={(val: string) => {
                                        //adhocTaskEstablishmentDetailsDraft.setarabicEstablishmentName(val)
                                    }}
                                />
                            </View>


                        </View>
                            : null}

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.contactDetails)} </Text>
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
                                    value={isCampaign ? clickedItemArray.Mobile : clickedItemArray.Mobile}
                                    onChange={(val: string) => {
                                        //adhocTaskEstablishmentDetailsDraft.setContactDetails(val)
                                    }}
                                />
                            </View>

                        </View>


                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.address)} </Text>
                            </View>

                            <View style={styles.space} />

                            <TouchableOpacity onPress={() => Alert.alert("", address)} style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    editable={false}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={address}
                                    onChange={(val: string) => {
                                        // adhocTaskEstablishmentDetailsDraft.setAddress(val)
                                    }}
                                />
                            </TouchableOpacity>

                        </View>


                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.emailid)} </Text>
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
                                    value={isCampaign ? clickedItemArray.Email : clickedItemArray.Email}
                                    onChange={(val: string) => {
                                        // adhocTaskEstablishmentDetailsDraft.setEmailId(val)
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.onHold)}</Text>
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
                                    value={clickedItemArray.OnHold}
                                    onChange={(val: string) => {
                                        //adhocTaskEstablishmentDetailsDraft.setOnHold(val)
                                    }}
                                />
                            </View>

                        </View>

                    </ScrollView>

                </View>

                {myTasksDraft.isMyTaskClick == 'History' ?
                    null :
                    <View style={{ flex: 0.1 }} />
                }
                {myTasksDraft.isMyTaskClick == 'History' ?

                    <View style={{ flex: 1, alignSelf: 'center', width: "80%", justifyContent: 'center', borderRadius: 8, borderWidth: .5, borderColor: '#abcfbf', padding: 5 }}>

                        <FlatList
                            // nestedScrollEnabled={false}
                            data={establishmentHistoryArray}
                            contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                            columnWrapperStyle={{ flexDirection: context.isArabic ? 'row-reverse' : 'row' }}
                            initialNumToRender={3}
                            renderItem={({ item, index }) => {
                                return (
                                    renderData(item, index)
                                )
                            }}
                            ItemSeparatorComponent={() => (<View style={{ width: 5 }} />)}
                            numColumns={4}
                        />

                    </View>
                    : null}
                {/* {myTasksDraft.isMyTaskClick == 'History' ? <View style={{ flex: 0.1 }} /> : null} */}
                {true ? //myTasksDraft.isMyTaskClick == 'History' ?
                    <View style={{ flex: 0.6, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }}>
                        <View style={{ flex: 0.5 }} />
                        {!isCampaign ? <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                delayPressOut={3000}
                                style={{
                                    height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {

                                    let obj: any = {};
                                    obj.LicenseCode = adhocTaskEstablishmentDetailsDraft.getLicenseNumber()
                                    obj.Description = adhocTaskEstablishmentDetailsDraft.getBusinessActivity()
                                    setIsButtonClick(true)
                                    console.log("aaaa")
                                    if (adhocTaskEstablishmentDetailsDraft.getBusinessActivity() == null || adhocTaskEstablishmentDetailsDraft.getBusinessActivity() == "") {
                                        Alert.alert("", (Strings[context.isArabic ? 'ar' : 'en'].adhocTask.bussinessActivitynotfound));
                                    }
                                    else if (adhocTaskEstablishmentDetailsDraft.taskType == null || adhocTaskEstablishmentDetailsDraft.taskType == "") {
                                        Alert.alert("", (Strings[context.isArabic ? 'ar' : 'en'].adhocTask.selectTaskType));
                                    }
                                    else {
                                        myTasksDraft.setState('pending')
                                        myTasksDraft.setLoadingState('Fetching BA')
                                        myTasksDraft.callToGetBAApi(obj, true)
                                        // adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
                                        setIsButtonClick(true)
                                        if (clickedItemArray.EnglishName && clickedItemArray.EnglishName.toLowerCase() == 'adfca test' && adhocTaskEstablishmentDetailsDraft.getBusinessActivity() =='Hotel') {
                                            
                                        }
                                        else{
                                            setSpinner(true)
                                        }

                                    }

                                    // NavigationService.navigate('AdhocCreateNewEstablishment')
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.createNewTask)}
                            />
                        </View> : null}

                        <View style={{ flex: 0.2 }} />
                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                            <ButtonComponent
                                style={{
                                    height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    NavigationService.navigate('efstDetails');
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].history.efst)}
                            />
                        </View>
                        <View style={{ flex: 0.5 }} />
                    </View> :

                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1.2 }} />

                        <ButtonComponent
                            delayPressOut={3000}
                            style={{ height: '55%', width: '35%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                            buttonClick={() => {
                                adhocTaskEstablishmentDetailsDraft.callToAdhocInspection()
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={Strings[context.isArabic ? 'ar' : 'en'].adhocTask.createNewTask}
                        />

                        <View style={{ flex: 1.2 }} />

                    </View>
                }


                <View style={{ flex: 0.05 }} />


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
        flex: 0.0,

    },

    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    }

});

export default observer(AdhocEstablishmentDetails);

