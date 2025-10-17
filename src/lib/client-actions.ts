import type { GenerateInterviewQuestionsInput } from '@/ai/flows/generate-interview-questions';
import type { EvaluateUserResponseInput } from '@/ai/flows/evaluate-user-responses';
import type { ProvidePersonalizedRecommendationsInput } from '@/ai/flows/provide-personalized-recommendations';

// Mock implementations for static export
// In a real deployment, these would be replaced with actual API calls to a backend service

export async function getNextQuestion(
  input: GenerateInterviewQuestionsInput
) {
  try {
    // Mock response for static export
    const mockQuestions = {
      'React': {
        'Junior': [
          {
            question: 'What is JSX in React?',
            options: [
              'A JavaScript extension that allows HTML-like syntax',
              'A CSS preprocessor',
              'A state management library',
              'A testing framework'
            ],
            answer: 'A JavaScript extension that allows HTML-like syntax'
          },
          {
            question: 'What is the purpose of the useEffect hook?',
            options: [
              'To manage component state',
              'To perform side effects in functional components',
              'To create custom hooks',
              'To handle form submissions'
            ],
            answer: 'To perform side effects in functional components'
          }
        ],
        'Mid': [
          {
            question: 'What is the difference between controlled and uncontrolled components?',
            options: [
              'Controlled components use refs, uncontrolled use state',
              'Controlled components have their state managed by React, uncontrolled manage their own state',
              'Controlled components are class components, uncontrolled are functional',
              'There is no difference between them'
            ],
            answer: 'Controlled components have their state managed by React, uncontrolled manage their own state'
          }
        ],
        'Senior': [
          {
            question: 'How would you optimize a React application with performance issues?',
            options: [
              'Use React.memo, useMemo, and useCallback',
              'Convert all components to class components',
              'Remove all state management',
              'Use only functional components'
            ],
            answer: 'Use React.memo, useMemo, and useCallback'
          }
        ]
      },
      'JavaScript': {
        'Junior': [
          {
            question: 'What is the difference between let and var?',
            options: [
              'let has block scope, var has function scope',
              'var has block scope, let has function scope',
              'There is no difference',
              'let is only for arrays, var is for objects'
            ],
            answer: 'let has block scope, var has function scope'
          }
        ],
        'Mid': [
          {
            question: 'What is closure in JavaScript?',
            options: [
              'A function that has access to variables in its outer scope',
              'A way to close a function',
              'A method to stop execution',
              'A type of loop'
            ],
            answer: 'A function that has access to variables in its outer scope'
          }
        ],
        'Senior': [
          {
            question: 'What is the event loop in JavaScript?',
            options: [
              'A mechanism that handles asynchronous operations',
              'A type of loop in JavaScript',
              'A way to handle events',
              'A debugging tool'
            ],
            answer: 'A mechanism that handles asynchronous operations'
          }
        ]
      }
    };

    const questions = mockQuestions[input.techStack as keyof typeof mockQuestions]?.[input.difficultyLevel] || [];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    if (!randomQuestion) {
      return { success: false, error: 'No questions available for this tech stack and difficulty level.' };
    }

    return { success: true, data: randomQuestion };
  } catch (error) {
    console.error('Error generating next question:', error);
    return { success: false, error: 'Failed to generate next question.' };
  }
}

export async function evaluateAnswer(
  input: Omit<EvaluateUserResponseInput, 'interviewPrompt'>
) {
  try {
    // Mock evaluation for static export
    const isCorrect = input.userAnswer === input.question; // Simple mock logic
    
    const mockEvaluation = {
      evaluation: isCorrect ? 'Correct!' : 'Incorrect',
      strengths: isCorrect ? ['Good understanding of the concept'] : ['Keep studying this topic'],
      areasForImprovement: isCorrect ? ['Continue practicing advanced concepts'] : ['Review the fundamentals'],
      score: isCorrect ? 1 : 0,
      explanation: isCorrect 
        ? 'You answered correctly! This shows good understanding of the concept.'
        : 'The answer was incorrect. Consider reviewing the material and trying again.'
    };

    return { success: true, data: mockEvaluation };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return { success: false, error: 'Failed to evaluate your answer.' };
  }
}

export async function getRecommendations(
  input: ProvidePersonalizedRecommendationsInput
) {
  try {
    // Mock recommendations for static export
    const mockRecommendations = {
      studyRecommendations: `Based on your ${input.difficultyLevel} level performance in ${input.topic}, here are personalized study recommendations:

📚 **Study Resources:**
• MDN Web Docs - Comprehensive ${input.topic} documentation
• ${input.topic} Official Documentation - Learn core concepts
• JavaScript.info - Modern JavaScript tutorial
• Frontend Masters - Advanced frontend courses

🛠️ **Practice Exercises:**
• Build a todo app with ${input.topic}
• Create a weather app using APIs
• Implement a calculator with vanilla JavaScript
• Build a responsive portfolio website

🎯 **Next Steps:**
• Focus on understanding core concepts
• Practice coding daily
• Build projects to apply knowledge
• Join coding communities for support

💡 **Specific Focus Areas:**
Based on your interview performance, pay special attention to:
• Understanding fundamental concepts
• Practicing problem-solving
• Building real-world projects
• Staying updated with latest trends

Keep practicing and you'll improve your skills! 🚀`
    };

    return { success: true, data: mockRecommendations };
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      success: false,
      error: 'Failed to generate study recommendations.',
    };
  }
}
