import moment from 'moment';
import { getFormattedDate } from './../../config/validator'
let test: any = [];
let testFollow: any = [];

let nocChecklistArray = Array();
let totalscore = 0;
let score = 0;
let totalScoreFollow = 0;
let maxScore = 0;
let minScore = 99;
let minVal = 99;
let minGrace = 99;
let minGraceFollow = 0;
let scorePercentageFollow: any = 0;
let scorePercentage: any = 0;
let grade = '';
let gradeNew = '';
let gradeFollow = '';
let visitFrequency = 0;
let nextVisitDate = '';
let action = '';
let opaDesc: any = '';
let inspectionStatus = '';
let inspectionStatusFlag = false;
let result = '';

export const getAction = (minScore: any) => {
    let scoreText = 'Satisfactory';
    switch (minScore) {
        case 0:
            scoreText = "Violation";
            break;
        case 1:
            scoreText = "Final Warning";
            break;
        case 2:
            scoreText = "First Warning";
            break;
        case 3:
            scoreText = "Notice";
            break;
        case 4:
            scoreText = "Satisfactory";
            break;
    }
    return scoreText;
}

export const getGrade = (scorePercentage: any) => {
    let grade = 'E';
    if (scorePercentage >= 90 && scorePercentage <= 100) {
        grade = 'A';
    } else if (scorePercentage >= 75 && scorePercentage < 90) {
        grade = 'B';
    } else if (scorePercentage >= 60 && scorePercentage < 75) {
        grade = 'C';
    } else if (scorePercentage >= 45 && scorePercentage < 60) {
        grade = 'D';
    } else if (scorePercentage < 45) {
        grade = 'E';
    }
    return grade;
}

const getVisitFrequencyForHigh = (grade: any) => {
    let temp: any = '';
    switch (grade) {
        case 'Grade A':
            temp = 3;
            break;
        case 'Grade B':
            temp = 4;
            break;
        case 'Grade C':
            temp = 9;
            break;
        case 'Grade D':
            temp = 13;
            break;
        case 'Grade E':
            temp = 13;
            break;
    }
    return temp;
}

// const calculation = () => {
//     //console.log("Inside cal");
//     taskItem.mappingData[0].isViolated = false;

//     var score = 0, totalScore = 0, scorePercentage = 0, minGrace = 1000, minScore = 99, weightage = 1;
//     for (var i = 0; i < checklistArray.length; i++) {

//         let obj = checklistArray[i];

//         if (checklistArray[i].NI == true) {
//             if (checklistArray[i].Comments.length == 0) {
//                 var j = i + 1;
//                 return;
//             }
//             else if (checklistArray[i].GracePeriod.toString().length > 0 && minGrace > parseInt(checklistArray[i].GracePeriod) && parseInt(checklistArray[i].GracePeriod) > 0) {
//                 minGrace = parseInt(checklistArray[i].GracePeriod);
//                 continue;
//             }
//             if (checklistArray[i].NI && (checklistArray[i].calculatedGracePeriod == '-')) {
//                 var j = i + 1;
//                 return;
//             }

//         }
//         else {
//             if (checklistArray[i].Comments.length == 0) {

//                 var j = i + 1;
//                 return;

//             }
//             if (checklistArray[i].Weightage == "" || checklistArray[i].Weightage == null) {
//                 weightage = 1;
//             } else {
//                 weightage = parseInt(checklistArray[i].Weightage);
//             }

//         }
//         //if (checklistArray[i].NI == true && checklistArray[i].Answers != 5) {
//         //    checklistArray[i].NI = false;
//         //}
//         //checklistArray[i].originalScore = checklistArray[i].FinalScore;
//         if (checklistArray[i].score == 'Y') {
//             checklistArray[i].FinalScore = 4;
//             checklistArray[i].GracePeriod = 0;
//             checklistArray[i].calculatedGracePeriod = 0;
//         }
//         if (parseInt(checklistArray[i].score) == 4) {
//             // For Score == 4
//             //  Score Calculation
//             checklistArray[i].FinalScore = 4;
//             checklistArray[i].GracePeriod = 0;
//             checklistArray[i].calculatedGracePeriod = 0;
//             score = score + parseInt(checklistArray[i].FinalScore) * checklistArray[i].Weightage;
//             totalScore = totalScore + (4 * weightage);

//         }
//         else {
//             // For score other than 4 , 
//             // If date is from future, do score and grace calculations
//             if (new Date(checklistArray[i].GracePeriodDate) > new Date()) {
//                 //Non Conformant Answered
//                 if (checklistArray[i].score != '' && checklistArray[i].score != '-' && !checklistArray[i].NI) {
//                     checklistArray[i].FinalScore = checklistArray[i].Answers;
//                     score = score + (parseInt(checklistArray[i].FinalScore) * weightage);
//                     totalScore = totalScore + (4 * weightage);
//                 }
//                 else {
//                     // Non Conformant not answered
//                     try {
//                         checklistArray[i].isNotAnswered = true;
//                         if (!isNaN(parseInt(checklistArray[i].score))) {
//                             checklistArray[i].FinalScore = checklistArray[i].score
//                         }
//                         else if (!isNaN(parseInt(checklistArray[i].Answers))) {
//                             checklistArray[i].FinalScore = checklistArray[i].Answers
//                         }

//                     }
//                     catch (e) {

//                     }
//                 }

//             }
//             else {
//                 // If current date,
//                 if (((checklistArray[i].score == '') || ((checklistArray[i].score) == '-')) && !App.isFromCompletedTask) {
//                     if (!(checklistArray[i].NI)) {
//                         var j = i + 1;
//                         return;
//                     }
//                 }
//                 else {
//                     var temp;
//                     if ((!isNaN(parseInt(checklistArray[i].Answers)))) {
//                         temp = parseInt(checklistArray[i].Answers);
//                     }
//                     else {
//                         temp = parseInt((checklistArray[i].Score / weightage));
//                     }
//                     if ((parseInt(checklistArray[i].Answers) > 0)) {
//                         if (!isNaN(parseInt(checklistArray[i].score))) {
//                             checklistArray[i].FinalScore = checklistArray[i].score;

