// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ProfileSection> = (args) => {
//   return <ProfileSection {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ProfileSection from './ProfileSection'

export const generated = () => {
  return <ProfileSection />
}

export default {
  title: 'Components/ProfileSection',
  component: ProfileSection,
} as ComponentMeta<typeof ProfileSection>
