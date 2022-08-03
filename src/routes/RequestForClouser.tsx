import React, { useState, useEffect, useContext, useRef } from 'react';
import { Image, View, ScrollView, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import BottomComponent from '../components/BottomComponent';
import Header from './../components/Header';
import ButtonComponent from '../components/ButtonComponent';
import TextInputComponent from '../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from '../services/NavigationService';
import Dropdown from '../components/dropdown';
import { RootStoreModel } from '../store/rootStore';
import Spinner from 'react-native-loading-spinner-overlay';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import LOVSchema from '../database/LOVSchema';
import LoginSchema from '../database/LoginSchema';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';

let realm = RealmController.getRealmInstance();
const { Popover } = renderers

const RequestForClouser = (props: any) => {

    const context = useContext(Context);
    const [flexDirections, setflexDirection] = useState('row');
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [taskList, setTaskList] = useState(Array());
    const [title, setTitle] = useState('');

    const mapStore = (rootStore: RootStoreModel) => ({ detentionDraft: rootStore.detentionModel, myTasksDraft: rootStore.myTasksModel, closureDraft: rootStore.adhocClosureModel })
    const { detentionDraft, myTasksDraft, closureDraft } = useInject(mapStore);
    const [taskId, setTaskId] = useState('');
    const [taskType, setTaskType] = useState('');
    const [onReason, setOnReason] = useState(Array());
    const mapStore1 = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel, establishmentDraft: rootStore.establishmentModel })
    const { loginDraft, establishmentDraft } = useInject(mapStore1)

    let dropdownRef1 = useRef();
    let dropdownRef4 = useRef();

    let temp = [
        { type: 'Organization', value: "" },
        { type: 'Person' },
        { type: 'Person' },
    ]

    const unitArr = [
        { type: 'Cneti Meter', value: 'Cneti Meter' },
        { type: 'FLOZ', value: 'FLOZ' },
        { type: 'Gallon', value: 'Gallon' },
        { type: 'Gram', value: 'Gram' },
        { type: 'Inch', value: 'Inch' },
    ]

    const packageArr = [
        { type: 'Package1', value: 'Package1' },
        { type: 'Package2', value: 'Package2' },
        { type: 'Package3', value: 'Package3' },
        { type: 'Package4', value: 'Package4' }
    ]

    useEffect(() => {
        let loginData = RealmController.getLoginData(realm, LoginSchema.name);
        loginData = loginData['0'] ? loginData['0'] : {};
        let loginInfo: any = loginData.loginResponse != '' ? JSON.parse(loginData.loginResponse) : {}

        let taskId = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskId : '';
        let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType : "";
        setTaskId(taskId);
        setTaskType(taskType);
        closureDraft.setInspectionId(taskId);
        closureDraft.setType(taskType);
        closureDraft.setCreatedBy(loginInfo.InspectorName);
        closureDraft.setEstablishment(establishmentDraft.establishmentName);

        const title = props.route ? props.route.params ? props.route.params.title : {} : {};
        setTitle(title);

    }, [])

    const submitAction = () => {
        let flag = true;

        if (closureDraft.comments == '') {
            Alert.alert("",'Please enter the comment');
            flag = false;
        }
        if (flag) {

            closureDraft.callToRequest();
        }
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <Spinner
                visible={closureDraft.state == 'pending' ? true : false}
                textContent={closureDraft.loadingState != '' ? closureDraft.loadingState : 'Loading ...'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                overlayColor={'rgba(0,0,0,0.3)'}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
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

                <View style={{ flex: 0.5, backgroundColor: '#abcfbe', flexDirection: 'row', width: '85%', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.requestForClosureDetails}</Text>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 4.5, width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 11, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.inspectionId)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                editable={false}
                                value={taskId}
                                onChange={(val: string) => {
                                    closureDraft.setInspectionId(val);
                                }}
                            />

                        </View>

                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.type)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={closureDraft.type}
                                editable={false}
                                onChange={(val: string) => {
                                    closureDraft.setType(val);
                                }}
                            />

                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.createdBy)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>

                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={closureDraft.createdBy}
                                editable={false}
                                onChange={(val: string) => {
                                    closureDraft.setType(val);
                                }}
                            />

                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.establishment)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={establishmentDraft.establishmentName ? establishmentDraft.establishmentName : '-'}
                                editable={false}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={detentionDraft.quantity}
                                onChange={(val: string) => {
                                    closureDraft.setEstablishment(val);
                                }}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1.5, height: HEIGHT * 1.2, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.comments)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInput
                                style={{
                                    height: '100%', textAlign: 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                numberOfLines={10}
                                multiline={true}
                                placeholder={'Comment'}
                                keyboardType='default'
                                editable={true}
                                onChangeText={closureDraft.setComments}
                            />
                        </View>

                    </View>


                </View>

                <View style={{ flex: 0.1 }} />

                <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.2 }} />

                    <ButtonComponent
                        style={{ height: '45%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        //  buttonClick={() => {
                        //    NavigationService.navigate('StartInspection');
                        //}}
                        buttonClick={() => { submitAction() }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                    />

                    <View style={{ flex: 0.5 }} />

                    <ButtonComponent
                        style={{ height: '45%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            NavigationService.navigate('StartInspection');
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.cancel)}
                    />

                    <View style={{ flex: 0.2 }} />

                </View>

                <View style={{ flex: 0.8 }} />

                <BottomComponent isArabic={context.isArabic} />

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
        flex: 0.1,
    },

    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});

export default observer(RequestForClouser);

