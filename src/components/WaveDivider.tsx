interface WaveDividerProps {
  position?: "top" | "bottom";
  color?: string;
}

const WaveDivider = ({ position = "top", color = "#fee5d2" }: WaveDividerProps) => {
  const isTop = position === "top";
  
  return (
    <div className={`w-full ${isTop ? "-mb-1" : "-mt-1"}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full ${isTop ? "h-16 md:h-24" : "h-16 md:h-24 rotate-180"}`}
      >
        <path
          d="M0,60 Q150,0 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.3"
        />
        <path
          d="M0,70 Q150,20 300,70 T600,70 T900,70 T1200,70 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,80 Q150,40 300,80 T600,80 T900,80 T1200,80 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
