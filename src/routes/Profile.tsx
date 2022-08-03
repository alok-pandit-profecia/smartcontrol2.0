import React, { useState, useEffect,useRef, useContext } from 'react';
import { Image, View, FlatList, TextInput, StyleSheet, SafeAreaView, Alert, TouchableOpacity, Text, ImageBackground, Dimensions, ToastAndroid } from "react-native";
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import NavigationService from './../services/NavigationService';
import TextInputComponent from '../components/TextInputComponent';
import KeyValueComponent from '../components/KeyValueComponent';
import Dropdown from './../components/dropdown';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";


const Profile = (props: any) => {

    const context = useContext(Context);   
    let dropdownRef = useRef();

    const [isClick, setIsClick] = useState({
        profileDetails: true,
        manualGuide: false
    })

    const langauageArr = [
        { type: 'English', value: 'English' },
        { type: 'Arabic', value: 'Arabic' },        
    ]

    const mapStore = (rootStore: RootStoreModel) => ({ profileDraft : rootStore.profileModel})
    const {profileDraft } = useInject(mapStore)

     useEffect(() => {
        profileDraft.callToGetProfileService();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {/* // <View style={{ flex: 0.7, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center', width: '90%' }}>
                //     <Image style={{ alignSelf: context.isArabic ? 'flex-start' : 'flex-end' }} source={require('./../assets/images/login/ProfileIcon.png')} />
                // </View>

                // <View style={{ flex: 0.3 }} />
                
                // <View style={{}}>
                //     <Text style={{ color: fontColor.TitleColor, fontSize: 24, fontWeight: 'bold', textAlign: 'center', fontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].header.smartControl)} </Text>
                // </View>

                // <View style={{ flex: 0.3 }} /> */}
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.4 }}/>
                <View style={{ flex: 1.5, alignItems: 'center',alignSelf:'center', justifyContent: 'center', width: '90%' }}>
                    <Image resizeMode={'stretch'} style={{ width:120,height:120 }} source={require('./../assets/images/profile/Profile64x64.png')} />
                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.5, width: '85%', alignSelf: 'center', justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <TouchableOpacity
                        onPress={() => {
                            setIsClick(prevState => {
                                return { ...prevState, profileDetails: true, manualGuide: false }
                            });
                        }}
                        style={{ flex: 1, justifyContent: 'center', borderBottomColor: isClick.profileDetails ? 'red' : fontColor.TitleColor, borderBottomWidth: 1 }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, fontWeight: 'bold', textAlign: 'center', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.profileDetails)}  </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            setIsClick(prevState => {
                                return { ...prevState, profileDetails: false, manualGuide: true }
                            });
                        }}
                        style={{ flex: 1, justifyContent: 'center', borderBottomColor: isClick.manualGuide ? 'red' : fontColor.TitleColor, borderBottomWidth: 1 }}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, fontWeight: 'bold', textAlign: 'center', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.guideManual)}  </Text>
                    </TouchableOpacity>

                    <View style={{ flex: 1, justifyContent: 'center', borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1 }} />

                </View>

                {isClick.profileDetails ?

                    <View style={{ flex: 3.5, width: '85%', alignSelf: 'center', justifyContent: 'center' }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.inspectorName)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                                <TextInputComponent
                                    style={{
                                        height: '55%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    value={profileDraft.inspectorName}
                                    maxLength={props.maxLength ? props.maxLength : 50}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={props.placeholder}
                                    editable={false}
                                    isMultiline={props.isMultiline ? props.isMultiline : false}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={fontColor.TextBoxTitleColor}
                                    onChange={(val: string) => {
                                        profileDraft.setInspectorName(val);
                                        // setError(prevState => {
                                        //     return { ...prevState, trainedError: '' }
                                        // });
                                    }}

                                />
                            </View>

                        </View>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily:fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.position)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                    style={{
                                        height: '55%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                   value={profileDraft.position}
                                    maxLength={props.maxLength ? props.maxLength : 50}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={props.placeholder}
                                    editable={false}
                                    isMultiline={props.isMultiline ? props.isMultiline : false}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={fontColor.TextBoxTitleColor}
                                    onChange={(val: string) => {
                                        profileDraft.setPosition(val);
                                        // setError(prevState => {
                                        //     return { ...prevState, trainedError: '' }
                                        // });
                                    }}
                                    />
                            </View>

                        </View>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.inspectionArea)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                    style={{
                                        height: '55%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                    value={profileDraft.inspectionArea}
                                    maxLength={props.maxLength ? props.maxLength : 50}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={props.placeholder}
                                    editable={false}
                                    isMultiline={props.isMultiline ? props.isMultiline : false}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={fontColor.TextBoxTitleColor}
                                    onChange={(val: string) => {
                                        profileDraft.setInspectionArea(val);
                                        // setError(prevState => {
                                        //     return { ...prevState, trainedError: '' }
                                        // });
                                    }}
                                    />
                            </View>

                        </View>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.unit)} </Text>
                            </View>

                            <View style={styles.space} />

                            <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                    style={{
                                        height: '55%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                        fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }}
                                    isArabic={context.isArabic}
                                     value={profileDraft.unit}
                                    maxLength={props.maxLength ? props.maxLength : 50}
                                    numberOfLines={props.numberOfLines}
                                    placeholder={props.placeholder}
                                    editable={false}
                                    isMultiline={props.isMultiline ? props.isMultiline : false}
                                    keyboardType={'numeric'}
                                    placeholderTextColor={fontColor.TextBoxTitleColor}
                                    onChange={(val: string) => {
                                        profileDraft.setUnit(val);
                                        // setError(prevState => {
                                        //     return { ...prevState, trainedError: '' }
                                        // });
                                    }}
                                />
                            </View>

                        </View>


                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={styles.textContainer}>
                                <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily:context.isArabic?fontFamily.arabicTextFontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].profile.selectLanguage)} </Text>
                            </View>

                            <View style={styles.space} />
                            <View style={styles.TextInputContainer}>
                               <TouchableOpacity
                                    onPress={() => {
                                        dropdownRef && dropdownRef.current.focus();
                                    }}
                                    style={{
                                        height: '70%', width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignSelf: 'center', borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                    }} >
                                    <View style={{ width: '85%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Dropdown
                                            ref={dropdownRef}
                                            value={'English'}
                                            onChangeText={(val: string) => { }}
                                            itemTextStyle={{ width: '100%', height: '100%', textAlign: context.isArabic ? 'center' : 'center', fontSize: 10, padding: 0, color: fontColor.TextBoxTitleColor }}
                                            containerStyle={{ width: '100%', height: '100%', alignSelf: 'flex-start' }}
                                            data={langauageArr}
                                        />
                                    </View>
                                    <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            source={require("./../assets/images/condemnation/dropdownArrow.png")}
                                            style={{ height: 16, width: 16, transform: [{ rotate: '0deg' }] }}
                                            resizeMode={"contain"} />
                                    </View>
                                </TouchableOpacity>
                                </View>
                        </View>

                    </View>

                    :
                    <View style={{ flex: 4.5, width: '85%', alignSelf: 'center', justifyContent: 'center' }}>


                        {/* <View style={{
                            flex: 0.2
                        }} />
                             <TouchableOpacity
                            onPress={() => {
                                NavigationService.navigate('EstablishmentDetails');
                            }}
                            style={{
                                flex: 1, width: '95%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius:context.isArabic?0: 10, borderBottomRightRadius:context.isArabic?0: 10,borderTopLeftRadius:context.isArabic?10:0,borderBottomLeftRadius:context.isArabic?10:0, borderWidth: 1,
                                shadowRadius: 1, backgroundColor: 'white', borderLeftWidth:context.isArabic?1: 5,borderRightWidth:context.isArabic?5:1, borderRightColor:context.isArabic?'#d51e17':'#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor:context.isArabic?'#5C666F': '#d51e17'
                                , shadowOpacity: 15, shadowColor: 'grey', elevation: 0,
                            }}>
                         
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.fileType} value={'XYZ'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.manualName} value={'App Guides'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.versionNumber} value={'v1.2'} />

                        </TouchableOpacity>

                         <View style={{
                            flex: 0.2
                        }} />
                             <TouchableOpacity
                            onPress={() => {
                                NavigationService.navigate('EstablishmentDetails');
                            }}
                            style={{
                                flex: 1, width: '95%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius:context.isArabic?0: 10, borderBottomRightRadius:context.isArabic?0: 10,borderTopLeftRadius:context.isArabic?10:0,borderBottomLeftRadius:context.isArabic?10:0, borderWidth: 1,
                                shadowRadius: 1, backgroundColor: 'white', borderLeftWidth:context.isArabic?1: 5,borderRightWidth:context.isArabic?5:1, borderRightColor:context.isArabic?'#d51e17':'#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor:context.isArabic?'#5C666F': '#d51e17'
                                , shadowOpacity: 15, shadowColor: 'grey', elevation: 0,
                            }}>
                         
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.fileType} value={'XYZ'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.manualName} value={'App Guides'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.versionNumber} value={'v1.2'} />

                        </TouchableOpacity>

                        <View style={{ flex: 0.2 }} />

                         <View style={{
                            flex: 0.2
                        }} />
                             <TouchableOpacity
                            onPress={() => {
                                NavigationService.navigate('EstablishmentDetails');
                            }}
                            style={{
                                flex: 1, width: '95%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius:context.isArabic?0: 10, borderBottomRightRadius:context.isArabic?0: 10,borderTopLeftRadius:context.isArabic?10:0,borderBottomLeftRadius:context.isArabic?10:0, borderWidth: 1,
                                shadowRadius: 1, backgroundColor: 'white', borderLeftWidth:context.isArabic?1: 5,borderRightWidth:context.isArabic?5:1, borderRightColor:context.isArabic?'#d51e17':'#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor:context.isArabic?'#5C666F': '#d51e17'
                                , shadowOpacity: 15, shadowColor: 'grey', elevation: 0,
                            }}>
                         
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.fileType} value={'XYZ'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.manualName} value={'App Guides'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.versionNumber} value={'v1.2'} />

                        </TouchableOpacity>

                        <View style={{ flex: 0.2 }} />

                         <View style={{
                            flex: 0.2
                        }} />
                             <TouchableOpacity
                            onPress={() => {
                                NavigationService.navigate('EstablishmentDetails');
                            }}
                            style={{
                                flex: 1, width: '95%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius:context.isArabic?0: 10, borderBottomRightRadius:context.isArabic?0: 10,borderTopLeftRadius:context.isArabic?10:0,borderBottomLeftRadius:context.isArabic?10:0, borderWidth: 1,
                                shadowRadius: 1, backgroundColor: 'white', borderLeftWidth:context.isArabic?1: 5,borderRightWidth:context.isArabic?5:1, borderRightColor:context.isArabic?'#d51e17':'#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor:context.isArabic?'#5C666F': '#d51e17'
                                , shadowOpacity: 15, shadowColor: 'grey', elevation: 0,
                            }}>
                         
                           <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.fileType} value={'XYZ'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.manualName} value={'App Guides'} />
                            <KeyValueComponent isArabic={context.isArabic} keyName={Strings[context.isArabic?'ar':'en'].profile.versionNumber} value={'v1.2'} />

                        </TouchableOpacity>
                     */}
                    </View>
                }

                <View style={{ flex: isClick.profileDetails ? 2 : 1 }} />

                <View style={{flex:1}}>
                <BottomComponent isArabic={context.isArabic} />
                </View>


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

});



export default observer(Profile);
