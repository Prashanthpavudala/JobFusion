import React, { useState } from 'react';
import axios from 'axios';

const AnalysisPage = () => {
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for the editable cover letter
  const [coverLetter, setCoverLetter] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please select a resume file!");
      return;
    }
    
    // Reset previous results
    setResult(null);
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', resume);

    try {
      const res = await axios.post('http://localhost:5000/upload-resume', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
      // Set the editable cover letter state
      setCoverLetter(res.data.Cover_Letter || ""); 
    } catch (err) {
      console.error("Error while uploading resume:", err);
      const errorMsg = err.response?.data?.details || "There was an error uploading your resume.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // --- Logic moved from ResultCard ---

  const handleCopy = () => {
    // Copy from the state, not the original result
    navigator.clipboard.writeText(coverLetter); 
    alert("Cover letter copied to clipboard!");
  };

  const handleDownload = () => {
    // Download from the state
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "cover_letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Helper to safely get job roles
  const jobRoles = (result && Array.isArray(result.Job_Roles)) ? result.Job_Roles : [];

  return (
    <>

      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* === UPLOAD SECTION === */}
        <div className="max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload & Analyze</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-1">
                Upload File
              </label>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </div>

        {/* === RESULTS SECTION (Shows only if 'result' is not null) === */}
        {loading && (
          <div className="text-center text-blue-600">
            <p>Analyzing, please wait...</p>
            {/* You could add a spinner here */}
          </div>
        )}

        {result && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* --- LEFT CARD: Analysis & Insights --- */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis & Insights</h3>
              
              {/* ATS Score */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-600 mb-1">ATS Score:</p>
                <div className="flex items-end space-x-2">
                  <p className="text-7xl font-bold text-gray-900">
                    {result.ATS_Score}<span className="text-5xl">%</span>
                  </p>
                  {/* This is a simple visual. You can add a real chart icon */}
                  <div className="flex items-end h-16 space-x-1">
                     <span className="w-4 h-8 bg-gray-300 rounded-t-sm"></span>
                     <span className="w-4 h-12 bg-gray-300 rounded-t-sm"></span>
                     <span className="w-4 h-16 bg-blue-500 rounded-t-sm"></span> 
                  </div>
                </div>
              </div>
              
              {/* Suggested Job Roles */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Suggested Job Roles:</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {jobRoles.length > 0 ? (
                    jobRoles.map((job, i) => (
                      <li key={i}>{job}</li> // Assuming job is a string as in the image
                    ))
                  ) : (
                    <li>No roles suggested.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* --- RIGHT CARD: Editable Cover Letter --- */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Editable Cover Letter</h3>
              
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-96 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Download as .txt
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default AnalysisPage;