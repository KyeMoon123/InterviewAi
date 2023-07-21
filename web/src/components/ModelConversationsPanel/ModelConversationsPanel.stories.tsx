// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ModelConversationsPanel> = (args) => {
//   return <ModelConversationsPanel {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ModelConversationsPanel from './ModelConversationsPanel'

export const generated = () => {
  return <ModelConversationsPanel />
}

export default {
  title: 'Components/ModelConversationsPanel',
  component: ModelConversationsPanel,
} as ComponentMeta<typeof ModelConversationsPanel>
