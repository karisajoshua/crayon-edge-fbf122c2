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
          d="M0,0 C150,80 350,0 600,50 C850,100 1050,20 1200,80 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.3"
        />
        <path
          d="M0,20 C200,100 400,20 600,70 C800,120 1000,40 1200,100 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,50 C250,120 450,50 600,90 C750,130 950,60 1200,120 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
