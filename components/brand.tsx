import { ScanText } from "lucide-react";

export function Brand() {
  return (
    <span className="brand">
      <span className="brand-mark" aria-hidden="true"><ScanText size={22} /></span>
      <span>
        <span className="brand-name">TextoLab</span>
        <span className="brand-school">UNILINS</span>
      </span>
    </span>
  );
}
