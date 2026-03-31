import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEditMode } from './EditModeProvider';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function EditableText({ 
  value, 
  onChange, 
  multiline = false, 
  className = '',
  as: Component = 'p'
}: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  if (!isEditMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (multiline) {
    return (
      <Textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`${className} min-h-[100px] bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400`}
      />
    );
  }

  return (
    <Input
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      className={`${className} bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400`}
    />
  );
}
