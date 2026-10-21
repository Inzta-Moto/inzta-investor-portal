import type { SVGProps } from "react";

// Custom 24px, 2px-stroke set from the design system; every icon in the portal sits next to a text label.
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, className = "size-[22px]", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
      {...props}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: IconProps) => <Icon {...p}><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" /></Icon>;
export const SalesIcon = (p: IconProps) => <Icon {...p}><path d="M4 20h16" /><path d="M7 16v-5" /><path d="M12 16V7" /><path d="M17 16v-8" /></Icon>;
export const CommissionIcon = (p: IconProps) => <Icon {...p}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6.5 9.5h.01M17.5 14.5h.01" /></Icon>;
export const ReturnIcon = (p: IconProps) => <Icon {...p}><path d="M9 7H5V3" /><path d="M5.3 7.2A8 8 0 1 1 4 12" /><path d="M12 8v4l2.5 2" /></Icon>;
export const CheckIcon = (p: IconProps) => <Icon {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Icon>;
export const ClockIcon = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Icon>;
export const CalendarIcon = (p: IconProps) => <Icon {...p}><rect x="4" y="5.5" width="16" height="15" rx="2" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></Icon>;
export const AlertIcon = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v5" /><path d="M12 16.2h.01" /></Icon>;
export const DashIcon = (p: IconProps) => <Icon {...p}><path d="M7 12h10" /></Icon>;
export const LogoutIcon = (p: IconProps) => <Icon {...p}><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><path d="M10 16l-4-4 4-4" /><path d="M6 12h10" /></Icon>;
export const InfoIcon = (p: IconProps) => <Icon {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><path d="M12 7.8h.01" /></Icon>;
export const UpIcon = (p: IconProps) => <Icon {...p}><path d="M7 14l5-5 5 5" /></Icon>;
export const DownIcon = (p: IconProps) => <Icon {...p}><path d="M7 10l5 5 5-5" /></Icon>;
export const RightIcon = (p: IconProps) => <Icon {...p}><path d="M10 7l5 5-5 5" /></Icon>;
export const EyeIcon = (p: IconProps) => <Icon {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="2.8" /></Icon>;
export const EyeOffIcon = (p: IconProps) => <Icon {...p}><path d="M3 3l18 18" /><path d="M10.6 5.6A9.9 9.9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.3 6.9C3.9 8.6 2.5 12 2.5 12S6 18.5 12 18.5c1.4 0 2.7-.3 3.8-.9" /><path d="M9.9 10a2.8 2.8 0 0 0 4 4" /></Icon>;
