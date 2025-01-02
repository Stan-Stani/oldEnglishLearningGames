import { useState } from 'react'
import Card from './packages/cards/card'
import CardHeader from './packages/cards/cardHeader'

type Case = 'nominative' | 'accusative' | 'genitive' | 'dative'
type GrammaticalNumber = 'singular' | 'dual' | 'plural'

interface WordInfo {
    word: string
    caseGram: Case
    numberGram: GrammaticalNumber
}

const CaseMessenger = () => {
    const [score, setScore] = useState(0)
    const [currentLevel, setCurrentLevel] = useState(0)

    // Core vocabulary with declensions
    const vocabulary = {
        cyning: {
            base: 'cyning',
            nominative: { singular: 'cyning', plural: 'cyningas' },
            accusative: { singular: 'cyning', plural: 'cyningas' },
            genitive: { singular: 'cyninges', plural: 'cyninga' },
            dative: { singular: 'cyninge', plural: 'cyningum' },
        },
        biscop: {
            base: 'biscop',
            nominative: { singular: 'biscop', plural: 'biscopas' },
            accusative: { singular: 'biscop', plural: 'biscopas' },
            genitive: { singular: 'biscopes', plural: 'biscopa' },
            dative: { singular: 'biscope', plural: 'biscopum' },
        },
    }

    // Scenarios that teach different cases
    const scenarios = [
        {
            id: 1,
            setup: 'The king greets the bishop',
            hint: 'Who is doing the action? (nominative) Who receives it? (accusative)',
            correctPattern: [
                {
                    demonstrative: 'se',
                    word: 'cyning',
                    case: 'nominative',
                    number: 'singular',
                },
                { word: 'grete', type: 'verb' },
                {
                    demonstrative: 'þone',
                    word: 'biscop',
                    case: 'accusative',
                    number: 'singular',
                },
            ],
        },
        {
            id: 2,
            setup: "The bishop's thane came from the king",
            hint: "Who owns? (genitive) Where from? (dative with 'fram')",
            correctPattern: [
                {
                    demonstrative: 'þæs',
                    word: 'biscop',
                    case: 'genitive',
                    number: 'singular',
                },
                { word: 'þegen', case: 'nominative', number: 'singular' },
                { word: 'com', type: 'verb' },
                { word: 'fram', type: 'preposition' },
                {
                    demonstrative: 'þæm',
                    word: 'cyning',
                    case: 'dative',
                    number: 'singular',
                },
            ],
        },
    ]

    const [selectedWordInfos, setSelectedWordInfos] = useState<WordInfo[]>([])
    const [feedback, setFeedback] = useState('')

    const handleWordSelection = (
        /** Can't call just `case` because that's a reserved word */
        caseGram: Case,
        word: string,
        numberGram: GrammaticalNumber
    ) => {
        const newWord = {
            word,
            caseGram,
            numberGram,
        }
        setSelectedWordInfos([...selectedWordInfos, newWord])
    }

    const checkAnswer = () => {
        const currentScenario = scenarios[currentLevel]
        const isCorrect = selectedWordInfos.every(
            (word, index) =>
                word.caseGram === currentScenario.correctPattern[index].case &&
                word.GrammaticalNumber ===
                    currentScenario.correctPattern[index].number
        )

        if (isCorrect) {
            setScore(score + 10)
            setFeedback('Correct! The case endings match the sentence meaning.')
            setTimeout(() => {
                setCurrentLevel(currentLevel + 1)
                setSelectedWordInfos([])
                setFeedback('')
            }, 2000)
        } else {
            setFeedback('Try again! Check the case endings carefully.')
            setScore(Math.max(0, score - 5))
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>Old English Case Messenger</CardHeader>

            <div className="mb-6">
                <h2 className="text-xl font-bold">Score: {score}</h2>
                <p className="text-lg mt-2">Level: {currentLevel + 1}</p>
            </div>

            {currentLevel < scenarios.length && (
                <div className="space-y-4">
                    <div className="bg-gray-100 p-4 rounded">
                        <h3 className="font-bold">Scenario:</h3>
                        <p>{scenarios[currentLevel].setup}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Hint: {scenarios[currentLevel].hint}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 my-4">
                        {Object.keys(vocabulary).map((word) => (
                            <div key={word} className="space-y-2">
                                <h4 className="font-bold">{word}</h4>
                                {Object.entries(vocabulary[word]).map(
                                    ([caseType, forms]) =>
                                        caseType !== 'base' && (
                                            <div
                                                key={caseType}
                                                className="space-x-2"
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleWordSelection(
                                                            word,
                                                            caseType,
                                                            'singular'
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
                                                >
                                                    {forms.singular}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleWordSelection(
                                                            word,
                                                            caseType,
                                                            'plural'
                                                        )
                                                    }
                                                    className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
                                                >
                                                    {forms.plural}
                                                </button>
                                            </div>
                                        )
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-4 rounded border">
                        <h3 className="font-bold mb-2">Your Sentence:</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedWordInfos.map((word, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    {vocabulary[word.word]?.[word.case]?.[
                                        word.GrammaticalNumber
                                    ] || word.word}
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={checkAnswer}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Check Answer
                    </button>

                    {feedback && (
                        <div
                            className={`p-4 rounded ${
                                feedback.includes('Correct')
                                    ? 'bg-green-100'
                                    : 'bg-red-100'
                            }`}
                        >
                            {feedback}
                        </div>
                    )}
                </div>
            )}

            {currentLevel >= scenarios.length && (
                <div className="text-center py-8">
                    <h2 className="text-2xl font-bold">Congratulations!</h2>
                    <p>
                        You've completed all scenarios with a score of {score}
                    </p>
                </div>
            )}
        </Card>
    )
}

export default CaseMessenger
