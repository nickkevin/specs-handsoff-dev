'use client'

export function ProcessingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Central orb with pulsing ring */}
      <div className="relative w-40 h-40">
        {/* Outer rings */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          fill="none"
          strokeLinecap="round"
        >
          {/* Ring 1 */}
          <circle
            cx="100"
            cy="100"
            r="60"
            stroke="url(#gradient1)"
            strokeWidth="1"
            opacity="0.3"
            className="animate-pulse"
          />
          {/* Ring 2 */}
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="url(#gradient2)"
            strokeWidth="1"
            opacity="0.2"
            className="animate-pulse"
            style={{ animationDelay: '0.3s' }}
          />

          {/* Pulsing ring */}
          <circle
            cx="100"
            cy="100"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
            className="text-accent animate-pulse-ring"
            opacity="0.6"
          />

          {/* Orbiting particles */}
          {[0, 120, 240].map((angle) => (
            <g
              key={angle}
              style={{
                animation: `float-orbit 8s linear infinite`,
                transformOrigin: '100px 100px',
                transform: `rotate(${angle}deg)`,
              }}
            >
              <circle cx="100" cy="40" r="4" fill="currentColor" className="text-accent" />
            </g>
          ))}

          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(190 85% 50%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(300 80% 55%)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(30 80% 55%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(190 85% 50%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-accent shadow-lg shadow-accent/50" />
        </div>
      </div>

      {/* Text with animation */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">
          <span className="inline-block">Analyzing</span>
          <span className="inline-flex gap-1 ml-2">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>
              •
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>
              •
            </span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>
              •
            </span>
          </span>
        </h3>
        <p className="text-muted-foreground text-sm">
          Extracting component specs and design tokens
        </p>
      </div>

      {/* Loading bar */}
      <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            animation: 'shimmer 2s infinite',
            backgroundSize: '1000px 100%',
          }}
        />
      </div>
    </div>
  )
}
