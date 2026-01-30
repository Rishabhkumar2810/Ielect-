import { motion } from "framer-motion";

export default function NeonCard({ children, hover=true, className="" }) {
  return (
    <motion.div whileHover={hover?{ scale: 1.02 }:{}} whileTap={hover?{ scale: .995 }:{}}
      className={`neon-card ${className}`}>
      {children}
    </motion.div>
  );
}
