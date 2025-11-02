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
          d="M0,0 Q150,90 300,60 T600,40 T900,50 T1200,30 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.3"
        />
        <path
          d="M0,20 Q150,100 300,70 T600,55 T900,65 T1200,45 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,40 Q150,110 300,85 T600,70 T900,80 T1200,60 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;