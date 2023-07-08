// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ChatInput> = (args) => {
//   return <ChatInput {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ChatInput from './ChatInput'

export const generated = () => {
  return <ChatInput />
}

export default {
  title: 'Components/ChatInput',
  component: ChatInput,
} as ComponentMeta<typeof ChatInput>
