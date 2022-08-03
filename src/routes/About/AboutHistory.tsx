import React, { useContext, useEffect, useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, SafeAreaView, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import Header from '../../components/Header';
import BottomComponent from '../../components/BottomComponent';
import ButtonComponent from '../../components/ButtonComponent';
import TextComponent from '../../components/TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../../config/config';
import Strings from '../../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import TableComponent from '../../components/TableComponent';
import NavigationService from '../../services/NavigationService';
import SearchComponent from '../../components/SearchComponent';
import { FlatList } from 'react-native-gesture-handler';
import KeyValueComponent from '../../components/KeyValueComponent';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";

const AboutHistory = (props: any) => {

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

    const renderAboutHistoryTask = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    myTasksDraft.setIsMyTaskClick('history');
                    NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                }}
                key={item.inspectionId}
                style={[context.isArabic ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10, borderRightColor: '#d51e17', borderRightWidth: 5, borderLeftColor: '#5C666F' } : { borderTopRightRadius: 10, borderBottomRightRadius: 10, borderLeftColor: '#d51e17', borderLeftWidth: 5, borderRightColor: '#5C666F' }, {
                    height: 65, width: '100%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, shadowRadius: 1, backgroundColor: 'white', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }]}>

                <View style={[{
                    flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.inspectionId)} value={item.TaskId} />
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].myTask.type)} value={item.TaskType} />
                </View>

                <View style={[{
                    flex: 1, width: '100%', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row'
                }]}>
                    <KeyValueComponent isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} value={'Successful'} />
                    <KeyValueComponent flex1={0.3} flex2={0.7} isArabic={context.isArabic} keyName={(Strings[context.isArabic ? 'ar' : 'en'].completedTasks.date)} value={'Aug 16,2020'} />
                </View>

            </TouchableOpacity>
        )
    }


    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.2 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].taskList.about)}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>


                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].taskList.history)} </Text>
                </View>

                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 0.6, width: '90%', alignSelf: 'center' }}>
                    <SearchComponent isArabic={context.isArabic} />
                </View>
                {/* <View style={{ flex: 1.8, width: '85%', alignSelf: 'center',borderWidth:1,borderColor:'#abcfbf',borderRadius:10 }}>

                   
                </View> */}

                <View style={{ flex: 4.7, width: '85%', alignSelf: 'center' }} >
                    <View style={{ height: 5 }} />
                    {
                        taskList.length > 0 ?
                            <FlatList
                                nestedScrollEnabled={true}
                                data={taskList}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderAboutHistoryTask(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
                            />
                            : null
                    }
                </View>

                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

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
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(AboutHistory);