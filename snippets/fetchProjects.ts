export default async function fetchProjects(
  limit: number | null = null,
) {
  const client = await getClient()

  const { projects } = await client.request<
    ProjectsQuery,
    ProjectsQueryVariables
  >(PROJECTS_QUERY, { limit })

  return projects.page
}
