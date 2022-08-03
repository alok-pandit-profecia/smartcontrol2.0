import XLSX from 'xlsx';
import BackgroundFetch from "react-native-background-fetch";
import CheckListSchema from './src/database/CheckListSchema';
import { RealmController } from './src/database/RealmController';
import LoginSchema from './src/database/LoginSchema';
import TaskSchema from './src/database/TaskSchema';
import { createStore } from "./src/store/createStore";
import { StoreProvider } from "./src/store/storeProvider";

const rootStore = createStore()
const input = (res: any) => res;
const output = (str: any) => str;
const make_cols = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, (x, i) => XLSX.utils.encode_col(i));
const make_width = (refstr: any) => Array.from({ length: XLSX.utils.decode_range(refstr).e.c + 1 }, () => 60);
let realm = RealmController.getRealmInstance();

const WriteEstablishmentData = async (event: any) => {
    //console.log('background')
    let taskId = event.taskId;

    //console.log('[BackgroundFetch HeadlessTask] index start: ', taskId);

    try {

        let loginData = RealmController.getLoginData(realm, LoginSchema.name);
        loginData = loginData['0'] ? loginData['0'] : {};

        if (loginData.username) {
            let myTasks = rootStore.myTasksModel;
            myTasks.callToBackgroundGetChecklistApi();
        }

    } catch (error) {
        //console.log(error)
    }

    BackgroundFetch.finish(taskId);

}
export default WriteEstablishmentData;