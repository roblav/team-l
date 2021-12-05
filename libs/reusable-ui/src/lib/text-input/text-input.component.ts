import { Component, Input, OnInit, Optional, Self } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NgControl,
} from '@angular/forms';

export interface FormValidationMessages {
  [key: string]: string;
}

@Component({
  selector: 'acc-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @Input()
  public validationMessages?: FormValidationMessages;

  @Input()
  public readonly = false;

  @Input()
  public label!: string;

  @Input()
  public placeholder = '';

  @Input()
  public maxlength!: string;

  @Input('aria-describedby')
  public ariaDescribedby!: string;

  @Input('aria-label')
  public ariaLabel!: string;

  @Input('aria-labelledby')
  public ariaLabelledby!: string | null;

  @Input()
  public hint!: string;

  public get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  public readonlyControl = new FormControl();
  validators: {
    type: string;
    message: string;
  }[] = [];

  constructor(
    @Optional()
    @Self()
    public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    const validationMessages = this.validationMessages
      ? this.validationMessages
      : '';
    if (validationMessages) {
      this.validators = findValidationMessages(validationMessages);
    } else this.validators = [];
  }

  private get readyToUpdateReadOnly(): boolean {
    return !(this.control === undefined);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChanged: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  registerOnChange(fn: any) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  writeValue(value: any) {}

  get isRequired(): boolean {
    return this.control?.validator?.({} as AbstractControl)?.required;
  }
}

export const findValidationMessages = (
  validationMessages: FormValidationMessages
): { type: string; message: string }[] => {
  const array = [];
  for (const key of Object.keys(validationMessages)) {
    array.push({ type: key, message: validationMessages[key] });
  }
  return array;
};