//                         }
//                         else if ((checklistArray[i].score == 'N') && checklistArray[i].originalScore > 0) {
//                             checklistArray[i].FinalScore = checklistArray[i].originalScore - 1;
//                             checklistArray[i].Answers = checklistArray[i].FinalScore;
//                         }
//                     }
//                     else if ((parseInt(checklistArray[i].Answers) == 0)) {
//                         checklistArray[i].FinalScore = checklistArray[i].Answers;
//                     }
//                     score = score + (parseInt(checklistArray[i].FinalScore) * weightage);
//                     totalScore = totalScore + (4 * weightage);

//                 }
//             }
//         }
//         if ((checklistArray[i].GracePeriod) < 0) {
//             checklistArray[i].GracePeriod = 0;
//             checklistArray[i].calculatedGracePeriod = 0;
//         }
//         if (minScore > parseInt(checklistArray[i].FinalScore) && ((checklistArray[i].score.toString().length > 0) && (checklistArray[i].score != '-') && (!checklistArray[i].NI)))
//             minScore = parseInt(checklistArray[i].FinalScore);
//         if (checklistArray[i].GracePeriod.toString().length > 0 && minGrace > parseInt(checklistArray[i].GracePeriod) && parseInt(checklistArray[i].GracePeriod) > 0 && parseInt(checklistArray[i].FinalScore) < 4)
//             minGrace = parseInt(checklistArray[i].GracePeriod);
//         if (checklistArray[i])
//             checklistArray[i].isCalculated = true;

//     }



//     if (score == 0)
//         scorePercentage = 0;
//     else
//         scorePercentage = ((score / totalScore) * 100).toFixed(2);


//     //if (minScore > 0 && minScore!=4)
//     //  minScore--;

//     if (minScore == 0) {
//         taskItem.mappingData[0].isViolated = true;
//     }
//     if (minGrace == 1000) {
//         minGrace = 0;
//     }
//     else {
//         minGrace = 7;
//     }

//     grade = 'Grade' + ' ' + getGrade(scorePercentage);

//     scorePercentageFollow = scorePercentage;
//     minGraceFollow = minGrace;
//     totalScoreFollow = totalScore

// }

const getVisitFrequencyForMedium = (grade: string) => {
    let temp: any = '';
    switch (grade) {
        case 'Grade A':
            temp = 2;
            break;
        case 'Grade B':
            temp = 3;
            break;
        case 'Grade C':
            temp = 6;
            break;
        case 'Grade D':
            temp = 9;
            break;
        case 'Grade E':
            temp = 9;
            break;
    }
    return temp;
}

const getVisitFrequencyForLow = (grade: any) => {
    let temp: any = '';
    switch (grade) {
        case 'Grade A':
            temp = 2;
            break;
        case 'Grade B':
            temp = 3;
            break;
        case 'Grade C':
            temp = 5;
            break;
        case 'Grade D':
            temp = 6;
            break;
        case 'Grade E':
            temp = 6;
            break;
    }
    return temp;
}

export const replaceAll1 = (str: string, find: string, replace: string) => {
    if (str)
        return str.replace(new RegExp(find, 'g'), replace);
    else
        return '';
}

