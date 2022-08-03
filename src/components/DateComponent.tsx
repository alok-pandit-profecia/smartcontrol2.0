import React, { useState, useEffect, useContext } from 'react';
import {
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

import DateTimePicker from "react-native-modal-datetime-picker";
import Strings from '../config/strings';
import { fontFamily, fontColor } from '../config/config';
import { Context } from './../utils/Context';

let moment = require('moment');

const DateComponent = (props: any) => {
    const context = useContext(Context);
    let f = props.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily;

    const [state, setState] = useState({ isDateVisible: false, date: '' });

    useEffect(() => {
        setState(
            prevState => { return { ...prevState, date: props.value } }
        );
    }, [props.value]);


    const showDateTimePicker = () => {

        setState(
            prevState => { return { ...prevState, isDateVisible: true } }
        );

    };

    const hideDateTimePicker = () => {

        setState(
            prevState => { return { ...prevState, isDateVisible: false } }
        );

    };

    const handleDatePicked = (date: any) => {

        let startDate = moment(date).format('L');
        setState(
            prevState => { return { ...prevState, date: startDate } }
        );
        hideDateTimePicker();
        props.updateDate(startDate);

    };

    return (

        <View
            style={{
                flex: 1,
                alignSelf: 'center',
            }}>

            <View
                style={{
                    height: '80%', width: '100%',
                    flexDirection: props.isArabic ? 'row-reverse' : 'row', borderRadius: 6,
                }}>

                <View style={{ justifyContent: 'center', flex: 1 }}>

                    <TouchableOpacity
                        style={{
                            flex: 1,
                            justifyContent: 'center',

                        }}
                        onPress={showDateTimePicker}
                        disabled={props.disabled ? props.disabled : false}
                    >

                        <View style={{ justifyContent: 'center', flex: 1, flexDirection: props.isArabic ? 'row-reverse' : 'row', }}>
                            <View style={{ justifyContent: 'center', flex: 1, borderRadius: 10, backgroundColor: fontColor.TextInputBoxColor }}>
                                <Text style={{ fontSize: 12, fontFamily: f, textAlign: 'center', color: '#5c666f' }}>
                                    {
                                        state.date && (state.date !== '') ? state.date.split('/')[1] : 'DD'
                                    }
                                </Text>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center'}}>
                                <Text style={{ fontSize: 18, fontFamily: f, textAlign: 'center', color: '#5c666f' }}>-</Text>
                            </View>
                            <View style={{ justifyContent: 'center', flex: 1, borderRadius: 10, backgroundColor: fontColor.TextInputBoxColor }}>
                                <Text style={{ fontSize: 12, fontFamily: f, textAlign: 'center', color: '#5c666f' }}>
                                    {
                                        state.date && (state.date !== '') ? state.date.split('/')[0] : 'MM'
                                    }
                                </Text>
                            </View>
                            <View style={{ flex: 0.3, justifyContent: 'center'}}>
                                <Text style={{ fontSize: 18, fontFamily: f, textAlign: 'center', color: '#5c666f' }}>-</Text>
                            </View>
                            <View style={{ justifyContent: 'center', flex: 1, borderRadius: 10, backgroundColor: fontColor.TextInputBoxColor }}>
                                <Text style={{ fontSize: 12, fontFamily: f, textAlign: 'center', color: '#5c666f' }}>
                                    {
                                        state.date && (state.date !== '') ? state.date.split('/')[2].split(' ')[0] : 'YYYY'
                                    }
                                </Text>
                            </View>

                        </View>

                        <DateTimePicker
                            date={props.date ? new Date(props.date) : new Date()}
                            isVisible={state.isDateVisible}
                            onConfirm={handleDatePicked}
                            maximumDate={props.maximumDate}
                            minimumDate={props.minimumDate}
                            onCancel={hideDateTimePicker} />

                    </TouchableOpacity >

                </View>

            </View>

            {
                props.invalidInputError && props.invalidInputError === true
                    ?
                    <Text style={{ fontSize: 13, fontFamily: f, color: "red", textAlign: props.isArabic ? "right" : 'left' }}>{Strings[context.isArabic ? 'ar' : 'en'].detentionForm.selectDate}</Text>
                    :
                    props.invalidInputError && props.invalidInputError === 1
                        ?
                        <View style={{ width: '100%', height: '20%' }}>
                            <Text style={{ fontSize: 13, fontFamily: f, color: "red", textAlign: props.isArabic ? "right" : 'left' }}>{props.errorText}</Text>
                        </View>
                        :
                        <View style={{ width: '100%', backgroundColor: '#c0c0c0' }}>
                        </View>
            }

        </View>
    );

}

export default DateComponent;