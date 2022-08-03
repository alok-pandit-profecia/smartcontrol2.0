import React, { useContext, useEffect, useState } from 'react';
import { Image, View, FlatList, SafeAreaView, Text, ImageBackground, Dimensions, StyleSheet } from "react-native";
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import TableComponent from './../components/TableComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import { fontColor, fontFamily } from '../config/config';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import { getContactLists } from './../services/WebServices';
import Spinner from 'react-native-loading-spinner-overlay';
import AlertComponentWithoutHeader from './../components/AlertComponentWithoutHeader/AlertComponentWithoutHeader';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
const { Popover } = renderers
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../services/NavigationService';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const ContactList = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, contactDraft: rootStore.contactModel, establishmentDraft: rootStore.establishmentModel })
    const [nContactList, setContactList] = useState(Array());
    const { myTasksDraft, establishmentDraft, contactDraft } = useInject(mapStore)
    const [isAlertVisible, setIsAlertVisible] = useState(false);
   
    const closeAlert = () => {
        setIsAlertVisible(false);
    }

    const okAlert = () => {
        setIsAlertVisible(false);
    }

    const renderRecentNews = (item: any, index: number) => {

        return (

            <View
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.16, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].contactList.type, value: item.type ? item.type : '-' },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].contactList.name, value: item.name ? item.name : '-' },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].contactList.nationality, value: item.nationality ? item.nationality : '-' },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].contactList.mobileNumber, value: item.mobileNumber ? item.mobileNumber : '-' },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].contactList.relationship, value: item.relationship ? item.relationship : '-' },
                    ]}
                />
            </View>
        )
    }

    const goBack = () => {
        establishmentDraft.setContactList('');
        NavigationService.goBack();
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {/* <Spinner
                    visible={establishmentDraft.state == 'pending' ? true : false}
                    textContent={establishmentDraft.loadingState != '' ? establishmentDraft.loadingState : 'Loading ...'}
                    // customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 20, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: 'bold' }}
                /> */}

                {
                    isAlertVisible ?
                        <AlertComponentWithoutHeader
                            title={Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.alertTitle}
                            okmsg={Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.performExisting}
                            cancelmsg={Strings[context.isArabic ? 'ar' : 'en'].temporaryPermits.createAdhoc}
                            closeAlert={closeAlert}
                            okAlert={okAlert}

                        />
                        : null
                }
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} screenName={'contact'} goBack={goBack} />
                </View>
                <View style={{ flex: 0.7 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 1.4 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'history' ? Strings[context.isArabic ? 'ar' : 'en'].taskList.history : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{myTasksDraft.taskId ? myTasksDraft.taskId : '-'}</Text>
                    </View>

                    <View style={{ flex: 0.003, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.1 }} />

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>

                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger style={styles.menuTrigger}>
                                <Text numberOfLines={1} style={{ color: '#5C666F', textDecorationLine: 'underline', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                            </MenuTrigger>
                            <MenuOptions style={styles.menuOptions}>
                                {/* <MenuOption onSelect={() => { }} > */}
                                <Text numberOfLines={1} style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}</Text>
                                {/* </MenuOption> */}

                            </MenuOptions>
                        </Menu>

                    </View>

                    <View style={{ flex: 0.3 }} />

                </View>


                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].contactList.contactList)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.2, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={establishmentDraft.contactList != '' && JSON.parse(establishmentDraft.contactList).length > 0 ? JSON.parse(establishmentDraft.contactList) : []}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={{ flex: 0.6 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView>
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
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});
export default observer(ContactList);