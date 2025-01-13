import { useState } from 'react'
import Card from './packages/cards/card'
import CardHeader from './packages/cards/cardHeader'

/**
 * Lol for fun we're gonna say a declension is the type like 1st declension,
 * and declination is the actual specific way a specific noun like 'cyning'
 * declines.
 */

/**
 * `caseGram` as field name, parameter, etc. because `case` is a reserved
 * word in TS.
 */
type Case = 'nominative' | 'accusative' | 'genitive' | 'dative'
type GrammaticalNumber = 'singular' | 'dual' | 'plural'
type GrammaticalGender = 'feminine' | 'neuter' | 'masculine'
type Strength = 'strong' | 'weak'

type GrammaticalNumberInfo<T extends string> = {
    singular: WordSimple<T>
    dual?: WordSimple<T>
    plural: WordSimple<T>
}

type GrammaticalNumberInfoParam = {
    singular: string
    dual?: string
    plural: string
}

class WordSimple<const T extends string> {
    #value: T
    constructor(str: T) {
        if (str.length <= 0 || /\s/.test(str)) {
            throw new Error(`Word "${str}" contains a space or is empty.`)
        }
        this.#value = str
    }

    get value(): T {
        return this.#value
    }

    equals(other: string): boolean {
        return this.#value === other
    }
}

class DeclinationOfNoun<const T extends string> {
    #base: WordSimple<T>
    #strength: Strength
    #gender: GrammaticalGender
    #nominative: GrammaticalNumberInfo<T>
    #genitive: GrammaticalNumberInfo<T>
    #dative: GrammaticalNumberInfo<T>
    #accusative: GrammaticalNumberInfo<T>
    #instrumental?: GrammaticalNumberInfo<T>
    constructor({
        base,
        gender,
        strength,
        nominative,
        genitive,
        dative,
        accusative,
        instrumental,
    }: {
        base: T
        strength: Strength
        gender: GrammaticalGender
        nominative: GrammaticalNumberInfoParam
        genitive: GrammaticalNumberInfoParam
        dative: GrammaticalNumberInfoParam
        accusative: GrammaticalNumberInfoParam
        instrumental?: GrammaticalNumberInfoParam
    }) {
        this.#base = new WordSimple(base)
        this.#strength = strength
        this.#gender = gender
        this.#nominative = ensureWordSimpleNumber(nominative)
        this.#genitive = ensureWordSimpleNumber(genitive)
        this.#dative = ensureWordSimpleNumber(dative)
        this.#accusative = ensureWordSimpleNumber(accusative)
        this.#instrumental = instrumental
            ? ensureWordSimpleNumber(instrumental)
            : undefined

        function ensureWordSimpleNumber(
            numberUnchecked: GrammaticalNumberInfoParam
        ) {
            const numberChecked = {} as GrammaticalNumberInfo<T>
            for (const key in numberUnchecked) {
                const member =
                    numberUnchecked[key as keyof GrammaticalNumberInfoParam]

                if (member) {
                    numberChecked[key as keyof GrammaticalNumberInfo<T>] =
                        new WordSimple(member) as WordSimple<T>
                }
            }
            return numberChecked
        }
    }

    get base() {
        return this.#base
    }
    get strength() {
        return this.#strength
    }
    get gender() {
        return this.#gender
    }
    get nominative() {
        return this.#nominative
    }
    get genitive() {
        return this.#genitive
    }
    get dative() {
        return this.#dative
    }
    get accusative() {
        return this.#accusative
    }
    get instrumental() {
        return this.#instrumental
    }
    get declinationTable() {
        return {
            nominative: this.#nominative,
            genitive: this.#genitive,
            dative: this.#dative,
            accusative: this.#accusative,
            instrumental: this.#instrumental,
        }
    }
}

class NounDeclined<const T extends string> {
    #declinations: DeclinationOfNoun<T>
    #caseGram: Case
    #number: GrammaticalNumber

