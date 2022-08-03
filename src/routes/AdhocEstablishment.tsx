import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
import Header from './../components/Header';
import TableComponent from './../components/TableComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/core';
import TaskSchema from './../database/TaskSchema';
import { RealmController } from './../database/RealmController';
let realm = RealmController.getRealmInstance();

const AdhocEstablishment = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({
        myTasksDraft: rootStore.myTasksModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel,
        adhocTaskEstablishmentDetailsDraft: rootStore.adhocTaskEstablishmentDetailsModel, establishmentDraft: rootStore.establishmentModel
    })
    const { myTasksDraft, adhocTaskEstablishmentDraft, adhocTaskEstablishmentDetailsDraft, establishmentDraft } = useInject(mapStore)
    const [estHistoryArray, setEstHistoryArray] = useState(Array());
    const [loading, setLoading] = useState(false);
    const isFocused = useIsFocused();

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''

    useEffect(() => {
        debugger;
        if (adhocTaskEstablishmentDraft.getTradeLicenseHistory() &&
            adhocTaskEstablishmentDraft.getTradeLicenseHistory() != "") {

            if (adhocTaskEstablishmentDraft.getTradeLicenseHistory() != '') {

                if (JSON.parse(adhocTaskEstablishmentDraft.getTradeLicenseHistory()).length) {
                    setLoading(false);

                    let ESTArray = Array();
                    ESTArray = JSON.parse(adhocTaskEstablishmentDraft.getTradeLicenseHistory());
                    let result: any = Array.from(new Set(ESTArray.map((item: any) => item.LicenseCode)))
                        .map(LicenseCode => {
                            return { LicenseCode: LicenseCode };
                        });

                    let dataArray = [];
                    a: for (let i = 0; i < result.length; i++) {
                        b: for (let j = 0; j < ESTArray.length; j++) {
                            let element: any = ESTArray[j];
                            debugger
                            if (element.LicenseCode == result[i].LicenseCode) {
                                let obj: any = element;
                                dataArray.push(obj);
                                break b;
                            }
                        }
                    }
                    setEstHistoryArray(dataArray);
                }
                else {
                    // console.log("getTradeLicenseHistory: ", adhocTaskEstablishmentDraft.getTradeLicenseHistory())
                    adhocTaskEstablishmentDraft.setState('pending');
                    setLoading(true)
                    adhocTaskEstablishmentDraft.callToSearchByEstablishmentServiceFromAPI()
                }
            }
        }
    }, [adhocTaskEstablishmentDraft.getTradeLicenseHistory()])

    useEffect(() => {
        myTasksDraft.setBusinessActivityResponse('');
        myTasksDraft.setCreateAdhoc(false);
        myTasksDraft.setcheckliststate('');

    }, [])

    // useEffect(() => {
    //     if (establishmentDraft.response != '') {
    //         let tempArray = Array()
    //         tempArray = JSON.parse(establishmentDraft.response)
    //         // setClickedItemArray(tempArray)
    //         let est = adhocTaskEstablishmentDraft.clikedItem !='' ? JSON.parse(adhocTaskEstablishmentDraft.clikedItem) :{};

    //         for (let index = 0; index < tempArray.length; index++) {
    //             const element = tempArray[index];
    //             if ((element.LicenseNumber == est.LicenseNumber) && (element.LicenseCode == est.LicenseCode)) {
    //                 // let payload = {
    //                 //     "Attribute1": element.Id
    //                 // }
    //                 // console.log("estData.Id>>" + JSON.stringify(element.Id))
    //                 // myTasksDraft.setVisitType(element.Id)
    //                 // myTasksDraft.callToSupervisoryInspectionEstDetails(payload);
    //                 break;
    //             }
    //         }

    //     }
    // }, [establishmentDraft.response]);

    useEffect(() => {
        if (myTasksDraft.getState() == "getBASuccess") {
            myTasksDraft.setLoadingState('');
            // myTasksDraft.setState('done')
            // NavigationService.navigate('AdhocEstablishmentDetails');
        }
    }, [myTasksDraft.getState()])

    useEffect(() => {
        if (adhocTaskEstablishmentDraft.state == "error") {
            setLoading(false)
        }
    }, [adhocTaskEstablishmentDraft.state])
    // useEffect(() => {
    //     if (establishmentDraft.response != '') {
    //         let tempArray = Array()
    //         tempArray = JSON.parse(establishmentDraft.response)
    //         // setClickedItemArray(tempArray)
    //         let est = JSON.parse(adhocTaskEstablishmentDraft.clikedItem);
    //         // console.log("aaaaaaaaaaaaaaaaaaaaa:::" + JSON.stringify(tempArray))
    //         // console.log("aaaaaaaaaaaaaaaaaaaaesta:::" + JSON.stringify(est))
    //         for (let index = 0; index < tempArray.length; index++) {
    //             const element = tempArray[index];
    //             if ((element.LicenseNumber == est.LicenseNumber) && (element.LicenseCode == est.LicenseCode)) {
    //                 // setClickedItemArray(element);
    //                 break;
    //             }
    //         }

    //         if (myTasksDraft.isMyTaskClick == 'campaign') {

    //             // setIsCampaign(true)
    //         }
    //         else {
    //             // console.log("tempArray[0]:::" + JSON.stringify(tempArray[0]))
    //             let tempA = Object();
    //             for (let index = 0; index < tempArray.length; index++) {
    //                 const element = tempArray[index];
    //                 if ((element.LicenseNumber == est.LicenseNumber) && (element.LicenseCode == est.LicenseCode)) {
    //                     tempA = element;
    //                     break;
    //                 }
    //             }
    //             if (tempA) {

    //                 // let tempAddress: any = (tempA.addressObj && (tempA.addressObj != '')) ? (JSON.parse(tempA.addressObj) && JSON.parse(tempA.addressObj).length ? JSON.parse(tempA.addressObj)[0] : {}) : {}
    //                 // let tempAddress: any = temp.EstablishmentAddress[0]
    //                 // adhocTaskEstablishmentDetailsDraft.setLicenseNumber(tempA.LicenseCode ? tempA.LicenseCode : '')
    //                 // adhocTaskEstablishmentDetailsDraft.setAccountType(tempA.AccountType ? tempA.AccountType : '')
    //                 // adhocTaskEstablishmentDetailsDraft.setLicenseStartDate(tempA.LicenseRegDate ? tempA.LicenseRegDate : '')
    //                 // adhocTaskEstablishmentDetailsDraft.setLicenseEndDate(tempA.LicenseExpiryDate ? tempA.LicenseExpiryDate : "")
    //                 // adhocTaskEstablishmentDetailsDraft.setAddress1(tempAddress.AddressLine1 ? tempAddress.AddressLine1 : "")
    //                 // adhocTaskEstablishmentDetailsDraft.setAddress2(tempAddress.AddressLine2 ? tempAddress.AddressLine2 : "")
    //                 // adhocTaskEstablishmentDetailsDraft.setCity(tempA.City ? tempA.City : '')
    //                 // setAddress((tempAddress.AddressLine1 ? tempAddress.AddressLine1 : "") + " " + (tempAddress.AddressLine2 ? tempAddress.AddressLine2 : "") + " " + (tempAddress.PostalCode ? tempAddress.PostalCode : "") + " " + (tempAddress.City ? tempAddress.City : "") + " " + (tempAddress.State ? tempAddress.State : "") + " " + (tempAddress.Country ? tempAddress.Country : ""))
    //             }
    //         }
    //     }
    // }, [establishmentDraft.response]);

    const renderRecentNews = (item: any, index: number) => {

        let address = item.ListOfCutAddress;
        if (address && address.EstablishmentAddress && address.EstablishmentAddress != "" && address.EstablishmentAddress[0]) {
            address = (item.ListOfCutAddress.EstablishmentAddress[0].AddressLine1 ? item.ListOfCutAddress.EstablishmentAddress[0].AddressLine1 : "") + " " + (item.ListOfCutAddress.EstablishmentAddress[0].AddressLine2 ? item.ListOfCutAddress.EstablishmentAddress[0].AddressLine2 : '') + " " + (item.ListOfCutAddress.EstablishmentAddress[0].city ? item.ListOfCutAddress.EstablishmentAddress[0].city : "")
        } else {
            let addressObj = item.addressObj && typeof (item.addressObj) == 'string' ? JSON.parse(item.addressObj) : []
            address = addressObj['0'] ? ((addressObj['0'].AddressLine1 ? addressObj['0'].AddressLine1 : '') + ',' + (addressObj['0'].AddressLine2 ? addressObj['0'].AddressLine2 : '')) : '';
        }

        return (

            <TouchableOpacity
                onPress={() => {
                    // myTasksDraft.setIsMyTaskClick('EstSearch');   
                    adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(item))
                    //console.log(JSON.stringify(item))
                    // myTasksDraft.setState('done');
                    // item.LicenseCode = item.TradeLicense;
                    item.Description = '';
                    adhocTaskEstablishmentDetailsDraft.setBusinessActivity('')
                    adhocTaskEstablishmentDetailsDraft.setSelectVehicle('')
                    adhocTaskEstablishmentDetailsDraft.setTaskType('')
                    if (myTasksDraft.isMyTaskClick != 'History' && (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance')) {
                        // establishmentDraft.setState('pending')
                        // myTasksDraft.setLoadingState('Fetching Missing EstblishmentDetails')
                        // setLoading(false)
                        // establishmentDraft.callToAccountSyncService(JSON.parse(adhocTaskEstablishmentDraft.clikedItem).LicenseNumber, context.isArabic,true);

                        let payload = {
                            "Attribute1": item.Id
                        }

                        try {
                            let objct = RealmController.getTaskDetails(realm, TaskSchema.name, myTasksDraft.taskId);
                            let inspectionDetails = objct['0'] ? objct['0'] : myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask) : {};
                            let mappingData = inspectionDetails.mappingData ? typeof (inspectionDetails.mappingData) == 'string' ? JSON.parse(inspectionDetails.mappingData) : inspectionDetails.mappingData : [{}];
                            mappingData[0].superVisorySelectedEst = item.Id;
    
                            inspectionDetails.mappingData = mappingData;
                            myTasksDraft.setSelectedTask(JSON.stringify(inspectionDetails));
                            RealmController.addTaskDetails(realm, inspectionDetails, TaskSchema.name, () => {
                            });    
                        } catch (error) {
                            
                        }
                        
                        // console.log("estData.Id>>" + JSON.stringify(item.Id))
                        myTasksDraft.setVisitType(item.Id)
                        myTasksDraft.callToSupervisoryInspectionEstDetails(payload);
                        // let payload = {
                        //     "Attribute1": item.Id
                        // }
                        // // console.log("estData"+JSON.stringify(item))
                        // myTasksDraft.setVisitType(item.Id)
                        // myTasksDraft.callToSupervisoryInspectionEstDetails(payload);
                    }
                    else {
                        // myTasksDraft.setState('pending');
                        // myTasksDraft.setLoadingState('Fetching BA');
                        // myTasksDraft.callToGetBAApi(item);
                        NavigationService.navigate('AdhocEstablishmentDetails')
                    }
                }}
                key={item.LicenseCode}
                style={{
                    height: HEIGHT * 0.22, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentName, value: item.EnglishName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.tradeLicense, value: item.LicenseCode },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.licenseSource, value: item.LicenseSource },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].adhocTask.address, value: address },
                    ]}
                />
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={(adhocTaskEstablishmentDraft.state == 'pending') || loading ? true : false}
                textContent={adhocTaskEstablishmentDraft.loadingState != '' ? adhocTaskEstablishmentDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <Spinner
                visible={(establishmentDraft.state == 'pending') ? true : false}
                textContent={adhocTaskEstablishmentDraft.loadingState != '' ? establishmentDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5 }}>
                    <Header adhocPage={true} isArabic={context.isArabic} />
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
                {/* {myTasksDraft.isMyTaskClick == 'History' ?
                    <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{'Fujitsu India Old'}</Text>
                    </View>
                    :
                    null

                } */}
                <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.2 : 0 }} />

                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishment)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.2, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={estHistoryArray}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.5 : 0.2 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>

        </SafeAreaView>
    )
}


export default observer(AdhocEstablishment);