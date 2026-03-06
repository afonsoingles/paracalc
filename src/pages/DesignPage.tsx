import React from 'react';
import { InputPanel } from '../components/InputPanel';
import { Charts } from '../components/Charts';
import { Language, useTranslation } from '../i18n';

interface DesignPageProps {
  language: Language;
}

export const DesignPage: React.FC<DesignPageProps> = ({ language }) => {
  const t = useTranslation(language);

  return (
    <div className="container">
      <InputPanel language={language} />
      <Charts />
    </div>
  );
};
