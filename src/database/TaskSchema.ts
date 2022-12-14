
const TaskSchema = {
    name: 'Task',
    primaryKey: 'TaskId',
    properties:
    {
        TaskId: 'string',
        Updated: { type: 'string', optional: true },
        InspectortobeEvaluatedId: { type: 'string', optional: true },
        InspLogin: { type: 'string', optional: true },
        InspJobTitle: { type: 'string', optional: true },
        InspFullName: { type: 'string', optional: true },
        LicenseCode: { type: 'string', optional: true },
        LicenseNumber: { type: 'string', optional: true },
        PlanStatus: { type: 'string', optional: true },
        PlanStartDate: { type: 'string', optional: true },
        PlanNumber: { type: 'string', optional: true },
        PlanName: { type: 'string', optional: true },
        PlanEndDate: { type: 'string', optional: true },
        PlanAlAin: { type: 'string', optional: true },
        PlanAlGharbia: { type: 'string', optional: true },
        PlanAbuDhabi: { type: 'string', optional: true },
        BAId: { type: 'string', optional: true },
        EstablishmentId: { type: 'string', optional: true },
        EstablishmentName: { type: 'string', optional: true },
        EstablishmentNameAR: { type: 'string', optional: true },
        ActivitySRId: { type: 'string', optional: true },
        RiskCategory: { type: 'string', optional: true },
        InspectorId: { type: 'string', optional: true },
        Grade: { type: 'string', optional: true },
        Comment: { type: 'string', optional: true },
        Description: { type: 'string', optional: true },
        CreatedDate: { type: 'string', optional: true },
        Score: { type: 'string', optional: true },
        Sector: { type: 'string', optional: true },
        CompletionDate: { type: 'string', optional: true },
        LoginName: { type: 'string', optional: true },
        PrimaryOwnerId: { type: 'string', optional: true },
        TaskPriority: { type: 'string', optional: true },
        PlanId: { type: 'string', optional: true },
        CampaignType: { type: 'string', optional: true },
        BusinessActivity: { type: 'string', optional: true },
        StartDate: { type: 'string', optional: true },
        TaskStatus: { type: 'string', optional: true },
        NumOfEST: { type: 'string', optional: true },
        TaskType: { type: 'string', optional: true },
        SampleSize: { type: 'string', optional: true },
        SystemType: { type: 'string', optional: true },
        ListOfAdfcaAccountThinBc: { type: 'string', optional: true },
        FinAcctCurrentBank: { type: 'string', optional: true },
        Name: { type: 'string', optional: true },
        isAcknowledge: { type: 'bool', optional: true },
        isCompleted: { type: 'bool', optional: true },
        mappingData: { type: 'string', optional: true },
        condemnationFlag: { type: 'bool', optional: true },
        detentionFlag: { type: 'bool', optional: true },
        samplingFlag: { type: 'bool', optional: true },
        comment: { type: 'string', optional: true },
        nameOfFoodBusinessOperator: { type: 'string', optional: true },
        attachment: { type: 'string', optional: true },
        inspectionApproved: { type: 'bool', optional: true },
        address: { type: 'string', optional: true },
        SiebelTaskId: { type: 'string', optional: true },
        AssessmentScore: { type: 'string', optional: true },
        Description2: { type: 'string', optional: true },
        MaxScore: { type: 'string', optional: true },
        Name2: { type: 'string', optional: true },
        Percent: { type: 'string', optional: true },
        Template_Name: { type: 'string', optional: true }
    }
};
export default TaskSchema;