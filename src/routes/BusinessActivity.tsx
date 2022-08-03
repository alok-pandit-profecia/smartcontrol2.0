import React, { useContext,useEffect,useState } from 'react';
import { Image, View, FlatList, SafeAreaView, Text,TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import Header from './../components/Header';
import KeyValueComponent from './../components/KeyValueComponent';
import TableComponent from './../components/TableComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import Strings from '../config/strings';
import { RealmController } from '../database/RealmController';
import { fontColor, fontFamily } from '../config/config';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import NavigationService from '../services/NavigationService';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const BusinessActivity = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel,adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel })
    const { myTasksDraft,adhocTaskEstablishmentDraft } = useInject(mapStore)

    const [taskList, setTaskList] = useState(Array());
    const [tradeName, setTradeName] = useState("");
   
    let tempArray:any = []
    useEffect(() => {
        debugger;
        if (adhocTaskEstablishmentDraft.getSelectedItem() && 
        adhocTaskEstablishmentDraft.getSelectedItem()!="" ) {
            
            tempArray.push(JSON.parse(adhocTaskEstablishmentDraft.getSelectedItem()))
            setTradeName(tempArray[0].TradeEngName)
            if(tempArray[0].ListOfAdfcaActionAccount){
                let temp:any = tempArray[0].ListOfAdfcaActionAccount
                let tempListOFBusinessActivity:any = temp.BusinessActivity
              
                setTaskList(tempListOFBusinessActivity)
            }
            
        }
    }, [])


    const renderRecentNews = (item: any, index: number) => {

        return (

            <View            
                key={item.inspectionId}
                style={{
                    height: HEIGHT * 0.12, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                }}>
                <TableComponent
                    isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].serviceRequstList.businessActivity, value: item.BusinessActivity },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].serviceRequstList.city, value: item.City },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].serviceRequstList.category, value: item.Category },

                    ]}
                />
            </View>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>
                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 1.2 : 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 0.8 : 1.2, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(myTasksDraft.isMyTaskClick == 'History' ? Strings[context.isArabic ? 'ar' : 'en'].history.history : Strings[context.isArabic ? 'ar' : 'en'].adhocTask.adhocTask)}</Text>
                        </View>
                        <View style={{ flex: myTasksDraft.isMyTaskClick == 'History' ? 1.2 : 0.9 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center',alignItems:'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>               
                             <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold',fontFamily:fontFamily.textFontFamily }}>{tradeName}</Text>                 
                    </View>   
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].serviceRequstList.businessActivity)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 5.2, width: '80%', alignSelf: 'center' }}>
                    <View style={{ height: 1 }} />
                    <FlatList
                        nestedScrollEnabled={true}
                        data={taskList}
                        renderItem={({ item, index }) => {
                            return (
                                renderRecentNews(item, index)
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


export default observer(BusinessActivity);