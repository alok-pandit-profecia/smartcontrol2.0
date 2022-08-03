import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';

import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from './../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"
import { RealmController } from '../database/RealmController';
import LOVSchema from '../database/LOVSchema';
import Spinner from 'react-native-loading-spinner-overlay';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
let realm = RealmController.getRealmInstance();

const CreateNewEstablishment = (props: any) => {

    const context = useContext(Context);
    let dropdownRef2 = useRef();
    let dropdownRef3 = useRef();
    let dropdownRef4 = useRef();
    let dropdownRef5 = useRef();
    const mapStore = (rootStore: RootStoreModel) => ({
        myTasksDraft: rootStore.myTasksModel,
        adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel,
        adhocTaskCreateNewEstablishmentDraft: rootStore.adhocTaskCreateNewEstablishmentModel
    })
    const { myTasksDraft, adhocTaskEstablishmentDraft, adhocTaskCreateNewEstablishmentDraft } = useInject(mapStore)


    const [estType, setEstType] = useState(Array())
    const [estClass, setEstClass] = useState(Array())
    const [vehiceMake, setvehiceMake] = useState(Array())
    const [licenseSource, setLicenseSource] = useState(Array())



    const [clickedItemArray, setClickedItemArray] = useState(Object());


    let tempArray: any = []

    useEffect(() => {


        let estTypeKey = "ACCOUNT_TYPE"
        let estClassKey = "CUT_ACCOUNT_TYPE"
        let vehicleMakeKey = "AUTO_MAKE_TYPE"
        let licenseSourceKey = "FIN_ORG_SOURCE"

        let estTypeData = RealmController.getLovDataByKey(realm, LOVSchema.name, estTypeKey);
        let estClassData = RealmController.getLovDataByKey(realm, LOVSchema.name, estClassKey);
        let vehicleMakeData = RealmController.getLovDataByKey(realm, LOVSchema.name, licenseSourceKey);
        let licenseSourceData = RealmController.getLovDataByKey(realm, LOVSchema.name, vehicleMakeKey);


        let estTypeDataArray = estTypeData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });
        let estClassArray = estClassData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });
        let vehicleMakeArray = vehicleMakeData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });
        let licenseSourceArray = licenseSourceData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });

        setEstType(estTypeDataArray)
        setEstClass(estClassArray)
        setvehiceMake(vehicleMakeArray)
        setLicenseSource(licenseSourceArray)

    }, [])

    useEffect(() => {
        if (adhocTaskCreateNewEstablishmentDraft.getState() == "searchVehicleSuccess") {
            adhocTaskCreateNewEstablishmentDraft.callToSearchByEstablishmentService()
        }

        if (adhocTaskCreateNewEstablishmentDraft.getState() == "searchEstSuccess") {
            let temp = adhocTaskCreateNewEstablishmentDraft.tradeLicenseHistoryResponse
            temp = temp != '' ? JSON.parse(temp) : {}
            // //console.log("searchEstSuccess: ", temp[0])
            if (temp[0]) {
                adhocTaskEstablishmentDraft.setSelectedItem(JSON.stringify(temp[0]))
            }

            let obj: any = {}
            obj.LicenseCode = adhocTaskCreateNewEstablishmentDraft.gettradeLicenseNumber()
            obj.Description = ''
            myTasksDraft.callToGetBAApi(obj,false);

        }

    }, [adhocTaskCreateNewEstablishmentDraft.state])

    useEffect(() => {
        if (myTasksDraft.getState() == "getBASuccess") {

            NavigationService.navigate('AdhocEstablishmentDetails')
        }
    }, [myTasksDraft.getState()])

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={adhocTaskCreateNewEstablishmentDraft.state == 'pending' ? true : false}
                    textContent={adhocTaskCreateNewEstablishmentDraft.loadingState != '' ? adhocTaskCreateNewEstablishmentDraft.loadingState : 'Loading ...'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].adhocTask.adhocTask}</Text>
                        </View>

                        <View style={{ flex: 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, backgroundColor: '#abcfbe', flexDirection: 'row', width: '80%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].adhocTask.createNewEstablishment}</Text>

                </View>

                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 6, width: '80%', alignSelf: 'center' }}>

                    <ScrollView style={{ flex: 1 }}>

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentEngName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.TradeEngName}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.setEstablishmentEnglishName(val);
                                    }}
                                />

                            </View>
                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentArName)} </Text>
                            </View>
                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.TradeEngName}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.setEstablishmentEnglishName(val);
                                    }}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentType)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef2 && dropdownRef2.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef2}
                                            value={''}
                                            onChangeText={(val: string) => { }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={estType}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishmentClass)} </Text>
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
                                            value={''}
                                            onChangeText={(val: string) => { }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={estClass}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.plateCode)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={props.value}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.setPlateCode(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.plateNumber)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={props.value}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.setPlateNumber(val);
                                    }}
                                />
                            </View>

                        </View>


                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.vehicleMake)} </Text>
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
                                            value={''}
                                            onChangeText={(val: string) => {

                                            }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={vehiceMake}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.sector)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.Sector}
                                    onChange={(val: string) => {

                                        adhocTaskCreateNewEstablishmentDraft.setSector(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.contact)}</Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.MobilePhoneNumber}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.setContact(val);
                                    }}
                                />
                            </View>

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.tradeLicenseNumber)} </Text>
                            </View>

                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.TradeLicense}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.settradeLicenseNumber(val);
                                    }}
                                />
                            </View>


                        </View>

                        <View style={{ flex: 0.2, }} />

                        <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.tradeLicenseSource)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef5 && dropdownRef5.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef5}
                                            value={''}
                                            onChangeText={(val: string) => { }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={licenseSource}
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
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].adhocTask.emailid)} </Text>
                            </View>

                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    placeholder={''}
                                    style={{
                                        height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    value={clickedItemArray.EmailAddress}
                                    onChange={(val: string) => {
                                        adhocTaskCreateNewEstablishmentDraft.setEmail(val);
                                    }}
                                />
                            </View>
                        </View>

                    </ScrollView>

                </View>

                <View style={{ flex: 0.22 }} />

                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 1.2 }} />

                    <ButtonComponent
                        style={{ height: '55%', width: '35%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            //myTasksDraft.setIsMyTaskClick('forsearch')
                            //  NavigationService.navigate('AdhocEstablishmentDetails');
                            adhocTaskCreateNewEstablishmentDraft.callToSearchByVehicleService()
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].adhocTask.createAndView}
                    />
                    <View style={{ flex: 1.2 }} />

                </View>


                <View style={{ flex: 0.2 }} />


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

});

export default observer(CreateNewEstablishment);

