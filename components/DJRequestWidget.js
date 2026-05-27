import React, {useState} from 'react'

export default function DJRequestWidget() {
    const[isOpen, setIsOpen] = useState(false)
    const[activeTab, setActiveTab] = useState('song')

    return(
        <>
            {/* Floating button*/}
            <button className="fixed bottom-6 right-6 z-50 w-36 cursor-pointer bg-red-700 px-4 py-4 text-center text-sm font-bold text-white shadow-xl hover:bg-red-800" onClick={() => setIsOpen(true)}
            >
                Send DJ Request
            </button>

            {/* Modal - only renders when isOpen = true*/}
            {isOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="w-96 rounded-lg bg-zinc-900 p-6">

                    {/* Header row with title and close button*/}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">Send DJ Request</h2>
                        <button className="text-gray-400 hover:text-white" onClick={() => setIsOpen(false)}
                        >
                            X
                        </button>
                    </div>

                    {/* Tab buttons */}
                    <div className="mb-6 flex gap-2">
                        <button className={activeTab === 'song' ? 'bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'bg-zinc-700 px-4 py-2 text-sm text-gray-300'} onClick={() => setActiveTab('song')}
                        >
                            Song Request
                        </button>
                        <button className={activeTab === 'message' ? 'bg-red-500 px-4 py-2 text-sm font-bold text-white' : 'bg-zinc-700 px-4 py-2 text-sm text-gray-300'} onClick={() => setActiveTab('message')}
                        >
                            Message DJ
                        </button>
                    </div>

                    {/* Forms - Step 3 fills these in */}
                    {activeTab === 'song' ? (<p className="text-gray-400">Song request form goes here (Step 3)</p>
                    ) : (
                        <p className="text-gray-400">Message form goes here (Step 3)</p>)}
                </div>
            </div>)}
        </>
    )
}