import React, { useContext, useRef, useState, useEffect } from 'react';
import { ToastAndroid, TextInput, Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, Alert } from "react-native";
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import DateComponent from './../components/DateComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
import NavigationService from '../services/NavigationService';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import validator from '../config/validator';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import LOVSchema from '../database/LOVSchema';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const { Popover } = renderers;

const Action = (props: any) => {

    const context = useContext(Context);
    let dropdownRef4 = useRef(null);
    const [actionList, setActionList] = useState(Array());
    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [textInputDate, setTextInputDate] = useState('');
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, actionDraft: rootStore.actionModel })
    const { myTasksDraft, actionDraft, establishmentDraft } = useInject(mapStore)
    const [text, setText] = useState('')
    const [taskId, setTaskId] = useState('');
    const [onReason, setOnReason] = useState(Array());
    const unitArr = [
        { type: 'Organization', value: 'Organization' },
        { type: 'Person', value: 'Person' },
        { type: 'Person', value: 'Person' },

    ]
    const [isVisible, setIsVisible] = useState(false);
    const [errormsg, setError] = useState({
        commentErr: '',
        dateErr: ''
    });

    let maxDate = moment().add(6, 'months').calendar();
    
    useEffect(() => {
        let taskId = myTasksDraft.taskId;
        setTaskId(taskId);
        actionDraft.setTaskId(taskId);
        actionDraft.setEstablishment(establishmentDraft.establishmentName);

        let reasonData = RealmController.getLovDataByKey(realm, LOVSchema.name, 'REPEATING_APPT_TYPE'), reasonArr = [];

        for (let index = 0; index < reasonData.length; index++) {
            let obj = Object();
            let element = reasonData[index];
            obj.value = element.Value;
            reasonArr.push(obj);
        }

        setOnReason(reasonArr);

    }, []);


    const submitAction = () => {
        let flag = true;
        let today: any = new Date();

        if (actionDraft.comments == '') {
            Alert.alert("",'Please enter the comment');
            flag = false;
        }
        else if ( actionDraft.proposedDate == '' || new Date(actionDraft.proposedDate) < today) {

            Alert.alert("","Please enter the date greater than or equal to today's date");
            flag = false;
        }
        else if (  actionDraft.proposedDate == '' ||  new Date(actionDraft.proposedDate) > new Date(maxDate)) {
            flag = false;
            Alert.alert("","Please enter date less than 6 months from today");

        }

        if (flag) {
            actionDraft.callToPosponeTask();
        }

    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Spinner
                visible={actionDraft.state == 'pending' ? true : false}
                textContent={actionDraft.loadingState != '' ? actionDraft.loadingState : 'Loading ...'}
                overlayColor={'rgba(0,0,0,0.3)'}
                //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')}/>}
                color={'#b6a176'}
                textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
            />
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.7 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 1.4 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : myTasksDraft.isMyTaskClick == 'tempPermit' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.temporaryPermits : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' || myTasksDraft.isMyTaskClick == 'tempPermit' ? 0.5 : 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>
                {/* <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.6, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 1.4, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{taskId}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text>
                    </View>

                    <View style={{ flex: 0.8 }} />

                </View> */}

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
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].action.action)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 3, width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.taskId)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                editable={false}
                                value={actionDraft.taskId}
                                onChange={(val: string) => {
                                    actionDraft.setTaskId(val);
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].action.establishment)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={actionDraft.establishment}
                                maxLength={50}
                                editable={false}
                                // multiline={false}
                                // numberOfLines={props.numberOfLines}
                                placeholder={''}
                                // keyboardType={props.keyboardType}
                                onChange={(val) => actionDraft.setEstablishment(val)}

                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].action.reason)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={{ flex: 0.6, justifyContent: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    dropdownRef4 && dropdownRef4.current.focus();
                                }}
                                style={{
                                    height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }} >
                                <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Dropdown
                                        ref={dropdownRef4}
                                        value={actionDraft.reason}
                                        onChangeText={(val: string) => {
                                            actionDraft.setReason(val)
                                        }}
                                        itemTextStyle={{ width: '100%', height: '100%', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                        containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                        data={onReason}//unitArr
                                    />
                                </View>

                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require("./../assets/images/condemnation/dropdownArrow.png")}

                                        style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                        resizeMode={"contain"} />
                                </View>

                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].action.comments)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                // isArabic={context.isArabic}
                                // numberOfLines={props.numberOfLines}
                                placeholder={''}
                                editable={true}
                                // isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'default'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                value={actionDraft.comments}
                                // placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChangeText={(val) => actionDraft.setComments(val)}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en']).action.proposedDate} </Text>
                        </View>

                        <View style={{ flex: 0.6 }}>
                            <DateComponent
                                maximumDate={new Date(maxDate)}
                                minimumDate={new Date()}
                                updateDate={actionDraft.setProposedDate}
                            />
                        </View>
                    </View>
                </View>

                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => { submitAction() }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.submit)}
                        />
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            buttonClick={() => { NavigationService.goBack() }}
                            isArabic={context.isArabic}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.cancel)}
                        />
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
                <View style={{ flex: 1.9 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>
        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },
    space: {
        flex: 0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center",
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 5,
    }
});
export default observer(Action);


