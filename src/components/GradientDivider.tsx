interface GradientDividerProps {
  from?: string;
  to?: string;
  height?: string;
  className?: string;
}

const GradientDivider = ({ 
  from = 'from-transparent', 
  to = 'to-transparent',
  height = 'h-24',
  className = ''
}: GradientDividerProps) => {
  return (
    <div 
      className={`w-full ${height} bg-gradient-to-b ${from} ${to} ${className}`}
      aria-hidden="true"
    />
  );
};

export default GradientDivider;
