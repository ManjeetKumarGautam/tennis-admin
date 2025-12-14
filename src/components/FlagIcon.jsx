export default function FlagIcon({ code, className = "w-6 h-4" }) {
    if (!code) return null;
    // Using flagcdn for simulated flags
    return (
        <img
            src={`https://flagcdn.com/${code}.svg`}
            alt={code}
            className={`inline-block object-cover rounded-sm shadow-sm ${className}`}
        />
    );
}