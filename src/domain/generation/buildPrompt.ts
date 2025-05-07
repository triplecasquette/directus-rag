type PromptContext = {
  text: string
  source: string
  section?: string
}

export const buildPrompt = (question: string, contexts: PromptContext[]): string => {
  if (!contexts || contexts.length === 0) {
    return "I did not find any relevant information on this subject.";
  }

  const contextText = contexts
    .map(
      ({ text, source, section }) =>
        `Source: ${source}${section ? ', section: ' + section : ''}\n${text}`
    )
    .join('\n\n')

  return [
    `You are a technical assistant specialized in Directus.`,
    `Use only the documentation below to answer.`,
    `You must rely strictly on this documentation, and do not hallucinate.`,
    `Structure your answer with Markdown headings and subheadings for each important section.`,
    `Use bullet or numbered lists for steps or key points, blockquotes for notes or warnings, and Markdown code blocks for any code examples.`,
    `Your answer must be complete, precise, well-structured, and easy to read.`,
    `Avoid generic statements and focus on real implementation details.`,
    `Do not reference the sources in your answer.`,
    `Avoid generic statements and focus on real implementation details.`,
    ``,
    `Documentation:\n${contextText}`,
    ``,
    `Question: ${question}`,
    `Answer:`
  ].join('\n')
}


