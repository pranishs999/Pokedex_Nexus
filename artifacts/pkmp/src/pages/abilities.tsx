import { motion } from 'framer-motion';

export default function Abilities() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Abilities</h1>
      <p className="text-muted-foreground">Browse all Pokémon abilities.</p>
    </motion.div>
  );
}
