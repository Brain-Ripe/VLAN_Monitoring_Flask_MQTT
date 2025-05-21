import React from 'react';
import { trafficData } from '../../utils/mockData';

const TrafficTrend: React.FC = () => {
  // Get max value from all datasets for scaling
  const allValues = trafficData.datasets.flatMap(dataset => dataset.data);
  const maxValue = Math.max(...allValues);
  
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex mb-1">
          {trafficData.datasets.map((dataset, i) => (
            <div key={i} className="flex items-center mr-4">
              <div 
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: dataset.borderColor }}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{dataset.label}</span>
            </div>
          ))}
        </div>
        
        <div className="h-64 flex items-end">
          <div className="w-10 h-full flex flex-col justify-between pr-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="text-xs text-gray-500 text-right">
                {Math.round(maxValue * (5 - i) / 5)}
              </div>
            ))}
          </div>
          
          <div className="flex-1 h-full">
            <div className="h-full w-full flex">
              {trafficData.labels.map((label, labelIndex) => (
                <div key={labelIndex} className="flex-1 h-full flex flex-col justify-end relative group">
                  {/* Vertical grid line */}
                  <div className="absolute inset-0 w-full h-full border-r border-gray-100 dark:border-gray-700">
                    {/* Horizontal grid lines */}
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full border-t border-gray-100 dark:border-gray-700"
                        style={{ bottom: `${(i + 1) * 20}%` }}
                      ></div>
                    ))}
                  </div>
                  
                  {/* Data points */}
                  {trafficData.datasets.map((dataset, datasetIndex) => {
                    const value = dataset.data[labelIndex];
                    const height = (value / maxValue) * 100;
                    
                    return (
                      <div 
                        key={datasetIndex}
                        className="absolute transition-all duration-300 ease-in-out w-1 rounded-t-sm hover:opacity-80"
                        style={{ 
                          height: `${height}%`, 
                          backgroundColor: dataset.borderColor,
                          left: `${(datasetIndex + 1) * 20}%`,
                          bottom: 0,
                          transform: 'translateX(-50%)'
                        }}
                      ></div>
                    );
                  })}
                  
                  {/* Label */}
                  <div className="text-xs text-center text-gray-500 mt-2 absolute -bottom-6 w-full">
                    {label}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white dark:bg-gray-800 shadow-lg rounded p-2 z-10 w-40">
                    <p className="text-xs font-medium text-gray-800 dark:text-white mb-1">{label}</p>
                    {trafficData.datasets.map((dataset, i) => (
                      <div key={i} className="flex justify-between items-center text-xs mb-1">
                        <div className="flex items-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: dataset.borderColor }}
                          ></div>
                          <span className="truncate">{dataset.label}</span>
                        </div>
                        <span className="font-medium">{dataset.data[labelIndex]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrafficTrend;