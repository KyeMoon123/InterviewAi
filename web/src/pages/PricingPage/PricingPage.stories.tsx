import type { ComponentMeta } from '@storybook/react'

import PricingPage from './PricingPage'

export const generated = () => {
  return <PricingPage />
}

export default {
  title: 'Pages/PricingPage',
  component: PricingPage,
} as ComponentMeta<typeof PricingPage>
