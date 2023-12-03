// audio player via embedding google drive iframes in blog posts
const AudioPlayerEmbed = ({ url }) => {
  return (
    <div className="flex w-full items-center justify-center lg:items-start lg:justify-start">
      <iframe frameBorder="0" width="350" height="150" src={url}></iframe>
    </div>
  );
};

export default AudioPlayerEmbed;
