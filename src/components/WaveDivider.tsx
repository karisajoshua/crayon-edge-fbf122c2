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
          d="M0,0 L100,80 L200,20 L300,90 L400,30 L500,70 L600,10 L700,80 L800,40 L900,70 L1000,20 L1100,60 L1200,0 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.3"
        />
        <path
          d="M0,20 L100,90 L200,30 L300,100 L400,50 L500,80 L600,40 L700,90 L800,50 L900,85 L1000,45 L1100,75 L1200,30 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,40 L100,100 L200,50 L300,110 L400,60 L500,95 L600,55 L700,105 L800,65 L900,100 L1000,60 L1100,90 L1200,50 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
