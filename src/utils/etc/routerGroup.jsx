/* eslint-disable */
export function routerGroup({ routes, middleware }) {
  if (!middleware?.length) return routes

  const privateRoutes = routes.map((item) => {
    const PrivateComponent = () => (
      <>
        {middleware?.map((Middleware, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Middleware key={`middleware-${index}`}>
            {index !== middleware.length - 1 ? <></> : item.element}
          </Middleware>
        ))}
      </>
    )

    return {
      ...item,
      element: <PrivateComponent />,
    }
  })

  return privateRoutes
}
