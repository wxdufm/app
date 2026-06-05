import { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'

export default function IpodWidget() {
  const [songs, setSongs] = useState([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaylist = () => {
      fetch('/api/current-playlist')
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => { setSongs(data); setLoading(false) })
        .catch(() => setLoading(false))
    }
    fetchPlaylist()
    const id = setInterval(fetchPlaylist, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (songs.length <= 1) return
    const id = setInterval(() => setCurrent(i => (i + 1) % songs.length), 6000)
    return () => clearInterval(id)
  }, [songs.length])

  const prev = () => setCurrent(i => (i - 1 + songs.length) % songs.length)
  const next = () => setCurrent(i => (i + 1) % songs.length)

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const song = songs[current]

  return (
    <div className="w-full">
      <h1 className="bitcount mb-2 text-center lg:text-right text-2xl lg:text-5xl text-white whitespace-nowrap">Recently Played</h1>
      <div className="relative select-none">
        <Image
          src="/ipod-filler4.png"
          alt="iPod"
          width={711}
          height={330}
          className="w-full"
          priority
        />

        {/* Screen overlay */}
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
            <div className="flex h-full flex-col justify-between p-2 gap-1 text-zinc-900">

              {/* Top row: album art + song info */}
              <div className="flex flex-row gap-2 min-h-0 flex-1">
                {/* Album art */}
                {song.albumArt && (
                  <div className="flex-shrink-0">
                    <img
                      src={song.albumArt}
                      alt={`${song.album} cover`}
                      className="h-full w-auto max-h-full lg:max-h-64 object-contain"
                    />
                  </div>
                )}

                {/* Song + artist */}
                <div className="flex flex-col justify-center gap-[3px] min-w-0">
                  <div
                    className="font-kallisto text-[11px] lg:text-[20px] font-bold leading-tight text-[#e0ff05]"
                    style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {song.song}
                  </div>
                  <div className="font-kallisto overflow-hidden whitespace-nowrap text-[11px] lg:text-[20px] text-white">
                    {song.artist}
                  </div>
                </div>
              </div>

              {/* Bottom row: play time spanning full width */}
              <div className="flex items-center justify-between">
                <span className="text-[8px] lg:text-[18px] text-zinc-400">Played at {formatTime(song.songstart)}</span>
                <span className="text-[8px] text-zinc-300">{current + 1} / {songs.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Prev button */}
        <button
          onClick={prev}
          className="absolute z-10 -translate-y-1/2 transform cursor-pointer"
          style={{ top: '50%', left: '1%' }}
        >
          <IoIosArrowDropleft size={28} />
        </button>

        {/* Next button */}
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