const checklistPayload = (checklistArray: any, taskItem: any) => {

    try {

        for (let index = 0; index < checklistArray.length; index++) {

            if (taskItem.TaskType.toLowerCase().includes('noc')) {

                if ((checklistArray[index].Score == "Y") && (checklistArray[index].NAValue == 'N')) {
                    checklistArray[index].Score = 4;
                }
                else if ((checklistArray[index].Score == "N") && (checklistArray[index].NAValue == 'N')) {
                    checklistArray[index].Score = 0;
                }
                else if (checklistArray[index].NAValue == 'Y') {
                    checklistArray[index].Score = "";
                }
            }
            else {

                if (checklistArray[index].Score == "Y" && checklistArray[index].NAValue == 'N' && checklistArray[index].NIValue == 'N') {
                    checklistArray[index].Score = 4;
                }
                else if (checklistArray[index].Score == "N" && checklistArray[index].NAValue == 'N' && checklistArray[index].NIValue == 'N') {
                    checklistArray[index].Score = 0;
                }
                else if (checklistArray[index].NAValue == 'Y' || checklistArray[index].NIValue == 'Y') {
                    checklistArray[index].Score = "";
                }
            }

            checklistArray[index].comment = checklistArray[index].comment.replace(/[$~"?<>{}]/g, ' ');

            let checklist = {

                'GracePeriodDate': '',
                'Answers': checklistArray[index].Score,
                'DescriptionArabic': '',
                'GracePeriod': '',
                'QuestionNameArabic': '',
                'QuestionNameEnglish': checklistArray[index].NOC_parameter_regulation_article_no, //replaceAll1(checklistArray[index].NOC_parameter_regulation_article_no, '&amp;', '&'),
                'Weightage': '',
                'NonComplianceEnglish': '',
                'NonComplianceArabic': '',
                'NA': checklistArray[index].NAValue,
                'NI': checklistArray[index].NIValue ? checklistArray[index].NIValue : '',
                'Comments': checklistArray[index].comment.toString(), //.replace('&amp;', '&'),
                'DescriptionEnglish': checklistArray[index].NOC_parameter_inspection_criteria, //replaceAll1(checklistArray[index].NOC_parameter_inspection_criteria, '&amp;', '&'),
                'ParameterNumber': checklistArray[index].NOC_parameter_sl_no,
                'Regulation': '',
                'Score': checklistArray[index].Score

            };

            nocChecklistArray.push(checklist);
        }

        // alert(JSON.stringify(nocChecklistArray));
        //console.log("checklistArray"+JSON.stringify(nocChecklistArray))

        return nocChecklistArray;

    } catch (error) {
        //console.log(error)
    }

}

const submissionPayload = (taskType: string, checklistArray: any, taskId: string, taskItem: any, inspectorName: string, contactName: string, mobileNumber: string, emiratesId: string, finalTime: string, mainComment: string, rejectBtnClick: boolean, flashlightCBValue: any, thermometerCBValue: any, dataLoggerCBValue: any, luxmeterCBValue: any, UVlightCBValue: any, lat: string, long: string, nameOfBusinessOperator: string, action: string, SiebelTaskId: string, AssessmentScore: string, Description2: string, MaxScore: string, Name2: string, Percent: string, Template_Name: string, visitType: string, scope: string, noOfVisits: string, nextVisit: string, grade: string, fullScore: any, value: string) => {

    try {
        debugger;
        let payload = Object();
        opaDesc = getFormattedDate(new Date());
        let nocChecklistArray: any = Array();

        if (value == 'undefined' || value == undefined || value == '' || value == 'null') {
            value = 'checklist';
        }
        // console.log('taskType + >>>' + taskType.toString() + 'value >>' + value)
        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            nocChecklistArray = checklistPayload(checklistArray, taskItem);
        }
        else {
            scoreCalculations(checklistArray, taskItem);
        }

        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

            debugger;
            if (rejectBtnClick) {
                action = 'Not Completed';
                nocChecklistArray = [];
            }
            else {
                if (action.toLowerCase() == 'satisfactory') {
                    action = 'Inspection Approved';
                }
                else {
                    action = 'Inspection Rejected';
                }
            }
            payload = {
                "InterfaceID": "ADFCA_CRM_SBL_007",
                "TimeStamp": finalTime,
                "LegalRepName": "",
                "InspectionCheckList": {
                    "Inspection": {
                        "OPADesc": opaDesc,
                        "InspectorId": inspectorName,
                        "NearestDate": nextVisitDate,//nextVisitDate
                        "InspectorName": inspectorName,
                        "LanguageType": "ENU",
                        "GracePeriod": 1,
                        "TaskId": taskId,
                        "Thermometer": thermometerCBValue == true ? 'Y' : 'N',
                        "Flashlight": flashlightCBValue == true ? 'Y' : 'N',
                        "DataLogger": dataLoggerCBValue == true ? 'Y' : 'N',
                        "LuxMeter": luxmeterCBValue == true ? 'Y' : 'N',
                        "UVLight": UVlightCBValue == true ? 'Y' : 'N',
                        "ActualInspectionDate": opaDesc,
                        "ScorePercent": '',
                        "ContactName": contactName,
                        "MobileNumber": mobileNumber,
                        "EmiratesId": emiratesId,
                        "Latitude": lat,
                        "Longitude": long,
                        "Grade": "",// grade != '' ? (grade.length == 1) ? ('Grade ' + grade) : grade : gradeNew ? (gradeNew.length == 1) ? ('Grade ' + gradeNew) : gradeNew : gradeNew,
                        "Comment": mainComment,
                        "Score": '',//fullScore != '' ? fullScore : totalscore
                        "Action": "",//as diksha said noc and food poison has no action
                        "InspectionStatus": action,
                        "ListOfFsExpenseItem": {
                            "Checklist": nocChecklistArray
                        }
                    }
                }
            }
        }
        else if (taskType.toLowerCase() == 'closure inspection') {
            payload = {
                "InterfaceID": "ADFCA_CRM_SBL_007",
                "TimeStamp": finalTime,
                "LegalRepName": "",
                "InspectionCheckList": {
                    "Inspection": {
                        "OPADesc": opaDesc,
                        "InspectorId": inspectorName,
                        "NearestDate": '',
                        "InspectorName": inspectorName,
                        "LanguageType": "ENU",
                        "GracePeriod": '',
                        "TaskId": taskId,
                        "Thermometer": "",
                        "Flashlight": "",
                        "DataLogger": "",
                        "LuxMeter": "",
                        "UVLight": "",
                        "ActualInspectionDate": opaDesc,
                        "ScorePercent": '',
                        "ContactName": nameOfBusinessOperator,
                        "MobileNumber": '',
                        "EmiratesId": '',
                        "Latitude": lat,
                        "Longitude": long,
                        "Grade": grade != '' ? grade : gradeNew,
                        "Comment": mainComment,
                        "Score": fullScore != '' ? fullScore : totalscore,
                        "Action": '',
                        "InspectionStatus": action,
                        "ListOfFsExpenseItem": ''
                    }
                },
                "IsReschedule": ""
            }
        }
        else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor est inspection' || taskType.toLowerCase() == 'monitor inspector performance') {

            let today = new Date();
            let dd = today.getDate().toString();
            let mm = (today.getMonth() + 1).toString();
            var score;

            let yyyy = today.getFullYear();
            if (parseInt(dd) < 10) {
                dd = '0' + dd;
            }
            if (parseInt(mm) < 10) {
                mm = '0' + mm;
            }
            //console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds())
            let currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            let currentDate = mm + '/' + dd + '/' + yyyy + " " + currentTime;

            let checklistArrayAssessment = Array();
            for (let index = 0; index < checklistArray.length; index++) {
                const element = checklistArray[index];
                let obj = Object();
                obj.Assess_id = element.Assess_id;
                obj.AttributeName = element.AttributeName;
                obj.Comment2 = element.Comment2;
                obj.Order = element.Order;
                obj.Value = element.Score;
                checklistArrayAssessment.push(obj);
            }

            payload = {
                "ListOfAdfcaAirsUpdateQuestionnaireIo": {
                    "AdfcaAirsAction": {
                        "ActivityUID": taskId,
                        "ListOfSalesAssessment": {
                            "SalesAssessment": {
                                "ActivityId": taskId,
                                "Description2": Description2,
                                "Name2": Name2,
                                "Template_Name": Template_Name,
                                "Latitude": lat,
                                "Longitude": long,
                                "ListOfSalesAssessmentValue": {
                                    "SalesAssessmentValue": checklistArrayAssessment
                                }
                            }
                        }
                    }
                },
                "Attrib2": "",
                "Attrib3": noOfVisits,
                "Attrib4": scope,
                "Attrib5": "1.5.1",
                "TaskType": taskType,
                "TaskNumber": taskId,
                "InspectionDate": currentDate,
                "TaskStatus": action.toLowerCase() == 'satisfactory' ? "Inspection Approved" : "Inspection Rejected",
                "LoginName": inspectorName,
                "LoginId": inspectorName,
                "Attrib1": visitType,
                "Attrib6": currentDate,
                "Attrib7": finalTime,
                "Attrib8": contactName,
                "Attrib9": emiratesId,
                "Attrib10": mobileNumber
            }
        }
        else {

            for (let index = 0; index < test.length; index++) {
                const element = test[index];

                if (!isNaN(parseInt(element.GracePeriod))) {
                    if (element.GracePeriod && (minGrace > parseInt(element.GracePeriod)) && (parseInt(element.Answers) != 4)) {
                        minGrace = parseInt(element.GracePeriod);
                    }
                }
            }
            console.log("minGrace>>>>>>><<" + minGrace);
            
            payload = {
                "InterfaceID": "ADFCA_CRM_SBL_007",
                "TimeStamp": finalTime,
                "LegalRepName": "",
                "InspectionCheckList": {
                    "Inspection": {
                        "OPADesc": opaDesc,
                        "InspectorId": inspectorName,
                        "NearestDate": nextVisit,//nextVisitDate
                        "InspectorName": inspectorName,
                        "LanguageType": "ENU",
                        "GracePeriod": taskType.toLowerCase() == 'direct inspection' && value == 'withoutChecklist' ? '' : minGrace == 99 ? 0 : minGrace,
                        "TaskId": taskId,
                        "Thermometer": thermometerCBValue == true ? 'Y' : 'N',
                        "Flashlight": flashlightCBValue == true ? 'Y' : 'N',
                        "DataLogger": dataLoggerCBValue == true ? 'Y' : 'N',
                        "LuxMeter": luxmeterCBValue == true ? 'Y' : 'N',
                        "UVLight": UVlightCBValue == true ? 'Y' : 'N',
                        "ActualInspectionDate": opaDesc,
                        "ScorePercent": (((taskType.toLowerCase() == 'direct inspection') && (value == 'withoutChecklist')) || (taskType.toLowerCase() == 'complaints')) ? '' : scorePercentage,
                        "ContactName": contactName,
                        "MobileNumber": mobileNumber,
                        "EmiratesId": emiratesId,
                        "Latitude": lat,
                        "Longitude": long,
                        "Grade": (((taskType.toLowerCase() == 'direct inspection') && (value == 'withoutChecklist')) || (taskType.toLowerCase() == 'complaints')) ? '' : grade != "" ? grade : gradeNew,//taskType ==  "Follow-Up" ? gradeFollow : grade,
                        "Comment": mainComment,
                        "Score": (((taskType.toLowerCase() == 'direct inspection') && (value == 'withoutChecklist')) || (taskType.toLowerCase() == 'complaints')) ? '' : fullScore != '' ? fullScore : totalscore, //taskType == "Follow-Up" ? totalScoreFollow : totalscore,
                        "Action": (taskType.toLowerCase() == 'direct inspection') && (value == 'withoutChecklist') ? '' : action,
                        "InspectionStatus": inspectionStatus,
                        "ListOfFsExpenseItem": (taskType.toLowerCase() == 'direct inspection') && (value == 'withoutChecklist') ? '' : {
                            "Checklist": test
                        }
                    }
                },
                "IsReschedule": ""
            }
        }
        // console.log('payload >>>' + JSON.stringify(payload))

        return payload;
    }
    catch (e) {
        console.log("error: ", e)
        // alert(e);
        // return null
    }
}

