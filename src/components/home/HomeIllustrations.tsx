import { motion } from 'motion/react';

// Animated SVG for Blood Units
export const BloodDropIllustration = () => (
    <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        initial="initial"
        animate="animate"
    >
        <motion.path
            d="M50 10 C30 40 20 60 20 75 A30 30 0 0 0 80 75 C80 60 70 40 50 10 Z"
            fill="#EC1E24"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
                scale: [0.8, 1, 0.95, 1],
                opacity: 1,
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
            }}
        />
        <motion.path
            d="M40 60 Q45 65 55 60"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    </motion.svg>
);

// Animated SVG for Volunteers
export const VolunteersIllustration = () => (
    <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
    >
        <motion.circle
            cx="50" cy="35" r="15"
            fill="#FF9505"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.path
            d="M20 80 C20 60 30 50 50 50 C70 50 80 60 80 80"
            stroke="#FF9505"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            style={{ transformOrigin: '50px 65px' }}
        />
    </motion.svg>
);

// Animated SVG for Cities
export const MapIllustration = () => (
    <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
    >
        <motion.path
            d="M50 20 C35 20 25 32 25 45 C25 65 50 85 50 85 C50 85 75 65 75 45 C75 32 65 20 50 20 Z"
            fill="#3B82F6"
            animate={{
                scale: [1, 1.1, 1],
                y: [0, -4, 0]
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
        />
        <circle cx="50" cy="45" r="8" fill="white" />
    </motion.svg>
);

// Animated SVG for Campaigns
export const CampaignIllustration = () => (
    <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
    >
        <motion.circle
            cx="50" cy="50" r="30"
            stroke="#10B981"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10 5"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
            d="M35 50 L45 60 L65 40"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        />
    </motion.svg>
);

// Animated SVG for Events
export const EventsIllustration = () => (
    <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
    >
        {/* Calendar Frame */}
        <motion.path
            d="M25 30 H75 V80 H25 Z"
            fill="none"
            stroke="#EC1E24"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <motion.path
            d="M25 45 H75"
            stroke="#EC1E24"
            strokeWidth="4"
            strokeLinecap="round"
        />
        <motion.path
            d="M35 20 V35 M65 20 V35"
            stroke="#EC1E24"
            strokeWidth="4"
            strokeLinecap="round"
        />
        {/* Checkmark or Star for event */}
        <motion.path
            d="M40 60 L48 68 L65 52"
            fill="none"
            stroke="#EC1E24"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
        {/* Decorative dots */}
        <motion.circle cx="35" cy="70" r="2" fill="#EC1E24" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
        <motion.circle cx="65" cy="70" r="2" fill="#EC1E24" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
    </motion.svg>
);

// Modular Illustrations for Focus Areas
export const BloodActivismIcon = () => (
    <div className="w-full h-full flex items-center justify-center bg-red-50 rounded-2xl overflow-hidden p-6 cursor-pointer">
        <motion.svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
            {/* Hand */}
            <path d="M 20 60 C 20 80, 50 90, 50 90 C 50 90, 80 80, 80 60 C 80 50, 70 40, 60 50 C 50 60, 50 60, 50 60 C 50 60, 50 60, 40 50 C 30 40, 20 50, 20 60 Z" fill="none" stroke="#EC1E24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Heart */}
            <motion.path d="M 50 75 C 25 55, 30 35, 40 35 C 47 35, 50 45, 50 45 C 50 45, 53 35, 60 35 C 70 35, 75 55, 50 75 Z" fill="none" stroke="#EC1E24" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ transformOrigin: '50% 55px' }} />
            {/* Blood Drop */}
            <motion.path d="M 50 10 C 50 10, 40 25, 40 30 C 40 37, 50 37, 50 37 C 50 37, 60 37, 60 30 C 60 25, 50 10, 50 10 Z" fill="#EC1E24" animate={{ y: [-15, 5, -15], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.svg>
    </div>
);

export const ThalassemiaIcon = () => (
    <div className="w-full h-full flex items-center justify-center bg-green-50 rounded-2xl overflow-hidden p-6 cursor-pointer">
        <motion.svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
            {/* Shield */}
            <path d="M 50 10 L 15 20 L 15 50 C 15 75, 50 90, 50 90 C 50 90, 85 75, 85 50 L 85 20 Z" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* DNA Strand */}
            <motion.path d="M 35 30 C 65 50, 35 70, 65 90" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M 65 30 C 35 50, 65 70, 35 90" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" animate={{ pathLength: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }} />
            {/* Cross */}
            <motion.path d="M 45 35 L 55 35 M 50 30 L 50 40" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ transformOrigin: '50px 35px' }} />
        </motion.svg>
    </div>
);

