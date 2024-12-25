'use client';
import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css'; // Heatmap default styles
import getCommitFrequency from './getCommitFrequency'; // Import your data fetch function

export default function CommitFrequencyHeatmap() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const commitData = await getCommitFrequency(username, token);
      setData(commitData);
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Commit Frequency Heatmap</h2>
      <CalendarHeatmap
        startDate={
          new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
        endDate={new Date()}
        values={data}
        classForValue={(value) => {
          if (!value) return 'color-empty';
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        tooltipDataAttrs={(value) => {
          return {
            'data-tip': value?.date
              ? `${value.date}: ${value.count} commits`
              : 'No data',
          };
        }}
        showWeekdayLabels
      />
      <style>{`
        .color-scale-1 { fill: #d6e685; }
        .color-scale-2 { fill: #8cc665; }
        .color-scale-3 { fill: #44a340; }
        .color-scale-4 { fill: #1e6823; }
        .color-empty { fill: #ebedf0; }
      `}</style>
    </div>
  );
}
