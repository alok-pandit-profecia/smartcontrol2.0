import React, { Component, useState, useEffect } from 'react';
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
import TextInputWithLabelComponent from '../TextInputWithLabelComponent';
import TextComponent from '../TextComponent';
import { TextInput } from 'react-native-gesture-handler';

const AlertComponentForSubmitCheckList = (props: any) => {

    const cancelAlert = () => {
        props.closeAlert();
    }

    const confirmAlert = () => {
        props.yesClick();
    }

    return (
        <Modal
            visible={true}
            transparent={true}
        >
            <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', position: 'absolute', ...StyleSheet.absoluteFillObject }}>
                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.30, borderRadius: 20 }]}>
                    <View style={{ flex: 5, justifyContent: 'flex-start', borderRadius: 20 }}>
                        <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ flex: 9, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                <TextComponent
                                    textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: 'left', fontSize: 15, fontWeight: 'bold' }]}
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

                        <View style={{ height: HEIGHT * 0.08, }}>
                            <View style={{ flex: 9, justifyContent: 'center' }}>
                                <TextComponent
                                    textStyle={[styles.alerttext, { textAlign: 'left', fontSize: 14, fontWeight: 'normal' }]}
                                    label={props.massage}
                                />
                            </View>

                        </View>

                        <View style={{ height: HEIGHT * 0.08, }}>
                            <View style={{ flex: 9, justifyContent: 'center' }}>
                                <TextComponent
                                    textStyle={[styles.alerttext, { textAlign: 'left', fontSize: 14, fontWeight: 'normal' }]}
                                    label={props.description}
                                />
                            </View>

                        </View>
                    </View>

                    <View style={{ height: HEIGHT * 0.07, flexDirection: 'row', justifyContent: 'space-evenly', padding: 5 }}>
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

export default AlertComponentForSubmitCheckList;