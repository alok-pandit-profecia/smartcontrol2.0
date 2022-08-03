import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();
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
import NavigationService from '../services/NavigationService';
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native'
import LOVSchema from '../database/LOVSchema';

const AdhocEstablishmentComponent = (props: any) => {

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel })
    const { myTasksDraft, adhocTaskEstablishmentDraft, establishmentDraft } = useInject(mapStore)
    let dropdownRef4 = useRef();
    let dropdownRef1 = useRef();
    const isFocused = useIsFocused();

    const unitArr = [
        { type: 'English', value: 'English' },
        { type: 'Arabic', value: 'Arabic' }
    ]

    const [area, setArea] = useState(Array())
    const [sector, setSector] = useState(Array())
    // let establishmentData = establishmentDraft.allEstablishmentData != "" ? JSON.parse(establishmentDraft.allEstablishmentData) : Array();
    let establishmentData = RealmController.getAllEstablishments(realm, '');
    
    useEffect(() => {

        let areaKey = "UT_MARKET_CLASS";
        let sectorKey = "PHMA_RATING";

        let areaData = RealmController.getLovDataByKey(realm, LOVSchema.name, areaKey);
        let sectorData = RealmController.getLovDataByKey(realm, LOVSchema.name, sectorKey);

        let areaArray = areaData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });
        let sectorArray = sectorData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });

        setArea(areaArray)
        setSector(sectorArray)
        if (adhocTaskEstablishmentDraft.tradeLicenseHistoryResponse == '') {
            adhocTaskEstablishmentDraft.setAdhocEstDataBlank()
            adhocTaskEstablishmentDraft.setSelectedItem("")
        }
        adhocTaskEstablishmentDraft.setState('done');
        console.log('self.state BA 2222:::' + JSON.stringify(myTasksDraft.state));
        // myTasksDraft.setState('done');

    }, [isFocused])

    useEffect(() => {
        debugger;
        if (props.searchText) {
            let txt = props.searchText
            if (txt.split('-')[0].length < 3) {
                adhocTaskEstablishmentDraft.setLicenseNo(txt)
            }
            else {
                adhocTaskEstablishmentDraft.setEnglishTradeName(txt);
            }
        }

    }, [props.searchText])

    useEffect(() => {

        if (adhocTaskEstablishmentDraft.getState() == "success") {

            NavigationService.navigate('AdhocEstablishment')

        }

    }, [adhocTaskEstablishmentDraft.state])

    return (

        <View style={{ minHeight: 300, height: 'auto', alignItems: 'center', width: '90%', alignSelf: 'center' }}>

            <Spinner
                visible={adhocTaskEstablishmentDraft.state == 'pending' ? true : false}
                textContent={adhocTaskEstablishmentDraft.loadingState != '' ? adhocTaskEstablishmentDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 20, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: 'bold' }}
            />

            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.englishTradeName)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={adhocTaskEstablishmentDraft.englishTradeName}
                        maxLength={props.maxLength}
                        // multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        //  onChangeText={props.onChange}
                        onChange={(val: string) => {
                            adhocTaskEstablishmentDraft.setEnglishTradeName(val);
                        }}
                    />
                </View>
            </View>

            <View style={{ flex: 0.05 }} />

            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.arabicTradeName)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={adhocTaskEstablishmentDraft.arabicTradeName}
                        maxLength={props.maxLength}
                        // // multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        //onChangeText={props.onChange}

                        onChange={(val: string) => {
                            adhocTaskEstablishmentDraft.setArabicTradeName(val);
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.licenseSource)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={adhocTaskEstablishmentDraft.licenseSource}
                        maxLength={props.maxLength}
                        // multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        // onChangeText={props.onChange}
                        onChange={(val: string) => {
                            adhocTaskEstablishmentDraft.setLicenseSource(val);
                        }}

                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.licenseNo)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={adhocTaskEstablishmentDraft.licenseNo}
                        maxLength={props.maxLength}
                        // multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        //onChangeText={props.onChange}
                        onChange={(val: string) => {
                            adhocTaskEstablishmentDraft.setLicenseNo(val);
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.area)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            dropdownRef4 && dropdownRef4.current.focus();
                        }}
                        style={{
                            height: '70%', width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }} >
                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                            <Dropdown
                                ref={dropdownRef4}
                                value={adhocTaskEstablishmentDraft.area}
                                onChangeText={(val: string) => { adhocTaskEstablishmentDraft.setArea(val) }}
                                itemTextStyle={{ width: '100%', height: '100%', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: props.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                data={area}
                            />
                        </View>

                        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require("./../assets/images/condemnation/dropdownArrow.png")}

                                style={{ height: 16, width: 16, transform: [{ rotate: props.isArabic ? "180deg" : '0deg' }] }}
                                resizeMode={"contain"} />
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.sector)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TouchableOpacity
                        onPress={() => {
                            dropdownRef4 && dropdownRef1.current.focus();
                        }}
                        style={{
                            height: '70%', width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }} >
                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                            <Dropdown
                                ref={dropdownRef1}
                                value={adhocTaskEstablishmentDraft.sector}
                                onChangeText={(val: string) => { adhocTaskEstablishmentDraft.setSector(val) }}
                                itemTextStyle={{ width: '100%', height: '100%', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: props.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                data={sector}
                            />
                        </View>

                        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require("./../assets/images/condemnation/dropdownArrow.png")}

                                style={{ height: 16, width: 16, transform: [{ rotate: props.isArabic ? "180deg" : '0deg' }] }}
                                resizeMode={"contain"} />
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 0.2 }} />
            <View style={{ height: "20%", flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                <View style={{ flex: 0.5 }} />
                <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                    <ButtonComponent
                        style={{
                            height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                        }}
                        isArabic={props.isArabic}
                        buttonClick={() => {

                            if ((adhocTaskEstablishmentDraft.getArabicTradeName() != "" || adhocTaskEstablishmentDraft.getEnglishTradeName() != ""
                                || adhocTaskEstablishmentDraft.getLicenseNo() != "" || adhocTaskEstablishmentDraft.getLicenseSource() != "" || adhocTaskEstablishmentDraft.getSector() != ""
                                || (adhocTaskEstablishmentDraft.gtArea() != ""))) {
                                adhocTaskEstablishmentDraft.callToSearchByEstablishmentService(establishmentData)
                            } else {
                                if (adhocTaskEstablishmentDraft.tradeLicenseHistoryResponse == '') {
                                    Alert.alert("", "Atleast fill one value to search")
                                }
                            }
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.search)}
                    />
                </View>
                <View style={{ flex: 0.2 }} />

                {(props.taskType.toLowerCase() == 'supervisory inspections' || props.taskType.toLowerCase() == 'monitor inspector performance') ? null :
                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            isArabic={props.isArabic}
                            buttonClick={() => {

                                NavigationService.navigate('AdhocCreateNewEstablishment')
                                // NavigationService.navigate('AdhocEstablishmentDetails')
                            }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.createNew)}
                        />
                    </View>
                }

                <View style={{ flex: 0.5 }} />
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


export default observer(AdhocEstablishmentComponent);
