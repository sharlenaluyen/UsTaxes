import React, { ReactElement, ReactNode } from 'react'
import { IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { formatSSID, LabeledInput } from '../input'
import Patterns from '../Patterns'
import { Actions, removeDependent } from '../../redux/actions'
import { TaxesState, Person } from '../../redux/data'
import { BaseFormProps } from '../types'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import ListItemText from '@material-ui/core/ListItemText'
import PersonIcon from '@material-ui/icons/Person'
import { Control, DeepMap, FieldError, Path } from 'react-hook-form'

export interface UserPersonForm {
  firstName: string
  lastName: string
  ssid: string
}

interface PersonFieldsProps<T extends UserPersonForm> extends BaseFormProps<T> {
  defaults?: UserPersonForm
  children?: ReactNode
  errors: DeepMap<Partial<Person>, FieldError>
  person?: Person
  control: Control<T>
}

export const PersonFields = <T extends UserPersonForm>({ register, person, control, errors, defaults, children }: PersonFieldsProps<T>): ReactElement => {
  const patterns = new Patterns(control)
  return (
    <div>
      <LabeledInput
        label="First Name and Initial"
        register={register}
        name={'firstName' as Path<T>}
        patternConfig={patterns.name}
        required={true}
        error={errors.firstName}
        defaultValue={person?.firstName ?? defaults?.firstName}
      />
      <LabeledInput
        label="Last Name"
        register={register}
        name={'lastName' as Path<T>}
        patternConfig={patterns.name}
        required={true}
        error={errors.lastName}
        defaultValue={person?.lastName ?? defaults?.lastName}
      />
      <LabeledInput<T>
        label="SSN / TIN"
        register={register}
        name={'ssid' as Path<T>}
        patternConfig={patterns.ssn}
        required={true}
        error={errors.ssid}
        defaultValue={person?.ssid ?? defaults?.ssid}
      />
      {children}
    </div>
  )
}

interface PersonListItemProps {
  person: Person
  remove: () => void
  onEdit?: () => void
  editing?: boolean
}

export const PersonListItem = ({ person, remove, onEdit, editing = false }: PersonListItemProps): ReactElement => (
  <ListItem className={editing ? 'active' : ''}>
    <ListItemIcon>
      <PersonIcon />
    </ListItemIcon>
    <ListItemText
      primary={`${person.firstName} ${person.lastName}`}
      secondary={formatSSID(person.ssid)}
    />
    {(() => {
      if (editing !== undefined) {
        return (
          <ListItemIcon>
            <IconButton onClick={onEdit} edge="end" aria-label="edit">
              <EditIcon />
            </IconButton>
          </ListItemIcon>
        )
      }
    })()}
    <ListItemSecondaryAction>
      <IconButton onClick={remove} edge="end" aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
)

interface ListDependentsProps {
  onEdit?: (index: number) => void
  editing?: number
}

export function ListDependents ({ onEdit, editing }: ListDependentsProps): ReactElement {
  const dependents = useSelector((state: TaxesState) =>
    state.information.taxPayer?.dependents ?? []
  )

  const dispatch = useDispatch()

  const drop = (i: number): Actions => dispatch(removeDependent(i))

  return (
    <List dense={true}>
      {
        dependents.map((p, i) =>
          <PersonListItem key={i} remove={() => drop(i)} person={p} editing={editing === i} onEdit={() => (onEdit ?? (() => { }))(i)} />
        )
      }
    </List>
  )
}
