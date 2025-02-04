import { CustomDotProps } from "../../types";

const CustomErrorDot = ({ cx = 0, cy = 0, value = 0 }: CustomDotProps) => {
  if (!value) return null;

  const size = 6;

  return (
    <g>
      <line
        x1={cx - size}
        y1={cy - size}
        x2={cx + size}
        y2={cy + size}
        stroke="#FF4C4C"
        strokeWidth={2}
      />
      <line
        x1={cx - size}
        y1={cy + size}
        x2={cx + size}
        y2={cy - size}
        stroke="#FF4C4C"
        strokeWidth={2}
      />
    </g>
  );
};

export default CustomErrorDot;
