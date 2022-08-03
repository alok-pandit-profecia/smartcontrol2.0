import React, { useState, useEffect, useContext, createRef } from 'react';
import { TextInput, View, Text, Dimensions } from 'react-native';
import { fontFamily } from '../../config/config';

const HEIGHT = Dimensions.get("window").height;

const TextInputWithLabelComponent = (props:any) => {

    return (
        <View style={{ minHeight: HEIGHT * 0.12, height: 'auto', width: '100%', justifyContent: 'center', alignItems: 'center', padding: 8 }}>
            {
                props.showLabel
                    ?
                    <View style={{ minHeight: HEIGHT * 0.04, justifyContent: 'flex-start', width: '100%',alignItems:'center',flexDirection:'row' }}>
                        <Text
                            style={{ fontWeight: 'normal', fontSize: 13, color: props.style.color, textAlign: 'left', padding: 1,fontFamily:props.isArabic?fontFamily.arabicTextFontFamily: fontFamily.tittleFontFamily }}>
                            {props.textInputLabel}
                        </Text>
                    </View>
                    :
                    null
            }
            <View style={{ minHeight: HEIGHT * 0.06, justifyContent: 'center', width: '100%' }}>
                <TextInput
                    style={{ borderRadius: 5, borderWidth: 0.5, padding: 5, textAlign: 'left', fontSize: 12, backgroundColor: 'white', borderColor: 'gray', height: props.height ? props.height : 40,fontFamily:props.isArabic?fontFamily.arabicTextFontFamily:fontFamily.textFontFamily }}
                    secureTextEntry={props.isSecureTextEntry}
                    onChangeText={(val) => {
                        props.onChange(val);
                    }}
                    placeholder={props.placeholder}
                    multiline={props.isMultiline}
                    numberOfLines={props.numberOfLines}
                    value={props.value}
                    keyboardType={props.keyboardType}
                    maxLength={props.maxLength ? props.maxLength : 30}
                    editable={props.editable}
                />
            </View>
        </View>
    );

}

export default TextInputWithLabelComponent;