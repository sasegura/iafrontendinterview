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
    // For multiple choice questions, we need to determine if the answer is correct
    // Since we don't have the correct answer in the input, we'll generate a mock evaluation
    
    const mockEvaluations = {
      'React': {
        'Junior': {
          correct: {
            evaluation: 'Great job! You demonstrated a solid understanding of React fundamentals.',
            strengths: 'You showed good knowledge of React concepts and hooks.',
            areasForImprovement: 'Continue practicing with more complex React patterns and state management.',
            estimatedLevel: 'Junior' as const,
            nextQuestion: 'Let\'s move on to the next question about React components.',
            points: 10
          },
          incorrect: {
            evaluation: 'Not quite right, but that\'s okay! This is a learning opportunity.',
            strengths: 'You\'re thinking about React concepts, which shows engagement.',
            areasForImprovement: 'Review React fundamentals, especially hooks and component lifecycle.',
            estimatedLevel: 'Junior' as const,
            nextQuestion: 'Let\'s try another question to build your understanding.',
            points: 0
          }
        },
        'Mid': {
          correct: {
            evaluation: 'Excellent! You showed strong intermediate React knowledge.',
            strengths: 'You understand React patterns and can apply them effectively.',
            areasForImprovement: 'Focus on advanced patterns like custom hooks and performance optimization.',
            estimatedLevel: 'Mid' as const,
            nextQuestion: 'Great work! Let\'s continue with more advanced concepts.',
            points: 10
          },
          incorrect: {
            evaluation: 'This was a challenging question. Let\'s break it down.',
            strengths: 'You\'re working through complex React concepts.',
            areasForImprovement: 'Review React patterns, state management, and component architecture.',
            estimatedLevel: 'Junior' as const,
            nextQuestion: 'Let\'s try another question to strengthen your understanding.',
            points: 0
          }
        },
        'Senior': {
          correct: {
            evaluation: 'Outstanding! You demonstrated expert-level React knowledge.',
            strengths: 'You have deep understanding of React internals and best practices.',
            areasForImprovement: 'Consider exploring React ecosystem tools and advanced optimization techniques.',
            estimatedLevel: 'Senior' as const,
            nextQuestion: 'Excellent! Let\'s continue with more senior-level challenges.',
            points: 10
          },
          incorrect: {
            evaluation: 'This was a complex senior-level question. Let\'s analyze it together.',
            strengths: 'You\'re tackling advanced React concepts.',
            areasForImprovement: 'Review React internals, performance optimization, and advanced patterns.',
            estimatedLevel: 'Mid' as const,
            nextQuestion: 'Let\'s try another question to build your senior-level skills.',
            points: 0
          }
        }
      },
      'JavaScript': {
        'Junior': {
          correct: {
            evaluation: 'Perfect! You have a good grasp of JavaScript basics.',
            strengths: 'You understand fundamental JavaScript concepts well.',
            areasForImprovement: 'Continue practicing with arrays, objects, and functions.',
            estimatedLevel: 'Junior' as const,
            nextQuestion: 'Well done! Let\'s move to the next JavaScript question.',
            points: 10
          },
          incorrect: {
            evaluation: 'JavaScript can be tricky! Let\'s learn from this.',
            strengths: 'You\'re engaging with JavaScript concepts.',
            areasForImprovement: 'Review JavaScript fundamentals, especially variables, functions, and scope.',
            estimatedLevel: 'Junior' as const,
            nextQuestion: 'Let\'s try another question to strengthen your JavaScript skills.',
            points: 0
          }
        },
        'Mid': {
          correct: {
            evaluation: 'Excellent! You showed strong intermediate JavaScript skills.',
            strengths: 'You understand JavaScript patterns and can apply them effectively.',
            areasForImprovement: 'Focus on advanced concepts like closures, prototypes, and async programming.',
            estimatedLevel: 'Mid' as const,
            nextQuestion: 'Great work! Let\'s continue with more advanced JavaScript.',
            points: 10
          },
          incorrect: {
            evaluation: 'This was a challenging intermediate question. Let\'s work through it.',
            strengths: 'You\'re tackling complex JavaScript concepts.',
            areasForImprovement: 'Review JavaScript patterns, closures, and asynchronous programming.',
            estimatedLevel: 'Junior' as const,
            nextQuestion: 'Let\'s try another question to build your intermediate skills.',
            points: 0
          }
        },
        'Senior': {
          correct: {
            evaluation: 'Outstanding! You demonstrated expert-level JavaScript knowledge.',
            strengths: 'You have deep understanding of JavaScript internals and advanced patterns.',
            areasForImprovement: 'Consider exploring JavaScript engines and performance optimization.',
            estimatedLevel: 'Senior' as const,
            nextQuestion: 'Excellent! Let\'s continue with more senior-level challenges.',
            points: 10
          },
          incorrect: {
            evaluation: 'This was a complex senior-level question. Let\'s analyze it together.',
            strengths: 'You\'re working through advanced JavaScript concepts.',
            areasForImprovement: 'Review JavaScript internals, performance optimization, and advanced patterns.',
            estimatedLevel: 'Mid' as const,
            nextQuestion: 'Let\'s try another question to build your senior-level skills.',
            points: 0
          }
        }
      }
    };

    // Get the appropriate evaluation based on topic and difficulty
    const topicEvaluations = mockEvaluations[input.topic as keyof typeof mockEvaluations] || mockEvaluations['React'];
    const difficultyEvaluations = topicEvaluations[input.difficultyLevel] || topicEvaluations['Junior'];
    
    // Randomly choose between correct and incorrect for demo purposes
    // In a real app, this would be based on actual answer validation
    const isCorrect = Math.random() > 0.3; // 70% chance of being "correct" for demo
    const mockEvaluation = isCorrect ? difficultyEvaluations.correct : difficultyEvaluations.incorrect;

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
