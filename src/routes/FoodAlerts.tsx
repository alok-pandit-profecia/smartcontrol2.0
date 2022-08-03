import React, { useContext, useState, useEffect } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import BottomComponent from './../components/BottomComponent';
import TextComponent from './../components/TextComponent';
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

const FoodAlerts = (props: any) => {

    const context = useContext(Context);
    const [foodAlertList, setFoodAlertList] = useState(Array());
    const [isLoading, setIsLoading] = useState(true);
    const [noData, setNoData] = useState('');
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, foodalertDraft: rootStore.foodAlertsModel, alertDraft: rootStore.foodAlertsModel })
    const { myTasksDraft, foodalertDraft, alertDraft } = useInject(mapStore)

    useEffect(() => {
        // foodalertDraft.callToFetchFoodAlertService();
    }, []);

    useEffect(() => {
        if (foodalertDraft.state === 'noAlert') {
            setNoData('No Alerts')
        }
    }, [foodalertDraft.state])

    useEffect(() => {

        let foodAlertArray = [];
        let foodAlertResponse1 = foodalertDraft.getAlertResponse() != '' ? JSON.parse(foodalertDraft.getAlertResponse()) : [];
        // //console.log("foodAlertResponse1", foodAlertResponse1);
        for (let index = 0; index < foodAlertResponse1.length; index++) {
            let element = foodAlertResponse1[index]
            let obj = {
                AlertNumber: element.AlertNumber,
                SourceAlertNumber: element.SourceAlertNumber,
                AssignedTo: element.AssignedTo,
                Summary: element.Summary,
                Comments: element.Comments,
                Description: element.Description,
                ToDate: element.ToDate,
                CloseDate: element.CloseDate,
                Secure: element.Secure,
                SourceType: element.SourceType,
                StartDate: element.StartDate,
                Status: element.Status,
                Type: element.Type,
                Condemnation: element.Condemnation,
                Detention: element.Detention,
                Sampling: element.Sampling,
                ProductList: element.ProductList

            }
            foodAlertArray.push(obj);
        }
        // //console.log("foodAlertArray", foodAlertArray);
        setFoodAlertList(foodAlertArray);

    }, [foodalertDraft.getAlertResponse()]);

    const renderMyTask = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    // myTasksDraft.setSelectedTask(JSON.stringify(item))
                    foodalertDraft.setSelectedAlertObj(JSON.stringify(item))
                    alertDraft.setSelectedAlertObj(JSON.stringify(item))
                    NavigationService.navigate('FoodAlertDetails', { 'FoodAlertDetails': item });
                }}
                key={item.inspectionId}
                style={{
                    height: 70, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius: context.isArabic ? 0 : 10, borderBottomRightRadius: context.isArabic ? 0 : 10, borderTopLeftRadius: context.isArabic ? 10 : 0, borderBottomLeftRadius: context.isArabic ? 10 : 0, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: 'white', borderLeftWidth: context.isArabic ? 1 : 5, borderRightWidth: context.isArabic ? 5 : 1, borderRightColor: context.isArabic ? '#d51e17' : '#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor: context.isArabic ? '#5C666F' : '#d51e17'
                    , shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }}>
                <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertNumber)} value={item.AlertNumber} />
                <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.type)} value={item.Type} />

            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {/* <Spinner
                    visible={foodalertDraft.state == 'pending' ? true : false}
                    textContent={foodalertDraft.loadingState != '' ? foodalertDraft.loadingState : 'Loading'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                    color={'rgba(0,0,0,0.3)'}
                    textStyle={{ fontSize: 20, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: 'bold' }}
                /> */}
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 1.5 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlerts}</Text>
                        </View>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                    <View style={{ flex: 0.6, width: '85%', alignSelf: 'center' }}>
                        <SearchComponent onChangeSearch={(e: string) => { }} isArabic={context.isArabic} />
                    </View>

                </View>

                <View style={{ flex: 5.8, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 30 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={foodAlertList}
                        renderItem={({ item, index }) => {
                            return (
                                renderMyTask(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                        ListEmptyComponent={() => <TextComponent textStyle={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }} label={noData} />}
                    />
                </View>
                <View style={{ flex: 1.2 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView>
    )
}


export default observer(FoodAlerts);