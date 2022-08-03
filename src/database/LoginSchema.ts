const LoginDetailsSchema :any = {

    name: 'Login',

    properties:
    {

        isLoggedIn: 'bool',
        loginResponse: 'string',
        username:'string',
        password:'string'
    }

};
export default LoginDetailsSchema;