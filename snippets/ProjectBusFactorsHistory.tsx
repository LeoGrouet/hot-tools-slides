'use client'
export function ProjectBusFactorsHistory({
  projectId,
  busFactors,
  totalPages,
}: {
  projectId: number
  busFactors: BusFactorsPagination | null
  totalPages: number
}) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentPage = Number(searchParams.get('page')) || 1

  const updatePageInUrl = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      updatePageInUrl(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      updatePageInUrl(currentPage + 1)
    }
  }

  if (busFactors === null)
    return <p>Aucune donnée disponible</p>

  const columns = ['Date', 'KNPeer', 'Status', 'Issue', 'Commentaire']
  const rows = busFactors.page.map(busFactor => ({
    key: busFactor.id,
    cells: [
      { id: 'date', content: new Date(busFactor.createdAt).toLocaleDateString('fr-FR') },
      { id: 'knpeer', content: <ProjectBusFactorsHistoryRow type={BusFactorType.Knpeer} busFactor={busFactor} /> },
      { id: 'state', content: <State state={busFactor.state} projectId={projectId} disabled /> },
      { id: 'issue', content: <ProjectBusFactorsHistoryRow type={BusFactorType.IssueUrl} busFactor={busFactor} /> },
      { id: 'comment', content: <ProjectBusFactorsHistoryRow type={BusFactorType.Comment} busFactor={busFactor} /> },
    ],
  }))

  return (
    <div>
      <div className="hidden md:block">
        <Card className="p-4">
          <Table columns={columns} rows={rows} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
          />
        </Card>
      </div>
      <div className="md:hidden">
        {busFactors.page.map(busFactor => (
          <HistoryMobilCard key={busFactor.id} busFactor={busFactor} projectId={projectId} />
        ))}
      </div>
    </div>
  )
}