export default submissionPayload;

const submissionPayloadFollow = (scoreFollowArray: any, taskDetails: any, checklistArray: any, taskId: string, taskItem: any, inspectorName: string, contactName: string, mobileNumber: string, emiratesId: string, finalTime: string, mainComment: string, resvult: string, flashlightCBValue: any, thermometerCBValue: any, dataLoggerCBValue: any, luxmeterCBValue: any, UVlightCBValue: any, lat: string, long: string, nextVisit: string, grade: string, fullScore: any) => {
    try {
        let testFollow = [];
        totalscore = 0;
        score = 0;
        totalScoreFollow = 0;
        maxScore = 0;
        minScore = 99;
        minGrace = 99;
        minGraceFollow = 99;
        scorePercentageFollow = 0;
        scorePercentage = 0;
        grade = '';
        gradeFollow = '';
        visitFrequency = 0;
        nextVisitDate = '';
        action = '';
        opaDesc = '';
        inspectionStatus = '';
        inspectionStatusFlag = false;
        let actionFollow = result, minValue = 99;

        const replaceAll1 = (str: string, find: string, replace: string) => {
            if (str)
                return str.replace(new RegExp(find, 'g'), replace);
            else
                return '';
        }

        const getAction = (minScore: any) => {
            let scoreText = '';
            switch (minScore) {
                case 0:
                    scoreText = "Violation";
                    break;
                case 1:
                    scoreText = "Final Warning";
                    break;
                case 2:
                    scoreText = "First Warning";
                    break;
                case 3:
                    scoreText = "Notice";
                    break;
                case 4:
                    scoreText = "Satisfactory";
                    break;
            }
            return scoreText;
        }

        const getGrade = (scorePercentage: any) => {

            let grade = 'E';
            if (scorePercentage >= 90 && scorePercentage <= 100) {
                grade = 'A';
            } else if (scorePercentage >= 75 && scorePercentage < 90) {
                grade = 'B';
            } else if (scorePercentage >= 60 && scorePercentage < 75) {
                grade = 'C';
            } else if (scorePercentage >= 45 && scorePercentage < 60) {
                grade = 'D';
            } else if (scorePercentage < 45) {
                grade = 'E';
            }
            return grade;
        }

        const getVisitFrequencyForHigh = (grade: any) => {
            let temp: any = '';
            switch (grade) {
                case 'Grade A':
                    temp = 3;
                    break;
                case 'Grade B':
                    temp = 4;
                    break;
                case 'Grade C':
                    temp = 9;
                    break;
                case 'Grade D':
                    temp = 13;
                    break;
                case 'Grade E':
                    temp = 13;
                    break;
            }
            return temp;
        }

        const getVisitFrequencyForMedium = (grade: string) => {
            let temp: any = '';
            switch (grade) {
                case 'Grade A':
                    temp = 2;
                    break;
                case 'Grade B':
                    temp = 3;
                    break;
                case 'Grade C':
                    temp = 6;
                    break;
                case 'Grade D':
                    temp = 9;
                    break;
                case 'Grade E':
                    temp = 9;
                    break;
            }
            return temp;
        }

        const getVisitFrequencyForLow = (grade: any) => {
            let temp: any = '';
            switch (grade) {
                case 'Grade A':
                    temp = 2;
                    break;
                case 'Grade B':
                    temp = 3;
                    break;
                case 'Grade C':
                    temp = 5;
                    break;
                case 'Grade D':
                    temp = 6;
                    break;
                case 'Grade E':
                    temp = 6;
                    break;
            }
            return temp;
        }

        for (let index = 0; index < checklistArray.length; index++) {
            // console.log("Checklost", JSON.stringify(checklistArray));
            let obj = checklistArray[index];
            // console.log("Final score", JSON.stringify(obj))

            if (obj.isNotAnswered) {
                obj.NI = "Y";
                // obj.Score = 0;
                // obj.score = 0;
                // obj.Answers = 0;
            }

            if (obj.parameter_type === 'EHS') {
                // TODO
            }
            else {
                if ((obj.NI == false) || (obj.NI == 'N')) {
                    if ((parseInt(obj.Answers) != 4) && !isNaN(parseInt(obj.Answers))) {
                        inspectionStatusFlag = true;
                        break;
                    }
                }
            }
        }
        for (let index = 0; index < checklistArray.length; index++) {
            // console.log("Checklost", JSON.stringify(checklistArray));
            let obj = checklistArray[index];
            // console.log("Final score", JSON.stringify(obj))

            let scoreFollowArr = (scoreFollowArray);
            // console.log("score Arr", scoreFollowArr[0]);
            // console.log("score Arr minGrace::", scoreFollowArr[0].GracePeriod);

            if (taskDetails.TaskType == "Follow-Up") {
                // console.log("In follow::" + scoreFollowArr[0].calculatedGracePeriod)
                // minGraceFollow = scoreFollowArr[0].calculatedGracePeriod ? parseInt(scoreFollowArr[0].calculatedGracePeriod) : 99;
                totalScoreFollow = scoreFollowArr[0].totalScore ? parseInt(scoreFollowArr[0].totalScore) : 0;
                score = scoreFollowArr[0].score ? parseInt(scoreFollowArr[0].score) : 0;
                scorePercentageFollow = scoreFollowArr[0].scorePercent ? parseInt(scoreFollowArr[0].scorePercent) : 0;
                // scorePercentageFollow = ((score / totalScoreFollow) * 100).toFixed(2);
                gradeFollow = 'Grade' + ' ' + getGrade(scorePercentageFollow);
            }

            // calculate total score

            //add regex to find covid que
            if ((obj.QuestionNameEnglish == 'EHS') || (obj.ParameterNumber == '3(1/3)') || (obj.ParameterNumber == '3(2/3)') || (obj.ParameterNumber == '4(4)') || (obj.ParameterNumber == '6(1/6)')
                || (obj.ParameterNumber == '6(2/6)') || (obj.ParameterNumber == '6(4/6)') || (obj.ParameterNumber == '6(5/6)') || (obj.ParameterNumber == '6(6/6)') || (obj.ParameterNumber == '6(7/6)')
                || (obj.ParameterNumber == '6(8/6)') || (obj.ParameterNumber == '11(3/11)') || obj.isNotAnswered) {

            }
            else {
                let scor = obj.Score != '' ? parseInt(obj.Score) : 0;
                totalscore = totalscore + scor;
                // calculate max score
                // maxScore = maxScore + (4 * parseInt(obj.parameter_weight_mobility));
                maxScore = maxScore + (4 * parseInt(obj.Weightage));
                console.log("score Arr", totalscore + "," + maxScore);
            }

            if (obj.QuestionNameEnglish == 'EHS') {
                // TODO
                obj.Answers = ''
                obj.grace = ''
                obj.NAValue = ''
                obj.NIValue = ''
                obj.comment = obj.Score == 0 ? "Unsatisfactory" : "Satisfactory"
                obj.TotalScoreForQuestion = ''
            }
            else {
                // calculate min score

                if ((obj.Answers == '-') || (obj.Answers == '')) {
                    if (obj.Answers == 0) {
                        minVal = obj.Answers;
                        // console.log("minScoreminSc>>" + obj.Answers);
                        // break;
                    }
                    else {
                        minVal = obj.Answers;
                    }
                }
                else {
                    if ((minScore > parseInt(obj.Answers)) && (!obj.NI)) {
                        minScore = parseInt(obj.Answers);
                    }
                }

                if ((obj.Answers == '-') || (obj.Answers == '')) {
                    if (obj.Answers == 0) {
                        minValue = obj.Answers;
                        // console.log("minScoreminSc>>" + obj.Answers);
                        // break;
                    }
                    else {
                        if ((minValue > parseInt(obj.Answers))) {
                            minValue = parseInt(obj.Answers);
                        }
                    }
                }
                else {
                    if ((minValue > parseInt(obj.Answers))) {
                        minValue = parseInt(obj.Answers);
                    }
                }
            }


            // calculate min grade
            // console.log("obj.grace::" + JSON.stringify(obj.calculatedGracePeriod) + "obj.answer::" + JSON.stringify(obj.Answers))
            // if (obj.calculatedGracePeriod && (parseInt(minGraceFollow) > parseInt(obj.calculatedGracePeriod)) && (parseInt(obj.Answers) !== 4)) {
            //     minGraceFollow = parseInt(obj.calculatedGracePeriod);
            //     console.log("INGrace"+minGraceFollow+',new:'+minGraceFollow)
            // }
            if (obj.GracePeriod && (minGraceFollow > parseInt(obj.GracePeriod)) && (parseInt(obj.Answers) !== 4)) {
                minGraceFollow = parseInt(obj.GracePeriod);
                // console.log("INGrace" + minGraceFollow + ',new:' + minGraceFollow)
            }
            // debugger;

            if (obj.ParameterNumber == null) {
                obj.ParameterNumber = ""
            }


            var dataTosend: any = obj.FinalScore * obj.Weightage;

            if (obj.NI == true || obj.NI == "Y") {
                obj.NI = "Y";
                dataTosend = '';
            }
            else {
                obj.NI = "N";
            }

            var ansToSend;
            try {
                if (isNaN(obj.Weightage))
                    obj.Weightage = 1;

                if (!isNaN(dataTosend) && dataTosend.toString().length > 0) {
                    ansToSend = dataTosend / obj.Weightage;
                }
                else {
                    ansToSend = '';
                }
            }
            catch (e) {
                console.log('sssss::' + e)
            }

            let weight = obj.Weightage ? parseInt(obj.Weightage) : 1;
            let tempObject = {
                "GracePeriodDate": "",
                "Answers": (obj.QuestionNameEnglish == 'EHS') ? "" : (((obj.NI == true || obj.NI == "Y") && !obj.isNotAnswered) ? "" : obj.Score.toString() === '0' ? "0" : obj.Answers),
                "DescriptionArabic": "",
                "GracePeriod": (((obj.Score) / weight) == 4) ? "" : obj.GracePeriod,
                "QuestionNameArabic": "",
                "QuestionNameEnglish": obj.QuestionNameEnglish, //replaceAll1(obj.QuestionNameEnglish, '&amp;', '&'),
                "Weightage": obj.Weightage,
                "NonComplianceEnglish": "",
                "NonComplianceArabic": "",
                "NA": obj.NA,
                "Action": obj.Action ? obj.Action : "",
                "NI": obj.NI,
                "Comments": obj.Comments,// replaceAll1(obj.Comments, '&amp;', '&'),
                "DescriptionEnglish": obj.DescriptionEnglish, //replaceAll1(obj.DescriptionEnglish, '&amp;', '&'),
                "ParameterNumber": obj.ParameterNumber,
                "Regulation": "",
                "Score": obj.QuestionNameEnglish == 'EHS' ? '' : ((obj.NI == true || obj.NI == "Y") && !obj.isNotAnswered) ? "" : obj.Score
            };

            testFollow.push(tempObject);
        }

        // calculate grade percentage
        if (totalscore) {
            totalscore = totalscore
        }
        else {
            totalscore = 0
        }
        scorePercentageFollow = ((totalscore / maxScore) * 100);
        scorePercentageFollow = scorePercentageFollow.toFixed(2);
        // console.log("scorePercentageFollow::" + scorePercentageFollow + ',' + totalscore + ',' + maxScore)
        // calculate grade 
        grade = 'Grade' + ' ' + getGrade(scorePercentageFollow);

        // calculate next visit date
        // console.log("taskItem.RiskCategory::" + taskItem.RiskCategory + 'Grade::' + grade)
        if (taskItem.RiskCategory) {
            if (taskItem.RiskCategory.toLowerCase() === "high") {
                let temp = getVisitFrequencyForHigh(grade);
                visitFrequency = Math.round((365 / temp));
                debugger;
            } else if (taskItem.RiskCategory.toLowerCase() === "medium") {
                let temp = getVisitFrequencyForMedium(grade);
                visitFrequency = Math.round((365 / temp));
                debugger;
            } else if (taskItem.RiskCategory.toLowerCase() === "low") {
                let temp = getVisitFrequencyForLow(grade);
                visitFrequency = Math.round((365 / temp));
                debugger;
            }
        }

        if (moment().add(visitFrequency, 'days').format('dddd') === 'Friday') {
            visitFrequency += 2
        } else if (moment().add(visitFrequency, 'days').format('dddd') === 'Saturday') {
            ++visitFrequency;
        }
        console.log("visitFrequency::" + (moment().add(visitFrequency, 'days').format('YYYY-MM-DD')))

        nextVisitDate = moment().add(visitFrequency, 'days').format('YYYY-MM-DD');

        // calculate action using mins score
        action = getAction(minValue);

        // get formatted date
        opaDesc = getFormattedDate(new Date());

        // inspection status
        if (inspectionStatusFlag) {
            inspectionStatus = 'Inspection Rejected';
        } else {
            inspectionStatus = 'Inspection Approved';
        }

        debugger;
        if (taskItem.TaskType.toLowerCase() == 'complaints') {
            nextVisitDate = '';
            grade = '';
            totalscore = '';
        }

        console.log("scorePercentageFollow::" + minGrace)
        let payload = {
            "InterfaceID": "ADFCA_CRM_SBL_007",
            "TimeStamp": finalTime,
            "LegalRepName": "",
            "InspectionCheckList": {
                "Inspection": {
                    "OPADesc": opaDesc,
                    "InspectorId": inspectorName,
                    "NearestDate": nextVisitDate,//nextVisitDate
                    "InspectorName": inspectorName,
                    "LanguageType": "ENU",
                    "GracePeriod": minGraceFollow == 99 ? 0 : minGraceFollow,
                    "TaskId": taskId,
                    "Thermometer": thermometerCBValue == true ? 'Y' : 'N',
                    "Flashlight": flashlightCBValue == true ? 'Y' : 'N',
                    "DataLogger": dataLoggerCBValue == true ? 'Y' : 'N',
                    "LuxMeter": luxmeterCBValue == true ? 'Y' : 'N',
                    "UVLight": UVlightCBValue == true ? 'Y' : 'N',
                    "ActualInspectionDate": opaDesc,
                    "ScorePercent": scorePercentageFollow,
                    "ContactName": contactName,
                    "MobileNumber": mobileNumber,
                    "EmiratesId": emiratesId,
                    "Latitude": lat,
                    "Longitude": long,
                    "Grade": grade,//gradeFollow,
                    "Comment": mainComment,
                    "Score": totalscore,
                    "Action": resvult, //action,
                    "InspectionStatus": inspectionStatus,
                    "ListOfFsExpenseItem": {
                        "Checklist": testFollow
                    }
                }
            },
            "IsReschedule": ""
        }
        return payload;
    }
    catch (e) {
        console.log("error: ", e)
        return null
        // alert('Exception' + e);
    }
}

