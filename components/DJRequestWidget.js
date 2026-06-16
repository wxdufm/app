import React, {useState, useEffect, useRef} from 'react'
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
    const triggerButtonRef = useRef(null)
    const modalRef = useRef(null)
    const closeButtonRef = useRef(null)

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

    // Keep keyboard focus inside the modal and support Escape to close.
    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        const triggerElement = triggerButtonRef.current
        document.body.style.overflow = 'hidden'
        closeButtonRef.current?.focus()

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setIsOpen(false)
                return
            }

            if (event.key !== 'Tab' || !modalRef.current) return

            const focusable = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            if (!focusable.length) return

            const first = focusable[0]
            const last = focusable[focusable.length - 1]

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault()
                last.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault()
                first.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = previousOverflow
            triggerElement?.focus()
        }
    }, [isOpen])

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
                ref={triggerButtonRef}
                className="fixed bottom-6 right-6 z-50 cursor-pointer bg-transparent border-0 p-0"
                onClick={() => setIsOpen(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                aria-label="Open DJ request modal"
            >
                <img
                    src={isHovered ? '/requestwidget_hover_bg.png' : '/requestwidget_bg.png'}
                    alt="Send DJ Request"
                    className={
                        isHovered ? "w-[10vw]" : "w-[9.5vw]"
                    }
                    style={{
                        height: 'auto',
                        display: 'block',
                    }}
                />
            </button>


            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    {/* Dialog semantics are required for screen readers. */}
                    <div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dj-request-title"
                        className="w-96 rounded-lg bg-zinc-900 p-6"
                    >

                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 id="dj-request-title" className="font-courierprime text-lg font-bold text-white">Send DJ Request</h2>
                            <button
                                ref={closeButtonRef}
                                className="text-gray-400 hover:text-white"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close DJ request modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tab buttons — both closed here, BEFORE the forms */}
                        <div className="mb-6 flex gap-2" role="tablist" aria-label="DJ request form tabs">
                            <button
                                id="dj-request-song-tab"
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'song'}
                                aria-controls="dj-request-song-panel"
                                className={activeTab === 'song' ? 'font-courierprime bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'font-courierprime bg-zinc-700 px-4 py-2 text-sm text-gray-300'}
                                onClick={() => setActiveTab('song')}
                            >
                                Song Request
                            </button>
                            <button
                                id="dj-request-message-tab"
                                type="button"
                                role="tab"
                                aria-selected={activeTab === 'message'}
                                aria-controls="dj-request-message-panel"
                                className={activeTab === 'message' ? 'font-courierprime bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'font-courierprime bg-zinc-700 px-4 py-2 text-sm text-gray-300'}
                                onClick={() => setActiveTab('message')}
                            >
                                Message DJ
                            </button>
                        </div>

                        {/* Forms — lives outside and below the tab buttons */}
                        {activeTab === 'song' ? (
                            <div
                                id="dj-request-song-panel"
                                role="tabpanel"
                                aria-labelledby="dj-request-song-tab"
                            >
                                <div className="mb-3">
                                    {/* Explicitly pair labels and inputs for screen readers. */}
                                    <label htmlFor="dj-song-title" className="font-courierprime mb-1 block text-sm text-gray-400">Song Title</label>
                                    <input
                                        id="dj-song-title"
                                        type="text"
                                        value={songTitle}
                                        onChange={(e) => setSongTitle(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Wasted in Athens"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dj-song-artist" className="font-courierprime mb-1 block text-sm text-gray-400">Artist</label>
                                    <input
                                        id="dj-song-artist"
                                        type="text"
                                        value={songArtist}
                                        onChange={(e) => setSongArtist(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. The Ocho"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="dj-song-name" className="font-courierprime mb-1 block text-sm text-gray-400">Your Name</label>
                                    <input
                                        id="dj-song-name"
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
                            <div
                                id="dj-request-message-panel"
                                role="tabpanel"
                                aria-labelledby="dj-request-message-tab"
                                hidden={activeTab !== 'message'}
                            >
                                <div className="mb-3">
                                    <label htmlFor="dj-message-name" className="font-courierprime mb-1 block text-sm text-gray-400">Your Name</label>
                                    <input
                                        id="dj-message-name"
                                        type="text"
                                        value={messageName}
                                        onChange={(e) => setMessageName(e.target.value)}
                                        className="font-courierprime w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Ben"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label htmlFor="dj-message-text" className="font-courierprime mb-1 block text-sm text-gray-400">Message</label>
                                    <textarea
                                        id="dj-message-text"
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
                                    <p role="status" aria-live="polite" className="font-courierprime mt-3 text-center text-sm text-green-400">
                                        Sent! The DJ will see your request shortly.
                                    </p>
                                )}
                                {status === 'ratelimit' && (
                                    <p role="status" aria-live="polite" className="font-courierprime mt-3 text-center text-sm text-yellow-400">
                                        Too many requests — wait a moment and try again.
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p role="status" aria-live="polite" className="font-courierprime mt-3 text-center text-sm text-red-400">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                    </div>
                </div>
            )}
        </>
    )
}
