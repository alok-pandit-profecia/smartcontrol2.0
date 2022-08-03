import { types, Instance, addMiddleware } from "mobx-state-tree";
import loginModel from "./../models/login/loginModel";
import establishmentModel from './../models/establishment/establishmentModel';
import inspectionModel from './../models/inspection/inspectionModel';
import bottomBarModel from "./../models/bottomBar/bottomBarModel";
import myTasksModel from "./../models/myTasks/MyTasksModel";
import actionModel from './../models/action/actionModel';
import contactModel from './../models/contact/contactModel';
import efstModel from './../models/efst/efstModel';
import condemnationModel from './../models/condemnation/condemnation';
import detentionModel from './../models/detention/detentionModel';
import samplingModel from './../models/Sampling/Sampling';
import licenseActionModel from './../models/licenseAction/licenseActionModel';
import licenseContactModel from './../models/licenseContact/licenseContactModel';
import licenseEfstModel from './../models/licenseEfst/licenseEfstModel';
import licenseEstablishmentModel from './../models/licenseEstablishment/licenseEstablishmentModel';
import licenseInspectionModel from './../models/licenseInspection/licenseInspectionModel';
import licenseMyTaskModel from './../models/licenseMyTask/licenseMyTaskModel';
import foodAlertsModel from './../models/foodAlert/foodAlertsModel';
import productListModel from './../models/productList/productListModel';
import casesActionModel from './../models/casesAction/casesActionModel';
import casesCondemnationModel from './../models/casesCondemnation/casesCondemnationModel';
import casesDetentionModel from './../models/casesDetention/casesDetentionModel';
import casesSamplingModel from './../models/casesSampling/casesSamplingModel';
import casesContactModel from './../models/casesContact/casesContactModel';
import casesEfstModel from './../models/casesEfst/casesEfstModel';
import casesEstablishmentModel from './../models/casesEstablishment/casesEstablishmentModel';
import casesInspectionModel from './../models/casesInspection/casesInspectionModel';
import casesMyTaskModel from './../models/casesMyTask/casesMyTaskModel';
import completdMyTaskEstablishmentModel from './../models/completedTaskEstablishment/completedTaskEstablishmentModel';
import  completedTaskInspectionModel from './../models/completedTaskInspection/completedTaskInspectionModel';
import  completedTaskContactModel from './../models/completedTaskContact/completedTaskContactModel'; 
import   completedTaskEfstModel from './../models/completedTaskEfst/completedTaskEfstModel';
import completdMyTaskModel from './../models/completedMyTask/completdMyTaskModel';
import adhocClosureModel from './../models/adhocClosure/adhocClosureModel';
import adhocSamplingModel from './../models/adhocSampling/adhocSamplingModel';
import adhocCondemnationModel from './../models/adhocCondemnation/adhocCondemnationModel';
import adhocDetentionModel from './../models/adhocDetention/adhocDetentionModel';
import adhocViolationDetailsModel from './../models/adhocViolationDetails/adhocViolationDetailsModel';
import adhocViolationListModel from './../models/adhocViolationList/adhocViolationListModel';
import scheduledComplaintsModel from './../models/scheduledComplaints/scheduledComplaintsModel';
import scheduledFollowUpModel from './../models/scheduledFollowUp/scheduledFollowUpModel';
import scheduledLicensesModel from './../models/scheduledLicenses/scheduledLicensesModel';
import scheduledRoutlineInspectionModel from './../models/scheduledRoutlineInspection/scheduledRoutlineInspectionModel';
import aboutHistoryModel from './../models/aboutHistory/aboutHistoryModel';
import aboutHistoryEstablishmentModel from './../models/aboutHistoryEstablishment/aboutHistoryEstablishmentModel'; 
import aboutHistoryInspectionModel from './../models/aboutHistoryInspection/aboutHistoryInspectionModel';
import aboutLastReportModel from './../models/aboutLastReport/aboutLastReportModel';
import aboutStaffModel from './../models/aboutStaff/aboutStaffModel'; 
import reminderMyTaskModel from './../models/reminderMyTask/reminderMyTaskModel';
import settingsModel from './../models/settings/settingsModel';
import temporaryPermitsMyTaskModel from './../models/temporaryPermitsMyTask/temporaryPermitsMyTaskModel';
import temporaryPermitsEstablishmentModel from './../models/temporaryPermitsEstablishment/temporaryPermitsEstablishmentModel';
import temporaryPermitsInspectionsModel from './../models/temporaryPermitsInspections/temporaryPermitsInspectionsModel';
import temporaryPermitsContactModel from './../models/temporaryPermitsContact/temporaryPermitsContactModel';
import temporaryPermitsEfstModel from './../models/temporaryPermitsEfst/temporaryPermitsEfstModel';
import temporaryPermitsActionModel from './../models/temporaryPermitsAction/temporaryPermitsActionModel';
import temporaryPermitsServiceEstablishmentModel from './../models/temporaryPermitsServiceEstablishment/temporaryPermitsServiceEstablishmentModel';
import temporaryPermitsServiceRequestModel from './../models/temporaryPermitsServiceRequest/temporaryPermitsServiceRequestModel';
import adhocTaskEstablishmentModel from './../models/adhocTaskEstablishment/adhocTaskEstablishmentModel';
import adhocTaskVehicleModel from './../models/adhocTaskVehicle/adhocTaskVehicleModel';
import adhocTaskEstablishmentListModel  from './../models/adhocTaskEstablishmentList/adhocTaskEstablishmentListModel';
import adhocTaskEstablishmentDetailsModel from './../models/adhocTaskEstablishmentDetails/adhocTaskEstablishmentDetailsModel';
import adhocTaskCreateNewEstablishmentModel from './../models/adhocTaskCreateNewEstablishment/adhocTaskCreateNewEstablishmentModel';
import historyEstablishmentModel from './../models/historyEstablishment/historyEstablishmentModel';
import historyVehicleModel from './../models/historyVehicle/historyVehicleModel';
import historyEstablishmentListModel from './../models/historyEstablishmentList/historyEstablishmentListModel';
import historyEstablishmentDetailsModel from './../models/historyEstablishmentDetails/historyEstablishmentDetailsModel';
import serviceRequestListModel from './../models/serviceRequestList/serviceRequestListModel';
import serviceRequestDetailsModel from './../models/serviceRequestDetails/serviceRequestDetailsModel';
import businessActivityModel from './../models/businessActivity/businessActivityModel';
import historyViolationListModel from './../models/historyViolationList/historyViolationListModel';
import historyEfstModel from './../models/historyEfst/historyEfstModel';
import historyVehicleDetailsModel from './../models/historyVehicleDetails/historyVehicleDetailsModel';
import historyInspectionListModel from './../models/historyInspectionList/historyInspectionListModel';
import historyInspectionDetailsModel from './../models/historyInspectionDetails/historyInspectionDetailsModel';
import historyFinalResultModel from './../models/historyFinalResult/historyFinalResultModel';
import onHoldeRequestModel from './../models/onHoldRequest/onHoldeRequestModel';
import documentationAndReportModel from "../models/documentationAndReport/documentationAndReportModel";
import profileModel from  './../models/profile/profileModel';
import closureInspectionModel from './../models/closureInspection/closureInspectionModel'
export type RootStoreModel = Instance<typeof RootStore>

