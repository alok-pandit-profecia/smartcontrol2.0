import React, { useContext, useState, useEffect } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    PieChart,
} from "react-native-chart-kit";
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import TableComponent from './../components/TableComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import SearchComponent from '../../src/components/SearchComponent';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const LastReportTwo = (props: any) => {

    const context = useContext(Context);
    const [foodAlertList, setFoodAlertList] = useState(Array());
    const [isLoading, setIsLoading] = useState(true);
    const mapStore = (rootStore: RootStoreModel) => ({ alertDraft: rootStore.foodAlertsModel })
    const { alertDraft } = useInject(mapStore)
    const data = [
        {
            name: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.satisfactory,
            population: 20,
            color: "red",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.unsatisfactory,
            population: 8,
            color: "#abcfbf",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        },
        {
            name: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.done,
            population: 5,
            color: "gray",
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
        }
    ];
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <Spinner
                    visible={alertDraft.state == 'pending' ? true : false}
                    textContent={alertDraft.loadingState != '' ? alertDraft.loadingState: 'Loading ..'}
                   //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    color={'rgba(0,0,0,0.3)'}
                    textStyle={{ fontSize: 16, color: '#000000',backgroundColor:'white',borderRadius:8, padding:10,fontWeight:'400' }}
                />
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1 }}>

                    <View style={{ flex: 1.3, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].LastRecord.about}</Text>
                        </View>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>


                </View>

                <View style={{ flex: 6, width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 0.4, flexDirection: 'row', width: '100%', backgroundColor: '#abcfbf', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>{Strings[context.isArabic ? 'ar' : 'en'].LastRecord.lastRecord}</Text>
                    </View>
                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.4, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#abcfbf', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>
                        <TouchableOpacity style={{ position: 'absolute', left: 20 }}>
                            <Image style={{ transform: [{ rotate: '180deg' }] }} source={require('./../assets/images/condemnation/dropdownArrow.png')} />
                        </TouchableOpacity>
                        <Text style={{ color: '#5C666F', fontSize: 13, textAlign: 'center' }}>{Strings[context.isArabic ? 'ar' : 'en'].LastRecord.inspectionDetails}{'1-661216147'}</Text>
                        <TouchableOpacity style={{ position: 'absolute', right: 20 }}>
                            <Image source={require('./../assets/images/condemnation/dropdownArrow.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.15 }} />

                    <View style={{ flex: 3.2, width: '100%', alignSelf: 'center', borderWidth: 3, borderColor: '#abcfbf', borderRadius: 12 }}>
                        <TableComponent isHeader={false}
                            isArabic={context.isArabic}
                            data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.taskType, value: 'Routine Inspection' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.creationDate, value: '29/09/2020 14:00:00' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.score, value: '' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.grade, value: 'Grade A' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.action, value: 'Voilation' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.businessActivity, value: 'Grocery' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.status, value: 'Unsatisfactory' },
                            { keyName: Strings[context.isArabic ? 'ar' : 'en'].LastRecord.actualInspectionDate, value: '29/09/2020 14:00:00' }
                            ]}
                        />
                    </View>
                    <View style={{ flex: 0.5, width: '100%' }} />

                </View>
                <View style={{ flex: 1.2 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView>
    )
}


export default observer(LastReportTwo);