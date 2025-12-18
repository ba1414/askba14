import React from 'react';
import { YR1_GUIDE } from './content/yr1Guide';
import { GuideLayout } from './components/GuideLayout';

const Yr1GuideView = () => {
  return (
    <GuideLayout 
      guide={YR1_GUIDE} 
      emoji="🚀" 
      titleImageBaseName="yr1_title" 
    />
  );
};

export default Yr1GuideView;
