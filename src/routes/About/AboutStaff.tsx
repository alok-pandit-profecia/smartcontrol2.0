import React, { useContext } from 'react';
import { Image, View, FlatList, SafeAreaView, Text, ImageBackground, Dimensions } from "react-native";
import Header from './../../components/Header';
import KeyValueComponent from './../../components/KeyValueComponent';
import TableComponent from './../../components/TableComponent';
import BottomComponent from './../../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import Strings from '../../config/strings';
import { RealmController } from '../../database/RealmController';
import { fontColor, fontFamily } from '../../config/config';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const AboutStaff = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel })
    const { myTasksDraft } = useInject(mapStore)



    const renderRecentNews = () => {

        return (

            <View
                style={{
                    height: HEIGHT * 0.3, width: '100%',  justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={true}
                    moreColumn={true}
                    isArabic={context.isArabic}
                    headerNameOne={Strings[context.isArabic ? 'ar' : 'en'].staff.name}
                    headerNameTwo={Strings[context.isArabic ? 'ar' : 'en'].staff.contact}
                    headerNameThree={Strings[context.isArabic ? 'ar' : 'en'].staff.post}
                    data={[{ valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                    { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                    { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                    { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                    { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' }
                    ]}
                />
            </View>
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
                    <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold' }}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.staff}</Text>
                </View> */}

                <View style={{ flex: 0.2 }} />
              
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].taskList.staff)} </Text>
                </View>
              
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 3, width: '80%', alignSelf: 'center' }}>
                    {/* <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={temp}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
                            )
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    /> */}
                    {/* <TableComponent
                        isHeader={true}
                        moreColumn={true}
                        isArabic={context.isArabic}
                        headerNameOne={Strings[context.isArabic ? 'ar' : 'en'].staff.name}
                        headerNameTwo={Strings[context.isArabic ? 'ar' : 'en'].staff.contact}
                        headerNameThree={Strings[context.isArabic ? 'ar' : 'en'].staff.post}
                        data={[{ valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                        { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                        { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                        { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' },
                        { valueOne: 'Suraj Parida', valueTwo: '043243432423X100', valueThree: 'Partner' }
                        ]}
                    /> */}
                    {
                        renderRecentNews()
                    }
                </View>
                <View style={{ flex: 3 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}


export default observer(AboutStaff);