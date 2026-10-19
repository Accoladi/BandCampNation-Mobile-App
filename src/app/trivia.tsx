import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GameScreen } from '@/components/GameScreen';
import { AppButton, Heading } from '@/components/ui';
import { TRIVIA_QUESTIONS } from '@/features/games/core';
import { colors, displayFont, spacing } from '@/theme';

export default function TriviaScreen() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const question = TRIVIA_QUESTIONS[questionIndex];

  const start = () => {
    setStarted(true);
    setFinished(false);
    setQuestionIndex(0);
    setScore(0);
    setSelected(null);
  };

  const answer = (option: string) => {
    if (selected) return;
    setSelected(option);
    if (option === question.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (questionIndex === TRIVIA_QUESTIONS.length - 1) {
      setFinished(true);
      return;
    }
    setQuestionIndex((value) => value + 1);
    setSelected(null);
  };

  return (
    <GameScreen
      description="Ten quick questions about marching traditions, music, and life on the field."
      eyebrow="Marching band challenge"
      title="Trivia"
    >
      {!started ? (
        <View style={styles.centered}>
          <Text style={styles.emoji}>🎓</Text>
          <Heading level={2} style={styles.sectionTitle}>Ready to test your band knowledge?</Heading>
          <Text style={styles.body}>Choose one answer per question. You will see the right answer before moving on.</Text>
          <AppButton label="Start trivia" onPress={start} />
        </View>
      ) : finished ? (
        <View accessibilityLiveRegion="polite" style={styles.centered}>
          <Text style={styles.emoji}>{score === TRIVIA_QUESTIONS.length ? '🏆' : score >= 7 ? '🎺' : '🥁'}</Text>
          <Heading level={2} style={styles.sectionTitle}>Final score</Heading>
          <Text style={styles.finalScore}>{score} / {TRIVIA_QUESTIONS.length}</Text>
          <Text style={styles.body}>
            {score === TRIVIA_QUESTIONS.length
              ? 'Perfect score. Take a bow!'
              : score >= 7
                ? 'Strong showing. You know your way around the field.'
                : 'Good rehearsal. Play again and build your score.'}
          </Text>
          <AppButton label="Play again" onPress={start} />
        </View>
      ) : (
        <View style={styles.game}>
          <View style={styles.progressCopy}>
            <Text style={styles.progressText}>Question {questionIndex + 1} of {TRIVIA_QUESTIONS.length}</Text>
            <Text style={styles.progressText}>Score {score}</Text>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ max: TRIVIA_QUESTIONS.length, min: 1, now: questionIndex + 1 }}
            style={styles.progressTrack}
          >
            <View style={[styles.progress, { width: `${((questionIndex + 1) / TRIVIA_QUESTIONS.length) * 100}%` }]} />
          </View>
          <Heading level={2} style={styles.question}>{question.question}</Heading>
          <View style={styles.options}>
            {question.options.map((option) => {
              const correct = selected !== null && option === question.answer;
              const wrong = selected === option && option !== question.answer;
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: selected !== null, selected: selected === option }}
                  disabled={selected !== null}
                  key={option}
                  onPress={() => answer(option)}
                  style={({ pressed }) => [
                    styles.option,
                    correct && styles.correct,
                    wrong && styles.wrong,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.optionText, (correct || wrong) && styles.revealedText]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>
          {selected ? (
            <View accessibilityLiveRegion="polite" style={styles.feedback}>
              <Text style={styles.feedbackText}>
                {selected === question.answer ? 'Correct!' : `The answer is ${question.answer}.`}
              </Text>
              <AppButton
                label={questionIndex === TRIVIA_QUESTIONS.length - 1 ? 'See results' : 'Next question'}
                onPress={next}
              />
            </View>
          ) : null}
        </View>
      )}
    </GameScreen>
  );
}

const styles = StyleSheet.create({
  centered: { alignItems: 'center', gap: spacing.md, paddingBottom: spacing.xxl },
  emoji: { fontSize: 44, lineHeight: 52 },
  sectionTitle: {
    color: colors.ink,
    fontFamily: displayFont,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 24, maxWidth: 520, textAlign: 'center' },
  finalScore: { color: colors.red, fontFamily: displayFont, fontSize: 54, fontWeight: '900' },
  game: { gap: spacing.lg, paddingBottom: spacing.xxl },
  progressCopy: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { color: colors.red, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  progressTrack: { backgroundColor: colors.progressTrack, height: 8, overflow: 'hidden' },
  progress: { backgroundColor: colors.blue, height: '100%' },
  question: { color: colors.ink, fontSize: 24, fontWeight: '900', lineHeight: 31 },
  options: { gap: spacing.sm },
  option: {
    backgroundColor: colors.white,
    borderColor: colors.ink,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  optionText: { color: colors.ink, fontSize: 15, fontWeight: '800', lineHeight: 21, textAlign: 'center' },
  correct: { backgroundColor: colors.success, borderColor: colors.success },
  wrong: { backgroundColor: colors.red, borderColor: colors.red },
  revealedText: { color: colors.white },
  feedback: { alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm },
  feedbackText: { color: colors.ink, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  pressed: { opacity: 0.72 },
});
