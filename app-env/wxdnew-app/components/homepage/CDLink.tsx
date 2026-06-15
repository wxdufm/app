import { Pressable, Image, Text, ImageSourcePropType } from 'react-native'
import { router } from 'expo-router'

interface CDLinkProps {
    imageSource: ImageSourcePropType
    label: string
    href: string
}

export default function CDLink({ imageSource, label, href }: CDLinkProps) {
    return (
        <Pressable
            onPress={() => router.push(href as any)}
            className="items-center"
        >
            {({ pressed }) => (
                <>
                    <Image
                        source={imageSource}
                        className="w-28 h-28"
                        style={{ opacity: pressed ? 0.8 : 1 }}
                        resizeMode="cover"
                    />
                    <Text
                        className="text-xs mt-1 font-bold"
                        style={{ color: pressed ? '#f87171' : 'white' }}
                    >
                        {label}
                    </Text>
                </>
            )}
        </Pressable>
    )
}
