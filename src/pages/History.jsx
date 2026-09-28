import React from 'react';
import ApplicationHistory from '../components/ApplicationHistory.jsx';

export default function History({ applications, onDeleteApplication, onClearAll, onLoadApplication }) {
  return (
    <div className="space-y-6">
      <ApplicationHistory
        applications={applications}
        onDeleteApplication={onDeleteApplication}
        onClearAll={onClearAll}
        onLoadApplication={onLoadApplication}
      />
    </div>
  );
}
