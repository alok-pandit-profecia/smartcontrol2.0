import React, { useContext, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Image, View, ScrollView, StyleSheet, TouchableOpacity, Modal, Text, FlatList, Dimensions, ToastAndroid, PermissionsAndroid, Platform, Alert } from "react-native";
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;
import { fontFamily, fontColor } from '../config/config';
import Strings from './../config/strings';
import TaskSchema from '../database/TaskSchema';
import { observer } from 'mobx-react';
import { Context } from '../utils/Context';
import AccordionComponentForFollowUp from '../components/AccordionComponentForFollowUp';
import { RealmController } from '../database/RealmController';
let realm = RealmController.getRealmInstance();
import { RootStoreModel } from '../store/rootStore';
import useInject from "../hooks/useInject";
import moment from 'moment';
import CheckListSchema from '../database/CheckListSchema';
import Inspectionbase64Schema from '../database/Inspectionbase64Schema';
import AlertComponentForError from '../components/AlertComponentForError';
import AlertComponentForComment from './AlertComponentForComment';
import AlertComponentForGrace from './AlertComponentForGrace';
import AlertComponentForInformation from '../components/AlertComponentForError';
import FollowUpAlertComponentForScore from './FollowUpAlertComponentForScore';
import AlertComponentForRegulation from './AlertComponentForRegulation';
import AlertComponentForAttachment from './AlertComponentForAttachment';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { useIsFocused } from '@react-navigation/native';
import TableComponent from './TableComponent';
import ButtonComponent from './ButtonComponent';
import * as Animatable from 'react-native-animatable';

// import inspectionDetails from '../../src/routes/inspectionDetails';

