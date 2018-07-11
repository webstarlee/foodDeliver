import { isIphoneX } from 'react-native-iphone-x-helper';
import { Dimensions } from 'react-native';
const BASE_API_URL = "http://192.168.0.171";//development api
// const BASE_API_URL = "http://178.128.240.64"; //product online api
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
let HEADER_EXPANDED_HEIGHT = 240;
let HEADER_COLLAPSED_HEIGHT = 115;
if (isIphoneX()) {
    HEADER_EXPANDED_HEIGHT = 250;
    HEADER_COLLAPSED_HEIGHT = 125;
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
