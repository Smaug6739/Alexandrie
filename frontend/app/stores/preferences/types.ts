type OptionType = 'toggle' | 'select' | 'color' | 'radio' | 'groupCheckbox' | 'anode' | 'textarea' | 'number';
interface BaseOption<K extends PreferenceKey = PreferenceKey> {
  label: string;
  description?: string;
  type: OptionType;
  key: K;
  onChange?: (value: Preferences[K]) => void;
}
interface ToggleOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'toggle';
}

interface ColorOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'color';
  items: Array<{ label: string; id: string | number }>;
  onChange?: (value: Preferences[K]) => void;
}
interface SelectOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'select';
  choices: ANode[];
  onChange?: (value: Preferences[K]) => void;
}
interface RadioOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'radio';
  choices: Array<{ id: number | string; label: string }>;
  onChange?: (value: Preferences[K]) => void;
}

interface GroupCheckboxOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'groupCheckbox';
  items: Record<string, string>;
  onChange?: (value: Preferences[K]) => void;
}

interface AnodeOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'anode';
  onChange?: (value: Preferences[K]) => void;
}

interface TextareaOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'textarea';
  placeholder?: string;
  rows?: number;
  language?: string;
  onChange?: (value: Preferences[K]) => void;
}

interface NumberOption<K extends PreferenceKey = PreferenceKey> extends BaseOption<K> {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: Preferences[K]) => void;
}

export type Option = ToggleOption | ColorOption | SelectOption | RadioOption | GroupCheckboxOption | AnodeOption | TextareaOption | NumberOption;

export type { ColorOption, SelectOption, RadioOption, ToggleOption, GroupCheckboxOption, AnodeOption, TextareaOption, NumberOption };
