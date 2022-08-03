
const SrDetailsSchema = {
    name: 'SrDetails',
    primaryKey: 'SiebSRId',
    properties:
    {
        LoginName: { type: 'string', optional: true },
        ADFCAExibitionToDate: { type: 'string', optional: true },
        ADFCAExbFromDate: { type: 'string', optional: true },
        SiebSRId: { type: 'string', optional: true },
        ADFCACertificateExpDate: { type: 'string', optional: true },
        ADFCACertificateStartDate: { type: 'string', optional: true },
        ADFCAEventType: { type: 'string', optional: true },
        ADFCASRInspector: { type: 'string', optional: true },
        ADFCAEventName: { type: 'string', optional: true },
        ADFCAPuposeOfVisit: { type: 'string', optional: true },
        ADFCAPremiseAddress: { type: 'string', optional: true },
        ApplicationType: { type: 'string', optional: true },
        ADFCANoOfBooth: { type: 'string', optional: true },
        OpenedDate: { type: 'string', optional: true },
        ADFCACertificateNo: { type: 'string', optional: true },
        Application: { type: 'string', optional: true },
        Status: { type: 'string', optional: true },
        ADFCAEventLocation: { type: 'string', optional: true },
        ListOfAdfcaActionThinBc: { type: 'string', optional: true },
        ListOfAdfcaAccountThinBc: { type: 'string', optional: true },
        RequestType: { type: 'string', optional: true },
    }
};
export default SrDetailsSchema;