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
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
import LOVSchema from '../database/LOVSchema';
import Spinner from 'react-native-loading-spinner-overlay';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
let realm = RealmController.getRealmInstance();
const { Popover } = renderers

const OnHoldRequest = (props: any) => {

    const context = useContext(Context);
    const [flexDirections, setflexDirection] = useState('row');
    const [taskId1, setTaskId1] = useState('');
    const [onReason, setOnReason] = useState(Array());
    const [title, setTitle] = useState('');

    const mapStore = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel, establishmentDraft: rootStore.establishmentModel })
    const { loginDraft, establishmentDraft } = useInject(mapStore)
    const mapStore1 = (rootStore: RootStoreModel) => ({ onHoldRequestDraft: rootStore.onHoldeRequestModel })
    const { onHoldRequestDraft, } = useInject(mapStore1);
    const mapStore2 = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore2)


    const [error, setError] = useState({
        inspectionIdError: '',
        typeError: '',
        createdByError: '',
        establishmentError: '',
        ReasonError: '',
        commentError: ''
    });

    let dropdownRef1 = useRef();
    let dropdownRef4 = useRef();


    useEffect(() => {

        let taskId = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskId : '';
        let NabArr = [];

        onHoldRequestDraft.setEstablishment(establishmentDraft.establishmentName);

        let taskId1 = taskId
        setTaskId1(taskId1);
        let data = RealmController.getLovDataByKey(realm, LOVSchema.name, 'NBR_LAPTOPS');
        // //console.log("onholdData", data);
        // //console.log("onHoldArraylength", data.length);
        for (let index = 0; index < data.length; index++) {
            let obj = Object();
            let element = data[index];
            obj.value = element.Value;
            NabArr.push(obj);
        }
        
        // //console.log("onHoldArrayIn", NabArr);
        setOnReason(NabArr);

        const title = props.route ? props.route.params ? props.route.params.title : {} : {};
        setTitle(title);

    }, [])

    const onSunbmit = () => {

        let flag = true;
        // if (onHoldRequestDraft.inspectionId === '') {
        //     flag = false;
        //     setError(prevState => {
        //         return { ...prevState, inspectionIdError: 'required' }
        //     });

        // }
        // if (onHoldRequestDraft.type === '') {
        //     flag = false;
        //     setError(prevState => {
        //         return { ...prevState, typeError: 'required' }
        //     });

        // }
        // if (onHoldRequestDraft.createdBy === '') {
        //     flag = false;
        //     setError(prevState => {
        //         return { ...prevState, createdByError: 'required' }
        //     });

        // }
        // if (onHoldRequestDraft.establishment === '') {
        //     flag = false;
        //     setError(prevState => {
        //         return { ...prevState, establishmentError: 'required' }
        //     });

        // }
        // if (onHoldRequestDraft.reason === '') {
        //     flag = false;
        //     setError(prevState => {
        //         return { ...prevState, ReasonError: 'required' }
        //     });

        // }
        if (onHoldRequestDraft.comments === '') {
            flag = false;
            setError(prevState => {
                return { ...prevState, commentError: 'required' }
            });

        }

        if (flag) {

            let taskId = taskId1;
            let reason = onHoldRequestDraft.reason;
            let comments = onHoldRequestDraft.comments;
            // //console.log("onHoldRequestData", taskId, reason, comments)
            onHoldRequestDraft.callToOnHoldDataService(taskId, reason, comments);
        }
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <Spinner
                    visible={onHoldRequestDraft.state == 'pending' || myTasksDraft.state == 'pending' ? true : false}
                    textContent={onHoldRequestDraft.loadingState != '' ? onHoldRequestDraft.loadingState : 'Loading ..'}
                    //customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 10, fontWeight: '400' }}
                />
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
                        </View>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
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

                    <Text style={{ color: '#5C666F', textAlign: 'center', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].onHoldRequest.onHoldRequestDetails}</Text>

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
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={taskId1}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                // numberOfLines={props.numberOfLines}
                                // placeholder={props.placeholder}
                                editable={false}
                                isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'numeric'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    // onHoldRequestDraft.setInspectionId(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                            {/* {error.inspectionIdError == 'required' || error.inspectionIdError == 'invalid' ?
                                error.inspectionIdError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.inspectionIdError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null} */}

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
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={onHoldRequestDraft.type}
                                editable={false}
                                keyboardType={'default'}
                                onChange={(val: string) => {
                                    onHoldRequestDraft.setType(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                            {/* {error.typeError == 'required' || error.typeError == 'invalid' ?
                                error.typeError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.typeError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null} */}


                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].onHoldRequest.createdBy)} </Text>
                        </View>

                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={loginDraft.username}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                // numberOfLines={props.numberOfLines}
                                // placeholder={props.placeholder}
                                editable={false}
                                // isMultiline={props.isMultiline ? props.isMultiline : false}
                                keyboardType={'default'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    onHoldRequestDraft.setCreatedBy(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />

                            {/* {error.createdByError == 'required' || error.createdByError == 'invalid' ?
                                error.createdByError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.createdByError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null} */}

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
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={onHoldRequestDraft.establishment}
                                maxLength={50}
                                editable={false}
                                onChange={(val: string) => {
                                    // onHoldRequestDraft.setEstablishment(val);
                                    // setError(prevState => {
                                    //     return { ...prevState, trainedError: '' }
                                    // });
                                }}
                            />
                            {error.establishmentError == 'required' || error.establishmentError == 'invalid' ?
                                error.establishmentError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.establishmentError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null}

                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.reason)} </Text>
                        </View>

                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>

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
                                        value={onHoldRequestDraft.reason}

                                        onChangeText={(val: string) => {
                                            onHoldRequestDraft.setReason(val);
                                            setError(prevState => {
                                                return { ...prevState, ReasonError: '' }
                                            });

                                        }}
                                        itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                        containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                        data={onReason}
                                    />
                                    {/* {error.ReasonError == 'required' || error.ReasonError == 'invalid' ?
                                        error.ReasonError == 'required' ? <Text style={{ fontSize: 10, bottom: 0,top:3, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                            :
                                            error.ReasonError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                                : null : null} */}
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

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1.5, height: HEIGHT * 1.2, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].requestForClosure.comments)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent

                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={onHoldRequestDraft.comments}
                                maxLength={props.maxLength ? props.maxLength : 50}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                // editable={props.editable}
                                isMultiline={false}
                                keyboardType={'default'}
                                placeholderTextColor={fontColor.TextBoxTitleColor}
                                onChange={(val: string) => {
                                    onHoldRequestDraft.setComments(val);
                                    setError(prevState => {
                                        return { ...prevState, trainedError: '' }
                                    });
                                }}
                            />
                            {error.commentError == 'required' || error.commentError == 'invalid' ?
                                error.commentError == 'required' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('This Field Is Requied')}</Text>
                                    :
                                    error.commentError == 'invalid' ? <Text style={{ fontSize: 10, bottom: 0, color: 'red', paddingLeft: 4 }}>{('Invalid')}</Text>
                                        : null : null}


                        </View>

                    </View>


                </View>

                <View style={{ flex: 0.1 }} />

                <View style={{ flex: 0.9, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 1.5 }} />

                    <ButtonComponent
                        style={{ height: '45%', width: '40%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            onSunbmit();
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submit}
                    />


                    <View style={{ flex: 1.5 }} />

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

export default observer(OnHoldRequest);

