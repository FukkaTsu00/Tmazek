import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStackNavigator from "./HomeStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";
import LibraryStackNavigator from "./LibraryStackNavigator";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#121212", height: 60 },
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#888",
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "HomeTab") iconName = "home";
          else if (route.name === "SearchTab") iconName = "search";
          else if (route.name === "LibraryTab") iconName = "library";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} />
      <Tab.Screen name="SearchTab" component={SearchStackNavigator} />
      <Tab.Screen name="LibraryTab" component={LibraryStackNavigator} />
    </Tab.Navigator>
  );
}
