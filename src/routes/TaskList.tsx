import React, { useContext, useState, useEffect } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, ScrollView, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput, StyleSheet } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../services/NavigationService';
import KeyValueComponent from './../components/KeyValueComponent';
import BottomComponent from './../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import { RootStoreModel } from '../store/rootStore';
import Strings from '../config/strings';
import useInject from "../hooks/useInject";
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { fontFamily, fontColor } from '../config/config';
import SearchComponent from '../components/SearchComponent';
import Header from './../components/Header';

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const TEXT_LENGTH = 24
const TEXT_HEIGHT = 8
const OFFSET = TEXT_LENGTH / 2 - TEXT_HEIGHT / 2

const TaskList = (props: any) => {

    const context = useContext(Context);
    const [seacrhArray, setSeacrhArray] = useState(Array());
    const [documentArray, setDocumentArray] = useState(Array());
    const [scheduledArray, setScheduledArray] = useState(Array());
    const [adhocArray, setAdhocArray] = useState(Array());

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel, adhocTaskEstablishmentDraft: rootStore.adhocTaskEstablishmentModel, adhocTaskEstablishmentDetailsDraft: rootStore.adhocTaskEstablishmentDetailsModel })
    const { myTasksDraft, adhocTaskEstablishmentDetailsDraft, adhocTaskEstablishmentDraft, establishmentDraft } = useInject(mapStore);

    const mapStoreLogin = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel })
    const { loginDraft } = useInject(mapStoreLogin);

    const [searchText, setSearchText] = useState('');

    const documentArr = [
        // {
        //     title: Strings[context.isArabic ? 'ar' : 'en'].taskList.document,
        //     image: require("./../assets/images/taskList/documents.png"),
        //     code: 'aboutSearch',navigationScreenName: 'AboutSearchDocument'
        // }, {
        //     title: Strings[context.isArabic ? 'ar' : 'en'].taskList.staff,
        //     image: require("./../assets/images/taskList/staff.png"),
        //     code: 'aboutStaff',navigationScreenName: 'AboutStaff'
        // }, {
        //     title: Strings[context.isArabic ? 'ar' : 'en'].taskList.lastReport,
        //     image: require("./../assets/images/taskList/lastReport.png"),
        //     //code:'aboutLastReport',navigationScreenName=''
        // }, 
        {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.history,
            image: require("./../assets/images/taskList/history.png"),
            code: 'aboutHistory', navigationScreenName: 'AdhocEstablishmentAndVehical'

        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.directions,
            image: require("./../assets/images/taskList/directions.png"),
            code: 'aboutDirections', navigationScreenName: 'AboutDirections'
        }, {

        }
    ]

    const scheduledArr = [
        {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.routineInspection,
            image: require("./../assets/images/taskList/routineInspection.png"),
            code: 'routlineInspection', navigationScreenName: 'MyTasks'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.followUp,
            image: require("./../assets/images/taskList/followUp.png"),
            code: 'followUp', navigationScreenName: 'MyTasks'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.complaints,
            image: require("./../assets/images/taskList/complaints.png"),
            code: 'complaints', navigationScreenName: 'MyTasks'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.license,
            image: require("./../assets/images/taskList/license.png"),
            code: 'license', navigationScreenName: 'MyTasks'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.foodAlerts,
            image: require("./../assets/images/taskList/foodAlerts.png"),
            code: 'foodAlerts', navigationScreenName: 'FoodAlerts'
        }, {

        }
    ]

    const adhocArr = [
        // {
        //     title: Strings[context.isArabic ? 'ar' : 'en'].taskList.instantViolation,
        //     image: require("./../assets/images/taskList/instantViolation.png"),
        //     code: 'instantViolation', navigationScreenName: 'MyTasks'
        // }, 
        {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.adhocTasks,
            image: require("./../assets/images/taskList/adhocTask.png"),
            code: 'adhocTasks', navigationScreenName: "AdhocEstablishmentAndVehical"
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.sampling,
            image: require("./../assets/images/taskList/sampling.png"),
            code: 'sampling', navigationScreenName: 'AdhocEstablishmentAndVehical'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.condemnation,
            image: require("./../assets/images/taskList/condemnation.png"),
            code: 'condemnation', navigationScreenName: 'AdhocEstablishmentAndVehical'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.detention,
            image: require("./../assets/images/taskList/detention.png"),
            code: 'detention', navigationScreenName: 'AdhocEstablishmentAndVehical'
        }, {
            title: Strings[context.isArabic ? 'ar' : 'en'].taskList.closure,
            image: require("./../assets/images/taskList/closure.png"),
            code: 'request', navigationScreenName: 'RequestForClosureList'
        }
    ]

    useEffect(() => {

        const searchText = props.route ? props.route.params ? props.route.params.searchText : '' : '';
        setSearchText(searchText);
        loginDraft.setSearchText(searchText);
        adhocTaskEstablishmentDraft.setEnglishTradeName(searchText)

        setDocumentArray(documentArr);
        setScheduledArray(scheduledArr);
        setAdhocArray(adhocArr);
    }, []);

    const onChangeSearchText = (searchText: string) => {
        setSearchText(searchText)
        loginDraft.setSearchText(searchText)
    }

    const renderData = (item: any, index: number) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.code == 'instantViolation') {
                        myTasksDraft.setIsMyTaskClick('adhoc');
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'adhocTasks') {
                        myTasksDraft.setIsMyTaskClick('adhocTask');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText });
                    }
                    if (item.code == 'sampling') {
                        myTasksDraft.setIsMyTaskClick('adhoc');
                        adhocTaskEstablishmentDetailsDraft.setTaskType('Sampling')
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText })
                    }
                    if (item.code == 'condemnation') {
                        myTasksDraft.setIsMyTaskClick('adhoc');
                        adhocTaskEstablishmentDetailsDraft.setTaskType('Condemnation')
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText })
                    }
                    if (item.code == 'detention') {
                        myTasksDraft.setIsMyTaskClick('adhoc');
                        adhocTaskEstablishmentDetailsDraft.setTaskType('Detention')
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText })
                    }
                    if (item.code == 'request') {
                        myTasksDraft.setIsMyTaskClick('adhoc');
                        adhocTaskEstablishmentDraft.callToSearchByEstablishmentService()
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'routlineInspection') {
                        myTasksDraft.setIsMyTaskClick('scheduledroutlineInspection');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText + "," + 'routine' })
                    }
                    if (item.code == 'followUp') {
                        myTasksDraft.setIsMyTaskClick('scheduledfollowUp');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText + "," + "follow" })
                    }
                    if (item.code == 'complaints') {
                        myTasksDraft.setIsMyTaskClick('scheduled');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText + "," + "complaints" })
                    }
                    if (item.code == 'license') {
                        myTasksDraft.setIsMyTaskClick('scheduledlicense');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText + "," + "noc" })
                    }
                    if (item.code == 'foodAlerts') {
                        myTasksDraft.setIsMyTaskClick('scheduled');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText + "," + "foodAlerts" })
                    }
                    if (item.code == 'aboutSearch') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'aboutStaff') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'aboutLastReport') {
                        NavigationService.navigate(item.navigationScreenName)
                    }
                    if (item.code == 'aboutHistory') {
                        myTasksDraft.setIsMyTaskClick('History');
                        NavigationService.navigate(item.navigationScreenName, { 'filter': searchText })
                    }

                    if (item.code == 'aboutDirections') {
                        let estArray = establishmentDraft.allEstablishmentData != '' ? JSON.parse(establishmentDraft.allEstablishmentData) : Array();

                        let temp = estArray.filter((item: any) => {
                            let EstablishmentName = item.EnglishName ? item.EnglishName : ''
                            if ((EstablishmentName.toString().toLowerCase() === (searchText.toLowerCase())) 
                            ) {
                                return item;
                            }
                        });
                        let temp1 = estArray.filter((item: any) => {
                            let LicenseCode = item.LicenseCode ? item.LicenseCode : ''
                            if ( (LicenseCode.toLowerCase().toString() === (searchText.toLowerCase()) )) {
                                return item;
                            }
                        });
                        //console.log("temp:"+JSON.stringify(temp))
                        //console.log("temp1:"+JSON.stringify(temp1))
                        if ((temp[0] && temp[0].LATITUDE && (temp[0].LATITUDE != null && temp[0].LATITUDE != '')) && (temp[0] && temp[0].LONGITUDE && (temp[0].LONGITUDE != null && temp[0].LONGITUDE != ''))) {
                            NavigationService.navigate(item.navigationScreenName, { 'filter': { latitude: parseFloat(temp[0].LATITUDE),longitude: parseFloat(temp[0].LONGITUDE),EnglishName:temp[0].EnglishName,LicenseNumber:temp[0].LicenseNumber} })
                        }
                        else if ((temp1[0] && temp1[0].LATITUDE && (temp1[0].LATITUDE != null && temp1[0].LATITUDE != '')) && (temp1[0] && temp1[0].LONGITUDE && (temp1[0].LONGITUDE != null && temp1[0].LONGITUDE != ''))) {
                            NavigationService.navigate(item.navigationScreenName, { 'filter': { latitude: temp1[0].LATITUDE,longitude: temp1[0].LONGITUDE,EnglishName:temp1[0].EnglishName,LicenseNumber:temp1[0].LicenseNumber} })
                        } 
                        else {
                            Alert.alert("","Location not available")
                        }
                    }

                }}
                style={{
                    flex: 1, justifyContent: 'center', alignItems: 'flex-end',
                    width: '100%', borderColor: 'transparent'
                }}>

                <View style={{ flex: 0.5, width: '100%', alignItems: 'center' }}>
                    <Image resizeMode={'contain'}
                        source={item.image} />
                </View>

                <View style={{ flex: 0.3 }} />

                <View style={{ flex: 0.2, width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Text style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{item.title}</Text>
                </View>

            </TouchableOpacity >

        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../assets/images/backgroundimgReverse.jpg') : require('./../assets/images/backgroundimg.jpg')}>

                {/* <View style={{ flex: 0.7, alignItems: 'flex-end', justifyContent: 'flex-end', alignSelf: 'center', width: '90%' }}>
                    <Image style={{ alignSelf: context.isArabic ? 'flex-start' : 'flex-end' }} source={require('./../assets/images/login/ProfileIcon.png')} />
                </View>


                <View style={{ flex: 0.8 }} />

                <View style={{
                    flex: 0.6, flexDirection: context.isArabic ? 'row-reverse' : 'row', width: '100%'
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            NavigationService.goBack();
                        }}
                        style={{ flex: 1.5, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                        <Image style={{ alignSelf: 'center', transform: [{ rotate: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../assets/images/login/back.png')} />
                    </TouchableOpacity>

                    <View style={{ flex: 1.5 }} />

                    <View style={{ flex: 5.5, alignItems: context.isArabic ? 'flex-end' : 'flex-start', justifyContent: 'center' }}>
                        <Image resizeMode="contain" source={require("./../assets/images/logo-size/SmartControlLogo128.png")}
                        />
                    </View>

                </View> */}
                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>


                <View style={{ flex: 0.5 }} />

                <View style={{ flex: 0.6, width: '90%', alignSelf: 'center' }}>
                    <SearchComponent isArabic={context.isArabic} onChangeSearch={onChangeSearchText} searchText={searchText} />
                </View>

                <View style={{ flex: 0.2 }} />

                <View style={{ flex: 6, width: '85%', alignSelf: 'center' }}>

                    <View style={{ flex: 0.8, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row', borderRadius: 10, borderWidth: 1, borderColor: '#abcfbf' }}>

                        <View style={{ flex: 4, justifyContent: 'center', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>

                            <View style={{ height: 10 }} />

                            <FlatList
                                // nestedScrollEnabled={false}
                                data={documentArray}
                                contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                initialNumToRender={5}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderData(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.06, width: WIDTH * 0.03 }} />)}
                                numColumns={3}
                            />
                            {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/documents.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.document}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/staff.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.staff}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/lastReport.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.lastReport}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/history.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.history}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/directions.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.directions}</Text>

                                </View>

                                <View style={{ flex: 3.33 }} />
                            </View> */}

                        </View>

                        <View style={{ flex: 0.5, height: '100%', justifyContent: 'center', backgroundColor: '#abcfbf', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                            {/* <Text style={[styles.text, {
                                transform: [
                                    { rotate: "-90deg" }
                                ],
                                textAlignVertical: 'bottom'

                            }]}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.document}</Text> */}
                        </View>

                        <View style={{
                            flex: 0.5, justifyContent: 'center', transform: [
                                { rotate: "-90deg" },
                            ], position: 'absolute', right: context.isArabic ? '0%' : '-2%', top: '50%'
                        }}>
                            <Text
                                textBreakStrategy={'balanced'}
                                style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.document}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 0.15 }} />

                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row', borderRadius: 10, borderWidth: 1, borderColor: '#abcfbf' }}>

                        <View style={{ flex: 4, justifyContent: 'center', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                            <View style={{ height: 10 }} />
                            <FlatList
                                // nestedScrollEnabled={false}
                                data={scheduledArr}
                                contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                initialNumToRender={5}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderData(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.035, width: WIDTH * 0.03 }} />)}
                                numColumns={3}
                            />
                            {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/routineInspection.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.routineInspection}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/followUp.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.followUp}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/complaints.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.complaints}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/license.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.license}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/foodAlerts.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.foodAlerts}</Text>

                                </View>

                                <View style={{ flex: 3.33 }} />
                            </View> */}

                        </View>

                        <View style={{ flex: 0.5, justifyContent: 'center', backgroundColor: '#abcfbf', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                            {/* <Text 
                            textBreakStrategy ={'balanced'}
                            style={[styles.text, {
                                transform: [
                                    { rotate: "-90deg" },
                                ],

                            }]}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.scheduled}</Text> */}
                        </View>
                        <View style={{
                            flex: 0.5, justifyContent: 'center', transform: [
                                { rotate: "-90deg" },
                            ], position: 'absolute', right: context.isArabic ? '0%' : '-2%', top: '50%'
                        }}>
                            <Text
                                textBreakStrategy={'balanced'}
                                style={[styles.text, { fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }]}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.scheduled}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 0.15 }} />

                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row', borderRadius: 10, borderWidth: 1, borderColor: '#abcfbf' }}>

                        <View style={{ flex: 4, justifyContent: 'center', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                            <View style={{ height: 10 }} />
                            <FlatList
                                // nestedScrollEnabled={false}
                                data={adhocArr}
                                contentContainerStyle={{ padding: 5, justifyContent: 'center' }}
                                initialNumToRender={5}
                                renderItem={({ item, index }) => {
                                    return (
                                        renderData(item, index)
                                    )
                                }}
                                ItemSeparatorComponent={() => (<View style={{ height: WIDTH * 0.06, width: WIDTH * 0.03 }} />)}
                                numColumns={3}
                            />
                            {/* <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/instantViolation.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.instantViolation}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/adhocTask.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.adhocTasks}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/sampling.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.sampling}</Text>
                                </View>

                            </View>

                            <View style={{ flex: 1, justifyContent: 'center', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/condemnation.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.condemnation}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/detention.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.detention}</Text>

                                </View>

                                <View style={{ flex: 3.33, justifyContent: 'center', alignItems: 'center' }}>

                                    <Image resizeMode="contain" source={require("./../assets/images/taskList/closure.png")}
                                    />
                                    <Text style={styles.text}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.closure}</Text>

                                </View>

                            </View> */}

                        </View>

                        <View style={{ flex: 0.5, height: '100%', justifyContent: 'center', backgroundColor: '#abcfbf', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
                            <Text style={[styles.text, {
                                fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily,
                                transform: [
                                    { rotate: "-90deg" }
                                ],
                                textAlignVertical: 'bottom'

                            }]}>{Strings[context.isArabic ? 'ar' : 'en'].taskList.adhoc}</Text>
                        </View>

                    </View>

                </View>

                <View style={{ flex: 1 }} />

            </ImageBackground>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containter: {
        flex: 1

    },
    fixed: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    scrollview: {
        backgroundColor: 'transparent'
    },
    text: {
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        color: fontColor.TitleColor,
        //fontFamily: fontFamily.textFontFamily
    },
})

export default observer(TaskList);