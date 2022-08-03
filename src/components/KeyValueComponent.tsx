import React, { useContext } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const KeyValueComponent = (props: any) => {

    return (

        <View style={{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ flex: 0.05 }} />
            {props.keyName ?
                <View style={{ flex: props.flex1 ? props.flex1 : 1 }}>
                    <Text numberOfLines={props.numberOfLines} style={{ fontWeight: 'bold', textAlign: props.isArabic ? 'right' : 'left', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 11 }}>{props.keyName} {props.isArabic ? ':' : ' : '}</Text>
                </View>
                : null}
            <View style={{ flex: props.flex2 ? props.flex2 : 1 }}>
                <Text numberOfLines={props.numberOfLines} style={{ color: props.isError ? 'red' : props.taskStatus == true ? (props.value.toLowerCase() == 'inprogress') ? 'green' : (props.value.toLowerCase() == 'acknowledged') ? 'orange' : (props.value.toLowerCase() == 'scheduled') ? 'red' : fontColor.TitleColor : fontColor.TitleColor, textAlign: props.isArabic ? 'right' : 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 11 }}>{props.value}</Text>
            </View>

            <View style={{ flex: 0.05 }} />

        </View >
    )
}


export default KeyValueComponent;