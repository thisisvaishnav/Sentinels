import { CITIZEN_THEME } from '@/src/features/enumeration/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const T = CITIZEN_THEME;

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

function FAQEntry({ question, answer }: FAQItem) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.entry}>
      <TouchableOpacity
        style={styles.questionRow}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text style={styles.question}>{question}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={T.colors.textMuted}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.answerWrap}>
          <Text style={styles.answer}>{answer}</Text>
        </View>
      )}
    </View>
  );
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <FAQEntry key={index} question={item.question} answer={item.answer} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: T.colors.cardBackground,
    borderWidth: 1,
    borderColor: T.colors.border,
    borderRadius: T.borderRadius.lg,
    overflow: 'hidden',
  },
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: T.colors.border,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    gap: 10,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: T.colors.textPrimary,
  },
  answerWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  answer: {
    fontSize: 13,
    color: T.colors.textSecondary,
    lineHeight: 20,
  },
});
