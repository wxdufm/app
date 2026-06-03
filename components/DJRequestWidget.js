import React, {useState, useEffect, useRef} from 'react'

const COOLDOWN_SECONDS = 60
const COOLDOWN_KEY = 'dj_request_cooldown_until'

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

    useEffect(() => {
        const stored = localStorage.getItem(COOLDOWN_KEY)
        if (stored) {
            const remaining = Math.ceil((parseInt(stored) - Date.now()) / 1000)
            if (remaining > 0) setCooldownRemaining(remaining)
        }
    }, [])
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
            const response = await fetch('/api/dj-request', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(data)
            })

            if(response.ok) {
                setStatus('success')
                const until = Date.now() + COOLDOWN_SECONDS * 1000
                localStorage.setItem(COOLDOWN_KEY, until.toString())
                setCooldownRemaining(COOLDOWN_SECONDS)
            } else {
                setStatus('error')
            }
        } catch(error) {
            setStatus('error')
        } finally {
            setIsLoading(false)
        
        }
            }

    return (
        <>
            {/* Floating button */}
            <button
                className="fixed bottom-6 right-6 z-50 w-36 cursor-pointer bg-red-700 px-4 py-4 text-center text-sm font-bold text-white shadow-xl hover:bg-red-800"
                onClick={() => setIsOpen(true)}
            >
                Send DJ Request
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="w-96 rounded-lg bg-zinc-900 p-6">

                        {/* Header */}
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Send DJ Request</h2>
                            <button className="text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}>
                                ✕
                            </button>
                        </div>

                        {/* Tab buttons — both closed here, BEFORE the forms */}
                        <div className="mb-6 flex gap-2">
                            <button
                                className={activeTab === 'song' ? 'bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'bg-zinc-700 px-4 py-2 text-sm text-gray-300'}
                                onClick={() => setActiveTab('song')}
                            >
                                Song Request
                            </button>
                            <button
                                className={activeTab === 'message' ? 'bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'bg-zinc-700 px-4 py-2 text-sm text-gray-300'}
                                onClick={() => setActiveTab('message')}
                            >
                                Message DJ
                            </button>
                        </div>

                        {/* Forms — lives outside and below the tab buttons */}
                        {activeTab === 'song' ? (
                            <div>
                                <div className="mb-3">
                                    <label className="mb-1 block text-sm text-gray-400">Song Title</label>
                                    <input
                                        type="text"
                                        value={songTitle}
                                        onChange={(e) => setSongTitle(e.target.value)}
                                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Wasted in Athens"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="mb-1 block text-sm text-gray-400">Artist</label>
                                    <input
                                        type="text"
                                        value={songArtist}
                                        onChange={(e) => setSongArtist(e.target.value)}
                                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. The Ocho"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="mb-1 block text-sm text-gray-400">Your Name</label>
                                    <input
                                        type="text"
                                        value={songName}
                                        onChange={(e) => setSongName(e.target.value)}
                                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Ben"
                                    />
                                </div>
                                <button
                                    className={`w-full py-3 font-bold text-white ${cooldownRemaining > 0 ? 'bg-zinc-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
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
                                    <label className="mb-1 block text-sm text-gray-400">Your Name</label>
                                    <input
                                        type="text"
                                        value={messageName}
                                        onChange={(e) => setMessageName(e.target.value)}
                                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        placeholder="e.g. Ben"
                                    />
                                </div>
                                <div className="mb-5">
                                    <label className="mb-1 block text-sm text-gray-400">Message</label>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white"
                                        rows={4}
                                        placeholder="Write your message to the DJ..."
                                    />
                                </div>
                                <button
                                    className={`w-full py-3 font-bold text-white ${cooldownRemaining > 0 ? 'bg-zinc-600 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
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
                                    <p className="mt-3 text-center text-sm text-green-400">
                                        Sent! The DJ will see your request shortly.
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="mt-3 text-center text-sm text-red-400">
                                        Something went wrong. Please try again.
                                    </p>
                                )}
                    </div>
                </div>
            )}
        </>
    )
}
