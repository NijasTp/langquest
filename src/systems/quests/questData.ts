export interface QuestItem {
  text: string;
}

export interface QuestData {
  title: string;
  items: QuestItem[];
}

export const levelOneQuests: QuestData = {
  title: 'Quest · First Conversation',
  items: [
    { text: 'Talk to the villager' },
    { text: 'Answer correctly' },
    { text: 'Reach the gate' },
  ],
};
