import type { ComponentMeta } from '@storybook/react'

import UpdatePasswordPage from './UpdatePasswordPage'

export const generated = () => {
  return <UpdatePasswordPage />
}

export default {
  title: 'Pages/UpdatePasswordPage',
  component: UpdatePasswordPage,
} as ComponentMeta<typeof UpdatePasswordPage>
