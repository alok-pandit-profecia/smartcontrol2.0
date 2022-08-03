const validator = {

    validateNotEmpty: (str: string) => {
        let regex = new RegExp('.{1,}', 'g');
        return regex.test(str);
    },

    validateUsername: (str: string) => {
        debugger;
        let isErrorInUserName: any = false;
        if (str === '') {
            return true;
        }
        if (str && str.trim()) {
            debugger;
            let regex = new RegExp('^([a-zA-Z]).{0,30}$', 'g');
            if (!regex.test(str)) {
                isErrorInUserName = "invalid";
            }
        }
        else {
            isErrorInUserName = true;
        }
        return isErrorInUserName;
    },

    validateFormName: (str: string, entityType: string) => {

        let isErrorInFormNames: any = 0;

        if (str && str.trim()) {
            let regex = new RegExp(/^[\u0621-\u064AA-Za-z \n]{0,50}$/, 'g');
            if (!regex.test(str)) {
                isErrorInFormNames = 1;
            }
        }
        else {

            if (entityType === 'caseStudy') {
                isErrorInFormNames = false;
            }
            else {
                isErrorInFormNames = true;
            }
        }
        return isErrorInFormNames;
    },

    validatePassword: (str: string) => {
        let isErrorInPassword: any = false;
        if (str === '') {
            return true;
        }
        if (str && str.trim()) {
            if (!(str.length >= 8 && str.length <= 20)) {
                isErrorInPassword = "invalid";
            }
        }
        else {
            isErrorInPassword = true;
        }
        return isErrorInPassword;
    },


    validatePhone: (contactNumber: any) => {
        if (!contactNumber) {
            return true;
        }
        let contactNumberLen = contactNumber.length;
        if (contactNumberLen < 9 || contactNumberLen > 13) {
            return "invalid";
        }
        else {
            return false
        }
        // let contactNumAfterReplace = contactNumber.replace("-", "");
        // let contactNumAfterReplace2 = contactNumAfterReplace.replace("-", "");
        // let posIfValueIsPresentInStringOrNot = contactNumber.indexOf("-");
        // if (posIfValueIsPresentInStringOrNot >= 0) {
        //     if ((contactNumberLen === 11 || contactNumberLen === 12) && parseInt(contactNumAfterReplace2) > 0) {
        //         let firstLetter = contactNumber.charAt(0);
        //         let secondLetter = contactNumber.charAt(1);
        //         if (
        //             parseInt(firstLetter) === 0 &&
        //             (
        //                 parseInt(secondLetter) === 5 ||
        //                 parseInt(secondLetter) === 2 ||
        //                 parseInt(secondLetter) === 3
        //             )
        //         ) {
        //             return false;
        //         } else {
        //             return 1;
        //         }
        //     } else {
        //         return 1;
        //     }
        // } else {
        //     if ((contactNumberLen === 9 || contactNumberLen === 10) && parseInt(contactNumAfterReplace2) > 0) {
        //         let firstLetter = contactNumber.charAt(0);
        //         let secondLetter = contactNumber.charAt(1);
        //         if (
        //             parseInt(firstLetter) === 0 &&
        //             (
        //                 parseInt(secondLetter) === 5 ||
        //                 parseInt(secondLetter) === 2 ||
        //                 parseInt(secondLetter) === 3
        //             )
        //         ) {
        //             return false;
        //         } else {
        //             return 1;
        //         }
        //     } else {
        //         return 1;
        //     }
        // }
    },

    validateEmail: (email: string) => {
        let isErrorInEmail: any = false;
        let isErrorForConfirmEmailAddress = 0;
        if (email === '') {
            return true;
        }
        if (email && email.trim()) {
            let reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            let regex = new RegExp(reg, 'g');
            if (!regex.test(email.trim())) {
                isErrorInEmail = "invalid";
            }
        }
        else {
            isErrorInEmail = true;
        }
        return isErrorInEmail;
    },

    validateNo: (str: string) => {
        debugger;
        let isError: any = false;
        if (str == "") {
            return true;
        }

        let regex = new RegExp('^([0-9]).{0,5}$', 'g');
        if (!regex.test(str)) {
            isError = "invalid";
        }
        else {
            isError = false;
        }
        return isError;
    },


    validateFieldEmpty: (field: string) => {
        let isErrorInField = false;
        if (!field) {
            isErrorInField = true;
        }
        return isErrorInField;
    },


    validationForAlphaNumericAddress(str: string) {
        let isError: any = false;
        let regex = new RegExp(/^([a-zA-Z0-9 \n./\-,()]+)$/, 'g');
        if (str && str.trim()) {
            if (!regex.test(str)) {
                isError = "invalid";
            }
        }
        else {
            isError = true;
        }
        return isError;
    },
    
     validateEfstCount: (str: any) => {
	        //debugger;
	        let isError: any = false;
	        if (str == "") {
	            return true;
	        }

	        let regex = new RegExp('^([0-9])');
	        //Alert.alert(JSON.stringify(regex));
	        if (!regex.test(str)) {
	            isError = "invalid";
	            //Alert.alert(JSON.stringify(isError));
	        }
	        else {
	            isError = false;           

	        }
	        return isError;
	    }

};

export const getFormattedDate = (date:any) => {
    return ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
        ("00" + date.getDate()).slice(-2) + "/" +
        date.getFullYear() + " " +
        ("00" + date.getHours()).slice(-2) + ":" +
        ("00" + date.getMinutes()).slice(-2) + ":" +
        ("00" + date.getSeconds()).slice(-2)
}

export default validator;