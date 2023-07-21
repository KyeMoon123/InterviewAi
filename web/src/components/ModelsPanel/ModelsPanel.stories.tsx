// When you've added props to your component,
// pass Storybook's `args` through this story to control it from the addons panel:
//
// ```tsx
// import type { ComponentStory } from '@storybook/react'
//
// export const generated: ComponentStory<typeof ModelsPanel> = (args) => {
//   return <ModelsPanel {...args} />
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { ComponentMeta } from '@storybook/react'

import ModelsPanel from './ModelsPanel'

export const generated = () => {
  return <ModelsPanel />
}

export default {
  title: 'Components/ModelsPanel',
  component: ModelsPanel,
} as ComponentMeta<typeof ModelsPanel>
