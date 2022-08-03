import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from './../components/BottomComponent';
import Header from './../components/Header';
import TextComponent from './../components/TextComponent';
import AdhocEstablishmentComponent from './../components/AdhocEstablishmentComponent';
import AdhocVehicleComponent from './../components/AdhocVehicleComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject"
import Accordion from 'react-native-collapsible/Accordion';


const AdhocEstablishmentAndVehical = (props: any) => {
    const context = useContext(Context);
    const [activeSections, setSection] = useState([0]);
    const [Sections, setSections] = useState(Array());
    const [searchText, setSearchText] = useState('');

    const mapStore = (rootStore: RootStoreModel) => ({
        myTasksDraft: rootStore.myTasksModel,
        adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel,
        adhocTaskVehicleDraft: rootStore.adhocTaskVehicleModel
    })
    const { myTasksDraft, adhocTaskEstablishmentDraft, adhocTaskVehicleDraft } = useInject(mapStore)
    let AdhocSections = [
        { title: myTasksDraft.isMyTaskClick == 'History' ? Strings[context.isArabic ? 'ar' : 'en'].history.serachByEstablishment : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishment, type: "establishment" },
        { title: myTasksDraft.isMyTaskClick == "History" ? Strings[context.isArabic ? 'ar' : 'en'].history.searchByVehicle : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.vehicle, type: 'vehicle' },

    ];

    let SectionsSupervisory = [
        { title: myTasksDraft.isMyTaskClick == 'History' ? Strings[context.isArabic ? 'ar' : 'en'].history.serachByEstablishment : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.establishment, type: "establishment" }
    ];

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''

    useEffect(() => {
        debugger;
        const searchText = props.route ? props.route.params ? props.route.params.filter : '' : '';
        setSearchText(searchText)
        adhocTaskEstablishmentDraft.setAdhocEstDataBlank()
        adhocTaskVehicleDraft.setVehicleDataBlank()

        if (myTasksDraft.selectedTask != '' && myTasksDraft.isMyTaskClick != 'History') {
            // let taskType = taskType;a
            if (taskType != '' && (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance')) {
                setSections(SectionsSupervisory);
            }
            else {
                setSections(AdhocSections);
            }
        }
        else {
            setSections(AdhocSections);
        }

    }, [])

    const renderAccordionHeader = (content: any, index: any, isActive: any) => {
        return (
            <View style={{ minHeight: HEIGHT * 0.01, height: 'auto', backgroundColor: '#abcfbf', flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 22 }}>
                <View style={{ flex: 8.4, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 12, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                        label={content.title}
                    />

                </View>
                <View style={{ flex: 0.3 }} />
                <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center', height: 25, }}>

                    {
                        isActive ? <Image
                            source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                            style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '90deg' }] : [{ rotate: '90deg' }] }}
                            resizeMode={'contain'}
                        />
                            :
                            <Image
                                source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '-180deg' }] : [{ rotate: '0deg' }] }}
                                resizeMode={'contain'}
                            />
                    }
                </View>
            </View>
        );
    };

    const renderContent = (item: any) => {
        return (
            item.type == 'establishment' ? <AdhocEstablishmentComponent searchText={searchText} isArabic={context.isArabic} taskType={myTasksDraft.selectedTask != '' ? taskType.toLowerCase() : ''} /> :
                item.type == 'vehicle' ? <AdhocVehicleComponent isArabic={context.isArabic} /> : null
        );
    };

    const updateSections = (activeSections: any) => {
        setSection(activeSections.includes(undefined) ? [] : activeSections);
    };

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5 }}>
                    <Header AdhocEstablishmentAndVehical={true} isArabic={context.isArabic} />
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

                <View style={{ flex: 4.9, width: '87%', alignSelf: 'center' }}>

                    <ScrollView>
                        <Accordion
                            sections={Sections}
                            activeSections={activeSections}
                            renderHeader={renderAccordionHeader}
                            renderContent={renderContent}
                            touchableComponent={TouchableOpacity}
                            onChange={updateSections}
                        />
                    </ScrollView>

                </View>

                <View style={{ flex: 2 }} />

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
    }

});

export default observer(AdhocEstablishmentAndVehical);