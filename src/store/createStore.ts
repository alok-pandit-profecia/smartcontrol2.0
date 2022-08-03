import RootStore, { RootStoreModel } from "./rootStore";
import LoginModel from "./../models/login/loginModel";
import EstablishmentModel from './../models/establishment/establishmentModel';
import InspectionModel from './../models/inspection/inspectionModel';
import bottomBarModel from "./../models/bottomBar/bottomBarModel";
import MyTasksModel from "./../models/myTasks/MyTasksModel";
import ActionModel from './../models/action/actionModel';
import ContactModel from './../models/contact/contactModel';
import EfstModel from './../models/efst/efstModel';
import condemnationModel from './../models/condemnation/condemnation';
import detentionModel from './../models/detention/detentionModel';
import SamplingModel from './../models/Sampling/Sampling';
import LicenseActionModel from './../models/licenseAction/licenseActionModel';
import LicenseContactModel from './../models/licenseContact/licenseContactModel';
import LicenseEfstModel from './../models/licenseEfst/licenseEfstModel';
import LicenseEstablishmentModel from './../models/licenseEstablishment/licenseEstablishmentModel';
import LicenseInspectionModel from './../models/licenseInspection/licenseInspectionModel';
import LicenseMyTaskModel from './../models/licenseMyTask/licenseMyTaskModel';
import FoodAlertsModel from './../models/foodAlert/foodAlertsModel';
import ProductListModel from './../models/productList/productListModel';
import CasesActionModel from './../models/casesAction/casesActionModel';
import CasesCondemnationModel from './../models/casesCondemnation/casesCondemnationModel';
import CasesDetentionModel from './../models/casesDetention/casesDetentionModel';
import CasesSamplingModel from './../models/casesSampling/casesSamplingModel';
import CasesContactModel from './../models/casesContact/casesContactModel';
import CasesEfstModel from './../models/casesEfst/casesEfstModel';
import CasesEstablishmentModel from './../models/casesEstablishment/casesEstablishmentModel';
import CasesInspectionModel from './../models/casesInspection/casesInspectionModel';
import CasesMyTaskModel from './../models/casesMyTask/casesMyTaskModel';
import CompletdMyTaskEstablishmentModel from './../models/completedTaskEstablishment/completedTaskEstablishmentModel';
import CompletedTaskInspectionModel from './../models/completedTaskInspection/completedTaskInspectionModel';
import CompletedTaskContactModel from './../models/completedTaskContact/completedTaskContactModel';
import CompletedTaskEfstModel from './../models/completedTaskEfst/completedTaskEfstModel';
import CompletdMyTaskModel from './../models/completedMyTask/completdMyTaskModel';
import AdhocClosureModel from './../models/adhocClosure/adhocClosureModel';
import AdhocSamplingModel from './../models/adhocSampling/adhocSamplingModel';
import AdhocCondemnationModel from './../models/adhocCondemnation/adhocCondemnationModel';
import AdhocDetentionModel from './../models/adhocDetention/adhocDetentionModel';
import AdhocViolationDetailsModel from './../models/adhocViolationDetails/adhocViolationDetailsModel';
import AdhocViolationListModel from './../models/adhocViolationList/adhocViolationListModel';
import ScheduledComplaintsModel from './../models/scheduledComplaints/scheduledComplaintsModel';
import ScheduledFollowUpModel from './../models/scheduledFollowUp/scheduledFollowUpModel';
import ScheduledLicensesModel from './../models/scheduledLicenses/scheduledLicensesModel';
import ScheduledRoutlineInspectionModel from './../models/scheduledRoutlineInspection/scheduledRoutlineInspectionModel';
import AboutHistoryModel from './../models/aboutHistory/aboutHistoryModel';
import AboutHistoryEstablishmentModel from './../models/aboutHistoryEstablishment/aboutHistoryEstablishmentModel';
import AboutHistoryInspectionModel from './../models/aboutHistoryInspection/aboutHistoryInspectionModel';
import AboutLastReportModel from './../models/aboutLastReport/aboutLastReportModel';
import AboutStaffModel from './../models/aboutStaff/aboutStaffModel';
import ReminderMyTaskModel from './../models/reminderMyTask/reminderMyTaskModel';
import SettingsModel from './../models/settings/settingsModel';
import TemporaryPermitsMyTaskModel from './../models/temporaryPermitsMyTask/temporaryPermitsMyTaskModel';
import TemporaryPermitsEstablishmentModel from './../models/temporaryPermitsEstablishment/temporaryPermitsEstablishmentModel';
import TemporaryPermitsInspectionsModel from './../models/temporaryPermitsInspections/temporaryPermitsInspectionsModel';
import TemporaryPermitsContactModel from './../models/temporaryPermitsContact/temporaryPermitsContactModel';
import TemporaryPermitsEfstModel from './../models/temporaryPermitsEfst/temporaryPermitsEfstModel';
import TemporaryPermitsActionModel from './../models/temporaryPermitsAction/temporaryPermitsActionModel';
import TemporaryPermitsServiceEstablishmentModel from './../models/temporaryPermitsServiceEstablishment/temporaryPermitsServiceEstablishmentModel';
import TemporaryPermitsServiceRequestModel from './../models/temporaryPermitsServiceRequest/temporaryPermitsServiceRequestModel';
import AdhocTaskEstablishmentModel from './../models/adhocTaskEstablishment/adhocTaskEstablishmentModel';
import AdhocTaskVehicleModel from './../models/adhocTaskVehicle/adhocTaskVehicleModel';
import AdhocTaskEstablishmentListModel from './../models/adhocTaskEstablishmentList/adhocTaskEstablishmentListModel';
import AdhocTaskEstablishmentDetailsModel from './../models/adhocTaskEstablishmentDetails/adhocTaskEstablishmentDetailsModel';
import AdhocTaskCreateNewEstablishmentModel from './../models/adhocTaskCreateNewEstablishment/adhocTaskCreateNewEstablishmentModel';
import HistoryEstablishmentModel from './../models/historyEstablishment/historyEstablishmentModel';
import HistoryVehicleModel from "./../models/historyVehicle/historyVehicleModel";
import HistoryEstablishmentListModel from './../models/historyEstablishmentList/historyEstablishmentListModel';
import HistoryEstablishmentDetailsModel from './../models/historyEstablishmentDetails/historyEstablishmentDetailsModel';
import ServiceRequestListModel from './../models/serviceRequestList/serviceRequestListModel';
import ServiceRequestDetailsModel from './../models/serviceRequestDetails/serviceRequestDetailsModel';
import BusinessActivityModel from './../models/businessActivity/businessActivityModel';
import HistoryViolationListModel from './../models/historyViolationList/historyViolationListModel';
import HistoryEfstModel from './../models/historyEfst/historyEfstModel';
import HistoryVehicleDetailsModel from './../models/historyVehicleDetails/historyVehicleDetailsModel';
import HistoryInspectionListModel from './../models/historyInspectionList/historyInspectionListModel';
import HistoryInspectionDetailsModel from './../models/historyInspectionDetails/historyInspectionDetailsModel';
import HistoryFinalResultModel from './../models/historyFinalResult/historyFinalResultModel';
import OnHoldeRequestModel from './../models/onHoldRequest/onHoldeRequestModel';
import DocumentationAndReportModel from './../models/documentationAndReport/documentationAndReportModel'
import ProfileModel from './../models/profile/profileModel';
import rootMiddleware from "./../middleware";
import closureInspectionModel from './../models/closureInspection/closureInspectionModel'
import { AppVersion } from "../config/config";


