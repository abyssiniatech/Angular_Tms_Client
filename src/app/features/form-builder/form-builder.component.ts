import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DynamicFormComponent } from '../../ui/dynamic-form/dynamic-form.component';

import {
  FormBuilderConfig,
  FormFieldConfig,
  FormFieldType,
  SelectOption
} from '../../models/form-field.model';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicFormComponent
  ],
  templateUrl: './form-builder.component.html',
  styleUrl: './form-builder.component.scss'
})
export class FormBuilderComponent {

  // ============================================================
  // FORM SETTINGS
  // ============================================================

  title = signal('Course Feedback Form');

  description = signal(
    'Share your thoughts about the course'
  );

  submitLabel = signal('Submit Feedback');


  // ============================================================
  // FORM FIELDS
  // ============================================================

  fields = signal<FormFieldConfig[]>([
    {
      key: 'studentName',
      label: 'Student Name',
      type: 'text',
      placeholder: 'Enter your full name',
      required: true
    },

    {
      key: 'rating',
      label: 'Course Rating',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Excellent',
          value: 'excellent'
        },
        {
          label: 'Good',
          value: 'good'
        },
        {
          label: 'Average',
          value: 'average'
        },
        {
          label: 'Poor',
          value: 'poor'
        }
      ]
    },

    {
      key: 'comments',
      label: 'Additional Comments',
      type: 'textarea',
      placeholder: 'Tell us more...',
      required: false,
      rows: 4
    }
  ]);


  // ============================================================
  // SELECTED FIELD
  // ============================================================

  selectedFieldKey = signal<string | null>(null);


  // ============================================================
  // AVAILABLE FIELD TYPES
  // ============================================================

  readonly fieldTypes: FormFieldType[] = [
    'text',
    'number',
    'email',
    'date',
    'textarea',
    'select',
    'checkbox'
  ];


  // ============================================================
  // COMPUTED SELECTED FIELD
  // ============================================================

  selectedField = computed(() => {

    const key = this.selectedFieldKey();

    if (!key) {
      return null;
    }

    return this.fields().find(
      field => field.key === key
    ) ?? null;
  });


  // ============================================================
  // COMPLETE FORM CONFIGURATION
  // ============================================================

  config = computed<FormBuilderConfig>(() => ({
    title: this.title(),
    description: this.description(),
    submitLabel: this.submitLabel(),
    fields: this.fields()
  }));


  // ============================================================
  // ADD FIELD
  // ============================================================

  addField(type: FormFieldType): void {

    const key = `field_${Date.now()}`;

    const newField: FormFieldConfig = {
      key,
      label: 'New Field',
      type,
      required: false,

      ...(type === 'textarea'
        ? { rows: 4 }
        : {}),

      ...(type === 'select'
        ? {
            options: [
              {
                label: 'Option 1',
                value: '1'
              }
            ]
          }
        : {})
    };

    this.fields.update(list => [
      ...list,
      newField
    ]);

    this.selectedFieldKey.set(key);
  }


  // ============================================================
  // REMOVE FIELD
  // ============================================================

  removeField(key: string): void {

    this.fields.update(list =>
      list.filter(field => field.key !== key)
    );

    if (this.selectedFieldKey() === key) {
      this.selectedFieldKey.set(null);
    }
  }


  // ============================================================
  // SELECT FIELD
  // ============================================================

  selectField(key: string): void {
    this.selectedFieldKey.set(key);
  }


  // ============================================================
  // UPDATE FIELD
  // ============================================================

  updateField(
    key: string,
    changes: Partial<FormFieldConfig>
  ): void {

    this.fields.update(list =>
      list.map(field =>
        field.key === key
          ? {
              ...field,
              ...changes
            }
          : field
      )
    );
  }


  // ============================================================
  // CHANGE FIELD TYPE
  // ============================================================

  onTypeChange(
    fieldKey: string,
    value: string
  ): void {

    const type = value as FormFieldType;

    const field = this.fields().find(
      item => item.key === fieldKey
    );

    if (!field) {
      return;
    }

    const changes: Partial<FormFieldConfig> = {
      type
    };

    // Add default textarea rows
    if (type === 'textarea' && field.rows === undefined) {
      changes.rows = 4;
    }

    // Add default select options
    if (type === 'select' && !field.options) {
      changes.options = [
        {
          label: 'Option 1',
          value: '1'
        }
      ];
    }

    // Remove options when changing away from select
    if (type !== 'select') {
      changes.options = undefined;
    }

    // Remove rows when changing away from textarea
    if (type !== 'textarea') {
      changes.rows = undefined;
    }

    this.updateField(fieldKey, changes);
  }


  // ============================================================
  // NUMBER HELPERS
  // ============================================================

  parseNumber(value: string): number {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }


  parseOptionalNumber(
    value: string
  ): number | undefined {

    const trimmed = value.trim();

    if (trimmed === '') {
      return undefined;
    }

    const number = Number(trimmed);

    return Number.isFinite(number)
      ? number
      : undefined;
  }


  // ============================================================
  // UPDATE FIELD KEY
  // ============================================================

  updateFieldKey(
    oldKey: string,
    newKey: string
  ): void {

    const trimmedKey = newKey.trim();

    if (!trimmedKey) {
      return;
    }

    // Prevent duplicate keys
    const duplicate = this.fields().some(
      field =>
        field.key !== oldKey &&
        field.key === trimmedKey
    );

    if (duplicate) {
      return;
    }

    this.updateField(oldKey, {
      key: trimmedKey
    });

    // Keep selected field selected
    if (this.selectedFieldKey() === oldKey) {
      this.selectedFieldKey.set(trimmedKey);
    }
  }


  // ============================================================
  // ADD SELECT OPTION
  // ============================================================

  addOption(): void {

    const field = this.selectedField();

    if (
      !field ||
      field.type !== 'select'
    ) {
      return;
    }

    const options = field.options ?? [];

    const newOption: SelectOption = {
      label: `Option ${options.length + 1}`,
      value: String(options.length + 1)
    };

    this.updateField(field.key, {
      options: [
        ...options,
        newOption
      ]
    });
  }


  // ============================================================
  // UPDATE SELECT OPTION
  // ============================================================

  updateOption(
    index: number,
    changes: Partial<SelectOption>
  ): void {

    const field = this.selectedField();

    if (
      !field ||
      !field.options
    ) {
      return;
    }

    const updatedOptions =
      field.options.map((option, i) =>
        i === index
          ? {
              ...option,
              ...changes
            }
          : option
      );

    this.updateField(field.key, {
      options: updatedOptions
    });
  }


  // ============================================================
  // REMOVE SELECT OPTION
  // ============================================================

  removeOption(index: number): void {

    const field = this.selectedField();

    if (
      !field ||
      !field.options
    ) {
      return;
    }

    this.updateField(field.key, {
      options: field.options.filter(
        (_, i) => i !== index
      )
    });
  }


  // ============================================================
  // FORM SUBMISSION
  // ============================================================

  handleFormSubmit(
    payload: Record<string, unknown>
  ): void {

    console.log(
      'Form submitted:',
      payload
    );

    alert(
      'Form submitted! Check the console for the payload.'
    );
  }


  // ============================================================
  // COPY CONFIGURATION
  // ============================================================

  copyConfigToClipboard(): void {

    const json = JSON.stringify(
      this.config(),
      null,
      2
    );

    navigator.clipboard
      .writeText(json)
      .then(() => {
        alert(
          'Form config copied to clipboard!'
        );
      })
      .catch(error => {
        console.error(
          'Failed to copy configuration:',
          error
        );
      });
  }
}