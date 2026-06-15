import Link from 'next/link'
import Image from 'next/image'

// Reusable CD component, which takes an image, label, and link destination as props
const CDLink = ({ image, label, href }) => {
    return (
        // Render a real anchor so keyboard + screen-reader navigation is consistent.
        <Link href={href} legacyBehavior>
            <a className="flex flex-col items-center cursor-pointer group">
                <div className="w-28 h-28 lg:w-64 lg:h-64 relative overflow-hidden">
                    <Image
                        src={image}
                        alt={label}
                        width={256}
                        height={256}
                        // will make the image cover the entire box without stretching so the image doesn't distort
                        style={{ objectFit: 'cover' }}
                        className="group-hover:opacity-80 transition-opacity"
                    />
                </div>
                <p className="kallistobold text-white text-xs mt-1 group-hover:text-red-400 transition-colors">
                    {label}
                </p>
            </a>
        </Link>
    )
}

export default CDLink
