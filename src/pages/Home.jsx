import Header from '@/components/Header'
import Session from '@/components/Session'
import { useNear } from '../hooks'
import { useQuery } from '@tanstack/react-query'
import { Container } from '@chakra-ui/react'
import { getActiveSessions } from '../actions'

export default function Home() {
  const { viewMethod } = useNear()

  const { data: activeSessions, refetch: refetchActiveSessions } = useQuery({
    queryKey: ['active_sessions'],
    queryFn: () => getActiveSessions({ viewMethod }),
  })

  return (
    <>
      <Header />
      <Container>
        {activeSessions?.length &&
          activeSessions.map((session) => (
            <Session refetch={refetchActiveSessions} key={session.id} session={session} />
          ))}
      </Container>
    </>
  )
}
