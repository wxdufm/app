import { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'

export default function IpodWidget() {
  const [songs, setSongs] = useState([]) // songs = [] (empty array)
  const [current, setCurrent] = useState(0) // current = 0 (first song in the list of 5 most recent songs)
  const [loading, setLoading] = useState(true) // loading = true (initially show loading state until we fetch the playlist)

  useEffect(() => {
    const fetchPlaylist = () => {
      fetch('/api/current-playlist')
        .then(r => r.ok ? r.json() : Promise.reject()) // checks if the server responds successfully, then runs r.json() to parse the raw text into a JavaScript array
        .then(data => { setSongs(data); setLoading(false) }) // saves the songs array and clears the loading state
        .catch(() => setLoading(false))
    }

    fetchPlaylist()
    const id = setInterval(fetchPlaylist, 30000) // re-fetch every 30 seconds
    return () => clearInterval(id)
  }, [])

  // auto-advance every 6 seconds
  useEffect(() => {
    if (songs.length <= 1) return
    // timer that goes every 6 seconds; on each tick, update the current song index to the next one (wrap around to 0 at the end)
    const id = setInterval(() => setCurrent(i => (i + 1) % songs.length), 6000) 
    return () => clearInterval(id)
  }, [songs.length])

  const prev = () => setCurrent(i => (i - 1 + songs.length) % songs.length)
  const next = () => setCurrent(i => (i + 1) % songs.length)

  function formatTime(iso) {
    // takes in the ISO string from MySQL, converts it to a Date object, then formats it to just show the time in HH:MM format
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // new song is the updated index of current
  const song = songs[current]

  return (
    <div className="mx-auto w-72 md:w-96">
      <h1 className="bitcount mb-2 text-left text-lg text-white">Recently Played</h1>
      {/* w-72/w-96 controls overall widget size — increase to make bigger (use tailwind scale) */}
      <div className="relative select-none">
      <Image
        // FILLER: REPLACE WITH ACTUAL IMAGE
        src="/ipod-filler4.png"
        alt="iPod"
        // go to preview and check pixel dimensions of image (cmd i)
        width={711}
        height={330}
        className="w-full"
        priority
      />

      {/*
        Screen overlay — sits over the image's screen area on the left of the image.
        Adjust these percentages once final iPod image is ready.
      */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{ top: '10%', left: '5%', width: '47%', height: '78%' }}
      >
        {loading ? (
          <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">
            loading...
          </div>
        ) : !song ? (
          <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">
            no playlist
          </div>
        ) : (
          <div className="flex h-full flex-col justify-between p-2 text-zinc-900">
            <div className="space-y-[3px]">
              <div
                className="font-kallisto text-[11px] font-bold leading-tight text-[#e0ff05]"
                style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
              >
                {song.song}
              </div>
              <div className="font-kallisto overflow-hidden whitespace-nowrap text-[9px] text-white">
                {song.artist}
              </div>
              <div className="font-kallisto overflow-hidden whitespace-nowrap text-[9px] text-white italic">
                {song.album}
              </div>
              <div className="font-kallisto overflow-hidden whitespace-nowrap text-[9px] text-white">
                Label: {song.label}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-[8px] text-zinc-400">Played at {formatTime(song.songstart)}</span>
              <span className="text-[8px] text-zinc-300">{current + 1} / {songs.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Prev button — left of screen */}
      <button
        onClick={prev}
        className="absolute z-10 -translate-y-1/2 transform cursor-pointer"
        style={{ top: '50%', left: '1%' }}
      >
        <IoIosArrowDropleft size={28} />
      </button>

      {/* Next button — right of screen */}
      <button
        onClick={next}
        className="absolute z-10 -translate-y-1/2 transform cursor-pointer"
        style={{ top: '50%', left: '53%' }}
      >
        <IoIosArrowDropright size={28} />
      </button>
    </div>
    </div>
  )
}
