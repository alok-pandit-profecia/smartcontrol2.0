import axios from 'axios';
import { Alert, ToastAndroid } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Base64 from './Base64';
import { RealmController } from './../database/RealmController';
import LoginSchema from './../database/LoginSchema';
import TaskSchema from './../database/TaskSchema';
let realm = RealmController.getRealmInstance();
let loginData = RealmController.getLoginData(realm, LoginSchema.name);
loginData = loginData['0'] ? loginData['0'] : {};
let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

let APICallingService = {

    sendRequestForPostWithXML: (url: string, payload: any, CB: any) => {

        let options = {
            method: 'POST',
            url: url,
            timeout: 1000 * 3,
            headers: {
                "Accept": "/",
                // 'Authorization': auth,
                'Content-Type': 'text/xml; charset=utf-8',
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            data: payload
        };

        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForWSDLAPI: (url: string, payload: any, CB: any) => {

        let options = {
            method: 'POST',
            url: url,
            timeout: 1000 * 3,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            data: payload
        };

        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForPostWithAuthJson: (url: string, payload: any, auth: string, CB: any) => {

        let options = {};
        var params = payload;

        // let autherization = 'Basic ' + base64.encode(username + ":" + password);
        //  let autherization = 'Basic bGlmZXJheV9hY2Nlc3NAc2NvLmFlOkluZGlhQDEyMzQ=';

        if (auth != null && auth != '') {
            options = {
                method: 'POST',
                url: url,
                timeout: 1000 * 3,
                headers: {
                    'Authorization': auth,
                    'Content-Type': 'application/json',
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                data: params
            };
        }
        else {
            options = {
                method: 'POST',
                url: url,
                timeout: 1000 * 3,
                headers: {
                    'Content-Type': 'application/json',
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''
                },
                data: params
            };
        }
        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForPutWithAuthJSON: (url: string, param: any, payload: any, CB: any) => {
        let username = param.username;
        let password = param.password;

        let options = {};

        // let autherization = 'Basic ' + base64.encode(username + ":" + password);
        let autherization = 'Basic bGlmZXJheV9hY2Nlc3NAc2NvLmFlOkluZGlhQDEyMzQ=';

        if (payload != null && payload != '') {
            options = {
                method: 'PUT',
                url: url,
                timeout: 1000 * 3,
                headers: {
                    'Authorization': autherization,
                    'Content-Type': 'application/json',
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                data: payload
            };
        }
        else {
            options = {
                method: 'PUT',
                url: url,
                timeout: 1000 * 3,
                headers: {
                    'Authorization': autherization,
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            };
        }
        try {

            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForPutWithAuth: (url: any, payload: any, auth: any, CB: any) => {
        let options = {};
        var params = payload;

        // let autherization = 'Basic ' + base64.encode(username + ":" + password);
        //  let autherization = 'Basic bGlmZXJheV9hY2Nlc3NAc2NvLmFlOkluZGlhQDEyMzQ=';

        if (auth != null && auth != '') {
            options = {
                method: 'PATCH',
                url: url,
                timeout: 1000 * 5,
                headers: {
                    'Authorization': auth,
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''

                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                data: params
            };
        }
        else {
            options = {
                method: 'PATCH',
                url: url,
                timeout: 1000 * 5,
                headers: {
                    'Content-Type': 'application/json',
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                data: params
            };
        }
        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForGet: async (url: string, CB: any) => {
        let options = {
            method: 'GET',
            url,
            timeout: 1000 * 5 * 60,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Accept": "application/json",
                "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz',
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''
            }
        };

        try {

            return await NetInfo.fetch().then(async (state: any) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendRequestForGetWithAuth: (url: any, auth: string, CB: any) => {
        // let autherization = 'Basic ' + base64.encode(username + ":" + password);

        let options = {};

        if (auth != '') {
            options = {
                method: 'GET',
                url: url,
                timeout: 1000 * 3,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                headers: {
                    'Authorization': auth,
                    "X-LicenseNumber": "",
                    "X-username": loginData.username ? loginData.username : ''
                },
            };
        }
        else {
            options = {
                method: 'GET',
                url: url,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                timeout: 1000 * 3,
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''
            };
        }

        try {
            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },


    sendRequestForDeleteWithAuth: (url: string, param: any, auth: any, CB: any) => {

        let options = {};

        options = {
            method: 'DELETE',
            url: url,
            timeout: 1000 * 3,
            headers: {
                'Authorization': auth,
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''

            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            data: param
        };
        try {

            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    });
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendGetRequest: async (url: string, CB: any) => {

        debugger;

        var username = "soauser";
        var password = "soauser123";
        var base64 = Base64.btoa(username + ":" + password);

        let options = {
            method: 'GET',
            url,
            timeout: 1000 * 5 * 60,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Accept": "application/json",
                "Authorization": 'Basic ' + base64,
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''

            }
        };
        // //console.log("options", JSON.stringify(options));
        debugger;
        try {

            return NetInfo.fetch().then((state: any) => {
                if (state.isConnected) {
                    return axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                }
                                :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }

    },
    // sendRequestForWSDLAPI: (url: string, payload: any, CB: any) => {

    //     let options = {
    //         method: 'POST',
    //         url: url,
    //         timeout: 1000 * 3,
    //         headers: {
    //             'Content-Type': 'text/xml; charset=utf-8'
    //         },
    //         data: payload
    //     };

    //     try {
    //         return NetInfo.fetch().then((state: any) => {
    //             if (state.isConnected) {
    //                 return axios(options).then(response => {
    //                     let responseOK = response && response.status == 200;
    //                     if (responseOK) {
    //                         return JSON.parse(response.data.Data);
    //                     }
    //                     else {
    //                         return {
    //                             Status: 'Failed',
    //                             error: response.data
    //                         }
    //                     }
    //                 })
    //             }
    //             else {
    //                 ToastAndroid.show('No internet connection', 1000)
    //                 return {
    //                     Status: 'Failed',
    //                     message: 'NoInternet'
    //                 }
    //             }
    //         });

    //     } catch (e) {
    //         return {
    //             Status: 'Failed',
    //             error: e
    //         }
    //     }
    // },
    sendPostRequest: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''
                // 'Content-Type': 'application/json;charset=UTF-8',
                // "Content-Type": "application/json",
                // "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz'
            },
            data: payload
        };
        // //console.log("options", JSON.stringify(options));
        try {

            return await NetInfo.fetch().then(async (state: any) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            return {
                Status: 'Failed',
                error: e
            }
        }
    },
    sendPostRequestJson: async (url: string, payload: any, taskId: string, CB: any) => {

        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 8,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers:
                taskId ?
                    {
                        "Accept": "application/json",
                        "X-TaskId": taskId,
                        "X-LicenseNumber": "",
                        "X-username": loginData.username ? loginData.username : ''
                    }
                    :
                    {
                        "Accept": "application/json",
                        "X-LicenseNumber": "",
                        "X-username": loginData.username ? loginData.username : ''
                    },
            data: payload
        };
        // console.log("options", JSON.stringify(options));
        try {
            debugger
            return await NetInfo.fetch().then(async (state: any) => {
                if (state.isConnected) {
                    return await axios(options).then((response: any) => {
                        let responseOK = response && response.status == 200;
                        // console.log("options", JSON.stringify(response));
                        if (responseOK) {
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                    })
                }
                else {
                    ToastAndroid.show('No internet connection', 1000)
                    return {
                        Status: 'Failed',
                        message: 'NoInternet'
                    }
                }
            });

        } catch (e) {
            // //console.log('checklist exceptiom'+e)
            debugger
            return {
                Status: 'Failed',
                error: e
            }
        }
    },

    sendSoapPostRequest: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                "Authorization": 'Basic ' + 'c29hdXNlcjpzb2F1c2VyMTIz',
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''

            },
            data: payload
        };
        // //console.log("options", JSON.stringify(options));
        try {
            return await NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        debugger;
                        if (responseOK) {
                            // //console.log("response.data", response.data)
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                        // return {
                        //     success: false,
                        //     Status: 'Failed',
                        //     error: response.data
                        // }
                    }).catch(e => {
                        // //console.log('InsideCatch: ', JSON.stringify(e));
                        debugger;
                        CB({
                            success: false,
                            Status: 'Failed',
                            error: e
                        })
                    })
                } else {

                    CB({
                        success: false,
                        Status: 'Failed',
                        message: 'NoInternet'
                    })
                    // Toast.show('noInternetConnection', Toast.LONG, Toast.CENTER);
                }
            })
        } catch (e) {
            // //console.log('InsideCatch: ', JSON.stringify(e));
            debugger;
            CB({
                success: false,
                Status: 'Failed',
                error: e
            })
        }
    },

    sendNewPostRequest: async (url: string, payload: any, CB: any) => {
        let options = {
            method: 'POST',
            url,
            timeout: 1000 * 5 * 60,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json',
                "X-LicenseNumber": "",
                "X-username": loginData.username ? loginData.username : ''
            },
            data: payload
        };
        // //console.log("options", JSON.stringify(options));
        try {
            return await NetInfo.fetch().then(async (state) => {
                if (state.isConnected) {
                    return await axios(options).then(response => {
                        let responseOK = response && response.status == 200;
                        // //console.log('contact list response---', response.data);
                        debugger;
                        if (responseOK) {
                            // parse the response.data
                            // //console.log("parsed data", response.data.TradelicenseHistory.Establishment[0].ListOfPartyRelationshipTo);
                            return (!response.data.Success ?
                                {
                                    Status: 'Failed',
                                    message: response.data.Message,
                                    ErrorMessage: response.data.StatusCode
                                } :
                                JSON.parse(response.data.Data))
                        }
                        else {
                            return {
                                Status: 'Failed',
                                message: response.data.Message,
                                ErrorMessage: response.data.StatusCode
                            }
                        }
                        // return {
                        //     success: false,
                        //     Status: 'Failed',
                        //     error: response.data
                        // }
                    }).catch(e => {
                        // //console.log('InsideCatch: ', JSON.stringify(e));
                        debugger;
                        CB({
                            success: false,
                            Status: 'Failed',
                            error: e
                        })
                    })
                } else {

                    CB({
                        success: false,
                        Status: 'Failed',
                        message: 'NoInternet'
                    })
                    // Toast.show('noInternetConnection', Toast.LONG, Toast.CENTER);
                }
            })
        } catch (e) {
            // //console.log('InsideCatch: ', JSON.stringify(e));
            debugger;
            CB({
                success: false,
                Status: 'Failed',
                error: e
            })
        }
    },

};


export default APICallingService;

