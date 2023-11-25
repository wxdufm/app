const AudioPlayerEmbed = ({url}) => {
    return(
        <iframe
          frameBorder="0"
          width="350"
          height="150"
          src={url}>
            
        </iframe>
    );
}

export default AudioPlayerEmbed;