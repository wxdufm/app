import { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'

const SITE_BASE = 'https://wxdu.org'

type ScheduleCarrier = [
    string[],    // headerRow
    string[],    // hourColumn
    number[][],  // specialtyShowIndices
    string[][],  // showGrid (DJ names)
    string[][]   // idGrid
]

interface ShowBlock {
    show: string | null
    startLabel: string
    endLabel: string
}

export default function TodaySchedule() {
    const [schedule, setSchedule] = useState<ScheduleCarrier | null>(null)
    const [selectedShow, setSelectedShow] = useState<string | null>(null)
    const [today, setToday] = useState('')

    useEffect(() => {
        setToday(new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase())
    }, [])

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch(`${SITE_BASE}/api/schedule`)
                if (!res.ok) throw new Error()
                const data: ScheduleCarrier = await res.json()
                setSchedule(data)
            } catch {
                // silently fail — component returns null below
            }
        }
        fetchSchedule()
    }, [])

    const headerRow = Array.isArray(schedule?.[0]) ? schedule[0] : []
    const hourColumn = Array.isArray(schedule?.[1]) ? schedule[1] : []
    const showGrid = Array.isArray(schedule?.[3]) ? schedule[3] : []

    if (!headerRow.length || !hourColumn.length || !showGrid.length || !today) {
        return null
    }

    const normalizedHeaderRow = headerRow.map((h) => String(h || '').trim().toLowerCase())
    const todayIndex = normalizedHeaderRow.findIndex((h) => h === today)

    if (todayIndex === -1) return null

    const showColIndex = todayIndex - 1

    function parseHourCell(hourCell: string): { startLabel: string; endLabel: string } {
        const value = String(hourCell || '').trim()
        if (!value) return { startLabel: '', endLabel: '' }
        const [startLabel, endLabel] = value.split('–').map((p) => String(p || '').trim())
        if (!endLabel) return { startLabel: value, endLabel: value }
        return { startLabel, endLabel }
    }

    const shows: ShowBlock[] = []
    hourColumn.forEach((hourCell, i) => {
        const show = String(showGrid[i]?.[showColIndex] || '').trim() || null
        const last = shows[shows.length - 1]
        const parsedHour = parseHourCell(hourCell)

        if (show && last && last.show === show) {
            last.endLabel = parsedHour.endLabel
        } else {
            shows.push({ show, startLabel: parsedHour.startLabel, endLabel: parsedHour.endLabel })
        }
    })

    return (
        <View className="w-full">
            <Text className="text-white text-2xl text-center mb-2">Today's Schedule</Text>
            {shows.map(({ startLabel, endLabel, show }, i) =>
                show ? (
                    <View
                        key={`${startLabel}-${endLabel}-${i}`}
                        className="flex-row py-3 gap-4"
                        style={{ borderBottomWidth: 1, borderBottomColor: '#d1d5db' }}
                    >
                        <Text
                            className="w-24 text-right"
                            style={{ color: '#e0ff05' }}
                        >
                            {startLabel === endLabel ? startLabel : `${startLabel} – ${endLabel}`}
                        </Text>
                        <View
                            className="flex-1 pl-4"
                            style={{ borderLeftWidth: 1, borderLeftColor: '#d1d5db' }}
                        >
                            <Pressable
                                onPress={() =>
                                    setSelectedShow((cur) => (cur === show ? null : show))
                                }
                            >
                                <Text
                                    style={{
                                        color: selectedShow === show ? '#000' : '#e0ff05',
                                        backgroundColor: selectedShow === show ? '#fef08a' : 'transparent',
                                        textDecorationLine: 'underline',
                                    }}
                                >
                                    {show}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                ) : null
            )}
        </View>
    )
}
