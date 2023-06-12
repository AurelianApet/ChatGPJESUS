import AsyncStorage from '@react-native-async-storage/async-storage';

// export const OPENAI_API_KEY = "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"
export const OPENAI_API_KEY = "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" // new
// export const OPENAI_API_KEY = "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" // Venus

export const loadDataFromStorage = async (category) => {
    let data = await AsyncStorage.getItem(`@${category}`)
    return JSON.parse(data)
}

export const saveDataToStorage = async (category, data) => {
    await AsyncStorage.setItem(`@${category}`, JSON.stringify(data))
    return true;
}

export const loadOpenAIKey = async () => {
    let key = await AsyncStorage.getItem(`@OpenAIKey`)
    return key;
}

export const saveOpenAIKey = async (key) => {
    await AsyncStorage.setItem(`@OpenAIKey`, key)
    return true;
}