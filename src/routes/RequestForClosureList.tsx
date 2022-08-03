import React, { useContext, useState, useEffect } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../services/NavigationService';
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import Spinner from 'react-native-loading-spinner-overlay';


const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const RequestForClosureList = (props: any) => {

    const context = useContext(Context);
    const [reminderList, setReminderList] = useState(Array());
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel })
    const { myTasksDraft, adhocTaskEstablishmentDraft } = useInject(mapStore)

    useEffect(() => {
        let temp = adhocTaskEstablishmentDraft.tradeLicenseHistoryResponse != '' ? JSON.parse(adhocTaskEstablishmentDraft.tradeLicenseHistoryResponse) : []
        let data = temp[0] && temp[0].ListOfOpportunity ? temp[0].ListOfOpportunity : []
        let result = data.TradeViolation ? data.TradeViolation.filter((item: any) => {
            if (item.Status == 'Request for Closure') {
                return item;
            }
        }) : []
        // alert(JSON.stringify(data))
        setReminderList(result)

    }, [adhocTaskEstablishmentDraft.tradeLicenseHistoryResponse]);

    const renderMyTask = (item: any, index: number) => {

        return (
            <TouchableOpacity
                onPress={() => {
                    // myTasksDraft.setSelectedTask(JSON.stringify(item))
                    // NavigationService.navigate('');
                }}
                key={item.inspectionId}
                style={{
                    height: 70, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius: context.isArabic ? 0 : 10, borderBottomRightRadius: context.isArabic ? 0 : 10, borderTopLeftRadius: context.isArabic ? 10 : 0, borderBottomLeftRadius: context.isArabic ? 10 : 0, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: 'white', borderLeftWidth: context.isArabic ? 1 : 5, borderRightWidth: context.isArabic ? 5 : 1, borderRightColor: context.isArabic ? '#d51e17' : '#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor: context.isArabic ? '#5C666F' : '#d51e17'
                    , shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }}>
                <KeyValueComponent flex1={0.6} flex2={1.4} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.inspectionId)} value={item.InspectionNumber} />
                <KeyValueComponent flex1={0.6} flex2={1.4} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.type)} value={item.Status} />

            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Spinner
                visible={adhocTaskEstablishmentDraft.state == 'pending' ? true : false}
                textContent={adhocTaskEstablishmentDraft.loadingState ? adhocTaskEstablishmentDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.3 }}>
                        <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                        <View style={{ flex: 0.5 }}></View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.requestforClosure}</Text>
                    </View>

                    <View style={{ flex: 0.3 }}>
                        <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                        <View style={{ flex: 0.5 }}></View>
                    </View>

                </View>

                <View style={{ flex: 6, width: '80%', alignSelf: 'center' }}>
                    {/* <View style={{ height: 30 }} /> */}
                    <FlatList
                        nestedScrollEnabled={true}
                        data={reminderList}
                        renderItem={({ item, index }) => {
                            return (
                                renderMyTask(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                    />
                </View>
                <View style={{ flex: 0.7 }} />
                <BottomComponent isArabic={context.isArabic} />

            </ImageBackground>

        </SafeAreaView>
    )
}

export default observer(RequestForClosureList);
