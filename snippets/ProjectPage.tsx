export default async function BusFactor({ searchParams }: BusFactorProps) {
  const params = await searchParams

  let limit = params?.limit != null ? Number.parseInt(params.limit) : null

  if (Number.isNaN(limit)) {
    limit = null
  }

  let projects: Awaited<ReturnType<typeof fetchProjects>> = []
  try {
    const result = await fetchProjects(limit)
    if (Array.isArray(result)) {
      projects = result
    }
  } catch {
    // Optionally log or handle the error
    projects = []
  }
  const crumbs = [
    { label: HOMEPAGE.label, href: HOMEPAGE.href },
    { label: TEAM_QUALITY_PAGE.label },
  ]

  const count = projects
    .filter(p => p.lastBusFactor != null)
    .filter(
      p => [StateType.ISSUE_CREATED, StateType.OBSOLETE, StateType.PLANNED].includes(p.lastBusFactor!.state),
    )
    .length

  return (
    <div className="flex-col p-17 ">
      <div className="fixed pt-6 z-30 h-45 bg-grey-50 w-full pr-14">
        <Breadcrumb crumbs={crumbs} />
        <section className="flex h-auto flex-col gap-y-4 pt-12 pr-10 bg-grey-50">
          <Title title="Team qualité" />
          <Tabs className="mt-8" tabs={[{ isActive: true, url: '/teams/quality/bus', title: 'Bus Factor', count }]} />
        </section>
      </div>
      <section className="flex flex-col gap-y-4 overflow-auto z-0">
        <div className="grid grid-flow-row grid-cols-1 gap-4 pb-2 sm:grid-cols-2 lg:grid-cols-3 pt-54 overflow-x-auto">
          {projects.map(project =>
            <ProjectCard key={project.id} project={project} />,
          )}
        </div>
      </section>
      <CreateButton
        title="Créer un projet"
        href="/teams/quality/bus/create/project"
        className="fixed bottom-10 right-10"
      />
    </div>
  )
}
