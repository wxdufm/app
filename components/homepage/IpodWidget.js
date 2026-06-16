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

      {/* ── Mobile / iPad layout (hidden on lg+) ── */}
      <div className="lg:hidden">
        <div className="relative select-none">
          <Image src="/ipod.png" alt="iPod" width={891} height={340} className="w-full" priority />

          {/* Previous/next are icon-only, so add labels for screen readers. */}
          <button onClick={prev} aria-label="Show previous song" className="absolute z-10 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer" style={{ top: '50%', left: '0%' }}>
            <IoIosArrowDropleft size={24} />
          </button>
          <button onClick={next} aria-label="Show next song" className="absolute z-10 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer" style={{ top: '50%', left: '61%' }}>
            <IoIosArrowDropright size={24} />
          </button>

          {/* Screen: album art left, text right */}
          <div className="absolute overflow-hidden bg-black" style={{ top: '10%', left: '5%', width: '56%', height: '78%' }}>
            {loading ? (
              <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">loading...</div>
            ) : !song ? (
              <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">no playlist</div>
            ) : (
              <div className="flex h-full flex-row items-stretch">
                {/* Album art: fills full screen height, anchored left */}
                <div className="flex-shrink-0 h-full aspect-square">
                  <img
                    src={song.albumArt || cardinalsFallback.src}
                    alt={`${song.album} cover`}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Text to the right */}
                <div className="flex flex-col justify-between items-center flex-1 h-full min-w-0 overflow-hidden px-1 py-1">
                  <div className="flex-1 flex flex-col items-center justify-center gap-[2px] w-full">
                    <div className="font-kallisto text-[11px] md:text-[18px] font-bold leading-tight text-[#e0ff05] w-full break-words text-center">
                      {song.song}
                    </div>
                    <div className="font-kallisto text-[11px] md:text-[16px] text-white w-full break-words text-center leading-tight">
                      {song.artist}
                    </div>
                  </div>
                  <div className="text-[9px] md:text-[13px] text-zinc-400 text-center w-full pb-1 leading-tight">
                    {formatTime(song.songstart)} · {current + 1}/{songs.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop layout (hidden below lg) ── */}
      <div className="hidden lg:block">
        <div className="relative select-none">
          <Image src="/ipod.png" alt="iPod" width={891} height={340} className="w-full" priority />

          <div className="absolute overflow-hidden bg-black" style={{ top: '10%', left: '5%', width: '56%', height: '78%' }}>
            {loading ? (
              <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">loading...</div>
            ) : !song ? (
              <div className="flex h-full items-center justify-center text-[9px] text-zinc-400">no playlist</div>
            ) : (
              <div className="flex h-full flex-row items-stretch">
                <button onClick={prev} aria-label="Show previous song" className="flex items-center px-1 text-zinc-400 hover:text-white cursor-pointer shrink-0">
                  <IoIosArrowDropleft size={24} />
                </button>
                <div className="flex flex-col flex-1 justify-between py-2 pr-1 gap-1 min-w-0">
                  <div className="flex flex-row gap-2 min-h-0 flex-1 justify-start">
                    <div className="flex-shrink-0 aspect-square w-[16vw] min-w-[115px] max-w-[192px]">
                      <img
                        src={song.albumArt || cardinalsFallback.src}
                        alt={`${song.album} cover`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-[3px] flex-1 min-w-0 overflow-hidden">
                      <div className="font-kallisto text-[20px] font-bold leading-tight text-[#e0ff05] break-words">
                        {song.song}
                      </div>
                      <div className="font-kallisto text-[20px] text-white leading-tight break-words">
                        {song.artist}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] text-zinc-400">Played at {formatTime(song.songstart)}</span>
                    <span className="text-[12px] text-zinc-300">{current + 1} / {songs.length}</span>
                  </div>
                </div>
                <button onClick={next} aria-label="Show next song" className="flex items-center px-1 text-zinc-400 hover:text-white cursor-pointer shrink-0">
                  <IoIosArrowDropright size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
