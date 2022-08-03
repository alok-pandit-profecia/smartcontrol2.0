

import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert, Text, ToastAndroid
} from 'react-native';

//import { SearchBar } from 'react-native-elements';
import NavigationService from './../services/NavigationService';
import useInject from "../hooks/useInject"
import { RootStoreModel } from "../store/rootStore"
//import strings from './../config/strings';
let realm = RealmController.getRealmInstance();
import { RealmController } from '../database/RealmController';
import Strings from '../config/strings';
import { Context } from '../utils/Context';
import { fontFamily } from '../config/config';

const SearchComponent = (props: any) => {

    const context = useContext(Context);

    const mapStore3 = (rootStore: RootStoreModel) => ({ loginDraft: rootStore.loginModel })
    const { loginDraft } = useInject(mapStore3)

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        if (props.searchText != '') {
            setSearchText(props.searchText)
        }
    }, [loginDraft.searchText]);

    return (

        //'rgba(255,255,255,0.9)'
        <View style={{ flex: 0.7, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', width: '92%', flexDirection: context.isArabic ? 'row-reverse' : 'row', borderRadius: 4, borderWidth: 0.8, borderColor: '#ee3e43' }}>

            <TouchableOpacity
                onPress={() => {
                    props.onChangeSearch(searchText);
                }}
                style={{ flex: 0.8, height: '70%', borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    resizeMode="contain"
                    source={require("./../assets/images/login/search.png")}
                    style={{ height: 20, width: 20, transform: [{ rotateY: context.isArabic ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>

            <TextInput
                style={{ flex: 5, height: '80%', padding: '1%', textAlign: context.isArabic ? 'right' : 'left', fontStyle: 'normal', fontSize: 14, color: 'black', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}
                onChangeText={(text: any) => {
                    //Alert.alert(text)
                    if (text == '') {
                        setSearchText(text);
                        props.onChangeSearch(text);
                    } else {
                        props.onChangeSearch(text);
                        setSearchText(text);
                    }
                }}
                placeholder={(Strings[props.isArabic ? 'ar' : 'en'].dashboard.search)}
                placeholderTextColor={'#a6ccb8'}
                value={searchText}
            />

            {/* <TouchableOpacity
                onPress={() => {
                    if (searchText != '' && props.onChangeSearch) {
                        props.onChangeSearch(searchText);
                        // setSearchText('');
                    }
                    else {
                        ToastAndroid.show(Strings[props.isArabic ? 'ar' : 'en'].dashboard.pleaseEnterText, 1000);
                    }
                }}
                style={{ flex: 1.5, backgroundColor: '#ee3e43', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 12, fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily }}>{(Strings[props.isArabic ? 'ar' : 'en'].action.submit)}</Text>
            </TouchableOpacity> */}

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

export default SearchComponent;