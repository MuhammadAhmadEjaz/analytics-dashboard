import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, TableCellsIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Define a generic type for chart data
export interface ChartDataItem {
  [key: string]: string | number | null | undefined;
  name: string;
}

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  data: ChartDataItem[];
  dataKeys: string[];
}

/**
 * A modal component for displaying charts in a larger view with data table
 * @param isOpen - Boolean to control modal visibility
 * @param onClose - Function to close the modal
 * @param title - Chart title
 * @param description - Optional chart description
 * @param children - The chart component to display
 * @param data - Array of data objects used in the chart
 * @param dataKeys - Array of keys from the data objects to display in the table
 */
const ChartModal: React.FC<ChartModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  data,
  dataKeys,
}) => {
  const [viewMode, setViewMode] = React.useState<'chart' | 'table'>('chart');

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby={`modal-title-${title}`} role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-neutral-900 bg-opacity-75 backdrop-blur-sm dark:bg-black dark:bg-opacity-85"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              className="relative transform overflow-hidden rounded-xl bg-white dark:bg-dark-bg-secondary shadow-xl transition-all w-full max-w-5xl sm:my-8"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalVariants}
            >
              {/* Header */}
              <div className="border-b border-neutral-200 dark:border-dark-border-subtle px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 
                    id={`modal-title-${title}`} 
                    className="text-lg font-semibold text-neutral-900 dark:text-dark-text-primary"
                  >
                    {title}
                  </h3>
                  {description && (
                    <p className="text-sm text-neutral-600 dark:text-dark-text-secondary mt-1">
                      {description}
                    </p>
                  )}
                </div>
                
                {/* View mode toggle */}
                <div className="flex items-center space-x-2">
                  <div className="bg-neutral-100 dark:bg-dark-bg-tertiary p-1 rounded-lg flex">
                    <button
                      className={`p-1.5 rounded-md ${viewMode === 'chart' 
                        ? 'bg-white dark:bg-dark-bg-secondary text-primary-700 dark:text-primary-400 shadow-sm' 
                        : 'text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary'}`}
                      onClick={() => setViewMode('chart')}
                      aria-label="View chart"
                      aria-pressed={viewMode === 'chart'}
                    >
                      <ChartBarIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      className={`p-1.5 rounded-md ${viewMode === 'table' 
                        ? 'bg-white dark:bg-dark-bg-secondary text-primary-700 dark:text-primary-400 shadow-sm' 
                        : 'text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary'}`}
                      onClick={() => setViewMode('table')}
                      aria-label="View data table"
                      aria-pressed={viewMode === 'table'}
                    >
                      <TableCellsIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-neutral-500 dark:text-dark-text-tertiary hover:text-neutral-700 dark:hover:text-dark-text-secondary p-2 rounded-md"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                {viewMode === 'chart' ? (
                  <div className="h-96">
                    {children}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-dark-border-subtle">
                      <thead className="bg-neutral-50 dark:bg-dark-bg-tertiary">
                        <tr>
                          {dataKeys.map((key) => (
                            <th 
                              key={key} 
                              scope="col" 
                              className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-dark-text-tertiary uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-dark-bg-secondary divide-y divide-neutral-200 dark:divide-dark-border-subtle">
                        {data.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? undefined : 'bg-neutral-50 dark:bg-dark-bg-tertiary'}>
                            {dataKeys.map((key) => (
                              <td key={`${index}-${key}`} className="px-4 py-3 text-sm text-neutral-700 dark:text-dark-text-secondary whitespace-nowrap">
                                {typeof item[key] === 'number' 
                                  ? Number(item[key]).toLocaleString(undefined, {
                                      maximumFractionDigits: 2,
                                    })
                                  : String(item[key] || '-')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-neutral-50 dark:bg-dark-bg-tertiary border-t border-neutral-200 dark:border-dark-border-subtle px-6 py-4 flex items-center justify-end">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChartModal; 