const MergedTasksSchema :any = {

    name: 'MergedTasks',
    primaryKey: 'TaskId',
    properties:
    {
        TaskId: 'string',
        FollowupId: 'string',
        userId:'string',
    }

};
export default MergedTasksSchema;