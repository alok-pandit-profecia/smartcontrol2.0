import React, { Component, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Modal
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import * as Animatable from 'react-native-animatable';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
import { Context } from '../utils/Context';
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import NavigationService from '../services/NavigationService';

const AlertcomponentForFoodAlertSCD = (props: any) => {

    const context = useContext(Context);

    const [visible, setVisible] = useState(true);

    const cancelAlert = () => {
        props.closeAlert();
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={() => { setVisible(false); props.closeAlert() }}
        >
            <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, justifyContent: 'center', zIndex: 8, alignItems: 'center', position: 'absolute', ...StyleSheet.absoluteFillObject }}>

                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { minHeight: 'auto', height: 'auto', borderRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>

                    <View style={{ flex: 5, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20, borderRadius: 20 }}>

                        <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                            <View style={{ flex: 9, justifyContent: 'center' }}>

                                <TextComponent
                                    textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.title}
                                />

                            </View>

                            <TouchableOpacity
                                onPress={() => { props.hideAlertComponentForFoodAlertSCD(false) }}
                                style={{ flex: 1, justifyContent: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    source={require("./../assets/images/alert_images/close.png")}
                                    style={{ height: '80%', width: '80%' }} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ height: 'auto', justifyContent: 'center' }}>

                            <TextComponent
                                textStyle={[styles.confirmMsg, { color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                label={props.message}
                                viewStyle={{ flex: 0.02 }}
                            />

                            <TextComponent
                                numberOfLines={1}
                                textStyle={[styles.confirmMsg, { color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                label={props.message1}
                                viewStyle={{ flex: 0.02 }}
                            />

                            <TextComponent
                                numberOfLines={1}
                                textStyle={[styles.confirmMsg, { color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                label={props.message2}
                                viewStyle={{ flex: 0.02 }}
                            />

                            <TextComponent
                                numberOfLines={1}
                                textStyle={[styles.confirmMsg, { color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                label={props.message3}
                                viewStyle={{ flex: 0.02 }}
                            />

                        </View>

                        {
                            (props.alertObject.Sampling == 'Y') && !props.alertObject.samplingArr ?

                                <View style={{ height: '20%', paddingBottom: 12, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                    <ButtonComponent
                                        style={{
                                            height: '100%', width: '35%', backgroundColor: '#8dc43e',
                                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.yes)}
                                        buttonClick={() => {
                                            props.hideAlertComponentForFoodAlertSCD(false)
                                            props.YesNo(true)
                                        }}
                                    />

                                    <View style={{ flex: 0.05 }} />

                                    <ButtonComponent
                                        style={{
                                            height: '100%', width: '35%', backgroundColor: '#f6565a',
                                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.no)}
                                        buttonClick={() => {
                                            props.hideAlertComponentForFoodAlertSCD(false)
                                            props.YesNo(false)
                                        }}
                                    />

                                </View>

                                :
                                <View style={{ height: '20%', paddingBottom: 12, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>


                                    <View style={{ flex: 0.05 }} />

                                    <ButtonComponent
                                        style={{
                                            height: '100%', width: '35%', backgroundColor: '#f6565a',
                                            borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                            textAlign: 'center'
                                        }}
                                        isArabic={context.isArabic}
                                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                        buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok)}
                                        buttonClick={() => {
                                            props.hideAlertComponentForFoodAlertSCD(false)
                                            // props.YesNo(false)
                                            if ((props.alertObject.Condemnation == 'Y') && !props.alertObject.condemnationArr) {
                                                NavigationService.navigate("Condemnation", { title: "Condemnation" })
                                            }
                                            else if ((props.alertObject.Detention == 'Y') && !props.alertObject.detentionArr) {
                                        NavigationService.navigate("Detention", { title: "Detention" })
                                    }
                                        }}
                                    />

                                </View>

                        }

                    </View>

                </Animatable.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    textModal: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        position: 'absolute',
        // height: HEIGHT * 0.50,
        width: WIDTH * 0.85,
        // borderRadius: 15,
        //marginTop: 200,
        // backgroundColor: '#003a5d',
        backgroundColor: 'white',
        borderRadius: 5,
        zIndex: 8
    },
    alerttext: {
        fontSize: 18,
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        // textAlign: 'justify',
        // marginBottom: '5%',
        fontWeight: 'bold',
        color: 'white'
    },
    confirmMsg: {
        padding: '2%',
        fontSize: 15,
        color: 'black',
    },
    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    }
});

export default AlertcomponentForFoodAlertSCD;