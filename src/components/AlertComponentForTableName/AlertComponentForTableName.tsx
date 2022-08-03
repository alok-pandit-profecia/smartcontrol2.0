import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    Modal,
    TextInput,
    FlatList,
    Alert
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import * as Animatable from 'react-native-animatable';
import TextInputWithLabelComponent from '../TextInputWithLabelComponent';
import TextComponent from '../TextComponent';
import { Context } from '../../utils/Context';
import { RootStoreModel } from './../../store/rootStore';
import useInject from "./../../hooks/useInject";
import Strings from '../../config/strings';
import { fontColor, fontFamily } from '../../config/config';
import ButtonComponent from '../ButtonComponent';

const AlertComponentForTableName = (props: any) => {

    let context = useContext(Context);

    useEffect(() => {

        if (props.comment && props.comment != '') {

            let searchTextArr = props.comment.split(',')
            let tableName = Array()
            if (searchTextArr.length) {
                for (let index = 0; index < searchTextArr.length; index++) {
                    const element = searchTextArr[index];
                    tableName.push(element)
                }
            }

            setTableNameList(tableName);
            setTableName('');
            // myTasksDraft.setTableNameList(JSON.stringify(tableNameList));
        }
    }, [])
    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, bottomBarDraft } = useInject(mapStore);

    // comment variable
    const [tableName, setTableName] = useState('');
    const [tableNameList, setTableNameList] = useState(Array());

    const updateTableName = (val: any) => {
        setTableName(val);
    }

    const cancelAlert = () => {
        props.closeAlert();
    }

    const renderTableName = (item: any, index: number) => {

        return (

            <View
                style={{ height: 50, width: 60, borderRadius: 6, backgroundColor: '#abcfbe', justifyContent: 'center', top: 8 }}>

                <TouchableOpacity
                    onPress={() => {
                        let tableNameListTemp = Array();
                        for (let indexTable = 0; indexTable < tableNameList.length; indexTable++) {
                            const element = tableNameList[indexTable];
                            console.log('tableNameList' + JSON.stringify(tableNameList));
                            if (element == item) {
                                // console.log('tableNameList.splice(indexTable,0, element);' + 'indexTable' + indexTable + "..." + JSON.stringify(tableNameList.splice(indexTable, 0)))
                                tableNameList.splice(tableNameList.indexOf(element), 1);
                                break;
                            }
                        }
                        setTableNameList(tableNameList);
                        myTasksDraft.setTableNameList(JSON.stringify(tableNameList));
                    }}
                    style={{ flex: 1, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Image
                        resizeMode="contain"
                        source={require("./../../assets/images/alert_images/close.png")}
                        style={{ height: 24, width: 24, top: 5, left: 5, alignSelf: 'flex-end' }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 3, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent
                        textStyle={{ color: 'white', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
                        label={item}
                    />
                </View>

            </View>
        )
    }


    return (

        <Modal
            visible={true}
            transparent={true}
        >
            <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, borderRadius: 20, alignItems: 'center', }}>

                <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 0.35, borderRadius: 20, zIndex: 999, position: 'absolute', top: HEIGHT * 0.30 }]}>

                    <View style={{ flex: 5, borderRadius: 20 }}>

                        <View style={{ height: HEIGHT * 0.06, backgroundColor: "#abcfbf", flexDirection: context.isArabic ? 'row-reverse' : 'row', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>

                            <View style={{ flex: 9, justifyContent: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                                <TextComponent
                                    textStyle={[styles.alerttext, { color: '#5c666f', fontStyle: 'italic', textAlign: context.isArabic ? 'right' : 'left', fontSize: 13, fontWeight: 'normal' }]}
                                    label={props.title}
                                />
                            </View>

                            <TouchableOpacity
                                onPress={cancelAlert}
                                style={{ flex: 1, justifyContent: 'center' }}>
                                <Image
                                    resizeMode="contain"
                                    source={require("./../../assets/images/alert_images/close.png")}
                                    style={{ height: '80%', width: '90%' }} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ height: 5 }} />
                        <View style={{ height: HEIGHT * 0.05, width: '90%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <TextInput
                                onChangeText={updateTableName}
                                value={tableName}
                                // showLabel={false}
                                placeholder={props.tableName}
                                placeholderTextColor={'#5c666f'}
                                multiline={true}
                                maxLength={1500}
                                numberOfLines={3}
                                style={{ width: '60%', height: '90%', color: '#5c666f', backgroundColor: '#fffffff', borderColor: '#c0c0c0', borderWidth: 1, borderRadius: 10, textAlign: context.isArabic ? 'right' : 'left' }}
                            />

                            <ButtonComponent
                                style={{
                                    height: '80%', width: '40%', backgroundColor: '#abcfbe',
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {

                                    if (tableName != '') {

                                        let searchTextArr = tableNameList.length ? tableNameList.filter((tableNameStr: string) => tableNameStr == tableName) : []
                                        // console.log('searchTextArr ::' + JSON.stringify(searchTextArr))
                                        if (searchTextArr.length <= 0) {
                                            tableNameList.push(tableName);
                                            // console.log('searchTextArr ::' + JSON.stringify(tableNameList))
                                        }
                                        else {
                                            Alert.alert('', 'Please Enter Unique Table Name');
                                        }

                                        setTableNameList(tableNameList);
                                        setTableName('');
                                        // myTasksDraft.setTableNameList(JSON.stringify(tableNameList));
                                    }
                                    else {
                                        Alert.alert('', 'Please Enter Text')
                                    }
                                    // NavigationService.navigate('ContactList')
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].startInspection.add)}
                            />

                        </View>

                        <View style={{ height: HEIGHT * 0.15, width: '100%', padding: 5, justifyContent: 'center' }}>

                            <FlatList
                                data={tableNameList}
                                horizontal={true}
                                initialNumToRender={5}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderTableName(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => (<View style={{ width: 10 }} />)}
                            />
                        </View>

                        <View style={{ height: 5 }} />
                        <View style={{ height: HEIGHT * 0.05, width: '90%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                            <View style={{ width: '60%', height: HEIGHT * 0.06 }} />

                            <ButtonComponent
                                style={{
                                    height: '100%', width: '40%', backgroundColor: '#abcfbe',
                                    borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
                                    textAlign: 'center'
                                }}
                                isArabic={context.isArabic}
                                buttonClick={() => {
                                    if (tableNameList.length) {
                                        let temp = ''
                                        for (let index = 0; index < tableNameList.length; index++) {
                                            const element = tableNameList[index];
                                            // console.log(":::" + element)
                                            if (index < (tableNameList.length - 1)) {
                                                temp = temp + (element + ',');
                                            }
                                            else {
                                                temp = temp + element
                                            }
                                        }
                                        // console.log("tempaaaaa::"+temp)
                                        props.updateCommentValue(temp)
                                        cancelAlert()
                                    }
                                    else {
                                        cancelAlert()
                                    }
                                    // NavigationService.navigate('ContactList')
                                }}
                                textstyle={{ textAlign: 'center', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                buttonText={(Strings[context.isArabic ? 'ar' : 'en'].LastRecord.done)}
                            />

                        </View>

                    </View>


                </Animatable.View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    circularView: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
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

export default AlertComponentForTableName;