import React, { useContext, useState, useEffect } from 'react';
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
import TextComponent from '../TextComponent';
import { TextInput } from 'react-native-gesture-handler';

import strings from '../../config/strings';
import { Context } from '../../utils/Context';

const AlertComponentForGrace = (props: any) => {
    let context = useContext(Context);

    // grace variable
    const [grace, setGrace] = useState('');
    const [graceErr, setGraceErr] = useState(false);
    const updateGrace = (val: any) => {
        let minGrace = Math.round(props.minGrace);
        let maxGrace = Math.round(props.maxGrace);
        if ((parseInt(val) >= minGrace) && (parseInt(val) <= maxGrace)) {
            setGrace(val);
            setGraceErr(false)
        } else {
            setGrace(val)
            setGraceErr(true)
        }
    }

    useEffect(() => {
        setGrace(props.grace);
    }, [props.grace])

    const cancelAlert = () => {
        props.closeAlert();
    }

    const confirmAlert = () => {
        if (!graceErr) {
            props.updateGraceValue(grace);
            props.okAlert();
        }
    }

    const validateNumber = (val: string) => {
        let regex = new RegExp(/^([0-9]+)$/, 'g');
        // alert(regex.test(str))
        if (regex.test(val)) {
            return true;
        }

    }
    
    return (
        <Modal
            visible={true}
            transparent={true}
        >
            <TouchableOpacity onPress={cancelAlert} style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, justifyContent: 'center', zIndex: 8, alignItems: 'center', }}>
                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.25, zIndex: 999, borderRadius: 20 }]}>
                    <View style={{ flex: 5, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: context.isArabic ? 'row-reverse' : 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ flex: 9, justifyContent: 'center' }}>
                                <TextComponent
                                    textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.title}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={cancelAlert}
                                style={{ flex: 1, justifyContent: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/alert_images/close.png")}
                                    style={{ height: '80%', width: '80%' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: HEIGHT * 0.15, justifyContent: 'center', padding: 8 }}>
                            {/* <TextInputWithLabelComponent
                            onChange={updateGrace}
                            value={grace}
                            showLabel={false}
                            isSecureTextEntry={false}
                            placeholder={'Enter comment'}
                            placeholderTextColor={'black'}
                            multiline={false}
                            numberOfLines={2}
                            height={40}
                            style={{ flex: 1, width: '100%', color: 'black', textAlign: 'left' }}
                        /> */}
                            {/* <Text
                            style={props.textStyle}
                            numberOfLines={props.numberOfLines ? props.numberOfLines : 2}>
                            {props.label}
                        </Text> */}
                            <TextInput
                                style={{ borderRadius: 5, borderWidth: 0.5, padding: 5, textAlign: context.isArabic ? 'right' : 'left', fontSize: 12, backgroundColor: '#e0e0e0', borderColor: 'gray', height: props.height ? props.height : 40 }}
                                onChangeText={(val) => {

                                    if (val == '') {
                                        updateGrace(val);
                                    }
                                    else if (validateNumber(val)) {
                                        updateGrace(val);
                                    }
                                }}
                                placeholder={'Enter Grace'}
                                multiline={false}
                                numberOfLines={2}
                                value={grace ? grace.toString():''}
                                keyboardType={'number-pad'}
                                editable={!props.disabled}
                                maxLength={3}
                            />
                            {
                                graceErr ?
                                    <TextComponent
                                        textStyle={{ color: 'red', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }}
                                        label={props.helperText + ' ' + Math.round(props.minGrace) + '-' + Math.round(props.maxGrace)}
                                    />
                                    :
                                    null
                            }
                        </View>
                    </View>

                    <View style={{ height: HEIGHT * 0.07, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', padding: 10 }}>
                        <TouchableOpacity
                            onPress={confirmAlert}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{props.okmsg}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={cancelAlert}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 5 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{props.cancelmsg}</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </TouchableOpacity>
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
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        fontSize: 15,
        color: 'black',
    },
    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    }
});

export default AlertComponentForGrace;