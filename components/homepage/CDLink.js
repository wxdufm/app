import Link from 'next/link'
import Image from 'next/image'

// Reusable CD component, which takes an image, label, and link destination as props
const CDLink = ({ image, label, href }) => {
    return (
        <Link href={href}>
            <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-80 h-80 relative overflow-hidden">
                    <Image 
                        src={image} 
                        alt={label}
                        width={320}
                        height={320}
                        // will make the image cover the entire box without stretching so the image doesn't distort
                        style={{ objectFit: 'cover' }}
                        className="group-hover:opacity-80 transition-opacity"
                    />
                </div>
                <p className="kallistobold text-white text-xl mt-4 group-hover:text-red-400 transition-colors">
                    {label}
                </p>
            </div>
        </Link>
    )
}

export default CDLink