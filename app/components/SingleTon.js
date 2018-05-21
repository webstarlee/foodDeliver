let instance = null;

class Singleton{
    constructor() {
        if(!instance){
              instance = this;
        }

        // to test whether we have singleton or not
        this.sideMenu = null;
        this.restaurantInfo = null;

        return instance;
    }
}

const store = new Singleton()

export default store
