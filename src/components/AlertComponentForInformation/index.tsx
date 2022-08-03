import React, { Component, useState } from 'react';
import {
    View,
    ScrollView,
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

const AlertComponentForInformation = (props: any) => {

    const cancelAlert = () => {
        props.closeAlert();
    }
    const [visible, setVisible] = useState(true);
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
                                onPress={cancelAlert}
                                style={{ flex: 1, justifyContent: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/alert_images/close.png")}
                                    style={{ height: '80%', width: '80%' }} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: 'auto', justifyContent: 'center' }}>
                            <ScrollView>
                                <TextComponent
                                    numberOfLines={15}
                                    textStyle={[styles.confirmMsg, { color: '#5c666f', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.message}
                                />
                            </ScrollView>
                        </View>
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

export default AlertComponentForInformation;