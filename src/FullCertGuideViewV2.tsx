import React from 'react';
import { FULL_CERT_GUIDE } from './content/fullCertGuide';
import { GuideLayout } from './components/GuideLayout';

const FullCertGuideView = () => {
  return (
    <GuideLayout 
      guide={FULL_CERT_GUIDE} 
      emoji="📜" 
    />
  );
};

export default FullCertGuideView;
