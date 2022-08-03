// import { StackActions, NavigationActions, DrawerActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';

let navigator: any;

const setTopLevelNavigator = (navigatorRef: any) => {
    navigator = navigatorRef;
}

const navigate = (routeName: string, params?: any) => {
    navigator.dispatch(
        CommonActions.navigate({
            name: routeName,
            params
        })
    );
}

const goBack = () => {
    navigator.dispatch(
        CommonActions.goBack()
    );
}


const replace = (routeName: string, params?: any) => {

    navigator.dispatch(

        CommonActions.reset({
            index: 1,
            routes: [
                { name: routeName,
                    params
                },
            ],
        })
    );

}
// toggleDrawer = () => {

//   navigator.dispatch(DrawerActions.toggleDrawer());

// }

export default { navigate, goBack, setTopLevelNavigator, replace };