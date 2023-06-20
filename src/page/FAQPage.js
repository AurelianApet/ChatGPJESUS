import { useEffect } from 'react'
import { StyleSheet, Text, View, Dimensions, UIManager, Image } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { Ionicons } from '@expo/vector-icons';
import {AccordionList} from 'react-native-accordion-list-view';

const { width, height } = Dimensions.get('window');

const FAQPage = ({navigation}) => {
      const data = [
        {
            id: 0,
            title: 'Lorem Ipsum is simply dummy',
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        {
            id: 1,
            title: 'Lorem Ipsum is simply dummy',
            body: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
    ];
    useEffect(() => {
        if (Platform.OS === 'android') {
            if (UIManager.setLayoutAnimationEnabledExperimental) {
                UIManager.setLayoutAnimationEnabledExperimental(true);
            }
        }
    }, []);

    const handleNaviate = (router) => {
      navigation.navigate(router)
    }

    return (
        <View style={styles.container}>
          <Image source={require('../../assets/cross.png')} style={styles.cross} />
          <Menu style={styles.dropMenu}>
            <MenuTrigger
                customStyles={{
                    triggerWrapper: {
                        top: -40,
                        left: -10
                    },
                }}
            >
                <Ionicons name="reorder-three" size={50} color="#ba9e87" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => handleNaviate("moreCategory") } customStyles={{
                optionWrapper: {
                  padding: 10
                },
              }} >
                <Text style={styles.optionText}>Conversation</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleNaviate("FAQ")} customStyles={{
                optionWrapper: {
                  padding: 10
                },
              }} >
                <Text style={styles.optionText}>FAQ</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleNaviate("AboutUs")} customStyles={{
                optionWrapper: {
                  padding: 10
                },
              }} >
                <Text style={styles.optionText}>About Us</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
          <Text style={styles.headerTitle}>FAQ</Text>
          <Text style={styles.cvTitle}></Text>
          <AccordionList
              data={data}
              customTitle={item => <Text style={styles.AccordionTitle}>{item.title}</Text>}
              customBody={item => <Text style={styles.AccordionBody}>{item.body}</Text>}
              animationDuration={400}
              expandMultiple={true}
              style={styles.AccordionList}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: '#efe9e4'
    },
    headerTitle: {
      color: '#a48f85',
      textTransform: "uppercase",
      fontFamily: 'Le_Jour_Serif',
      fontSize: 35,
      letterSpacing: 4,
      alignSelf: "center",
    },
    cvTitle: {
      color: '#3c2819',
      fontFamily: 'AlexBrush_400Regular',
      fontSize: 38,
      letterSpacing: 2,
      alignSelf: 'flex-end',
      paddingRight: 40,
    },
    AccordionTitle: {
      color: '#3c2819',
      fontFamily: 'JosefinSans_300Light_Italic',
      fontSize: 30
    },
    AccordionBody: {
      fontFamily: 'JosefinSans_300Light_Italic',
      fontSize: 20
    },
    cross: {
      position: "absolute",
      top: 25,
      right: 20,
    },
    dropMenu: {
      position: "absolute",
      top: 30,
      left: 10,
      zIndex: 10000
    },
    optionText: {
      fontSize: 18,
      color: '#9d8673'
    }
  });

export default FAQPage