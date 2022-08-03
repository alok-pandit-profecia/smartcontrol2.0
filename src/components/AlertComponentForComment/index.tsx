import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Modal,
    TextInput
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import * as Animatable from 'react-native-animatable';
import TextInputWithLabelComponent from '../TextInputWithLabelComponent';
import TextComponent from '../TextComponent';
import { Context } from '../../utils/Context';

const AlertComponentForComment = (props: any) => {
    let context = useContext(Context);

    useEffect(() => {
        setComment(props.comment);
    }, [props.comment])

    // comment variable
    const [comment, setComment] = useState('');
    const updateComment = (val: any) => {
        // props.updateCommentValue(val);
        setComment(val);
    }

    const cancelAlert = () => {
        props.closeAlert();
    }

    const confirmAlert = () => {
        props.updateCommentValue(comment);
        props.okAlert();
    }

    const okCheckListMsg = () => {
        setTimeout(() => {
            props.okCheckListMsg();
        }, 200);
    }

    return (

        <Modal
            visible={true}
            transparent={true}
        >
            <TouchableOpacity onPress={cancelAlert} style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', }}>
                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.30, borderRadius: 20, zIndex: 999, position: 'absolute', top: HEIGHT * 0.30 }]}>
                    <View style={{ flex: 5, justifyContent: 'center', borderRadius: 20 }}>
                        <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: context.isArabic ? 'row-reverse' : 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                            <View style={{ flex: 9, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                <TextComponent
                                    textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: context.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.title}
                                />
                            </View>
                            <TouchableOpacity
                                onPress={cancelAlert}
                                style={{ flex: 1, justifyContent: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/alert_images/close.png")}
                                    style={{ height: '80%', width: '90%' }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: HEIGHT * 0.2, justifyContent: 'center', alignItems: 'center' }}>

                            {props.screenName == 'detention' ?
                                <Text style={{ fontSize: 14, color: 'black', textAlign: context.isArabic ? 'right' : 'left', paddingLeft: 5, paddingRight: 5, paddingTop: 8 }}>
                                    {comment}
                                </Text>
                                :
                                <TextInput
                                    onChangeText={updateComment}
                                    value={comment}
                                    // showLabel={false}
                                    placeholder={props.message}
                                    placeholderTextColor={'#5c666f'}
                                    multiline={true}
                                    maxLength={1500}
                                    numberOfLines={3}
                                    editable={!props.disabled}
                                    // height={100}
                                    style={{ width: '90%', height: HEIGHT * 0.14, color: '#5c666f', backgroundColor: '#fffffff', borderColor: '#c0c0c0', borderWidth: 1, borderRadius: 10, textAlign: context.isArabic ? 'right' : 'left' }}
                                />
                            }

                        </View>

                    </View>

                    {props.screenName == 'detention' ? <View style={{ height: HEIGHT * 0.07, padding: 10 }} /> :
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
                    }
                </Animatable.View>
            </TouchableOpacity>
        </Modal >
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

export default AlertComponentForComment;