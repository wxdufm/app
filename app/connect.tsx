import { useRef, useState } from 'react'
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View, useWindowDimensions,
    type ImageSourcePropType,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Rect, G } from 'react-native-svg'

const STATIC_NOISE = require('../assets/listenpage/static-noise.png') as ImageSourcePropType
const CD_ICON = require('../assets/listenpage/cd-icon.png') as ImageSourcePropType

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
        <View className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
            <View className="justify-center items-center px-4" style={{ height: (width - 32) * (295 / 896) + 32 }}>
                <Image
                    source={require('../assets/logo.png')}
                    style={{ width: width - 32, height: (width - 32) * (295 / 896) }}
                />
            </View>

            <View className="gap-5 px-6 mt-4">
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

            <View style={{ width: 280, height: 68, alignSelf: 'flex-start', marginTop: 24, marginLeft: 24, marginBottom: -26, zIndex: 2 }}>
                <Svg width={280} height={68} viewBox="0 0 280 68">
                    <Rect x={16} y={0} width={213} height={46} rx={4} fill="#140858" />
                    <G transform="translate(0, 3.81)">
                        <Path
                            d="M15.637 1.83464C16.6682 -0.611549 20.1346 -0.611546 21.1658 1.83465L36.564 38.3617C37.3977 40.3392 35.9457 42.527 33.7996 42.527H3.00313C0.857039 40.3392 -0.594934 40.3392 0.238719 38.3617L15.637 1.83464Z"
                            fill="#140858"
                        />
                    </G>
                    <G transform="translate(208, 0)">
                        <Path
                            d="M16.9338 1.83304C17.9658 -0.611016 21.4293 -0.611011 22.4612 1.83304L39.1557 41.3707C39.9908 43.3485 38.5388 45.5377 36.3919 45.5377H3.00307C0.856236 45.5377 -0.595742 43.3485 0.23935 41.3707L16.9338 1.83304Z"
                            fill="#15085D"
                        />
                    </G>
                </Svg>
                <Image
                    source={CD_ICON}
                    resizeMode="contain"
                    style={{ position: 'absolute', left: 22, top: 4, width: 37, height: 35 }}
                />
                <Text
                    className="text-white font-bitcount-bold tracking-wide"
                    style={{ position: 'absolute', left: 66, top: 8, fontSize: 20 }}
                >
                    About
                </Text>
            </View>

            <LinearGradient
                colors={['#130754', '#3516cf']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="self-center rounded-2xl overflow-hidden"
                style={{
                    marginHorizontal: 25,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 2,
                    elevation: 6,
                }}
            >
                <View
                    className="rounded-md overflow-hidden"
                    style={{ marginHorizontal: 12, marginVertical: 12, backgroundColor: '#a3a3a3' }}
                >
                    <Image
                        source={STATIC_NOISE}
                        resizeMode="repeat"
                        tintColor="#ffffff"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.6,
                            transform: [{ scale: 2.7 }],
                        }}
                    />
                    <Text
                        className="text-gray-900 font-courier text-lg"
                        style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                    >
                        WXDU 88.7 FM is the non-commercial student-run radio station of Duke University and Durham, founded in 1983 when former station WDUK-1600AM switched to a FM signal. WXDU, as a member of the Duke University Union, exists to inform, educate, and entertain both the students of Duke University and the surrounding community of Durham through quality progressive alternative radio programming.
                    </Text>
                </View>
            </LinearGradient>
        </ScrollView>

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
