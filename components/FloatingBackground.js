const floatingIcons = ["☕", "🍫"];

const FloatingBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => {
        const icon = floatingIcons[i % floatingIcons.length];
        const left = Math.random() * 100;
        const duration = 10 + Math.random() * 10;
        const delay = Math.random() * 5;

        return (
          <div
            key={i}
            className="absolute text-2xl opacity-10 animate-float"
            style={{
              left: `${left}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingBackground;
