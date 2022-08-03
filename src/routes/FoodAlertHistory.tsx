import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, FlatList, SafeAreaView, Text, ImageBackground, Dimensions } from "react-native";
import Header from '../components/Header';
import BottomComponent from '../components/BottomComponent';
import TextComponent from '../components/TextComponent';
import { RootStoreModel } from '../store/rootStore';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import useInject from "../hooks/useInject";
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import KeyValueComponent from './../components/KeyValueComponent';
import NavigationService from '../services/NavigationService';

const FoodAlertHistory = (props: any) => {
    const context = useContext(Context);

    const [taskList, setTaskList] = useState(Array());
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)

    useEffect(() => {
        let temp = myTasksDraft.myTaskResponse;
        if (temp != '') {
            setTaskList(JSON.parse(temp))
        }
    }, []);

    const renderFoodAlert = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    // myTasksDraft.setSelectedTask(JSON.stringify(item))                    
                    NavigationService.navigate('FoodAlertDetails', { 'FoodAlertDetails': item ,'foodAlertHistory':true});

                }}
                key={item.inspectionId}
                style={{
                    height: 70, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: 'white', borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }}>
                <View style={{ flex: 3.7, padding: 5, justifyContent: 'center' }}>
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlert.alertId)} value={item.TaskId} />
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlert.type)} value={item.TaskType} />

                </View>
                <View style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10}:{ borderTopRightRadius: 10, borderBottomRightRadius: 10},{ flex: 1.3, justifyContent: 'center', backgroundColor: '#abcfbf', alignItems:'center' }]}>
                    <TextComponent
                        textStyle={[styles.alerttext, { color: '#5c666f', textAlign: 'left', fontSize: 12, fontWeight: 'normal' }]}
                        label={'Friday'}
                    />
                    <TextComponent
                        textStyle={[styles.alerttext, { color: '#5c666f', textAlign: 'left', fontSize: 12, fontWeight: 'normal' }]}
                        label={'21 sept 2020'}
                    />
                    <TextComponent
                        textStyle={[styles.alerttext, { color: '#5c666f', textAlign: 'left', fontSize: 12, fontWeight: 'normal' }]}
                        label={'09:09 PM'}
                    />
                </View>

            </TouchableOpacity>
        )
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.3 }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.7 }}>
                        <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                        <View style={{ flex: 0.5 }}></View>
                    </View>

                    <View style={{ flex: 1.5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlert.foodAlert)}</Text>
                    </View>
                    <View style={{ flex: 0.7 }}>
                        <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                        <View style={{ flex: 0.5 }}></View>
                    </View>
                </View>
                <View style={{ flex: 0.4, width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf', backgroundColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: 'center' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlert.title}</Text>

                </View>

                <View style={{ flex: 4.7, width: '85%', alignSelf: 'center' }} >
                    <View style={{ height: 10 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={taskList}
                        renderItem={({ item, index }) => {
                            return (
                                renderFoodAlert(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>

                <BottomComponent isArabic={context.isArabic} />
            </ImageBackground>
        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
    space: {
        flex: 0.0
    },
    alerttext: {
        fontSize: 12,
        // paddingTop: '5%',
        // paddingRight: '5%',
        // paddingLeft: '5%',
        // paddingBottom: '5%',
        fontWeight: 'bold',
        // color: 'white'
    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(FoodAlertHistory);