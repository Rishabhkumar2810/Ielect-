import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function Layout({ children, bare=false }) {
  return (
    <div className="min-h-screen">
      {!bare && <Navbar />}
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: .35 }}
        className={`mx-auto w-full max-w-6xl px-4 ${bare ? 'pt-8' : 'pt-16'}`}
      >
        {children}
      </motion.main>
    </div>
  );
}
