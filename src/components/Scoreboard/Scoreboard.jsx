import { motion } from 'framer-motion';
import { TableCard } from './TableCard';

export function Scoreboard({ scores, leadingTable, lastWinner }) {
  return (
    <motion.section
      className="scoreboard-column"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="lucky-header scoreboard-title">SCOREBOARD</h2>
      <div className="scoreboard-cards">
        {[0, 1, 2, 3].map((i) => (
          <TableCard
            key={i}
            tableIndex={i}
            chips={scores[i]}
            isLeading={leadingTable === i}
            isWinner={lastWinner === i}
          />
        ))}
      </div>
    </motion.section>
  );
}
