
import React, { useState } from 'react';
import { Image, TouchableOpacity, Text } from "react-native";
import { fontFamily, fontColor } from '../config/config';

const ButtonComponent = (props: any) => {

    const [disablebuttun, setDisablebuttun] = useState(false);


    return (
        <TouchableOpacity
            delayPressOut={props.delayPressOut? props.delayPressOut:1000}
            onPress={()=>{
                setDisablebuttun(true)
                props.buttonClick()
                setTimeout(() => {
                setDisablebuttun(false)
                }, (props.delayPressOut? props.delayPressOut:1000));
            }}
            disabled={props.disabled ? props.disabled : disablebuttun}
            style={[props.style, { backgroundColor: props.golive ? "#ffd700" : props.style && props.style.backgroundColor ? props.style.backgroundColor : fontColor.ButtonBoxColor, justifyContent: 'center', alignItems: 'center' }]}>
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
            {props.image ?
                <Image style={[props.imageStyle, { alignSelf: 'center' }]} source={props.image} />
                :
                <Text style={{ textAlign: 'left', fontFamily: props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: (props.golive || props.viewchecklist) ? fontColor.TitleColor : fontColor.white,textDecorationLine:props.viewchecklist ? 'underline' :'none'}}>
                    {props.buttonText}
                </Text>
            }
            {/* </View> */}
        </TouchableOpacity>
    )
}

export default ButtonComponent


