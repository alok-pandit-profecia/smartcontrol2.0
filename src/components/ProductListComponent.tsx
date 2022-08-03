import React, { useContext, useEffect, useState } from 'react';
import { Image, View, StyleSheet, TouchableOpacity, FlatList, Text, ImageBackground, Dimensions } from "react-native";
import Header from './Header';
import BottomComponent from './BottomComponent';
import ButtonComponent from './ButtonComponent';
import TextComponent from './TextComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from '../config/strings';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import TableComponent from './TableComponent';
import NavigationService from '../services/NavigationService';

const ProductListComponent = (props: any) => {
    const context = useContext(Context);
    const [productList, setProductList] = useState({});

    useEffect(() => {

        let temp = [];
        temp = (props.data.ProductList && props.data.ProductList.ProductAlert) ? props.data.ProductList.ProductAlert : [];
        setProductList(temp);

    }, [props.data]);

    const renderScoreData = (item: any, index: number) => {
        // alert('item' + JSON.stringify(item));
        return (
            <View style={{ flex: 1, width: '100%',height:HEIGHT*0.3, alignSelf: 'center', borderWidth: 1, borderColor: '#abcfbf', borderRadius: 12 }}>
                <TableComponent isHeader={false}
                    isArabic={context.isArabic}
                    data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.productName, value: item.ProductName },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.brand, value: item.Brand },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.type, value: item.PackageType },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.batch, value: item.Batch },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.quantity, value: item.Quantity },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.weight, value: item.Weight },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.unit, value: item.Unit },
                    { keyName: Strings[context.isArabic ? 'ar' : 'en'].foodAlerts.country, value: item.ManufCountry }
                    ]}
                />
            </View>
        );
    }

    return (

        <View style={{ flex: 1, width: '100%',  }}>

            <FlatList
                data={productList}
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

        </View>
    )
}
const styles = StyleSheet.create({
    TextInputContainer: {
        flex: 0.6,
        justifyContent: "center",
        alignSelf: 'center',

    },
    space: {
        flex: 0.0
    },
    textContainer: {
        flex: 0.4,
        justifyContent: 'center',
    },

});

export default observer(ProductListComponent);

