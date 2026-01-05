import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LibraryScreen from "../screens/LibraryScreen";

const Stack = createNativeStackNavigator();

export default function LibraryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryMain" component={LibraryScreen} />
    </Stack.Navigator>
  );
}
