import { isIphoneX } from 'react-native-iphone-x-helper';
import { Dimensions } from 'react-native';
// const BASE_API_URL = "http://192.168.0.171";//development api
const BASE_API_URL = "http://fooddeliver.leezhur.com"; //test online api
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
let HEADER_EXPANDED_HEIGHT = 200;
let HEADER_COLLAPSED_HEIGHT = 65;
if (isIphoneX()) {
    HEADER_EXPANDED_HEIGHT = 210;
    HEADER_COLLAPSED_HEIGHT = 75;
}
const ITEM_HEIGHT = 150;

export {
    BASE_API_URL,
    HEADER_EXPANDED_HEIGHT,
    HEADER_COLLAPSED_HEIGHT,
    ITEM_HEIGHT,
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
}