import {trans} from '#/main/app/intl/translation'

import {OrganizationSelection} from '#/main/app/security/registration/containers/organization-selection'

const dataType = {
  name: 'organization-selection',
  meta: {
    creatable: true,
    icon: 'fa fa-fw fa-map-marker',
    label: trans('organization'),
    description: trans('address_desc', {}, 'data')
  },
  render: () => 'Hello there',
  components: {
    organization: OrganizationSelection
  }
}

export {
  dataType
}
