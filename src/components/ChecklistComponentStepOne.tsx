import React, { useContext, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { Image, View, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Modal, Dimensions, ToastAndroid, PermissionsAndroid, Platform, Alert } from "react-native";
import Header from './../components/Header';
import BottomComponent from './../components/BottomComponent';
import ButtonComponent from './../components/ButtonComponent';
import TextInputComponent from './../components/TextInputComponent';
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from './../config/config';
import Strings from './../config/strings';
import { observer } from 'mobx-react';
import { Context } from './../utils/Context';
import KeyValueComponent from './../components/KeyValueComponent';
import NavigationService from './../services/NavigationService';
import AccordionComponent from './../components/AccordionComponent';
import { RealmController } from './../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from './../store/rootStore';
import useInject from "./../hooks/useInject";
import moment from 'moment';
import CheckListSchema from './../database/CheckListSchema';
import Inspectionbase64Schema from './../database/Inspectionbase64Schema';
import AlertComponentForError from './../components/AlertComponentForError';
import { scoreCalculations } from './../utils/payloads/ChecklistSubmitPayload';
import AlertComponentForComment from './AlertComponentForComment';
import AlertComponentForGrace from './AlertComponentForGrace';
import AlertComponentForInformation from './../components/AlertComponentForError';
import AlertComponentForScore from './AlertComponentForScore';
import AlertComponentForRegulation from './AlertComponentForRegulation';
import AlertComponentForAttachment from './AlertComponentForAttachment';
import AlertComponentForTableName from './AlertComponentForTableName/AlertComponentForTableName';

import ImagePicker from 'react-native-image-picker';
import ChecklisConponentFrNOC from './../components/ChecklisConponentFrNOC';
import ChecklistComponentForSupervisory from './../components/ChecklistComponentForSupervisory';
import ChecklistComponentForBazar from './../components/ChecklistComponentForBazar';
import TextComponent from './TextComponent';
import * as Animatable from 'react-native-animatable';
import TableComponent from './TableComponent';


const ChecklistComponentStepOne = forwardRef((props: any, ref) => {

    const context = useContext(Context);
    const [modifiedCheckListData, setModifiedCheckListData] = useState(Array());
    let startTime: any = '';
    let timeStarted: any = '';
    let timeElapsed: any = '';

    const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
    const { myTasksDraft, bottomBarDraft } = useInject(mapStore)

    // individual section and index for checklist
    const [currentSection, setCurrentSection] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentSubIndex, setCurrentSubIndex] = useState(0);
    const [scoreArray, setScoreArray] = useState(Array());
    const [base64Array, setBase64Array] = useState(Array());

    // alert alert components variables
    const [previewCheckList, setpreviewCheckList] = useState(Array());
    const [showCommentAlert, setShowCommentAlert] = useState(false);
    const [showScoreAlert, setShowScoreAlert] = useState(false);
    const [showGraceAlert, setShowGraceAlert] = useState(false);
    const [showInformationAlert, setShowInformationAlert] = useState(false);
    const [showRegulationAlert, setShowRegulationAlert] = useState(false);
    const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);
    const [showDescAlert, setShowDescAlert] = useState(false);
    const [showTableNameAlert, setShowTableNameAlert] = useState(false);
    // const [inspectionDetails, setInspectionDetails] = useState( JSON.parse(myTasksDraft.selectedTask));

    // regulation array of checklist
    const [regulationString, setRegulationString] = useState('');

    const [base64One, setBase64One] = useState('');
    const [base64Two, setBase64two] = useState('');
    const [priview, setPriview] = useState(false);

    const [commentErrorIndex, setCommentErrorIndex] = useState(0);
    const [errorGraceAlert, setErrorGraceAlert] = useState(false);
    const [errorCommentAlert, setErrorCommentAlert] = useState(false);
    const [graceErrorIndex, setGraceErrorIndex] = useState(0);
    const [graceErrorSectionTitle, setGraceErrorSectionTtile] = useState('');
    const [commentErrorSectionTitle, setCommentErrorSectionTtile] = useState('');
    const [finalTime, setFinalTime] = useState('00:00:00');

    const refrance = useRef(null);

    let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''
    let taskStatus = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskStatus ? JSON.parse(myTasksDraft.selectedTask).TaskStatus : '' : ''

    useEffect(() => {

        try {
            // console.log('myTasksDraft.selectedTask :: ' + taskType);
            let tempModifiedCheckListData = Array();
            let temp: any = props.modifiedCheckListData ? props.modifiedCheckListData : [];
            debugger;

            if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
                setModifiedCheckListData(temp);
            }
            else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {
                setModifiedCheckListData(temp);
            }
            else if (taskType.toLowerCase() == 'bazar inspection') {
                setModifiedCheckListData(temp);
            }
            else {

                if (temp && temp.length > 0) {
                    let covidModifiedCheckListData: any = [];
                    let result: any = Array.from(new Set(temp.map((item: any) => item.parameter_type)))
                        .map(parameter_type => {
                            return { parameter_type: parameter_type };
                        });

                    for (let i = 0; i < result.length; i++) {
                        let dataArray = [];
                        for (let j = 0; j < temp.length; j++) {
                            let element: any = temp[j];
                            debugger
                            if (element.parameter_type == result[i].parameter_type) {
                                let obj: any = element;
                                if (element.parameter_type === 'EHS') {
                                    obj.naNiDisableForEHS = true;
                                    obj.informationDisableForEHS = true;
                                }
                                dataArray.push(obj);
                            }
                        }

                        if (result[i] && result[i].parameter_type && (result[i].parameter_type.includes('EHS'))) {
                            // TODO
                            tempModifiedCheckListData.push({
                                'title': result[i].parameter_type,
                                'data': dataArray
                            })
                        }
                        else if (result[i] && result[i].parameter_type && ((result[i].parameter_type.includes('EHS')) || result[i].parameter_type.includes(`مخالفات عدم ارتداء الكمامات أو عدم مراعاة مسافات التباعد`) || (result[i].parameter_type.includes(`مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية`)) || (result[i].parameter_type.includes(`مخالفة منع أو تقييد التجمعات أو الاجتماعات أو اقامة الاحتفالات`)) || (result[i].parameter_type.includes('Non-compliance with the closure of facilities and the suspension of cruise cruises')) || (result[i].parameter_type.includes('Violation of the prohibition or restriction of gatherings, meetings or celebrations')) || (result[i].parameter_type.includes(`مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`)))) {
                            // TODO
                            covidModifiedCheckListData.push(
                                // {
                                // 'title': result[i].parameter_type,
                                dataArray
                                // }
                            )
                        }
                        else {
                            tempModifiedCheckListData.push({
                                'title': result[i].parameter_type,
                                'data': dataArray
                            })
                        }
                    }
                    debugger;
                    if (covidModifiedCheckListData.length) {
                        let tempAA = Array();
                        for (let index = 0; index < covidModifiedCheckListData.length; index++) {
                            const element = covidModifiedCheckListData[index];
                            tempAA = [...tempAA, ...element]
                        }
                        tempModifiedCheckListData.unshift({
                            'title': `جدول المخالفات والجزاءات الإدارية الخاص بكوفيد 19 `,
                            // 'title': 'COVID-19',
                            'data': tempAA
                        })
                    }
                    // console.log('dskhlalkldklkdlkdlk>>>>>>>>>' + JSON.stringify(tempModifiedCheckListData))
                    setModifiedCheckListData(tempModifiedCheckListData);
                }

            }
        }
        catch (e) {
            console.log('Exception ::' + e)
        }
    }, [props.modifiedCheckListData]);

    let minScore = 99, minVal = 99;
    const getAction = (minScore: any) => {
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

    const displayCounter = () => {
        let timerCounter = setInterval(() => {
            let diff = Math.abs(new Date().valueOf() - startTime);
            setFinalTime(finalTime => msToTime(diff))
        }, 1000);
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

    useImperativeHandle(
        ref,
        () => ({

            callToChecklistValidation(checklist: any, inspectionDetails: any) {
                debugger;
                let sectionNo = 0;
                let flagComment = false;
                let questionNo = 0;
                let flagScore = false;
                let flagGrace = false;
                let totalscore = 0;
                let maxScore = 0;
                let scorePercentage = 0;
                let grade = '';
                try {
                    let tempArray = Array()
                    tempArray = [...modifiedCheckListData];
                    let temp = Array();
                    for (let index = 0; index < tempArray.length; index++) {
                        const element = tempArray[index];
                        // if (element.title == 'COVID-19') {
                        //     for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
                        //         const elementcovid = element.data[indexCovidArr];
                        //         // temp = [...temp, element.data]
                        //         temp.push(elementcovid)
                        //     }
                        // }
                        // else {
                        temp.push(element)
                        // }
                    }

                    let modifiedCheckListDataTemp = [...temp];

                    if (taskType.toLowerCase() == 'complaints') {
                        let abort = false;
                        // if (taskType == 'Complaints') {
                        a: for (let index = 0; index < modifiedCheckListDataTemp.length && !abort; index++) {

                            const elementChekclist = modifiedCheckListDataTemp[index].data;

                            b: for (let elementIndex = 0; elementIndex < elementChekclist.length && !abort; elementIndex++) {

                                const element = elementChekclist[elementIndex];
                                let flg = false
                                if (element.Score === '' && (element.covidQuestion)) {
                                    Alert.alert('', 'Please Enter Score for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                    flagScore = false;
                                    // sectionNo = index + 1;
                                    // questionNo = elementIndex + 1;
                                    abort = true;
                                    return;
                                }
                                else if (element.covidQuestion) {
                                    if (((parseInt(element.Score) == 1) || (parseInt(element.Score) == 0)) && element.comment.length == 0) {
                                        Alert.alert('', 'Please Enter comment for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                        return;
                                    }
                                }
                                else if (element.Score.toString() != '') {
                                    flg = true;
                                    flagScore = true;
                                    break b;
                                }

                                if (flg) {
                                    break a;
                                }
                            }
                        }

                        for (let index = 0; index < modifiedCheckListDataTemp.length; index++) {

                            const elementChekclist = modifiedCheckListDataTemp[index].data;

                            for (let elementIndex = 0; elementIndex < elementChekclist.length; elementIndex++) {

                                const element: any = elementChekclist[elementIndex];

                                if ((element.parameter_type.includes('EHS'))) {
                                    // TODO
                                } else {
                                    // calculate min score
                                    if (minScore > parseInt(element.Answers)) {
                                        minScore = parseInt(element.Answers);
                                    }
                                }
                            }
                        }

                        if (flagScore) {
                            let count = parseInt(myTasksDraft.count);
                            let action = getAction(minScore);

                            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                            // if (checkListData && checkListData['0']) {
                            //     let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                            //     setpreviewCheckList(checkList);
                            // }
                            count = count + 1;
                            if (count <= 3 && count >= 1) {
                                if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                                    let flag = false;
                                    let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                    setpreviewCheckList(checkList);
                                    for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                        const element = checkList[indexPreview];
                                        if (element.Answers !== '' && parseInt(element.Answers) < 4) {
                                            flag = true;
                                            break;
                                        }
                                        else if (element.NI == true || element.NI == "Y") {
                                            flag = true;
                                            break;
                                        }
                                        else if (element.NA == true || element.NA == "Y") {
                                            flag = true;
                                            break;
                                        }
                                    }

                                    if (flag) {
                                        if (taskStatus != 'Completed') {
                                            setPriview(true)
                                        }
                                        else {
                                            myTasksDraft.setCount(count.toString())
                                        }
                                    }
                                    else {
                                        myTasksDraft.setCount(count.toString())
                                    }
                                }
                                myTasksDraft.setResult(action)
                                // setPriview(true)
                                // myTasksDraft.setCount(count.toString())
                            }
                            // }
                            // return true
                        }
                        if (!flagScore) {
                            Alert.alert('', 'Enter Score For Atlest One Question');
                        }
                    }
                    else {
                        for (let index = 0; index < modifiedCheckListDataTemp.length; index++) {

                            const elementChekclist = modifiedCheckListDataTemp[index].data;

                            for (let elementIndex = 0; elementIndex < elementChekclist.length; elementIndex++) {

                                const element: any = elementChekclist[elementIndex];

                                if (taskType.toLowerCase() == 'direct inspection' || taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'temporary routine inspection') {
                                    if ((element.parameter_type.includes('EHS')) || element.parameter_type.includes(`مخالفات عدم ارتداء الكمامات أو عدم مراعاة مسافات التباعد`) || (element.parameter_type.includes(`مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية`)) || (element.parameter_type.includes(`مخالفة منع أو تقييد التجمعات أو الاجتماعات أو اقامة الاحتفالات`)) || (element.parameter_type.includes('Non-compliance with the closure of facilities and the suspension of cruise cruises')) || (element.parameter_type.includes('Violation of the prohibition or restriction of gatherings, meetings or celebrations')) || (element.parameter_type.includes(`مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`))) {
                                        // TODO
                                        let scor = element.score != '' ? parseInt(element.score) : 0;

                                        if ((element.ParameterNumber == '3(1/3)') || (element.ParameterNumber == '3(2/3)') || (element.ParameterNumber == '4(4)') || (element.ParameterNumber == '6(1/6)')
                                            || (element.ParameterNumber == '6(2/6)') || (element.ParameterNumber == '6(4/6)') || (element.ParameterNumber == '6(5/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(6/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(7/6)')
                                            || (element.ParameterNumber == '6(8/6)') || (element.ParameterNumber == '11(3/11)')) {
                                            if (((parseInt(element.score) == 1) || (parseInt(element.score) == 0)) && element.comment.length == 0) {
                                                Alert.alert('', 'Please Enter comment for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                                return;
                                            }
                                        }
                                    }
                                    else {
                                        let scor = element.score != '' ? parseInt(element.score) : 0;
                                        totalscore = totalscore + scor;

                                        console.log("grade+','+totalscore+','+scorePercentage+" + element.score)

                                        let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1

                                        maxScore = maxScore + (4 * parseInt(parameter_weight));

                                        if (totalscore) {
                                            totalscore = totalscore
                                        }
                                        else {
                                            totalscore = 0
                                        }

                                        scorePercentage = ((totalscore / maxScore) * 100);
                                        scorePercentage = (scorePercentage);
                                        // calculate grade 
                                        grade = 'Grade' + ' ' + getGrade(scorePercentage);
                                    }

                                    if ((element.Score != 4 && element.Score !== '') && (element.comment === '') && !element.covidQuestion) {

                                        Alert.alert('', 'Please Enter comment for question ' + (elementIndex + 1) + "-" + (' from the section =' + (index + 1))); //element.parameter_type);
                                        sectionNo = index + 1;
                                        questionNo = elementIndex + 1;
                                        flagComment = true;
                                        return;
                                    }
                                    else if (element.NA == 'Y' || element.NI == 'Y') {
                                        if (element.comment == "") {
                                            Alert.alert('', 'Please Enter comment for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                            questionNo = elementIndex + 1;
                                            sectionNo = index + 1;
                                            flagComment = true;
                                            return;
                                        }
                                        if (element.NI == 'Y' && element.grace == '') {
                                            Alert.alert('', 'Please Enter grace for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                            flagGrace = true;
                                            questionNo = elementIndex + 1;
                                            sectionNo = index + 1;
                                            return;
                                        }
                                    }
                                    else if (element.parameter_EHS == true || element.parameter_EHS == 'true') {
                                        if (element.Score === '' && (element.Answers.length == 0)) {
                                            Alert.alert('', 'Please Enter Score for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                            flagScore = true;
                                            questionNo = elementIndex + 1;
                                            sectionNo = index + 1;
                                            return;
                                        }
                                        else
                                            continue;
                                    }
                                    else {

                                        if (element.Score === '' && (element.Answers.length == 0)) {
                                            Alert.alert('', 'Please Enter Score for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                            flagScore = true;
                                            sectionNo = index + 1;
                                            questionNo = elementIndex + 1;
                                            return;
                                        }
                                        else if (element.Score == 0 && element.comment === "") {
                                            Alert.alert('', 'Please Enter Comment for question ' + (elementIndex + 1) + "-" + (' from the section ' + (index + 1)));
                                            flagScore = true;
                                            sectionNo = index + 1;
                                            questionNo = elementIndex + 1;
                                            return;
                                        }
                                        if (element.parameter_weight_mobility == null || element.parameter_weight_mobility.length < 1)
                                            element.parameter_weight_mobility = 1;
                                    }

                                }
                                if (index == (modifiedCheckListDataTemp.length - 1)) {
                                    let count = parseInt(myTasksDraft.count);

                                    for (let index = 0; index < modifiedCheckListDataTemp.length; index++) {

                                        const elementChekclist = modifiedCheckListDataTemp[index].data;

                                        for (let elementIndex = 0; elementIndex < elementChekclist.length; elementIndex++) {

                                            const element: any = elementChekclist[elementIndex];
                                            if ((element.parameter_type.includes('EHS'))) {
                                                // TODO
                                            } else {
                                                // calculate min score

                                                if (minScore > parseInt(element.Answers)) {
                                                    minScore = parseInt(element.Answers);
                                                }
                                                // console.log(+"index>>" + index + "," + "elementIndex>>" + elementIndex + "," + "otalscore+" + minScore + "ans>>" + element.Answers)
                                                if (minVal > parseInt(element.Answers)) {
                                                    minVal = parseInt(element.Answers);
                                                }
                                            }
                                        }
                                    }
                                    let action = getAction(minVal);

                                    count = count + 1;
                                    if (count <= 3 && count >= 1) {
                                        // let finalresult: any = {}
                                        // async function calculateScore() {
                                        //     return await scoreCalculations(checklist, inspectionDetails)
                                        // }
                                        // finalresult = calculateScore();

                                        if (taskType.toLowerCase() == 'direct inspection' || taskType.toLowerCase() == 'routine inspection' || taskType.toLowerCase() == 'temporary routine inspection') {

                                            if (myTasksDraft.isMyTaskClick != 'CompletedTask') {
                                                let temp = Array();

                                                try {

                                                    let tempArray: any = [...modifiedCheckListDataTemp];
                                                    for (var k = 0; k < tempArray.length; k++) {

                                                        for (var i = 0; i < tempArray[k].data.length; i++) {
                                                            let element = tempArray[k].data[i];

                                                            if (!element.covidQuestion && element.parameter_type !== 'EHS' && !element.NIValue && !element.NAValue) {
                                                                let obj = {
                                                                    "@id": element.parameter_reference,
                                                                    "attribute": [
                                                                        {
                                                                            "@id": "score_reference_score",
                                                                            "@type": "number",
                                                                            "number-val": (parseInt(element.Answers) === 5) ? 0 : parseInt(element.Answers)
                                                                        },
                                                                        {
                                                                            "@id": "score_reference",
                                                                            "@type": "text",
                                                                            "text-val": element.parameter_reference
                                                                        }
                                                                    ]
                                                                }

                                                                temp.push(obj)
                                                            }

                                                        }
                                                    }
                                                    let payload = {
                                                        "config": {
                                                            "outcome": {

                                                                "entity": [
                                                                    {
                                                                        "@id": "global",
                                                                        "attribute-outcome": [
                                                                            { "@id": "grade" },
                                                                            { "@id": "grade_percentage" },
                                                                            { "@id": "maximum_score" },
                                                                            { "@id": "next_date_fri_sat" },
                                                                            { "@id": "next_visit_date" },
                                                                            { "@id": "number_of_visits" },
                                                                            { "@id": "total_score" }
                                                                        ]
                                                                    },
                                                                    {
                                                                        "@id": "score",
                                                                        "attribute-outcome": { "@id": "score_reference_weight" }
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        "global-instance": {
                                                            "attribute": [
                                                                {
                                                                    "@id": "risk_category_level_main_BA",
                                                                    "@type": "text",
                                                                    "text-val": inspectionDetails.RiskCategory ? inspectionDetails.RiskCategory : 'High'
                                                                },
                                                                {
                                                                    "@id": "main_business_activity",
                                                                    "@type": "text",
                                                                    "text-val": inspectionDetails.BusinessActivity
                                                                }
                                                            ],
                                                            "entity": {
                                                                "@id": "score",
                                                                "instance": temp
                                                            }
                                                        }
                                                    }
                                                    console.warn("temp:" + JSON.stringify(payload))

                                                    myTasksDraft.callToOPAResult(payload, inspectionDetails)
                                                } catch (error) {
                                                    console.warn("callToOPAResult:" + error)
                                                }
                                            }

                                            // myTasksDraft.setPercentage(scorePercentage.toFixed(2))
                                            // myTasksDraft.setMaxScore(maxScore.toString())
                                            // myTasksDraft.setTotalScore(totalscore.toString())
                                            // myTasksDraft.setGrade(grade)
                                            // console.log(grade+','+totalscore+','+scorePercentage)
                                        }
                                        myTasksDraft.setResult(action ? action : '')

                                        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));
                                        // if (checkListData && checkListData['0']) {
                                        //     let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                        //     setpreviewCheckList(checkList);
                                        // }
                                        let flag = false;
                                        let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                                        setpreviewCheckList(checkList);
                                        for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                                            const element = checkList[indexPreview];
                                            if (element.Answers !== '' && parseInt(element.Answers) < 4) {
                                                flag = true;
                                                break;
                                            }
                                            else if (element.NI == true || element.NI == "Y") {
                                                flag = true;
                                                break;
                                            }
                                            else if (element.NA == true || element.NA == "Y") {
                                                flag = true;
                                                break;
                                            }
                                        }

                                        if (flag) {
                                            if (taskStatus != 'Completed') {
                                                setPriview(true)
                                            }
                                            else {
                                                myTasksDraft.setCount(count.toString())
                                            }
                                        }
                                        else {
                                            myTasksDraft.setCount(count.toString())
                                        }
                                        // console.log("obj::" + JSON.stringify(inspectionDetails))
                                        // setPriview(true)
                                        // myTasksDraft.setCount(count.toString())
                                    }
                                    // }
                                    return true
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log("callToChecklistValidation" + error)
                }
            }

        })

    )

    const msToTime = (duration: any) => {

        let milliseconds = (parseFloat(duration) % 1000) / 100;
        let seconds = (parseFloat(duration) / 1000) % 60;
        let minutes = (parseFloat(duration) / (1000 * 60)) % 60;
        let hours = (parseFloat(duration) / (1000 * 60 * 60)) % 24;

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    const onRegulationClick = (item: any, index: any) => {
        let tempArray: any = [...modifiedCheckListData];

        try {
            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            let regulationArray = tempArray[sectionIndex].data[index].regulation;
            let tempRegulationString = '';
            if (regulationArray && regulationArray.length > 0) {
                for (let index = 0; index < regulationArray.length; index++) {
                    if (index === 0) {
                        tempRegulationString = regulationArray[index];
                    }
                    if (index === 1) {
                        tempRegulationString = tempRegulationString + ", " + regulationArray[index];
                    }
                }
                setRegulationString(tempRegulationString)
            }

        } catch (error) {
            setRegulationString('')
        }

        setShowRegulationAlert(true);
        setShowScoreAlert(false);
        setShowCommentAlert(false);
        setShowInformationAlert(false);
        setShowGraceAlert(false);
        setShowAttachmentAlert(false);
    }

    useEffect(() => {
        let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, myTasksDraft.taskId);
        let base64ListArr = RealmController.getbase64ListForTaskId(realm, myTasksDraft.taskId);
        if (base64ListArr && base64ListArr['0']) {
            setBase64Array(base64ListArr['0'].base64List ? JSON.parse(base64ListArr['0'].base64List):[])
        }
        debugger;
        if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
            timeStarted = checkListData['0'].timeStarted;
            timeElapsed = checkListData['0'].timeElapsed;
            let temp, time;
            if (timeStarted) {
                temp = new Date(timeStarted).getTime();
                time = new Date(timeElapsed).getTime() - temp;
            } else {
                temp = new Date().getTime();
                time = temp - new Date(timeElapsed).getTime();
            }
            startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
        } else {
            startTime = new Date();
        }
        displayCounter();
    }, []);

    const onClickScoreListItem = (item: any, index: any) => {

        setShowScoreAlert(false);

        let tempArray: any = [...modifiedCheckListData];

        // if ((currentSection === 0) && showCovidChecklistFlag) {
        //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].comment = item.nonCompliance.replace(/[$~"?<>{}]/g, ' ');
        // }
        // else {

        // }

        // if ((currentSection === 0) && showCovidChecklistFlag) {
        //     if (item.score == 0) {
        //         tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].grace = 7;
        //     } else if (item.score == 1) {
        //         tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].grace = 15;
        //     } else if (item.score == 4) {
        //         tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].grace = 0;
        //     }
        // }
        // else {
        if (tempArray[currentSection].data[currentIndex].parameter_EHS == 'true') {
            if (item.score == 0) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 1) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            }
        }
        else if (myTasksDraft.isMyTaskClick == 'campaign') {
            if (item.score == 0) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 1) {
                tempArray[currentSection].data[currentIndex].grace = 15;
            } else if (item.score == 2) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 3) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 4) {
                tempArray[currentSection].data[currentIndex].grace = 0;
            }
        }
        else {
            if (item.score == 0) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 1) {
                tempArray[currentSection].data[currentIndex].grace = 7;
            } else if (item.score == 2) {
                tempArray[currentSection].data[currentIndex].grace = 15;
            } else if (item.score == 3) {
                tempArray[currentSection].data[currentIndex].grace = 15;
            } else if (item.score == 4) {
                tempArray[currentSection].data[currentIndex].grace = 0;
            }
        }
        // }

        if (tempArray[currentSection].data[currentIndex].parameter_EHS == 'true') {
            tempArray[currentSection].data[currentIndex].comment = item.description.replace(/[$~"?<>{}]/g, ' ');
        }
        else {
            if ((tempArray[currentSection].data[currentIndex].ParameterNumber == '3(1/3)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '3(2/3)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '4(4)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(1/6)')
                || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(2/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(4/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(5/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(6/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(7/6)')
                || (tempArray[currentSection].data[currentIndex].ParameterNumber == '6(8/6)') || (tempArray[currentSection].data[currentIndex].ParameterNumber == '11(3/11)')) {
                if (item.score != 1 && item.score != 0) {
                    tempArray[currentSection].data[currentIndex].comment = item.nonCompliance.replace(/[$~"?<>{}]/g, ' ');
                }
                else {
                    tempArray[currentSection].data[currentIndex].comment = '';
                }
            }
            else {
                tempArray[currentSection].data[currentIndex].comment = item.nonCompliance.replace(/[$~"?<>{}]/g, ' ');
            }
            // console.log('tempArray[currentSection].data[currentIndex].comment ::' + JSON.stringify(tempArray[currentSection].data[currentIndex].comment))
        }

        let parameter_weight = tempArray[currentSection].data[currentIndex].parameter_weight_mobility != '' ? tempArray[currentSection].data[currentIndex].parameter_weight_mobility : 1
        tempArray[currentSection].data[currentIndex].score = Math.round(item.score) * parseInt(parameter_weight);
        tempArray[currentSection].data[currentIndex].Score = Math.round(item.score) * parseInt(parameter_weight);
        tempArray[currentSection].data[currentIndex].TotalScoreForQuestion = Math.round(parseInt(item.score)) * parseInt(parameter_weight);
        tempArray[currentSection].data[currentIndex].Answers = Math.round(item.score); // selected score will go in Answers and socre * weighted will go into score
        debugger;
        // }

        // let temp = Array();
        // for (let index = 0; index < tempArray.length; index++) {
        //     const element = tempArray[index];
        //     if (element.title == 'COVID-19') {
        //         for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
        //             const elementcovid = element.data[indexCovidArr];
        //             // temp = [...temp, element.data]
        //             temp.push(elementcovid)
        //         }
        //     }
        //     else {
        //         temp.push(element)
        //     }
        // }
        // let AllQuetionsArray = Array()
        // if (temp.length) {
        //     for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
        //         const element = temp[indexAllQ];
        //         AllQuetionsArray = [...AllQuetionsArray, ...element.data]
        //     }
        // }
        // console.log("data::::" + JSON.stringify(AllQuetionsArray))
        props.onClickScoreListItem(tempArray[currentSection].data[currentIndex]);
        // setComment(tempArray[currentSection].data[currentIndex].comment);
        setModifiedCheckListData(tempArray);

    }

    const onScoreImageClick = (item: any, index: number, activeSections: number, indx: number) => {
        let tempScoreArray: any = [];

        let tempArray: any = [...modifiedCheckListData];

        if (taskType.toLowerCase().includes('food')) {
            tempArray[index].Score = item.Score;
            setModifiedCheckListData(tempArray);
            props.onComplianceClick(tempArray[index]);
        }
        else {
            let header: any;
            let sectionIndex: any;
            let parameter_score_desc;
            let parameter_score;
            let parameter_non_comp_desc;

            // console.log(JSON.stringify("currentSection?" + activeSections + "currentSubSection?" + indx + "index:" + index))

            // if (activeSections == 0 && showCovidChecklistFlag) {
            //     header = item.parameter_type;
            //     sectionIndex = 0;
            //     setCurrentIndex(indx);
            //     setCurrentSubIndex(index)
            //     parameter_score_desc = tempArray[sectionIndex].data[indx]['data'][index].parameter_score_desc
            //     parameter_score = tempArray[sectionIndex].data[indx]['data'][index].parameter_score
            //     parameter_non_comp_desc = tempArray[sectionIndex].data[indx]['data'][index].parameter_non_comp_desc;
            //     console.log(JSON.stringify(tempArray[sectionIndex].data[indx]['data'][index]))
            // }
            // else {
            header = item.parameter_type;
            sectionIndex = activeSections;
            setCurrentIndex(index);
            parameter_score_desc = tempArray[sectionIndex].data[index].parameter_score_desc
            parameter_score = tempArray[sectionIndex].data[index].parameter_score
            parameter_non_comp_desc = tempArray[sectionIndex].data[index].parameter_non_comp_desc;
            // }

            debugger;

            // set current item and index 
            setCurrentSection(sectionIndex);

            let length = parameter_score_desc.length;
            for (let i = 0; i < length; i++) {
                // alert(tempArray[sectionIndex].data[index].parameter_EHS)
                if (tempArray[sectionIndex].data[index] && tempArray[sectionIndex].data[index].parameter_EHS && (tempArray[sectionIndex].data[index].parameter_EHS == true || tempArray[sectionIndex].data[index].parameter_EHS == 'true')) {

                    let obj: any = {}
                    obj.score = (parameter_score[i] || (parameter_score[i] == 0.0) || (parameter_score[i] == 0 / 0)) ? Math.round(parameter_score[i]) : '';
                    obj.description = parameter_score_desc[i] ? parameter_score_desc[i] === 'uncertain' ? '-' : parameter_score_desc[i] : '';
                    obj.nonCompliance = parameter_non_comp_desc[i] ? parameter_non_comp_desc[i] === 'uncertain' ? '-' : parameter_non_comp_desc[i] : '';
                    if ((obj.score == 0) && ((obj.description == '-' || (obj.description == 'NA')))) {
                    }
                    else {
                        tempScoreArray.push(obj);
                    }
                } else {
                    if (parameter_non_comp_desc[i] && (parameter_non_comp_desc[i] == "N/A" || parameter_non_comp_desc[i] == "NA" || parameter_non_comp_desc[i] == "Not Applicable" || parameter_non_comp_desc[i] == "N/ A" || parameter_non_comp_desc[i] == "N /A" || parameter_non_comp_desc[i] == "N / A" || parameter_non_comp_desc[i] == "")) {

                    } else {
                        let obj: any = {}
                        obj.score = (parameter_score[i] || parameter_score[i] == 0 || parameter_score[i] == 0.0) ? Math.round(parameter_score[i]) : '';
                        obj.description = parameter_score_desc[i] ? parameter_score_desc[i] === 'uncertain' ? '-' : parameter_score_desc[i] : '';
                        obj.nonCompliance = parameter_non_comp_desc[i] ? (parameter_non_comp_desc[i] === 'uncertain') ? '-' : parameter_non_comp_desc[i] : '';

                        if (obj.score == 0 || obj.score != '') {
                            tempScoreArray.push(obj);
                        }

                    }
                }
            }

            if (tempScoreArray.length <= 0 && item.parameter_EHS && item.parameter_EHS == true) {
                tempScoreArray.push({ "score": 1, "description": "Satisfactory", "nonCompliance": "-" });
                tempScoreArray.push({ "score": 0, "description": "Unsatisfactory", "nonCompliance": "-" });
            }
            // console.log('item ::' + JSON.stringify(item))

            // console.log('tempScore Array ::' + JSON.stringify(tempScoreArray));
            setScoreArray(tempScoreArray);

            setShowScoreAlert(true);
            setShowGraceAlert(false);
            setShowCommentAlert(false);
            setShowInformationAlert(false);
            setShowRegulationAlert(false);
            setShowAttachmentAlert(false);
        }
    }

    const updateGraceValue = (val: any) => {
        let tempArray: any = [...modifiedCheckListData];
        // // tempArray[currentSection].data[currentIndex].grace = val;
        // if ((currentSection == 0) && showCovidChecklistFlag) {
        //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].grace = val;
        //     setModifiedCheckListData(tempArray);
        //     let temp = Array();
        //     for (let index = 0; index < tempArray.length; index++) {
        //         const element = tempArray[index];
        //         if (element.title == 'COVID-19') {
        //             for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
        //                 const elementcovid = element.data[indexCovidArr];
        //                 // temp = [...temp, element.data]
        //                 temp.push(elementcovid)
        //             }
        //         }
        //         else {
        //             temp.push(element)
        //         }
        //     }
        //     let AllQuetionsArray = Array()
        //     if (temp.length) {
        //         for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
        //             const element = temp[indexAllQ];
        //             AllQuetionsArray = [...AllQuetionsArray, ...element.data]
        //         }
        //     }
        //     console.log("data::::" + JSON.stringify(AllQuetionsArray.length))
        //     props.updateGraceValue(AllQuetionsArray);
        // }
        // else if ((currentSection !== 0) && showCovidChecklistFlag) {
        //     tempArray[currentSection].data[currentIndex].grace = val;
        //     // setModifiedCheckListData(tempArray);
        //     let temp = Array();
        //     for (let index = 0; index < tempArray.length; index++) {
        //         const element = tempArray[index];
        //         if (element.title == 'COVID-19') {
        //             for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
        //                 const elementcovid = element.data[indexCovidArr];
        //                 // temp = [...temp, element.data]
        //                 temp.push(elementcovid)
        //             }
        //         }
        //         else {
        //             temp.push(element)
        //         }
        //     }
        //     let AllQuetionsArray = Array()
        //     if (temp.length) {
        //         for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
        //             const element = temp[indexAllQ];
        //             AllQuetionsArray = [...AllQuetionsArray, ...element.data]
        //         }
        //     }
        //     console.log("datafvdfff::::" + JSON.stringify(AllQuetionsArray.length))
        //     props.updateGraceValue(AllQuetionsArray);
        // }
        // else {
        tempArray[currentSection].data[currentIndex].grace = val;
        // console.log("datafvdfff::::" + JSON.stringify(tempArray.length))
        // let AllQuetionsArray = Array()
        // if (tempArray.length) {
        //     for (let indexAllQ = 0; indexAllQ < tempArray.length; indexAllQ++) {
        //         const element = tempArray[indexAllQ];
        //         AllQuetionsArray = [...AllQuetionsArray, ...element.data]
        //     }
        // }
        props.updateGraceValue(tempArray[currentSection].data[currentIndex]);
        // }
        setModifiedCheckListData(tempArray);
        setShowAttachmentAlert(false);
    }

    const onGraceImageClick = (item: any, index: number, activeSections: number, indx: number) => {
        let tempArray = [...modifiedCheckListData];

        // let header = item.parameter_type;
        // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        let sectionIndex = activeSections;
        // set current item and index 
        setCurrentSection(sectionIndex);
        // if ((sectionIndex == 0) && showCovidChecklistFlag) {
        //     setCurrentIndex(indx);
        //     setCurrentSubIndex(index)
        // }
        // else {
        setCurrentIndex(index);
        // }

        setShowGraceAlert(true);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const updateCommentValue = (val: any) => {
        let tempArray: any = [...modifiedCheckListData];

        if ((taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food'))) {
            tempArray[currentSection].comment = val;
            props.updateCommentValue(tempArray[currentSection]);
        }
        else if (taskType.toLowerCase() == 'bazar inspection') {
            console.log("Vallllll" + val)
            tempArray[currentSection].Comment = val;
            props.updateCommentValue(tempArray[currentSection]);
        }
        else if ((taskType == 'Supervisory Inspections' || taskType == 'Monitor Inspector Performance')) {
            tempArray[currentSection].Comment2 = val;
            props.updateCommentValue(tempArray[currentSection]);
        }
        else {
            // if ((currentSection == 0) && showCovidChecklistFlag) {
            //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].comment = val;
            //     // setModifiedCheckListData(tempArray);
            // }
            // else {
            //     tempArray[currentSection].data[currentIndex].comment = val;
            // }

            // if ((currentSection == 0) && showCovidChecklistFlag) {
            //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].comment = val;
            //     setModifiedCheckListData(tempArray);
            //     let temp = Array();
            //     for (let index = 0; index < tempArray.length; index++) {
            //         const element = tempArray[index];
            //         if (element.title == 'COVID-19') {
            //             for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
            //                 const elementcovid = element.data[indexCovidArr];
            //                 // temp = [...temp, element.data]
            //                 temp.push(elementcovid)
            //             }
            //         }
            //         else {
            //             temp.push(element)
            //         }
            //     }
            //     let AllQuetionsArray = Array()
            //     if (temp.length) {
            //         for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
            //             const element = temp[indexAllQ];
            //             AllQuetionsArray = [...AllQuetionsArray, ...element.data]
            //         }
            //     }
            //     console.log("data::::" + JSON.stringify(AllQuetionsArray.length))
            //     props.updateCommentValue(AllQuetionsArray);
            // }
            // else if ((currentSection !== 0) && showCovidChecklistFlag) {
            //     tempArray[currentSection].data[currentIndex].comment = val;
            //     // setModifiedCheckListData(tempArray);
            //     let temp = Array();
            //     for (let index = 0; index < tempArray.length; index++) {
            //         const element = tempArray[index];
            //         if (element.title == 'COVID-19') {
            //             for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
            //                 const elementcovid = element.data[indexCovidArr];
            //                 // temp = [...temp, element.data]
            //                 temp.push(elementcovid)
            //             }
            //         }
            //         else {
            //             temp.push(element)
            //         }
            //     }
            //     let AllQuetionsArray = Array()
            //     if (temp.length) {
            //         for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
            //             const element = temp[indexAllQ];
            //             AllQuetionsArray = [...AllQuetionsArray, ...element.data]
            //         }
            //     }
            //     console.log("datafvdfff::::" + JSON.stringify(AllQuetionsArray.length))
            //     props.updateCommentValue(AllQuetionsArray);
            // }
            // else {
            tempArray[currentSection].data[currentIndex].comment = val;
            // console.log("datafvdfff::::" + JSON.stringify(tempArray.length))
            // let AllQuetionsArray = Array()
            // if (tempArray.length) {
            //     for (let indexAllQ = 0; indexAllQ < tempArray.length; indexAllQ++) {
            //         const element = tempArray[indexAllQ];
            //         AllQuetionsArray = [...AllQuetionsArray, ...element.data]
            //     }
            // }
            props.updateCommentValue(tempArray[currentSection].data[currentIndex]);
            // }
            // tempArray[currentSection].data[currentIndex].comment = val;
            // props.updateCommentValue(tempArray[currentSection].data[currentIndex]);
        }
        setModifiedCheckListData(tempArray);
    }

    const onCommentImageClick = (item: any, index: number, activeSections: number, indx: number) => {

        let tempArray = [...modifiedCheckListData];
        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            setCurrentSection(index);
            setCurrentIndex(index);
        }
        else if (taskType.toLowerCase().includes('supervisory') || taskType.toLowerCase().includes('monitor')) {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            setCurrentSection(index);
            setCurrentIndex(index);
        }
        else if (taskType.toLowerCase() == 'bazar inspection') {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            setCurrentSection(index);
            setCurrentIndex(index);
        }
        else {
            // let header = item.parameter_type;
            // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
            let sectionIndex = activeSections;
            // set current item and index 
            setCurrentSection(sectionIndex);
            // if ((sectionIndex == 0) && showCovidChecklistFlag) {
            //     setCurrentIndex(indx);
            //     setCurrentSubIndex(index)
            // }
            // else {
            setCurrentIndex(index);
            // }

            // set current item and index 
            setCurrentSection(sectionIndex);
        }
        setShowCommentAlert(true);
        setShowGraceAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
    }

    const onComplianceClick = (item: any, index: number, value: string) => {
        debugger;
        let tempArray = [...modifiedCheckListData];
        // let header = item.NOC_parameter_sl_no;
        // let sectionIndex = tempArray.findIndex((item: any) => item.NOC_parameter_sl_no == header);
        tempArray[index].Score = value;
        // set current item and index 
        setCurrentSection(index);
        // setCurrentIndex(index);
        setModifiedCheckListData(tempArray);

        setShowInformationAlert(false);
        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
        props.onComplianceClick(tempArray[index]);

    }

    const onInfoImageClick = (item: any, index: number, activeSections: number, indx: number) => {
        debugger;
        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            // let tempArray = [...modifiedCheckListData];

            // let header = item.NOC_parameter_sl_no;
            // let sectionIndex = tempArray.findIndex((item: any) => item.NOC_parameter_sl_no == header);

            // set current item and index 
            setCurrentSection(index);
            setCurrentIndex(index);

            setShowInformationAlert(true);
            setShowGraceAlert(false);
            setShowCommentAlert(false);
            setShowScoreAlert(false);
            setShowRegulationAlert(false);
            setShowAttachmentAlert(false);
        }
        else {
            // let tempArray = [...modifiedCheckListData];

            // let header = item.parameter_type;
            // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            let sectionIndex = activeSections;
            // set current item and index 
            // setCurrentSection(sectionIndex);
            // if ((sectionIndex == 0) && showCovidChecklistFlag) {
            //     setCurrentIndex(indx);
            //     setCurrentSubIndex(index)
            // }
            // else {
            setCurrentIndex(index);
            // }
            // set current item and index 
            setCurrentSection(sectionIndex);

            setShowInformationAlert(true);
            setShowGraceAlert(false);
            setShowCommentAlert(false);
            setShowScoreAlert(false);
            setShowRegulationAlert(false);
            setShowAttachmentAlert(false);
        }

    }

    const onDescImageClick = (item: any, index: number, activeSections: number, indx: number) => {
        let tempArray = [...modifiedCheckListData];

        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            setCurrentIndex(index);
        }
        else {
            // let header = item.parameter_type;
            // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
            // set current item and index 
            let sectionIndex = activeSections;
            // set current item and index 
            // setCurrentSection(sectionIndex);
            // if ((sectionIndex == 0) && showCovidChecklistFlag) {
            //     setCurrentIndex(indx);
            //     setCurrentSubIndex(index)
            // }
            // else {
            setCurrentIndex(index);
            // }
            setCurrentSection(sectionIndex);

        }

        setShowDescAlert(true);
        setShowInformationAlert(false);
        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);

    }

    const onNAClick = (item: any, index: number, activeSections: number, indx: number) => {
        let tempArray: any = [...modifiedCheckListData];

        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {
            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            tempArray[index].NAValue = item.NAValue;
            setModifiedCheckListData(tempArray);
            setCurrentIndex(index);
            props.onNAClick(tempArray[index]);
        }
        else {

            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            // if (tempArray[sectionIndex].data[index].NA === 'Y') {
            //     tempArray[sectionIndex].data[index].scoreDisable = false;
            //     tempArray[sectionIndex].data[index].NA = "N";
            //     tempArray[sectionIndex].data[index].NAValue = false;
            // } else {
            if (taskType.toLowerCase().includes('direct') || taskType.toLowerCase().includes('routine')) {
                tempArray[sectionIndex].data[index].graceDisable = true;
            }
            tempArray[sectionIndex].data[index].scoreDisable = true;
            tempArray[sectionIndex].data[index].NA = "Y";
            tempArray[sectionIndex].data[index].NAValue = true;
            // }

            tempArray[sectionIndex].data[index].NI = "N";
            tempArray[sectionIndex].data[index].NIValue = false;
            tempArray[sectionIndex].data[index].score = '';
            tempArray[sectionIndex].data[index].grace = '';
            tempArray[sectionIndex].data[index].Answers = '';
            tempArray[sectionIndex].data[index].comment = '';
            tempArray[sectionIndex].data[index].Score = '';
            tempArray[sectionIndex].data[index].TotalScoreForQuestion = '';

            setModifiedCheckListData(tempArray);
            props.onNAClick(tempArray[sectionIndex].data[index]);
        }
    }

    const onDashClick = (item: any, index: number, activeSections: number, indx: number) => {
        let tempArray: any = [...modifiedCheckListData];

        let header = item.parameter_type;
        let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);

        tempArray[sectionIndex].data[index].NA = "N";
        tempArray[sectionIndex].data[index].NAValue = false;

        if (taskType.toLowerCase().includes('direct') || taskType.toLowerCase().includes('routine')) {
            tempArray[sectionIndex].data[index].graceDisable = false;
        }
        // if (tempArray[sectionIndex].data[index].NI === 'N') {
        tempArray[sectionIndex].data[index].scoreDisable = false;
        tempArray[sectionIndex].data[index].NI = "N";
        tempArray[sectionIndex].data[index].NIValue = false;
        // } else {
        //     tempArray[sectionIndex].data[index].scoreDisable = false;
        //     tempArray[sectionIndex].data[index].NI = "N";
        //     tempArray[sectionIndex].data[index].NIValue = false;
        // }

        tempArray[sectionIndex].data[index].Answers = '';
        tempArray[sectionIndex].data[index].comment = '';
        tempArray[sectionIndex].data[index].Score = '';
        tempArray[sectionIndex].data[index].score = '';
        tempArray[sectionIndex].data[index].TotalScoreForQuestion = '';

        setModifiedCheckListData(tempArray);
        props.onNAClick(tempArray[sectionIndex].data[index]);

    }

    const onNIClick = (item: any, index: number, activeSections: number, indx: number) => {
        let tempArray: any = [...modifiedCheckListData];
        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

            let tempArray = [...modifiedCheckListData];
            // set current item and index 
            tempArray[index].NAValue = item.NAValue;
            setModifiedCheckListData(tempArray);
            setCurrentIndex(index);
            props.onNIClick(tempArray[index]);
        }
        else {

            let header = item.parameter_type;
            let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

            // set current item and index 
            setCurrentSection(sectionIndex);
            setCurrentIndex(index);

            if (taskType.toLowerCase().includes('direct') || taskType.toLowerCase().includes('routine')) {
                tempArray[sectionIndex].data[index].graceDisable = false;
            }

            // if (tempArray[sectionIndex].data[index].NI === 'Y') {
            //     tempArray[sectionIndex].data[index].scoreDisable = false;
            //     tempArray[sectionIndex].data[index].NI = "N";
            //     tempArray[sectionIndex].data[index].NIValue = false;
            // }
            // else {
            tempArray[sectionIndex].data[index].scoreDisable = true;
            tempArray[sectionIndex].data[index].NI = "Y";
            tempArray[sectionIndex].data[index].NIValue = true;
            // }
            tempArray[sectionIndex].data[index].NA = "N";
            tempArray[sectionIndex].data[index].NAValue = false;
            tempArray[sectionIndex].data[index].Answers = '';
            tempArray[sectionIndex].data[index].comment = '';
            tempArray[sectionIndex].data[index].Score = '';
            tempArray[sectionIndex].data[index].score = '';
            tempArray[sectionIndex].data[index].TotalScoreForQuestion = '';

            setModifiedCheckListData(tempArray);
            props.onNIClick(tempArray[sectionIndex].data[index]);

        }
    }

    const onAttachmentImageClick = (item: any, index: number, activeSections: number, indx: number) => {

        if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance' || taskType.toLowerCase() == 'bazar inspection') {
            let tempArray = [...modifiedCheckListData];
            setCurrentSection(index);
            setCurrentIndex(index);
        }
        else {
            // let tempArray = [...modifiedCheckListData];

            // let header = item.parameter_type;
            // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
            // set current item and index 
            let sectionIndex = activeSections;
            // set current item and index 
            // setCurrentSection(sectionIndex);
            // if ((sectionIndex == 0) && showCovidChecklistFlag) {
            //     setCurrentIndex(indx);
            //     setCurrentSubIndex(index)
            // }
            // else {
            setCurrentIndex(index);
            // }
            setCurrentSection(sectionIndex);
        }

        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(true);
    }

    const onTableNameAlertClick = (item: any, index: any) => {


        let tempArray = [...modifiedCheckListData];

        let header = item.Order;
        let sectionIndex = tempArray.findIndex((item: any) => item.Order == header);
        // set current item and index 
        setCurrentSection(sectionIndex);
        setCurrentIndex(index);


        setShowGraceAlert(false);
        setShowCommentAlert(false);
        setShowScoreAlert(false);
        setShowInformationAlert(false);
        setShowRegulationAlert(false);
        setShowAttachmentAlert(false);
        setShowTableNameAlert(true);
    }

    const attachedImageToAlertImageView = async (item: any) => {
        try {
            if (Platform.OS === 'ios') {
                selectImage(item);
            } else if (Platform.OS === 'android') {

                PermissionsAndroid.requestMultiple(
                    [
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA
                    ]
                ).then((result) => {
                    debugger;
                    if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
                        // selectImage(item);
                    } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
                        ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
                    }

                })

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Smart control App',
                    message: 'You want to use the camera',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                })
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    selectImage(item);
                } else {
                }
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const selectImage = (item: any) => {
        let options = {
            title: 'Select Image',
            noData: false,
            quality: 0.8,
            customButtons: [
                // { name: 'Cancel', title: 'Cancel' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        try {
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                    // //console.log('User cancelled image picker');
                } else if (response.error) {
                    // //console.log('ImagePicker Error: ' + response.error);
                } else if (response.customButton) {
                    // //console.log('User tapped custom button: ', response.customButton);
                } else {
                    // console.log('ImageResponse: ', response.data);
                    debugger;
                    if (response.fileSize) {
                        if (item == 'one') {
                            let tempArray: any = [...modifiedCheckListData];
                            if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {
                                tempArray[currentIndex].image1 = response.fileName;
                                // tempArray[currentIndex].image1Base64 = response.data;
                                tempArray[currentIndex].image1Uri = response.uri;
                                if (base64Array.length) {
                                    let flag = true;
                                    for (let index = 0; index < base64Array.length; index++) {
                                        const element = base64Array[index];
                                        if (element.uniqueQuestionId == ("Evidence_" + tempArray[currentIndex].NOC_parameter_sl_no + "_1")) {
                                            element.buffer = response.data;
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        base64Array.push({
                                            uniqueQuestionId: "Evidence_" + tempArray[currentIndex].NOC_parameter_sl_no + "_1",
                                            buffer: response.data
                                        })
                                    }
                                }
                                else {
                                    base64Array.push({
                                        uniqueQuestionId: "Evidence_" + tempArray[currentIndex].NOC_parameter_sl_no + "_1",
                                        buffer: response.data
                                    })
                                }
                                props.onAttachmentImageClick(tempArray[currentIndex]);
                            }
                            else {
                                // if ((currentSection == 0) && showCovidChecklistFlag) {
                                //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].image1 = response.fileName;
                                //     // tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].image1Base64 = response.data;
                                //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].image1Uri = response.uri;
                                //     if (base64Array.length) {
                                //         let flag = true;
                                //         for (let index = 0; index < base64Array.length; index++) {
                                //             const element = base64Array[index];
                                //             if (element.uniqueQuestionId == tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].parameterno + "_1") {
                                //                 element.buffer = response.data;
                                //                 flag = false;
                                //                 break;
                                //             }
                                //         }
                                //         if (flag) {
                                //             base64Array.push({
                                //                 uniqueQuestionId: tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].parameterno + "_1",
                                //                 buffer: response.data
                                //             })
                                //         }
                                //     }
                                //     else {
                                //         base64Array.push({
                                //             uniqueQuestionId: tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].parameterno + "_1",
                                //             buffer: response.data
                                //         })
                                //     }
                                // }
                                // else {
                                tempArray[currentSection].data[currentIndex].image1 = response.fileName;
                                // tempArray[currentSection].data[currentIndex].image1Base64 = response.data;
                                tempArray[currentSection].data[currentIndex].image1Uri = response.uri;
                                if (base64Array.length) {
                                    let flag = true;
                                    for (let index = 0; index < base64Array.length; index++) {
                                        const element = base64Array[index];
                                        if (element.uniqueQuestionId == "Evidence_" + tempArray[currentSection].data[currentIndex].parameterno + "_1") {
                                            element.buffer = response.data;
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        base64Array.push({
                                            uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].parameterno + "_1",
                                            buffer: response.data
                                        })
                                    }
                                }
                                else {
                                    base64Array.push({
                                        uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].parameterno + "_1",
                                        buffer: response.data
                                    })
                                }
                                // }
                                props.onAttachmentImageClick(tempArray[currentSection].data[currentIndex]);

                            }
                            // let temp = Array();
                            // for (let index = 0; index < tempArray.length; index++) {
                            //     const element = tempArray[index];
                            //     if (element.title == 'COVID-19') {
                            //         for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
                            //             const elementcovid = element.data[indexCovidArr];
                            //             // temp = [...temp, element.data]
                            //             temp.push(elementcovid)
                            //         }
                            //     }
                            //     else {
                            //         temp.push(element)
                            //     }
                            // }
                            // let AllQuetionsArray = Array()
                            // if (temp.length) {
                            //     for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
                            //         const element = temp[indexAllQ];
                            //         AllQuetionsArray = [...AllQuetionsArray, ...element.data]
                            //     }
                            // }
                            setBase64One(response.data);
                            setModifiedCheckListData(tempArray);
                        }
                        else {
                            let tempArray: any = [...modifiedCheckListData];
                            if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {
                                tempArray[currentIndex].image2 = response.fileName;
                                // tempArray[currentIndex].image2Base64 = response.data;
                                tempArray[currentIndex].image1Uri = response.uri;
                                if (base64Array.length) {
                                    let flag = true;
                                    for (let index = 0; index < base64Array.length; index++) {
                                        const element = base64Array[index];
                                        if (element.uniqueQuestionId == "Evidence_" + tempArray[currentIndex].NOC_parameter_sl_no + "_2") {
                                            element.buffer = response.data;
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        base64Array.push({
                                            uniqueQuestionId: "Evidence_" + tempArray[currentIndex].NOC_parameter_sl_no + "_2",
                                            buffer: response.data
                                        })
                                    }
                                }
                                else {
                                    base64Array.push({
                                        uniqueQuestionId: "Evidence_" + tempArray[currentIndex].NOC_parameter_sl_no + "_2",
                                        buffer: response.data
                                    })
                                }
                                props.onAttachmentImageClick(tempArray[currentIndex]);
                            }
                            else {
                                // if ((currentSection == 0) && showCovidChecklistFlag) {
                                //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].image2 = response.fileName;
                                //     // tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].image2Base64 = response.data;
                                //     tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].image2Uri = response.uri;
                                //     if (base64Array.length) {
                                //         let flag = true;
                                //         for (let index = 0; index < base64Array.length; index++) {
                                //             const element = base64Array[index];
                                //             if (element.uniqueQuestionId == tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].parameterno) {
                                //                 element.buffer = response.data;
                                //                 flag = false;
                                //                 break;
                                //             }
                                //         }
                                //         if (flag) {
                                //             base64Array.push({
                                //                 uniqueQuestionId: tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].parameterno,
                                //                 buffer: response.data
                                //             })
                                //         }
                                //     }
                                //     else {
                                //         base64Array.push({
                                //             uniqueQuestionId: tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].parameterno,
                                //             buffer: response.data
                                //         })
                                //     }
                                // }
                                // else {
                                tempArray[currentSection].data[currentIndex].image2 = response.fileName;
                                // tempArray[currentSection].data[currentIndex].image2Base64 = response.data;
                                tempArray[currentSection].data[currentIndex].image2Uri = response.uri;
                                if (base64Array.length) {
                                    let flag = true;
                                    for (let index = 0; index < base64Array.length; index++) {
                                        const element = base64Array[index];
                                        if (element.uniqueQuestionId == "Evidence_" + tempArray[currentSection].data[currentIndex].parameterno + "_2") {
                                            element.buffer = response.data;
                                            flag = false;
                                            break;
                                        }
                                    }
                                    if (flag) {
                                        base64Array.push({
                                            uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].parameterno + "_2",
                                            buffer: response.data
                                        })
                                    }
                                }
                                else {
                                    base64Array.push({
                                        uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].parameterno + "_2",
                                        buffer: response.data
                                    })
                                }
                                // }
                                props.onAttachmentImageClick(tempArray[currentSection].data[currentIndex]);

                            }
                            // let temp = Array();
                            // for (let index = 0; index < tempArray.length; index++) {
                            //     const element = tempArray[index];
                            //     if (element.title == 'COVID-19') {
                            //         for (let indexCovidArr = 0; indexCovidArr < element.data.length; indexCovidArr++) {
                            //             const elementcovid = element.data[indexCovidArr];
                            //             // temp = [...temp, element.data]
                            //             temp.push(elementcovid)
                            //         }
                            //     }
                            //     else {
                            //         temp.push(element)
                            //     }
                            // }
                            // let AllQuetionsArray = Array()
                            // if (temp.length) {
                            //     for (let indexAllQ = 0; indexAllQ < temp.length; indexAllQ++) {
                            //         const element = temp[indexAllQ];
                            //         AllQuetionsArray = [...AllQuetionsArray, ...element.data]
                            //     }
                            // }
                            setBase64two(response.data);
                            setModifiedCheckListData(tempArray);
                            // console.log("AllQuetionsArray::" + AllQuetionsArray.length)
                        }

                        let objBase64 = {
                            base64List: JSON.stringify(base64Array),
                            taskId: myTasksDraft.taskId
                        }
                        // console.log("ssss" + JSON.stringify(objBase64))
                        RealmController.addbase64ListInDB(realm, objBase64, () => {

                        })
                    } else {
                        ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
                    }
                }
            });

        } catch (error) {
            debugger
            // alert((error))

        }
    }

    const renderScoreData = ({ item, index }: any) => {
        // if (item.Answers.toString() === '4') {
        //     return;
        // }

        return (
            item.Answers.toString() === '4'
                ?
                null
                :
                <View
                    style={{
                        height: HEIGHT * 0.2, width: '100%', alignSelf: 'center', justifyContent: 'space-evenly', borderRadius: 10, borderWidth: 1,
                        shadowRadius: 1, backgroundColor: fontColor.white, borderColor: '#abcfbf', shadowOpacity: 15, shadowColor: fontColor.grey, elevation: 0
                    }}>
                    <TableComponent
                        numberOfLines={3}
                        isHeader={false}
                        isArabic={context.isArabic}
                        data={[{ keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.parano, value: parseInt(item.parameterno) + 1 },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.question, value: item.parameter_reference + ":" + item.parameter_type + ":" + item.parameter },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.score, value: item.Answers },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.grace, value: item.grace },
                        { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.comments, value: item.comment },
                        ]}
                    />
                </View>

            // <View
            //     style={{ flex: 0.7, flexDirection: context.isArabic ? 'row-reverse' : 'row', minHeight: HEIGHT * 0.07, borderBottomWidth: 1, borderBottomColor: '#5c666f' }}>
            //     <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
            //         <TextComponent
            //             textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
            //             label={item.Answers}
            //         />
            //     </View>
            //     <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', borderRightWidth: context.isArabic ? 0 : 1, borderRightColor: '#5c666f', borderLeftWidth: context.isArabic ? 1 : 0, borderLeftColor: '#5c666f' }}>
            //         <TextComponent
            //             textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
            //             label={item.parameter}
            //         />
            //     </View>
            //     <View style={{ flex: 1.2, justifyContent: 'center', alignItems: 'center' }}>
            //         <TextComponent
            //             textStyle={{ color: '#5c666f', textAlign: 'center', fontSize: 13, fontWeight: 'normal' }}
            //             label={item.comment}
            //         />
            //     </View>

            // </View>
        );
    }
    // const scrollToQue = (que: any) => {
    //     let temp = [...array]
    //     temp.push(que);
    //     setTempArray(temp);
    // }

    // const heightOfView = (height: any) => {
    //     let temp = [...array]
    //     temp.push(height);
    //     // Alert.alert(JSON.stringify(temp))
    //     setTempArray(temp);
    //     // Alert.alert(height.toString())
    // }

    return (

        <View style={{ flex: 1, width: '100%', alignSelf: 'center' }}>

            <ScrollView ref={refrance} style={{ minHeight: HEIGHT * 0.2, height: 'auto' }}>

                <Modal
                    visible={priview}
                    onRequestClose={() => setPriview(false)}
                    transparent={true}
                >
                    <View style={{ height: HEIGHT * 0.98, width: WIDTH * 0.98, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', zIndex: 8, alignSelf: 'center', alignItems: 'center', }}>
                        <Animatable.View duration={200} animation='zoomIn' style={[styles.textModal, { height: HEIGHT * 1, width: WIDTH * 1, zIndex: 999 }]}>

                            <ScrollView>
                                <View style={{ flex: 1, height: 'auto', justifyContent: 'center', borderRadius: 20 }}>

                                    <View style={{ height: 'auto', justifyContent: 'center', padding: 5 }}>
                                        <View style={{ height: 10 }} />
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={previewCheckList}
                                                ItemSeparatorComponent={() => {
                                                    return (<View style={{ height: 1, }} />);
                                                }}
                                                renderItem={renderScoreData}
                                            // ListEmptyComponent={listEmptyView}
                                            />
                                        </View>
                                        {/* </View> */}
                                    </View>
                                </View>
                            </ScrollView>

                            <View style={{ height: HEIGHT * 0.06, width: '100%', flexDirection: context.isArabic ? 'row-reverse' : 'row' }}>
                                <View style={{ flex: 1, height: '80%', flexDirection: context.isArabic ? 'row-reverse' : 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'center' }}>

                                    <View style={{ flex: 2, alignSelf: 'center' }}>
                                        <ButtonComponent
                                            style={{
                                                backgroundColor: 'red',
                                                borderRadius: 8, alignSelf: 'center', padding: 10, width: '30%', textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                setPriview(false)
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.edit)}
                                        />
                                    </View>

                                    {/* <View style={{ flex: 0.1 }} /> */}

                                    <View style={{ flex: 2, alignSelf: 'center' }}>
                                        <ButtonComponent
                                            style={{
                                                backgroundColor: fontColor.ButtonBoxColor,
                                                borderRadius: 8, alignSelf: 'center', padding: 10, width: '30%', textAlign: 'center'
                                            }}
                                            isArabic={context.isArabic}
                                            buttonClick={() => {
                                                let count = parseInt(myTasksDraft.count);
                                                count = count + 1;
                                                if (count <= 3 && count >= 1) {
                                                    myTasksDraft.setCount(count.toString())
                                                }
                                                setPriview(false)
                                            }}
                                            textstyle={{ textAlign: 'center', fontFamily: context.isArabic ? fontFamily.arabicTextFontFamily : fontFamily.textFontFamily, fontSize: 12, fontWeight: 'bold', color: fontColor.white }}
                                            buttonText={(Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.ok)}
                                        />
                                    </View>

                                    {/* <View style={{ flex: 0.1 }} /> */}
                                </View>

                            </View>
                        </Animatable.View>
                    </View>

                </Modal>

                {
                    errorGraceAlert
                        ?
                        <AlertComponentForError
                            showMessage={true}
                            title={'Warning'}
                            message={`Select grace for question number ${graceErrorIndex + 1} from section ${graceErrorSectionTitle}`}
                            closeAlert={() => {
                                setErrorGraceAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    errorCommentAlert
                        ?
                        <AlertComponentForError
                            showMessage={true}
                            title={'Warning'}
                            message={`Select comment for question number ${commentErrorIndex + 1} from section ${commentErrorSectionTitle}`}
                            closeAlert={() => {
                                setErrorCommentAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showCommentAlert ?
                        <AlertComponentForComment
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Comment'}
                            comment={

                                (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) ?
                                    modifiedCheckListData[currentSection].comment
                                    :
                                    (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ?
                                        modifiedCheckListData[currentSection].Comment2 :
                                        (taskType.toLowerCase() == 'bazar inspection') ?
                                            modifiedCheckListData[currentSection].Comment :
                                            modifiedCheckListData && modifiedCheckListData.length > 0
                                                ?
                                                currentSection === '' && currentIndex === ''
                                                    ?
                                                    ''
                                                    :
                                                    // (currentSection == 0) && showCovidChecklistFlag ?
                                                    //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].comment
                                                    //     :
                                                    modifiedCheckListData[currentSection].data[currentIndex].comment
                                                :
                                                ''

                            }
                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                            message={
                                (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance' || taskType.toLowerCase() == 'bazar inspection') ?
                                    'Enter comment' :
                                    // (currentSection == 0) && showCovidChecklistFlag ?
                                    //     "Enter Comment"
                                    //     :
                                    modifiedCheckListData[currentSection].data[currentIndex].parameter_type == 'EHS' ? '-' : 'Enter comment'}
                            updateCommentValue={updateCommentValue}
                            closeAlert={() => {
                                setShowCommentAlert(false);
                            }}
                            okAlert={() => {
                                setShowCommentAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showGraceAlert ?
                        <AlertComponentForGrace
                            okmsg={'Ok'}
                            cancelmsg={'Cancel'}
                            title={'Enter Grace'}
                            updateGraceValue={updateGraceValue}
                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                            minGrace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        // (currentSection == 0) && showCovidChecklistFlag ?
                                        //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].parameter_grace_minimum
                                        //     :
                                        modifiedCheckListData[currentSection].data[currentIndex].parameter_grace_minimum ?
                                            modifiedCheckListData[currentSection].data[currentIndex].parameter_grace_minimum : 0
                                    :
                                    0
                            }
                            maxGrace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        // (currentSection == 0) && showCovidChecklistFlag ?
                                        //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].parameter_grace_maximum
                                        //     :
                                        modifiedCheckListData[currentSection].data[currentIndex].parameter_grace_maximum ?
                                            modifiedCheckListData[currentSection].data[currentIndex].parameter_grace_maximum : 30
                                    :
                                    30
                            }
                            helperText={'Enter grace in between'}
                            grace={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    currentSection === '' && currentIndex === ''
                                        ?
                                        ''
                                        :
                                        // (currentSection == 0) && showCovidChecklistFlag ?
                                        //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].grace
                                        //     :
                                        modifiedCheckListData[currentSection].data[currentIndex].grace
                                    :
                                    ''
                            }
                            message={'Enter Grace'}
                            closeAlert={() => {
                                setShowGraceAlert(false);
                            }}
                            okAlert={() => {
                                setShowGraceAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showInformationAlert
                        ?
                        <AlertComponentForInformation
                            showMessage={true}
                            title={(taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ? 'Information' : 'Guidance Rules'}
                            message={
                                modifiedCheckListData && modifiedCheckListData.length > 0
                                    ?
                                    (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ?
                                        modifiedCheckListData[currentSection].NOC_parameter_inspection_criteria
                                        :
                                        // (currentSection == 0) && showCovidChecklistFlag ?
                                        //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].parameter_guidance_rules
                                        //     :
                                        modifiedCheckListData[currentSection].data[currentIndex].parameter_guidance_rules
                                    :
                                    ''
                            }
                            closeAlert={() => {
                                setShowInformationAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showScoreAlert
                        ?
                        <AlertComponentForScore
                            title={'Select score'}
                            showScore={true}
                            onClickScoreListItem={onClickScoreListItem}
                            scoreArray={scoreArray}
                            closeAlert={() => {
                                setShowScoreAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showRegulationAlert
                        ?
                        <AlertComponentForRegulation
                            title={'Regulation'}
                            message={regulationString}
                            closeAlert={() => {
                                setShowRegulationAlert(false);
                            }}
                        />
                        :
                        null
                }

                {
                    showDescAlert
                        ?
                        <AlertComponentForRegulation
                            title={'Regulation'}
                            message={
                                taskType.toLowerCase().includes('noc') ?
                                    modifiedCheckListData[currentSection].NOC_parameter_regulation_article_no
                                    :
                                    regulationString
                            }
                            closeAlert={() => {
                                setShowDescAlert(false);
                            }}
                        />
                        :
                        null
                }
                {
                    showAttachmentAlert
                        ?
                        <AlertComponentForAttachment
                            title={'Attachment'}
                            attachmentOne={async () => {
                                await attachedImageToAlertImageView('one');
                            }}
                            attachmentTwo={async () => {
                                await attachedImageToAlertImageView('two');
                            }}
                            image1Uri={(taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance' || taskType.toLowerCase() == 'bazar inspection') ?
                                modifiedCheckListData[currentIndex].image1Uri
                                :
                                // (currentSection == 0) && showCovidChecklistFlag ?
                                //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].image1Uri
                                //     :
                                modifiedCheckListData[currentSection].data[currentIndex].image1Uri
                            }
                            image2Uri={(taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance' || taskType.toLowerCase() == 'bazar inspection') ?
                                modifiedCheckListData[currentIndex].image2Uri
                                :
                                // (currentSection == 0) && showCovidChecklistFlag ?
                                //     modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].image2Uri
                                //     :
                                modifiedCheckListData[currentSection].data[currentIndex].image2Uri
                            }
                            // base64One={
                            //     (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ?
                            //         (modifiedCheckListData && modifiedCheckListData.length > 0
                            //             ?
                            //             currentIndex === ''
                            //                 ?
                            //                 ''
                            //                 :
                            //                 modifiedCheckListData[currentSection].attachment1
                            //             :
                            //             '')
                            //         :
                            //         (modifiedCheckListData && modifiedCheckListData.length > 0
                            //             ?
                            //             currentSection === '' && currentIndex === ''
                            //                 ?
                            //                 ''
                            //                 :
                            //                 modifiedCheckListData[currentSection].data[currentIndex].image1Base64
                            //             :
                            //             '')
                            // }
                            // base64Two={
                            //     (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ?
                            //         modifiedCheckListData && modifiedCheckListData.length > 0
                            //             ?
                            //             currentSection === '' && currentIndex === ''
                            //                 ?
                            //                 ''
                            //                 :
                            //                 modifiedCheckListData[currentSection].attachment2
                            //             :
                            //             ''
                            //         :
                            //         modifiedCheckListData && modifiedCheckListData.length > 0
                            //             ?
                            //             currentSection === '' && currentIndex === ''
                            //                 ?
                            //                 ''
                            //                 :
                            //                 modifiedCheckListData[currentSection].data[currentIndex].image2Base64
                            //             :
                            //             ''
                            // }
                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                            closeAlert={() => {
                                setShowAttachmentAlert(false);
                            }}
                        />
                        :
                        null
                }
                {
                    showTableNameAlert
                        ?
                        <AlertComponentForTableName
                            title={'Table Name'}
                            disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
                            closeAlert={() => {
                                setShowTableNameAlert(false);
                            }}
                            comment={
                                (taskType.toLowerCase() == 'bazar inspection') ?
                                    modifiedCheckListData[currentSection].Comment :
                                    ''
                            }
                            updateCommentValue={updateCommentValue}
                        />
                        :
                        null
                }

                <View style={{ minHeight: HEIGHT * 0.25, height: 'auto' }}>
                    {
                        taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') ?

                            <ChecklisConponentFrNOC
                                onNAClick={onNAClick}
                                onNIClick={onNIClick}
                                onScoreImageClick={onScoreImageClick}
                                onGraceImageClick={onGraceImageClick}
                                onCommentImageClick={onCommentImageClick}
                                onInfoImageClick={onInfoImageClick}
                                onDescImageClick={onDescImageClick}
                                onAttachmentImageClick={onAttachmentImageClick}
                                onRegulationClick={onRegulationClick}
                                onComplianceClick={onComplianceClick}
                                isArabic={context.isArabic}
                                data={modifiedCheckListData}
                            />
                            :
                            taskType.toLowerCase() == 'bazar inspection' ?

                                <ChecklistComponentForBazar
                                    onNAClick={onNAClick}
                                    onNIClick={onNIClick}
                                    onScoreImageClick={onScoreImageClick}
                                    onGraceImageClick={onGraceImageClick}
                                    onCommentImageClick={onCommentImageClick}
                                    onInfoImageClick={onInfoImageClick}
                                    onDescImageClick={onDescImageClick}
                                    onAttachmentImageClick={onAttachmentImageClick}
                                    onRegulationClick={onRegulationClick}
                                    onComplianceClick={onComplianceClick}
                                    onTableNameAlertClick={onTableNameAlertClick}
                                    isArabic={context.isArabic}
                                    data={modifiedCheckListData}
                                />
                                :
                                taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance' ?

                                    <ChecklistComponentForSupervisory
                                        onNAClick={onNAClick}
                                        onNIClick={onNIClick}
                                        onScoreImageClick={onScoreImageClick}
                                        onGraceImageClick={onGraceImageClick}
                                        onCommentImageClick={onCommentImageClick}
                                        onInfoImageClick={onInfoImageClick}
                                        onDescImageClick={onDescImageClick}
                                        onAttachmentImageClick={onAttachmentImageClick}
                                        onRegulationClick={onRegulationClick}
                                        onComplianceClick={onComplianceClick}
                                        isArabic={context.isArabic}
                                        data={modifiedCheckListData}
                                    />
                                    :
                                    modifiedCheckListData && modifiedCheckListData.length > 0
                                        ?
                                        <AccordionComponent
                                            onDashClick={onDashClick}
                                            onNAClick={onNAClick}
                                            onNIClick={onNIClick}
                                            onScoreImageClick={onScoreImageClick}
                                            onGraceImageClick={onGraceImageClick}
                                            onCommentImageClick={onCommentImageClick}
                                            onInfoImageClick={onInfoImageClick}
                                            onDescImageClick={onDescImageClick}
                                            onAttachmentImageClick={onAttachmentImageClick}
                                            onRegulationClick={onRegulationClick}
                                            // scrolltoQuetionNumber={(que) => { scrollToQue(que) }}
                                            // heightOfView={(height) => { heightOfView(height) }}
                                            isArabic={context.isArabic}
                                            data={modifiedCheckListData} />
                                        :
                                        null
                    }
                </View>

                <View style={{ height: 15 }} />
            </ScrollView>
        </View>
    )
})

const styles = StyleSheet.create({
    textModal: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'column',
        position: 'absolute',
        // height: HEIGHT * 0.50,
        width: WIDTH * 0.90,
        // borderRadius: 15,
        //marginTop: 200,
        // backgroundColor: '#003a5d',
        backgroundColor: 'white',
        borderRadius: 5,
        zIndex: 8
    },
    diamondView: {
        width: 45,
        height: 45,
        transform: [{ rotate: '45deg' }]
    }
});

export default observer(ChecklistComponentStepOne);
