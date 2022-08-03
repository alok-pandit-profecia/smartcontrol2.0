import React, { Component, useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    FlatList,
    ScrollView,
    Alert,
    Modal,
    PermissionsAndroid
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import { fontFamily, fontColor, checkListData } from '../config/config';
import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';
import { Context } from '../utils/Context';
import TextComponent from './../components/TextComponent';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './TextInputComponent';
import Strings from '../config/strings';
import useInject from "../hooks/useInject";
import { RootStoreModel } from '../store/rootStore';
import { writeFile, readFile, readFileAssets, DownloadDirectoryPath } from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

const AlertComponentForFoodAlert = (props: any) => {

    const context = useContext(Context);

    const [activeSections, setSection] = useState([0]);
    const [btnClick, setBtnClick] = useState({ yesClick: false, noClick: false });
    const [Sections, setSections] = useState(Array())
    const [Item, setItem] = useState(Object())
    const [visible, setVisible] = useState(false)
    const [attachmentVisible, setAttachmentVisible] = useState(false)

    const updateSections = (activeSections: any) => {
        setSection(activeSections.includes(undefined) ? [] : activeSections);
    };

    // const Sections = [{ alertNumber: 'Alert Number 1-67645545645' }, { alertNumber: 'Alert Number 1-67645545645' }, { alertNumber: 'Alert Number 1-67645545645' }]

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, foodalertDraft: rootStore.foodAlertsModel })
    const { myTasksDraft, foodalertDraft } = useInject(mapStore);

    useEffect(() => {

        let foodAlertArray = [];
        let foodAlertResponse1 = foodalertDraft.getAlertResponse() != '' ? JSON.parse(foodalertDraft.getAlertResponse()) : [];
        // console.log("foodAlertResponse1", JSON.stringify(foodAlertResponse1));
        for (let index = 0; index < foodAlertResponse1.length; index++) {
            let element = foodAlertResponse1[index]
            let obj = {
                AlertNumber: element.AlertNumber,
                SourceAlertNumber: element.SourceAlertNumber,
                AssignedTo: element.AssignedTo,
                Summary: element.Summary,
                Comments: element.Comments,
                Description: element.Description,
                ToDate: element.ToDate,
                CloseDate: element.CloseDate,
                Secure: element.Secure,
                SourceType: element.SourceType,
                StartDate: element.StartDate,
                Status: element.Status,
                Type: element.Type,
                Condemnation: element.Condemnation,
                Detention: element.Detention,
                Sampling: element.Sampling,
                ProductList: element.ProductList,
                Attachments: element.AttachmentList && element.AttachmentList.AlertAttachment ? element.AttachmentList.AlertAttachment : []

            }
            foodAlertArray.push(obj);
        }
        setSections(foodAlertArray);

    }, [])

    const cancelAlert = () => {
        props.closeAlert();
    }

    const renderContent = (item: any) => {

        return (

            <View style={{ minHeight: HEIGHT * 0.3, height: 'auto', borderColor: '#abcfbf', borderWidth: 0.6, width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 8 }}>

                <View style={{ height: HEIGHT * 0.05, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].myTask.type)} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.textInputContainer}>
                        <TextInputComponent
                            placeholder={''}
                            style={{
                                height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            onChange={(val) => { }}
                            editable={false}
                            value={item.Type}

                        />
                    </View>

                </View>

                <View style={{ height: HEIGHT * 0.05, flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.toDate)} </Text>
                    </View>

                    <View style={styles.space} />

                    <View style={styles.textInputContainer}>
                        <TextInputComponent
                            placeholder={''}
                            style={{
                                height: '70%', textAlign: context.isArabic ? 'center' : 'center', alignSelf: 'center', width: '100%', color: fontColor.TextBoxTitleColor,
                                fontSize: 12, fontFamily: fontFamily.textFontFamily, padding: 4, borderRadius: 6, backgroundColor: fontColor.TextInputBoxColor
                            }}
                            onChange={(val) => { }}
                            editable={false}
                            value={item.ToDate}

                        />
                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ height: HEIGHT * 0.07 }}>

                    <View style={styles.textContainer}>
                        <Text style={{ color: fontColor.TitleColor, fontSize: 12, textAlign: context.isArabic ? 'right' : 'left', fontWeight: 'bold', fontFamily: fontFamily.textFontFamily }}>{(Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.currentEstablishments)} </Text>
                    </View>

                    <View style={{ flex: 0.2 }} />

                    <View style={[styles.textInputContainer, { flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }]}>

                        <ButtonComponent
                            style={{
                                height: '100%', width: '35%', backgroundColor: '#abcfbe',
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            buttonClick={() => {
                                setBtnClick(prevState => {
                                    return { ...prevState, yesClick: true, noClick: false }
                                });
                                // props.okAlert()
                                // console.log(JSON.stringify(item))
                                myTasksDraft.setAlertObject(JSON.stringify(item))
                                myTasksDraft.setIsAlertApplicableToCurrentEst(true)
                            }}
                            golive={btnClick.yesClick}
                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.yes)}
                        />

                        <View style={{ flex: 0.05 }} />

                        <ButtonComponent
                            style={{
                                height: '100%', width: '35%', backgroundColor: '#abcfbe',
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            buttonClick={() => {
                                setBtnClick(prevState => {
                                    return { ...prevState, yesClick: false, noClick: true }
                                });
                                // props.closeAlert()
                                myTasksDraft.setIsAlertApplicableToCurrentEst(false)
                            }}
                            golive={btnClick.noClick}
                            isArabic={context.isArabic}
                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].closureInspection.no)}
                        />
                    </View>

                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 0.03, backgroundColor: '#abcfbf', width: '95%', alignSelf: 'center' }} />

                <View style={{ flex: 0.05 }} />

                <View style={{ height: HEIGHT * 0.07, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>

                    <TouchableOpacity
                        onPress={() => {
                            // console.log('item ::' + JSON.stringify(item))
                            setItem(item);
                            setVisible(true);
                        }}
                        style={{
                            flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                            width: '100%', borderColor: 'transparent'
                        }}>

                        <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                            <Image style={{ height: 24, width: 24, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={'contain'}
                                source={require('./../assets/images/foodAlert/Info.png')} />
                        </View>


                        <View style={{ flex: 0.5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.productInfo}</Text>
                        </View>

                    </TouchableOpacity>

                    <View style={{ flex: 0.3 }} />

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert("", item.Comments)
                        }}
                        style={{
                            flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                            width: '100%', borderColor: 'transparent'
                        }}>

                        <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                            <Image style={{ height: 24, width: 24, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={'contain'}
                                source={require('./../assets/images/foodAlert/Comment.png')} />
                        </View>


                        <View style={{ flex: 0.5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.comments}</Text>
                        </View>

                    </TouchableOpacity>

                    <View style={{ flex: 0.3 }} />

                    <TouchableOpacity
                        onPress={() => {
                            setItem(item);
                            setAttachmentVisible(true);
                            // console.log('attachments :::' + JSON.stringify(item.A))
                        }}
                        style={{
                            flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                            width: '100%', borderColor: 'transparent'
                        }}>

                        <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                            <Image style={{ height: 24, width: 24, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }}
                                resizeMode={'contain'}
                                source={require('./../assets/images/foodAlert/Attachments.png')} />
                        </View>


                        <View style={{ flex: 0.5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.attachment}</Text>
                        </View>

                    </TouchableOpacity>

                </View>

                <View style={{ flex: 0.05 }} />

                <View style={{ flex: 0.03, backgroundColor: '#abcfbf', width: '95%', alignSelf: 'center' }} />

            </View >


        );
    }

    const renderAccordionHeader = (content: any, index: any, isActive: any) => {

        return (

            <View style={{ minHeight: HEIGHT * 0.01, height: 'auto', backgroundColor: '#abcfbf', flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 22 }}>
                <View style={{ flex: 8.4, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 12, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                        label={content.AlertNumber}
                    />

                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center', height: 25, }}>

                    {
                        isActive ? <Image
                            source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                            style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '90deg' }] : [{ rotate: '90deg' }] }}
                            resizeMode={'contain'}
                        />
                            :
                            <Image
                                source={require("./../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: context.isArabic ? [{ rotate: '-180deg' }] : [{ rotate: '0deg' }] }}
                                resizeMode={'contain'}
                            />
                    }

                </View>

            </View>
        );
    };

    const renderScoreData = (item: any, index: number) => {
        // alert('item' + JSON.stringify(item));
        return (
            <View
                style={{ flex: 0.7, minHeight: HEIGHT * 0.07, width: '95%', alignSelf: 'center', borderRadius: 15, padding: 10, borderWidth: 1, borderColor: '#5c666f' }}>
                <View style={{ flex: 1 }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', fontSize: 13, fontWeight: 'normal' }}
                        label={(context.isArabic ? "" : ((index + 1) + ") ") )+ (Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.productName +":"+ item.ProductName )+(context.isArabic ?  "("+(index + 1)  :"")}//(index + 1) + ") " + "Product Name :" + item.ProductName
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', fontSize: 13, fontWeight: 'normal' }}
                        label={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.batchNumber +":"+ (item.Batch ? item.Batch : "")}
                    />
                </View>
                <View style={{ flex: 1, }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', fontSize: 13, fontWeight: 'normal',textAlign:context.isArabic ? 'right':'left' }}
                        label={Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.actiontaken + (Item.Sampling == "Y" ? "Sampling" : "") + " " + (Item.Condemnation == "Y" ? "Condemnation" : "") + " " + (Item.Detention == "Y" ? "Detention" : "")}
                    />
                </View>
            </View>
        );
    }


    const renderAttachmentData = (item: any, index: number) => {

        // console.log('item renderAttachmentData :::::::::' + JSON.stringify(item));
        return (
            <View
                style={{ flex: 0.7, minHeight: HEIGHT * 0.07, width: '95%', alignSelf: 'center' }}>

                <TouchableOpacity
                    onPress={async () => {

                        try {
                            const granted = await PermissionsAndroid.requestMultiple(
                                [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                                ]
                            ).then(async (result) => {
                                console.log('FILE Open!' + JSON.stringify(result));

                                if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
                                    && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {

                                    var path = DownloadDirectoryPath + '/' + myTasksDraft.taskId + item.FileName + '.' + item.FileType;
                                    console.log('FILE path!' + path);

                                    writeFile(path, item.FileBuffer, 'base64')
                                        .then((success) => {
                                            console.log('FILE WRITTEN!');
                                            FileViewer.open(path)
                                                .then(() => {
                                                    console.log('FILE Open!');
                                                    // self.state = 'done';

                                                    // success
                                                })
                                                .catch(error => {
                                                    console.log('FILE Open failed!::' + error);
                                                    // error
                                                    // self.state = 'done';

                                                });
                                        })
                                        .catch((err) => {
                                            console.log(err.message);
                                            // self.state = 'done';

                                        });
                                    // myTasksDraft.callToGetInspectionReport();

                                }
                                else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
                                    || result['android.permission.READ_EXTERNAL_STORAGE']
                                    === 'denied') {
                                    debugger;

                                }
                                else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again'
                                    || result['android.permission.READ_EXTERNAL_STORAGE']
                                    === 'never_ask_again') {
                                    debugger;
                                }

                            })
                        } catch (err) {
                            console.warn(err);
                        }
                    }}
                    style={{ flex: 1 }}>

                    <TextComponent
                        textStyle={{ color: '#5c666f', fontSize: 13, fontWeight: 'normal' }}
                        label={(index + 1) + ") " + "File Name  :   " + item.FileName + '.' + item.FileType}
                    // label={"File Name:"}
                    />
                </TouchableOpacity>
                <View />

            </View >
        );
    }

    return (

        <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, alignItems: 'center', position: 'absolute', ...StyleSheet.absoluteFillObject }}>

            <Modal
                visible={visible}
                transparent={true}
            >
                <TouchableOpacity onPress={() => setVisible(false)} style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', }}>

                    <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: props.showCommentInput ? HEIGHT * 0.23 : HEIGHT * 0.50 }]}>

                        <View style={{ height: HEIGHT * 0.05, width: '100%', justifyContent: 'center', backgroundColor: '#abcfbf', borderTopStartRadius: 6, borderTopRightRadius: 6 }}>

                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <TextComponent
                                    textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                                    label={Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlerts}
                                />
                            </View>

                        </View>

                        <View style={{ height: HEIGHT * 0.02 }} />

                        <FlatList
                            data={(Item.ProductList && Item.ProductList.ProductAlert) ? Item.ProductList.ProductAlert : []}
                            ItemSeparatorComponent={() => {
                                return (<View style={{ height: 1, backgroundColor: '#5c666f' }} />);
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    renderScoreData(item, index)
                                )
                            }}
                            ListEmptyComponent={() => <TextComponent
                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                                label={"No Data"}
                            />}
                        />
                    </Animatable.View>

                </TouchableOpacity>

            </Modal>


            <Modal
                visible={attachmentVisible}
                transparent={true}
            >
                <TouchableOpacity onPress={() => {
                    // console.log('item :: ' + JSON.stringify(Item.Attachments[0]))
                    setAttachmentVisible(false)
                }}
                    style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', }}>

                    <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: props.showCommentInput ? HEIGHT * 0.23 : HEIGHT * 0.50 }]}>

                        <View style={{ height: HEIGHT * 0.05, width: '100%', justifyContent: 'center', backgroundColor: '#abcfbf', borderTopStartRadius: 6, borderTopRightRadius: 6 }}>

                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <TextComponent
                                    textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                                    label={Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlerts}
                                />
                            </View>

                        </View>

                        <View style={{ height: HEIGHT * 0.02 }} />

                        <FlatList
                            data={Item.Attachments && Item.Attachments.length ? Item.Attachments : []}
                            ItemSeparatorComponent={() => {
                                return (<View style={{ height: 1, backgroundColor: '#5c666f' }} />);
                            }}
                            renderItem={({ item, index }) => {
                                return (
                                    renderAttachmentData(item, index)
                                )
                            }}
                            ListEmptyComponent={() => <TextComponent
                                textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                                label={"No Data"}
                            />}
                        />
                    </Animatable.View>

                </TouchableOpacity>

            </Modal>


            <Animatable.View animation='zoomIn' style={[styles.textModal, { height: props.showCommentInput ? HEIGHT * 0.23 : HEIGHT * 0.50 }]}>

                <View style={{ height: HEIGHT * 0.05, width: '100%', justifyContent: 'center', backgroundColor: '#abcfbf', borderTopStartRadius: 6, borderTopRightRadius: 6 }}>

                    <View style={{ flex: 9, justifyContent: 'center' }}>
                        <TextComponent
                            textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 14, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                            label={Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.foodAlerts}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={cancelAlert}
                        style={{ flex: 1, justifyContent: 'center' }}>
                        <Image
                            resizeMode="contain"
                            source={require("./../assets/images/alert_images/close.png")}
                            style={{ height: '80%', width: '80%' }} />
                    </TouchableOpacity>

                </View>

                <View style={{ height: HEIGHT * 0.02 }} />

                <ScrollView>

                    <Accordion
                        sections={Sections}
                        activeSections={activeSections}
                        renderHeader={renderAccordionHeader}
                        renderContent={renderContent}
                        touchableComponent={TouchableOpacity}
                        onChange={updateSections}

                    />

                </ScrollView>

                <View style={{ height: HEIGHT * 0.05, width: '100%', justifyContent: 'center', borderTopStartRadius: 6, borderTopRightRadius: 6 }}>

                    <View style={[styles.textInputContainer, { flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row' }]}>

                        <ButtonComponent
                            style={{
                                height: '100%', width: '35%', backgroundColor: '#8dc43e',
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            isArabic={context.isArabic}
                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].LastRecord.done)}
                            buttonClick={() => {
                                if (!btnClick.yesClick && !btnClick.noClick) {
                                    Alert.alert('Please Answer All Food Alerts')
                                }
                                else {
                                    props.showAlertComponentForFoodAlertSCD(true)
                                }
                            }}
                        />

                        <View style={{ flex: 0.05 }} />

                        <ButtonComponent
                            style={{
                                height: '100%', width: '35%', backgroundColor: '#f6565a',
                                borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                textAlign: 'center'
                            }}
                            buttonClick={() => {
                                // if (!btnClick.yesClick && !btnClick.noClick) {
                                //     Alert.alert('Please Answer All Food Alerts')
                                // }
                                // else {
                                myTasksDraft.setIsAlertApplicableNoToCurrentEst(true)
                                myTasksDraft.setIsAlertApplicableToCurrentEst(false)
                                props.showAlertComponentForFoodAlertSCD(false)
                                // }
                            }}
                            isArabic={context.isArabic}
                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].foodAlert.sayNoToAll)}
                        />

                    </View>

                </View>

                <View style={{ height: HEIGHT * 0.02 }} />

            </Animatable.View>

        </View>
    );
}

const styles = StyleSheet.create({

    textContainer: {
        flex: 0.4,
        justifyContent: 'center'
    },
    space: {
        flex: 0.0,
    },
    textInputContainer: {
        flex: 0.6,
        justifyContent: "center"
    },
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
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    }
});

export default AlertComponentForFoodAlert;