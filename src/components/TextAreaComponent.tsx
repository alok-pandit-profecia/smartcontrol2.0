import React, { useContext, createRef, useEffect } from 'react';
import { TextInput } from 'react-native';
import { fontFamily, fontColor } from '../config/config';
import { Context } from '../utils/Context';
import Strings from './../config/strings';


interface Props {
    style: any,
    placeholder: string,
    placeholderTextColor?: string,
    isSecureTextEntry?: boolean,
    onChange: (e: any) => void,
    isMultiline?: boolean,
    numberOfLines?: number,
    value?: string,
    keyboardType?: string,
    maxLength?: number,
}
const TextInputComponent = (props: Props) => {
    const context = useContext(Context);

    return (
        <TextInput
            style={[props.style,{backgroundColor:'#c0c0c0'}]}
            value={props.value != 'null' ? props.value : '-'}
            maxLength={props.maxLength ? props.maxLength : 50}
            multiline={props.isMultiline ? props.isMultiline : true}
            numberOfLines={props.numberOfLines}
            placeholder={props.placeholder}
            editable={false}
            keyboardType={props.keyboardType}
            placeholderTextColor={fontColor.TextBoxTitleColor}
            onChangeText={props.onChange}>
        </TextInput>
    );

}

export default TextInputComponent;
