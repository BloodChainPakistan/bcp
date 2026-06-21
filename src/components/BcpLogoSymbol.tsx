import logoPng from '../assets/logo_bcp.png';

/**
 * BcpLogoSymbol — Uses the official BCP logo PNG image.
 * Usage: <BcpLogoSymbol className="h-10 w-auto" />
 */
export default function BcpLogoSymbol({ className = 'h-10 w-auto' }: { className?: string }) {
    return (
        <img
            src={logoPng}
            alt="Blood Chain Pakistan Logo"
            className={className}
            style={{ objectFit: 'contain' }}
        />
    );
}
