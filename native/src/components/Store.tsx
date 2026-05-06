import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { type OutfitId, type AccessoryId, type HabitatId, type RewardPresent } from '../models/types';
import { OUTFITS, ACCESSORIES } from '../models/outfits';
import { HABITATS } from '../models/habitats';
import { HABITAT_IMAGES } from '../models/habitatImages';

interface StoreProps {
  coins: number;
  outfitId: OutfitId | null;
  accessoryId: AccessoryId | null;
  ownedOutfits: OutfitId[];
  ownedAccessories: AccessoryId[];
  habitatId: HabitatId | null;
  ownedHabitats: HabitatId[];
  rewardPresents: RewardPresent[];
  onBuy: (type: 'outfit' | 'accessory' | 'habitat', id: string, price: number) => void;
  onRedeemReward: (reward: RewardPresent) => void;
  onEquipOutfit: (id: OutfitId | null) => void;
  onEquipAccessory: (id: AccessoryId | null) => void;
  onEquipHabitat: (id: HabitatId | null) => void;
}

export function Store({
  coins, outfitId, accessoryId, ownedOutfits, ownedAccessories, habitatId, ownedHabitats,
  rewardPresents, onBuy, onRedeemReward, onEquipOutfit, onEquipAccessory, onEquipHabitat,
}: StoreProps) {
  return (
    <ScrollView contentContainerStyle={styles.store}>
      <Text style={styles.coinDisplay}>{'\u{1F4B0}'} {coins} coins</Text>

      {rewardPresents.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>{'\u{1F381}'} Reward Presents</Text>
          <View style={styles.grid}>
            {rewardPresents.map(r => {
              const canAfford = coins >= r.price;
              return (
                <View key={r.id} style={styles.card}>
                  <Text style={styles.cardEmoji}>{'\u{1F381}'}</Text>
                  <Text style={styles.cardName}>{r.name}</Text>
                  <Text style={[styles.price, !canAfford && styles.cantAfford]}>
                    {'\u{1F4B0}'} {r.price}
                  </Text>
                  <TouchableOpacity
                    style={[styles.redeemBtn, !canAfford && styles.btnDisabled]}
                    disabled={!canAfford}
                    onPress={() => onRedeemReward(r)}
                  >
                    <Text style={styles.redeemBtnText}>{'\u{1F381}'} Redeem</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionTitle}>Outfits</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.noneCard, outfitId === null && styles.equipped]}
          onPress={() => onEquipOutfit(null)}
        >
          <Text style={styles.cardEmoji}>{'\u{1F6AB}'}</Text>
          <Text style={styles.cardName}>None</Text>
        </TouchableOpacity>
        {OUTFITS.map(o => {
          const owned = ownedOutfits.includes(o.id);
          const isEquipped = outfitId === o.id;
          const canAfford = coins >= o.price;
          return (
            <View key={o.id} style={[styles.card, isEquipped && styles.equipped]}>
              <Text style={styles.cardEmoji}>{o.emoji}</Text>
              <Text style={styles.cardName}>{o.name}</Text>
              {owned ? (
                isEquipped ? (
                  <TouchableOpacity style={styles.unequipBtn} onPress={() => onEquipOutfit(null)}>
                    <Text style={styles.unequipBtnText}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.equipBtn} onPress={() => onEquipOutfit(o.id)}>
                    <Text style={styles.equipBtnText}>Equip</Text>
                  </TouchableOpacity>
                )
              ) : (
                <>
                  <Text style={[styles.price, !canAfford && styles.cantAfford]}>
                    {'\u{1F4B0}'} {o.price}
                  </Text>
                  <TouchableOpacity
                    style={[styles.buyBtn, !canAfford && styles.btnDisabled]}
                    disabled={!canAfford}
                    onPress={() => onBuy('outfit', o.id, o.price)}
                  >
                    <Text style={styles.buyBtnText}>Buy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Accessories</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.noneCard, accessoryId === null && styles.equipped]}
          onPress={() => onEquipAccessory(null)}
        >
          <Text style={styles.cardEmoji}>{'\u{1F6AB}'}</Text>
          <Text style={styles.cardName}>None</Text>
        </TouchableOpacity>
        {ACCESSORIES.map(a => {
          const owned = ownedAccessories.includes(a.id);
          const isEquipped = accessoryId === a.id;
          const canAfford = coins >= a.price;
          return (
            <View key={a.id} style={[styles.card, isEquipped && styles.equipped]}>
              <Text style={styles.cardEmoji}>{a.emoji}</Text>
              <Text style={styles.cardName}>{a.name}</Text>
              {owned ? (
                isEquipped ? (
                  <TouchableOpacity style={styles.unequipBtn} onPress={() => onEquipAccessory(null)}>
                    <Text style={styles.unequipBtnText}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.equipBtn} onPress={() => onEquipAccessory(a.id)}>
                    <Text style={styles.equipBtnText}>Equip</Text>
                  </TouchableOpacity>
                )
              ) : (
                <>
                  <Text style={[styles.price, !canAfford && styles.cantAfford]}>
                    {'\u{1F4B0}'} {a.price}
                  </Text>
                  <TouchableOpacity
                    style={[styles.buyBtn, !canAfford && styles.btnDisabled]}
                    disabled={!canAfford}
                    onPress={() => onBuy('accessory', a.id, a.price)}
                  >
                    <Text style={styles.buyBtnText}>Buy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>{'\u{1F3DE}\u{FE0F}'} Habitats</Text>
      <View style={styles.grid}>
        <TouchableOpacity
          style={[styles.noneCard, habitatId === null && styles.equipped]}
          onPress={() => onEquipHabitat(null)}
        >
          <Text style={styles.cardEmoji}>{'\u{1F6AB}'}</Text>
          <Text style={styles.cardName}>None</Text>
        </TouchableOpacity>
        {HABITATS.map(h => {
          const owned = ownedHabitats.includes(h.id);
          const isEquipped = habitatId === h.id;
          const canAfford = coins >= h.price;
          const imgSource = HABITAT_IMAGES[h.id];
          return (
            <View key={h.id} style={[styles.card, isEquipped && styles.equipped]}>
              {imgSource && (
                <Image source={imgSource} style={styles.habitatCardImage} resizeMode="cover" />
              )}
              <Text style={styles.cardName}>{h.name}</Text>
              {owned ? (
                isEquipped ? (
                  <TouchableOpacity style={styles.unequipBtn} onPress={() => onEquipHabitat(null)}>
                    <Text style={styles.unequipBtnText}>Remove</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.equipBtn} onPress={() => onEquipHabitat(h.id)}>
                    <Text style={styles.equipBtnText}>Equip</Text>
                  </TouchableOpacity>
                )
              ) : (
                <>
                  <Text style={[styles.price, !canAfford && styles.cantAfford]}>
                    {'\u{1F4B0}'} {h.price}
                  </Text>
                  <TouchableOpacity
                    style={[styles.buyBtn, !canAfford && styles.btnDisabled]}
                    disabled={!canAfford}
                    onPress={() => onBuy('habitat', h.id, h.price)}
                  >
                    <Text style={styles.buyBtnText}>Buy</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  store: { gap: 14, paddingBottom: 32 },
  coinDisplay: { fontSize: 20, fontWeight: '700', color: '#f0e68c', textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 10,
    minWidth: 90,
    gap: 6,
  },
  noneCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 10,
    minWidth: 90,
    gap: 6,
  },
  equipped: {
    borderColor: '#f0e68c',
    backgroundColor: 'rgba(240,230,140,0.08)',
  },
  cardEmoji: { fontSize: 28 },
  cardName: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center', fontWeight: '600' },
  price: { fontSize: 12, color: '#f0e68c' },
  cantAfford: { color: 'rgba(255,255,255,0.3)' },
  buyBtn: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#f0e68c',
    borderRadius: 6,
  },
  btnDisabled: { opacity: 0.35 },
  buyBtnText: { fontSize: 12, fontWeight: '700', color: '#1a1a2e' },
  equipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(46,204,113,0.2)',
    borderWidth: 1,
    borderColor: '#2ecc71',
    borderRadius: 6,
  },
  equipBtnText: { fontSize: 12, fontWeight: '600', color: '#2ecc71' },
  unequipBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
  },
  unequipBtnText: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  redeemBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0e68c',
    borderRadius: 8,
  },
  redeemBtnText: { fontSize: 13, fontWeight: '700', color: '#1a1a2e' },
  habitatCardImage: {
    width: 70,
    height: 50,
    borderRadius: 6,
  },
});
