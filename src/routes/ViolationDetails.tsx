import React, { useContext, useRef,useState,useEffect } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions } from "react-native";
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;


const ViolationDetails = (props: any) => {

    const context = useContext(Context);  
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)
    

    const [violationDetails, setViolationDetails] = useState(Object());


    useEffect(() => {
        const ViolationDetailsTemp = props.route ? props.route.params ? props.route.params.ViolationDetails : {} : {};
        setViolationDetails(ViolationDetailsTemp);

        // //console.log("serviceRequestDetailsTemp:", JSON.stringify(setViolationDetails))
    
    }, []);


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />  
                </View>
                <View style={{ flex: 0.7 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                          <View style={{ flex:myTasksDraft.isMyTaskClick == "History"?1.2: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                         <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask'?1.4:myTasksDraft.isMyTaskClick == "History"?0.8:1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{(myTasksDraft.isMyTaskClick == 'History' ? Strings[context.isArabic ? 'ar' : 'en'].history.history : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.adhocTask)}</Text>
                        </View>

   			<View style={{ flex: myTasksDraft.isMyTaskClick == "History"?1.2:1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    {/* <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View> */}

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{violationDetails.InspectionNumber}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{''}</Text>
                    </View>

                    <View style={{ flex: 0.8 }} />

                </View>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationDetails)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 3, width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.violationNumber)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                editable={false}
                                value={violationDetails.ViolationNumber}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange} 
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.inspectionNumber)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={violationDetails.InspectionNumber}
                                maxLength={props.maxLength}
                                editable={false}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.createdBy)} </Text>
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
                                editable={false}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].violationDetails.creationDate)} </Text>
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
                                editable={false}
                                maxLength={props.maxLength}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en']).violationDetails.status} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.textInputContainer}>
                            <TextInputComponent
                                style={{
                                    height: '75%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                isArabic={context.isArabic}
                                value={violationDetails.Status}
                                maxLength={props.maxLength}
                                editable={false}
                                multiline={props.isMultiline}
                                numberOfLines={props.numberOfLines}
                                placeholder={props.placeholder}
                                keyboardType={props.keyboardType}
                                onChangeText={props.onChange}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.2 }} />
	    
	    { myTasksDraft.isMyTaskClick == "History"? <View style={{ flex: 0.7}}></View>
		               :
                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>
                    <View style={{ flex: 0.5 }} />
                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => { props.buttonClick }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.submit)}
                        />
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View style={{ flex: 2, flexDirection: 'row', height: '80%' }}>
                        <ButtonComponent
                            style={{
                                height: '70%', width: '100%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => { props.buttonClick }}
                            textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].action.cancel)}
                        />
                    </View>
                    <View style={{ flex: 0.5 }} />
                </View>
  }
                <View style={{ flex: 1.9 }} />
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

export default observer(ViolationDetails);