const FollowUpComponent = forwardRef((props: any, ref) => {

  const context = useContext(Context);
  const [modifiedCheckListData, setModifiedCheckListData] = useState(Array());
  let startTime: any = '';
  let timeStarted: any = '';
  let timeElapsed: any = '';

  const mapStore = (rootStore: RootStoreModel) => ({ myTasksDraft: rootStore.myTasksModel, bottomBarDraft: rootStore.bottomBarModel })
  const { myTasksDraft, bottomBarDraft } = useInject(mapStore);

  // individual section and index for checklist
  const [currentSection, setCurrentSection] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(Boolean);
  const [currentGrace, setCurrentGrace] = useState(Boolean);
  const [isCalculating, setIsCalculating] = useState(Boolean);
  const [base64Array, setBase64Array] = useState(Array());
  const [previewCheckList, setpreviewCheckList] = useState(Array());
  const [priview, setPriview] = useState(false);

  // alert alert components variables
  const [showCommentAlert, setShowCommentAlert] = useState(false);
  const [showScoreAlert, setShowScoreAlert] = useState(false);
  const [showGraceAlert, setShowGraceAlert] = useState(false);
  const [showInformationAlert, setShowInformationAlert] = useState(false);
  const [showRegulationAlert, setShowRegulationAlert] = useState(false);
  const [showAttachmentAlert, setShowAttachmentAlert] = useState(false);

  const [title, setTitle] = useState('');
  const [scoreArray, setScoreArray] = useState([
    { score: "4", description: "Satisfactory" },
    { score: "3", description: "Notice" },
    { score: "2", description: "First Warning" },
    { score: "1", description: "Final Warning" },
    { score: "0", description: "Violations" }
  ]
  );
  const [scoreArrayCovid, setScoreArrayCovid] = useState([
    { score: "4", description: "Satisfactory" },
    { score: "1", description: "Final Warning" },
    { score: "0", description: "Violations" }
  ]
  );
  const [scoreArray1, setScoreArray1] = useState(
    [
      { score: "Y", title: 'Yes' },
      { score: "N", title: 'No' },
    ]

  );
  const [scoreArray2, setScoreArray2] = useState(
    [
      { score: "Y", title: 'Yes' }
    ]

  );
  // regulation array of checklist
  const [regulationString, setRegulationString] = useState('');

  const [base64One, setBase64One] = useState('');
  const [base64Two, setBase64two] = useState('');
  const isFocused = useIsFocused();

  const [commentErrorIndex, setCommentErrorIndex] = useState(0);
  const [errorGraceAlert, setErrorGraceAlert] = useState(false);
  const [errorCommentAlert, setErrorCommentAlert] = useState(false);
  const [allowedClick, setAllowedClick] = useState(true);

  const [graceErrorIndex, setGraceErrorIndex] = useState(0);
  const [graceErrorSectionTitle, setGraceErrorSectionTtile] = useState('');
  const [commentErrorSectionTitle, setCommentErrorSectionTtile] = useState('');
  const [finalTime, setFinalTime] = useState('00:00:00');
  const [inspectionDetails, setInspectionDetails] = useState(Object());

  let taskType = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskType ? JSON.parse(myTasksDraft.selectedTask).TaskType : '' : ''
  let taskStatus = myTasksDraft.selectedTask != '' ? JSON.parse(myTasksDraft.selectedTask).TaskStatus ? JSON.parse(myTasksDraft.selectedTask).TaskStatus : '' : ''

  useEffect(() => {
    //  setinspectionDetails(JSON.parse(myTasksDraft.selectedTask));

    try {
      let inspTemp: any = props.inspDetails ? props.inspDetails : {};
      let allowedClickTemp: any = props.allowedClick;
      setAllowedClick(allowedClickTemp);

      setInspectionDetails(inspTemp);

      setCurrentGrace(true);
      setCurrentScore(true);

      let tempModifiedCheckListData: any = [];
      let temp: any = props.modifiedCheckListData ? props.modifiedCheckListData : [];
      //console.log("temp in follow component", temp)

      if (temp && temp.length > 0) {
        let notcovidque = Array();


        notcovidque = [...temp]
        // for (let index = 0; index < temp.length; index++) {
        //   const element = temp[index];
        //   if (element.covidQuestion) {
        //     covidque.push(element)
        //   } else {
        // notcovidque.push(element)
        // }
        // }
        // console.log(JSON.stringify(temp))
        // let result1 = Array.from(new Set(temp.map((item: any) => item.parameter_type)))
        //   .map(parameter_type => {
        //     return { parameter_type: parameter_type };
        //   });

        // console.log("result1result1result1::" + JSON.stringify(result1))
        // for (let i = 0; i < result1.length; i++) {
        //   let dataArray = [];
        //   for (let j = 0; j < temp.length; j++) {
        //     let element: any = temp[j];
        //     debugger
        //     if (element.parameter_type == result1[i].parameter_type) {
        //       let obj: any = element;
        //       if (element.parameter_type === 'EHS') {
        //         obj.naNiDisableForEHS = true;
        //         obj.informationDisableForEHS = true;
        //       }
        //       dataArray.push(obj);
        //     }
        //   }

        //   if (result1[i].parameter_type) {
        //     covidModifiedCheckListData.push(
        //       // {
        //       // 'title': result1[i].parameter_type,
        //       // 'data': 
        //       dataArray
        //       // }
        //     )

        //   }

        // }
        // if (covidModifiedCheckListData.length) {
        //   let tempAA = Array();
        //   for (let index = 0; index < covidModifiedCheckListData.length; index++) {
        //     const element = covidModifiedCheckListData[index];
        //     tempAA = [...tempAA, ...element]
        //   }
        //   tempModifiedCheckListData.unshift({
        //     'title': `جدول المخالفات والجزاءات الإدارية الخاص بكوفيد 19`,
        //     // 'title': 'COVID-19',
        //     'data': tempAA
        //   })
        // }

        let result = Array.from(new Set(notcovidque.map((item: any) => item.Answers.toString())))
          .map(Answers => {
            return { Answers: Answers };
          });
        // console.log("result>>"+JSON.stringify(result))
        if (allowedClickTemp == false && notcovidque[0].data) {
          tempModifiedCheckListData.push(temp);
        }
        else {
          for (let i = 0; i < result.length; i++) {
            let dataArray = [];
            for (let j = 0; j < temp.length; j++) {
              let element: any = temp[j];

              if ((element.Answers == result[i].Answers)) {
                let obj: any = element;
                dataArray.push(obj)
              }
            }

            if (result[i].Answers != '') {
              tempModifiedCheckListData.push({
                'title': result[i].Answers,
                'data': dataArray
              })
            }
            else {
              tempModifiedCheckListData.push({
                'title': result[i].Answers,
                'data': dataArray
              })
            }
          }
        }
        // console.log("DATA::" + JSON.stringify(tempModifiedCheckListData))

        if (allowedClickTemp == false && temp[0].data) {
          setModifiedCheckListData(tempModifiedCheckListData[0]);
        } else {
          setModifiedCheckListData(tempModifiedCheckListData);
        }
        // for (let index = 0; index < tempModifiedCheckListData.length; index++) {
        //   const element = tempModifiedCheckListData[index];
        //   // console.log(element.title)
        // }
        //   startCalculation();
      }
    }
    catch (e) {

    }
  }, []);

  const displayCounter = () => {
    let timerCounter = setInterval(() => {
      let diff = Math.abs(new Date() - startTime);
      setFinalTime(finalTime => msToTime(diff))
    }, 1000);
  }

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
  const onRegulationClick = (item: any, index: any, activesection: any, indx: any) => {
    let tempArray: any = [...modifiedCheckListData];
    if (item.FinalScore == "") {
      item.FinalScore = item.Answers;
    }

    let header = item.FinalScore;
    let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

    // set current item and index 
    setCurrentSection(sectionIndex);
    // if (sectionIndex === 0) {
    //   setCurrentIndex(indx);
    //   setCurrentSubIndex(index)
    // }
    // else {
    setCurrentIndex(index);
    // }
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

    setShowRegulationAlert(true);
    setShowScoreAlert(false);
    setShowCommentAlert(false);
    setShowInformationAlert(false);
    setShowGraceAlert(false);
    setShowAttachmentAlert(false);
  }

  useEffect(() => {
    let base64ListArr = RealmController.getbase64ListForTaskId(realm, myTasksDraft.taskId);
    if (base64ListArr && base64ListArr['0']) {
      setBase64Array(base64ListArr['0'].base64List ? JSON.parse(base64ListArr['0'].base64List) : [])
    }
    //     let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, props.selectedTaskId);
    //   //  debugger;
    //     if (checkListData && checkListData['0'] && checkListData['0'].timeElapsed) {
    //         timeStarted = checkListData['0'].timeStarted;
    //         timeElapsed = checkListData['0'].timeElapsed;
    //         let temp, time;
    //         if (timeStarted) {
    //             temp = new Date(timeStarted).getTime();
    //             time = new Date(timeElapsed).getTime() - temp;
    //         } else {
    //             temp = new Date().getTime();
    //             time = temp - new Date(timeElapsed).getTime();
    //         }
    //         startTime = moment().subtract(parseInt(time / 1000), 'seconds').toDate();
    //     } else {
    //         startTime = new Date();
    //     }
    //     displayCounter();
  }, []);


  const onClickScoreListItemSatisfactory = (item: any, index: any) => {
    setShowScoreAlert(false);
    let tempArray: any = [...modifiedCheckListData];
    let currentObj = Object()

    setCurrentScore(false);
    setCurrentGrace(false);
    // if (currentSection == 0) {
    //   currentObj = tempArray[currentSection].data[currentIndex]['data'][currentSubIndex];
    //   // setModifiedCheckListData(tempArray);
    // }
    // else {
    currentObj = tempArray[currentSection].data[currentIndex];;
    // }

    currentObj.isScore = true;
    // console.log('item.score>?'+item.score)
    currentObj.score = item.score;
    currentObj.Answers = item.score;
    currentObj.Score = item.score * currentObj.Weightage;
    currentObj.NI = false;
    currentObj.giveAnsweredQuestion = true;
    currentObj.NA = false;

    if (item.score == 4) {
      currentObj.GracePeriod = 0;
      currentObj.calculatedGracePeriod = 0;
      //var listView = document.getElementById("simpleBinding").winControl;
      //listView.forceLayout();
    }
    else if (item.score == 3 || item.score == 2) {
      // currentObj.Comments = "Satisfactory";
      currentObj.GracePeriod = 15;
      currentObj.calculatedGracePeriod = 15;
      //selectedItem.getElementsByClassName('sblInspComment-cls')[0].value = "";
      // currentObj.Comments = "";
    }
    else if (item.score == 1) {
      // currentObj.Comments = "Satisfactory";
      currentObj.GracePeriod = 7;
      currentObj.calculatedGracePeriod = 7;
      //selectedItem.getElementsByClassName('sblInspComment-cls')[0].value = "";
      // currentObj.Comments = "";
    }
    else if (item.score == 2) {
      // currentObj.Comments = "Satisfactory";
      currentObj.GracePeriod = 15;
      currentObj.calculatedGracePeriod = 15;
      //selectedItem.getElementsByClassName('sblInspComment-cls')[0].value = "";
      // currentObj.Comments = "";
    }
    else if (item.score == 0) {
      currentObj.GracePeriod = 7;
      currentObj.calculatedGracePeriod = 7;
      currentObj.Comments = "";
    }
    // currentObj.GracePeriod = 7;
    if (parseInt(item.score) == 4) {
      currentObj.Comments = "Satisfactory";
      currentObj.GracePeriod = 0;
      currentObj.calculatedGracePeriod = 0;
    }

    //console.log("CurrentObj.grace", currentObj.GracePeriod);

    currentObj.isCalculated = false;
    var tempScore;
    tempScore = 99;
    for (var i = 0; i < tempArray[currentSection].data.length; i++) {

      if (!tempArray[currentSection].data[i].NI && !tempArray[currentSection].data[i].NA) {

        if ((tempScore >= tempArray[currentSection].data[i].Answers) && (tempArray[currentSection].data[i].score != '-')) {
          tempScore = tempArray[currentSection].data[i].Answers;
          if (tempArray[currentSection].data[i].score == "N" && tempArray[currentSection].data[i].originalScore > 0) {
            tempScore = tempArray[currentSection].data[i].originalScore - 1;
            tempArray[currentSection].data[i].Answers = tempScore;
            // tempArray[currentSection].data[i].Score = tempScore;

          }
          else if (tempArray[currentSection].data[i].Answers == 0) {
            tempScore = tempArray[currentSection].data[i].Answers;
          }
        }
        else if (tempScore < tempArray[currentSection].data[i].Answers && tempArray[currentSection].data[i].score == "N") {
          tempArray[currentSection].data[i].Answers = tempArray[currentSection].data[i].originalScore - 1;
        }
      }
    }
    // alert(currentObj.Answers)

    //   CheckisViolated();
    if (currentObj.Weightage == 2) {
      currentObj.color = "##fff7b2";
    }

    if (currentObj.Answers == 0) {
      currentObj.color = "#ffc0cb";
    }
    else if (parseInt(currentObj.Weightage) == 2) {
      currentObj.color = "##fff7b2";
    }
    else {
      currentObj.color = "#ffffff";
    }
    setModifiedCheckListData(tempArray);

    //console.log(" lowest Score val", tempScore);
    // getScoreTextFromScoreValue(tempScore);

    props.onClickScoreListItem(tempArray[currentSection].data[currentIndex])

  }

  const getScoreTextFromScoreValue = (score: any) => {
    //console.log("Score val before parse", score);
    score = parseInt(score);
    var scoreText = '';
    console.log("score val " + score);
    if (score > 4)
      return "Satisfactory";

    switch (parseInt(score)) {
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
      default:
        scoreText = "Satisfactory";
        break;
    }
    myTasksDraft.setResult(scoreText);
    return scoreText;
  }

  // function CheckisViolated() {
  //     scoreObj.isSatisfactory = true;
  //     for (var i = 0; i < tempArray[sectionIndex].data.length; i++) {
  //         if (!tempArray[sectionIndex].data[i].NI && !tempArray[sectionIndex].data[i].NA) {

  //             if ((tempArray[sectionIndex].data[i].score == '' && tempArray[sectionIndex].data[i].score != 0) || tempArray[sectionIndex].data[i].score == '-')
  //                 continue;

  //             if (tempArray[sectionIndex].data[i].score != 'Y' && parseInt(tempArray[sectionIndex].data[i].score) != 4) {
  //                 //console.log("tempArray[sectionIndex].data[i].score::" + tempArray[sectionIndex].data[i].score)
  //                 scoreObj.isSatisfactory = false;
  //                 document.getElementById("inspectorRecommendationSbl").value = "Unsatisfactory";
  //                 break;
  //             }    


  //         }
  //     }
  //     if (scoreObj.isSatisfactory)
  //         document.getElementById("inspectorRecommendationSbl").value = "Satisfactory";
  // }

  const onClickScoreListItem = (item: any, index: any) => {
    // console.log("Inside on score click yes or no", item);

    setShowScoreAlert(false);

    let tempArray: any = [...modifiedCheckListData];
    let currentObj = tempArray[currentSection].data[currentIndex];
    currentObj.isScore = true;

    currentObj.score = item.score;
    currentObj.NI = false;
    currentObj.NA = false;
    currentObj.giveAnsweredQuestion = true;

    currentObj.GracePeriod = 7;
    currentObj.calculatedGracePeriod = 7;

    if (item.score == "Y") {
      //console.log("Score is yes")
      currentObj.GracePeriod = 0;
      currentObj.calculatedGracePeriod = 0;
      currentObj.Answers = '4';
      currentObj.Score = 4 * currentObj.Weightage;
      currentObj.score = item.score;
      currentObj.Comments = "Satisfactory";
    }

    else if (item.score == "N") {
      currentObj.Answers = parseInt(currentObj.FinalScore) - 1;
      currentObj.GracePeriod = 7;
      currentObj.calculatedGracePeriod = 7;
      if (currentObj.Action == "Violation") {
        currentObj.Answers = '0';
      }
      if (currentObj.Answers == "-" || currentObj.Answers == '4') {
        currentObj.Answers = currentObj.originalScore;
      }
      currentObj.Score = currentObj.Answers * currentObj.Weightage;
      currentObj.score = item.score;
    }

    var tempScore;
    tempScore = 99;

    for (var i = 0; i < tempArray[currentSection].data.length; i++) {

      if (!currentObj.NI && !currentObj.NA) {

        if ((tempScore >= currentObj.Answers) && (currentObj.score != '-')) {
          tempScore = currentObj.Answers;
          if (currentObj.score == "N" && currentObj.originalScore > 0) {
            tempScore = parseInt(currentObj.originalScore) - 1;
            currentObj.Answers = tempScore;
            currentObj.Score = currentObj.Answers * currentObj.Weightage;
            // currentObj.Score = tempScore;

          }
          else if (currentObj.originalScore == 0 && currentObj.score == "N") {
            tempScore = currentObj.originalScore;
            currentObj.Answers = tempScore;
            currentObj.Score = currentObj.Answers * currentObj.Weightage;

          }
        }
        else if (tempScore < currentObj.Answers && currentObj.score == "N") {
          currentObj.Answers = parseInt(currentObj.originalScore) - 1;
          currentObj.Score = currentObj.Answers * currentObj.Weightage;
        }
      }
    }

    if (currentObj.Answers == 0) {
      currentObj.color = '#ffc0cb';
    }
    else if (currentObj.Weightage == 2) {
      currentObj.color = "##fff7b2";
    }
    else {
      currentObj.color = "#ffffff";
    }

    setModifiedCheckListData(tempArray);

    // getScoreTextFromScoreValue(tempScore);
    props.onClickScoreListItem(tempArray[currentSection].data[currentIndex])
    //console.log("setModifiedCheckListData   tempArray[currentSection].indexx", tempArray[currentSection].data[currentIndex]);

  }

  useImperativeHandle(
    ref,
    () => ({

      calculateScore(inspectionDetai: any) {
        let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, myTasksDraft.taskId);

        let inspectionDetails = objct['0'] ? objct['0'] : JSON.parse(myTasksDraft.selectedTask)
        debugger
        // alert(JSON.stringify(item))
        let mappingData = (inspectionDetails.mappingData && (inspectionDetails.mappingData != '') && (typeof (inspectionDetails.mappingData) == 'string')) ? JSON.parse(inspectionDetails.mappingData) : [{}];
        inspectionDetails.mappingData = mappingData;

        try {

          // console.log('inspectionDetails ::' + JSON.stringify(inspectionDetails.mappingData))
          setIsCalculating(true);

          let scoreObj: any = {};
          let error = false;

          let tempArrayAll: any = [...modifiedCheckListData];
          let tempArray = Array();
          for (let indexAllTemp = 0; indexAllTemp < tempArrayAll.length; indexAllTemp++) {
            const element = tempArrayAll[indexAllTemp];
            // if (element.title == 'COVID-19') {
            //   // console.log("Inside calculation" + JSON.stringify(element.data.length));
            //   // tempArray = [...tempArray, element.data]
            //   if (element.data.length) {
            //     for (let indexdata = 0; indexdata < element.data.length; indexdata++) {
            //       const elementdata = element.data[indexdata];
            //       tempArray.push(elementdata)
            //     }
            //   }
            // }
            // else {
            tempArray.push(element)
            // }
          }
          console.log("Inside calculation" + JSON.stringify(tempArray.length));

          const gettitle = (title: any) => {
            if (title.toString() === '0') {
              return 'Violation'
            } else if (title.toString() === '1') {
              return 'Final Warning'
            } else if (title.toString() === '2') {
              return 'First Warning'
            } else if (title.toString() === '3') {
              return 'Notices'
            } else if (title.toString() === '4') {
              return 'Satisfactory'
            } else if (title.toString() === '5') {
              return 'NI'
            }
            else {
              return title
            }
          }
          let score = 0, totalScore = 0, scorePercentage = 0, minGrace = 1000, minScore = 99, weightage = 1, abort = false, minValue = 99;


          a: for (let k = 0; k < tempArray.length && !abort; k++) {

            b: for (let i = 0; i < tempArray[k].data.length && !abort; i++) {

              // console.log('tempArray[k].title'+tempArray[k].title)
              let section = '';
              // if (tempArray[k].title == 0) {
              //   section = 'Violation'
              // } else if (tempArray[k].title == 1) {
              //   section = 'Final Warning'
              // } else if (tempArray[k].title == 2) {
              //   section = 'First Warning'
              // } else if (tempArray[k].title == 3) {
              //   section = 'Notices'
              // } else if (tempArray[k].title == 4) {
              //   section = 'Satisfactory'
              // } else if (tempArray[k].title == 5) {
              //   section = 'NI'
              // }
              // else {
              //   section = tempArray[k].title
              // }
              // console.log("tempArray[k].data[i].:::" + ((tempArray[k].data[i].Score === '') && (tempArray[k].data[i].covidQuestion)))

              // if ( (tempArray[k].data[i].Answers == '')) {

              // } else {

              // }

              // if ((tempArray[k].data[i].Score === '') && (tempArray[k].data[i].covidQuestion)) {
              //   // if (section != 'Satisfactory') {
              //   console.log("section>>" + (tempArray[k].title))
              //   error = true;
              //   Alert.alert('', "Please enter the answer for " + gettitle(tempArray[k].title) + "-" + ("- question no: " + (i + 1)));
              //   // i = k = -1;
              //   abort = true;
              //   // }
              //   break;
              // }
              // else {
              //   error = false;

              // }

              if ((tempArray[k].data[i].NI == true) || (tempArray[k].data[i].NI == 'Y')) {
                if (tempArray[k].data[i].Comments.length == 0) {
                  // var j = i + 1;
                  Alert.alert('', "Please enter the comment for " + gettitle(tempArray[k].title) + "-" + ("- question no: " + (i + 1)));
                  // alert(resourceMap.startinspectionsbl_commentforquestion_alert_msg.candidates[langID].valueAsString + j);
                  return;
                }
                else if (tempArray[k].data[i].GracePeriod.toString().length > 0 && (minGrace > parseInt(tempArray[k].data[i].GracePeriod)) && parseInt(tempArray[k].data[i].GracePeriod) > 0) {
                  minGrace = parseInt(tempArray[k].data[i].GracePeriod);
                  continue;
                }
                if (tempArray[k].data[i].NI && ((tempArray[k].data[i].GracePeriod === '-') || (tempArray[k].data[i].GracePeriod === ''))) {
                  // var j = i + 1;
                  Alert.alert('', "Please enter the grace for " + gettitle(tempArray[k].title) + "-" + ("- question no: " + (i + 1)));
                  // alert(resourceMap.startinspection_entergrace_alert_msg.candidates[langID].valueAsString + j);
                  return;
                }

              }
              else {
                if (tempArray[k].data[i].Comments.length == 0) {

                  // var j = i + 1;
                  Alert.alert('', "Please enter the Comment for " + gettitle(tempArray[k].title) + "-" + ("- question no: " + (i + 1)));
                  // alert(resourceMap.startinspection_entercomment_alert_msg.candidates[langID].valueAsString + j);
                  return;

                }
                if (tempArray[k].data[i].Weightage == "" || tempArray[k].data[i].Weightage == null) {
                  weightage = 1;
                } else {
                  weightage = parseInt(tempArray[k].data[i].Weightage);
                }

              }

              if (tempArray[k].data[i].score == 'Y') {
                tempArray[k].data[i].FinalScore = 4;
                tempArray[k].data[i].GracePeriod = 0;
                tempArray[k].data[i].calculatedGracePeriod = 0;
              }
              if (parseInt(tempArray[k].data[i].score) == 4) {
                // For Score == 4
                //  Score Calculation
                tempArray[k].data[i].FinalScore = 4;
                tempArray[k].data[i].GracePeriod = 0;
                tempArray[k].data[i].calculatedGracePeriod = 0;
                score = score + parseInt(tempArray[k].data[i].FinalScore) * tempArray[k].data[i].Weightage;
                totalScore = totalScore + (4 * weightage);

              }
              else {
                // For score other than 4 , 
                // If date is from future, do score and grace calculations
                let date1 = new Date(tempArray[k].data[i].GracePeriodDate);
                let date2 = new Date();

                if (date1 > date2) {
                  //Non Conformant Answered
                  // console.log("SCore>>>>" + tempArray[k].data[i].Answers +","+tempArray[k].data[i].score+","+tempArray[k].data[i].GracePeriodDate )
                  if (tempArray[k].data[i].score != '' && tempArray[k].data[i].score != '-' && !tempArray[k].data[i].NI) {
                    tempArray[k].data[i].FinalScore = tempArray[k].data[i].Answers;
                    score = score + (parseInt(tempArray[k].data[i].FinalScore) * weightage);
                    totalScore = totalScore + (4 * weightage);
                    minValue = parseInt(tempArray[k].data[i].Answers);
                    // console.log("SCore>>>>" + tempArray[k].data[i].Answers +","+tempArray[k].data[i].score )
                  }
                  else {
                    // Non Conformant not answered
                    try {
                      // console.log('date1 is greater than date2' + date1 + 'sssss' + date2);
                      tempArray[k].data[i].isNotAnswered = true;
                      if (!isNaN(parseInt(tempArray[k].data[i].score))) {
                        tempArray[k].data[i].FinalScore = tempArray[k].data[i].Score
                      }
                      else if (!isNaN(parseInt(tempArray[k].data[i].Answers))) {
                        tempArray[k].data[i].FinalScore = tempArray[k].data[i].Answers
                      }

                    }
                    catch (e) {

                    }
                  }

                }
                else {
                  // If current date,
                  minValue = parseInt(tempArray[k].data[i].Answers);
                  // console.log("SCore>>>>" + tempArray[k].data[i].score.length)
                  if (((tempArray[k].data[i].score == '') || ((tempArray[k].data[i].score) === '-'))) {
                    if (!(tempArray[k].data[i].NI) && (gettitle(tempArray[k].title) != 'Satisfactory')) {
                      var j = i + 1;
                      // console.log('item.score>?' + JSON.stringify(tempArray[k].data[i]))
                      Alert.alert('', "Please enter the Answer for " + gettitle(tempArray[k].title) + "-" + ("- question no: " + (i + 1)));
                      // alert(resourceMap.startinspectionsbl_answerforquestionnumber_alert_msg.candidates[langID].valueAsString + j);
                      return;
                    }
                  }
                  else {
                    var temp;
                    if ((!isNaN(parseInt(tempArray[k].data[i].Answers))))
                      temp = parseInt(tempArray[k].data[i].Answers);
                    else
                      temp = parseInt((tempArray[k].data[i].Score / weightage));
                    if ((parseInt(tempArray[k].data[i].Answers) > 0)) {
                      if (!isNaN(parseInt(tempArray[k].data[i].score))) {
                        tempArray[k].data[i].FinalScore = tempArray[k].data[i].score;

                      }
                      else if ((tempArray[k].data[i].score == 'N') && tempArray[k].data[i].originalScore > 0) {
                        tempArray[k].data[i].FinalScore = tempArray[k].data[i].originalScore - 1;
                        tempArray[k].data[i].Answers = tempArray[k].data[i].FinalScore;
                      }
                    }
                    else if ((parseInt(tempArray[k].data[i].Answers) == 0)) {
                      tempArray[k].data[i].FinalScore = tempArray[k].data[i].Answers;
                    }
                    score = score + (parseInt(tempArray[k].data[i].FinalScore) * weightage);
                    totalScore = totalScore + (4 * weightage);

                  }
                }
              }
              if ((tempArray[k].data[i].GracePeriod) < 0) {
                tempArray[k].data[i].GracePeriod = 0;
                tempArray[k].data[i].calculatedGracePeriod = 0;
              }

              if (tempArray[k].data[i].GracePeriod > 0 && minGrace > parseInt(tempArray[k].data[i].GracePeriod) && parseInt(tempArray[k].data[i].GracePeriod) > 0 && parseInt(tempArray[k].data[i].FinalScore) < 4)
                minGrace = parseInt(tempArray[k].data[i].GracePeriod);
              if (tempArray[k].data[i])
                tempArray[k].data[i].isCalculated = true;

            }

          }

          a: for (let k = 0; k < tempArray.length && !abort; k++) {

            b: for (let i = 0; i < tempArray[k].data.length && !abort; i++) {

              let date1 = new Date(tempArray[k].data[i].GracePeriodDate);
              let date2 = new Date();

              if (date1 > date2) {
                //Non Conformant Answered
                if (tempArray[k].data[i].score != '' && tempArray[k].data[i].score != '-' && !tempArray[k].data[i].NI) {

                  if (parseInt(tempArray[k].data[i].Answers) < parseInt(minValue)) {
                    minValue = parseInt(tempArray[k].data[i].Answers);
                  }

                }


              } else {
                if (parseInt(tempArray[k].data[i].Answers) < parseInt(minValue)) {
                  minValue = parseInt(tempArray[k].data[i].Answers);
                }
              }
              console.log("SCore>>>>" + tempArray[k].data[i].Answers + "," + tempArray[k].data[i].score + "," + tempArray[k].data[i].GracePeriodDate)

            }

          }
          scoreObj.minGrace = minGrace;
          if (score == 0) {
            scorePercentage = 0;
          }
          else
            scorePercentage = ((score / totalScore) * 100).toFixed(2);
          scoreObj.score = score;
          scoreObj.maxOverallScore = totalScore;
          scoreObj.scorePercent = scorePercentage;

          //if (minScore > 0 && minScore!=4)
          //  minScore--;

          if (minValue === 0) {
            console.log('minValue' + minValue);
            if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'])
              inspectionDetails.mappingData['0'].isViolated = true;
          }

          console.log("min lllllllllllllllllscore text ", minValue);

          scoreObj.maxScoreFinal = getScoreTextFromScoreValue(minValue);
          if (!scoreObj.isFromCompletedTask) {
            if (inspectionDetails.mappingData && inspectionDetails.mappingData['0'])
              inspectionDetails.mappingData['0'].minScore = scoreObj.maxScoreFinal;
          }
          // scoreObj.overallComments = document.getElementById("overallCommentsSbl").value;
          //console.log(scoreObj.maxScoreFinal + "Min Score :: " + minScore);
          if (minGrace == 1000) {
            if (scoreObj.isSatisfactory == true) {
              scoreObj.minGrace = "";
            }
            else {
              scoreObj.minGrace = "7";
            }
          }
          console.warn("scoreObj.minGrace::" + scoreObj.minGrace)
          if (!scoreObj.isFromCompletedTask) {
            if (inspectionDetails.mappingData && inspectionDetails.mappingData['0']) {
              inspectionDetails.mappingData['0'].minScore = scoreObj.maxScoreFinal;
              inspectionDetails.mappingData['0'].finalResult = scoreObj.maxScoreFinal;
              inspectionDetails.mappingData['0'].total_score = score;

              /**********************************************************NEw code *******************************/
              inspectionDetails.mappingData['0'].grade_percentage = scorePercentage;
            }
          }

          console.log("Score Obj finalResult", inspectionDetails.mappingData['0'].finalResult);
          let scoreArray: any = [];
          scoreArray.push(scoreObj);
          myTasksDraft.setScoreFollow(JSON.stringify(scoreArray));


          let taskDetails = { ...inspectionDetails };
          if (taskDetails.mappingData) {
            inspectionDetails.mappingData['0'].minScore
            let mappingData = taskDetails.mappingData ? taskDetails.mappingData : [{}];
            mappingData['0'].inspectionForm = tempArray;
            taskDetails.mappingData = mappingData;
            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
              // ToastAndroid.show('Task objct successfully ', 1000);
            });
          }

          // setModifiedCheckListData(tempArray);
          // setInspectionDetails(taskDetails);

          if (error) {
            // ToastAndroid.show("Error", ToastAndroid.LONG);

            console.log("In if " + myTasksDraft.count)

          }
          else {

            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

            if (!error) {
              let count = parseInt(myTasksDraft.count);
              count = count + 1;
              // console.log('count ::' + count.toString())
              if (count <= 3 && count >= 1) {
                if (checkListData && checkListData['0']) {
                  let flag = false;
                  let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
                  setpreviewCheckList(checkList);
                  for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                    const element = checkList[indexPreview];
                    // console.log("checkList.length>" + typeof (element.Answers))
                    if (element.originalScore != element.Answers) {
                      if ((element.Answers !== '' && parseInt(element.Answers) < 4)) {
                        flag = true;
                        break;
                      }
                      else if (element.NI == true) {
                        flag = true;
                        break;
                      }
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

              }
            }

            // }
          }
        }
        catch (e: any) {

          let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (myTasksDraft.isMyTaskClick == 'campaign' ? myTasksDraft.campaignChecklistTaskId : myTasksDraft.taskId));

          let count = parseInt(myTasksDraft.count);
          count = count + 1;
          if (count <= 3 && count >= 1) {
            if (checkListData && checkListData['0']) {
              let flag = false;
              let checkList = checkListData['0'].checkList ? JSON.parse(checkListData['0'].checkList) : Array();
              setpreviewCheckList(checkList);
              for (let indexPreview = 0; indexPreview < checkList.length; indexPreview++) {
                const element = checkList[indexPreview];
                // if (element.GracePeriod > ) {
                if (element.originalScore != element.Answers) {
                  if ((element.Answers !== '' && parseInt(element.Answers) < 4)) {
                    flag = true;
                    break;
                  }
                  else if (element.NI == true) {
                    flag = true;
                    break;
                  }
                }
                // }
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
            // myTasksDraft.setCount(count.toString())
          }
          // }
          console.log('', 'exceeption' + (e));
        }
      }
    })
  )

  const onScoreImageClick = (item: any, index: any, activeSections: any, indx: any) => {

    if (allowedClick) {
      let tempScoreArray: any = [];

      let tempArray: any = [...modifiedCheckListData];
      if (item.FinalScore == "") {
        item.FinalScore = item.Answers ? item.Answers.toString() : "";
      }

      let header = item.FinalScore;
      let sectionIndex = activeSections;
      // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

      //debugger;
      if ((item.ParameterNumber == '3(1/3)') || (item.ParameterNumber == '3(2/3)') || (item.ParameterNumber == '4(4)') || (item.ParameterNumber == '6(1/6)')
        || (item.ParameterNumber == '6(2/6)') || (item.ParameterNumber == '6(4/6)') || (item.ParameterNumber == '6(5/6)') || (item.ParameterNumber == '6(6/6)') || (item.ParameterNumber == '6(7/6)')
        || (item.ParameterNumber == '6(8/6)') || (item.ParameterNumber == '11(3/11)')) {
        setTitle('6');
      }
      else {
        setTitle(item.FinalScore);
      }
      // set current item and index 
      setCurrentSection(sectionIndex);
      // if (sectionIndex === 0) {
      //   setCurrentIndex(indx);
      //   setCurrentSubIndex(index)
      // }
      // else {
      setCurrentIndex(index);
      // }

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
    // if (currentSection == 0) {
    //   console.log(JSON.stringify(tempArray[currentSection].data[currentIndex]['data'][currentSubIndex]))
    //   tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].GracePeriod = val;
    //   // setModifiedCheckListData(tempArray);
    // }
    // else {
    tempArray[currentSection].data[currentIndex].GracePeriod = val;
    // }

    props.updateGraceValue(tempArray[currentSection].data[currentIndex]);
    setModifiedCheckListData(tempArray);
    setShowAttachmentAlert(false);
  }

  const onGraceImageClick = (item: any, index: any, activeSections: any, indx: any) => {
    if (allowedClick) {

      let tempArray = [...modifiedCheckListData];
      if (item.FinalScore == "") {
        item.FinalScore = item.Answers;
      }

      let header = item.FinalScore;
      let sectionIndex = activeSections;
      // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

      // set current item and index 
      setCurrentSection(sectionIndex);
      // if (sectionIndex === 0) {
      //   setCurrentIndex(indx);
      //   setCurrentSubIndex(index)
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
  }

  const updateCommentValue = (val: any) => {
    let tempArray: any = [...modifiedCheckListData];
    // console.log(currentIndex + ',' + currentSection)
    // if (currentSection == 0) {
    //   console.log(JSON.stringify(tempArray[currentSection].data[currentIndex]['data'][currentSubIndex]))

    //   tempArray[currentSection].data[currentIndex]['data'][currentSubIndex].Comments = val;
    // }
    // else {
    tempArray[currentSection].data[currentIndex].Comments = val;
    // }
    setModifiedCheckListData(tempArray);
    props.updateCommentValue(tempArray[currentSection].data[currentIndex]);
  }

  const onCommentImageClick = (item: any, index: any, activeSections: any, indx: any) => {
    // Alert.alert(JSON.stringify(allowedClick))
    if (allowedClick) {
      let tempArray = [...modifiedCheckListData];

      if (item.FinalScore == "") {
        item.FinalScore = item.Answers;
      }
      else if (item.Answers && (item.Answers.toString() == "5")) {
        item.FinalScore = item.Answers;
      }

      let header = item.FinalScore;
      let sectionIndex = activeSections;
      // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

      // set current item and index 
      setCurrentSection(sectionIndex);
      // if (sectionIndex === 0) {
      //   // console.log(indx+","+index)
      //   setCurrentIndex(indx);
      //   setCurrentSubIndex(index)
      // }
      // else {
      setCurrentIndex(index);
      // }
      // console.log('sectionIndex:' + JSON.stringify(index) + ',index' + JSON.stringify(sectionIndex))
      if (sectionIndex == -1) {
        sectionIndex = tempArray.findIndex((item: any) => item.title == header);
        setShowCommentAlert(true);
      }
      if (sectionIndex > -1) {
        setShowCommentAlert(true);
      }
      setShowGraceAlert(false);
      setShowScoreAlert(false);
      setShowInformationAlert(false);
      setShowRegulationAlert(false);
      setShowAttachmentAlert(false);
    }
  }

  const onInfoImageClick = (item: any, index: any, activeSections: any, indx: any) => {


    let tempArray = [...modifiedCheckListData];
    if (item.FinalScore == "") {
      item.FinalScore = item.Answers;
    }

    // alert(activeSections)
    let header = item.FinalScore;
    let sectionIndex = activeSections;
    // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

    // set current item and index 
    setCurrentSection(sectionIndex);
    // if (sectionIndex === 0) {
    //   setCurrentIndex(indx);
    //   setCurrentSubIndex(index)
    // }
    // else {
    setCurrentIndex(index);
    // }
    setShowInformationAlert(true);
    setShowGraceAlert(false);
    setShowCommentAlert(false);
    setShowScoreAlert(false);
    setShowRegulationAlert(false);
    setShowAttachmentAlert(false);

  }

  const onNAClick = (item: any, index: any) => {
    let tempArray: any = [...modifiedCheckListData];

    let header = item.FinalScore;
    let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

    // set current item and index 
    setCurrentSection(sectionIndex);
    setCurrentIndex(index);


    // setModifiedCheckListData(tempArray);
  }

  const dateDiffInDays = (a: any, b: any) => {
    // Discard the time and time-zone information.
    var _MS_PER_DAY = 1000 * 60 * 60 * 24;
    a = new Date(a);
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);

  }

  const onDashClick = (item: any, index: any, activeSections: any) => {
    if (allowedClick) {
      console.log("Dash clicked" + activeSections);

      let tempArray: any = [...modifiedCheckListData];

      if (item.FinalScore == "") {
        item.FinalScore = item.Answers;
      }
      let header = item.FinalScore;
      // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
      let sectionIndex = activeSections;

      // set current item and index 
      setCurrentSection(sectionIndex);
      setCurrentIndex(index);
      let currentObj = tempArray[sectionIndex].data[index];
      currentObj.isScore = false;
      currentObj.scoreDisable = false;
      currentObj.NI = false;

      // currentObj.wasNI = false;
      // currentObj.scoreDisable = false;
      // currentObj.Answers = '-'
      // currentObj.NI = false;
      // currentObj.GracePeriod = 0;
      // currentObj.Comments = ''

      if (!currentObj.wasUnAnswered) {
        currentObj.Answers = 4;
        currentObj.Comments = 'Satisfactory';
        currentObj.score = 4 * currentObj.Weightage;
        currentObj.Score = currentObj.Answers * currentObj.Weightage;
        currentObj.wasNI = true;
        currentObj.giveAnsweredQuestion = true;
        currentObj.GracePeriod = 0;
        currentObj.calculatedGracePeriod = 0;
        currentObj.grace = 0;
      }
      else {
        currentObj.score = '-';
        currentObj.Comments = '';
        var gracePeriodTemp = (-dateDiffInDays(currentObj.GracePeriodDate, new Date()));
        if (gracePeriodTemp < 0) {
          gracePeriodTemp = 0;
        }
        currentObj.GracePeriod = gracePeriodTemp;
        currentObj.calculatedGracePeriod = gracePeriodTemp;
        currentObj.grace = gracePeriodTemp;

        currentObj.Answers = '-';
        //currentObj.Score = '';
        currentObj.wasNI = true;
        if (currentObj.calculatedGracePeriod < 0) {
          currentObj.GracePeriod = 0;
          currentObj.calculatedGracePeriod = 0;
          currentObj.grace = 0;
        }
      }


      let tempScore;
      tempScore = 99;
      for (var i = 0; i < tempArray[sectionIndex].data.length; i++) {
        if (!tempArray[sectionIndex].data[i].NI && !tempArray[sectionIndex].data[i].NA) {
          if ((tempScore >= tempArray[sectionIndex].data[i].Answers) && (tempArray[sectionIndex].data[i].score != '-')) {
            tempScore = tempArray[sectionIndex].data[i].Answers;
            if (tempArray[sectionIndex].data[i].score == "N" && tempArray[sectionIndex].data[i].originalScore > 0) {
              tempScore = tempArray[sectionIndex].data[i].originalScore - 1;
              tempArray[sectionIndex].data[i].Answers = tempScore;

            }
            else if (tempArray[sectionIndex].data[i].Answers == 0) {
              tempScore = tempArray[sectionIndex].data[i].Answers;
            }
          }
          else if (tempScore < tempArray[sectionIndex].data[i].Answers && tempArray[sectionIndex].data[i].score == "N") {
            tempArray[sectionIndex].data[i].Answers = tempArray[sectionIndex].data[i].originalScore - 1;
          }
        }
      }
      if (parseInt(currentObj.Weightage) == 2) {
        currentObj.color = "##fff7b2";
      } else {
      }
      props.onNIClick(tempArray[sectionIndex].data[index])

      setModifiedCheckListData(tempArray);
      // getScoreTextFromScoreValue(tempScore);
    }
  }

  const onNIClick = (item: any, index: any, activeSections: any) => {
    if (allowedClick) {

      let tempArray: any = [...modifiedCheckListData];

      if (item.FinalScore == "") {
        item.FinalScore = item.Answers;
      }

      let header = item.FinalScore;
      let sectionIndex = activeSections;
      // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);
      //console.log("NI clicked", sectionIndex.toString());


      // set current item and index 
      setCurrentSection(sectionIndex);
      setCurrentIndex(index);

      let currentObj = tempArray[sectionIndex].data[index];

      currentObj.isScore = true;
      currentObj.scoreDisable = true;
      currentObj.NI = true;

      currentObj.score = '-';
      currentObj.Score = '';
      currentObj.Comments = '';
      currentObj.grace = '-';
      currentObj.GracePeriod = '-';
      currentObj.calculatedGracePeriod = '-';
      currentObj.Answers = 5;
      currentObj.NA = false;

      let tempScore;
      tempScore = 99;
      for (var i = 0; i < tempArray[sectionIndex].data.length; i++) {
        if (!tempArray[sectionIndex].data[i].NI && !tempArray[sectionIndex].data[i].NA) {
          if ((tempScore >= tempArray[sectionIndex].data[i].Answers) && (tempArray[sectionIndex].data[i].score != '-')) {
            tempScore = tempArray[sectionIndex].data[i].Answers;
            if (tempArray[sectionIndex].data[i].score == "N" && tempArray[sectionIndex].data[i].originalScore > 0) {
              tempScore = tempArray[sectionIndex].data[i].originalScore - 1;
              tempArray[sectionIndex].data[i].Answers = tempScore;

            }
            else if (tempArray[sectionIndex].data[i].Answers == 0) {
              tempScore = tempArray[sectionIndex].data[i].Answers;
            }
          }
          else if (tempScore < tempArray[sectionIndex].data[i].Answers && tempArray[sectionIndex].data[i].score == "N") {
            tempArray[sectionIndex].data[i].Answers = tempArray[sectionIndex].data[i].originalScore - 1;
          }
        }
      }
      if (parseInt(currentObj.Weightage) == 2) {
        currentObj.color = "##fff7b2";
      } else {
      }
      props.onNIClick(tempArray[sectionIndex].data[index])

      setModifiedCheckListData(tempArray);
      // getScoreTextFromScoreValue(tempScore);
    }
  }

  const onAttachmentImageClick = (item: any, index: any, activeSections: any, indx: any) => {
    if (allowedClick) {
      let tempArray = [...modifiedCheckListData];
      if (item.FinalScore == "") {
        item.FinalScore = item.Answers;
      }

      let header = item.FinalScore;
      let sectionIndex = activeSections;
      // let sectionIndex = tempArray.findIndex((item: any) => item.title == header);

      // set current item and index 
      setCurrentSection(sectionIndex);
      // if (sectionIndex === 0) {
      //   setCurrentIndex(indx);
      //   setCurrentSubIndex(index)
      // }
      // else {
      setCurrentIndex(index);
      // }
      setShowGraceAlert(false);
      setShowCommentAlert(false);
      setShowScoreAlert(false);
      setShowInformationAlert(false);
      setShowRegulationAlert(false);
      setShowAttachmentAlert(true);
    }
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
        ).then(async (result) => {
          //;
          if (result['android.permission.READ_EXTERNAL_STORAGE'] && result['android.permission.CAMERA'] && result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted') {
            selectImage(item);
          } else if (result['android.permission.READ_EXTERNAL_STORAGE'] || result['android.permission.CAMERA'] || result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again') {
            ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.LONG);
          }

        })

        // const granted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.CAMERA, {
        //     title: 'Smart control App',
        //     message: 'You want to use the camera',
        //     buttonNeutral: 'Ask Me Later',
        //     buttonNegative: 'Cancel',
        //     buttonPositive: 'OK',
        // })
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //     selectImage(item);
        // } else {
        // }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const selectImage = async (item: any) => {
    let options = {
      title: 'Select Image',
      quality: 0.8,
      noData: false,
      customButtons: [
        { name: 'SmartControl', title: 'Cancel' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    try {
      ImagePicker.launchCamera(options, (response) => {
        if (response.didCancel) {
          //console.log('User cancelled image picker');
        } else if (response.error) {
          //console.log('ImagePicker Error: ' + response.error);
        } else if (response.customButton) {
          //console.log('User tapped custom button: ', response.customButton);
        } else {
          //console.log('ImageResponse: ', response);
          // debugger;
          if (response.fileSize) {
            let tempArray: any = [...modifiedCheckListData];
            if (item == 'one') {
              tempArray[currentSection].data[currentIndex].image1 = response.fileName;
              // tempArray[currentSection].data[currentIndex].image1Base64 = response.data;
              tempArray[currentSection].data[currentIndex].image1Uri = response.uri;
              if (base64Array.length) {
                let flag = true;
                for (let index = 0; index < base64Array.length; index++) {
                  const element = base64Array[index];
                  if (element.uniqueQuestionId == "Evidence_" + tempArray[currentSection].data[currentIndex].ParameterNumber + "_1") {
                    element.buffer = response.data;
                    flag = false;
                    break;
                  }
                }
                if (flag) {
                  base64Array.push({
                    uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].ParameterNumber + "_1",
                    buffer: response.data
                  })
                }
              }
              else {
                base64Array.push({
                  uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].ParameterNumber + "_1",
                  buffer: response.data
                })
              }
              setBase64One(response.data);
              setModifiedCheckListData(tempArray);
              props.onAttachmentImageClick(tempArray[currentSection].data[currentIndex]);
            }
            else {
              let tempArray: any = [...modifiedCheckListData];
              tempArray[currentSection].data[currentIndex].image2 = response.fileName;
              // tempArray[currentSection].data[currentIndex].image2Base64 = response.data;
              tempArray[currentSection].data[currentIndex].image2Uri = response.uri;
              if (base64Array.length) {
                let flag = true;
                for (let index = 0; index < base64Array.length; index++) {
                  const element = base64Array[index];
                  if (element.uniqueQuestionId == "Evidence_" + tempArray[currentSection].data[currentIndex].ParameterNumber + "_2") {
                    element.buffer = response.data;
                    flag = false;
                    break;
                  }
                }
                if (flag) {
                  base64Array.push({
                    uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].ParameterNumber + "_2",
                    buffer: response.data
                  })
                }
              }
              else {
                base64Array.push({
                  uniqueQuestionId: "Evidence_" + tempArray[currentSection].data[currentIndex].ParameterNumber + "_2",
                  buffer: response.data
                })
              }
              setBase64two(response.data);
              setModifiedCheckListData(tempArray);
              props.onAttachmentImageClick(tempArray[currentSection].data[currentIndex]);
            }
            let objBase64 = {
              base64List: JSON.stringify(base64Array),
              taskId: myTasksDraft.taskId
            }
            RealmController.addbase64ListInDB(realm, objBase64, () => {

            })
          }
          else {
            ToastAndroid.show("File grater than 2MB", ToastAndroid.LONG);
          }
        }
      });

    }
    catch (error) {

    }
  }

  const renderScoreData = ({ item, index }: any) => {
    // if (item.Answers.toString() === '4') {
    //     return;
    // }

    return (
      (item.Answers.toString() === '4') || ((item.score != 'N') && (item.originalScore.toString() === item.Answers.toString()))
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
            data={[
              // { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.parano, value: parseInt(item.ParameterNumber) + 1 },
              { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.question, value: item.ParameterNumber + ":" + item.QuestionNameEnglish + ":" + item.DescriptionEnglish },
              { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.score, value: item.Answers == '5' ? "" : item.Answers },
              { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.grace, value: item.GracePeriod },
              { keyName: Strings[context.isArabic ? 'ar' : 'en'].startInspection.comments, value: item.Comments }
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
  return (

    <View style={{ flex: 1, width: '100%', alignSelf: 'center' }}>

      <View style={{ minHeight: HEIGHT * 0.2, height: '100%' }}>

        {/* <Spinner
              visible={isCalculating}
              textContent={'Calculating...'}
              overlayColor={'rgba(0,0,0,0.7)'}
              color={'#b6a176'}
              textStyle={{ fontSize: 14, color: 'black' }}
            />
        */}

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
                        console.log('count ::' + count.toString())
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
              okmsg={'OK'}
              cancelmsg={'Cancel'}
              title={'Comment'}
              comment={
                modifiedCheckListData && modifiedCheckListData.length > 0
                  ?
                  currentSection === '' && currentIndex === ''
                    ?
                    ''
                    :
                    currentSection === 0 ?
                      modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].Comments
                      :
                      modifiedCheckListData[currentSection].data[currentIndex].Comments
                  :
                  ''
              }
              message={'Enter comment'}
              updateCommentValue={updateCommentValue}
              closeAlert={() => {
                setShowCommentAlert(false);
              }}
              disabled={myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
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
              disabled={modifiedCheckListData[currentSection].data[currentIndex].Answers == 4 ? true : myTasksDraft.isMyTaskClick == 'CompletedTask' ? true : false}
              minGrace={
                modifiedCheckListData && modifiedCheckListData.length > 0
                  ?
                  currentSection === '' && currentIndex === ''
                    ?
                    ''
                    :
                    // currentSection === 0 ?
                    //   modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].parameter_grace_minimum
                    //   :
                    modifiedCheckListData[currentSection].data[currentIndex].MinGracePeriod
                  :
                  ''
              }
              maxGrace={
                modifiedCheckListData && modifiedCheckListData.length > 0
                  ?
                  currentSection === '' && currentIndex === ''
                    ?
                    ''
                    :
                    // currentSection === 0 ?
                    //   modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].parameter_grace_maximum
                    //   :
                    modifiedCheckListData[currentSection].data[currentIndex].MaxGracePeriod
                  :
                  ''
              }
              helperText={'Enter grace in between'}
              grace={
                modifiedCheckListData && modifiedCheckListData.length > 0
                  ?
                  currentSection === '' && currentIndex === ''
                    ?
                    ''
                    :
                    // currentSection === 0 ?
                    //   modifiedCheckListData[currentSection].data[currentIndex]['data'][currentSubIndex].GracePeriod
                    //   :
                    modifiedCheckListData[currentSection].data[currentIndex].GracePeriod
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
              title={'Information'}
              message={
                modifiedCheckListData && modifiedCheckListData.length > 0
                  ?
                  currentSection === '' && currentIndex === ''
                    ?
                    ''
                    :
                    modifiedCheckListData[currentSection].data[currentIndex].covidQuestion ?
                      modifiedCheckListData[currentSection].data[currentIndex].parameter_guidance_rules
                      :
                      modifiedCheckListData[currentSection].data[currentIndex].QuestionNameEnglish
                  // modifiedCheckListData[currentSection].data[currentIndex].DescriptionEnglish
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
            <FollowUpAlertComponentForScore
              title={'Select score'}
              title1={title}
              currentScore={currentScore}
              currentGrace={currentGrace}
              nonCompliance={true}
              item={modifiedCheckListData[currentSection].data[currentIndex]}
              onClickScoreListItem={onClickScoreListItem}
              onClickScoreListItemSatisfactory={onClickScoreListItemSatisfactory}
              // scoreArray={title == '4' || title == '5' ? scoreArray : title == '6' ? scoreArrayCovid : (modifiedCheckListData[currentSection].data[currentIndex].GracePeriodDate && modifiedCheckListData[currentSection].data[currentIndex].GracePeriodDate != '') ? dateDiffInDays(new Date(), new Date(modifiedCheckListData[currentSection].data[currentIndex].GracePeriodDate)) >= 0 ? scoreArray2 : scoreArray1 : scoreArray1}
              scoreArray={title == '4' || title == '5' ? scoreArray : (modifiedCheckListData[currentSection].data[currentIndex].GracePeriodDate && modifiedCheckListData[currentSection].data[currentIndex].GracePeriodDate != '') ? dateDiffInDays(new Date(), new Date(modifiedCheckListData[currentSection].data[currentIndex].GracePeriodDate)) > 0 ? scoreArray2 : scoreArray1 : scoreArray1}
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
              image1Uri={(taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ?
                modifiedCheckListData[currentIndex].image1Uri
                :
                modifiedCheckListData[currentSection].data[currentIndex].image1Uri
              }
              image2Uri={(taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food') || taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') ?
                modifiedCheckListData[currentIndex].image2Uri
                :
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
        <View style={{ height: '95%', justifyContent: 'center', alignItems: 'center' }}>

          <ScrollView style={{ minHeight: HEIGHT * 0.2, height: '100%', width: '100%' }}>
            <View style={{ minHeight: HEIGHT * 0.15, height: 'auto' }}>
              {
                modifiedCheckListData && modifiedCheckListData.length > 0
                  ?
                  <AccordionComponentForFollowUp
                    currentScore={currentScore}
                    currentGrace={currentGrace}
                    onDashClick={onDashClick}
                    onNIClick={onNIClick}
                    onScoreImageClick={onScoreImageClick}
                    onGraceImageClick={onGraceImageClick}
                    onCommentImageClick={onCommentImageClick}
                    onInfoImageClick={onInfoImageClick}
                    onAttachmentImageClick={onAttachmentImageClick}
                    onRegulationClick={onRegulationClick}
                    isArabic={context.isArabic}
                    data={modifiedCheckListData}
                  />
                  :
                  null
              }
            </View>
          </ScrollView>
        </View>

        {/* <View style={{ height: '10%', justifyContent: 'center', alignItems: 'center' }}>

          <ButtonComponent
            style={{
              height: '70%', width: '35%',
              borderRadius: 8, alignSelf: 'center', justifyContent: 'center', alignItems: 'center',
              textAlign: 'center'
            }}
            buttonClick={() => {
              calculateScore();
            }}
            buttonText={Strings[context.isArabic ? 'ar' : 'en'].condemnationForm.submitScore}
          />
        </View> */}


      </View>
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

export default observer(FollowUpComponent);
