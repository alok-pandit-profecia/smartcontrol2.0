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

import Spinner from 'react-native-loading-spinner-overlay'

import LOVSchema from '../database/LOVSchema';

const AdhocVehicleComponent = (props: any) => {

    const mapStore = (rootStore: RootStoreModel) => ({
        myTasksDraft: rootStore.myTasksModel,
        AdhocTaskVehicleDraft: rootStore.adhocTaskVehicleModel
    })
    const { myTasksDraft, AdhocTaskVehicleDraft } = useInject(mapStore)
    let dropdownRef4 = useRef();

    const [placeOfIssue, setPlaceOfIssue] = useState(Array())

    const unitArr = [
        { type: 'English', value: 'English' },
        { type: 'Arabic', value: 'Arabic' }
    ]


    useEffect(() => {
        let placeOfIssueKey = "ADFCA_EMIRATES";

        let placeOfIssueData = RealmController.getLovDataByKey(realm, LOVSchema.name, placeOfIssueKey);

        let placeOfIssueArray = placeOfIssueData.map((item: any) => {
            let obj: any = {}
            obj.type = item.Value,
                obj.value = item.Value
            return obj
        });

        setPlaceOfIssue(placeOfIssueArray)
    }, [])

    useEffect(() => {
        debugger;

        if (AdhocTaskVehicleDraft.getState() == "success") {

            NavigationService.navigate('VehicleDetails')

        }

    }, [AdhocTaskVehicleDraft.state])

    return (
        <View style={{ minHeight: 230, height: 'auto', alignItems: 'center', width: '90%', alignSelf: 'center' }}>

            <Spinner
                visible={AdhocTaskVehicleDraft.state == 'pending' ? true : false}
                textContent={AdhocTaskVehicleDraft.loadingState != '' ? AdhocTaskVehicleDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 20, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: 'bold' }}
            />

            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.placeofIssue)} </Text>
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
                                value={''}
                                onChangeText={(val: string) => { AdhocTaskVehicleDraft.setPlaceOfIssue(val) }}
                                itemTextStyle={{ width: '100%', height: '100%', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: props.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                data={placeOfIssue}
                            />
                        </View>

                        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require("./../assets/images/condemnation/dropdownArrow.png")}

                                style={{ height: 16, width: 16, transform: [{ rotate: props.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={"contain"} />
                        </View>

                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.plateNumber)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={props.value}
                        maxLength={props.maxLength}
                        multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        onChangeText={props.onChange}
                        onChange={(val: string) => {
                            AdhocTaskVehicleDraft.setPlateNumber(val);
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.plateCode)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={props.value}
                        maxLength={props.maxLength}
                        multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        onChangeText={props.onChange}
                        onChange={(val: string) => {
                            AdhocTaskVehicleDraft.setPlateCode(val);
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.chassisNumber)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={props.value}
                        maxLength={props.maxLength}
                        multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={''}
                        keyboardType={props.keyboardType}
                        onChangeText={props.onChange}
                        onChange={(val: string) => {
                            AdhocTaskVehicleDraft.setChassisNumber(val);
                        }}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />

            <View style={{ flex: 0.2 }} />
            <View style={{ height: "25%", flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                <View style={{ flex: 0.5 }} />
                <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                    <ButtonComponent
                        style={{
                            height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                        }}
                        isArabic={props.isArabic}
                        buttonClick={() => {
                            // NavigationService.navigate('AdhocEstablishment')
                            AdhocTaskVehicleDraft.callToSearchByVehicleService()
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.search)}
                    />
                </View>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                    <ButtonComponent
                        style={{
                            height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                        }}
                        isArabic={props.isArabic}
                        buttonClick={() => { props.buttonClick }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[props.isArabic ? 'ar' : 'en'].adhocTask.cancel)}
                    />
                </View>
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


export default observer(AdhocVehicleComponent);
