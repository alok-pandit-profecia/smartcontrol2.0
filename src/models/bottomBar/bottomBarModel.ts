import {
    types,
    Instance,

} from 'mobx-state-tree';

export type BottomBarStoreModel = Instance<typeof BottomBarStore>

const BottomBarStore = types.model('BottomBarModel', {

    dashboardClick: types.boolean,
    categoryClick: types.boolean,
    taskClick: types.boolean,
    profileClick: types.boolean,

}).actions(self => ({
    setDashboardClisk(dashboardClick: boolean) {
        self.dashboardClick = dashboardClick
    },
    setCategoryClisk(click: boolean) {
        self.categoryClick = click
    },
    setCalenderClisk(click: boolean) {
        self.taskClick = click
    },
    setProfileClisk(click: boolean) {
        self.profileClick = click
    }


})).views(self => ({
    getDashboardClisk() {
        return self.dashboardClick
    },
    getCategoryClisk() {
        return self.categoryClick
    },
    getCalenderClisk() {
        return self.taskClick
    },
    getProfileClisk() {
        return self.profileClick
    }
}));


export default BottomBarStore;
