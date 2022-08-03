const CheckListSchema = {
    name: 'CheckList',
    primaryKey: 'taskId',
    properties:
    {
        checkList: 'string',
        taskId: 'string', // primary key
        timeElapsed: 'string',
        timeStarted: 'string',
        isCompleted: { type: 'bool', optional: true },
        sign: { type: 'string', optional: true },
        overallcomment: { type: 'string', optional: true },
        contactname: { type: 'string', optional: true },
        contactnumber: { type: 'string', optional: true },
        eid: { type: 'string', optional: true },
    }
};
export default CheckListSchema;