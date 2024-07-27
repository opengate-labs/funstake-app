import { useParams } from 'react-router-dom'
import Session from '@/components/Session'
import { useNear } from '../hooks'
import { useQuery } from '@tanstack/react-query'
import { Center, Container, Spinner, Text } from '@chakra-ui/react'
import { getActiveSessions } from '@/actions/common'

export default function PoolList() {
  const { coin } = useParams()
  const { viewMethod } = useNear()

  const {
    data: activeSessions,
    isLoading,
    refetch: refetchActiveSessions,
  } = useQuery({
    queryKey: ['active_sessions', coin],
    queryFn: () => getActiveSessions({ viewMethod, coin }),
  })

  return (
    <Container minH='90dvh'>
      {isLoading ? (
        <Center mt={14}>
          <Spinner color={'mainGreen'} />
        </Center>
      ) : (
        <>
          {activeSessions?.length ? (
            activeSessions.map((session, index) => (
              <Session
                refetch={refetchActiveSessions}
                key={session.id}
                session={session}
                index={index}
              />
            ))
          ) : (
            <Text mt={10} textAlign={'center'} fontSize={'lg'}>
              No Active Pools
            </Text>
          )}
        </>
      )}
    </Container>
  )
}
