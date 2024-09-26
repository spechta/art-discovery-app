import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LikedArtScreen from "../screens/LikedArtScreen";
import LoginScreen from "../screens/LoginScreen";
import ModalScreen from "../screens/ModalScreen";
import useAuth from "../hooks/useAuth";

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <>
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="LikedArt" component={LikedArtScreen} />
            <Stack.Screen name="Login" component={LoginScreen} /> 
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              ...TransitionPresets.ModalPresentationIOS,
            }}
          > 
            <Stack.Screen name="Modal" component={ModalScreen} />
          </Stack.Group>
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
