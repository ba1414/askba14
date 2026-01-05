import React from 'react';
import { OFFER_GUIDE } from './content/offerGuide';
import { GuideLayout } from './components/GuideLayout';

const OfferGuideView = () => {
  return (
    <GuideLayout 
      guide={OFFER_GUIDE} 
      emoji="🎉" 
    />
  );
};

export default OfferGuideView;
