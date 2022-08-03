import React, { useContext, useRef, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, FlatList, ToastAndroid } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
let realm = RealmController.getRealmInstance();
import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import Dropdown from './../components/dropdown';
import ButtonComponent from './ButtonComponent';
import Strings from '../config/strings';
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

const ResetPasswordComponent = (props: any) => {
   


    return (
        <View style={{ minHeight: 160, height: 'auto', alignItems: 'center', width: '80%', alignSelf: 'center' }}>
            <View style={{ flex: 1, flexDirection: props.isArabic? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].settings.oldPassword)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={props.value}
                        maxLength={props.maxLength}
                        multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={'********'}
                        keyboardType={props.keyboardType}
                        onChangeText={props.onChange}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily:props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic? 'ar' : 'en'].settings.newPassword)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={props.value}
                        maxLength={props.maxLength}
                        multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={'********'}
                        keyboardType={props.keyboardType}
                        onChangeText={props.onChange}
                    />
                </View>
            </View>
            <View style={{ flex: 0.05 }} />
            <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: props.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].settings.retypePassword)} </Text>
                </View>

                <View style={styles.space} />

                <View style={{ flex: 0.6, justifyContent: "center" }}>
                    <TextInputComponent
                        style={{
                            height: '70%', textAlign: props.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={props.isArabic}
                        value={props.value}
                        maxLength={props.maxLength}
                        multiline={props.isMultiline}
                        numberOfLines={props.numberOfLines}
                        placeholder={'*******'}
                        keyboardType={props.keyboardType}
                        onChangeText={props.onChange}
                    />
                </View>
            </View>
            <View style={{ flex: 0.2 }} />

            <View style={{ flex: 0.7, flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                {/* <View style={{ flex: 0.5 }} /> */}

                <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                    <ButtonComponent
                        style={{
                            height: '80%', width: '100%', backgroundColor: "#5c666f",
                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center'
                        }}
                        isArabic={props.isArabic}
                        buttonClick={() => {

                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[props.isArabic ? 'ar' : 'en'].settings.save)}
                    />
                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                    <ButtonComponent
                        style={{
                            height: '80%', width: '100%', backgroundColor: "#5c666f",
                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center'
                        }}
                        isArabic={props.isArabic}
                        buttonClick={() => {

                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={(Strings[props.isArabic? 'ar' : 'en'].settings.cancel)}
                    />
                </View>

                <View style={{ flex: 0.2 }} />



            </View>


        </View>
        
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
    commentTextContainer: {
        flex: 0.2,
        justifyContent: 'center'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
});


export default observer(ResetPasswordComponent);
