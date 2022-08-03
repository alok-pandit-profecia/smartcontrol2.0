
let baseurl = 'https://smartcontrol.adafsa.gov.ae/';
let baseurlGet = 'https://smartcontrol.adafsa.gov.ae/';
// let baseurl = 'http://10.110.45.80:7003/soa-infra/';
// let baseurlGet = 'http://10.110.45.80:7004/';
const isDev = false;
const AppVersion = '1.0.12';

const services = {
  url: !isDev ?
    {
      appVersionUrl: baseurl + 'getAppVersion',
      loginUrl: baseurl + 'resources/SOA_PROD/GBL_ADFCA_SERV_LoginAuthentication/ADFCA_SERV_ValidateUser/ValidateUser?',
      updateEstLocationUrl: baseurl + 'resources/SOA_PROD/ADFCAMobileEstCoordinatesUpdate/UpdateCoordinatesRestService/UpdateCoordinates',
      lovURL: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_ListOfValues_RestService/ListOfValues',
      accountSyncURL: baseurlGet + 'Adfca_AdfcaAccountSyncRestService/Adfca_AdfcaAccountSyncRestService/GetAccountSyncDetails?',
      getTaskUrl: baseurlGet + 'GBL_ADFCA_GetScheduleTaskDetails/GetTaskService/GetTasks?',
      // getChecklistUrl: baseurl +'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_OPA_GetCheckList_ep',
      getChecklistUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetOPAChecklist/GetOPAChecklist',
      getOPAResultUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/OPAGETResults/OPAGETResults',
      // getBA: baseurl +  'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_GetBusinessActivities_ep',
      getBA: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetBusinessActivity/GetBusniessActvity',
      searchHistory: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_HistorySearchRestService/HistorySearch',
      // getSearchByVehicle: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_RetrieveVehicleDetails_ep',
      getSearchByVehicle: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/RetrieveVehicles/RetrieveVehicles',
      // createAdhocInspection: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_AdhocInspection_ep',
      createAdhocInspection: baseurlGet + 'GBL_ADAFSA_MOB_Application/AdhocNewInspection/AdhocNewInspection',
      ScheduleTaskDetails: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetScheduleTask/ScheduleTask?',
      srDetails: baseurlGet + 'ADFCA_ADFCASRSync/ADFCASRSyncRestService/GetSRSync?',
      // acknowledge: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_InspectionAcknowledge_ep',
      acknowledge: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/InspectionKwonledge/InspectionKwonledge',
      // submitCondemnation: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_SamplingInspection_ep',
      submitCondemnation: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/SamplingInspection/SamplingInspection',
      submitInspection: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateQuestionnarieRestService/UpdateQuestionnarie',
      // getEfstUrl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_EFST_FoodHandlerDtls_ep',
      getEfstUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/GetFoodHandlerTrainedDetails/GetFoodHandler',
      // UpdateEfstCountUrl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_UpdtFoodHandlerCount_ep',
      UpdateEfstCountUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/UpdateFoodHandlerCount/UpdateFoodHandlerCount',
      // onHoldRequestUrl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_TaskViolation_ep',
      onHoldRequestUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/TaskViolation/TaskViolation',
      postActionURL: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_InspectionAcknowledge_ep',
      getContactList: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_HistorySearchRestService/HistorySearch',
      // postRequestForClosure: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_TaskViolation_ep',
      postRequestForClosure: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/TaskViolation/TaskViolation',
      // postSignatureURL: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_QuestionnairesAttachment_ep',
      postSignatureURL: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/QuestionnaierAttachment/QuestionnaierAttachment',
      getFoodAlerturl: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_AlertSearch/Alerts',
      updateFoodAlerturl: baseurlGet + 'GBL_ADAFSA_MOB_Application/FoodAlertUpdate/FoodAlertUpdate',
      getFoodDisposalurl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/DisposalItem/DisposalItem',
      getQuestioneries: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetQuestioneriesRestService/GetQuestioneries?',
      closureInspectionurl: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateQuestionnarieRestService/UpdateQuestionnari',
      supervisoryEstDetails: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/EstTaskDetails/EstTaskDetails',
      supervisorySubmitUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateAACSTaskRestService/UpdateAACStask',
      // questionarieAttachmenturl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_QuestionnairesAttachment_ep',
      followUpMerge: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetFollowupRoutine/GetFollowupRoutine',
      getAssessmentUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetAssessmentRestService/GetAssessment?',
      updateAssessmentUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateAssessmentRestService/UpdateAssessment',
      voilationAttachment: baseurlGet + 'GBL_ADAFSA_MOB_Application/ViolationAttachments/ViolationAttachments',
      inspectionReport: baseurl + "resources/SOA_PROD/GBL_ADFCA_SERV_GetPaymentReport_RestSC/GetPaymentRestService/InspectionReport"
    }
    :
    {
      appVersionUrl: baseurl + 'getAppVersion',
      loginUrl: baseurl + 'resources/SOA_DEV/GBL_ADFCA_SERV_LoginAuthentication/ADFCA_SERV_ValidateUser/ValidateUser?_dev',
      updateEstLocationUrl: baseurl + 'resources/SOA_DEV/ADFCAMobileEstCoordinatesUpdate/UpdateCoordinatesRestService/UpdateCoordinates_dev',
      lovURL: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_ListOfValues_RestService/ListOfValues_dev',
      accountSyncURL: baseurlGet + 'Adfca_AdfcaAccountSyncRestService/Adfca_AdfcaAccountSyncRestService/GetAccountSyncDetails?_dev',
      getTaskUrl: baseurlGet + 'GBL_ADFCA_GetScheduleTaskDetails/GetTaskService/GetTasks?_dev',
      // getChecklistUrl: baseurl +'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_OPA_GetCheckList_ep',
      getChecklistUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetOPAChecklist/GetOPAChecklist_dev',
      getOPAResultUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/OPAGETResults/OPAGETResults_dev',
      // getBA: baseurl +  'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_GetBusinessActivities_ep',
      getBA: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetBusinessActivity/GetBusniessActvity_dev',
      searchHistory: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_HistorySearchRestService/HistorySearch_dev',
      // getSearchByVehicle: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_RetrieveVehicleDetails_ep',
      getSearchByVehicle: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/RetrieveVehicles/RetrieveVehicles_dev',
      // createAdhocInspection: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_AdhocInspection_ep',
      createAdhocInspection: baseurlGet + 'GBL_ADAFSA_MOB_Application/AdhocNewInspection/AdhocNewInspection_dev',
      ScheduleTaskDetails: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetScheduleTask/ScheduleTask?_dev',
      srDetails: baseurlGet + 'ADFCA_ADFCASRSync/ADFCASRSyncRestService/GetSRSync?_dev',
      // acknowledge: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_InspectionAcknowledge_ep',
      acknowledge: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/InspectionKwonledge/InspectionKwonledge_dev',
      // submitCondemnation: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_SamplingInspection_ep',
      submitCondemnation: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/SamplingInspection/SamplingInspection_dev',
      submitInspection: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateQuestionnarieRestService/UpdateQuestionnarie_dev',
      // getEfstUrl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_EFST_FoodHandlerDtls_ep',
      getEfstUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/GetFoodHandlerTrainedDetails/GetFoodHandler_dev',
      // UpdateEfstCountUrl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_UpdtFoodHandlerCount_ep',
      UpdateEfstCountUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/UpdateFoodHandlerCount/UpdateFoodHandlerCount_dev',
      // onHoldRequestUrl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_TaskViolation_ep',
      onHoldRequestUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/TaskViolation/TaskViolation_dev',
      postActionURL: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_InspectionAcknowledge_ep_dev',
      getContactList: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_HistorySearchRestService/HistorySearch_dev',
      // postRequestForClosure: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_TaskViolation_ep',
      postRequestForClosure: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/TaskViolation/TaskViolation_dev',
      // postSignatureURL: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_QuestionnairesAttachment_ep',
      postSignatureURL: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/QuestionnaierAttachment/QuestionnaierAttachment_dev',
      getFoodAlerturl: baseurlGet + 'GBL_ADAFSA_MOB_Application/SERV_AlertSearch/Alerts_dev',
      updateFoodAlerturl: baseurlGet + 'GBL_ADAFSA_MOB_Application/FoodAlertUpdate/FoodAlertUpdate_dev',
      getFoodDisposalurl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/DisposalItem/DisposalItem_dev',
      getQuestioneries: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetQuestioneriesRestService/GetQuestioneries?_dev',
      closureInspectionurl: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateQuestionnarieRestService/UpdateQuestionnari_dev',
      supervisoryEstDetails: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/EstTaskDetails/EstTaskDetails_dev',
      supervisorySubmitUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateAACSTaskRestService/UpdateAACStask_dev',
      // questionarieAttachmenturl: baseurl + 'services/SOA_DEV/GBL_ADFCA_MOB_ServiceMediator/SERV_MOB_SBL_QuestionnairesAttachment_ep',
      followUpMerge: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetFollowupRoutine/GetFollowupRoutine_dev',
      getAssessmentUrl: baseurlGet + 'GBL_ADAFSA_MOB_GET_Application/GetAssessmentRestService/GetAssessment?_dev',
      updateAssessmentUrl: baseurlGet + 'GBL_ADAFSA_MOB_Application/UpdateAssessmentRestService/UpdateAssessment_dev',
      voilationAttachment: baseurlGet + 'GBL_ADAFSA_MOB_Application/ViolationAttachments/ViolationAttachments_dev',
      inspectionReport: baseurl + "resources/SOA_PROD/GBL_ADFCA_SERV_GetPaymentReport_RestSC/GetPaymentRestService/InspectionReport"
    }
}

const fontFamily = {
  textFontFamily: 'Corporate S',
  tittleFontFamily: 'Corporate S Bold',
  arabicTextFontFamily: "DroidArabicKufi"
}

const fontColor = {
  TitleColor: "#5C666F",
  TextInputBoxColor: '#D1D3D4',
  TextBoxTitleColor: '#6D6E71',
  ButtonBoxColor: '#EE3E43',
  white: 'white',
  borderColorCode: '#BCBEC0',
  grey: 'grey',
  greenShade: '#abcfbf',
  lightGrey: '#ececec'
};

let EstablishmentData = Array();

const getEstablishmentData = () => {
  return EstablishmentData;
};

const setEstablishmentData = (data: any) => {
  EstablishmentData = data;
};

export { services, fontFamily, fontColor, isDev, AppVersion, setEstablishmentData, getEstablishmentData };