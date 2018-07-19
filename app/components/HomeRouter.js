import { StackNavigator } from 'react-navigation';
import Welcome from "../screens/Welcome";
import Before from "../screens/Beforeview";
import Login from "../screens/Login";
import ForgetPass from "../screens/ForgetPass";
import ResetPass from "../screens/ResetPass";
import Signup from "../screens/Signup";
import HomeScreen from "../screens/Afterview";

const MainStack = StackNavigator({
    Welcome: {screen: Welcome},
    Before: {screen: Before},
    Login: {screen: Login},
    ForgetPass: {screen: ForgetPass},
    ResetPass: {screen: ResetPass},
    Signup: {screen: Signup},
    Home: {screen: HomeScreen},
 }, {
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false
    }
});

export default MainStack;