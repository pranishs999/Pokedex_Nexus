import { motion } from 'framer-motion';

export default function Teams() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <p className="text-muted-foreground">Build and manage your Pokémon teams.</p>
    </motion.div>
  );
}
