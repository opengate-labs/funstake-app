import { Tag } from '@chakra-ui/react'

export default function StatusBadge({ isEnded }) {
  return (
    <Tag size='sm' color={isEnded ? 'red.500' : 'mainGreen'}>
      {isEnded ? 'ENDED' : 'LIVE'}
    </Tag>
  )
}
