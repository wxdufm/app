// This component displays the current show and dj playing.

export default function NowPlayingHeader() {
    return(
        <>
            <p className="text-base text-center text-gray-300 tracking-wide">
                Current Show
            </p>
            <h1 className="text-5xl text-center font-light leading-tight"> 
                DJ: [DJ Name]
            </h1>
            <h4 className="text-2xl text-center text-gray-300 mt-1">
                Show: [Show Name]
            </h4>
        </>

    )
}