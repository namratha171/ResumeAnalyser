import { AnalysisData } from '../lib/supabase';
import { CheckCircle2, XCircle, AlertTriangle, TrendingUp, FileText, Award } from 'lucide-react';

interface AnalysisResultsProps {
  analysis: AnalysisData;
  fileName: string;
}

export function AnalysisResults({ analysis, fileName }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Analysis Complete</h2>
              <p className="text-sm text-gray-500">{fileName}</p>
            </div>
          </div>
          <div className={`${getScoreBgColor(analysis.scores.overall)} rounded-full px-6 py-3`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.overall)}`}>
                {analysis.scores.overall}
              </div>
              <div className="text-xs text-gray-600">ATS Score</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className={`inline-block px-4 py-2 rounded-full ${getScoreBgColor(analysis.scores.overall)}`}>
            <span className={`font-semibold ${getScoreColor(analysis.scores.overall)}`}>
              {getScoreLabel(analysis.scores.overall)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Formatting</div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.formatting)}`}>
              {analysis.scores.formatting}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Content</div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.content)}`}>
              {analysis.scores.content}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Keywords</div>
            <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.keywords)}`}>
              {analysis.scores.keywords}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Award className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Detected Sections</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(analysis.sections).map(([section, found]) => (
                <div
                  key={section}
                  className={`flex items-center space-x-2 p-3 rounded-lg ${
                    found ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {found ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <span className={`capitalize ${found ? 'text-green-800' : 'text-red-800'}`}>
                    {section}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {analysis.missingElements.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-800">Missing Elements</h3>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysis.missingElements.map((element, index) => (
                    <li key={index} className="text-red-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {analysis.formattingIssues.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-semibold text-gray-800">Formatting Issues</h3>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {analysis.formattingIssues.map((issue, index) => (
                    <li key={index} className="text-yellow-800 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Recommendations</h3>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-3">
                {analysis.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-blue-800 flex items-start">
                    <span className="mr-2 font-bold">{index + 1}.</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Keywords Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Found ({analysis.keywords.found.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.found.slice(0, 10).map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Consider Adding ({analysis.keywords.missing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywords.missing.slice(0, 10).map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
