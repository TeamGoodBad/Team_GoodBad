import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import notifee, { TimestampTrigger, TriggerType, RepeatFrequency } from '@notifee/react-native';


import MainView from './src/screens/MainView';
import CalendarView from './src/screens/CalendarView';
import AnalysisView from './src/screens/AnalysisView';
import SettingsView from './src/screens/SettingsView';
import AuthenticationView from './src/screens/AuthenticationView';
import { CombinedDefaultTheme, CombinedDarkTheme } from "./src/theme";
import { PIN_KEY, SettingsDB } from './src/storage/settings';

const App = () => {
  const scheme = useColorScheme();

  const Tab = createMaterialBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const [pin, _] = useMMKVStorage(PIN_KEY, SettingsDB, "");

  onCreateTriggerNotification()

  async function onCreateTriggerNotification() {
    const date = new Date(Date.now());
    date.setHours(21);
    date.setMinutes(30);

    // Create a time-based trigger
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(), // fire at 11:10am (10 minutes before meeting)
      repeatFrequency: RepeatFrequency.DAILY,
    };

    // Create a trigger notification
    await notifee.createTriggerNotification(
      {
        title: 'Muistitko arvostella päiväsi?',
        body: 'Käy kirjaamassa päiväsi ylös',
        android: {
          channelId: 'your-channel-id',
        },
      },
      trigger,
    );
  }

  /** Tab navigator */
  const Tabs = () => {
    return (
      <Tab.Navigator labeled={false}>
        <Tab.Screen
          name='Main'
          component={MainView}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="notebook-edit" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name='Calendar'
          component={CalendarView}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name='Analysis'
          component={AnalysisView}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="lightbulb-on-outline" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name='Settings'
          component={SettingsView}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cog" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  /** Wraps authentication view with rest of the app */
  const AuthenticationWrapper = (
    <Stack.Navigator initialRouteName={pin != "" ? "Authentication" : "Tabs"}>
      <Stack.Screen
        name="Authentication"
        component={AuthenticationView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );

  return (
    <PaperProvider theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
      <NavigationContainer theme={scheme === 'dark' ? CombinedDarkTheme : CombinedDefaultTheme}>
        {AuthenticationWrapper}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
