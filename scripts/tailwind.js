tailwind.config = {
    darkMode: 'class',
    theme: {
        container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
        extend: {
            fontFamily: { body: ['Lora', 'serif'], headline: ['Playfair Display', 'serif'] },
            colors: {
                border: "hsl(240 5.9% 90%)",
                input: "hsl(240 5.9% 90%)",
                ring: "hsl(142.1 76.2% 36.3%)",
                background: "hsl(20 14.3% 4.1%)", // Darker theme default
                foreground: "hsl(60 9.1% 97.8%)",
                primary: { DEFAULT: "#D96906", foreground: "hsl(355.7 100% 97.3%)" },
                secondary: { DEFAULT: "hsl(240 3.7% 15.9%)", 
                foreground: "hsl(0 0% 98%)" },
                group: { DEFAULT: "#148038", foreground: "#0A401C" },
                destructive: { DEFAULT: "hsl(0 62.8% 30.6%)", foreground: "hsl(0 0% 98%)" },
                muted: { DEFAULT: "hsl(240 3.7% 15.9%)", foreground: "hsl(240 5% 64.9%)" },
                accent: { DEFAULT: "hsl(12 6.5% 15.1%)", foreground: "hsl(0 0% 98%)" },
                popover: { DEFAULT: "hsl(20 14.3% 4.1%)", foreground: "hsl(60 9.1% 97.8%)" },
                card: { DEFAULT: "hsl(24 9.8% 10%)", foreground: "hsl(60 9.1% 97.8%)" },
            },
            borderRadius: { lg: "0.5rem", md: "calc(0.5rem - 2px)", sm: "calc(0.5rem - 4px)" },
        }
    }
}