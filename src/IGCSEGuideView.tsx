import React from 'react';
import { IGCSE_GUIDE } from './content/igcseGuideData';
import { GuideLayout } from './components/GuideLayout';

const IGCSEGuideView = () => {
  return (
    <GuideLayout 
      guide={IGCSE_GUIDE} 
      emoji="📖" 
    />
  );
};

export default IGCSEGuideView;
