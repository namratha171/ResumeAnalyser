import { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeResume } from './services/resumeAnalyzer';
import { supabase, AnalysisData } from './lib/supabase';

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (content: string, name: string) => {
    setIsAnalyzing(true);
    setError(null);
    setFileName(name);

    try {
      const analysisData = analyzeResume(content);
      setAnalysis(analysisData);

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error: dbError } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            file_name: name,
            file_content: content,
            ats_score: analysisData.scores.overall,
            analysis_data: analysisData,
          });

        if (dbError) {
          console.error('Error saving to database:', dbError);
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setFileName('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <FileText className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              ATS Resume Analyzer
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your resume and receive comprehensive AI analysis. Our system scans for critical elements
            that impact ATS (Applicant Tracking System) compatibility and hiring success.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          </div>
        )}

        {!analysis ? (
          <FileUpload onFileSelect={handleFileSelect} isAnalyzing={isAnalyzing} />
        ) : (
          <div className="space-y-6">
            <AnalysisResults analysis={analysis} fileName={fileName} />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg"
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}

        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What We Analyze
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Content Structure</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Contact information presence</li>
                  <li>• Work experience section</li>
                  <li>• Education details</li>
                  <li>• Skills listing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">ATS Compatibility</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Formatting issues detection</li>
                  <li>• Keyword optimization</li>
                  <li>• Special characters check</li>
                  <li>• Standard section headings</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
