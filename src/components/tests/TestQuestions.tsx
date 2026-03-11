interface Option {
  key: 'a' | 'b' | 'c' | 'd'
  text: string
}

interface TestQuestionProps {
  index: number
  questionText: string
  options: Option[]
  selectedOption: string | null
  onSelect: (key: string) => void
}

export default function TestQuestion({
  index,
  questionText,
  options,
  selectedOption,
  onSelect,
}: TestQuestionProps) {
  return (
    <div className="space-y-3">
      {/* Question text */}
      <p className="text-sm font-semibold text-gray-800 leading-relaxed">
        <span className="text-gray-400 mr-2">{index}.</span>
        {questionText}
      </p>

      {/* Options */}
      <div className="space-y-2 pl-5">
        {options.map((opt) => {
          const selected = selectedOption === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelect(opt.key)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all duration-150 ${
                selected
                  ? 'border-blue-500 bg-blue-50 text-blue-800 font-medium'
                  : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
              }`}
            >
              {/* Option key circle */}
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                  selected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {opt.key.toUpperCase()}
              </span>
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}