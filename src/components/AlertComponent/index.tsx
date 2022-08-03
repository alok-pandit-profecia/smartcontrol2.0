import React, { Component, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    FlatList
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import * as Animatable from 'react-native-animatable';
import TextInputWithLabelComponent from '../TextInputWithLabelComponent';
import TextComponent from '../TextComponent';

let scoreArray = [
    { score: '0', description: 'Violation', nonCompliance: 'food handler using tobacco while preparing food. Spitting inprpparly in the establishment snezing over uncovered food' },
    { score: '1', description: 'Final Warning', nonCompliance: 'Evidence of tobacco use, (e.g. cigarettes ash, smoke smell) Personnel wearing jewellery, e.g. earrings. Esp. in  preparation area Employees eating/ drinking/ chewing gum in prep area Inappropriate personal Behaviours in food handling areas (e.g.↵cleaning nose by fingers, scratching skin or head or nose or ears,↵rubbing eyes, sneezing on food, spitting' },
    { score: '2', description: 'First Warning', nonCompliance: 'NA' },
    { score: '3', description: 'Notice', nonCompliance: 'Minor bad hygiene behavior  observed (e.g. sneezing or coughing in hand palm) Personal belongings at the  food handling area' },
    { score: '4', description: 'Satisfactory', nonCompliance: 'Satisfactory' },
]

const AlertComponent = (props) => {

    // grace period variables
    const [gracePeriod, setGracePeriod] = useState('');
    const updateGracePeriod = (val) => {
        setGracePeriod(val);
    }

    const cancelAlert = () => {
        props.closeAlert();
    }

    const confirmAlert = () => {
        props.okAlert();
    }

    const okCheckListMsg = () => {
        setTimeout(() => {
            props.okCheckListMsg();
        }, 200);
    }

    // render method for score
    const renderScoreData = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row' }}>
                <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: 'gray', textAlign: 'center', fontSize: 15, fontWeight: 'normal' }}
                        label={item.score}
                    />
                </View>
                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: 'gray', textAlign: 'center', fontSize: 15, fontWeight: 'normal' }}
                        label={item.description}
                    />
                </View>
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: 'gray', textAlign: 'center', fontSize: 15, fontWeight: 'normal' }}
                        label={item.nonCompliance}
                    />
                </View>
            </TouchableOpacity>
        );
    }

    const listEmptyView = () => {
        return (
            <View>

            </View>
        );
    }

    return (
        <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, alignItems: 'center', position: 'absolute', ...StyleSheet.absoluteFillObject }}>
            <Animatable.View animation='zoomIn' style={[styles.textModal, { height: props.showCommentInput ? HEIGHT * 0.23 : HEIGHT * 0.50 }]}>
                <View style={{ flex: 5, justifyContent: 'center' }}>
                    <View style={{ height: HEIGHT * 0.06, backgroundColor: "#0397d5", flexDirection: 'row' }}>
                        <View style={{ flex: 9, justifyContent: 'center' }}>
                            <TextComponent
                                textStyle={[styles.alerttext, { color: 'white', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                label={props.title}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={cancelAlert}
                            style={{ flex: 1, justifyContent: 'center' }}>
                            <Image
                                resizeMode="contain"
                                source={require("./../../images/alert_images/close.png")}
                                style={{ height: '80%', width: '80%' }} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: props.showScore ? HEIGHT * 0.45 : props.showCommentInput ? HEIGHT * 0.1 : HEIGHT * 0.45, justifyContent: 'center' }}>
                        {
                            props.showMessage
                                ?
                                <TextComponent
                                    numberOfLines={15}
                                    textStyle={[styles.confirmMsg, { color: '#142868', textAlign: 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.message}
                                />
                                :
                                null
                        }
                        {
                            props.showCommentInput
                                ?
                                <TextInputWithLabelComponent
                                    onChange={updateGracePeriod}
                                    value={gracePeriod}
                                    showLabel={false}
                                    isSecureTextEntry={false}
                                    placeholder={'Enter comment'}
                                    placeholderTextColor={'black'}
                                    multiline={false}
                                    numberOfLines={1}
                                    style={{ flex: 1, width: '100%', color: 'black', textAlign: 'left' }}
                                />
                                :
                                null
                        }
                        {
                            props.showScore
                                ?
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.7, flexDirection: 'row' }}>
                                        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                                            <TextComponent
                                                textStyle={{ color: 'gray', textAlign: 'center', fontSize: 15, fontWeight: 'normal' }}
                                                label={'Score'}
                                            />
                                        </View>
                                        <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                                            <TextComponent
                                                textStyle={{ color: 'gray', textAlign: 'center', fontSize: 15, fontWeight: 'normal' }}
                                                label={'Description'}
                                            />
                                        </View>
                                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                            <TextComponent
                                                textStyle={{ color: 'gray', textAlign: 'center', fontSize: 15, fontWeight: 'normal' }}
                                                label={'Non complaince'}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 2.3 }}>
                                        <FlatList
                                            data={scoreArray}
                                            ItemSeparatorComponent={() => {
                                                return (<View style={{ height: 1, backgroundColor: 'gray' }} />);
                                            }}
                                            renderItem={renderScoreData}
                                            ListEmptyComponent={listEmptyView}
                                        />
                                    </View>
                                </View>
                                :
                                null
                        }
                    </View>
                </View>
                {
                    props.showOkButton || props.showCancelButton
                        ?
                        <View style={{ height: HEIGHT * 0.07, flexDirection: 'row', justifyContent: 'space-evenly', padding: 5 }}>
                            {
                                props.showOkButton
                                    ?
                                    <TouchableOpacity
                                        onPress={confirmAlert}
                                        style={{ backgroundColor: "#ee3d43", justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 5 }}>
                                        <Text style={{ fontWeight: 'bold', color: 'white' }}>{props.okmsg}</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                            {
                                props.showCancelButton
                                    ?
                                    <TouchableOpacity
                                        onPress={cancelAlert}
                                        style={{ backgroundColor: "#ee3d43", justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 5 }}>
                                        <Text style={{ fontWeight: 'bold', color: 'white' }}>{props.cancelmsg}</Text>
                                    </TouchableOpacity>
                                    :
                                    null
                            }
                        </View>
                        :
                        null
                }
            </Animatable.View>
        </View>
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
        width: WIDTH * 0.9,
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

export default AlertComponent;