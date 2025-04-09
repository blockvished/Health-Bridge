import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

interface ProfileCardProps {
  name?: string | null;
  specialization?: string | null; // Corrected prop name
  degree?: string | null;
  image?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
}

export default function ProfileCard({
  name,
  specialization,
  degree,
  image,
  facebook,
  twitter,
  instagram,
  linkedin,
}: ProfileCardProps) {

  const ensureProtocol = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`; // Or http:// depending on your needs
    }
    return url;
  };

  return (
    <div className="w-full max-w-xs bg-white text-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center max-h-[380px]">
      {/* Rounded Image with Shadow */}
      <div className="w-40 h-40 rounded-full shadow-lg mb-6 overflow-hidden">
        <img
          src={image || ""}
          alt={name || ""}
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-2xl font-semibold leading-tight mb-2">{name}</h2>
      <p className="text-gray-600 text-lg mb-1">{specialization}</p>
      <p className="text-gray-500 text-lg mb-4">{degree}</p>

      {/* Social Icons with Extra Spacing */}
      <div className="flex gap-5 mt-3">
        {facebook && (
          <a href={ensureProtocol(facebook)} target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-blue-600 text-3xl" />
          </a>
        )}
        {twitter && (
          <a href={ensureProtocol(twitter)} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-blue-400 text-3xl" />
          </a>
        )}
        {instagram && (
          <a href={ensureProtocol(instagram)} target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-pink-500 text-3xl" />
          </a>
        )}
        {linkedin && (
          <a href={ensureProtocol(linkedin)} target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-blue-700 text-3xl" />
          </a>
        )}
      </div>
    </div>
  );
}
