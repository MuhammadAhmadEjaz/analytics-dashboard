import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext.tsx';

export type FilterOption = {
  id: string;
  label: string;
  type: 'select' | 'date' | 'checkbox' | 'radio';
  options?: { value: string; label: string }[];
  defaultValue?: string | string[] | boolean;
};

interface FilterPanelProps {
  options: FilterOption[];
  onFilterChange: (filters: Record<string, string>) => void;
  title?: string;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  options,
  onFilterChange,
  title = 'Filters',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() => {
    const initialValues: Record<string, string> = {};
    options.forEach(option => {
      initialValues[option.id] = option.defaultValue !== undefined ? String(option.defaultValue) : '';
    });
    return initialValues;
  });

  const handleFilterChange = (id: string, value: string) => {
    setFilterValues(prev => {
      const newValues = { ...prev, [id]: value };
      onFilterChange(newValues);
      return newValues;
    });
  };

  const handleReset = () => {
    const initialValues: Record<string, string> = {};
    options.forEach(option => {
      initialValues[option.id] = option.defaultValue !== undefined ? String(option.defaultValue) : '';
    });
    setFilterValues(initialValues);
    onFilterChange(initialValues);
  };

  return (
    <div className={`bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md dark:shadow-soft-dark p-4 transition-colors duration-300 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-neutral-800 dark:text-dark-text-primary">{title}</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-dark-bg-tertiary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors duration-200"
          aria-expanded={isOpen}
          aria-controls="filter-panel-content"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 text-neutral-700 dark:text-dark-text-secondary" aria-hidden="true" />
          <span className="sr-only">{isOpen ? 'Hide filters' : 'Show filters'}</span>
        </button>
      </div>

      <motion.div
        id="filter-panel-content"
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="mt-4 space-y-4">
          {options.map(option => (
            <div key={option.id} className="space-y-2">
              <label
                htmlFor={option.id}
                className="block text-sm font-medium text-neutral-700 dark:text-dark-text-secondary"
              >
                {option.label}
              </label>

              {option.type === 'select' && option.options && (
                <select
                  id={option.id}
                  value={filterValues[option.id] || ''}
                  onChange={(e) => handleFilterChange(option.id, e.target.value)}
                  className="block w-full rounded-md border-neutral-300 dark:border-dark-border-subtle shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-bg-tertiary text-neutral-800 dark:text-dark-text-primary"
                  aria-label={option.label}
                >
                  <option value="">All</option>
                  {option.options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {option.type === 'date' && (
                <input
                  type="date"
                  id={option.id}
                  value={filterValues[option.id] || ''}
                  onChange={(e) => handleFilterChange(option.id, e.target.value)}
                  className="block w-full rounded-md border-neutral-300 dark:border-dark-border-subtle shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white dark:bg-dark-bg-tertiary text-neutral-800 dark:text-dark-text-primary"
                  aria-label={option.label}
                />
              )}

              {option.type === 'checkbox' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={filterValues[option.id] === 'true'}
                    onChange={(e) => handleFilterChange(option.id, e.target.checked ? 'true' : 'false')}
                    className="h-4 w-4 rounded border-neutral-300 dark:border-dark-border-subtle text-primary-600 focus:ring-primary-500 bg-white dark:bg-dark-bg-tertiary"
                    aria-label={option.label}
                  />
                  <label htmlFor={option.id} className="ml-3 text-sm text-neutral-600 dark:text-dark-text-tertiary">
                    {option.label}
                  </label>
                </div>
              )}

              {option.type === 'radio' && option.options && (
                <div className="space-y-2">
                  {option.options.map(opt => (
                    <div key={opt.value} className="flex items-center">
                      <input
                        type="radio"
                        id={`${option.id}-${opt.value}`}
                        name={option.id}
                        value={opt.value}
                        checked={filterValues[option.id] === opt.value}
                        onChange={() => handleFilterChange(option.id, opt.value)}
                        className="h-4 w-4 border-neutral-300 dark:border-dark-border-subtle text-primary-600 focus:ring-primary-500 bg-white dark:bg-dark-bg-tertiary"
                        aria-label={`${option.label}: ${opt.label}`}
                      />
                      <label
                        htmlFor={`${option.id}-${opt.value}`}
                        className="ml-3 text-sm text-neutral-600 dark:text-dark-text-tertiary"
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-dark-text-secondary bg-neutral-100 dark:bg-dark-bg-tertiary rounded-md hover:bg-neutral-200 dark:hover:bg-dark-bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors duration-200"
              aria-label="Reset all filters"
            >
              Reset
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FilterPanel; 