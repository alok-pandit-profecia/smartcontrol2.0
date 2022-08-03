import React, { Component } from 'react';
import { View, Text, ShadowPropTypesIOS } from 'react-native';
import { fontFamily } from './../../config/config';

const TextComponent = (props: any) => {

    return (
        <View style={[props.viewStyle, { padding: 2 }]}>
            <Text
                style={[props.textStyle, { fontFamily: fontFamily.textFontFamily}]}
                numberOfLines={props.numberOfLines }>
                {props.label}
            </Text>
        </View>
    );

}

export default TextComponent;