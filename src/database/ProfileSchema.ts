const ProfileDetailsSchema = {
    name: 'profile',
    primaryKey: 'UserId',
    properties:
    {
        inspectorName :'string',
        position :'string',
        inspectionArea :'string' ,
        unit :'string',
        UserId :'string', // primary key
    }
};
export default ProfileDetailsSchema;