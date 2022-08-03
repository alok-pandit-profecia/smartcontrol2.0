import React, { useState, useEffect, useContext } from 'react';
import messaging from '@react-native-firebase/messaging';
import { Platform, Linking, View, Text, Image, ImageBackground, Dimensions, Switch, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, ToastAndroid, Alert, Modal } from "react-native";
import { observer } from 'mobx-react';
import { RootStoreModel } from "../store/rootStore"
import useInject from "../hooks/useInject"
import NavigationService from '../services/NavigationService';
import { fontFamily, fontColor, isDev } from '../config/config';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import TaskSchema from '../database/TaskSchema';
import EstablishmentSchema from '../database/EstablishmentSchema';
import AllEstablishmentSchema from '../database/AllEstablishmentSchema';
import Strings from '../config/strings';
import { Context } from '../utils/Context';
import Spinner from 'react-native-loading-spinner-overlay';
import FingerprintScanner from 'react-native-fingerprint-scanner';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
import XLSX from 'xlsx';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
const input = (res: any) => res;
const output = (str: any) => str;
const make_cols = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, (x, i) => XLSX.utils.encode_col(i));
const make_width = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, () => 60);
import { useIsFocused } from '@react-navigation/native';

import TouchID from 'react-native-touch-id';
import LoginSchema from '../database/LoginSchema';
let currentIndex = 0;
var estArrayforAll = Array()
function useAsyncState(initialValue: any) {

    const [value, setValue] = useState(initialValue);

    const setter = (x: any) =>
        new Promise(resolve => {
            setValue(x);
            resolve(x);
        });
    return [value, setter];

}