    constructor({
        declinations,
        caseGram,
        number,
    }: {
        declinations: DeclinationOfNoun<T>
        caseGram: Case
        number: GrammaticalNumber
    }) {
        this.#declinations = declinations
        this.#caseGram = caseGram
        this.#number = number
    }

    get declinations() {
        return this.#declinations
    }
    get caseGram() {
        return this.#caseGram
    }
    get number() {
        return this.#number
    }
}

/**
 * Creates an array of DeclinationOfNoun instances while preserving their exact types
 *
 * Type parameters and constraints:
 * @template {string[]} T - Inferred as tuple of string literals (e.g. ['cyning', 'biscop'])
 *                       - The 'const' modifier preserves literal types instead of widening
 *                       - T is inferred from the base strings of passed DeclinationOfNoun instances
 *
 * Parameter type: { [K in keyof T]: DeclinationOfNoun<T[K]> }
 * - Creates a mapped type transforming string tuple T
 * - Maps each position K in T to a DeclinationOfNoun of that string
 * - e.g. if T is ['cyning', 'biscop'], creates:
 *   [DeclinationOfNoun<'cyning'>, DeclinationOfNoun<'biscop'>]
 *
 * Type inference flow:
 * 1. Pass: [new DeclinationOfNoun({base: 'cyning'}), new DeclinationOfNoun({base: 'biscop'})]
 * 2. TypeScript sees DeclinationOfNoun instances with specific string literals
 * 3. Infers backwards that T must be ['cyning', 'biscop']
 * 4. Preserves exact types without explicit string array creation
 *
 * @param {{ [K in keyof T]: DeclinationOfNoun<T[K]> }} declinations - Array of DeclinationOfNoun instances
 * @returns {{ [K in keyof T]: DeclinationOfNoun<T[K]> }} The same array with preserved literal types
 */
function createDeclinations<const T extends string[]>(declinations: {
    [K in keyof T]: DeclinationOfNoun<T[K]>
}) {
    return declinations
}

class DeclinationDictionary<T extends string> {
    #declinations: Record<T, DeclinationOfNoun<T>>

    constructor(declinationArr: DeclinationOfNoun<T>[]) {
        this.#declinations = {} as Record<T, DeclinationOfNoun<T>>
        for (const d of declinationArr) {
            this.#declinations[d.base.value as T] = d
        }
    }

    get(key: T): DeclinationOfNoun<T> {
        return this.#declinations[key]
    }
}

type Sentence = Array<WordSimple<string> | NounDeclined<string>>

