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
import strings from '../../config/strings';
import { Context } from '../../utils/Context';

const AlertComponentWithoutHeader = (props: any) => {

    let context = useContext(Context);

    useEffect(() => {
    }, [])

    // grace variable


    const cancelAlert = () => {
        props.closeAlert();
    }

    const confirmAlert = () => {
        props.okAlert();
    }

    return (
        <Modal
            visible={true}
            transparent={true}
        >
            <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, zIndex: 8, position: 'absolute', ...StyleSheet.absoluteFillObject }}>

                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.18, borderRadius: 20 }]}>

                    <View style={{ flex: 1, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                        <View style={{ height: HEIGHT * 0.03 }} />

                        <TouchableOpacity
                            onPress={() => {
                                cancelAlert()
                            }}
                            style={{ height: HEIGHT * 0.04, width: '20%', alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                            <Image
                                resizeMode="contain"
                                source={require("./../../assets/images/alert_images/close.png")}
                                style={{ height: '70%', width: '70%', flexDirection: 'row', alignSelf: 'flex-end' }} />

                        </TouchableOpacity>

                        <View style={{ height: HEIGHT * 0.1, justifyContent: 'flex-start', alignItems: 'center' }}>

                            <TextComponent
                                textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: 'center', fontSize: 14, fontWeight: 'normal' }]}
                                label={props.title}
                            />

                        </View>

                    </View>

                    <View style={{ height: HEIGHT * 0.08, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                        <TouchableOpacity
                            onPress={props.perfExisting}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '40%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{props.okmsg}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={props.createAdhoc}
                            style={{ backgroundColor: "#5c666f", justifyContent: 'center', alignItems: 'center', width: '45%', borderRadius: 9, padding: 6 }}>
                            <Text style={{ fontWeight: 'bold', color: 'white' }}>{props.cancelmsg}</Text>
                        </TouchableOpacity>

                    </View>


                </Animatable.View>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    textModal: {
        position: 'absolute',
        width: WIDTH * 0.85,
        backgroundColor: 'white',
        borderRadius: 5,
        alignSelf: 'center',
        top: HEIGHT * 0.32,
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

export default AlertComponentWithoutHeader;