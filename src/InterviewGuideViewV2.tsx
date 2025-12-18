import React from 'react';
import { INTERVIEW_GUIDE } from './content/interviewGuideNew';
import { GuideLayout } from './components/GuideLayout';

const InterviewGuideView = () => {
  return (
    <GuideLayout 
      guide={INTERVIEW_GUIDE} 
      emoji="🎙️" 
    />
  );
};

export default InterviewGuideView;
