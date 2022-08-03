const AllEstablishmentSchema = {
    name: 'AllEstablishment',
    primaryKey: 'PREMISE_ID',
    properties:
    {
        PREMISE_ID: 'string',// primary key
        ACCOUNT_NUMBER: 'string?', 
        TL_NUMBER: 'string?',
        PREMISE_NAME: 'string?',
        PREMISE_NAME_AR: 'string?',
        STATUS: 'string?',
        PREMISE_CATEGORY: 'string?',
        ADDRESS: 'string?',
        CITY: 'string?',
        AREA: 'string?',
        PREMISE_TYPE: 'string?',
        MOBILE_NUMBER: 'string?',
        INSPECTOR: 'string?',
        SOURCE: 'string?',
        ON_HOLD: 'string?',
        ON_HOLD_REASON: 'string?',
        LATITUDE: 'string?',
        LONGITUDE: 'string?',
        LAND_LINE: 'string?',
        EMAIL: 'string?'
    }
};
export default AllEstablishmentSchema;