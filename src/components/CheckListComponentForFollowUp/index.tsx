import React, { Component, useState, useRef } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import TextComponent from "../TextComponent";
// import FollowUpComponent from '../FollowUpComponent';
// import PopoverTooltip from 'react-native-popover-tooltip';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
    withMenuContext,
} from 'react-native-popup-menu';
import { fontFamily, fontColor } from '../../config/config';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
const { Popover } = renderers
interface Props {
    onDashClick: (item: any, index: number) => void,
    onNAClick: (item: any, index: number) => void,
    onNIClick: (item: any, index: number) => void,
    onScoreImageClick: (item: any, index: number) => void,
    onGraceImageClick: (item: any, index: number) => void,
    onCommentImageClick: (item: any, index: number) => void,
    onAttachmentImageClick: (item: any, index: number) => void,
    onRegulationClick: (item: any, index: number) => void,
    onInfoImageClick: (item: any, index: number) => void,
    isArabic: boolean,
    index: number,
    item: any,
    currentGrace: boolean,
    currentScore: boolean
}

const CheckListComponentForFollowUp = (props: Props) => {
    const refrance = useRef(null);
    const [a, seta] = useState('');
    const [checkListBorderColor, setCheckListBorderColor] = useState('#abcfbf');
    const [touchableClick, setTouchableClick] = useState(false);
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, bottomBarDraft } = useInject(mapStore)

    return (

        <View
            style={{ width: '95%', alignSelf: 'center' }}
        >
            <View style={[{
                backgroundColor: props.item.Weightage == 2 ? '#fff7b2' : 'transparent',
                minHeight: (props.item.QuestionNameArabic && (props.item.QuestionNameArabic.length > 140) ? 200 : 140), height: 'auto', borderRadius: 10
                , paddingHorizontal: 5, alignItems: 'center', width: '95%', alignSelf: 'center', borderBottomColor: checkListBorderColor, borderBottomWidth: props.item.score != '' ? 3 : 1, paddingBottom: 15
            },
            props.item.score === '0' ? { borderColor: '#ffc0cb', borderBottomColor: '#ffc0cb', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 } :
                props.item.score == '4' ? { borderColor: '#8bc43f', borderBottomColor: '#8bc43f', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 } :
                    (props.item.score == '1' || props.item.score == '2' || props.item.score == '3') ? { borderColor: '#5C666F', borderBottomColor: '#5C666F', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 } :
                        (props.item.NI === true) ? { borderColor: '#a2a467', borderBottomColor: '#a2a467', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 } : {}]}>

                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                    <View style={{ flex: 1, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row' }}>
                        <View style={{ flex: 9, justifyContent: 'center' }}>

                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("", props.item.covidQuestion ? ((props.isArabic ? "" : ((props.index + 1) + ")")) + props.item.parameter.replace(/&amp;/g, '&') + (props.isArabic ? ' ( ' + (props.index + 1) : "")) : props.isArabic ? (props.item.DescriptionArabic ? props.item.DescriptionArabic.replace(/&amp;/g, '&') : props.item.DescriptionEnglish ? props.item.DescriptionEnglish.replace(/&amp;/g, '&') : '') + ' ( ' + (props.index + 1) : (props.index + 1) + ' ) ' + (props.item.DescriptionEnglish ? props.item.DescriptionEnglish.replace(/&amp;/g, '&') : ""))
                                }}
                            >
                                <TextComponent
                                    textStyle={{ color: 'black', textAlign: props.item.covidQuestion ? 'right' : props.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }}
                                    numberOfLines={5}
                                    label={props.item.covidQuestion ? ((props.isArabic ? "" : ((props.index + 1) + ")")) + props.item.parameter.replace(/&amp;/g, '&') + (props.isArabic ? ' ( ' + (props.index + 1) : "")) : props.isArabic ? (props.item.DescriptionArabic ? props.item.DescriptionArabic.replace(/&amp;/g, '&') : props.item.DescriptionEnglish ? props.item.DescriptionEnglish.replace(/&amp;/g, '&') : '') + ' ( ' + (props.index + 1) : (props.index + 1) + ' ) ' + (props.item.DescriptionEnglish ? props.item.DescriptionEnglish.replace(/&amp;/g, '&') : "")}

                                />
                            </TouchableOpacity>

                        </View>

                    </View>

                    <View style={{ flex: 2, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                        <TouchableOpacity
                            disabled={(myTasksDraft.isMyTaskClick == 'CompletedTask') || props.item.scoreDisable}
                            //  disabled={props.item.scoreDisable}
                            onPress={() =>
                                props.onScoreImageClick(props.item, props.index)
                            }
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]}>

                            {props.item.isScore ?
                                <View style={{ height: '80%', width: '75%', justifyContent: 'center' }}>

                                    <Text
                                        style={{ color: '#5c666f', textAlign: 'center', padding: 1, fontSize: 13, fontWeight: 'normal', borderWidth: 3, borderRadius: 30, paddingTop: 5, borderColor: props.item.score == "4" ? "#8bc43f" : props.item.score == "0" ? "#ffc0cb" : "#8bc43f" }}
                                        numberOfLines={1}>
                                        {props.item.NI ? '-' : props.item.score}
                                    </Text>
                                </View>
                                :
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/startInspection/Icon.png")}
                                    style={{ height: '60%', width: '60%' }} />
                            }
                        </TouchableOpacity>

                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>

                            <MenuTrigger onPress={() => { }} disabled={props.item.covidQuestion || (myTasksDraft.isMyTaskClick == 'CompletedTask') || (props.item.ParameterNumber == '3(1/3)') || (props.item.ParameterNumber == '3(2/3)') || (props.item.ParameterNumber == '4(4)') || (props.item.ParameterNumber == '6(1/6)')
                                || (props.item.ParameterNumber == '6(2/6)') || (props.item.ParameterNumber == '6(4/6)') || (props.item.ParameterNumber == '6(5/6)') || (props.item.ParameterNumber == '6(6/6)') || (props.item.ParameterNumber == '6(7/6)')
                                || (props.item.ParameterNumber == '6(8/6)') || (props.item.ParameterNumber == '11(3/11)') || props.item.naNiDisableForEHS} style={styles.menuTrigger}>
                                <View
                                    style={{ width: 40, padding: 5, borderRadius: 15, backgroundColor: '#5c666f', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <TextComponent
                                        textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={(props.item.NI == true) || (props.item.NI == 'Y') ? 'NI' : ' - '}
                                    />

                                </View>
                            </MenuTrigger>

                            <MenuOptions style={styles.menuOptions}>

                                <MenuOption onSelect={() => {
                                    setTouchableClick(false);
                                    props.onDashClick(props.item, props.index)
                                }}>
                                    <TextComponent
                                        textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={'-'}
                                    />
                                </MenuOption>

                                <MenuOption onSelect={() => { setTouchableClick(false); props.onNIClick(props.item, props.index) }}>
                                    <TextComponent
                                        textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={'NI'}
                                    />
                                </MenuOption>

                            </MenuOptions>

                        </Menu>


                        <TouchableOpacity
                            // disabled={props.item.covidQuestion}
                            onPress={() => props.onGraceImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>

                            {props.item.GracePeriod >= 0  ?
                                <View style={{ height: '80%', width: '75%', justifyContent: 'center' }}>
                                    <Text
                                        style={{ color: '#5c666f', textAlign: 'center', padding: 1, fontSize: 13, fontWeight: 'normal', borderWidth: 3, borderRadius: 30, paddingTop: 5, borderColor: props.item.score == "4" ? "#8bc43f" : props.item.score == "0" ? "#ffc0cb" : "#8bc43f" }}
                                        numberOfLines={1}>
                                        {props.item.NI ? props.item.GracePeriod : props.item.GracePeriod}
                                    </Text>
                                </View>
                                :
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/startInspection/Calender.png")}
                                    style={{ height: '60%', width: '60%' }} />
                            }

                        </TouchableOpacity>
                        <TouchableOpacity
                            // disabled={props.item.covidQuestion}
                            onPress={() => props.onAttachmentImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                resizeMode="contain"
                                source={(props.item.image1Uri || props.item.image2Uri) ? require("./../../assets/images/startInspection/Attachementgreen.png") : require("./../../assets/images/startInspection/Attachment.png")}
                                style={{ height: '60%', width: '60%' }} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            // disabled={props.item.covidQuestion}
                            onPress={() => props.onCommentImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                resizeMode="contain"
                                source={(props.item.Comments == '' || props.item.Comments == '-') ? require("./../../assets/images/startInspection/Notes.png") : require("./../../assets/images/startInspection/Notesgreen.png")}
                                style={{ height: '60%', width: '60%' }}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => props.onInfoImageClick(props.item, props.index)}

                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                source={require("./../../assets/images/startInspection/info.png")}
                                style={{ height: "60%", width: "60%" }}
                                resizeMode={'contain'}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
            <View style={{ height: 8 }} />
        </View >
    );
}

const styles = StyleSheet.create({
    imageStyle: {
        height: '100%',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 1.5,
        marginBottom: '2%'
    },
    circularView: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {
        padding: 10,
    }
});

export default CheckListComponentForFollowUp;