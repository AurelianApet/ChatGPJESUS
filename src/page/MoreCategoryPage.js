import { useContext } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Circle, Text as SvgText, TextPath, TSpan, G, Svg }
  from 'react-native-svg';
import { AppContext } from '../../AppContext';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
 } from "react-native-popup-menu";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const images = {
  anger: require(`../../assets/anger.png`),
  hopelessness: require(`../../assets/hopelessness.png`),
  helplessness: require(`../../assets/helplessness.png`),
  jealousy: require(`../../assets/jealousy.png`),
  loss: require(`../../assets/loss.png`),
  shame: require(`../../assets/shame.png`)
};

const SvgComponent = ({title, image}) => (
  <>
    <Svg position="absolute" height="200" width="200"
      viewBox="0 0 300 300">
      <G id="circle">
        <Circle
          r={80}
          x={150}
          y={120}
          fill="none"
          stroke="#fff"
          strokeWidth={1}
          transform="rotate(-165)"
        />
      </G>
      <SvgText fill="#000" fontSize={width / 100 * 4} fontFamily="LibreBaskerville">
        <TextPath href="#circle">
          <TSpan dx="0" dy={-20}>
            {title}
          </TSpan>
        </TextPath>
      </SvgText>
    </Svg>
    <View>
      <Image
        style={{ height: width / 100 * 27, width: width / 100 * 27, borderRadius: 60,
          marginTop: 20 }}
        source={images[image]}
      />
    </View>
  </>
);

const MoreCategoryPage = ({navigation}) => {
    const {setCurrentTopic} = useContext(AppContext)

    const onSelectCategory = (category) => {
      setCurrentTopic(category)
      navigation.navigate('detailCategory')
    }

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
          <Text style={styles.headerTitle}>Important</Text>
          <Text style={styles.cvTitle}>Conversations</Text>
          <Text style={styles.bibleTitle}>What does the bible say about....</Text>
          <Text style={styles.underlineTitle}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Text>
          <View>
            <View style={styles.rowContainer}>
              <TouchableOpacity
              style={styles.buttonTouchStyle}
              activeOpacity={0.2} onPress={() => onSelectCategory('RAGE & ANGER')} >
                <SvgComponent title={`RAGE & ANGER`} image={`anger`} />
                <Text style={styles.imageDesTitle}>{`Feeling frustrated, irritated, or resentful due to injustices, violation of personal boundaries`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.buttonTouchStyle}
              activeOpacity={0.2} onPress={() => onSelectCategory('HOPELESSNESS')} >
                <SvgComponent title={`HOPELESSNESS`} image={`hopelessness`} />
                <Text style={styles.imageDesTitle}>{`Feeling disconnected, Isolated, or lacking meaningful social connections, emotional distress`}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
              style={styles.buttonTouchStyle}
              activeOpacity={0.2} onPress={() => onSelectCategory('JEALOUSY OR INFERIORITY')} >
                <SvgComponent title={`JEALOUSY OR INFERIORITY`} image={`jealousy`} />
                <Text style={styles.imageDesTitle}>{`Esentment, envy, or insecurity in response to the advantages, successes, or possessions of others`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.buttonTouchStyle}
              activeOpacity={0.2} onPress={() => onSelectCategory('SHAME OR GUILT')} >
                <SvgComponent title={`SHAME OR GUILT`} image={`shame`} />
                <Text style={styles.imageDesTitle}>{`Remorese or blame for something done or failed to do, or a sense of modal wrongdoing`}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.rowContainer}>
              <TouchableOpacity
              style={styles.buttonTouchStyle}
              activeOpacity={0.2} onPress={() => onSelectCategory('HELPLESSNESS')} >
                <SvgComponent title={`HELPLESSNESS`} image={`helplessness`} />
                <Text style={styles.imageDesTitle}>{`Fear, anxiety, worry, or apprehension about potential threats, dangers, or uncertain situations`}</Text>
              </TouchableOpacity>
              <TouchableOpacity
              style={styles.buttonTouchStyle}
              activeOpacity={0.2} onPress={() => onSelectCategory('GRIEF & LOSS')} >
                <SvgComponent title={`GRIEF & LOSS`} image={`loss`} />
                <Text style={styles.imageDesTitle}>{`Feeling down, low, or feeling let down, disillusioned`}</Text>
              </TouchableOpacity>
            </View>
          </View>
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
      fontSize: width / 100 * 7,
      letterSpacing: 4,
      alignSelf: "center",
    },
    cvTitle: {
      color: '#3c2819',
      fontFamily: 'AlexBrush_400Regular',
      fontSize: width / 100 * 7,
      letterSpacing: 2,
      alignSelf: 'flex-end',
      paddingRight: 10,
    },
    bibleTitle: {
      textTransform: "uppercase",
      fontFamily: 'LibreBaskerville',
      fontSize: width / 100 * 3,
      alignSelf: "center",
      opacity: 0.8
    },
    underlineTitle: {
      textDecorationLine: 'underline',
      alignSelf: "center"
    },
    rowContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      justifyContent: 'space-evenly',
      width: width,
      marginBottom: height / 100 * 2
    },
    buttonTouchStyle: {
      alignItems: 'center',
      flex: 1,
      width: width / 3,
      height: height / 5,
      marginVertical: height / 100 * 1.5
    },
    buttonImageIconStyle: {
      height: width / 4,
      width: width / 4,
      resizeMode: 'stretch',
    },
    imageTitle: {
      fontFamily: 'LibreBaskerville'
    },
    imageDesTitle: {
      fontFamily: 'LibreBaskerville',
      fontSize: width / 100 * 1.8,
      textAlign: 'center',
      marginTop: 3,
      textTransform: 'uppercase',
      lineHeight: 12
    },
    cross: {
      position: "absolute",
      top: height / 100 * 3,
      right: width / 100 * 2
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

export default MoreCategoryPage