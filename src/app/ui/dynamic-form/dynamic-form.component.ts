import { Component, input, output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import {
  FormBuilderConfig,
  FormFieldConfig,
  FormFieldType
} from '../../models/form-field.model';

@Component({
  selector: 'tms-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {

  private fb = inject(FormBuilder);

  config = input.required<FormBuilderConfig>();
  formSubmit = output<Record<string, unknown>>();

  form: FormGroup = this.fb.group({});

  buildForm(config: FormBuilderConfig): void {
    const group: Record<string, unknown> = {};

    for (const field of config.fields) {
      const value = field.defaultValue ?? this.getDefaultValue(field.type);
      const validators = [];

      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'number' || field.type === 'text' || field.type === 'email') {
        if (field.min !== undefined) {
          validators.push(Validators.min(field.min));
        }
        if (field.max !== undefined) {
          validators.push(Validators.max(field.max));
        }
      }

      if (field.type === 'email' && field.required) {
        validators.push(Validators.email);
      }

      group[field.key] = [value, validators];
    }

    this.form = this.fb.group(group);
  }

  private getDefaultValue(type: FormFieldType): string | number | boolean {
    switch (type) {
      case 'number':
        return 0;
      case 'checkbox':
        return false;
      case 'date':
        return '';
      default:
        return '';
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();
      this.formSubmit.emit(rawValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  isFieldInvalid(field: FormFieldConfig): boolean {
    const control = this.form.get(field.key);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  getFieldError(field: FormFieldConfig): string {
    const control = this.form.get(field.key);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return `${field.label} is required`;
    }
    if (control.errors['email']) {
      return 'Enter a valid email address';
    }
    if (control.errors['min']) {
      return `${field.label} must be at least ${control.errors['min'].min}`;
    }
    if (control.errors['max']) {
      return `${field.label} must be at most ${control.errors['max'].max}`;
    }

    return 'Invalid value';
  }
}
