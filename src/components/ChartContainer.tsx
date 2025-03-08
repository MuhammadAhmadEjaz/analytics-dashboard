import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChartModal from './ChartModal.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { ChartDataItem } from './ChartModal.tsx';

interface ChartContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  ariaLabelledby?: string;
  isLoading?: boolean;
  data?: ChartDataItem[];
  dataKeys?: string[];
  onClick?: () => void;
  expandable?: boolean;
}

/**
 * A container for charts with title, description, and loading state
 * Supports click to open modal with larger view and data table
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  children,
  className = '',
  ariaLabelledby,
  isLoading = false,
  data = [],
  dataKeys = [],
  onClick,
  expandable = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { settings } = useSettings();
  
  const titleId = ariaLabelledby || `chart-title-${title.toLowerCase().replace(/\s+/g, '-')}`;
  const descId = description ? `chart-desc-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined;

  const handleOpenModal = () => {
    if (expandable && data.length > 0) {
      setIsModalOpen(true);
      if (onClick) onClick();
    }
  };

  return (
    <>
      <motion.div
        className={`bg-white dark:bg-dark-bg-secondary rounded-lg shadow-soft-light dark:shadow-soft-dark transition-all duration-300 
                   hover:shadow-md dark:hover:shadow-lg chart-container ${expandable && data.length > 0 ? 'cursor-pointer' : ''} ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={handleOpenModal}
        whileHover={expandable && data.length > 0 ? { scale: 1.01 } : {}}
        whileTap={expandable && data.length > 0 ? { scale: 0.99 } : {}}
      >
        <div className="flex justify-between items-center mb-4 p-4 pb-0">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-sm text-neutral-600 dark:text-dark-text-secondary">
                {description}
              </p>
            )}
          </div>
          
          {expandable && data.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal();
              }}
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary text-neutral-500 dark:text-dark-text-tertiary"
              aria-label={`Expand ${title} chart`}
            >
              <ArrowsPointingOutIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="p-4 pt-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 dark:border-primary-500"></div>
            </div>
          ) : (
            <div className="overflow-hidden">
              {/* Apply the settings to the chart display */}
              <div className={`chart-content ${!settings.showGrid ? 'no-grid' : ''}`}>
                {children}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        data={data}
        dataKeys={dataKeys}
      >
        <div className="h-full">
          {children}
        </div>
      </ChartModal>
    </>
  );
};

export default ChartContainer; 