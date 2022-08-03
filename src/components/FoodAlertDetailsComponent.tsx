import React, { useContext, useRef } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text, Dimensions, Alert, StyleSheet, FlatList } from "react-native";
import { RealmController } from '../database/RealmController';
import { fontFamily, fontColor } from '../config/config';
import TextInputComponent from './TextInputComponent';
import DateComponent from './DateComponent';
let realm = RealmController.getRealmInstance();
import Dropdown from './dropdown';

import { Context } from '../utils/Context';
import { observer } from 'mobx-react';
import { Image } from 'react-native-animatable';
import NavigationService from '../services/NavigationService';
import Strings from '../config/strings';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const FoodAlertDetailsComponent = (props: any) => {

    const context = useContext(Context);
    let dropdownRef1 = useRef(null);
    let dropdownRef2 = useRef(null);

    return (

        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertNumber)} </Text>
                </View>

                <View style={styles.space} />

                <View style={styles.TextInputContainer}>
                    <TextInputComponent
                        placeholder={''}
                        style={{
                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        editable={false}
                        value={props.data && props.data.AlertNumber}
                        onChange={(val: string) => {
                        }}
                    />

                </View>

            </View>


            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertType)} </Text>
                </View>

                <View style={styles.space} />

                <View style={styles.TextInputContainer}>

                    <TextInputComponent
                        placeholder={''}
                        style={{
                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        editable={false}
                        value={props.data && props.data.Type}
                        onChange={(val: string) => {
                        }}
                    />
                    {/* <TouchableOpacity
                        onPress={() => {
                            dropdownRef1 && dropdownRef1.current.focus();
                        }}
                        style={{
                            height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }} >
                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                            <Dropdown
                                ref={dropdownRef1}
                                value={''}
                                onChangeText={(val: string) => {
                                    // condemnationDraft.setUnit(val);
                                }}
                                itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                data={[{ "Value": 'Value1' }, { "Value": 'Value2' }, { "Value": 'Value3' }]}
                            />
                        </View>

                        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                resizeMode={"contain"} />
                        </View>

                    </TouchableOpacity> */}

                </View>

            </View>

            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertSource)} </Text>
                </View>

                <View style={styles.space} />

                <View style={styles.TextInputContainer}>
                    <TextInputComponent
                        placeholder={''}
                        style={{
                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        editable={false}
                        value={props.data && props.data.SourceType}
                        onChange={(val: string) => {
                        }}
                    />

                </View>

            </View>

            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} </Text>
                </View>

                <View style={styles.space} />

                <View style={styles.TextInputContainer}>

                    <TextInputComponent
                        placeholder={''}
                        style={{
                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        editable={false}
                        value={props.data && props.data.Status}
                        onChange={(val: string) => {
                        }}
                    />
                    {/* <TouchableOpacity
                        onPress={() => {
                            dropdownRef2 && dropdownRef2.current.focus();
                        }}
                        style={{
                            height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }} >
                        <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                            <Dropdown
                                ref={dropdownRef2}
                                value={''}
                                onChangeText={(val: string) => {
                                    // condemnationDraft.setUnit(val);
                                }}
                                itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                data={[{ "Value": 'Value1' }, { "Value": 'Value2' }, { "Value": 'Value3' }]}
                            />
                        </View>

                        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                style={{ height: 16, width: 16, transform: [{ rotate: '90deg' }] }}
                                resizeMode={"contain"} />
                        </View>

                    </TouchableOpacity> */}

                </View>

            </View>


            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.startDate)}</Text>
                </View>

                <View style={styles.space} />



                <View style={[styles.TextInputContainer, { flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between' }]}>

                    <DateComponent
                        style={{
                            flex: 0.3, height: '70%', width: '70%', textAlign: 'center', alignSelf: 'center', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        isArabic={context.isArabic}
                        disabled={true}
                        updateDate={(val: string) => { }}
                        value={props.data && props.data.StartDate}
                    />

                </View>

            </View>
            <View style={{
                flex: 0.13
            }} />


            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.toDate)}</Text>
                </View>

                <View style={styles.space} />

                <View style={[styles.TextInputContainer, { flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between' }]}>

                    <DateComponent
                        style={{
                            flex: 0.3, height: '70%', width: '70%', textAlign: 'center', alignSelf: 'center', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        disabled={true}
                        isArabic={context.isArabic}
                        updateDate={(val: string) => { }}
                        value={props.data && props.data.ToDate}
                    />
                </View>

            </View>


            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.description)} </Text>
                </View>

                <View style={styles.space} />

                <TouchableOpacity onPress={()=>Alert.alert("",props.data && props.data.Description)} style={styles.TextInputContainer}>
                    <TextInputComponent
                        placeholder={''}
                        style={{
                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        editable={false}
                        value={props.data && props.data.Description}
                        onChange={(val: string) => {
                        }}
                    />

                </TouchableOpacity>

            </View>

            <View style={{ flex: 1, height: HEIGHT * 0.06, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                <View style={styles.textContainer}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.sourceAlertNumber)} </Text>
                </View>

                <View style={styles.space} />

                <View style={styles.TextInputContainer}>
                    <TextInputComponent
                        placeholder={''}
                        style={{
                            height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                            fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                        }}
                        editable={false}
                        value={props.data && props.data.SourceAlertNumber}
                        onChange={(val: string) => {
                        }}
                    />

                </View>

            </View>

        </View>

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

export default FoodAlertDetailsComponent;