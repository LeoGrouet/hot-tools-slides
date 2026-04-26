describe('projectDetails', () => {
  it('displays project details', async () => {
    const mockProject: Project = {
      id: '1',
      title: 'Awesome Project',
      isActive: true,
      lastBusFactor: {
        id: '1',
        state: StateType.OBSOLETE,
        createdAt: new Date('2023-04-01T00:00:00.000Z'),
        issueUrl: 'https://example.com/issue',
        knpeer: 'John Doe',
        comment: 'All is to do',
      },
      timeToFix: 56,
    }

    const { container } = render(<ProjectDetails project={mockProject} />)

    expect(container).toMatchSnapshot('data loaded')
    expect(screen.getByText('Oui')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/01\/04\/2023/)).toBeInTheDocument()
    expect(screen.getByText('56 jours')).toBeInTheDocument()
  })

  it('handles null lastBusFactor', () => {
    const mockProject: Project = {
      id: '1',
      title: 'Awesome Project',
      isActive: true,
      lastBusFactor: null,
    }

    render(<ProjectDetails project={mockProject} />)

    expect(screen.queryByText('KNPeer')).not.toBeInTheDocument()
    expect(screen.queryByText('Dernière MAJ')).not.toBeInTheDocument()
    expect(screen.queryByText('Durée de résolution')).not.toBeInTheDocument()
  })

  it('displays inactive project', () => {
    const mockProject: Project = {
      id: '1',
      title: 'Awesome Project',
      isActive: false,
      lastBusFactor: null,
    }

    render(<ProjectDetails project={mockProject} />)

    expect(screen.getByText('Non')).toBeInTheDocument()
  })

  it('displays comment when available', () => {
    const mockProject: Project = {
      id: '1',
      title: 'Awesome Project',
      isActive: true,
      lastBusFactor: {
        id: '1',
        state: StateType.OBSOLETE,
        createdAt: new Date('2023-04-01T00:00:00.000Z'),
        issueUrl: 'https://example.com/issue',
        knpeer: 'John Doe',
        comment: 'All is to do',
      },
    }

    render(<ProjectDetails project={mockProject} />)

    expect(screen.getByText('All is to do')).toBeInTheDocument()
  })

  it('does not display comment when null', () => {
    const mockProject: Project = {
      id: '1',
      title: 'Awesome Project',
      isActive: true,
      lastBusFactor: {
        id: '1',
        state: StateType.OBSOLETE,
        createdAt: new Date('2023-04-01T00:00:00.000Z'),
        issueUrl: 'https://example.com/issue',
        knpeer: 'John Doe',
        comment: null,
      },
    }

    render(<ProjectDetails project={mockProject} />)

    expect(screen.queryByText('Commentaire')).not.toBeInTheDocument()
  })
})
