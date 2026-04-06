import { type OutfitId, type AccessoryId, type RewardPresent } from '../models/types';
import { OUTFITS, ACCESSORIES } from '../models/outfits';
import styles from './Store.module.css';

interface StoreProps {
  coins: number;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  ownedOutfits: OutfitId[];
  ownedAccessories: AccessoryId[];
  rewardPresents: RewardPresent[];
  onBuy: (type: 'outfit' | 'accessory', id: string, price: number) => void;
  onRedeemReward: (reward: RewardPresent) => void;
  onEquipOutfit: (id: OutfitId | null) => void;
  onEquipAccessory: (id: AccessoryId | null) => void;
}

export function Store({
  coins, outfitId, accessoryId, ownedOutfits, ownedAccessories, rewardPresents,
  onBuy, onRedeemReward, onEquipOutfit, onEquipAccessory,
}: StoreProps) {
  return (
    <div className={styles.store}>
      <div className={styles.coinDisplay}>
        {'\u{1FA99}'} {coins} coins
      </div>

      {rewardPresents.length > 0 && (
        <>
          <div className={styles.sectionTitle}>{'\u{1F381}'} Reward Presents</div>
          <div className={styles.grid}>
            {rewardPresents.map(r => {
              const canAfford = coins >= r.price;
              return (
                <div key={r.id} className={styles.card}>
                  <span className={styles.cardEmoji}>{'\u{1F381}'}</span>
                  <span className={styles.cardName}>{r.name}</span>
                  <span className={`${styles.price} ${!canAfford ? styles.cantAfford : ''}`}>
                    {'\u{1FA99}'} {r.price}
                  </span>
                  <button
                    className={styles.redeemBtn}
                    disabled={!canAfford}
                    onClick={() => onRedeemReward(r)}
                  >
                    {'\u{1F381}'} Redeem
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className={styles.sectionTitle}>Outfits</div>
      <div className={styles.grid}>
        <button
          className={`${styles.noneCard} ${outfitId === null ? styles.equipped : ''}`}
          onClick={() => onEquipOutfit(null)}
        >
          <span className={styles.cardEmoji}>{'\u{1F6AB}'}</span>
          <span className={styles.cardName}>None</span>
        </button>
        {OUTFITS.map(o => {
          const owned = ownedOutfits.includes(o.id);
          const isEquipped = outfitId === o.id;
          const canAfford = coins >= o.price;
          return (
            <div key={o.id} className={`${styles.card} ${isEquipped ? styles.equipped : ''}`}>
              <span className={styles.cardEmoji}>{o.emoji}</span>
              <span className={styles.cardName}>{o.name}</span>
              {owned ? (
                isEquipped ? (
                  <button className={styles.unequipBtn} onClick={() => onEquipOutfit(null)}>Remove</button>
                ) : (
                  <button className={styles.equipBtn} onClick={() => onEquipOutfit(o.id)}>Equip</button>
                )
              ) : (
                <>
                  <span className={`${styles.price} ${!canAfford ? styles.cantAfford : ''}`}>
                    {'\u{1FA99}'} {o.price}
                  </span>
                  <button className={styles.buyBtn} disabled={!canAfford} onClick={() => onBuy('outfit', o.id, o.price)}>
                    Buy
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.sectionTitle}>Accessories</div>
      <div className={styles.grid}>
        <button
          className={`${styles.noneCard} ${accessoryId === null ? styles.equipped : ''}`}
          onClick={() => onEquipAccessory(null)}
        >
          <span className={styles.cardEmoji}>{'\u{1F6AB}'}</span>
          <span className={styles.cardName}>None</span>
        </button>
        {ACCESSORIES.map(a => {
          const owned = ownedAccessories.includes(a.id);
          const isEquipped = accessoryId === a.id;
          const canAfford = coins >= a.price;
          return (
            <div key={a.id} className={`${styles.card} ${isEquipped ? styles.equipped : ''}`}>
              <span className={styles.cardEmoji}>{a.emoji}</span>
              <span className={styles.cardName}>{a.name}</span>
              {owned ? (
                isEquipped ? (
                  <button className={styles.unequipBtn} onClick={() => onEquipAccessory(null)}>Remove</button>
                ) : (
                  <button className={styles.equipBtn} onClick={() => onEquipAccessory(a.id)}>Equip</button>
                )
              ) : (
                <>
                  <span className={`${styles.price} ${!canAfford ? styles.cantAfford : ''}`}>
                    {'\u{1FA99}'} {a.price}
                  </span>
                  <button className={styles.buyBtn} disabled={!canAfford} onClick={() => onBuy('accessory', a.id, a.price)}>
                    Buy
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
