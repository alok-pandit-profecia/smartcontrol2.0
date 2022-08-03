import React, { useState, useEffect, useContext, createRef } from 'react';
import { Image, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { Context } from '../utils/Context';
import NavigationService from './../services/NavigationService';
import { RealmController } from '../database/RealmController';
import LoginSchema from '../database/LoginSchema';
import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import { RootStoreModel } from "../store/rootStore";
import useInject from "../hooks/useInject";
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;

const Header = (props: any) => {

    const [userName, setUserName] = useState('Guest');
    const isFocused = useIsFocused();

    const mapStore = (rootStore: RootStoreModel) => ({ bottomBarDraft: rootStore.bottomBarModel, loginDraft: rootStore.loginModel, completedTaskDraft: rootStore.completdMyTaskModel, alertDraft: rootStore.foodAlertsModel, myTasksDraft: rootStore.myTasksModel })
    const { bottomBarDraft, alertDraft, completedTaskDraft, myTasksDraft, loginDraft } = useInject(mapStore)

    let obj = RealmController.getLoginData(realm, LoginSchema.name);
    obj = obj['0'] ? obj['0'] : {};

    useEffect(() => {
        debugger;
        let verionResponse: any = loginDraft.verionResponse != '' ? JSON.parse(loginDraft.verionResponse) : '';

        if (verionResponse == '') {
            loginDraft.callAppVersion();
        }
        else {
            let ApiVersion = verionResponse.Version.split('.');
            let AppVersion = loginDraft.verionNumber.split('.');
            let flag = false;

            if (parseInt(AppVersion[0]) < parseInt(ApiVersion[0])) {
                flag = true;
            }
            else if (parseInt(AppVersion[1]) < parseInt(ApiVersion[1])) {
                flag = true;
            }
            else if (parseInt(AppVersion[2]) < parseInt(ApiVersion[2])) {
                flag = true;
            }
            if (flag) {
                loginDraft.callAppVersion();
            }
        }
        if (obj) {
            let userName = obj.username && (obj.username != '') ? obj.username.split('.')[0] : 'Guest';
            setUserName(userName);
        }
    }, [isFocused])


    return (

        <View style={{ flex: 1.5 }}>
            {
                props.isDashboradSync ?
                    <TouchableOpacity
                        onPress={() => {
                            // let loginData = RealmController.getLoginData(realm, LoginSchema.name);
                            props.reloadTasks()
                        }}
                        style={[{ position: 'absolute', padding: 2, justifyContent: 'center', alignItems: 'center' }, props.isArabic ? { top: 10, right: 20, } : { top: 10, left: 20, }]}>
                        <Image style={{ alignSelf: props.isArabic ? 'flex-start' : 'flex-end', height: 32, width: 32 }} source={(loginDraft.isOnline || myTasksDraft.isOnline) ? require('./../assets/images/sync.png') : require('./../assets/images/syncred.png')} />
                        {/* <Text style={{ color:'white',textAlign:'center',fontSize:10 }}>{(loginDraft.isOnline||myTasksDraft.isOnline) ? "Online" : "Offline"}</Text> */}
                    </TouchableOpacity>
                    :
                    <View style={[{ position: 'absolute', padding: 2, justifyContent: 'center', alignItems: 'center' }, props.isArabic ? { top: 10, right: 20, } : { top: 10, left: 20, }]}>
                        <Image style={{ alignSelf: props.isArabic ? 'flex-start' : 'flex-end', height: 32, width: 32, borderRadius: (loginDraft.isOnline || myTasksDraft.isOnline) ? 0 : 15 }} source={(loginDraft.isOnline || myTasksDraft.isOnline) ? require('./../assets/images/greenled.png') : require('./../assets/images/redled.png')} />
                        {/* <Text style={{ color:'white',textAlign:'center',fontSize:10 }}>{(loginDraft.isOnline||myTasksDraft.isOnline) ? "Online" : "Offline"}</Text> */}
                    </View>
            }

            <View
                style={{ flex: 1, alignItems: props.isArabic ? 'flex-start' : 'flex-end', justifyContent: 'flex-end', alignSelf: 'center', width: '90%' }}>

                <View style={{ flex: 0.1 }} />

                <TouchableOpacity
                    onPress={() => {
                        NavigationService.navigate('Profile');
                    }}
                    style={{ flex: 0.6 }}>
                    <Image style={{ alignSelf: props.isArabic ? 'flex-start' : 'flex-end' }} source={require('./../assets/images/login/ProfileIcon.png')} />
                </TouchableOpacity>

                <View style={{ flex: 0.1 }} />

                <TouchableOpacity
                    onPress={() => {
                        NavigationService.navigate('Profile');
                    }}
                    style={{ flex: 0.3 }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: props.isArabic ? 12 : 10, textAlign: 'center', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].header.welcome)} </Text>
                    <Text style={{ color: fontColor.TitleColor, fontSize: props.isArabic ? 12 : 10, textAlign: 'center', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{userName} </Text>
                </TouchableOpacity>

            </View>

            <View style={{
                flex: 0.5, flexDirection: props.isArabic ? 'row-reverse' : 'row', width: '90%',
                alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center'
            }}>
                {props.isDashborad ?
                    <View style={{ flex: 1.5 }} />
                    :
                    <TouchableOpacity
                        onPress={() => {
                            if (props.screenName == 'sampling' || props.screenName == 'condemnation' || props.screenName == 'detention' || props.screenName == 'clouser') {
                                props.goBack();
                            }
                            else if (props.screenName == 'noc' || props.screenName == 'supervisory' || props.screenName == 'monitor') {
                                props.goBack(props.screenName);
                            }
                            // else if (props.adhocestDetails) {
                            //     NavigationService.navigate('AdhocEstablishment')
                            // }
                            // else if (props.adhocPage) {
                            //     NavigationService.navigate('AdhocEstablishmentAndVehical')
                            // }
                            // else if (props.AdhocEstablishmentAndVehical) {
                            //     NavigationService.navigate('Dashboard')
                            // }
                            else {
                                if (props.startInspection) {
                                    props.goBack();
                                }
                                else {
                                    NavigationService.goBack();
                                }
                            }
                        }} style={{ flex: 1.5 }}>


                        <Image style={{ alignSelf: 'center', transform: [{ rotate: props.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/login/back.png')} />
                    </TouchableOpacity>
                }

                <View style={{ flex: 6, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                    {props.isDashborad ?
                        <Image style={{ width: 100, height: 100 }} source={props.isDashborad ? require('./../assets/images/logo-size/SmartControlLogo128.png') : require('./../assets/images/logo-size/SmartControlLogo128.png')} />
                        :
                        <Image style={{ width: 55, height: 55 }} source={props.isDashborad ? require('./../assets/images/logo-size/SmartControlLogo128.png') : require('./../assets/images/logo-size/SmartControl_Logo.png')} />
                    }
                </View>
                <View style={{ flex: 1.5 }} />
            </View>
        </View>

    );

}

export default observer(Header);