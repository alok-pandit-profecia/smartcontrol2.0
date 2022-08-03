
import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert, Dimensions
} from 'react-native';

import NavigationService from './../services/NavigationService';
import { observer } from 'mobx-react';
import { RootStoreModel } from "../store/rootStore";
import useInject from "../hooks/useInject";
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import TaskSchema from '../database/TaskSchema';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { Context } from '../utils/Context';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const BottomComponent = (props: any) => {

    const context = useContext(Context);
    const [taskList, setTaskList] = useState(Array());
    const mapStore = (rootStore: RootStoreModel) => ({ bottomBarDraft: rootStore.bottomBarModel, loginDraft: rootStore.loginModel, completedTaskDraft: rootStore.completdMyTaskModel, alertDraft: rootStore.foodAlertsModel, myTasksDraft: rootStore.myTasksModel })
    const { bottomBarDraft, alertDraft, completedTaskDraft, myTasksDraft, loginDraft } = useInject(mapStore)
    debugger
    let foodAlertResponse1 = alertDraft.alertResponse != '' ? JSON.parse(alertDraft.alertResponse) : [];

    useEffect(() => {

        try {
            let taskArray: any = [];
            debugger;
            completedTaskDraft.setState('pending')
            taskArray = RealmController.getTasks(realm, TaskSchema.name);
            let completedTaskArray = [];
            debugger;
    
            if (taskArray && taskArray['0']) {
                completedTaskArray = Object.values(taskArray)
                let dbFromTasks = Object.values(taskArray);
                // completedTaskArray = dbFromTasks.filter((i: any) => i.isCompleted == false);
                completedTaskArray = completedTaskArray.filter((i: any) => i.isCompleted == true);
                let _MS_PER_DAY = 1000 * 60 * 60 * 24;
    
                let deleteTaskArray =Array();
                let displayTaskArray =Array();
                function dateDiffInDays(a: any, b: any) {
                    // Discard the time and time-zone information.
                    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    
                    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
                }
    
                for (let index = 0; index < completedTaskArray.length; index++) {
                    const obj: any = completedTaskArray[index];
                    let date = new Date();
                    let date2 = obj.CompletionDate ? new Date(obj.CompletionDate) : new Date();
    
                    let diff = dateDiffInDays(date, date2);
    
                    if (diff < -29) {
                        deleteTaskArray.push(obj);
                    }
                    else{
                        displayTaskArray.push(obj);
                    }
                }
    
                // console.log('tempObj::'+JSON.stringify(completedTaskArray))
                for (let index = 0; index < deleteTaskArray.length; index++) {
                    const obj: any = deleteTaskArray[index];
                    RealmController.deleteTaskById(realm, obj.TaskId, () => {
    
                    })
                }
                // myTasksDraft.setIsCompletedOfflineList(JSON.stringify(completedTaskArray));
                completedTaskDraft.setCompletedTaskArray(JSON.stringify(displayTaskArray));
                setTaskList(completedTaskArray)
            }
            // else {
            //     let Arr = completedTaskDraft.completedTaskArray != '' ? JSON.parse(completedTaskDraft.completedTaskArray) : Array();
            //     setTaskList(Arr);
            // }
            completedTaskDraft.setState('done')
        } 
        catch (error) {
            
        }
       
    }, [completedTaskDraft.completedTaskArray]);

    return (
        <View style={{ flex: 1 }}>

            <View style={{ flex: 7, flexDirection: props.isArabic ? 'row-reverse' : 'row', width: '100%', alignSelf: 'center', borderTopColor: 'red', borderTopWidth: 1, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>

                <TouchableOpacity
                    onPress={() => {
                        bottomBarDraft.setDashboardClisk(true);
                        bottomBarDraft.setCategoryClisk(false);
                        bottomBarDraft.setCalenderClisk(false);
                        bottomBarDraft.setProfileClisk(false);
                        NavigationService.navigate('Dashboard');
                    }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    {/* <View style={{ flex: 0.1 }} /> */}
                    <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                            source={require('./../assets/images/bottom/Home.png')} />
                    </View>
                    <View style={{ flex: 0.6, width: '100%', justifyContent: 'flex-start' }}>
                        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.home}</Text>
                    </View>
                    {/* <View style={{ flex: 0.1 }} /> */}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        bottomBarDraft.setDashboardClisk(false);
                        bottomBarDraft.setCategoryClisk(true);
                        bottomBarDraft.setCalenderClisk(false);
                        bottomBarDraft.setProfileClisk(false);
                        alertDraft.setState('pending')
                        NavigationService.navigate('FoodAlerts');
                    }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                    {/* <View style={{ flex: 0.1 }} /> */}

                    <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, left: props.isArabic ? +8 : +32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red', zIndex: 10 }}>
                            <Text style={[{ color: 'white', fontSize: 8, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{foodAlertResponse1.length}</Text>
                        </View>
                        <Image style={{ marginRight: 12, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                            source={require('./../assets/images/bottom/foodAlerts.png')} />
                    </View>

                    <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.foodAlerts}</Text>
                    </View>

                    {/* <View style={{ flex: 0.1 }} /> */}

                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        bottomBarDraft.setDashboardClisk(false);
                        bottomBarDraft.setCategoryClisk(false);
                        bottomBarDraft.setCalenderClisk(false);
                        bottomBarDraft.setProfileClisk(true);
                        NavigationService.navigate('AboutDirections')
                    }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

                    <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                        <Image
                            source={require('./../assets/images/bottom/reminders.png')} />
                    </View>

                    <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.maps}</Text>
                    </View>

                    <View style={{ flex: 0.1 }} />

                </TouchableOpacity>

                {/* <TouchableOpacity
    onPress={() => {
        bottomBarDraft.setDashboardClisk(false);
        bottomBarDraft.setCategoryClisk(false);
        bottomBarDraft.setCalenderClisk(false);
        bottomBarDraft.setProfileClisk(true);
       // NavigationService.navigate('CondemnationForm')
    }}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

    <View style={{ flex: 0.1 }} />


    <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, right: -32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red' }}>
            <Text style={[{ color: 'white', fontSize: 8 }]}>{'2'}</Text>
        </View>
        <Image style={{ transform: [{ rotateY: '0deg' }] }}
            source={require('./../assets/images/bottom/reminders.png')} />
    </View>

    <View style={{ flex: 0.3, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#a7a7a9', }}>{Strings[context.isArabic ? 'ar' : 'en'].bottomText.reminders}</Text>
    </View>

    <View style={{ flex: 0.1 }} />

</TouchableOpacity>

*/}
                {/* <TouchableOpacity
    onPress={() => {
        bottomBarDraft.setDashboardClisk(false);
        bottomBarDraft.setCategoryClisk(false);
        bottomBarDraft.setCalenderClisk(false);
        bottomBarDraft.setProfileClisk(true);
        myTasksDraft.setIsMyTaskClick('CompletedTask');
        NavigationService.navigate('CompletedTask');
    }}
    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

    <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ height: WIDTH * 0.04, width: WIDTH * 0.04, left: props.isArabic ? +8 : +32, top: 0, justifyContent: 'center', alignItems: 'center', borderColor: 'gray', borderRadius: 50, borderWidth: 0.2, alignSelf: 'center', backgroundColor: 'red', zIndex: 10 }}>
            <Text style={[{ color: 'white', fontSize: 8, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{taskList.length}</Text>
        </View>
        <Image style={{ marginRight: 12, transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
            source={require('./../assets/images/bottom/completedTask.png')} />
    </View>
    <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.completedTasks}</Text>
    </View>

    <View style={{ flex: 0.1 }} />

</TouchableOpacity> */}

                <TouchableOpacity
                    onPress={() => {
                        bottomBarDraft.setDashboardClisk(false);
                        bottomBarDraft.setCategoryClisk(false);
                        bottomBarDraft.setCalenderClisk(true);
                        bottomBarDraft.setProfileClisk(false);
                        NavigationService.navigate('Settings')
                    }}
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                    {/* <View style={{ flex: 0.1 }} /> */}
                    <View style={{ flex: 0.5, flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ transform: [{ rotateY: props.isArabic ? '180deg' : '0deg' }] }}
                            source={require('./../assets/images/bottom/settings.png')} />
                    </View>
                    <View style={{ flex: 0.6, flexDirection: 'row', width: '100%', justifyContent: 'flex-start' }}>
                        <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'normal', width: '100%', textAlign: 'center', color: fontColor.TitleColor, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily }}>{Strings[props.isArabic ? 'ar' : 'en'].bottomText.settings}</Text>
                    </View>
                    {/* <View style={{ flex: 0.1 }} /> */}
                </TouchableOpacity>

            </View>

            {/* <View style={{ flex: 1,padding:2, backgroundColor:(loginDraft.isOnline||myTasksDraft.isOnline) ? "green":'red',justifyContent:'center',alignItems:'center' }}>
                <Text style={{ color:'white',textAlign:'center',fontSize:10 }}>{(loginDraft.isOnline||myTasksDraft.isOnline) ? "Online" : "Offline"}</Text>
            </View> */}

        </View>

    );

}

var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
});

export default observer(BottomComponent);