const CaseMessenger = () => {
    const [score, setScore] = useState(0)
    const [currentLevel, setCurrentLevel] = useState(0)

    const declinations = createDeclinations([
        new DeclinationOfNoun({
            base: 'cyning',
            strength: 'strong',
            gender: 'masculine',
            nominative: { singular: 'cyning', plural: 'cyningas' },
            accusative: { singular: 'cyning', plural: 'cyningas' },
            genitive: { singular: 'cyninges', plural: 'cyninga' },
            dative: { singular: 'cyninge', plural: 'cyningum' },
        }),
        new DeclinationOfNoun({
            base: 'biscop',
            strength: 'strong',
            gender: 'masculine',
            nominative: { singular: 'biscop', plural: 'biscopas' },
            accusative: { singular: 'biscop', plural: 'biscopas' },
            genitive: { singular: 'biscopes', plural: 'biscopa' },
            dative: { singular: 'biscope', plural: 'biscopum' },
        }),
    ])

    const declinationDictionary = new DeclinationDictionary(declinations)

    interface Scenario {
        /** Positive integer */
        id: number
        modernTranslation: string
        hint: string
        correctPattern: Array<WordSimple<string> | NounDeclined<string>>
    }

    // Scenarios that teach different cases
    declinationDictionary.get('cyning')
    const scenarios: Scenario[] = [
        {
            id: 1,
            modernTranslation: 'The king greets the bishop',
            hint: 'Who is doing the action? (nominative) Who receives it? (accusative)',
            correctPattern: [
                new WordSimple('se'),
                new NounDeclined({
                    declinations: declinationDictionary.get('cyning'),
                    caseGram: 'nominative',
                    number: 'singular',
                }),
                new WordSimple('grete'),
                new WordSimple('þone'),
                new NounDeclined({
                    declinations: declinationDictionary.get('biscop'),
                    caseGram: 'accusative',
                    number: 'singular',
                }),
            ],
        },
        // {
        //     id: 2,
        //     modernTranslation: "The bishop's thane came from the king",
        //     hint: "Who owns? (genitive) Where from? (dative with 'fram')",
        //     correctPattern: [
        //         {
        //             demonstrative: 'þæs',
        //             word: 'biscop',
        //             case: 'genitive',
        //             number: 'singular',
        //         },
        //         { word: 'þegen', case: 'nominative', number: 'singular' },
        //         { word: 'com', type: 'verb' },
        //         { word: 'fram', type: 'preposition' },
        //         {
        //             demonstrative: 'þæm',
        //             word: 'cyning',
        //             case: 'dative',
        //             number: 'singular',
        //         },
        //     ],
        // },
    ]

    const [selectedWordArr, setSelectedWordInfos] = useState<
        (NounDeclined<string> | WordSimple<string>)[]
    >([])
    const [feedback, setFeedback] = useState('')

    const handleWordSelection = (
        word: NounDeclined<string> | WordSimple<string>
    ) => {
        setSelectedWordInfos([...selectedWordArr, word])
    }

    function isNounDeclined(
        possibleNounDeclined: any
    ): possibleNounDeclined is NounDeclined<string> {
        return possibleNounDeclined instanceof NounDeclined
    }

    const checkAnswer = () => {
        const currentScenario = scenarios[currentLevel]
        const isCorrect = selectedWordArr.every((word, index) => {
            if (
                isNounDeclined(word) &&
                isNounDeclined(currentScenario.correctPattern[index])
            ) {
                word.caseGram ===
                    currentScenario.correctPattern[index].caseGram &&
                    word.number === currentScenario.correctPattern[index].number
            } else if (
                !isNounDeclined(word) &&
                !isNounDeclined(currentScenario.correctPattern[index])
            ) {
                word.value === currentScenario.correctPattern[index].value
            }
        })

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
                        <p>{scenarios[currentLevel].modernTranslation}</p>
                        <p className="text-sm text-gray-600 mt-2">
                            Hint: {scenarios[currentLevel].hint}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 my-4">
                        {scenarios[currentLevel].correctPattern.map((word) => {
                            if (isNounDeclined(word)) {
                                console.log(word.declinations.declinationTable.dative.singular.value)
                                return (
                                    <div
                                        key={word.declinations.declinationTable.dative.singular.value}
                                        className="space-y-2"
                                    >
                                        <h4 className="font-bold">
                                            {word.declinations.base.value}
                                        </h4>
                                        {Object.entries(
                                            word.declinations
                                        ).map(
                                            ([caseGram, numberInfo]) =>
                                                caseGram !== 'base' && (
                                                    <div
                                                        key={caseGram}
                                                        className="space-x-2"
                                                    >
                                                        <button
                                                            onClick={() =>
                                                                handleWordSelection(
                                                                    word
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
                                                        >
                                                            {
                                                                word
                                                                    .declinations[
                                                                    caseGram
                                                                ].singular
                                                            }
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleWordSelection(
                                                                    word
                                                                )
                                                            }
                                                            className="px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
                                                        >
                                                            {/* {forms.plural} */}
                                                        </button>
                                                    </div>
                                                )
                                        )}
                                    </div>
                                )
                            }
                        })}
                    </div>

                    <div className="bg-white p-4 rounded border">
                        <h3 className="font-bold mb-2">Your Sentence:</h3>
                        <div className="flex flex-wrap gap-2">
                            {/* {selectedWordArr.map((word, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    {vocabulary[word.word]?.[word.case]?.[
                                        word.GrammaticalNumber
                                    ] || word.word}
                                </span>
                            ))} */}
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
