import { motion } from 'framer-motion';

export default function MoveDetail() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Move Detail</h1>
      <p className="text-muted-foreground">View move details.</p>
    </motion.div>
  );
}
