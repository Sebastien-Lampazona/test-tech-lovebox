import React, { useLayoutEffect, useMemo } from 'react';
import { I18nManager, SafeAreaView, StyleSheet, Button, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { LoveboxMessagesSendMessageTab, LoveboxMessagesListTab } from "../../screens"

const createStack = (name, component) => {
  const Stack = createNativeStackNavigator();
  const makeStack = () => (
    <Stack.Navigator
      screenOptions={{
        direction: I18nManager.isRTL ? 'rtl' : 'ltr',
        headerShown: false
      }}>
      <Stack.Screen name={name} component={component} />
    </Stack.Navigator>
  );
  return makeStack;
}

const Tab = createBottomTabNavigator();

export const LoveboxMessagesTabView = (): JSX.Element => {
  const sendMessageTab = useMemo(() => createStack("sendMessageTab", LoveboxMessagesSendMessageTab), []);
  const messagesListTab = useMemo(() => createStack("messagesListTab", LoveboxMessagesListTab), []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}>
      <Tab.Screen
        name="sendMessages"
        component={sendMessageTab}
        options={{
          tabBarLabel: 'Envoi de message',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="android-messages" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="messagesList"
        component={messagesListTab}
        options={{
          tabBarLabel: 'Messages reçus',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-list" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});