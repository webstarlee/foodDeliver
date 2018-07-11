import { StackNavigator } from 'react-navigation';
import Welcome from "../screens/Welcome";
import Before from "../screens/Beforeview";
import Login from "../screens/Login";
import HomeScreen from "../screens/Afterview";

const MainStack = StackNavigator({
    Welcome: {screen: Welcome},
    Before: {screen: Before},
    Login: {screen: Login},
    Home: {screen: HomeScreen},
 }, {
    headerMode: 'none',
});

export default MainStack;