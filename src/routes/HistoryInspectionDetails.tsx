import React, { useContext, useRef, useEffect, useState } from 'react';
import { Image, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions } from "react-native";
import Header from './../components/Header';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import Dropdown from '../components/dropdown';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import NavigationService from '../services/NavigationService';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;


const HistoryInspectionDetails = (props: any) => {

    const context = useContext(Context);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, adhocTaskEstablishmentDetailsDraft: rootStore.adhocTaskEstablishmentDetailsModel })
    const { myTasksDraft, adhocTaskEstablishmentDetailsDraft } = useInject(mapStore)

    const [inspectionDetails, setInspectionDetails] = useState(Object());


    useEffect(() => {
        const inspectionDetailsTemp = props.route && props.route.params && props.route.params.HistoryInspectionDetails ? props.route.params.HistoryInspectionDetails : {};
        setInspectionDetails(inspectionDetailsTemp);

        let taskType = inspectionDetailsTemp.InspectionType ? inspectionDetailsTemp.InspectionType : '';
        if (taskType.toLowerCase() == 'follow-up') {
            myTasksDraft.callToGetQuestionaries(context.isArabic ? 'ARA' : 'ENU', inspectionDetailsTemp.InspectionNumber);
        }
        else if (taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'temporary routine inspection' || taskType.toLowerCase() == 'direct inspection') {
            myTasksDraft.callToGetQuestionariesForHistorysearchRoutinetype(context.isArabic ? 'ARA' : 'ENU', inspectionDetailsTemp.InspectionNumber);
        }


    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}>

                        <View style={{ flex: 1.2 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 16, fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].history.history)}</Text>
                        </View>
                        <View style={{ flex: 1.2 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 18, borderColor: '#abcfbf' }}>
                    <Text style={{ color: '#5C666F', fontSize: 13, fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{context.isArabic ? adhocTaskEstablishmentDetailsDraft.getarabicEstablishmentName() : adhocTaskEstablishmentDetailsDraft.getEstablishmentName()}</Text>
                </View>
                <View style={{ flex: 0.2 }} />
                <View style={{ flex: 0.4, flexDirection: 'row', width: '80%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', borderRadius: 18, backgroundColor: '#c4ddd2' }}>
                    <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].inspectionDetails.inspectionDetails)} </Text>
                </View>
                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 5.4, width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.inspectionNumber)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={inspectionDetails.InspectionNumber}
                                onChange={(val) => { }}
                                editable={false}
                            />

                        </View>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.taskType)} </Text>
                        </View>
                        <View style={styles.space} />
                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={inspectionDetails.InspectionType}
                                onChange={(val) => { }}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.creationDate)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={inspectionDetails.CreationDate}
                                onChange={(val) => { }}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.completionDate)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={(inspectionDetails.Status && (inspectionDetails.Status.toString().toLowerCase() == 'scheduled' || inspectionDetails.Status.toString().toLowerCase() == 'acknowledged' || inspectionDetails.Status.toString().toLowerCase() == 'rescheduled')) ? inspectionDetails.CompletionDate : inspectionDetails.ActualInspectionDate}
                                onChange={(val) => { }}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.status)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                value={inspectionDetails.Status}
                                onChange={(val) => { }}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.businessActivity)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                onChange={(val) => { }}
                                value={inspectionDetails.BusinessActivity}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.grade)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                onChange={(val) => { }}
                                value={inspectionDetails.Grade}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.description)} </Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                onChange={(val) => { }}
                                value={inspectionDetails.Description}
                                editable={false}
                            />
                        </View>

                    </View>

                    <View style={{ flex: 0.2, }} />

                    <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                        <View style={styles.textContainer}>
                            <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.priority)}</Text>
                        </View>

                        <View style={styles.space} />

                        <View style={styles.TextInputContainer}>
                            <TextInputComponent
                                placeholder={''}
                                style={{
                                    height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                    fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                                }}
                                onChange={(val) => { }}
                                value={inspectionDetails.Priority}
                                editable={false}
                            />
                        </View>

                    </View>

                </View>

                <View style={{ flex: 0.2 }} />


                <View style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', width: '80%', alignSelf: 'center' }}>

                    <View style={{ flex: 1.2 }} />
                    <ButtonComponent
                        style={{ height: '55%', width: '35%', backgroundColor: fontColor.ButtonBoxColor, borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
                        buttonClick={() => {
                            myTasksDraft.setTaskId(inspectionDetails.InspectionNumber);
                            let obj = {
                                TaskType: inspectionDetails.InspectionType,
                                TaskId: inspectionDetails.InspectionNumber,
                                Description: inspectionDetails.Description,
                                BusinessActivity: inspectionDetails.BusinessActivity,
                                TaskStatus: inspectionDetails.Status,
                                CompletionDate: inspectionDetails.CompletionDate
                            }
                            myTasksDraft.setSelectedTask(JSON.stringify(obj));
                            myTasksDraft.setIsMyTaskClick("CompletedTask");
                            // myTasksDraft.callToGetQuestionaries(context.isArabic ? 'AR' : 'ENU', inspectionDetails.InspectionNumber);
                            if (inspectionDetails.InspectionType.toLowerCase() == 'routine inspection' || inspectionDetails.InspectionType.toLowerCase() == 'follow-up' || inspectionDetails.InspectionType.toLowerCase() == 'temporary routine inspection' || inspectionDetails.InspectionType.toLowerCase() == 'direct inspection') {
                                myTasksDraft.setHistoryChecklist(true);
                                NavigationService.navigate('StartInspection');
                            }
                        }}
                        textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                        buttonText={Strings[context.isArabic ? 'ar' : 'en'].historyInspectionDetails.viewChecklist}
                    />

                    <View style={{ flex: 1.2 }} />
                </View>

                <View style={{ flex: 0.5 }} />
                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>
        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },
    space: {
        flex: 0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center",
    },
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
});

export default observer(HistoryInspectionDetails);


