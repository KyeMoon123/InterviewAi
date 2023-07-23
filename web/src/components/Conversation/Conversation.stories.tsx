// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ConversationPanel> = (args) => {
//   return <ConversationPanel {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import Conversation from './Conversation'

export const generated = () => {
  return <Conversation />
}

export default {
  title: 'Components/ConversationPanel',
  component: Conversation,
} as ComponentMeta<typeof Conversation>
