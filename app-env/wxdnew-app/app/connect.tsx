import { useState } from 'react'
import { Alert, Image, Keyboard, Linking, Pressable, Text, TextInput, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native'

export default function ConnectScreen() {
    const { width } = useWindowDimensions()
    const [requestText, setRequestText] = useState('')
    const [sending, setSending] = useState(false)

    // DJ Request function
    async function sendRequest() {
        const message = requestText.trim()  // strips out whitespace
        if (!message) return  // if user sends an empty message or only a space for example, the function bails out early

        setSending(true)
        try {
            const res = await fetch('https://api.wxdu.art/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            if (!res.ok) throw new Error(`${res.status}`)
            setRequestText('')
            Alert.alert('Request sent!', 'Your request has been submitted.')
        } catch {
            Alert.alert('Error', 'Could not send your request. Please try again.')
        } finally {
            setSending(false)
        }
    }

    // the JSX
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-black">
            <Image
                source={require('../assets/logo.png')}
                style={{ width: width - 32, height: (width - 32) * (295 / 896), marginHorizontal: 16 }}
            />
            <View className="flex-1 justify-center gap-8 px-6">
                
                <View>
                    <Text className="text-white text-xl font-courier-bold mb-3">Make a Request</Text>
                    <TextInput
                        value={requestText}
                        onChangeText={setRequestText}
                        placeholder="Song and artist..."
                        placeholderTextColor="#52525b"
                        className="bg-zinc-900 text-white px-4 py-3 rounded mb-3 font-courier"
                    />
                    <Pressable
                        onPress={sendRequest}
                        disabled={sending || !requestText.trim()}
                        className={`items-center py-4 rounded-full ${sending || !requestText.trim() ? 'bg-zinc-700' : 'bg-blue-600'}`}
                    >
                        <Text className="text-white font-courier-bold">
                            {sending ? 'Sending...' : 'Send Request'}
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                    onPress={() => Linking.openURL('tel:9196848870')}
                    className="items-center bg-green-700 py-4 rounded-full"
                >
                    <Text className="text-white font-courier-bold text-base">Dial a DJ</Text>
                </Pressable>

            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}