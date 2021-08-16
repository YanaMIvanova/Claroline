import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {Alert} from '#/main/app/alert/components/alert'
import {FormStepper} from '#/main/app/content/form/components/stepper'

import {Facet} from '#/main/app/security/registration/components/facet'
import {Required} from '#/main/app/security/registration/components/required'
import {Optional} from '#/main/app/security/registration/components/optional'
import {Organization} from '#/main/app/security/registration/components/organization'
import {Workspace} from '#/main/app/security/registration/components/workspace'
import {Registration} from '#/main/app/security/registration/components/registration'
import {OrganizationSelection} from '#/main/app/security/registration/containers/organization-selection'

import {constants as registrationConstants} from '#/main/app/security/registration/constants'
import {constants as dataConstants} from '#/main/app/data/types/constants'


class RegistrationMain extends Component {
  componentDidMount() {
    this.props.fetchRegistrationData()
  }

  getAllFields() {
    const {facets} = this.props

    return facets.flatMap(({sections}) => sections).flatMap(({fields}) => fields)
  }

  render() {
    const {EQUALS_TYPE, DOES_NOT_EQUAL_TYPE} = dataConstants
    const {
      ORGANIZATION_SELECTION_CREATE,
      ORGANIZATION_SELECTION_SELECT,
      REGISTRATION_MAIL_VALIDATION_NONE,
      REGISTRATION_MAIL_VALIDATION_FULL
    } = registrationConstants
    const {formData} = this.props
    let steps = []

    if (!this.props.options.allowWorkspace && this.props.defaultWorkspaces) {
      steps.push({
        title: 'Registration',
        component: Registration
      })
    }

    steps = steps.concat([
      {
        title: trans('my_account'),
        component: Required
      }, {
        title: 'Configuration',
        component: Optional
      }
    ], this.props.facets.map((facet) => ({
      ...facet,
      sections:
        facet.sections !== undefined
          ? [
            ...facet.sections.map((section) => ({
              ...section,
              fields: section.fields.filter(
                ({
                  conditions: {
                    dependencyField,
                    validationType,
                    comparisonValue
                  }
                }) => {
                  if (dependencyField === '' || validationType === '') {
                    return true
                  } else {
                    const field = this.getAllFields().find(({ id: fieldId }) => fieldId === dependencyField)

                    if (typeof field !== 'undefined') {
                      const value = formData.profile && `${formData.profile[field.id]}`
 
                      if (validationType === EQUALS_TYPE) {
                        return comparisonValue === value
                      } else if (validationType === DOES_NOT_EQUAL_TYPE) {
                        return comparisonValue !== value
                      }
                    }
                  }
                }  
              )
            }))
          ]
          : undefined
    }))
      .map(facet => ({
        title: facet.title,
        component: () => {
          const currentFacet = <Facet facet={facet}/>

          return currentFacet
        }
      })))

    if (this.props.options.organizationSelection === ORGANIZATION_SELECTION_CREATE) {
      steps.push({
        title: trans('organization'),
        component: Organization
      })
    }

    if (this.props.options.allowWorkspace) {
      steps.push({
        title: trans('workspaces'),
        component: Workspace
      })
    }

    if (this.props.options.organizationSelection === ORGANIZATION_SELECTION_SELECT) {
      steps.push({
        title: trans('organization'),
        component: OrganizationSelection
      })
    }

    return (
      <FormStepper
        submit={{
          type: CALLBACK_BUTTON,
          label: trans('self-register', {}, 'actions'),
          confirm: {
            title: trans('registration'),
            message: trans('register_confirm_message'),
            button: trans('registration_confirm'),
            additional: REGISTRATION_MAIL_VALIDATION_NONE !== this.props.options.validation ? (
              <div className="modal-body">
                <Alert type="info">
                  {trans('registration_mail_help')}
                </Alert>

                {REGISTRATION_MAIL_VALIDATION_FULL === this.props.options.validation &&
                  <Alert type="warning">
                    {trans('registration_validation_help')}
                  </Alert>
                }
              </div>
            ) : undefined
          },
          callback: () => this.props.register(this.props.user, this.props.termOfService, (user) => {
            this.props.onRegister(user)
          })
        }}
        steps={steps}
      />
    )
  }
}

RegistrationMain.propTypes = {
  path: T.string,
  history: T.shape({
    push: T.func.isRequired
  }).isRequired,
  location: T.shape({
    path: T.string
  }),
  user: T.shape({
    // user type
  }).isRequired,
  organization: T.shape({
    // organization type
  }).isRequired,
  facets: T.arrayOf(T.shape({
    id: T.string.isRequired,
    title: T.string.isRequired
  })),
  termOfService: T.string,
  register: T.func.isRequired,
  fetchRegistrationData: T.func.isRequired,
  options: T.shape({
    validation: T.bool,
    allowWorkspace: T.bool,
    organizationSelection: T.string
  }).isRequired,
  defaultWorkspaces: T.array,
  formData: T.array,
  onRegister: T.func
}

export {
  RegistrationMain
}
