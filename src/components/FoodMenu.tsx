import { useState } from 'react';
import { FOOD_ITEMS, type FoodItem } from '../models/foods';
import styles from './FoodMenu.module.css';

interface FoodMenuProps {
  onSelect: (food: FoodItem) => void;
  onClose: () => void;
}

export function FoodMenu({ onSelect, onClose }: FoodMenuProps) {
  const [selected, setSelected] = useState(false);

  const handleSelect = (food: FoodItem) => {
    if (selected) return;
    setSelected(true);
    onSelect(food);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <span className={styles.title}>Pick a food!</span>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.grid}>
          {FOOD_ITEMS.map(food => (
            <button
              key={food.id}
              className={`${styles.foodCard} ${selected ? styles.foodCardDisabled : ''}`}
              onClick={() => handleSelect(food)}
              disabled={selected}
            >
              <span className={styles.foodEmoji}>{food.emoji}</span>
              <span className={styles.foodName}>{food.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