const RootStore = types.model("RootStore", {
  loginModel: loginModel,
  establishmentModel: establishmentModel,
  inspectionStoreModel: inspectionModel,
  bottomBarModel: bottomBarModel,
  myTasksModel: myTasksModel,
  actionModel: actionModel,
  contactModel: contactModel,
  eftstModel: efstModel,
  condemnationModel: condemnationModel,
  detentionModel: detentionModel,
  samplingModel: samplingModel,
  licenseActionModel: licenseActionModel,
  licenseContactModel: licenseContactModel,
  licenseEfstModel: licenseEfstModel,
  licenseEstablishmentModel: licenseEstablishmentModel,
  licenseInspectionModel: licenseInspectionModel,
  licenseMyTaskModel: licenseMyTaskModel,
  foodAlertsModel: foodAlertsModel,
  productListModel: productListModel,
  casesActionModel: casesActionModel,
  casesCondemnationModel: casesCondemnationModel,
  casesDetentionModel: casesDetentionModel,
  casesSamplingModel: casesSamplingModel,
  casesContactModel: casesContactModel,
  casesEfstModel: casesEfstModel,
  casesEstablishmentModel: casesEstablishmentModel,
  casesInspectionModel: casesInspectionModel,
  casesMyTaskModel: casesMyTaskModel,
  completdMyTaskEstablishmentModel: completdMyTaskEstablishmentModel,  
  completedTaskInspectionModel: completedTaskInspectionModel,
  completedTaskContactModel:  completedTaskContactModel,
  completedTaskEfstModel:  completedTaskEfstModel,
  completdMyTaskModel: completdMyTaskModel,
  adhocClosureModel: adhocClosureModel,
  adhocSamplingModel: adhocSamplingModel,
  adhocCondemnationModel: adhocCondemnationModel,
  adhocDetentionModel: adhocDetentionModel,
  adhocViolationDetailsModel: adhocViolationDetailsModel,
  adhocViolationListModel: adhocViolationListModel,
  scheduledComplaintsModel: scheduledComplaintsModel,
  scheduledFollowUpModel: scheduledFollowUpModel,
  scheduledLicensesModel: scheduledLicensesModel,
  scheduledRoutlineInspectionModel:scheduledRoutlineInspectionModel,
  aboutHistoryModel: aboutHistoryModel,
  aboutHistoryEstablishmentModel:aboutHistoryEstablishmentModel,
  aboutHistoryInspectionModel: aboutHistoryInspectionModel,
  aboutLastReportModel:aboutLastReportModel,
  aboutStaffModel:aboutStaffModel,
  reminderMyTaskModel: reminderMyTaskModel,
  settingsModel: settingsModel,
  temporaryPermitsMyTaskModel: temporaryPermitsMyTaskModel,
  temporaryPermitsEstablishmentModel: temporaryPermitsEstablishmentModel,
  temporaryPermitsInspectionsModel:temporaryPermitsInspectionsModel,
  temporaryPermitsContactModel:temporaryPermitsContactModel,
  temporaryPermitsEfstModel:temporaryPermitsEfstModel,
  temporaryPermitsActionModel:temporaryPermitsActionModel,
  temporaryPermitsServiceEstablishmentModel:temporaryPermitsServiceEstablishmentModel,
  temporaryPermitsServiceRequestModel:temporaryPermitsServiceRequestModel,
  adhocTaskEstablishmentModel: adhocTaskEstablishmentModel,
  adhocTaskVehicleModel:adhocTaskVehicleModel,
  adhocTaskEstablishmentListModel:adhocTaskEstablishmentListModel,
  adhocTaskEstablishmentDetailsModel:adhocTaskEstablishmentDetailsModel,
  adhocTaskCreateNewEstablishmentModel:adhocTaskCreateNewEstablishmentModel,
  historyEstablishmentModel:historyEstablishmentModel,
  historyVehicleModel:historyVehicleModel,
  historyEstablishmentListModel:historyEstablishmentListModel,
  historyEstablishmentDetailsModel:historyEstablishmentDetailsModel,
  serviceRequestListModel:serviceRequestListModel,
  serviceRequestDetailsModel:serviceRequestDetailsModel,
  businessActivityModel:businessActivityModel,
  historyViolationListModel:historyViolationListModel,
  historyEfstModel:historyEfstModel,
  historyVehicleDetailsModel:historyVehicleDetailsModel,
  historyInspectionListModel:historyInspectionListModel,
  historyInspectionDetailsModel:historyInspectionDetailsModel,
  historyFinalResultModel:historyFinalResultModel,
  onHoldeRequestModel:onHoldeRequestModel,
  documentationAndReportModel:documentationAndReportModel,
  profileModel:profileModel,
  closureInspectionModel:closureInspectionModel
  
});


export default RootStore;