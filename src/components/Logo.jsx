import { BRAND_CONFIG } from '../config/brand';

export default function Logo({ 
  size = "md", 
  showText = true, 
  className = "",
  variant = "default" 
}) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl", 
    lg: "text-3xl",
    xl: "text-4xl"
  };

  const logoSize = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-10 h-10",
    xl: "w-12 h-12"
  };

  const logoIcon = variant === "alt" ? BRAND_CONFIG.logoAlt : BRAND_CONFIG.logo;

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}>
      {variant === "alt" ? (
        <span className="text-red-400">{logoIcon}</span>
      ) : (
        <img src={logoIcon} alt="Logo" className={logoSize[size]} />
      )}
      {showText && (
        <span className="font-semibold tracking-wide">
          {BRAND_CONFIG.displayName}
        </span>
      )}
    </div>
  );
} 