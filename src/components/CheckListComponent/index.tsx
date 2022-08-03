import React, { Component, useState, useRef, useEffect } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert
} from "react-native";
import TextComponent from "./../TextComponent";
// import PopoverTooltip from 'react-native-popover-tooltip';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu';
// import { fontFamily, fontColor } from '../../config/config';
import { RootStoreModel } from "./../../store/rootStore";
import useInject from "./../../hooks/useInject";
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
    onDescImageClick: (item: any, index: number) => void,
    isArabic: boolean,
    index: number,
    scrolltoQuetionNumber?: (index: any) => void,
    heightOfView?: (index: number) => void,
    selectedTaskType?: string,
    item: any
}

const CheckListComponent = (props: Props) => {
    const refrance = useRef(null);
    const [checkListBorderColor, setCheckListBorderColor] = useState('#abcfbf');
    const [touchableClick, setTouchableClick] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, bottomBarDraft } = useInject(mapStore)

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''

    return (
        <View
            style={{ width: '95%', alignSelf: 'center' }}//: props.item.parameter_weight_mobility == 1 ? '#e5f0eb'
        // ref={refrance}
        // onLayout={({ nativeEvent }) => {
        //     if (refrance.current) {
        //         refrance.current.measure((x, y, width, height, pageX, pageY) => {
        //             // props.heightOfView(pageY)
        //             if (props.item.Answers === '') {
        //                 props.scrolltoQuetionNumber(pageY);
        //             }
        //             //console.log(x, y, width, height, pageX, pageY);
        //         })
        //     }
        // }}
        >
            <View style={[{
                minHeight: props.item.parameter.length > 140 ? 200 : 140, height: 'auto', backgroundColor: props.item.color == 'orange' ? '#ffd7b2' : props.item.parameter_weight_mobility == 2 ? '#fff7b2' : 'transparent'
                , paddingHorizontal: 5, alignItems: 'center', width: '95%', alignSelf: 'center', borderBottomColor: checkListBorderColor, borderBottomWidth: props.item.Answers != '' ? 3 : 1, paddingBottom: 15
            }, props.item.Answers == 0 && typeof (props.item.Answers) != 'string' ? { borderColor: '#ffc0cb', borderBottomColor: '#ffc0cb', borderBottomWidth: 3, borderWidth: 3, borderRadius: 15 }
                : (props.item.Answers == 1 && props.item.parameter_type === 'EHS') ? { borderColor: '#8bc43f', borderBottomColor: '#8bc43f', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 }
                    : (props.item.Answers == 1 || props.item.Answers == 2 || props.item.Answers == 3) ? { borderColor: '#5C666F', borderBottomColor: '#5C666F', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 }
                        : props.item.Answers == 4 ? { borderColor: '#8bc43f', borderBottomColor: '#8bc43f', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 }
                            : (props.item.NAValue || props.item.NIValue) ? { borderColor: '#a2a467', borderBottomColor: '#a2a467', borderBottomWidth: 3, borderWidth: 3, borderRadius: 10 }
                                : {}]}>
                {/* <View style={[{ minHeight: 100, height: 'auto', paddingHorizontal: 5, alignItems: 'center', width: '100%', alignSelf: 'center', borderBottomColor: checkListBorderColor, borderBottomWidth: props.item.Answers != '' ? 3 : 1, paddingBottom: 15 }]}> */}
                <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>

                    <View style={{ flex: 1, width: '100%'}}>
                        <View style={{ flex: 9, justifyContent: 'center' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    Alert.alert("", props.isArabic ? props.item.parameter.replace(/&amp;/g, '&') + ' ( ' + (props.index + 1) : (props.index + 1) + ' ) ' + props.item.parameter.replace(/&amp;/g, '&'))
                                }}
                            >
                                <TextComponent
                                    textStyle={{ color: 'black', textAlign: props.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }}
                                    numberOfLines={5}
                                    label={props.isArabic ? props.item.parameter.replace(/&amp;/g, '&') + ' ( ' + (props.index + 1) : (props.index + 1) + ' ) ' + props.item.parameter.replace(/&amp;/g, '&')}
                                // label={ props.index + 1 + ') ' + props.item.parameter}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flex: 2, width: '100%', flexDirection: props.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>

                        {((taskType.toLowerCase() == "food poisoning") || (taskType.toLowerCase() == "food poison")) ?

                            <TouchableOpacity
                                disabled={props.item.scoreDisable || (myTasksDraft.isMyTaskClick == 'CompletedTask') ? true : false}
                                onPress={() => props.onDescImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}
                            >

                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/startInspection/Check.png")}
                                    style={{ height: '60%', width: '60%' }} />

                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                disabled={props.item.scoreDisable || (myTasksDraft.isMyTaskClick == 'CompletedTask') ? true : false}
                                onPress={() => props.onScoreImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                {
                                    props.item.Answers === ''
                                        ?
                                        <Image
                                            resizeMode="contain"
                                            source={require("./../../assets/images/startInspection/Icon.png")}
                                            style={{ height: '60%', width: '60%' }} />
                                        :
                                        <View style={{ height: '80%', width: '75%', justifyContent: 'center' }}>
                                            <Text
                                                style={{ color: '#5c666f', textAlign: 'center', padding: 1, fontSize: 13, fontWeight: 'normal', borderColor: (props.item.Answers == 0 && typeof (props.item.Answers) != 'string') ? '#ffc0cb' : '#8bc43f', borderWidth: 3, borderRadius: 40, paddingTop: 5 }}
                                                numberOfLines={1}>
                                                {props.item.Answers}
                                            </Text>
                                        </View>
                                }
                            </TouchableOpacity>
                        }

                        <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
                            <MenuTrigger onPress={() => { }} disabled={props.item.covidQuestion || props.item.naNiDisableForEHS || (myTasksDraft.isMyTaskClick == 'CompletedTask') ? true : false} style={styles.menuTrigger}>
                                <View
                                    style={{ width: 40, padding: 5, borderRadius: 15, backgroundColor: (props.item.NAValue || props.item.NIValue) ? '#a2a467' : '#5c666f', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <TextComponent
                                        textStyle={{ color: '#ffffff', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                        label={props.item.NAValue ? 'N/A' : props.item.NIValue ? 'NI' : ' - '}
                                    />
                                </View>
                            </MenuTrigger>
                            {
                                taskType.toLowerCase() == 'food-poision' ?
                                    <MenuOptions style={styles.menuOptions}>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onDashClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={' - '}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNAClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'N/A'}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNIClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'NI'}
                                            />
                                        </MenuOption>

                                    </MenuOptions>
                                    :
                                    <MenuOptions style={styles.menuOptions}>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onDashClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={' - '}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); setTouchableClick(false); props.onNAClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'N/A'}
                                            />
                                        </MenuOption>
                                        <MenuOption onSelect={() => { setTouchableClick(true); props.onNIClick(props.item, props.index) }}>
                                            <TextComponent
                                                textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 11, fontWeight: 'normal' }}
                                                label={'NI'}
                                            />
                                        </MenuOption>
                                    </MenuOptions>
                            }
                        </Menu>

                        {
                            ((taskType.toLowerCase() == "food poisoning") || (taskType.toLowerCase() == "food poison") ) ?//|| (taskType.toLowerCase() == 'complaints') //added as tester told
                                null
                                :
                                <TouchableOpacity
                                    onPress={() => props.onGraceImageClick(props.item, props.index)}
                                    style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}
                                    disabled={props.item.graceDisable}
                                >

                                    {
                                        props.item.grace == ''
                                            ?
                                            <Image
                                                resizeMode="contain"
                                                source={require("./../../assets/images/startInspection/Calender.png")}
                                                style={{ height: '60%', width: '60%' }} />
                                            :
                                            <View style={{ height: '80%', width: '75%', justifyContent: 'center' }}>
                                                <Text
                                                    style={{ color: '#5c666f', textAlign: 'center', padding: 1, fontSize: 13, fontWeight: 'normal', borderColor: (props.item.Answers == 0 && typeof (props.item.Answers) != 'string') ? '#8bc43f' : '#8bc43f', borderWidth: 3, borderRadius: 40, paddingTop: 5 }}
                                                    numberOfLines={1}>
                                                    {props.item.grace}
                                                </Text>
                                            </View>
                                    }
                                </TouchableOpacity>

                        }

                        <TouchableOpacity
                            onPress={() => props.onAttachmentImageClick(props.item, props.index)}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}
                        // disabled={props.item.covidQuestion}
                        >
                            <Image
                                resizeMode="contain"
                                source={(props.item.image1Uri || props.item.image2Uri) ? require("./../../assets/images/startInspection/Attachementgreen.png") : require("./../../assets/images/startInspection/Attachment.png")}
                                style={{ height: 24, width: 24 }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => props.onCommentImageClick(props.item, props.index)}
                            // disabled={props.item.covidQuestion}
                            style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                resizeMode="contain"
                                source={(props.item.comment == '' || props.item.comment == '-') ? require("./../../assets/images/startInspection/Notes.png") : require("./../../assets/images/startInspection/Notesgreen.png")}
                                style={{ height: 24, width: 24 }}
                            />
                        </TouchableOpacity>


                        {(taskType.toLowerCase() == "food poisoning" || taskType.toLowerCase() == 'food-poision' || taskType.toLowerCase() == 'complaints') ?

                            <TouchableOpacity
                                disabled={props.item.informationDisableForEHS}
                                onPress={() => props.onInfoImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require("./../../assets/images/startInspection/Description.png")}
                                    style={{ height: "60%", width: "60%" }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                disabled={props.item.informationDisableForEHS}
                                onPress={() => props.onInfoImageClick(props.item, props.index)}
                                style={[styles.circularView, { justifyContent: 'center', alignItems: 'center' }]}>
                                <Image
                                    source={require("./../../assets/images/startInspection/info.png")}
                                    style={{ height: "60%", width: "60%" }}
                                    resizeMode={'contain'}
                                />
                            </TouchableOpacity>

                        }
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
    container: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    menuOptions: {
        padding: 10,
    },
    menuTrigger: {

    }
});

export default CheckListComponent;