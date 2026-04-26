'use server'

export async function createBusAction(
  _prevState: any,
  formData: FormData,
): Promise<BusFactorFormState> {
  const client = await getClient()
  const payload = Object.fromEntries(formData.entries())

  const currentState = {
    projectId: Number(payload.projectId),
    state: payload.state as StateType,
    comment: payload.comment as string,
    issueUrl: payload.issueUrl as string,
    knpeer: payload.knpeer as string,
    fieldErrors: {},
    success: false,
  }

  const validatedFields = busFactorFormSchema.safeParse({
    projectId: currentState.projectId,
    state: currentState.state,
    comment: currentState.comment || null,
    issueUrl: currentState.issueUrl || null,
    knpeer: currentState.knpeer,
  })

  if (!validatedFields.success) {
    const errors = validatedFields.error.issues.reduce(
      (acc, issue) => {
        acc[String(issue.path[0])] = issue.message
        return acc
      },
      {} as Record<string, string>,
    )
    return {
      ...currentState,
      fieldErrors: errors,
    }
  }

  try {
    await client.request<
      CreateBusFactorMutation,
      CreateBusFactorMutationVariables
    >(CREATE_BUS_FACTOR_MUTATION, {
      projectId: Number(currentState.projectId),
      state: currentState.state,
      comment: currentState.comment || null,
      issueUrl: currentState.issueUrl || null,
      knpeer: currentState.knpeer,
    })

    revalidatePath('/teams/quality/bus')

    return {
      ...currentState,
      success: true,
    }
  } catch (error) {
    console.error(error)

    return {
      ...currentState,
    }
  }
}
