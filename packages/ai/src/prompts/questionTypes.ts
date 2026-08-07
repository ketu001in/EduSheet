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
- For young learners (e.g. LKG/UKG/pre-primary) who can't read well yet, ALSO include a "matchImages" array,
  the same length and order as "options", giving one real image-generation prompt per Column A item so the
  child matches a small picture instead of reading text (e.g. options: ["Apple","Ball","Cat"], matchImages:
  ["a single red apple, simple, white background, no text","a single red ball, simple, white background, no
  text","a single cute cat, simple, white background, no text"]). Omit "matchImages" entirely for older
  students who can read Column A as plain text.
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
- ALWAYS include a "diagram" field on this question (see schema) with an "imagePrompt" (a real
  image-generation prompt for the actual subject -- a real photo/illustration, not a layout description)
  and "labelPoints" (x/y percentage positions for every named part). This is printed on BOTH the worksheet
  (numbered markers over the image) and the answer key (real labels over the image), so the imagePrompt
  must name the exact real-world subject clearly enough that an image model draws the right thing, whether
  that's a plant, an animal, a body part, a map, a geometric figure, a lab setup, a historical artifact, or
  anything else the question is actually about -- this applies to every subject, not just biology. Isolated
  human body parts need extra explicit detail, see the "diagram" field's schema comment.
`;
    case 'logical_reasoning':
      return `\nLogical Reasoning:
- Include pattern recognition, sequencing, or deductive reasoning puzzles.
- Suitable for the requested class level.
`;
    case 'coloring':
      return `\nColoring Sheet (for young/pre-primary learners):
- The question "text" should be a short instruction, e.g. "Color the picture of the elephant."
- ALWAYS include a "diagram" field with ONLY an "imagePrompt" (omit "labelPoints" entirely -- there is
  nothing to label here, just color). The imagePrompt MUST explicitly ask for a black-and-white line-art
  coloring-book illustration, e.g. "a simple black and white line drawing of an elephant, thick bold
  outlines, no shading, no color, no text, coloring book style for children, white background". Pick a
  single clear, recognizable subject relevant to the topic (an animal, fruit, shape, letter, everyday
  object, etc.) -- never something abstract or hard to render as clean line art.
- "answer" can simply restate what the picture is (e.g. "An elephant") since there's no right/wrong coloring.
`;
    case 'tracing':
      return `\nTracing (for young/pre-primary learners, letters/numbers/short words):
- The question "text" should be a short instruction, e.g. "Trace the letter A." or "Trace the number 5."
- ALWAYS include a "traceContent" field: the exact short text to trace -- a single uppercase letter, a
  single digit, or (for older pre-primary/UKG) a short 3-4 letter word. Keep it to ONE item per question
  (e.g. "A", "7", "cat") -- it will be repeated automatically across the practice line, don't repeat it
  yourself.
- "answer" should just restate traceContent (e.g. "A").
`;
    default:
      return '';
  }
}
