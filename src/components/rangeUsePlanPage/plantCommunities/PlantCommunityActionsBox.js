import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FieldArray, connect } from 'formik'
import {
  Button,
  Form,
  Confirm,
  Icon,
  Dropdown as PlainDropdown
} from 'semantic-ui-react'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { PLANT_COMMUNITY } from '../../../constants/fields'
import { Dropdown, TextArea } from 'formik-semantic-ui'
import DateInputField from '../../common/form/DateInputField'

const PlantCommunityActionsBox = ({ actions, namespace }) => {
  const [otherOptions, setOtherOptions] = useState([])
  const [toRemove, setToRemove] = useState(null)

  const references = useReferences()
  const actionTypes = references[REFERENCE_KEY.PLANT_COMMUNITY_ACTION_TYPE]

  const actionOptions = actionTypes
    .map(type => ({
      key: type.id,
      value: type.name,
      text: type.name
    }))
    .concat(otherOptions)

  return (
    <FieldArray
      name={`${namespace}.plantCommunityActions`}
      render={({ push, remove }) => (
        <>
          {actions.map((action, index) => (
            <div key={action.id || `action${index}`}>
              <Form.Group widths="equal">
                <PermissionsField
                  name={`${namespace}.plantCommunityActions.${index}.name`}
                  permission={PLANT_COMMUNITY.ACTIONS.NAME}
                  component={Dropdown}
                  options={actionOptions}
                  displayValue={action.name}
                  label="Action"
                  fieldProps={{
                    width: 3
                  }}
                  inputProps={{
                    allowAdditions: true,
                    search: true,
                    onAddItem: (e, { value }) => {
                      setOtherOptions([
                        ...otherOptions,
                        {
                          key: value,
                          value: value,
                          text: value
                        }
                      ])
                    }
                  }}
                />

                <PermissionsField
                  name={`${namespace}.plantCommunityActions.${index}.details`}
                  permission={PLANT_COMMUNITY.ACTIONS.DETAIL}
                  displayValue={action.details}
                  component={TextArea}
                  label="Details"
                  fieldProps={{
                    width: 9
                  }}
                />

                <IfEditable permission={PLANT_COMMUNITY.ACTIONS.NAME}>
                  <PlainDropdown
                    trigger={<Icon name="ellipsis vertical" />}
                    options={[
                      {
                        key: 'delete',
                        value: 'delete',
                        text: 'Delete'
                      }
                    ]}
                    style={{ display: 'flex', alignItems: 'center' }}
                    icon={null}
                    pointing="right"
                    onClick={e => e.stopPropagation()}
                    onChange={(e, { value }) => {
                      if (value === 'delete') {
                        setToRemove(index)
                      }
                    }}
                    selectOnBlur={false}
                  />
                </IfEditable>
              </Form.Group>
              {action.name === 'Timing' && (
                <Form.Group width="equal">
                  <Form.Field width="5" />
                  <PermissionsField
                    name={`${namespace}.plantCommunityActions.${index}.noGrazeStart`}
                    permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                    displayValue={action.noGrazeStart}
                    component={DateInputField}
                    label="No Graze Period"
                    inline
                  />

                  <PermissionsField
                    name={`${namespace}.plantCommunityActions.${index}.noGrazeEND`}
                    permission={PLANT_COMMUNITY.ACTIONS.NO_GRAZING_PERIOD}
                    displayValue={action.noGrazeEND}
                    component={DateInputField}
                    label="-"
                    inline
                  />
                </Form.Group>
              )}
            </div>
          ))}
          <Confirm
            open={toRemove !== null}
            onCancel={() => {
              setToRemove(null)
            }}
            onConfirm={() => {
              remove(toRemove)
              setToRemove(null)
            }}
          />
          <Button
            primary
            type="button"
            className="icon labeled rup__plant-communities__add-button"
            onClick={() => push({ name: '', details: '' })}>
            <i className="add circle icon" />
            Add Plant Community
          </Button>
        </>
      )}
    />
  )
}

PlantCommunityActionsBox.propTypes = {
  actions: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
}

export default connect(PlantCommunityActionsBox)
