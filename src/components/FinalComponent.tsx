import React, { useContext, useRef } from 'react';
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

const FinalComponent = (props: any) => {

    const context = useContext(Context);
    let dropdownRef1 = useRef();
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)




    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={{ flex: 1.5, justifyContent: 'center' }}>

                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[context.isArabic ? 'ar' : 'en'].startInspection.finalInspectionResult} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.TextInputContainer}>

                        <TextInputComponent
                            placeholder={''}
                            style={{
                                height: '60%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            value={''}
                            onChange={(val: string) => {
                            }}
                        />

                    </View>
                </View>

                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={{ flex: 0.4, justifyContent: 'center' }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].documentAndRecord.finalComment} </Text>
                    </View>

                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems:props.isArabic?'flex-end':'flex-start' }}>
                        <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/startInspection/commentCheck.png')} />
                    </View>

                    <View style={styles.TextInputContainer}>
                        <TextInputComponent
                            placeholder={''}
                            style={{
                                height: '60%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            value={''}
                            onChange={(val: string) => {

                            }}
                        />

                    </View>
                </View>

            </View>

            <View style={{ flex: .2 }} />

            <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '100%', alignSelf: 'center' }}>
               
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={{
                            height: '65%', width: '100%', backgroundColor: fontColor.TextInputBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                        }}>
                        <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: fontColor.TextBoxTitleColor }} >{(Strings[context.isArabic ? 'ar' : 'en'].startInspection.totalScore)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.1 }} />

                <View style={{ flex: 1 }}>                
                        <TouchableOpacity
                            style={{
                                height: '65%', width: '100%', backgroundColor: fontColor.TextInputBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: fontColor.TextBoxTitleColor }} >{(Strings[context.isArabic ? 'ar' : 'en'].startInspection.grade)}</Text>
                        </TouchableOpacity>                    
                </View>
            </View>

            {/* <View style={{ flex: 0.1 }} /> */}

            <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '100%', alignSelf: 'center' }}>
              
                <View style={{ flex: 1 }}>
                    <TouchableOpacity
                        style={{
                            height: '65%', width: '100%', backgroundColor: fontColor.TextInputBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                        }}>
                        <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: fontColor.TextBoxTitleColor }} >{(Strings[context.isArabic ? 'ar' : 'en'].startInspection.percentage)}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.1 }} />

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity
                            style={{
                                height: '65%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Text style={{ fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 13, color: 'white' }} >{(Strings[context.isArabic ? 'ar' : 'en'].startInspection.calculate)}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ flex: 0.6, justifyContent: 'center', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>

                <View style={{ flex: 0.2 }} />                
                <ButtonComponent
                    style={{
                        height: '55%', width: '30%', backgroundColor: fontColor.ButtonBoxColor,
                        alignSelf: 'center', borderRadius: 8, justifyContent: 'center', alignItems: 'center',
                        textAlign: 'center'
                    }}
                    buttonClick={() => {
                    }}
                    buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.print)}
                />
                <View style={{ flex: 0.2 }} />
            </View>
            <View style={{ flex: 2.3 }} />

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


export default observer(FinalComponent);
