import React, { useContext } from 'react';
import { Image, View, FlatList, SafeAreaView, Text, ImageBackground, Dimensions } from "react-native";
import Header from '../../components/Header';
import KeyValueComponent from '../../components/KeyValueComponent';
import TableComponent from '../../components/TableComponent';
import BottomComponent from '../../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import Strings from '../../config/strings';
import { RealmController } from '../../database/RealmController';
import { fontColor, fontFamily } from '../../config/config';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
import { TouchableOpacity } from 'react-native-gesture-handler';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const AboutSearchDocument = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)

    let temp = [
        { documentName: 'doc1.doc', type: 'Organization', name: 'Lulu Hypermarket', nationality: '', mobileNumber: '', relationship: 'Competetor' },
        { documentName: 'doc1.doc', type: 'Person', name: 'Suraj Parida', nationality: '', mobileNumber: '0552109366X00', relationship: 'Partnership' },
        { documentName: 'doc1.doc', type: 'Person', name: 'Ramneek Rak', nationality: 'Afghnistan', mobileNumber: '05011111100', relationship: 'Refers To' },
    ]

    const renderAboutDocument = (item: any, index: number) => {

        return (

            <View
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.04, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>

                <View style={{ flex: 0.5 }} />

                <View style={{ width: '70%', justifyContent: 'center', paddingLeft: 5 }}>
                    <Text style={{ textAlign: context.isArabic ? 'right' : 'left', color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{item.documentName}</Text>
                </View>

                <View style={{ width: '30%', alignItems: 'center', justifyContent: 'space-around', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>



                    <View style={{ height: WIDTH * 0.05, width: WIDTH * 0.05, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: fontColor.TitleColor, borderWidth: 0.2, alignSelf: 'center' }}>
                        {/* <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}> */}
                        <Image resizeMode={'contain'}
                            style={{ height: 12, width: 12 }}
                            source={require("./../../assets/images/About/document/delete.png")} />
                        {/* </View> */}
                    </View>

                    <View style={{ height: WIDTH * 0.05, width: WIDTH * 0.05, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: fontColor.TitleColor, borderWidth: 0.2, alignSelf: 'center' }}>
                        {/* <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}> */}
                        <Image resizeMode={'contain'}
                            style={{ height: 12, width: 12 }}
                            source={require("./../../assets/images/About/document/download.png")} />
                        {/* </View> */}
                    </View>

                    <View style={{ height: WIDTH * 0.05, width: WIDTH * 0.05, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, backgroundColor: fontColor.TitleColor, borderWidth: 0.2, alignSelf: 'center' }}>
                        {/* <View style={{ height: WIDTH * 0.1, width: WIDTH * 0.1, justifyContent: 'center', alignItems: 'center', top: -10 }}> */}
                        <Image resizeMode={'contain'}
                            style={{ height: 12, width: 12 }}
                            source={require("./../../assets/images/About/document/search.png")} />
                        {/* </View> */}
                    </View>

                    {/* <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text> */}
                </View>

                <View style={{ flex: 0.8 }} />

            </View >
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.7 }}>

                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'CompletedTask' ? 1.4 : 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 16, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.about}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                    </View>

                </View>
                {/* <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>

                    <View style={{ flex: 0.5 }} />

                    <View style={{ flex: 1.2, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionNo + ":-"}</Text>
                    </View>

                    <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{'0123432'}</Text>
                    </View>

                    <View style={{ flex: 0.008, height: '50%', alignSelf: 'center', borderWidth: 0.2, borderColor: '#5C666F' }} />

                    <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left' }}>{'Lulu 01'}</Text>
                    </View>

                    <View style={{ flex: 0.8 }} />

                </View> */}

                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].contactList.contactList)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.2, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={temp}
                        renderItem={({ item, index }) => {
                            return (
                                renderAboutDocument(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    />
                </View>
                <View style={{ flex: 0.6 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}


export default observer(AboutSearchDocument);