export { submissionPayloadFollow };

const scoreCalculations = (checklistArray: any, taskItem: any) => {

    test = [];
    nocChecklistArray = Array();
    totalscore = 0;
    score = 0;
    totalScoreFollow = 0;
    maxScore = 0;
    minScore = 99;
    minGrace = 99;
    minGraceFollow = 99;
    scorePercentageFollow = 0;
    scorePercentage = 0;
    grade = '';
    gradeFollow = '';
    visitFrequency = 0;
    nextVisitDate = '';
    action = '';
    opaDesc = '';
    inspectionStatus = '';
    inspectionStatusFlag = false;
    result = '';
    debugger;
    try {
        // console.log("checklistArray.length??"+checklistArray.length)
        if (taskItem.TaskType.toLowerCase().includes('noc')) {
            for (let index = 0; index < checklistArray.length; index++) {

                let obj: any = checklistArray[index];
                // calculate inspection status
                action = 'Satisfactory';
                if (obj.Score == "N") {
                    action = 'UnSatisfactory';
                    break;
                }
                else {
                    continue;
                }
            }
            return { action, scorePercentage }
        }
        if (taskItem.TaskType.toLowerCase().includes('food')) {

            for (let index = 0; index < checklistArray.length; index++) {

                let obj: any = checklistArray[index];
                // calculate inspection status
                action = 'Satisfactory';
                console.log('obj.NAValue ' + obj.NAValue + ':: ' + obj.NIValue);
                if (obj.NAValue == 'Y' || obj.NIValue == 'Y') {
                    action = 'UnSatisfactory';
                    break;
                }
                else {
                    continue;
                }
            }
            console.log('action ::' + action)
            return { action, scorePercentage }

        }
        else if (taskItem.TaskType.toLowerCase() == 'supervisory inspections') {
            for (let index = 0; index < checklistArray.length; index++) {

                let obj: any = checklistArray[index];
                // calculate inspection status
                action = 'Satisfactory';
                if (obj.Score.toLowerCase() == "na" || obj.Score.toLowerCase() == "unsatisfactory") {
                    action = 'UnSatisfactory';
                    break;
                }
                else {
                    continue;
                }
            }
            return { action, scorePercentage }
        }
        else {
            for (let index1 = 0; index1 < checklistArray.length; index1++) {

                console.log("2 >>>" + inspectionStatusFlag);

                let obj = checklistArray[index1];


                // if (taskItem.TaskType == "Follow-Up") {
                //     //console.log("In follow")
                //     minGraceFollow = parseInt(obj.GracePeriod);
                //     score = score + (parseInt(obj.FinalScore) * parseInt(obj.Weightage));
                //     totalScoreFollow = totalScoreFollow + (4 * parseInt(obj.Weightage));
                //     scorePercentageFollow = ((score / totalScoreFollow) * 100).toFixed(2);
                //     gradeFollow = 'Grade' + ' ' + getGrade(scorePercentageFollow);

                // }

                // calculate total score
                // let scor = obj.TotalScoreForQuestion != '' ? parseInt(obj.TotalScoreForQuestion) : 0;
                let scor = obj.Score != '' ? parseInt(obj.Score) : 0;

                console.log('obj.Score ?? ' + obj.Score);
                if ((obj.parameter_type == 'EHS') || (obj.ParameterNumber == '3(1/3)') || (obj.ParameterNumber == '3(2/3)') || (obj.ParameterNumber == '4(4)') || (obj.ParameterNumber == '6(1/6)')
                    || (obj.ParameterNumber == '6(2/6)') || (obj.ParameterNumber == '6(4/6)') || (obj.ParameterNumber == '6(5/6)') || (obj.ParameterNumber == '6(6/6)') || (obj.ParameterNumber == '6(7/6)')
                    || (obj.ParameterNumber == '6(8/6)') || (obj.ParameterNumber == '11(3/11)')) {

                }
                else {
                    totalscore = totalscore + scor;
                    let parameter_weight = obj.parameter_weight_mobility != '' ? obj.parameter_weight_mobility : 1

                    maxScore = maxScore + (4 * parseInt(parameter_weight));
                }
                // calculate max score
                // console.log("obj.TotalScoreForQuestion:"+obj.Score)

                if (obj.parameter_type === 'EHS') {
                    // TODO
                    // obj.Answers = '';
                    // obj.grace = '';
                    // obj.NAValue = '';
                    // obj.NIValue = '';
                    obj.comment = obj.TotalScoreForQuestion == 0 ? "Unsatisfactory" : "Satisfactory";
                    // obj.TotalScoreForQuestion = '';
                    // obj.Score = '';
                    // obj.score = '';
                }
                else {
                    // calculate min score
                    if (minScore > parseInt(obj.Answers)) {
                        minScore = parseInt(obj.Answers);
                    }
                    if (minVal > parseInt(obj.Answers)) {
                        minVal = parseInt(obj.Answers);
                    }
                }


                // calculate min grade
                if (obj.grace && (minGrace > parseInt(obj.grace)) && (parseInt(obj.Answers) != 4)) {
                    minGrace = parseInt(obj.grace);
                }
                // debugger;
                let parameter_weight = obj.parameter_weight_mobility != '' ? obj.parameter_weight_mobility : 1

                let tempObject = {
                    "GracePeriodDate": "",
                    "Answers": obj.parameter_type === 'EHS' ? '' : obj.Answers,
                    "DescriptionArabic": "",
                    "GracePeriod": obj.parameter_type === 'EHS' ? '' : obj.grace,
                    "QuestionNameArabic": "",
                    "QuestionNameEnglish": obj.parameter_type,//replaceAll1(obj.parameter_type, '&amp;', '&'),
                    "Weightage": obj.parameter_type === 'EHS' ? '' : parameter_weight,
                    "NonComplianceEnglish": "",
                    "NonComplianceArabic": "",
                    "NA": obj.parameter_type === 'EHS' ? 'N' : obj.NA,
                    "EFSTFlag": "",
                    "Action": "",
                    "NI": obj.parameter_type === 'EHS' ? 'N' : obj.NI,
                    "Comments": obj.comment,//replaceAll1(obj.comment, '&amp;', '&'),
                    "MaxGracePeriod": obj.parameter_grace_maximum ? parseInt(obj.parameter_grace_maximum) : 30,
                    "MinGracePeriod": obj.parameter_grace_minimum ? parseInt(obj.parameter_grace_minimum) : 0,
                    "DescriptionEnglish": obj.parameter,//replaceAll1(obj.parameter, '&amp;', '&'),
                    "ParameterNumber": obj.parameter_reference,
                    "Regulation": "",
                    "Score": obj.parameter_type === 'EHS' ? '' : obj.Score
                };

                test.push(tempObject);
                // console.log('test ::' + JSON.stringify(test));
                if (totalscore) {
                    totalscore = totalscore
                }
                else {
                    totalscore = 0
                }
                scorePercentage = ((totalscore / maxScore) * 100);
                scorePercentage = scorePercentage.toFixed(2);
                console.log("obj.totalscore:" + totalscore + ",maxScore:" + maxScore)
                // calculate grade 
                gradeNew = 'Grade' + ' ' + getGrade(scorePercentage);
                // console.log("taskItem.RiskCategory::" + taskItem.RiskCategory + 'scorePercentage::' + scorePercentage)

                // calculate next visit date
                if (taskItem.RiskCategory) {
                    if (taskItem.RiskCategory.toLowerCase() === "high") {
                        let temp = getVisitFrequencyForHigh(grade);
                        visitFrequency = Math.round((365 / temp));
                        debugger;
                    } else if (taskItem.RiskCategory.toLowerCase() === "medium") {
                        let temp = getVisitFrequencyForMedium(grade);
                        visitFrequency = Math.round((365 / temp));
                        debugger;
                    } else if (taskItem.RiskCategory.toLowerCase() === "low") {
                        let temp = getVisitFrequencyForLow(grade);
                        visitFrequency = Math.round((365 / temp));
                        debugger;
                    }
                }

                if (moment().add(visitFrequency, 'days').format('dddd') === 'Friday') {
                    visitFrequency += 2
                } else if (moment().add(visitFrequency, 'days').format('dddd') === 'Saturday') {
                    ++visitFrequency;
                }

                nextVisitDate = moment().add(visitFrequency, 'days').format('YYYY-MM-DD');
                console.log('nextVisitDate::' + nextVisitDate)

                // calculate action using mins score
                action = getAction(minVal);

                // get formatted date
                opaDesc = getFormattedDate(new Date());

            }
            for (let index = 0; index < checklistArray.length; index++) {

                let obj1: any = checklistArray[index];
                // calculate inspection status

                if (obj1.parameter_type === 'EHS') {
                    // TODO
                }
                else {

                    if ((!obj1.NA && !obj1.NI) || (obj1.NA == 'N' && obj1.NI == 'N')) {

                        if ((parseInt(obj1.Answers) != 4) && !isNaN(parseInt(obj1.Answers))) {
                            console.log('obj.Answers >> ' + obj1.Answers)
                            inspectionStatusFlag = true;
                            inspectionStatus = 'Inspection Rejected';
                            break;
                        }
                    }
                }
            }


            // calculate grade percentage

            // inspection status
            if (inspectionStatusFlag) {
                inspectionStatus = 'Inspection Rejected';
            } else {
                inspectionStatus = 'Inspection Approved';
            }

            debugger;
            if (taskItem.TaskType.toLowerCase() == 'complaints') {
                nextVisitDate = '';
                grade = '';
                totalscore = '';
            } else if (taskItem.TaskType.toLowerCase() == 'campaign inspection') {
                if (taskItem.tradeEnglishName && taskItem.tradeEnglishName != "") {
                    totalscore = taskItem.tradeEnglishName;//replaceAll1(taskItem.tradeEnglishName, '&amp;', '&');
                }
                else {
                    totalscore = ""
                }
            }
            // console.log('test >> ' + JSON.stringify(test));

            return { action, scorePercentage }
        }



    }
    catch (error) {
        //console.log(error)
    }

}

export { scoreCalculations }