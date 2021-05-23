import { BaseFormProps } from '../types'
import { Control, FieldError, FieldValues, Path, RegisterOptions } from 'react-hook-form'
import { Pattern } from '../Patterns'
export * from '../types'

export interface BaseDropdownProps {
  label: string
  strongLabel?: string
  required?: boolean
  name: string
  error?: FieldError
  defaultValue?: string
  control?: Control<any>
}

export interface CurrencyProps {
  prefix?: string
  value: number
  plain?: boolean
}

export interface LabeledDropdownProps<A> extends BaseDropdownProps {
  dropDownData: A[]
  valueMapping: (a: A, n: number) => string
  keyMapping: (a: A, n: number) => string | number
  textMapping: (a: A, n: number) => string
}

export interface LabeledInputProps<A extends FieldValues> extends BaseFormProps<A> {
  strongLabel?: string
  patternConfig?: Pattern<A>
  label: string
  required?: boolean
  name: Path<A>
  defaultValue?: string
  rules?: Exclude<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
}

export interface LabeledFormProps<A> {
  name: string
  control: Control<any>
  label: string
  defaultValue?: A
}

export type LabeledCheckboxProps = LabeledFormProps<boolean>

export interface LabeledRadioProps extends LabeledFormProps<string> {
  values: Array<[string, string]>
}
