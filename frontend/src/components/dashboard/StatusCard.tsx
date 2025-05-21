import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.FC<any>;
  color: string;
  bgColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color, 
  bgColor 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
            
            {change && (
              <p className={`mt-1 text-sm ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {change.isPositive ? '+' : '-'}{Math.abs(change.value)}%
                <span className="text-gray-500 dark:text-gray-400 ml-1">from yesterday</span>
              </p>
            )}
          </div>
          
          <div className={`p-3 rounded-full ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </div>
      
      <div className={`px-5 py-3 ${bgColor} bg-opacity-20`}>
        <div className="text-sm flex justify-between">
          <div className="flex items-center">
            <span className="font-medium text-gray-500 dark:text-gray-400">Status</span>
          </div>
          <div className="flex items-center">
            {title.includes('Online') && <CheckCircle className="h-4 w-4 text-green-500 mr-1" />}
            {title.includes('Offline') && <XCircle className="h-4 w-4 text-red-500 mr-1" />}
            {title.includes('Warning') && <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />}
            {title.includes('Maintenance') && <Clock className="h-4 w-4 text-gray-500 mr-1" />}
            <span className={`
              font-medium
              ${title.includes('Online') ? 'text-green-500' : ''}
              ${title.includes('Offline') ? 'text-red-500' : ''}
              ${title.includes('Warning') ? 'text-amber-500' : ''}
              ${title.includes('Maintenance') ? 'text-gray-500' : ''}
            `}>
              {title.includes('Online') && 'Operational'}
              {title.includes('Offline') && 'Critical'}
              {title.includes('Warning') && 'Attention Required'}
              {title.includes('Maintenance') && 'Scheduled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;