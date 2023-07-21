import type { ComponentMeta } from '@storybook/react'

import CheckoutSuccessPage from './CheckoutSuccessPage'

export const generated = () => {
  return <CheckoutSuccessPage />
}

export default {
  title: 'Pages/CheckoutSuccessPage',
  component: CheckoutSuccessPage,
} as ComponentMeta<typeof CheckoutSuccessPage>
