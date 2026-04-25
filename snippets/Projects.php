#[Provider(targetQueryTypes: 'Query')]
final readonly class Projects implements QueryInterface
{
public function __construct(
private Projectrepository $projects,
private BusFactors $busFactors,
) {}

/**
* @param int<1,max> $limit
    */
    #[Query(name: 'projects', type: 'ProjectsPagination!')]
    #[Arg('limit', type: 'Int', defaultValue: 100)]
    public function __invoke(?int $limit): ProjectsPaginationType
    {
    $projects = $this->projects->findAll();

    $items = $projects->map(
    fn (Project $project): ProjectType => new ProjectType($project, $this->busFactors)
    );

    return new ProjectsPaginationType($items, $limit ?? 100);
    }
    }
