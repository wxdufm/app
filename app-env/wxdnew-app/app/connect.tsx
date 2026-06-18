import { useRef, useState } from 'react'
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View, useWindowDimensions,
} from 'react-native'

const COOLDOWN_SECONDS = 60

export default function ConnectScreen() {
    const { width } = useWindowDimensions()
    const [modalType, setModalType] = useState<'song' | 'message' | null>(null)
    const [songTitle, setSongTitle] = useState('')
    const [songArtist, setSongArtist] = useState('')
    const [songName, setSongName] = useState('')
    const [messageName, setMessageName] = useState('')
    const [messageText, setMessageText] = useState('')
    const [sending, setSending] = useState(false)
    const [status, setStatus] = useState<'success' | 'error' | 'ratelimit' | null>(null)
    const [cooldown, setCooldown] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    function openModal(type: 'song' | 'message') {
        setModalType(type)
        setStatus(null)
    }

    function closeModal() {
        setModalType(null)
        Keyboard.dismiss()
    }

    async function handleSend() {
        if (cooldown > 0 || sending) return

        const text = modalType === 'song'
            ? `Song Request: ${songTitle} by ${songArtist}`
            : `Message: ${messageText}`
        const user_name = modalType === 'song' ? songName : messageName

        setSending(true)
        setStatus(null)

        try {
            const res = await fetch('https://api.wxdu.art/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, user_name }),
            })
            if (!res.ok) {
                const err: any = new Error(`${res.status}`)
                err.status = res.status
                throw err
            }
            setStatus('success')
            setCooldown(COOLDOWN_SECONDS)
            timerRef.current = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!)
                        timerRef.current = null
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } catch (e: any) {
            setStatus(e.status === 429 ? 'ratelimit' : 'error')
        } finally {
            setSending(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1 bg-black">
            <Image
                source={require('../assets/logo.png')}
                style={{ width: width - 32, height: (width - 32) * (295 / 896), marginHorizontal: 16 }}
            />
            <View className="flex-1 justify-center gap-5 px-6">
                <Pressable
                    onPress={() => openModal('song')}
                    className="items-center py-4 rounded-full bg-red-700"
                >
                    <Text className="text-white font-courier-bold text-base">Song Request</Text>
                </Pressable>

                <Pressable
                    onPress={() => openModal('message')}
                    className="items-center py-4 rounded-full bg-red-700"
                >
                    <Text className="text-white font-courier-bold text-base">Message the DJ</Text>
                </Pressable>

                <Pressable
                    onPress={() => Linking.openURL('tel:9196848870')}
                    className="items-center py-4 rounded-full bg-green-700"
                >
                    <Text className="text-white font-courier-bold text-base">Dial a DJ</Text>
                </Pressable>
            </View>

            <Modal
                visible={modalType !== null}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <Pressable
                        className="flex-1 justify-center px-6"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                        onPress={closeModal}
                    >
                        <Pressable
                            className="bg-zinc-900 rounded-xl p-6"
                            onPress={Keyboard.dismiss}
                        >
                            <View className="flex-row justify-between items-center mb-5">
                                <Text className="text-white text-lg font-courier-bold">
                                    {modalType === 'song' ? 'Song Request' : 'Message the DJ'}
                                </Text>
                                <Pressable onPress={closeModal} hitSlop={12}>
                                    <Text className="text-gray-400 text-xl">✕</Text>
                                </Pressable>
                            </View>

                            {modalType === 'song' && (
                                <>
                                    <Text className="text-gray-400 font-courier text-sm mb-1">Song Title</Text>
                                    <TextInput
                                        value={songTitle}
                                        onChangeText={setSongTitle}
                                        placeholder="e.g. Wasted in Athens"
                                        placeholderTextColor="#52525b"
                                        className="bg-zinc-800 text-white px-3 py-2 rounded mb-4 font-courier"
                                    />
                                    <Text className="text-gray-400 font-courier text-sm mb-1">Artist</Text>
                                    <TextInput
                                        value={songArtist}
                                        onChangeText={setSongArtist}
                                        placeholder="e.g. The Ocho"
                                        placeholderTextColor="#52525b"
                                        className="bg-zinc-800 text-white px-3 py-2 rounded mb-4 font-courier"
                                    />
                                    <Text className="text-gray-400 font-courier text-sm mb-1">Your Name</Text>
                                    <TextInput
                                        value={songName}
                                        onChangeText={setSongName}
                                        placeholder="e.g. Ben"
                                        placeholderTextColor="#52525b"
                                        className="bg-zinc-800 text-white px-3 py-2 rounded mb-5 font-courier"
                                    />
                                </>
                            )}

                            {modalType === 'message' && (
                                <>
                                    <Text className="text-gray-400 font-courier text-sm mb-1">Your Name</Text>
                                    <TextInput
                                        value={messageName}
                                        onChangeText={setMessageName}
                                        placeholder="e.g. Ben"
                                        placeholderTextColor="#52525b"
                                        className="bg-zinc-800 text-white px-3 py-2 rounded mb-4 font-courier"
                                    />
                                    <Text className="text-gray-400 font-courier text-sm mb-1">Message</Text>
                                    <TextInput
                                        value={messageText}
                                        onChangeText={setMessageText}
                                        placeholder="Write your message to the DJ..."
                                        placeholderTextColor="#52525b"
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        className="bg-zinc-800 text-white px-3 py-2 rounded mb-5 font-courier"
                                    />
                                </>
                            )}

                            <Pressable
                                onPress={handleSend}
                                disabled={sending || cooldown > 0}
                                className={`items-center py-3 rounded-full ${sending || cooldown > 0 ? 'bg-zinc-600' : 'bg-red-600'}`}
                            >
                                <Text className="text-white font-courier-bold">
                                    {sending ? 'Sending...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Send'}
                                </Text>
                            </Pressable>

                            {status === 'success' && (
                                <Text className="text-green-400 font-courier text-sm text-center mt-3">
                                    Sent! The DJ will see your request shortly.
                                </Text>
                            )}
                            {status === 'ratelimit' && (
                                <Text className="text-yellow-400 font-courier text-sm text-center mt-3">
                                    Too many requests — wait a moment and try again.
                                </Text>
                            )}
                            {status === 'error' && (
                                <Text className="text-red-400 font-courier text-sm text-center mt-3">
                                    Something went wrong. Please try again.
                                </Text>
                            )}
                        </Pressable>
                    </Pressable>
                </KeyboardAvoidingView>
            </Modal>
        </View>
        </TouchableWithoutFeedback>
    )
}
