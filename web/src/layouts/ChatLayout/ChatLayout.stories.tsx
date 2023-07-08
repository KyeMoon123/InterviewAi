import type { ComponentMeta, ComponentStory } from '@storybook/react'

import ChatLayout from './ChatLayout'

export const generated: ComponentStory<typeof ChatLayout> = (args) => {
  return <ChatLayout {...args} />
}

export default {
  title: 'Layouts/ChatLayout',
  component: ChatLayout,
} as ComponentMeta<typeof ChatLayout>
