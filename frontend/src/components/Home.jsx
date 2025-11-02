import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <>
  
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-16 pb-12"> 

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to JobFusion
          </h1>
          <p className="text-lg text-gray-700 max-w-lg mx-auto mb-8">
            Your all-in-one platform for resume analysis, job recommendations, and recruiter automation.
          </p>
          
          <Link
            to="/auth"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
};

export default HomePage;