import React, { useContext, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    FlatList,
    Modal
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import * as Animatable from 'react-native-animatable';
import TextInputWithLabelComponent from '../TextInputWithLabelComponent';
import TextComponent from '../TextComponent';
import strings from '../../config/strings';
import { Context } from '../../utils/Context';

const AlertComponentForScore = (props: any) => {

    let context = useContext(Context);

    const cancelAlert = () => {
        props.closeAlert();
    }

    // render method for score
    const renderScoreData = ({ item, index }: any) => {
        return (
            <TouchableOpacity
                onPress={() => props.onClickScoreListItem(item, index)}
                style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', minHeight:HEIGHT*0.07, borderBottomWidth: 1, borderBottomColor: '#5c666f' }}>
                <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                        label={item.score}
                    />
                </View>
                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                        label={item.description}
                    />
                </View>
                <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
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
        <Modal
            visible={true}
            transparent={true}
        >
            <TouchableOpacity onPress={cancelAlert} style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', }}>
                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: 'auto', maxHeight: HEIGHT * 0.8, borderRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, zIndex: 999 }]}>
                    <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: context.isArabic ? 'row-reverse' : 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                        <View style={{ flex: 9, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
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
                    <ScrollView>
                        <View style={{ flex: 1, justifyContent: 'center', borderRadius: 20 }}>


                            <View style={{ height: 'auto', justifyContent: 'center', padding: 5 }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', borderBottomWidth: 1, borderBottomColor: '#5c666f' }}>
                                        <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                                label={strings[context.isArabic ? 'ar' : 'en'].alertComponent.score}
                                            />
                                        </View>
                                        <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                                label={strings[context.isArabic ? 'ar' : 'en'].alertComponent.description}
                                            />
                                        </View>
                                        <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center' }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                                label={strings[context.isArabic ? 'ar' : 'en'].alertComponent.nonComplaince}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ flex: 2.3 }}>
                                        <FlatList
                                            data={props.scoreArray}
                                            ItemSeparatorComponent={() => {
                                                return (<View style={{ height: 1, backgroundColor: '#5c666f' }} />);
                                            }}
                                            renderItem={renderScoreData}
                                            ListEmptyComponent={listEmptyView}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
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

export default AlertComponentForScore;