const Login = (props: any) => {
    const context = useContext(Context);

    const mapStore = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel, establishmentDraft: rootStore.establishmentModel })
    const { loginDraft, establishmentDraft } = useInject(mapStore)
    let num = 0;
    const [isVisible, setIsVisible] = useState(false);
    const [allEst, setAllEst] = useState(Array());
    const [establishmentCurrentIndex, setEstablishmentCurrentIndex] = useAsyncState(0);
    const [establishmentLength, setEstablishmentLength] = useAsyncState(0);
    const [errormsg, setError] = useState({
        userNameErr: '',
        passwordErr: ''
    });

    const [isVisibleBiometric, setIsVisibleBiometric] = useState(false);
    const isFocused = useIsFocused();
    var loginInfo: any;

    async function increment(count: number) {
        setEstablishmentCurrentIndex(count + 1)
    }

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
            Alert.alert('A new message arrived!', JSON.stringify(remoteMessage.notification?.body));
        });

        return unsubscribe;
    }, []);


    useEffect(() => {
        messaging().onNotificationOpenedApp((remoteMessage: any) => {
            //console.log(
            //     'Notification caused app to open from background state:',
            //     remoteMessage.notification,
            // );
        });


        messaging()
            .getInitialNotification()
            .then((remoteMessage: any) => {
                if (remoteMessage) {
                    //console.log(
                    //     'Notification caused app to open from quit state:',
                    //     remoteMessage.notification,
                    // );
                }
            });
    }, []);

    async function AddEst() {
        try {

            loginDraft.setUsername('');
            loginDraft.setPassword('');
            loginDraft.callToLovDataByKeyService(false);

            let allest = RealmController.getAllEstablishments(realm, EstablishmentSchema.name);
            establishmentDraft.setAllEstablishmentData(JSON.stringify(allest));

            loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

            if (loginInfo && loginInfo['0'] && loginInfo['0'].username && loginInfo['0'].password &&
                loginInfo['0'].username != "" && loginInfo['0'].password != "") {
                bioAuthenticate()
                loginDraft.setUsername(loginInfo['0'].username);
                loginDraft.setPassword(loginInfo['0'].password);
                setIsVisibleBiometric(true);
            }
            else {
                setIsVisibleBiometric(false);
            }

        } catch (error) {
            console.log("errorgetTask" + error)
            loginDraft.setState('done');
            loginDraft.callToLovDataByKeyService(false);
            loginDraft.setLoadingState('')
        }

    };


    useEffect(() => {
        loginDraft.setState('pending');
        loginDraft.setLoadingState('Inserting Establishment Data');

        setTimeout(() => {
            // let lengthofest = RealmController.getEStLength(realm);
            // if (parseInt(lengthofest) > 36000) {
            loginDraft.setState('done');
            AddEst();
            // }
            loginDraft.setState('done');
        }, 10000);
    }, []);

    useEffect(() => {
        debugger;
        if (loginDraft.getState() == "loginSuccess") {
            // setIsVisible(false);
            // return () => {
            setIsVisibleBiometric(false);

            // }
            NavigationService.navigate('Dashboard');
        }

    }, [loginDraft.state])

    const submit = () => {
        let flag = true;
        if (loginDraft.username === '') {
            flag = false;
            setError(prevState => {
                return { ...prevState, userNameErr: 'required' }
            });
            ToastAndroid.show(Strings[context.isArabic ? 'ar' : 'en'].login.invalidUserName, 1000);
        }
        if (loginDraft.password === '') {
            flag = false;
            setError(prevState => {
                return { ...prevState, passwordErr: 'required' }
            });
            ToastAndroid.show((Strings[context.isArabic ? 'ar' : 'en'].login.invalidPassword), 1000);
        }

        if (flag) {
            loginDraft.callToLoginService(false);
            // NavigationService.navigate('Dashboard');
        }
    }

    // const bioAuthenticate = () => {

    //     const optionalConfigObject = {
    //         title: 'Sign in', // Android
    //         imageColor: '#e00606', // Android
    //         imageErrorColor: '#ff0000', // Android
    //         sensorDescription: 'Touch sensor', // Android
    //         sensorErrorDescription: 'Failed', // Android
    //         cancelText: 'Cancel', // Android
    //         fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    //         unifiedErrors: false, // use unified error messages (default false)
    //         passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    //     };

    //     TouchID.authenticate('', optionalConfigObject)
    //         .then((success: any) => {
    //             loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
    //             if (loginInfo && loginInfo[0] && loginInfo[0].username && loginInfo[0].password &&
    //                 loginInfo[0].username != "" && loginInfo[0].password != "") {
    //                 loginDraft.setUsername(loginInfo[0].username);
    //                 loginDraft.setPassword(loginInfo[0].password);
    //                 NavigationService.navigate('Dashboard');
    //             }
    //             // loginDraft.callToLoginService(true);
    //         })
    //         .catch((error: any) => {
    //             Alert.alert('Authentication Failed');
    //         });
    // }

    const bioAuthenticate = () => {

        FingerprintScanner
            .authenticate({ description: 'Log in with Biometrics' })
            .then((res: any) => {
                console.log("error: ", JSON.stringify(res))

                console.log("biometric:");
                FingerprintScanner.release();
                loginInfo = RealmController.getLoginData(realm, LoginSchema.name);
                if (loginInfo && loginInfo[0] && loginInfo[0].username && loginInfo[0].password &&
                    loginInfo[0].username != "" && loginInfo[0].password != "") {
                    loginDraft.setUsername(loginInfo[0].username);
                    loginDraft.setPassword(loginInfo[0].password);
                    setIsVisibleBiometric(false);

                    NavigationService.navigate('Dashboard');
                }
            })
            .catch((error: any) => {
                console.log("error: ", error.name)
                if (error.name != "UserCancel" && error.name != "UserFallback") {
                    // Alert.alert(error.message);
                }
                FingerprintScanner.release();
            });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground
                style={[styles.fixed, styles.containter]}
                source={context.isArabic ? require('./../assets/images/backgroundImageAr.jpg') : require('./../assets/images/backgroundImage.jpg')}
            >
                {/* <ProgressCircle
                    percent={establishmentCurrentIndex}
                    radius={50}
                    borderWidth={8}
                    color="#3399FF"
                    shadowColor="#999"
                    bgColor="#fff"
                >
                    <Text style={{ fontSize: 18 }}>{establishmentCurrentIndex}</Text>
                </ProgressCircle> */}

                <Modal
                    visible={isVisible}
                    transparent={true}
                >
                    <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20, justifyContent: 'center', zIndex: 8, alignItems: 'center', }}>
                        <View style={{ width: WIDTH * 0.9, height: HEIGHT * 0.2, position: 'absolute', alignSelf: 'center', padding: 20, borderRadius: 10, top: '30%', backgroundColor: 'white' }} >
                            <Text style={{ color: fontColor.TitleColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{`${establishmentCurrentIndex} / ${establishmentLength}`}  </Text>
                        </View>
                    </View>
                </Modal>

                <Spinner
                    visible={loginDraft.state == 'pending' ? true : false}
                    textContent={loginDraft.loadingState != '' ? loginDraft.loadingState : 'Loading ...'}
                    overlayColor={'rgba(0,0,0,0.3)'}
                    color={'#b6a176'}
                    // customIndicator={<Image resizeMode="contain" source={require('./../assets/images/loader.gif')} />}
                    textStyle={{ fontSize: 16, color: '#000000', backgroundColor: 'white', borderRadius: 8, padding: 5, fontWeight: '400' }}
                />

                <View style={{ flex: 1.3, width: '100%' }} />

                <View style={{
                    flex: 8.5, width: '100%', justifyContent: 'center', alignItems: 'center', borderColor: 'transparent', borderRadius: 10, borderWidth: 0.5,
                }} >

                    <View style={{
                        flex: 1, width: '100%', alignSelf: 'center', justifyContent: 'center', alignItems: context.isArabic ? 'flex-end' : 'flex-start',
                    }}>
                        <Image resizeMode="contain" source={require("./../assets/images/logo-size/smartControlLogosmall.png")}
                            style={{ height: '100%', width: '70%' }} />
                    </View>

                    <View style={{
                        flex: 0.6, width: '80%', justifyContent: 'center', alignItems: context.isArabic ? 'flex-end' : 'flex-start', alignSelf: 'center'
                    }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.smartControl)}  </Text>
                    </View>

                    <View style={{ flex: 3, width: '90%', alignSelf: 'center' }} >

                        <View style={{ flex: 2.5, width: '90%', alignSelf: 'center', justifyContent: 'center' }}>

                            <View style={{ flex: 1.5, width: '90%', alignSelf: 'flex-start', justifyContent: 'center' }}>
                                <View style={{ flex: 0.6, width: '100%' }}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 16, textAlign: context.isArabic ? 'right' : 'left', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.userName)}  </Text>
                                </View>
                                <View style={{ flex: 2, width: '100%' }}>
                                    <TextInput
                                        style={{
                                            height: 40, textAlign: context.isArabic ? 'right' : 'left', width: '100%', color: fontColor.TitleColor,
                                            fontSize: 14, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1,

                                        }}
                                        value={loginDraft.username}
                                        maxLength={50}
                                        placeholderTextColor={fontColor.TitleColor}
                                        keyboardType='default'
                                        placeholder={(Strings[context.isArabic ? 'ar' : 'en'].login.enterUserName)}
                                        onChangeText={(val) => {
                                            loginDraft.setUsername(val)
                                            setError(prevState => {
                                                return { ...prevState, userNameErr: '' }
                                            });
                                        }} />
                                </View>

                                {errormsg.userNameErr == 'required' || errormsg.userNameErr == 'invalid' ?
                                    <View style={{ flex: 1, alignItems: context.isArabic ? 'flex-end' : 'flex-start' }} >
                                        {errormsg.userNameErr == 'required' && <Text style={{ color: 'red', paddingLeft: 4, paddingRight: context.isArabic ? 2 : 0, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.thisFieldIsRequired)}</Text>}
                                        {/* {errormsg.userNameErr == 'invalid' && <Text style={{ color: 'red', paddingLeft: 4, paddingRight: context.isArabic ? 2 : 0 }}>{strings('login.invalidEmailId')}</Text>} */}
                                    </View>
                                    : <View style={{ height: HEIGHT * 0.02, padding: 10 }} />}
                            </View>

                            <View style={{ flex: 1.5, width: '90%', alignSelf: 'flex-start', }}>
                                <View style={{ flex: 0.6, width: '100%' }}>
                                    <Text style={{ color: fontColor.TitleColor, fontSize: 16, textAlign: context.isArabic ? 'right' : 'left', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.password)}  </Text>
                                </View>
                                <View style={{ flex: 2, width: '100%' }}>
                                    <TextInput
                                        style={{
                                            height: 40, textAlign: context.isArabic ? 'right' : 'left', width: '100%', color: fontColor.TitleColor,
                                            fontSize: 14, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1,

                                        }}
                                        value={loginDraft.password}
                                        maxLength={50}
                                        keyboardType={'default'}
                                        placeholderTextColor={fontColor.TitleColor}
                                        secureTextEntry={true}
                                        placeholder={(Strings[context.isArabic ? 'ar' : 'en'].login.enterPassword)}
                                        onChangeText={(val) => {
                                            loginDraft.setPassword(val);
                                            setError(prevState => {
                                                return { ...prevState, passwordErr: '' }
                                            });
                                        }} />
                                </View>

                                {errormsg.passwordErr == 'required' ?
                                    <View style={{ height: HEIGHT * 0.02, alignItems: context.isArabic ? 'flex-end' : 'flex-start' }} >
                                        {errormsg.passwordErr == 'required' && <Text style={{ color: 'red', paddingLeft: 4, paddingRight: context.isArabic ? 2 : 0, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.thisFieldIsRequired)}</Text>}
                                    </View>

                                    : <View style={{ height: HEIGHT * 0.02, padding: 10 }} />}
                            </View>


                        </View>



                        <View style={{ flex: 0.5, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: "100%", alignItems: 'center', justifyContent: context.isArabic ? 'flex-end' : 'flex-start' }}>
                            {isVisibleBiometric ? <TouchableOpacity onPress={bioAuthenticate}
                                style={{
                                    flex: 1, width: '100%', justifyContent: 'center', alignItems: "center",
                                }}>
                                <Text style={{
                                    color: fontColor.TitleColor, textDecorationLine: 'underline', fontStyle: 'italic',
                                    fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily
                                }}>{'Login Using Face Recognition'}</Text>


                            </TouchableOpacity>
                                :
                                <TouchableOpacity
                                    //onPress={bioAuthenticate}
                                    style={{
                                        flex: 1, width: '100%', justifyContent: 'center', alignItems: "center",
                                    }}>
                                    <Text style={{
                                        color: fontColor.TitleColor, textDecorationLine: 'underline', fontStyle: 'italic',
                                        fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily
                                    }}>{'Login Using Face Recognition'}</Text>


                                </TouchableOpacity>

                            }

                            <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>

                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.english)}</Text>

                                <Switch
                                    thumbColor={fontColor.TitleColor}
                                    // trackColor={{ true: EStyleSheet.value('$lightGoldenColr'), false: null }}
                                    onValueChange={(val) => {
                                        context.toggleLanguage()
                                    }}
                                    value={context.isArabic} />
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].login.arabic)}</Text>

                            </View>
                        </View>

                        <View style={{ flex: 0.1, flexDirection: 'row', width: "100%", justifyContent: 'center', alignItems: 'center' }}>
                        </View>


                        <View style={{ flex: 2.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: "90%", alignSelf: 'flex-start' }}>
                            {
                                isVisibleBiometric ?
                                    <View style={{ flex: 0.7 }}>
                                        <TouchableOpacity
                                            onPress={bioAuthenticate}
                                            style={{
                                                flex: 1, width: '100%', justifyContent: 'center', alignItems: "center"
                                            }}>
                                            <Image resizeMode="contain" source={require("./../assets/images/login/face_icon.png")}
                                                style={{ height: '100%', width: '70%' }} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
                                        </View>
                                    </View>

                                    :

                                    <View style={{ flex: 0.7 }}>
                                        <TouchableOpacity
                                            //onPress={bioAuthenticate}
                                            style={{
                                                flex: 1, width: '100%', justifyContent: 'center', alignItems: "center"
                                            }}>
                                            <Image resizeMode="contain" source={require("./../assets/images/login/face_icon.png")}
                                                style={{ height: '100%', width: '70%' }} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
                                        </View>
                                    </View>

                            }

                            <View style={{ flex: 0.2 }} />

                            <View style={{ width: '60%', alignSelf: 'center', flex: 0.5 }}>
                                {/* <View style={{ flex: 0.3, borderTopWidth: 0.7, borderTopColor: fontColor.TitleColor, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 0.7, flexDirection: 'row' }}>
                                    <View style={{ flex: 0.6, justifyContent: 'center' }}>
                                        <Text numberOfLines={2} style={{ color: fontColor.TitleColor, fontSize: 10, textAlign: 'left', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{'This Device is not Rooted'}</Text>
                                    </View>
                                    <View style={{ flex: 0.1 }} />
                                    <View style={{ flex: 0.3, justifyContent: 'center' }}>
                                        <Image resizeMode="contain" source={require("./../assets/images/login/Rooted.png")}
                                            style={{ height: '80%', width: '100%' }} />
                                    </View>

                                </View>

                                <View style={{ flex: 0.1 }} />
                                <View style={{ flex: 0.5 }}>
                                    <View style={{ flex: 0.3, alignSelf: 'flex-start' }}>
                                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{'Protected BY'}</Text>
                                    </View>
                                    <View style={{ flex: 0.15 }} />
                                    <View style={{ flex: 0.4 }}>
                                        <Image resizeMode="contain" source={require("./../assets/images/login/Kaspersk.png")}
                                            style={{ height: '100%', width: '80%', }} />
                                    </View>
                                   
                                </View>

                                <View style={{ flex: 0.55, width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: "row" }}>
                                </View> */}
                            </View>
                        </View>
                        <View style={{ flex: 2.3, width: '100%' }} >
                            <TouchableOpacity onPress={submit}
                                style={[
                                    {
                                        borderRadius: WIDTH * 0.2, backgroundColor: '#ee3d43', width: WIDTH * 0.4, height: WIDTH * 0.4,
                                        position: 'absolute', bottom: HEIGHT * 0.03, borderWidth: WIDTH * 0.05, borderColor: '#ffffff', justifyContent: 'center'
                                    }, context.isArabic ? { left: WIDTH * 0.06 } : { right: WIDTH * 0.06 }
                                ]}
                            >
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.login)}  </Text>

                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

            </ImageBackground>

        </SafeAreaView >

    );
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
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        margin: 10,
    },
    scrollview: {
        backgroundColor: 'transparent'
    }
});
export default observer(Login);