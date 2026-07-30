export function getQuestionTypeInstructions(type: string): string {
  switch (type.toLowerCase()) {
    case 'mcq':
      return `\nMCQ (Multiple Choice Questions):
- Provide exactly 4 options.
- Ensure only one correct option.
- Use plausible distractors based on common misconceptions.
`;
    case 'fill_in_the_blank':
      return `\nFill in the Blank:
- Provide clear context in the sentence.
- Ensure there is a single, unambiguous correct answer.
`;
    case 'true_false':
      return `\nTrue/False:
- Use factual statements about core concepts.
- Avoid tricky wording or double negatives.
`;
    case 'match':
      return `\nMatch the following:
- Provide 5 pairs (Column A and Column B).
- Format the 'options' array as a list of strings representing Column A items, and the 'answer' as a corresponding list of strings representing Column B items in the correct order.
`;
    case 'short_answer':
      return `\nShort Answer:
- Questions that require a 2-3 sentence explanation or definition.
- Provide a clear, concise sample answer.
`;
    case 'long_answer':
      return `\nLong Answer:
- Questions requiring paragraph-level answers or detailed explanations.
- The sample answer should clearly outline the key points expected.
`;
    case 'word_problem':
      return `\nWord Problems:
- Real-world scenarios requiring mathematical or scientific reasoning.
- Provide step-by-step solutions in the explanation.
`;
    case 'diagram':
      return `\nDiagram Based:
- Describe clearly what diagram the student should draw or label.
- Provide follow-up questions related to the diagram.
`;
    case 'logical_reasoning':
      return `\nLogical Reasoning:
- Include pattern recognition, sequencing, or deductive reasoning puzzles.
- Suitable for the requested class level.
`;
    default:
      return '';
  }
}
