import React, { useContext, useRef, useState } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput } from "react-native";
import Header from './../components/Header';
import ImagePicker from 'react-native-image-picker';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import AlertComponentForAttachment from './../components/AlertComponentForAttachment';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;


const FoodAlert = (props: any) => {
    const context = useContext(Context);
    const [base64One, setBase64One] = useState('');
    const [base64Two, setBase64two] = useState('');
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [modifiedCheckListData, setModifiedCheckListData] = useState([]);
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
   
    const attachedImageToAlertImageView = async (item: any) => {
        try {
            if (Platform.OS === 'ios') {
                selectImage(item);
            } else if (Platform.OS === 'android') {

                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ]
                ).then(async (result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                // const granted = await PermissionsAndroid.request(
                //     PermissionsAndroid.PERMISSIONS.CAMERA, {
                //     title: 'Smart control App',
                //     message: 'You want to use the camera',
                //     buttonNeutral: 'Ask Me Later',
                //     buttonNegative: 'Cancel',
                //     buttonPositive: 'OK',
                // })
                // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                //     selectImage(item);
                // } else {
                // }
            }
        } catch (err) {
            console.warn(err);
        }
    }
    const selectImage = async (item: any) => {
        let options = {
            title: 'Select Image',
            noData: false,
            customButtons: [
                { name: 'Test', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                // //console.log('User cancelled image picker');
            } else if (response.error) {
                // //console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // //console.log('User tapped custom button: ', response.customButton);
            } else {
                // //console.log('ImageResponse: ', response);
                debugger;
                if (response.fileSize) {
                    if (item == 'one') {
                        let tempArray: any = [...modifiedCheckListData];
                        tempArray[currentSection].data[currentIndex].image1 = response.fileName;
                        // tempArray[currentSection].data[currentIndex].image1Base64 = response.data;
                        tempArray[currentSection].data[currentIndex].image1Base64 = response.uri;

                        setBase64One(response.data);
                        setModifiedCheckListData(tempArray);
                    }
                    else {
                        let tempArray: any = [...modifiedCheckListData];
                        tempArray[currentSection].data[currentIndex].image2 = response.fileName;
                        // tempArray[currentSection].data[currentIndex].image2Base64 = response.data;
                        tempArray[currentSection].data[currentIndex].image2Base64 = response.uri;

                        setBase64two(response.data);
                        setModifiedCheckListData(tempArray);
                    }
                } else {
                    ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                }
            }
        });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            isArabic={context.isArabic}
                            title={Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.attachment}
                            attachmentOne={async () => {
                                await attachedImageToAlertImageView('one');
                            }}
                            attachmentTwo={async () => {
                                await attachedImageToAlertImageView('two');
                            }}
                            base64One={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].image1Base64
                                    :
                                    ''
                            }
                            base64Two={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        modifiedCheckListData[currentSection].data[currentIndex].image2Base64
                                    :
                                    ''
                            }

                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                }

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>
                
                <View style={{ flex: 0.7 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlerts}</Text>
                        </View>

                        <View style={{ flex: 0.8 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 1 }} />

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertNumber}</Text>
                    </View>

                    <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{'#:'}</Text>
                    </View>



                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'1-701600714'}</Text>
                    </View>

                    <View style={{ flex: 1, }} />

                </View>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlertDetails)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 4, width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertNumber)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'1-657579211'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertType)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'Rejection at border'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertSource)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'European Commision'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.status)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={'Active'}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en']).foodAlerts.startDate} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.toDate)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.description)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.sourceAlertNumber)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={props.value}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={''}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
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
                                height: '60%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => { }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.printHistory)}
                        />
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '60%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => { setShowAttachmentAlert(true) }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.viewAttachments)}
                        />
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
                <View style={{ flex: 0.9 }} />
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
    }
});

export default observer(FoodAlert);


