import AsyncStorage from '@react-native-async-storage/async-storage';

export const Max_Api_Count = 10;

export const loadDataFromStorage = async (category) => {
    let data = await AsyncStorage.getItem(`@${category}`)
    return JSON.parse(data)
}

export const saveDataToStorage = async (category, data) => {
    await AsyncStorage.setItem(`@${category}`, JSON.stringify(data))
    return true;
}

export const loadOpenAIKey = async () => {
    let key = await AsyncStorage.getItem(`@UserOpenAIKey`)
    return key;
}

export const saveOpenAIKey = async (key) => {
    await AsyncStorage.setItem(`@UserOpenAIKey`, key)
    return true;
}

export const loadMonth = async () => {
    let month = await AsyncStorage.getItem(`@Month`)
    return month ? parseInt(month) : 0;
}

export const saveMonth = async (month) => {
    await AsyncStorage.setItem(`@Month`, month.toString())
    return true;
}

export const loadApiUsingCount = async () => {
    let count = await AsyncStorage.getItem(`@ApiUsingCount`)
    return parseInt(count);
}

export const saveApiUsingCount = async (count) => {
    await AsyncStorage.setItem(`@ApiUsingCount`, count.toString())
    return true;
}