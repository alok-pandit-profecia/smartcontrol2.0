import React from 'react';
import { View, Text, Dimensions, Image, TouchableOpacity, Alert } from "react-native";
import { fontFamily, fontColor } from '../config/config';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const TableComponent = (props: any) => (

    <React.Fragment>

        { props.isHeader ?

            props.moreColumn ?
                // <View style={[{ flex: 1.5, flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', borderColor: '#abcfbf', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                // <View style={[{ flex: 1, backgroundColor: '#abcfbf', justifyContent: 'center', alignItems: 'center', borderRightColor: '#abcfbf' }]}>
                //     <Text style={{ fontWeight: 'bold', textAlign: 'center', color: fontColor.TextBoxTitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.headerNameOne} </Text>
                // </View>
                // <View style={[{ flex: 1, backgroundColor: '#abcfbf', justifyContent: 'center', alignItems: 'center', borderRightColor: '#abcfbf' }]}>
                //     <Text style={{ fontWeight: 'bold', textAlign: 'center', color: fontColor.TextBoxTitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.headerNameTwo} </Text>
                // </View>
                // <View style={[{ flex: 1, backgroundColor: '#abcfbf', justifyContent: 'center', alignItems: 'center', borderRightColor: '#abcfbf' }]}>
                //     <Text style={{ fontWeight: 'bold', textAlign: 'center', color: fontColor.TextBoxTitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.headerNameThree} </Text>
                // </View>
                // </View>
                <View style={[{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row', backgroundColor: '#c4ddd2', justifyContent: 'center', alignItems: 'center', borderColor: '#abcfbf', borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                    <View style={[{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: '#abcfbf', borderRightWidth: 2 }]}>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.headerNameOne} </Text>
                    </View>
                    <View style={[{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: '#abcfbf', borderRightWidth: 2 }]}>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.headerNameTwo} </Text>
                    </View>
                    <View style={[{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center', borderRightColor: '#abcfbf' }]}>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.headerNameThree} </Text>
                    </View>
                </View>
                :
                <View style={[{ flex: 1.5, flexDirection: props.isArabic ? 'row-reverse' : 'row', backgroundColor: '#abcfbf', alignItems: 'center', justifyContent: 'space-between', borderColor: '#abcfbf', borderTopLeftRadius: 10, borderTopRightRadius: 10, paddingHorizontal: 5 }]}>
                    <Text style={{ fontWeight: 'bold', textAlign: props.isArabic ? 'right' : 'left', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 14 }}>{props.HeaderName} </Text>
                    {
                        props.isEdit ?
                            <TouchableOpacity
                                onPress={() => {
                                    props.editData()
                                }}
                            >
                                <Image source={require('./../assets/images/condemnation/editPencil.png')} />
                            </TouchableOpacity>
                            : null
                    }
                    {
                        props.isView ?
                            <TouchableOpacity
                                onPress={() => {
                                    if (props.viewData) {
                                        props.viewData()
                                    }
                                }}
                            >
                                <Image
                                    style={{ height: 28, width: 28 }}
                                    source={require('./../assets/images/condemnation/View.png')} />
                            </TouchableOpacity>
                            : null
                    }
                    {/* {
                        props.isDelete ?
                            <TouchableOpacity
                                onPress={() => {
                                    props.deleteData();
                                }}
                            >
                                <Image source={require('./../assets/images/condemnation/delete.png')} />
                            </TouchableOpacity>
                            : null
                    } */}
                </View>
            : null
        }

        {
            props.moreColumn ?

                props.data && props.data.map((item: any, index: number) => {
                    return (
                        <View key={index} style={[{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row', borderBottomColor: '#abcfbf', borderBottomWidth: (props.data.length - 1) ? 0 : 1, backgroundColor: index % 2 ? '#e0e0e0' : 'transparent', borderBottomLeftRadius: (props.data.length - 1) == index ? 10 : 0, borderBottomRightRadius: (props.data.length - 1) == index ? 10 : 0 }]}>

                            <View style={[props.isArabic ? { borderLeftWidth: 1, borderLeftColor: '#abcfbf' } : { borderRightWidth: 1, borderRightColor: '#abcfbf' }, { flex: 1, paddingHorizontal: 5, justifyContent: 'center' }]}>
                                <Text numberOfLines={2} style={{ paddingLeft: 3, textAlign: props.isArabic ? 'right' : 'left', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 11 }}>{item.valueOne}</Text>
                            </View>

                            <View style={[props.isArabic ? { borderLeftWidth: 1, borderLeftColor: '#abcfbf' } : { borderRightWidth: 1, borderRightColor: '#abcfbf' }, { flex: 1, paddingHorizontal: 5, justifyContent: 'center' }]}>
                                <Text numberOfLines={2} style={{ paddingLeft: 3, textAlign: props.isArabic ? 'right' : 'left', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 11 }}>{item.valueTwo}</Text>
                            </View>

                            <View style={{ flex: 1, paddingHorizontal: 5, justifyContent: 'center' }}>
                                <Text numberOfLines={2} style={{ paddingLeft: 7, color: fontColor.TitleColor, textAlign: props.isArabic ? 'right' : 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 11 }}>{item.valueThree}</Text>
                            </View>

                        </View>
                    )
                })
                :
                props.data ? props.data.map((item: any, index: number) => {

                    return (

                        <View key={index} style={[{ flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row', borderBottomColor: '#abcfbf', borderBottomWidth: (props.data.length - 1) ? 0 : 1, backgroundColor: index % 2 ? '#e0e0e0' : 'transparent', borderBottomLeftRadius: (props.data.length - 1) == index ? 10 : 0, borderBottomRightRadius: (props.data.length - 1) == index ? 10 : 0 }]}>

                            <View style={[props.isArabic ? { borderLeftWidth: 1, borderLeftColor: '#abcfbf' } : { borderRightWidth: 1, borderRightColor: '#abcfbf' }, { flex: 1, paddingHorizontal: 5, justifyContent: 'center' }]}>
                                <Text numberOfLines={2} style={{ paddingLeft: 3, fontWeight: 'bold', textAlign: props.isArabic ? 'right' : 'left', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 12 }}>{item.keyName + ":"}</Text>
                            </View>

                            {/* {
                                (item.keyName == 'Question')||(item.keyName == 'Comments') ?
                                    <TouchableOpacity onPress={()=>Alert.alert("",item.value)} style={{ flex: props.numberOfLines ? 2 : 1.3, paddingHorizontal: 5, justifyContent: 'center' }}>
                                        <Text numberOfLines={2} style={{ paddingLeft: 7, color: fontColor.TitleColor, textAlign: props.isArabic ? 'right' : 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12 }}>{item.value}</Text>
                                    </TouchableOpacity>
                                    : */}
                            <View style={{ flex: props.numberOfLines ? 2 : 1.3, paddingHorizontal: 5, justifyContent: 'center' }}>
                                <Text numberOfLines={2} style={{ paddingLeft: 7, color: fontColor.TitleColor, textAlign: props.isArabic ? 'right' : 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12 }}>{item.value}</Text>
                            </View>
                            {/* } */}


                        </View>
                    )
                })
                    : null
        }
    </React.Fragment>
)

export default TableComponent;