import React, {useState, useEffect, useRef} from 'react'
import Image from 'next/image'
import { apiFetch } from '../lib/api'

const COOLDOWN_SECONDS = 60
const COOLDOWN_KEY = 'dj_request_cooldown_until' // localStorage key for persisting cooldown across page refreshes

export default function DJRequestWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('song')
    const [songTitle, setSongTitle] = useState('')
    const [songArtist, setSongArtist] = useState('')
    const [songName, setSongName] = useState('')
    const [messageName, setMessageName] = useState('')
    const [messageText, setMessageText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [cooldownRemaining, setCooldownRemaining] = useState(0)
    const timerRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    // on mount: restore any active cooldown from a previous submission
    useEffect(() => {
        const stored = localStorage.getItem(COOLDOWN_KEY)
        if (stored) {
            const remaining = Math.ceil((parseInt(stored) - Date.now()) / 1000)
            if (remaining > 0) setCooldownRemaining(remaining)
        }
    }, [])

    // tick the countdown timer down every second while a cooldown is active
    useEffect(() => {
        if (cooldownRemaining <= 0) {
            clearInterval(timerRef.current)
            return
        }
        timerRef.current = setInterval(() => {
            setCooldownRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timerRef.current)
    }, [cooldownRemaining > 0])

    const handleSend = async (data) => {
        if (cooldownRemaining > 0) return
        setIsLoading(true)
        setStatus(null)

        try {
            // format the request text the same way the old server-side route did
            const text = data.type === 'song'
                ? `Song Request: ${data.songTitle} by ${data.songArtist}`
                : `Message: ${data.messageText}`
            const user_name = data.type === 'song' ? data.songName : data.messageName

            // POST to the external API — throws on any non-2xx response (including 429)
            await apiFetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify({ text, user_name })
            })

            setStatus('success')
            const until = Date.now() + COOLDOWN_SECONDS * 1000
            localStorage.setItem(COOLDOWN_KEY, until.toString())
            setCooldownRemaining(COOLDOWN_SECONDS)

        } catch(error) {
            // 429 = server-side rate limit hit; anything else is a generic failure
            setStatus(error.status === 429 ? 'ratelimit' : 'error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating button */}
            <button
                className="fixed bottom-6 right-6 z-50 cursor-pointer bg-transparent border-0 p-0"
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img
                    src={isHovered ? '/requestwidget_hover_bg.png' : '/requestwidget_bg.png'}
                    alt="Send DJ Request"
                    style={{
                        width: 130,
                        height: 'auto',
                        display: 'block',
                    }}
                />
            </button>


            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="w-96 rounded-lg bg-zinc-900 p-6">

                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="font-courierprime text-lg font-bold text-white">Send DJ Request</h2>
                            <button className="text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
                                ✕
                            </button>
                        </div>

                        {/* Tab buttons — both closed here, BEFORE the forms */}
                        <div className="mb-6 flex gap-2">
                            <button
                                className={activeTab === 'song' ? 'font-courierprime bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'font-courierprime bg-zinc-700 px-4 py-2 text-sm text-gray-300'}
                                onClick={() => setActiveTab('song')}
                            >
                                Song Request
                            </button>
                            <button
                                className={activeTab === 'message' ? 'font-courierprime bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'font-courierprime bg-zinc-700 px-4 py-2 text-sm text-gray-300'}
                                onClick={() => setActiveTab('message')}
                            >
                                Message DJ
                            </button>
                        </div>

                        {/* Forms — lives outside and below the tab buttons */}
                        {activeTab === 'song' ? (
                            <div>
                                <div className="mb-3">
                                    <label className="font-courierprime mb-1 block text-sm text-gray-400">Song Title</label>
                                    <input
                                        type="text"
                                        value={songTitle}
                                        onChange={(e) => setSongTitle(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Wasted in Athens"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="font-courierprime mb-1 block text-sm text-gray-400">Artist</label>
                                    <input
                                        type="text"
                                        value={songArtist}
                                        onChange={(e) => setSongArtist(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. The Ocho"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="font-courierprime mb-1 block text-sm text-gray-400">Your Name</label>
                                    <input
                                        type="text"
                                        value={songName}
                                        onChange={(e) => setSongName(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Ben"
                                    />
                                </div>
                                <button
                                    className={`font-courierprime w-full py-3 font-bold text-white ${cooldownRemaining > 0 ? 'bg-zinc-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                    onClick={() => handleSend({
                                        type: 'song',
                                        songTitle,
                                        songArtist,
                                        songName
                                    })}
                                    disabled={isLoading || cooldownRemaining > 0}
                                >
                                    {isLoading ? 'Sending...' : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Send Request'}
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className="mb-3">
                                    <label className="font-courierprime mb-1 block text-sm text-gray-400">Your Name</label>
                                    <input
                                        type="text"
                                        value={messageName}
                                        onChange={(e) => setMessageName(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Ben"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="font-courierprime mb-1 block text-sm text-gray-400">Message</label>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        rows={4}
                                        placeholder="Write your message to the DJ..."
                                    />
                                </div>
                                <button
                                    className={`font-courierprime w-full py-3 font-bold text-white ${cooldownRemaining > 0 ? 'bg-zinc-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                    onClick={() => handleSend({
                                        type: 'message',
                                        messageName,
                                        messageText
                                    })}
                                    disabled={isLoading || cooldownRemaining > 0}
                                >
                                    {isLoading ? 'Sending...' : cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Send Message'}
                                </button>
                               
                            </div>
                        )}
                                {status === 'success' && (
                                    <p className="font-courierprime mt-3 text-center text-sm text-green-400">
                                        Sent! The DJ will see your request shortly.
                                    </p>
                                )}
                                {status === 'ratelimit' && (
                                    <p className="font-courierprime mt-3 text-center text-sm text-yellow-400">
                                        Too many requests — wait a moment and try again.
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="font-courierprime mt-3 text-center text-sm text-red-400">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                    </div>
                </div>
            )}
        </>
    )
}
