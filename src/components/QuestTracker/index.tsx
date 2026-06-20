import { useGameStore } from '../../store/gameStore';
import { levelOneQuests } from '../../systems/quests/questData';

export function QuestTracker() {
  const questDone = useGameStore((state) => state.questDone);

  return (
    <div className="quest">
      <div className="quest-title">{levelOneQuests.title}</div>
      {levelOneQuests.items.map((item, index) => {
        const isCompleted = questDone[index];
        return (
          <div
            key={index}
            className={`quest-item ${isCompleted ? 'done' : ''}`}
          >
            {isCompleted ? '✓' : '○'} {item.text}
          </div>
        );
      })}
    </div>
  );
}

export default QuestTracker;
