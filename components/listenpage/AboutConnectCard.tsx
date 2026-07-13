import { useState, type ReactNode } from 'react'
import { View, Text, Image, Pressable, type ImageSourcePropType, Linking } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Svg, { Path, Rect, G } from 'react-native-svg'

const STATIC_NOISE = require('../../assets/listenpage/static-noise.png') as ImageSourcePropType
const CD_ICON = require('../../assets/listenpage/cd-icon.png') as ImageSourcePropType

const TAB_WIDTH = 150
const TAB_HEIGHT = 46
const TAB_SVG_HEIGHT = 68
const ACTIVE_COLOR = '#150859'
const INACTIVE_COLOR = '#87829f'

type Tab = 'about' | 'connect'

function TabShape({ label, active, onPress, showIcon, style, zIndex }: {
    label: string
    active: boolean
    onPress: () => void
    showIcon?: boolean
    style?: any
    zIndex: number
}) {
    const color = active ? ACTIVE_COLOR : INACTIVE_COLOR

    return (
        <Pressable
            onPress={onPress}
            style={[{ width: TAB_WIDTH, height: TAB_SVG_HEIGHT, zIndex }, style]}
        >
            <Svg width={TAB_WIDTH} height={TAB_SVG_HEIGHT} viewBox={`0 0 ${TAB_WIDTH} ${TAB_SVG_HEIGHT}`}>
                <Rect x={16} y={0} width={TAB_WIDTH - 34} height={TAB_HEIGHT} rx={4} fill={color} />
                <G transform="translate(0, 3.81)">
                    <Path
                        d="M15.637 1.83464C16.6682 -0.611549 20.1346 -0.611546 21.1658 1.83465L36.564 38.3617C37.3977 40.3392 35.9457 42.527 33.7996 42.527H3.00313C0.857039 40.3392 -0.594934 40.3392 0.238719 38.3617L15.637 1.83464Z"
                        fill={color}
                    />
                </G>
                <G transform={`translate(${TAB_WIDTH - 39}, 0)`}>
                    <Path
                        d="M16.9338 1.83304C17.9658 -0.611016 21.4293 -0.611011 22.4612 1.83304L39.1557 41.3707C39.9908 43.3485 38.5388 45.5377 36.3919 45.5377H3.00307C0.856236 45.5377 -0.595742 43.3485 0.23935 41.3707L16.9338 1.83304Z"
                        fill={color}
                    />
                </G>
            </Svg>
            {showIcon && (
                <Image
                    source={CD_ICON}
                    resizeMode="contain"
                    style={{ position: 'absolute', left: 22, top: 4, width: 37, height: 35 }}
                />
            )}
            <Text
                className="text-white font-bitcount-bold tracking-wide"
                style={{ position: 'absolute', left: showIcon ? 66 : 26, top: 8, fontSize: 20 }}
            >
                {label}
            </Text>
        </Pressable>
    )
}

type AboutConnectCardProps = {
    aboutText: string
    children: ReactNode
}

export default function AboutConnectCard({ aboutText, children }: AboutConnectCardProps) {
    const [tab, setTab] = useState<Tab>('about')

    return (
        <View>
            <View className="flex-row" style={{ alignSelf: 'flex-start', marginLeft: 24, marginBottom: -26 }}>
                <TabShape
                    label="About"
                    active={tab === 'about'}
                    onPress={() => setTab('about')}
                    showIcon
                    zIndex={tab === 'about' ? 2 : 0}
                    style={{ transform: [{ translateY: tab === 'about' ? 0 : 6 }] }}
                />
                <TabShape
                    label="Connect"
                    active={tab === 'connect'}
                    onPress={() => setTab('connect')}
                    zIndex={tab === 'connect' ? 2 : 0}
                    style={{ marginLeft: -20, transform: [{ translateY: tab === 'connect' ? 0 : 6 }] }}
                />
            </View>

            <LinearGradient
                colors={['#130754', '#3516cf']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="self-center rounded-2xl overflow-hidden"
                style={{
                    marginHorizontal: 25,
                    zIndex: 1,
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
                    {tab === 'about' ? (
                        <Text
                            className="text-gray-900 font-courier text-lg"
                            style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                        >
                            {aboutText}
                        </Text>
                    ) : (
                        <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                            {children}
                        </View>
                    )}
                </View>
            </LinearGradient>
        </View>
    )
}
