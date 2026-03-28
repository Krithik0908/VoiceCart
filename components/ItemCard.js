import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ItemCard = ({ item, onTogglePurchased, onDelete, theme, getCategoryIcon }) => {
  return (
    <View
      style={[
        styles.card,
        {
          borderColor: item.purchased ? theme.success : theme.border,
          backgroundColor: item.purchased ? theme.purchasedBg : theme.card,
        },
      ]}
    >
      <View style={styles.leftSection}>
        <Text style={styles.icon}>{getCategoryIcon(item.category)}</Text>
        <View style={styles.textWrap}>
          <Text
            style={[
              styles.name,
              {
                color: theme.text,
                textDecorationLine: item.purchased ? 'line-through' : 'none',
              },
            ]}
          >
            {item.quantity > 1 ? `${item.quantity} x ` : ''}
            {item.name}
          </Text>
          <Text style={[styles.meta, { color: theme.muted }]}>
            {item.category} | {new Date(item.createdAt).toLocaleString()}
          </Text>
          <Text style={[styles.status, { color: item.purchased ? theme.success : theme.warning }]}> 
            {item.purchased ? 'Purchased' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          onPress={() => onTogglePurchased(item.id)}
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.actionText}>{item.purchased ? 'Undo' : 'Buy'}</Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete(item.id)}
          style={[styles.actionButton, { backgroundColor: theme.danger }]}
        >
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  leftSection: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: 12,
  },
  status: {
    fontSize: 12,
    fontWeight: '700',
  },
  rightSection: {
    gap: 8,
  },
  actionButton: {
    minWidth: 68,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default ItemCard;
