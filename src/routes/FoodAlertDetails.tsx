import React, { useContext, useState, useEffect } from 'react';
import { Platform, Image, View, StyleSheet, SafeAreaView, Text, ImageBackground, Dimensions, TouchableOpacity, PermissionsAndroid, ToastAndroid, Alert } from "react-native";
import NavigationService from '../services/NavigationService';
import { useIsFocused } from '@react-navigation/native';
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import FoodAlertDetailsComponent from './../components/FoodAlertDetailsComponent';
import ProductListComponent from './../components/ProductListComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import AlertComponentForAttachment from '../components/AlertComponentForAttachment';
import ImagePicker from 'react-native-image-picker';

let realm = RealmController.getRealmInstance();

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const FoodAlertDetails = (props: any) => {

    const context = useContext(Context);

    const [inspectionDetails, setInspectionDetails] = useState(Object());
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [modifiedCheckListData, setModifiedCheckListData] = useState([]);
    const [currentSection, setCurrentSection] = useState(0);
    const [historyAlertDetails, setHistoryAlertDetails] = useState({});
    const [isHistoryAlertDetails, setISHistoryAlertDetails] = useState(false);
    const [base64One, setBase64One] = useState('');
    const [base64Two, setBase64two] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const isFocused = useIsFocused();

    const [isClick, setIsClick] = useState({
        foodDetailsClick: true,
        productListClick: false
    });

    useEffect(() => {
        const FoodAlertDetails = props.route ? props.route.params ? props.route.params.FoodAlertDetails : {} : {};
        const foodAlertHistory = props.route ? props.route.params ? props.route.params.foodAlertHistory : false : false;
        setISHistoryAlertDetails(foodAlertHistory);
        setHistoryAlertDetails(FoodAlertDetails);

        setIsClick(prevState => {
            return { ...prevState, foodDetailsClick: true, productListClick: false }
        });
    }, [isFocused]);

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

        ImagePicker.launchCamera(options, (response:any) => {
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
                            disabled={true}
                            base64One={''}
                            base64Two={''}
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

                <View style={{ flex: 0.8 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#5C666F', fontSize: 14, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlerts}</Text>
                        </View>

                        <View style={{ flex: 0.5 }}>
                            <View style={{ flex: 0.5, borderBottomColor: '#5C666F', borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>


                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.alertNumber + ":- "}{historyAlertDetails.AlertNumber}</Text>
                    </View>


                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.5, flexDirection: 'row', width: '85%', alignSelf: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={[isHistoryAlertDetails ? { borderRadius: 18 } : {}, { flex: 1, height: '100%', backgroundColor: isClick.foodDetailsClick ? '#abcfbe' : 'white', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }]}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsClick(prevState => {
                                    return { ...prevState, foodDetailsClick: true, productListClick: false }
                                });
                            }}
                            style={[isHistoryAlertDetails ? { borderRadius: 18 } : {}, { width: '100%', height: '100%', backgroundColor: isClick.foodDetailsClick ? '#abcfbe' : 'white', justifyContent: 'center', borderTopLeftRadius: 18, borderBottomLeftRadius: 18 }]} >
                            <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{isHistoryAlertDetails ? Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlertHistory : Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlertDetails}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        isHistoryAlertDetails ?
                            null :
                            <View style={{ flex: 1, height: '100%', justifyContent: 'center', backgroundColor: isClick.productListClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsClick(prevState => {
                                            return { ...prevState, foodDetailsClick: false, productListClick: true }
                                        });
                                    }}
                                    style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: isClick.productListClick ? '#abcfbe' : 'white', borderTopRightRadius: 16, borderBottomRightRadius: 16 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.viewProductList}</Text>
                                </TouchableOpacity>
                            </View>

                    }

                </View>

                <View style={{ flex: 0.2 }} />

                {isClick.foodDetailsClick ?
                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>
                        <FoodAlertDetailsComponent data={historyAlertDetails}/>
                    </View>

                    :
                    <View style={{ flex: 5.4, width: '85%', alignSelf: 'center' }}>
                        <ProductListComponent  data={historyAlertDetails}/>
                    </View>

                }
                <View style={{ flex: 0.2 }} />

                {isHistoryAlertDetails ?

                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }} />

                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>

                            <ButtonComponent
                                style={{
                                    height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    // NavigationService.replace('FoodAlertHistory')
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.printHistory)}
                            />

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>

                            <ButtonComponent
                                style={{
                                    height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    setShowAttachmentAlert(true)
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.viewAttachments)}
                            />

                        </View>

                        <View style={{ flex: 0.5 }} />

                    </View>

                    :
                    null
                }
                {isClick.foodDetailsClick ?
                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '70%', alignSelf: 'center' }} />

                    : <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 0.5 }} />

                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>

                            <ButtonComponent
                                style={{
                                    height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    NavigationService.navigate('FoodAlertHistory')
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlertHistory)}
                            />

                        </View>

                        <View style={{ flex: 0.2 }} />

                        <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>

                            <ButtonComponent
                                style={{
                                    height: '80%', width: '100%', backgroundColor: fontColor.ButtonBoxColor,
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    setShowAttachmentAlert(true)
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.viewAttachments)}
                            />

                        </View>

                        <View style={{ flex: 0.5 }} />

                    </View>
                }
                <View style={{ flex: 0.5 }} />
                {isClick.foodDetailsClick ?<View style={{flex:0.5}}/>:<View style={{flex:0.5}}/>}
                <View style={{ flex: 1.5 }} >
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    space: {
        flex: 0.0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center"
    }
});

export default observer(FoodAlertDetails);

