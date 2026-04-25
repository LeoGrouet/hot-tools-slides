export function HistoryMobilCard({ busFactor, projectId }: { busFactor: BusFactor, projectId: number }) {
  const [isFolded, setIsFolded] = useState(true)

  const handleFold = () => {
    setIsFolded(!isFolded)
  }

  const color = {
    INACTIVE: theme.stateColor.none,
    OBSOLETE: theme.stateColor.obsolete,
    PLANNED: theme.stateColor.planned,
    ISSUE_CREATED: theme.stateColor.issueCreated,
    UP_TO_DATE: theme.stateColor.upToDate,
  }

  return (
    <Card className="mb-4 flex flex-col justify-between" key={busFactor.id}>
      <div className="flex w-full justify-between">
        <Info title="Date de mise à jour">
          {new Date(busFactor.createdAt).toLocaleDateString('fr-FR')}
        </Info>
        <div className="flex justify-end gap-4">
          {isFolded && (
            <div className="pt-[0.35rem]">
              <Dot color={color[busFactor.state as keyof typeof color]} />
            </div>
          )}
          <Icon name={isFolded ? IconName.ChevronDown : IconName.ChevronUp} onClick={handleFold} />
        </div>
      </div>
      <div className="flex w-full items-center">
        {!isFolded
          ? (
            <div className="w-full">
              <div className="flex justify-between">
                <Info title="Knpeer">
                  {busFactor.knpeer}
                </Info>
                <Info title="Statut">
                  <State state={busFactor.state} projectId={projectId} disabled />
                </Info>
              </div>
              <Info title="Issue">
                {busFactor.issueUrl}
              </Info>
              <Info title="Commentaire">
                {busFactor.comment}
              </Info>
            </div>
          )
          : null}
      </div>
    </Card>
  )
}