export const AwarenessIcon = () => (
    <div className="w-full h-full flex items-center justify-center bg-blue-50 rounded-2xl overflow-hidden p-6 cursor-pointer">
        <motion.svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
            {/* Lightbulb shape */}
            <path d="M 50 25 C 35 25, 25 40, 25 55 C 25 65, 35 75, 40 85 L 60 85 C 65 75, 75 65, 75 55 C 75 40, 65 25, 50 25 Z" fill="none" stroke="#3B82F6" strokeWidth="3" />
            <path d="M 40 92 L 60 92 M 45 97 L 55 97" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
            {/* Glowing rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.line
                    key={i}
                    x1="50" y1="20" x2="50" y2="5"
                    stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"
                    style={{ transformOrigin: '50px 50px', rotate: angle }}
                    animate={{ opacity: [0.1, 1, 0.1], scaleY: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
            ))}
            {/* Heart inside lightbulb */}
            <motion.path d="M 50 70 C 40 60, 42 50, 50 50 C 58 50, 60 60, 50 70 Z" fill="#3B82F6" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ transformOrigin: '50px 60px' }} />
        </motion.svg>
    </div>
);

export const LeadershipIcon = () => (
    <div className="w-full h-full flex items-center justify-center bg-orange-50 rounded-2xl overflow-hidden p-6 cursor-pointer">
        <motion.svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28">
            {/* Arrow */}
            <motion.path d="M 20 80 L 80 20 M 50 20 L 80 20 L 80 50" fill="none" stroke="#FF9505" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Stars */}
            {[
                { x: 30, y: 30, scale: 0.6, delay: 0 },
                { x: 60, y: 50, scale: 0.9, delay: 0.6 },
                { x: 40, y: 70, scale: 0.7, delay: 1.2 }
            ].map((star, i) => (
                <motion.path
                    key={i}
                    d={`M ${star.x} ${star.y - 10} L ${star.x + 3} ${star.y - 3} L ${star.x + 10} ${star.y - 3} L ${star.x + 4} ${star.y + 2} L ${star.x + 6} ${star.y + 9} L ${star.x} ${star.y + 5} L ${star.x - 6} ${star.y + 9} L ${star.x - 4} ${star.y + 2} L ${star.x - 10} ${star.y - 3} L ${star.x - 3} ${star.y - 3} Z`}
                    fill="#FF9505"
                    animate={{ scale: [0, star.scale, 0], rotate: [0, 180] }}
                    transition={{ duration: 3, repeat: Infinity, delay: star.delay }}
                    style={{ transformOrigin: `${star.x}px ${star.y}px` }}
                />
            ))}
            {/* Abstract people connecting */}
            <path d="M 15 90 C 15 75, 25 65, 35 65 C 45 65, 55 75, 55 90" fill="none" stroke="#FF9505" strokeWidth="3" strokeLinecap="round" />
            <motion.circle cx="35" cy="55" r="6" fill="none" stroke="#FF9505" strokeWidth="3" animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} />

            <path d="M 45 90 C 45 80, 55 70, 65 70 C 75 70, 85 80, 85 90" fill="none" stroke="#FF9505" strokeWidth="3" strokeLinecap="round" />
            <motion.circle cx="65" cy="60" r="6" fill="none" stroke="#FF9505" strokeWidth="3" animate={{ y: [0, -5, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.5 }} />
        </motion.svg>
    </div>
);
