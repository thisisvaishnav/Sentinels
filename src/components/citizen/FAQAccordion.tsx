import { ENUMERATOR_THEME } from '@/src/features/enumeration/theme';
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={16}
          color={ENUMERATOR_THEME.colors.textMuted}
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
    backgroundColor: ENUMERATOR_THEME.colors.cardBackground,
    borderWidth: 1,
    borderColor: ENUMERATOR_THEME.colors.border,
    borderRadius: 0,
    overflow: "hidden",
  },
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: ENUMERATOR_THEME.colors.border,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    gap: 10,
  },
  question: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: ENUMERATOR_THEME.colors.textPrimary,
  },
  answerWrap: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  answer: {
    fontSize: 13,
    color: ENUMERATOR_THEME.colors.textSecondary,
    lineHeight: 20,
  },
});
