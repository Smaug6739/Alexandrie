import Logger from '../utils/Logger';
type FieldConfig = {
  minLength?: number;
  maxLength?: number;
  type?: 'string' | 'number' | 'boolean';
  optional?: boolean;
  error: string;
};

type ValidationConfig = {
  [key: string]: FieldConfig;
};

export class Validator {
  private config: ValidationConfig;

  constructor(config: ValidationConfig) {
    this.config = config;
  }

  public validate(data: Partial<Record<string, any>>): string | false {
    for (const field in data) {
      if (!data.hasOwnProperty(field)) continue;
      const value = data[field];
      const fieldConfig = this.config[field];
      if (!fieldConfig) continue; // Skip validation for fields not in the config

      if (fieldConfig.optional && !value) {
        continue;
      }

      if (fieldConfig.type && typeof value !== fieldConfig.type) {
        return fieldConfig.error;
      }

      if (fieldConfig.minLength && value.length < fieldConfig.minLength) {
        return fieldConfig.error;
      }

      if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
        return fieldConfig.error;
      }
    }
    Logger.success(`Validation passed for ${Object.keys(data)}`);

    return false;
  }
}

export default Validator;
