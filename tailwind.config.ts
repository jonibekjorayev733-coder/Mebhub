import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
        sans: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ultra: {
          bg: "hsl(240 10% 2%)",
          card: "hsl(240 5% 5%)",
          border: "hsl(240 5% 15%)",
          cyan: "hsl(180 100% 50%)",
          purple: "hsl(270 100% 60%)",
          pink: "hsl(330 100% 60%)",
          amber: "hsl(45 100% 50%)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neon: {
          cyan: "hsl(var(--neon-cyan))",
          magenta: "hsl(var(--neon-magenta))",
          green: "hsl(var(--neon-green))",
          yellow: "hsl(var(--neon-yellow))",
          orange: "hsl(var(--neon-orange))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "2rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "ultra-sm": "0 2px 8px -2px rgba(0,0,0,0.5), 0 1px 4px -1px rgba(255,255,255,0.05)",
        "ultra-md": "0 12px 24px -6px rgba(0,0,0,0.7), 0 4px 12px -2px rgba(255,255,255,0.1)",
        "ultra-lg": "0 32px 64px -12px rgba(0,0,0,0.8), 0 8px 24px -4px rgba(255,255,255,0.15)",
        "neon-cyan": "0 0 20px -5px hsl(180 100% 50% / 0.5)",
        "neon-purple": "0 0 20px -5px hsl(270 100% 60% / 0.5)",
      },
      keyframes: {
        "magnetic-float": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(4px, -8px) rotate(1deg)" },
          "50%": { transform: "translate(-2px, -12px) rotate(-1deg)" },
          "75%": { transform: "translate(-6px, -4px) rotate(0.5deg)" },
        },
        "ether-drift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "glass-shimmer": {
          "0%": { transform: "translateX(-150%) skewX(-20deg)" },
          "100%": { transform: "translateX(150%) skewX(-20deg)" },
        },
        "text-reveal": {
          "0%": { clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)", opacity: "0", transform: "translateY(20px)" },
          "100%": { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
      },
      animation: {
        "magnetic": "magnetic-float 8s ease-in-out infinite",
        "ether": "ether-drift 15s linear infinite",
        "shimmer": "glass-shimmer 3s ease-in-out infinite",
        "reveal": "text-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
