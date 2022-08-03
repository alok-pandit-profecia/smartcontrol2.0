import React, { useContext } from 'react';
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

import * as Animatable from 'react-native-animatable';
import TextComponent from '../TextComponent';

import strings from '../../config/strings';
import { Context } from '../../utils/Context';

const AlertComponentForAttachment = (props: any) => {

    let context = useContext(Context);

    const cancelAlert = () => {
        props.closeAlert();
    }

    return (

        <Modal
            visible={true}
            transparent={true}
        >
            <TouchableOpacity onPress={cancelAlert} style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, alignItems: 'center', borderRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                <Animatable.View duration={500} animation='zoomIn' style={[styles.textModal, { borderRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>

                    <View style={{ flex: 1, justifyContent: 'center', borderRadius: 20 }}>

                        <View style={{ flex: 2.5, backgroundColor: "#abcfbf", flexDirection: context.isArabic ? 'row-reverse' : 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                            <View style={{ flex: 2.5, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                                <TextComponent
                                    textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: props.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.title}
                                />

                            </View>

                            <TouchableOpacity
                                onPress={cancelAlert}
                                style={{ flex: 0.5, justifyContent: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/alert_images/close.png")}
                                    style={{ height: '80%', width: '90%' }} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ flex: 8.5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>

                            <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', alignItems: 'center' }}>

                                <View style={{ flex: 1, height: (props.fromScreen == 'condemnation' || props.fromScreen == 'detention' || props.fromScreen == 'sampling') ? '80%' : '50%' }}>

                                    <TouchableOpacity
                                        onPress={() => {
                                            if (props.fromScreen == 'condemnation' || props.fromScreen == 'detention' || props.fromScreen == 'sampling') {
                                                if (props.attachmentClick == 'one') {
                                                    let img = props.attachmentOne();
                                                }
                                                else {
                                                    let img = props.attachmentTwo();
                                                }
                                            }
                                            else {
                                                let img = props.attachmentOne();
                                            }
                                        }}
                                        disabled={props.disabled}
                                        style={{ flex: 1, alignSelf: 'center', width: (props.fromScreen == 'condemnation' || props.fromScreen == 'detention' || props.fromScreen == 'sampling') ? '60%' : '85%', backgroundColor: '#e0e0e0', borderRadius: 10, justifyContent: 'center' }}>

                                        <Image
                                            resizeMode={props.image1Uri ? "cover" : "contain"}
                                            source={
                                                props.image1Uri
                                                    ?
                                                    { uri: props.image1Uri }
                                                    :
                                                    require("./../../assets/images/startInspection/White/Picture.png")
                                            }
                                            style={{ alignSelf: 'center', height: '100%', width: '100%' }}
                                        />

                                    </TouchableOpacity>

                                </View>

                                {
                                    (props.fromScreen == 'condemnation' || props.fromScreen == 'detention' || props.fromScreen == 'sampling') ? null :

                                        <View style={{ flex: 1, height: props.fromScreen == 'condemnation' || props.fromScreen == 'detention' || props.fromScreen == 'sampling' ? '80%' : '50%' }}>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    props.attachmentTwo();
                                                }}
                                                disabled={props.disabled}
                                                style={{ flex: 1, alignSelf: 'center', width: (props.fromScreen == 'condemnation' || props.fromScreen == 'detention' || props.fromScreen == 'sampling') ? '60%' : '85%', backgroundColor: '#e0e0e0', borderRadius: 10, justifyContent: 'center' }}>
                                                <Image
                                                    resizeMode={props.image2Uri ? "cover" : "contain"}
                                                    source={
                                                        props.image2Uri
                                                            ?
                                                            // { uri: "data:image/jpg;base64," + props.base64Two }
                                                            { uri: props.image2Uri }
                                                            :
                                                            require("./../../assets/images/startInspection/White/Picture.png")
                                                    }
                                                    style={{ alignSelf: 'center', height: '100%', width: '100%' }}
                                                />

                                            </TouchableOpacity>

                                        </View>
                                }

                            </View>

                        </View>

                    </View>

                </Animatable.View>

            </TouchableOpacity>

        </Modal >
    )
}

const styles = StyleSheet.create({
    textModal: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        position: 'absolute',
        height: HEIGHT * 0.25,
        width: WIDTH * 0.85,
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
    }
});

export default AlertComponentForAttachment;