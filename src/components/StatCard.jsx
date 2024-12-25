import React from 'react';

const StatCard = ({ icon, label, value }) => {
  const trunc = String(value).substring(0, 3);
  return (
    <div className="flex flex-col justify-start border-[1px] border-neutral-700 p-6 w-full">
      <div className="flex justify-between mb-4 items-center">
        <div className="text-xl xl:text-3xl mb-2 text-amber-500">{icon}</div>
        <p className="text-2xl xl:text-7xl font-semibold">{trunc}</p>
      </div>
      <p className="font-semibold text-lg">{label}</p>
    </div>
  );
};

export default StatCard;