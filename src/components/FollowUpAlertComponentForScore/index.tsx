import React, { useContext, useState } from 'react';
import {
    View,
    Text,
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
import { fontFamily, fontColor } from '../../config/config';
import { Context } from '../../utils/Context';

const FollowUpAlertComponentForScore = (props: any) => {

    let context = useContext(Context);
    const [desc, setDesc] = useState([]);

    const cancelAlert = () => {
        props.closeAlert();
    }

    // render method for score
    const renderScoreData = ({ item, index }: any) => {
        //console.log("item is going to followupcomponent function ", item)
        return (
            <TouchableOpacity   
                onPress={() => props.onClickScoreListItemSatisfactory(item, index)}     
                style={{ flex: 2, flexDirection: context.isArabic ? 'row-reverse' : 'row', borderBottomWidth: 0, borderBottomColor: '#5c666f' }}>
                <View style={{ flex: 0.3,padding:10, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#5c666f' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                        label={item.score}
                    />
                </View>
                <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', borderRightWidth: props.nonCompliance ? 0 : 1, borderRightColor: '#5c666f' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                        label={item.description}
                    />
                </View>
                {props.nonCompliance ?
                    null
                    :
                    <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center' }}>
                        <TextComponent
                            textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                            label={item.nonCompliance}
                        />

                    </View>

                }

            </TouchableOpacity>
        );
    }

    const renderScoreData1 = ({ item, index }: any) => {
        //console.log("item", item)
        return (
            <TouchableOpacity
                onPress={() => props.onClickScoreListItem(item, index)}
                style={{ flex: 2,height:30, backgroundColor: 'white', width: "95%", alignSelf: 'center', justifyContent: 'center', alignItems: 'center', elevation: 3 }}>
                <Text style={{
                    color: fontColor.TitleColor, fontWeight: 'normal',
                    fontSize: 12, textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily
                }}>{item.title}</Text>
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
            <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', position: 'absolute', ...StyleSheet.absoluteFillObject }}>
                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: 'auto', borderRadius: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }]}>
                    {/* {props.title1 == 4 || props.title1 == '4' || props.title1 == 5 || props.title1 == '5' || props.title1 == '6' ? */}
                    {props.title1 == 4 || props.title1 == '4' || props.title1 == 5 || props.title1 == '5'  ?
                        <View style={{ flex: 5, justifyContent: 'center', borderRadius: 20 }}>

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
                            <View style={{ height: 'auto', justifyContent: 'center', padding: 5 }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', borderBottomWidth: 1, borderBottomColor: '#5c666f' }}>
                                        <View style={{ flex: 0.3,padding:14.5, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#5c666f' }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                                label={strings[context.isArabic ? 'ar' : 'en'].alertComponent.score}
                                            />
                                        </View>
                                        <View style={{ flex: 0.7,padding:10, justifyContent: 'center', alignItems: 'center', borderRightWidth: props.nonCompliance ? 0 : 1, borderRightColor: '#5c666f' }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                                label={strings[context.isArabic ? 'ar' : 'en'].alertComponent.description}
                                            />
                                        </View>
                                        {
                                            props.nonCompliance ? null :
                                                <View style={{ flex: 1.2,padding:10, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TextComponent
                                                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontWeight: 'bold' }}
                                                        label={strings[context.isArabic ? 'ar' : 'en'].alertComponent.nonComplaince}
                                                    />
                                                </View>
                                        }

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
                        :
                        <View style={{ flex: 5, justifyContent: 'center', borderRadius: 20 }}>

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
                            <View style={{ height: 95, padding: 5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                                {/* <View style={{ flex: 1,justifyContent:'center',backgroundColor:'yellow' }}> */}
                                    <View style={{ flex:1,justifyContent:'center' }}>

                                        <FlatList
                                            data={props.scoreArray}
                                            ItemSeparatorComponent={() => {
                                                return (<View style={{ height: 5 }} />);
                                            }}
                                            renderItem={renderScoreData1}
                                            ListEmptyComponent={listEmptyView}
                                        />
                                    </View>

                                {/* </View> */}
                                {/* //end */}
                            </View>
                        </View>
                    }
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

export default FollowUpAlertComponentForScore;