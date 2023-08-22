const templates = {
  qaTemplate: `Answer the question with information from the given context below. Follow these rules when generating the answer:
- Use markdown for the final answer.
- Imagine you are a customer being interviewed about the business. you should provide as much information relevant to the question without going off-topic.
- The context contains real customer reviews of the product, and your response should be solely based on this context.
- Your main goal is to highlight points of interest from the CONTEXT related to the question asked.
- When providing examples, only use text from the actual reviews given in the CONTEXT; do not make up any information.
- Never include code examples in your response.
- Consider the entire conversation history, but prioritize information from the provided context.
- If the context does not have relevant information, do not fabricate any answers.
- Present the answer using bullet points, lists, paragraphs, and text styling in markdown.
- The CONTEXT is a set of JSON objects, each includes the field "text" where the content is stored.
- Do not mention the CONTEXT or the CONVERSATION LOG in the answer ever; only use them to generate the answer.
- Refer to the business as {business} and the CONTEXT as reviews or feedback.
- Always prefer the result with the highest "score" value in the context.
- Rely solely on the CONTEXT for your response; do not use any external sources or generate the response based on the question alone without clear reference to the context.
- Summarize the CONTEXT to enhance readability without omitting any relevant information.
- Insert paragraph breaks in your response to improve readability.
- Use bold and italic text to highlight important information. wrap the text in double asterisks (**) for bold and single asterisks (*) for italic.

CONVERSATION LOG: {conversationHistory}

CONTEXT: {summaries}

BUSINESS: {business}

QUESTION: {question}

Final Answer:`,

  summarizerTemplate: `Shorten the text in the CONTENT, attempting to answer the INQUIRY You should follow the following rules when generating the summary:
    - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
    - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
    - Summary should include code examples that are relevant to the INQUIRY, based on the content. Do not make up any code examples on your own.
    - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty, AND NO TEXT SHOULD BE RETURNED IN THE FINAL ANSWER AT ALL.
    - If the INQUIRY cannot be answered, the final answer should be empty.
    - The summary should be under 4000 characters.
    - The summary should be 2000 characters long, if possible.

    INQUIRY: {inquiry}
    CONTENT: {document}

    Final answer:
    `,
  summarizerDocumentTemplate: `Summarize the text in the CONTENT. You should follow the following rules when generating the summary:
    - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
    - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
    - Summary should include code examples when possible. Do not make up any code examples on your own.
    - The summary should be under 4000 characters.
    - The summary should be at least 1500 characters long, if possible.

    CONTENT: {document}

    Final answer:
    `,
  inquiryTemplate: `Given the following user prompt and conversation log, formulate a question that would be the most relevant to provide the user with an answer from a knowledge base.
    You MUST follow the following rules when generating and answer:
    - Always prioritize the user prompt over the conversation log.
    - Ignore any conversation log that is not directly related to the user prompt.
    - Only attempt to answer if a question was posed.
    - The question should be a single sentence
    - You should remove any punctuation from the question
    - You should remove any words that are not relevant to the question
    - If you are unable to formulate a question, respond with the same USER PROMPT you got.

    USER PROMPT: {userPrompt}

    CONVERSATION LOG: {conversationHistory}

    Final answer:
    `,
  summerierTemplate: `Summarize the following text. You should follow the following rules when generating and answer:`
}

export { templates }
