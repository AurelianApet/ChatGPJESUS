import { ImageBackground, StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
   } from "react-native-popup-menu";
import { Ionicons } from '@expo/vector-icons';

export const DropMenu = () => {
        <Menu>
            <MenuTrigger
                customStyles={{
                    triggerWrapper: {
                        top: -40,
                        left: -30
                    },
                }}
            >
                <Ionicons name="reorder-three" size={50} color="#ba9e87" />
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={() => alert(`Save`)} text="Conversation" />
                <MenuOption onSelect={() => alert(`Save`)} text="FAQ" />
                <MenuOption onSelect={() => alert(`Delete`)} text="About US" />
            </MenuOptions>
        </Menu>

}

const styles = StyleSheet.create({

})