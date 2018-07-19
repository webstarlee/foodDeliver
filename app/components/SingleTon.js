let instance = null;

class Singleton{
    constructor() {
        if(!instance){
            instance = this;
        }

        // to test whether we have singleton or not
        this.sideMenu = null;
        this.restaurantInfo = null;
        this.cartedList = [];
        this.isShowTab = null;
        this.mainPage = null;
        this.devicefcm = null;
        this.currentUser = null;
        this.beforeScreen = null;
        this.push = null;
        this.showPush = false;
        this.isOpenTab = false;
        this.resetUser = null;
        this.resetCode = null;
        this.nowLogin = false;

        return instance;
    }
}

const store = new Singleton()

export default store
