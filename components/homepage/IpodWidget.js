import { useState, useEffect } from 'react'
import Image from 'next/image'
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io'
import cardinalsFallback from '../../images/cardinals.jpg'

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
      <h1 className="bitcount mb-2 text-center lg:text-right text-2xl lg:text-6xl text-white whitespace-nowrap">Recently Played</h1>
      <div className="relative select-none">
        <Image
          src="/ipod.png"
          alt="iPod"
          width={891}
          height={340}
          className="w-full"
          priority
        />

        {/* Screen overlay */}
        <div
          className="absolute overflow-hidden bg-black"
          style={{ top: '10%', left: '5%', width: '56%', height: '78%' }}
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
            <div className="flex h-full flex-row items-stretch">

              {/* Prev button */}
              <button onClick={prev} className="flex items-center px-1 text-zinc-400 hover:text-white cursor-pointer shrink-0">
                <IoIosArrowDropleft size={24} />
              </button>

              {/* Content: album art + song info + time */}
              <div className="flex flex-col flex-1 justify-between py-2 pr-1 gap-1 min-w-0">
                {/* Top row: album art + song info, left-aligned */}
                <div className="flex flex-row gap-2 min-h-0 flex-1 justify-start">
                  <div className="flex-shrink-0 w-32 h-32 lg:w-48 lg:h-48">
                    <img
                      src={song.albumArt || cardinalsFallback.src}
                      alt={`${song.album} cover`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-[3px] min-w-0">
                    <div
                      className="font-kallisto text-[11px] lg:text-[20px] font-bold leading-tight text-[#e0ff05]"
                      style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {song.song}
                    </div>
                    <div className="font-kallisto text-[11px] lg:text-[20px] text-white break-words">
                      {song.artist}
                    </div>
                  </div>
                </div>

                {/* Bottom row: play time, left-aligned */}
                <div className="flex items-center justify-between">
                  <span className="text-[8px] lg:text-[18px] text-zinc-400">Played at {formatTime(song.songstart)}</span>
                  <span className="text-[8px] lg:text-[12px] text-zinc-300">{current + 1} / {songs.length}</span>
                </div>
              </div>

              {/* Next button */}
              <button onClick={next} className="flex items-center px-1 text-zinc-400 hover:text-white cursor-pointer shrink-0">
                <IoIosArrowDropright size={24} />
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}