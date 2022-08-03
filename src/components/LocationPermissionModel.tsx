import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const LocationPermissionModel = (props: any) => {

    const cancelAlert = () => {
        props.closeAlert();
    }

    const confirmAlert = () => {
        props.okAlert();
    }

    return (

        <View style={{ height: HEIGHT * 1, width: WIDTH * 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', zIndex: 8, alignItems: 'center', position: 'absolute', ...StyleSheet.absoluteFillObject }}>

            <View style={{ height: '15%', width: '80%', alignSelf: 'center', backgroundColor: 'white', borderRadius: 20, marginHorizontal: 5 }}>

                <View style={{ flex: 0.7, backgroundColor: 'white' }} />

                <View style={{ flex: 1.5, backgroundColor: 'white', justifyContent: 'center', alignItems:props.isArabic?'flex-end': "flex-start",paddingRight:props.isArabic?3:0,paddingLeft:props.isArabic?0:3 }}>
                    <Text> {props.message}</Text>
                </View>

                <View style={{ flex: 1.5, backgroundColor: 'white', flexDirection:props.isArabic?'row-reverse': "row" }}>
                    <View style={{ flex: 1.2 }} />
                    <View style={{ flex: 0.3,justifyContent: "center", alignItems:props.isArabic?'flex-start':"center" }}>
                    <TouchableOpacity
                            onPress={() => { confirmAlert() }}
                        >
                            <Text style={{color:'green'}}>{props.okmsg}</Text>
                        </TouchableOpacity>
                     
                    </View>
                    <View style={{ flex: 0.3,  justifyContent: "center", alignItems: props.isArabic?'flex-start':'center' }}>
                    <TouchableOpacity
                            onPress={() => { cancelAlert() }}
                        >
                         <Text style={{color:'green'}}>{props.cancelmsg}</Text>
                     
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.1 }} />
                </View>
              
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    textModal: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        position: 'absolute',
        height: HEIGHT * 0.25,
        width: WIDTH * 0.9,
        backgroundColor: 'white',
        borderRadius: 5,
        zIndex: 8
    },

    alerttext: {
        fontSize: 18,
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        fontWeight: 'bold',
        color: 'white'
    },

    confirmMsg: {
        paddingTop: '5%',
        paddingRight: '5%',
        paddingLeft: '5%',
        paddingBottom: '5%',
        fontSize: 15,
        color: 'black',
    },

    buttonOkText: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: 17
    }

});

export default LocationPermissionModel