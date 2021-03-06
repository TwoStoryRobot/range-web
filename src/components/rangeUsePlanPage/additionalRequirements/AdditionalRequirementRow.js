import React from 'react'
import PropTypes from 'prop-types'
import { isUUID } from 'uuid-v4'
import PermissionsField from '../../common/PermissionsField'
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Dropdown, TextArea } from 'formik-semantic-ui'

const AdditionalRequirementRow = ({ additionalRequirement, namespace }) => {
  const references = useReferences()

  const categories = references[REFERENCE_KEY.ADDITIONAL_REQUIREMENT_CATEGORY]
  const options = categories.map(category => ({
    key: category.id,
    value: category.id,
    text: category.name
  }))

  const { detail, url, categoryId } = additionalRequirement

  const isEditable = isUUID(additionalRequirement.id)

  return (
    <div className="rup__a-requirement__row">
      <PermissionsField
        permission={ADDITIONAL_REQUIREMENTS.CATEGORY}
        inputProps={{ placeholder: 'Category' }}
        name={`${namespace}.categoryId`}
        component={Dropdown}
        options={options}
        displayValue={
          options.find(c => c.value === categoryId)
            ? options.find(c => c.value === categoryId).text
            : ''
        }
        label="Category"
        fast
        editable={!isEditable}
      />
      <div>
        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.DESCRIPTION}
          name={`${namespace}.detail`}
          component={TextArea}
          displayValue={detail}
          inputProps={{ placeholder: 'Details' }}
          label="Details"
          fast
          editable={!isEditable}
        />

        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.URL}
          name={`${namespace}.url`}
          displayValue={url}
          label="URL"
          inputProps={{ placeholder: 'URL', fluid: true }}
          fast
          editable={!isEditable}
        />
      </div>
    </div>
  )
}

AdditionalRequirementRow.propTypes = {
  additionalRequirement: PropTypes.shape({}).isRequired,
  namespace: PropTypes.string.isRequired
}

export default React.memo(AdditionalRequirementRow)