// could possibly accept some initial state
export const createStore = (): RootStoreModel => {
  const login = LoginModel.create({
    username: '',
    verionNumber: AppVersion,
    verionResponse: '',
    lovArray: '',
    isOnline: false,
    password: '',
    state: 'done',
    searchText: '',
    isArabic: false,
    lovResponse: '',
    loginResponse: '',
    loadingState: ''
  });

  const bottomBar = bottomBarModel.create({
    categoryClick: false,
    dashboardClick: true,
    profileClick: false,
    taskClick: false
  });

  const establishment = EstablishmentModel.create({
    establishmentId: '',
    allEstablishmentData: '',
    ehsRiskClassification:'',
    establishmentName: '',
    licenseSource: '',
    sector: '',
    licensestartDate: '',
    licenseEndDate: '',
    licenseNumber: '',
    contactDetails: '',
    address: '',
    area: '',
    response: '',
    estId: '',
    state: 'done',
    contactList: '',
    licenseCode: '',
    loadingState: ''
  });

  const inspection = InspectionModel.create({
    taskId: 0,
    taskType: '',
    creationDate: '',
    businessActivity: '',
    subBusinessActivity: '',
    description: '',
    risk: '',
    sheduledDate: '',
    state: 'done',

  });
  const action = ActionModel.create({
    taskId: '',
    latitude:'',
    longitude:'',
    establishment: '',
    reason: '',
    comments: '',
    proposedDate: '',
    state: 'done',
    isPostPoned: false,
    loadingState: ''
  });
  const contact = ContactModel.create({
    type: '',
    name: '',
    nationality: '',
    mobileNumber: '',
    relationship: '',
    state: 'done',
  });
  const efst = EfstModel.create({
    foodHandlerId: '',
    emiratesId: '',
    foodHandlerName: '',
    gender: '',
    passPercentage: '',
    nationality: '',
    passortNumber: '',
    trained: '',
    certified: '',
    foodHandlerCount: '',
    efstDataResponse: '',
    state: 'done',
  });

  const myTasks = MyTasksModel.create({
    campaignSelectedEstIndex: '0',
    efstUpdate:false,
    NOCListPast: '',
    mergeState:'',
    bastate:'done',
    checkliststate:'',
    failedAttachmentArray:'',
    voilationFailedAttachmentArray:'',
    businessActivityArray: '',
    subBusinessActivityArray:'',
    campaignMappingData: '',
    retryCount: '0',
    isOnline: false,
    createAdhoc: false,
    foodalertSampling:false,
    attachmentSubmittedFailed:false,
    taskSubmitted: false,
    historyChecklist: false,
    campaignListPast: '',
    complaintAndFoodPosioningListPast: '',
    isAlertApplicableNoToAll: false,
    dataArray1Past: '',
    dataArrayPast: '',
    directFarmArrayPast: '',
    eventsListPast: '',
    farmTaskArrayPast: '',
    surveyListPast: '',
    scoreFollow: '',
    nextVisit: '',
    grade: '',
    score: '',
    maxscore: '',
    percentage: '',
    totalScore: '',
    alertObject: '',
    myTaskResponse: ``,
    checkListArray: '',//JSON.stringify(checkListData)
    selectedTask: '',
    count: '1',
    campaignCount: "0",
    isMyTaskClick: '',
    state: 'done',
    campaignChecklistTaskId: '',
    getTaskApiResponse: '',
    notCompletedTasksFormDb: '',
    getChecklistResponse: '',
    getBusinessActivityResponse: '',
    getAcknowldgeResponse: '',
    getQuestionarieResponse: '',
    getCampaignChecklistResponse: '',
    campaignList: '',
    surveyList: '',
    NOCList: '',
    complaintAndFoodPosioningList: '',
    eventsList: '',
    farmTaskArray: '',
    directFarmArray: '',
    dataArray: '',
    dataArray1: '',
    desc: '',
    contactName: '',
    mobileNumber: '',
    emiratesId: '',
    result: '',
    finalComment: '',
    taskId: '',
    estListArray: '',
    isCompletedOfflineList: '',
    myTaskCount: '0',
    licenseCount: '0',
    caseCount: '0',
    tempPermit: '0',
    EmiratesIdAttachment1: '',
    EmiratesIdAttachment2: '',
    evidanceAttachment1: '',
    evidanceAttachment2: '',
    licencesAttachment1: '',
    licencesAttachment2: '',
    EmiratesIdAttachment1Url: '',
    EmiratesIdAttachment2Url: '',
    evidanceAttachment1Url: '',
    evidanceAttachment2Url: '',
    licencesAttachment1Url: '',
    licencesAttachment2Url: '',
    noCheckList: '',
    latitude: '',
    longitude: '',
    isPostPoned: false,
    dataLoggerCBValue: false,
    luxmeterCBValue: false,
    flashlightCBValue: false,//equipment page
    thermometerCBValue: false,
    UVlightCBValue: false,
    isSuccess: false,
    campaignTaskId: '',
    getSupervisoryEstResponse: '',
    visitType: '',
    scope: '',
    noOfVisits: '',
    isAlertApplicable: false,
    otherValue: 'Emirates Id',
    otherTextValue: '',
    loadingState: '',
    acknowledgeState: 'done',
    getChecklistAssessmentResponse: '',
    tableNameList: '',
    rescheduledTaskList:''
  });

  const condemnation = condemnationModel.create({
    serialNumber: '',
    productName: '',
    unit: '',
    quantity: '',
    netWeight: '',
    package: '',
    batchNumber: '',
    brandName: '',
    remarks: '',
    place: '',
    reason: '',
    attachment1: '',
    attachment2: '',
    condemnationArray: '',
    state: 'done',
    getQuestionarieAttachmentResponse: '',
    loadingState: ''
  });

  const detention = detentionModel.create({
    serialNumber: '',
    productName:'',
    detentionArray: '',
    type: '',
    unit: '',
    quantity: '',
    netWeight: '',
    package: '',
    batchNumber: '',
    brandName: '',
    productionDate: '',
    expiryDate: '',
    countryOfOrigin: '',
    reason: '',
    remarks: '',
    decisions: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
    loadingState: ''
  });

  const Sampling = SamplingModel.create({
    samplingArray: '',
    serialNumber: '',
    type: '',
    dateofSample: '',
    countryOfOrigin: '',
    remainingQuantity: '',
    remarks: '',
    sampleCollectionReason: '',
    sampleName: '',
    sampleState: '',
    sampleTemperature: '',
    batchNumber: '',
    brandName: '',
    expiryDate: '',
    netWeight: '',
    package: '',
    productionDate: '',
    quantity: '',
    unit: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
    loadingState: ''
  });

  const licenseAction = LicenseActionModel.create({
    taskId: '',
    establishment: '',
    reason: '',
    comments: '',
    proposedDate: '',
    state: 'done',
  });

  const licenseContact = LicenseContactModel.create({
    type: '',
    name: '',
    nationality: '',
    mobileNumber: '',
    relationship: '',
    state: 'done',
  });

  const licenseEfst = LicenseEfstModel.create({
    foodHandlerId: '',
    emiratesId: '',
    foodHandlerName: '',
    gender: '',
    passPercentage: '',
    nationality: '',
    passortNumber: '',
    trained: '',
    certified: '',
    foodHandlerCount: '',
    state: 'done',
  });


  const licenseEstablishment = LicenseEstablishmentModel.create({
    establishmentName: '',
    licenseSource: '',
    licensestartDate: '',
    licenseEndDate: '',
    licenseNumber: '',
    contactDetails: '',
    sector: '',
    area: '',
    address: '',
    state: 'done',
  })

  const licenseInspection = LicenseInspectionModel.create({
    taskId: 0,
    taskType: '',
    creationDate: '',
    businessActivity: '',
    subBusinessActivity: '',
    description: '',
    risk: '',
    sheduledDate: '',
    state: 'done',

  });

  const licenseMyTask = LicenseMyTaskModel.create({
    inspection: '',
    type: '',
    state: 'done',
    getNocChecklistResponse: '',
    taskId: '',
    checkListArray: '',
    isScoreN: 'N',
    noCheckList: '',
    rejectBtnClick: false,
    loadingState: ''
  });

  const FoodAlerts = FoodAlertsModel.create({
    alertResponse: '',
    selectedAlertObj: '',
    alertNumber: '',
    alertType: '',
    alertSource: '',
    status: '',
    startDate: '',
    toDate: '',
    description: '',
    sourceAlertNo: '',
    state: 'done',
    loadingState: ''
  });
  const productList = ProductListModel.create({
    productName: '',
    brand: '',
    type: '',
    batch: '',
    weight: '',
    unit: '',
    country: '',
    state: 'done',

  })

  const casesAction = CasesActionModel.create({
    taskId: '',
    establishment: '',
    reason: '',
    comments: '',
    proposedDate: '',
    state: 'done',
  });

  const casesCondemnation = CasesCondemnationModel.create({
    serialNumber: '',
    productName: '',
    unit: '',
    quantity: '',
    netWeight: '',
    package: '',
    batchNumber: '',
    brandName: '',
    remarks: '',
    place: '',
    reason: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
  });

  const casesDetention = CasesDetentionModel.create({
    serialNumber: '',
    productName: '',
    type: '',
    unit: '',
    quantity: '',
    netWeight: '',
    package: '',
    batchNumber: '',
    brandName: '',
    productionDate: '',
    decisions: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
  });

  const casesSampling = CasesSamplingModel.create({
    serialNumber: '',
    productName: '',
    brandName: '',
    sampleCollectionReason: '',
    sampleName: '',
    dateofSample: '',
    sampleState: '',
    sampleTemperature: '',
    remainingQuantity: '',
    type: '',
    countryOfOrigin: '',
    remarks: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
  });

  const casesContact = CasesContactModel.create({
    type: '',
    name: '',
    nationality: '',
    mobileNumber: '',
    relationship: '',
    state: 'done',
  });

  const casesEfst = CasesEfstModel.create({
    foodHandlerId: '',
    emiratesId: '',
    foodHandlerName: '',
    gender: '',
    passPercentage: '',
    nationality: '',
    passortNumber: '',
    trained: '',
    certified: '',
    foodHandlerCount: '',
    state: 'done',
  });

  const casesEstablishment = CasesEstablishmentModel.create({
    establishmentName: '',
    licenseSource: '',
    licensestartDate: '',
    licenseEndDate: '',
    licenseNumber: '',
    contactDetails: '',
    sector: '',
    area: '',
    address: '',
    state: 'done',
  })

  const casesInspection = CasesInspectionModel.create({
    taskId: 0,
    taskType: '',
    creationDate: '',
    businessActivity: '',
    subBusinessActivity: '',
    description: '',
    risk: '',
    sheduledDate: '',
    state: 'done',
  });
  const casesMyTask = CasesMyTaskModel.create({
    inspection: '',
    type: '',
    state: 'done',
  });

  const completdMyTaskEstablishment = CompletdMyTaskEstablishmentModel.create({
    establishmentName: '',
    licenseSource: '',
    licensestartDate: '',
    licenseEndDate: '',
    licenseNumber: '',
    contactDetails: '',
    sector: '',
    area: '',
    address: '',
    state: 'done',
  });

  const completedTaskInspection = CompletedTaskInspectionModel.create({
    taskId: 0,
    taskType: '',
    creationDate: '',
    businessActivity: '',
    subBusinessActivity: '',
    description: '',
    risk: '',
    sheduledDate: '',
    state: 'done',
  });

  const completedTaskContact = CompletedTaskContactModel.create({
    type: '',
    name: '',
    nationality: '',
    mobileNumber: '',
    relationship: '',
    state: 'done',
  });

  const completedTaskEfst = CompletedTaskEfstModel.create({
    foodHandlerId: '',
    emiratesId: '',
    foodHandlerName: '',
    gender: '',
    passPercentage: '',
    nationality: '',
    passortNumber: '',
    trained: '',
    certified: '',
    foodHandlerCount: '',
    state: 'done',
  });

  const completdMyTask = CompletdMyTaskModel.create({
    completedTaskArray: '',
    inspection: '',
    type: '',
    status: '',
    date: '',
    state: 'done'
  });

  const adhocClosure = AdhocClosureModel.create({
    inspectionId: '',
    type: 'Request for Closure',
    createdBy: '',
    establishment: '',
    comments: '',
    state: 'done',
    loadingState: ''
  });

  const adhocSampling = AdhocSamplingModel.create({
    serialNumber: '',
    productName: '',
    brandName: '',
    sampleCollectionReason: '',
    sampleName: '',
    dateofSample: '',
    sampleState: '',
    sampleTemperature: '',
    remainingQuantity: '',
    type: '',
    countryOfOrigin: '',
    remarks: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
  });

  const adhocCondemnation = AdhocCondemnationModel.create({
    serialNumber: '',
    productName: '',
    unit: '',
    quantity: '',
    netWeight: '',
    package: '',
    batchNumber: '',
    brandName: '',
    remarks: '',
    place: '',
    reason: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
  });

  const adhocDetention = AdhocDetentionModel.create({
    serialNumber: '',
    productName: '',
    type: '',
    unit: '',
    quantity: '',
    netWeight: '',
    package: '',
    batchNumber: '',
    brandName: '',
    productionDate: '',
    decisions: '',
    attachment1: '',
    attachment2: '',
    state: 'done',
  });

  const adhocViolationDetails = AdhocViolationDetailsModel.create({
    violationNumber: '',
    inspectionNumber: '',
    createdBy: '',
    creationDate: '',
    status: '',
    state: 'done',
  });

  const adhocViolationList = AdhocViolationListModel.create({
    violationId: '',
    inspectionId: '',
    status: '',
    state: 'done',
  })

  const scheduledComplaints = ScheduledComplaintsModel.create({
    inspection: '',
    type: '',
    state: 'done',
  });

  const scheduledFollowUp = ScheduledFollowUpModel.create({
    result: '',
    finalComments: '',
    contactName: '',
    mobileNumber: '',
    emiratesId: '',
    evidenceAttachment1: '',
    evidenceAttachment2: '',
    licenseAttachment1: '',
    licenseAttachment2: '',
    emiratesIdAttachment1: '',
    emiratesIdAttachment2: '',
    state: 'done',
  });

  const scheduledLicenses = ScheduledLicensesModel.create({
    result: '',
    finalComments: '',
    state: 'done',
  });

  const scheduledRoutlineInspection = ScheduledRoutlineInspectionModel.create({
    result: '',
    finalComments: '',
    contactName: '',
    mobileNumber: '',
    emiratesId: '',
    evidenceAttachment1: '',
    evidenceAttachment2: '',
    licenseAttachment1: '',
    licenseAttachment2: '',
    emiratesIdAttachment1: '',
    emiratesIdAttachment2: '',
    state: 'done',
  });

  const aboutHistory = AboutHistoryModel.create({
    inspection: '',
    type: '',
    status: '',
    date: '',
    state: 'done',

  });

  const aboutHistoryEstablishment = AboutHistoryEstablishmentModel.create({
    establishmentName: '',
    licenseSource: '',
    licensestartDate: '',
    licenseEndDate: '',
    licenseNumber: '',
    contactDetails: '',
    sector: '',
    area: '',
    address: '',
    state: 'done',
  })

  const aboutHistoryInspection = AboutHistoryInspectionModel.create({
    taskId: 0,
    taskType: '',
    creationDate: '',
    businessActivity: '',
    subBusinessActivity: '',
    description: '',
    risk: '',
    sheduledDate: '',
    state: 'done',
  });

  const aboutLastReport = AboutLastReportModel.create({
    tasktype: '',
    creationDate: '',
    score: '',
    grade: '',
    action: '',
    businessActivity: '',
    status: '',
    actualInspectionDate: '',
    state: 'done',
  });


  const aboutStaff = AboutStaffModel.create({
    name: '',
    contact: '',
    post: '',
    state: 'done'
  });
  const reminderMyTask = ReminderMyTaskModel.create({
    inspection: '',
    type: '',
    state: 'done',
  });

  const settings = SettingsModel.create({
    inspectorName: '',
    position: '',
    inspetionArea: '',
    unit: '',
    selectLanguage: '',
    oldPassword: '',
    newPassword: '',
    retypePassword: '',
    state: 'done',
  });

  const temporaryPermitsMyTask = TemporaryPermitsMyTaskModel.create({
    inspection: '',
    type: '',
    state: 'done',
  });

  const temporaryPermitsEstablishment = TemporaryPermitsEstablishmentModel.create({
    establishmentName: '',
    licenseSource: '',
    licensestartDate: '',
    licenseEndDate: '',
    licenseNumber: '',
    contactDetails: '',
    sector: '',
    area: '',
    address: '',
    state: 'done',
  });

  const temporaryPermitsInspections = TemporaryPermitsInspectionsModel.create({
    taskId: 0,
    taskType: '',
    creationDate: '',
    businessActivity: '',
    subBusinessActivity: '',
    description: '',
    risk: '',
    sheduledDate: '',
    state: 'done',

  });

  const temporaryPermitsContact = TemporaryPermitsContactModel.create({
    type: '',
    name: '',
    nationality: '',
    mobileNumber: '',
    relationship: '',
    state: 'done',
  });

  const temporaryPermitsEfst = TemporaryPermitsEfstModel.create({
    foodHandlerId: '',
    emiratesId: '',
    foodHandlerName: '',
    gender: '',
    passPercentage: '',
    nationality: '',
    passortNumber: '',
    trained: '',
    certified: '',
    foodHandlerCount: '',
    state: 'done',
  });

  const temporaryPermitsAction = TemporaryPermitsActionModel.create({
    taskId: '',
    establishment: '',
    reason: '',
    comments: '',
    proposedDate: '',
    state: 'done',
  });

  const temporaryPermitsServiceEstablishment = TemporaryPermitsServiceEstablishmentModel.create({
    tradeLicenseNumber: '',
    licenseExpiryDate: '',
    mainBusinessActivity: '',
    sector: '',
    customerName: '',
    establishmentType: '',
    licenseSource: '',
    area: '',
    // getSrDetailsResponse: '',
    state: 'done',
  });

  const temporaryPermitsServiceRequest = TemporaryPermitsServiceRequestModel.create({
    serviceRequestNumber: '',
    serviceRequrestArray: '',
    serviceRequrestObject: '',
    city: '',
    taskId: '',
    application: '',
    applicationType: '',
    status: '',
    creationDate: '',
    closedDate: '',
    permitStartDate: '',
    permitEndDate: '',
    loadingState: '',
    state: 'done',
  });
  const adhocTaskEstablishment = AdhocTaskEstablishmentModel.create({
    englishTradeName: '',
    stateResponse:"",
    estResponse: '',
    arabicTradeName: '',
    licenseSource: '',
    licenseNo: '',
    area: '',
    sector: '',
    state: 'done',
    tradeLicenseHistoryResponse: '',
    clikedItem: '',
    loadingState: ''
  });

  const adhocTaskVehicle = AdhocTaskVehicleModel.create({
    placeOfIssue: '',
    plateNumber: '',
    plateCode: '',
    chassisNumber: '',
    state: 'done',
    searchVehicleResponse: '',
    loadingState: ''
  })

  const adhocTaskEstablishmentList = AdhocTaskEstablishmentListModel.create({
    establishmentName: '',
    tradeLicense: '',
    licenseSource: '',
    address: '',
    state: 'done',
  });

  const adhocTaskEstablishmentDetails = AdhocTaskEstablishmentDetailsModel.create({
    establishmentName: '',
    bazarName: "",
    licenseNumber: '',
    licenseStartDate: '',
    licenseEndDate: '',
    arabicEstablishmentName: '',
    contactDetails: '',
    address: '',
    emailId: '',
    onHold: '',
    businessActivity: '',
    selectVehicle: '',
    taskType: 'Direct Inspection',
    city: '',
    address1: '',
    address2: '',
    state: 'done',
    accountType: '',
    taskId: '',
    loadingState: ''
  });

  const adhocTaskCreateNewEstablishment = AdhocTaskCreateNewEstablishmentModel.create({
    establishmentEnglishName: '',
    establishmentArabicName: '',
    establishmentType: '',
    establishmentClass: '',
    plateCode: '',
    plateNumber: '',
    vehicleMark: '',
    sector: '',
    contact: '',
    tradeLicenseNumber: '',
    tradeLicenseSource: '',
    email: '',
    state: 'done',
    tradeLicenseHistoryResponse: '',
    loadingState: ''
  });

  const historyEstablishment = HistoryEstablishmentModel.create({
    englishTradeName: '',
    arabicTradeName: '',
    licenseSource: '',
    licenseNo: '',
    area: '',
    sector: '',
    state: 'done',
  });

  const historyVehicle = HistoryVehicleModel.create({

    placeOfIssue: '',
    plateNumber: '',
    plateCode: '',
    chassisNumber: '',
    state: 'done',
  });

  const historyEstablishmentList = HistoryEstablishmentListModel.create({
    establishmentName: '',
    tradeLicense: '',
    licenseSource: '',
    address: '',
    state: 'done',
  });

  const historyEstablishmentDetails = HistoryEstablishmentDetailsModel.create({
    establishmentName: '',
    licenseNumber: '',
    licenseStartDate: '',
    licenseEndDate: '',
    arabicEstablishmentName: '',
    contactDetails: '',
    address: '',
    emailId: '',
    onHold: '',
    businessActivity: '',
    selectVehicle: '',
    taskType: '',
    state: 'done',
  });
  const serviceRequestList = ServiceRequestListModel.create({
    serviceRequestNo: '',
    applicationType: '',
    application: '',
    state: 'done',
  });

  const serviceRequestDetails = ServiceRequestDetailsModel.create({
    serviceRequestNo: '',
    city: '',
    application: '',
    applicationType: '',
    status: '',
    creationDate: '',
    closedDate: '',
    permitstartDate: '',
    permitEndDate: '',
    state: 'done',
  });

  const businessActivity = BusinessActivityModel.create({
    businessActivity: '',
    city: '',
    category: '',
    state: 'done',
  });

  const historyViolationList = HistoryViolationListModel.create({
    violationNumber: '',
    inspectionNumber: '',
    createdBy: '',
    creationDate: '',
    status: '',
    state: 'done',

  });
  const historyEfst = HistoryEfstModel.create({
    foodHandlerId: '',
    emiratesId: '',
    foodHandlerName: '',
    gender: '',
    passPercentage: '',
    nationality: '',
    passortNumber: '',
    state: 'done',
  });

  const historyVehicleDetails = HistoryVehicleDetailsModel.create({
    plateNumber: '',
    plateCode: '',
    placeOfIssue: '',
    state: 'done',
  });

  const historyInspectionList = HistoryInspectionListModel.create({
    inspectionId: '',
    type: '',
    status: '',
    date: '',
    state: 'done',
  });


  const historyInspectionDetails = HistoryInspectionDetailsModel.create({
    inspectionNumber: 0,
    taskType: '',
    creationDate: '',
    completionDate: '',
    status: '',
    businessActivity: '',
    grade: '',
    description: '',
    priority: '',
    state: 'done',
  });
  const historyFinalResult = HistoryFinalResultModel.create({
    finalInspectionResult: '',
    finalComments: '',
    state: 'done',
  });

  const onHoldeRequest = OnHoldeRequestModel.create({
    inspectionId: '',
    type: 'On Hold Request',
    createdBy: '',
    establishment: '',
    reason: '',
    comments: '',
    state: 'done',
    loadingState: ''
  });

  const documentationAndReport = DocumentationAndReportModel.create({
    taskId: '',
    fileExtention: '',
    fileName: '',
    fileBuffer: '',
    saveImageFlag: '',
    state: 'done',

  });

  const Profile = ProfileModel.create({
    inspectorName: '',
    position: '',
    inspectionArea: '',
    unit: '',
    selectLang: '',
    state: 'done',

  });
  const closureInspection = closureInspectionModel.create({
    taskId: '',
    taskType: '',
    englishTradeName: '',
    licenseNo: '',
    address: '',
    inspectorName: '',
    comment: '',
    fileBuffer: '',
    image: '',
    imageExtension: '',
    saveImageFlag: '',
    state: 'done',
    nameOfBusinessOperator: '',
    attachmentFive: '',
    attachmentFour: '',
    attachmentThree: '',
    attachmentTwo: '',
    attachmentOne: '',
    loadingState: ''
  });

  const rootStore = RootStore.create(
    {
      loginModel: login,
      establishmentModel: establishment,
      inspectionStoreModel: inspection,
      bottomBarModel: bottomBar,
      myTasksModel: myTasks,
      actionModel: action,
      contactModel: contact,
      eftstModel: efst,
      condemnationModel: condemnation,
      detentionModel: detention,
      samplingModel: Sampling,
      licenseActionModel: licenseAction,
      licenseContactModel: licenseContact,
      licenseEfstModel: licenseEfst,
      licenseEstablishmentModel: licenseEstablishment,
      licenseInspectionModel: licenseInspection,
      licenseMyTaskModel: licenseMyTask,
      foodAlertsModel: FoodAlerts,
      productListModel: productList,
      casesActionModel: casesAction,
      casesCondemnationModel: casesCondemnation,
      casesDetentionModel: casesDetention,
      casesSamplingModel: casesSampling,
      casesContactModel: casesContact,
      casesEfstModel: casesEfst,
      casesEstablishmentModel: casesEstablishment,
      casesInspectionModel: casesInspection,
      casesMyTaskModel: casesMyTask,
      completdMyTaskEstablishmentModel: completdMyTaskEstablishment,
      completedTaskInspectionModel: completedTaskInspection,
      completedTaskContactModel: completedTaskContact,
      completedTaskEfstModel: completedTaskEfst,
      completdMyTaskModel: completdMyTask,
      adhocClosureModel: adhocClosure,
      adhocSamplingModel: adhocSampling,
      adhocCondemnationModel: adhocCondemnation,
      adhocDetentionModel: adhocDetention,
      adhocViolationDetailsModel: adhocViolationDetails,
      adhocViolationListModel: adhocViolationList,
      scheduledComplaintsModel: scheduledComplaints,
      scheduledFollowUpModel: scheduledFollowUp,
      scheduledLicensesModel: scheduledLicenses,
      scheduledRoutlineInspectionModel: scheduledRoutlineInspection,
      aboutHistoryModel: aboutHistory,
      aboutHistoryEstablishmentModel: aboutHistoryEstablishment,
      aboutHistoryInspectionModel: aboutHistoryInspection,
      aboutLastReportModel: aboutLastReport,
      aboutStaffModel: aboutStaff,
      reminderMyTaskModel: reminderMyTask,
      settingsModel: settings,
      temporaryPermitsMyTaskModel: temporaryPermitsMyTask,
      temporaryPermitsEstablishmentModel: temporaryPermitsEstablishment,
      temporaryPermitsInspectionsModel: temporaryPermitsInspections,
      temporaryPermitsContactModel: temporaryPermitsContact,
      temporaryPermitsEfstModel: temporaryPermitsEfst,
      temporaryPermitsActionModel: temporaryPermitsAction,
      temporaryPermitsServiceEstablishmentModel: temporaryPermitsServiceEstablishment,
      temporaryPermitsServiceRequestModel: temporaryPermitsServiceRequest,
      adhocTaskEstablishmentModel: adhocTaskEstablishment,
      adhocTaskVehicleModel: adhocTaskVehicle,
      adhocTaskEstablishmentListModel: adhocTaskEstablishmentList,
      adhocTaskEstablishmentDetailsModel: adhocTaskEstablishmentDetails,
      adhocTaskCreateNewEstablishmentModel: adhocTaskCreateNewEstablishment,
      historyEstablishmentModel: historyEstablishment,
      historyVehicleModel: historyVehicle,
      historyEstablishmentListModel: historyEstablishmentList,
      historyEstablishmentDetailsModel: historyEstablishmentDetails,
      serviceRequestListModel: serviceRequestList,
      serviceRequestDetailsModel: serviceRequestDetails,
      businessActivityModel: businessActivity,
      historyViolationListModel: historyViolationList,
      historyEfstModel: historyEfst,
      historyVehicleDetailsModel: historyVehicleDetails,
      historyInspectionListModel: historyInspectionList,
      historyInspectionDetailsModel: historyInspectionDetails,
      historyFinalResultModel: historyFinalResult,
      onHoldeRequestModel: onHoldeRequest,
      documentationAndReportModel: documentationAndReport,
      profileModel: Profile,
      closureInspectionModel: closureInspection
    }
  )


  rootMiddleware(rootStore);

  return rootStore
}
