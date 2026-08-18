import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { DynamicFormComponent } from './dynamic-form.component';
import { FormBuilderConfig } from '../../models/form-field.model';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  const sampleConfig: FormBuilderConfig = {
    title: 'Test Form',
    description: 'A test form',
    submitLabel: 'Send',
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter name'
      },
      {
        key: 'age',
        label: 'Age',
        type: 'number',
        required: true,
        min: 0,
        max: 120
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true
      },
      {
        key: 'bio',
        label: 'Bio',
        type: 'textarea',
        rows: 3
      },
      {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { label: 'Student', value: 'student' },
          { label: 'Instructor', value: 'instructor' }
        ]
      },
      {
        key: 'agree',
        label: 'I agree',
        type: 'checkbox'
      },
      {
        key: 'startDate',
        label: 'Start Date',
        type: 'date'
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.config.set(sampleConfig);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the form with all fields', () => {
    expect(component.form).toBeDefined();
    expect(Object.keys(component.form.controls).length).toBe(7);
  });

  it('should mark form as invalid when required fields are empty', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.form.patchValue({
      name: 'John Doe',
      age: 25,
      email: 'john@example.com',
      bio: 'Some bio',
      role: 'student',
      agree: true,
      startDate: '2026-01-01'
    });
    expect(component.form.valid).toBeTrue();
  });

  it('should detect invalid required field', () => {
    component.form.patchValue({ name: '' });
    expect(component.isFieldInvalid(sampleConfig.fields[0])).toBeTrue();
  });

  it('should detect valid required field', () => {
    component.form.patchValue({ name: 'John' });
    expect(component.isFieldInvalid(sampleConfig.fields[0])).toBeFalse();
  });

  it('should emit form data on valid submit', () => {
    let emitted: Record<string, unknown> | null = null;
    component.formSubmit.subscribe(value => {
      emitted = value;
    });

    component.form.patchValue({
      name: 'John',
      age: 30,
      email: 'john@example.com',
      bio: 'Bio',
      role: 'student',
      agree: true,
      startDate: '2026-01-01'
    });

    component.onSubmit();
    expect(emitted).not.toBeNull();
    expect(emitted!['name']).toBe('John');
    expect(emitted!['age']).toBe(30);
  });

  it('should not emit on invalid submit', () => {
    let emitted = false;
    component.formSubmit.subscribe(() => {
      emitted = true;
    });

    component.onSubmit();
    expect(emitted).toBeFalse();
  });
});
