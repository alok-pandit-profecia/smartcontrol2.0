import React, { useContext, useState, useEffect, useRef } from 'react';
import { Image, View, FlatList, Linking, SafeAreaView, TouchableOpacity, Text, ImageBackground, Dimensions, AppState, Alert, PermissionsAndroid, ToastAndroid, BackHandler, Platform, TextInput, StyleSheet } from "react-native";
import { useIsFocused } from '@react-navigation/native';
import NavigationService from '../../services/NavigationService';
import Header from './../../components/Header';
import KeyValueComponent from './../../components/KeyValueComponent';
import BottomComponent from './../../components/BottomComponent';
import { observer } from 'mobx-react';
import { Context } from '../../utils/Context';
import Strings from '../../config/strings';
import { fontFamily, fontColor } from '../../config/config';
import { RootStoreModel } from '../../store/rootStore';
import useInject from "../../hooks/useInject";
import { RealmController } from '../../database/RealmController';
import EstablishmentSchema from '../../database/EstablishmentSchema';
import LocationPermissionModel from '../../components/LocationPermissionModel';
import SearchComponent from '../../../src/components/SearchComponent';
import AlertComponentForInformation from './../../components/AlertComponentForEstblishmentInformation';
let realm = RealmController.getRealmInstance();
import MapView, { Marker, ProviderPropType, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
// import WebView from "react-native-webview";
import LaunchNavigator from 'react-native-launch-navigator';

import Geolocation from 'react-native-geolocation-service';
import RNSettings from 'react-native-settings';
import AndroidOpenSettings from 'react-native-android-open-settings'

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
const GOOGLE_MAPS_APIKEY = "AIzaSyB545nKZK6tpqL8QO1HCXmuUM0QJ88GSJg";
const AboutDirections = (props: any) => {

    const context = useContext(Context);
    const [markerList, setMarkerList] = useState(Array());
    const [allMarkerList, setAllMarkerList] = useState(Array());
    const [seletedEst, setSeletedEst] = useState(Object());
    const [markerLocation, setMarkerLocation] = useState('');
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [turnOnNavigationButton, setTurnOnNavigationButton] = useState(false);
    const [KMRadius, setKMRadius] = useState(0);
    const [isNeverAskLocationPermissionAlert, setNeverAskLocationPermissionAlert] = useState(false);
    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0
    });
    const [currentLocation, setCurrentLocation] = useState({
        latitude: 0,
        longitude: 0
    });
    let mapRef = useRef(null);

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, establishmentDraft: rootStore.establishmentModel })
    const { myTasksDraft, establishmentDraft } = useInject(mapStore)
    const estLocation = props.route ? props.route.params ? props.route.params.filter : '' : '';

    const _handleAppStateChange = async () => {
        debugger
        if (AppState.currentState === "active") {
            try {
                setTurnOnNavigationButton(false)
                setMarkerLocation('')

                const granted = await PermissionsAndroid.requestMultiple(
                    [PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                    ]
                ).then(async (result) => {

                    if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'granted'
                        && result['android.permission.ACCESS_FINE_LOCATION'] === 'granted') {

                        RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
                            if (result == RNSettings.ENABLED) {

                                Geolocation.getCurrentPosition(
                                    (position) => {
                                        myTasksDraft.setLatitude(position.coords.latitude.toString())
                                        myTasksDraft.setLongitude(position.coords.longitude.toString())
                                        if (estLocation == '') {
                                            setLocation(prevState => {
                                                return { ...prevState, latitude: (position.coords.latitude), longitude: (position.coords.longitude) }
                                            });
                                            setCurrentLocation(prevState => {
                                                return { ...prevState, latitude: (position.coords.latitude), longitude: (position.coords.longitude) }
                                            });
                                        }
                                        //console.log(position.coords.latitude + ':' + position.coords.longitude);
                                    },
                                    async (error) => {
                                        //console.log(error.code, error.message);
                                    },
                                    {
                                        enableHighAccuracy: false,
                                        timeout: 10000,
                                        maximumAge: 100000,
                                        forceRequestLocation: true,
                                        showLocationDialog: true
                                    }
                                );

                            } else {
                                Alert.alert("Turn on Location", "Please turn on location to fetch current location", [
                                    {
                                        text: "Cancel",
                                        onPress: () => { NavigationService.navigate('Dashboard') },
                                        style: "cancel"
                                    },
                                    { text: "OK", onPress: () => AndroidOpenSettings.locationSourceSettings() }
                                ],
                                    { cancelable: false })
                            }
                        });
                        debugger;
                    }
                    else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'denied'
                        || result['android.permission.ACCESS_FINE_LOCATION']
                        === 'denied') {
                        debugger;
                        setNeverAskLocationPermissionAlert(true);
                    }
                    else if (result['android.permission.ACCESS_COARSE_LOCATION'] === 'never_ask_again'
                        || result['android.permission.ACCESS_FINE_LOCATION']
                        === 'never_ask_again') {
                        debugger;
                        setNeverAskLocationPermissionAlert(true);
                    }
                });
            } catch (err) {
                console.warn(err);
            }
        }
    };
    const DEFAULT_PADDING: any = { top: 40, right: 40, bottom: 40, left: 40 };

    // useEffect(() => {
    //     if (markerList.length) {
    //         if (mapRef.current) {
    //             mapRef.current.fitToCoordinates(markerList, {
    //                 edgePadding: DEFAULT_PADDING,
    //                 animated: true,
    //             });
    //         }
    //     }
    // }, [markerList])

    useEffect(() => {
        let tempArr = RealmController.getAllEstablishments(realm, EstablishmentSchema.name)
        tempArr = tempArr['0'] ? Object.values(tempArr) : Array()
        let temp = Array();

        if (estLocation != '') {
            temp.push(estLocation)
            setLocation(prevState => {
                return { ...prevState, latitude: (estLocation.latitude), longitude: (estLocation.longitude) }
            });
        }
        else {
            for (let index = 0; index < tempArr.length; index++) {
                const element = tempArr[index];
                if ((element.LATITUDE && element.LATITUDE != '') && (element.LONGITUDE && element.LONGITUDE != '')) {
                    let lat = parseFloat(element.LATITUDE), long = parseFloat(element.LONGITUDE)
                    if ((lat < 100) && (long < 100)) {
                        temp.push(
                            {
                                latitude: lat,
                                longitude: long,
                                EnglishName: element.EnglishName,
                                ArabicName: element.ArabicName,
                                City: element.City,
                                Sector: element.Sector,
                                LicenseNumber: element.LicenseNumber,
                                LicenseCode: element.LicenseCode
                            }
                        );
                    }
                }
            }
        }

        setMarkerList(temp);
        setAllMarkerList(temp);

        RNSettings.getSetting(RNSettings.LOCATION_SETTING).then((result: any) => {
            if (result == RNSettings.ENABLED) {

                Geolocation.getCurrentPosition(
                    (position) => {
                        myTasksDraft.setLatitude(position.coords.latitude.toString())
                        myTasksDraft.setLongitude(position.coords.longitude.toString())

                        if (estLocation == '') {
                            setLocation(prevState => {
                                return { ...prevState, latitude: (position.coords.latitude), longitude: (position.coords.longitude) }
                            });
                            setCurrentLocation(prevState => {
                                return { ...prevState, latitude: (position.coords.latitude), longitude: (position.coords.longitude) }
                            });
                        }

                        //console.log(position.coords.latitude + ':' + position.coords.longitude);
                    },
                    async (error) => {
                        //console.log(error.code, error.message);
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 100000,
                        forceRequestLocation: true,
                        showLocationDialog: true
                    }
                );

            } else {
                Alert.alert("Turn on Location", "Please turn on location to fetch current location", [
                    {
                        text: "Cancel",
                        onPress: () => { NavigationService.navigate('Dashboard') },
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => AndroidOpenSettings.locationSourceSettings() }
                ],
                    { cancelable: false })
            }
        });

        _handleAppStateChange()
        AppState.addEventListener("focus", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("focus", _handleAppStateChange);
        };
        // goToMyPosition(53.708152, 23.6477914);
    }, [])


    const renderDirections = (item: any, index: number) => {

        return (

            <TouchableOpacity
                onPress={() => {
                    // NavigationService.navigate('TaskList', { searchText: item.place });
                    // NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': item });
                }}
                // key={item.inspectionId}
                style={{
                    height: 65, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderTopRightRadius: 10, borderBottomRightRadius: 10, borderWidth: 1,
                    shadowRadius: 1, backgroundColor: 'white', borderLeftWidth: 6, borderRightColor: '#5C666F', borderTopColor: '#5C666F', borderBottomColor: '#5C666F', borderLeftColor: '#5C666F'
                    , shadowOpacity: 15, shadowColor: 'grey', elevation: 0
                }}>

                <View style={{
                    flex: 1, height: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row', padding: 5
                }}>

                    <View style={{ flex: 6.5, paddingTop: 2, paddingBottom: 12, justifyContent: 'center', }}>

                        <View style={{ flex: 1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ fontSize: 13, textAlign: 'left', color: '#565758', fontWeight: 'bold', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{item.place}</Text>
                        </View>

                        <View style={{ flex: 1.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center' }}>

                            <View style={{ flex: 1.1, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start' }}>

                                <View style={{ flex: 0.2, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}>
                                    <Image resizeMode={'contain'} source={require('./../../assets/images/searchScreen/locationSmall.png')} />
                                </View>

                                <View style={{ flex: 1.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Text numberOfLines={2} style={{ fontSize: 11, fontWeight: 'bold', textAlign: context.isArabic ? 'right' : 'left', color: '#8b8a8a', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{item.address}</Text>
                                </View>

                            </View>

                            <Image resizeMode={'contain'} source={require('./../../assets/images/searchScreen/locationSmall.png')} />

                            <View style={{ flex: 0.2, borderBottomColor: 'red', borderBottomWidth: 1 }} >
                                <Text
                                    style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: fontFamily.textFontFamily }}>{ }</Text>
                            </View>

                            <View style={{ flex: 0.4, backgroundColor: 'white', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-around', borderLeftColor: 'red', borderBottomColor: 'red', borderBottomWidth: 1 }}>
                                {/* <View style={{ flex: 0.4, flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'center' }}> */}
                                <Text style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{item.distance}</Text>
                                {/* </View> */}
                            </View>

                            <View style={{ flex: 0.2, borderBottomColor: 'red', borderBottomWidth: 1 }} >
                                <Text
                                    style={{ fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#8b8a8a', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{ }</Text>
                            </View>

                            <Image resizeMode={'contain'} source={require('./../../assets/images/searchScreen/locationSmall.png')} />

                        </View>

                    </View>

                    <View style={{ flex: 0.3 }} />

                    <View style={{ flex: 2, justifyContent: 'center', backgroundColor: 'white', borderColor: '#d51617', alignItems: 'center' }}>
                        <Image style={{ height: 45, width: 45, borderRadius: 8, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }} source={require('./../../assets/images/searchScreen/home.png')} />
                    </View>

                </View>

            </TouchableOpacity >
        )
    }

    const onChangeSearch = (str: string) => {
        if (str && (str != '') && markerList.length) {
            let temp = [];
            // alert(str)
            str = str != "" ? str.toLowerCase() : "";
            // temp = markerList.filter((item) => {
            //     item.LicenseCode = item.LicenseCode ? item.LicenseCode : '';
            //     item.Sector = item.Sector ? item.Sector : '';
            //     item.BusinessActivity = item.BusinessActivity ? item.BusinessActivity : '';
            //     item.EnglishName = item.EnglishName ? item.EnglishName : '';
            //     item.Description = item.Description ? item.Description : '';

            //     if ( (item.LicenseCode.toString().toLowerCase().indexOf(str) > -1)
            //         || (item.Sector.toString().toLowerCase().indexOf(str) > -1)
            //         || (item.EnglishName.toString().toLowerCase().indexOf(str) > -1)
            //         // || (item.EstablishmentNameAR ? item.EstablishmentNameAR.toString().indexOf(str) :-1 > -1)
            //     ) {
            //         return item;
            //     }
            // });
            // setMarkerList(temp);

            let tempLicenseNumber = [], tempLicenseCode = [], tempLicenseSource = [], tempArea = [], tempSector = [], tempEnglishName = [], tempArabicName = [];

            tempLicenseNumber = markerList.filter((item: any, index: number) => {
                let LicenseNumber = item.LicenseNumber ? item.LicenseNumber : '';
                if (
                    (LicenseNumber.toString().toLowerCase().indexOf(str.toLowerCase()) > -1)
                ) {
                    return item;
                }
            });
            tempLicenseCode = markerList.filter((item: any, index: number) => {
                let LicenseCode = item.LicenseCode ? item.LicenseCode : '';

                if (
                    (LicenseCode.toString().toLowerCase().indexOf(str.toLowerCase()) > -1)
                ) {
                    return item;
                }
            });

            tempLicenseSource = markerList.filter((item: any, index: number) => {
                let EnglishName = item.EnglishName ? item.EnglishName : '';

                if (
                    (EnglishName.toString().toLowerCase().indexOf(str.toLowerCase()) > -1)
                ) {
                    return item;
                }
            });

            temp = [...tempLicenseCode, ...tempLicenseNumber, ...tempLicenseSource]
            console.log(JSON.stringify(temp))

            setMarkerList(temp);

        }
        else {
            let temp = allMarkerList;
            if (temp.length) {
                setMarkerList(allMarkerList);
            }
        }
    }
    return (

        <SafeAreaView style={{ flex: 1 }}>

            {
                isNeverAskLocationPermissionAlert ?
                    <LocationPermissionModel
                        okmsg={('Allow')}
                        isArabic={context.isArabic}
                        cancelmsg={('Cancle')}
                        message={('App need to access your live location')}
                        okAlert={() => {
                            setNeverAskLocationPermissionAlert(false);
                            Linking.openSettings();
                        }}
                        closeAlert={() => {
                            setNeverAskLocationPermissionAlert(true);
                            // BackHandler.exitApp()
                        }}
                    />
                    : null
            }

            {
                showInformationAlert
                    ?
                    <AlertComponentForInformation
                        showMessage={true}
                        data={
                            seletedEst
                        }
                        closeAlert={() => {
                            setShowInformationAlert(false);
                        }}
                    />
                    :
                    null
            }
            <ImageBackground style={{ height: HEIGHT, width: WIDTH }} source={context.isArabic ? require('./../../assets/images/backgroundimgReverse.jpg') : require('./../../assets/images/backgroundimg.jpg')}>

                <View style={{ flex: 1.5 }}>
                    <Header isArabic={context.isArabic} />
                </View>

                <View style={{ flex: 0.7 }}>
                    {/* flex: 0.3 */}
                    {/* <View style={{ flex: 1, flexDirection: 'row', width: '80%', alignSelf: 'center' }}> */}

                    {/* <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: fontColor.TitleColor, fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.tittleFontFamily, fontSize: 18, fontWeight: 'bold' }}>{myTasksDraft.isMyTaskClick == 'CompletedTask' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.completedTesk : myTasksDraft.isMyTaskClick == 'case' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.cases : myTasksDraft.isMyTaskClick == 'license' ? Strings[context.isArabic ? 'ar' : 'en'].dashboard.licenses : Strings[context.isArabic ? 'ar' : 'en'].myTask.myTask}</Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5, borderBottomColor: fontColor.TitleColor, borderBottomWidth: 1.5 }}></View>
                            <View style={{ flex: 0.5 }}></View>
                        </View> */}
                    {/* </View> */}

                    <View style={{ flex: 1.2, width: '85%', alignSelf: 'center' }}>
                        <SearchComponent isArabic={context.isArabic}
                            onChangeSearch={(val: string) => {
                                onChangeSearch(val)
                            }} />
                    </View>

                </View>

                <View style={{ flex: 6, width: '100%', borderRadius: 6, borderWidth: 1 }}>

                    <View style={styles.container}>

                        <MapView
                            ref={mapRef}
                            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                            style={styles.map}
                            region={{
                                latitude: location.latitude,
                                longitude: location.longitude,

                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421
                            }}
                            showsBuildings={true}
                            showsUserLocation={true}
                            followsUserLocation={true}
                            showsMyLocationButton={true}
                            showsTraffic={true}
                            toolbarEnabled={false}
                        >
                            <Circle
                                center={location}
                                radius={5000}
                                fillColor="rgba(255, 255, 255, 0.3)"
                                strokeColor="rgba(0,0,0,0.5)"
                                zIndex={2}
                                strokeWidth={2}
                            />

                            {
                                markerList.map((item, index) => (
                                    <Marker
                                        key={index}
                                        coordinate={item}
                                        pointerEvents="auto"
                                        onPress={e => {
                                            setSeletedEst(item)
                                            if (e.nativeEvent && e.nativeEvent.coordinate) {
                                                setTurnOnNavigationButton(true)
                                                let lat = e.nativeEvent.coordinate.latitude, long = e.nativeEvent.coordinate.longitude
                                                setLocation(prevState => {
                                                    return { ...prevState, latitude: lat, longitude: long }
                                                });
                                                setMarkerLocation(lat + ',' + long)
                                            }
                                        }}
                                        title={item.EnglishName}
                                        description={item.LicenseNumber}
                                    // pinColor={'red'}
                                    />
                                ))
                            }

                            {/* <Marker
                                key={2}
                                coordinate={{
                                    latitude: 23.627375,
                                    longitude: 54.398793
                                }}
                                onPress={e => {
                                    if (e.nativeEvent && e.nativeEvent.coordinate) {
                                        setTurnOnNavigationButton(true)
                                        setMarkerLocation(e.nativeEvent.coordinate.latitude + ',' + e.nativeEvent.coordinate.longitude)
                                    }
                                }}
                                title={'Estblishment2'}
                                description={`latitude: 23.627375,
                                longitude: 54.398793`}
                                pinColor={'green'}
                            /> */}

                            {/* <MapViewDirections
                                origin={{
                                    latitude: 23.6477914,
                                    longitude: 53.708152
                                }}
                                destination={{
                                    latitude: 23.627375,
                                    longitude: 54.398793
                                }}
                                strokeWidth={3}
                                strokeColor="#1A73E8"
                                region="EG"
                                apikey={GOOGLE_MAPS_APIKEY}
                            /> */}
                        </MapView>
                        {
                            turnOnNavigationButton ?
                                <TouchableOpacity
                                    onPress={() => {
                                        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' + 'lable' });
                                        const url: string = Platform.select({
                                            ios: "maps:" + markerLocation + "?q=" + markerLocation,//+ 'label'
                                            android: "geo:" + markerLocation + "?q=" + markerLocation//+ 'label'
                                        });
                                        // const url:string = Platform.select({
                                        //     ios: `maps:${markerLocation}`,
                                        //     android: `geo:${markerLocation}?center=${markerLocation}&q=${markerLocation}&z=16`
                                        // });
                                        Linking.openURL(url);
                                        // LaunchNavigator.navigate(markerLocation, {
                                        //     start: "23.627375, 54.398793"
                                        // })
                                        //     //start: [location.latitude,location.longitude]
                                        //     .then(() => //console.log("Launched navigator"))
                                        //     .catch((err: any) => console.error("Error launching navigator: " + err));
                                    }}
                                    style={{ position: 'absolute', bottom: 5, left: 20, padding: 8, borderRadius: 8, backgroundColor: '#1A73E8' }}
                                >
                                    <Text style={{ color: 'white' }}>Navigate</Text>
                                </TouchableOpacity>

                                :
                                null
                        }
                        {
                            turnOnNavigationButton ?
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowInformationAlert(true)
                                    }}
                                    style={{ position: 'absolute', bottom: 5, right: 20, padding: 8, borderRadius: 8, backgroundColor: '#1A73E8' }}
                                >
                                    <Text style={{ color: 'white' }}>Establishment Details</Text>
                                    {/* <Image resizeMode={'contain'} source={require('./../../assets/images/info.png')} /> */}

                                </TouchableOpacity>
                                :
                                null
                        }
                    </View>
                    {/* <WebView ref={webViewRef} source={{ html: html_script }} style={styles.Webview} /> */}
                </View>

                <View style={{ flex: 1 }} >
                    {
                        turnOnNavigationButton ?
                            <TouchableOpacity
                                onPress={() => {
                                    NavigationService.navigate('MyTasks', { 'filter': seletedEst.LicenseCode })
                                    // myTasksDraft.search
                                }}
                                style={{ position: 'absolute', bottom: 5, right: 20, padding: 8, borderRadius: 8, backgroundColor: '#1A73E8' }}
                            >
                                <Text style={{ color: 'white' }}>View Tasks</Text>
                                {/* <Image resizeMode={'contain'} source={require('./../../assets/images/info.png')} /> */}

                            </TouchableOpacity>
                            :
                            null
                    }
                </View>

                <View style={{ flex: 1 }}>
                    <BottomComponent isArabic={context.isArabic} />
                </View>

            </ImageBackground>

        </SafeAreaView>

    )
}

AboutDirections.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    // Container: {
    //     flex: 1,
    //     padding: 10,
    //     backgroundColor: 'grey'

    // },
    Webview: {
        flex: 2,

    },
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: WIDTH,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})
export default observer(AboutDirections);