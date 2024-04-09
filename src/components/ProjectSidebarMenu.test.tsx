import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ProjectSidebarMenu from './ProjectSidebarMenu'
import { type ProjectWithEntryPointMetadata } from 'lib/types'
import { SettingsAuthProviderJest } from './SettingsAuthProvider'
import { APP_NAME } from 'lib/constants'
import { CommandBarProvider } from './CommandBar/CommandBarProvider'

const now = new Date()
const projectWellFormed = {
  name: 'Simple Box',
  path: '/some/path/Simple Box',
  children: [
    {
      name: 'main.kcl',
      path: '/some/path/Simple Box/main.kcl',
    },
  ],
  entrypointMetadata: {
    atime: now,
    blksize: 32,
    blocks: 32,
    birthtime: now,
    dev: 1,
    gid: 1,
    ino: 1,
    isDirectory: false,
    isFile: true,
    isSymlink: false,
    mode: 1,
    mtime: now,
    nlink: 1,
    readonly: false,
    rdev: 1,
    size: 32,
    uid: 1,
    fileAttributes: null,
  },
} satisfies ProjectWithEntryPointMetadata

describe('ProjectSidebarMenu tests', () => {
  test('Renders the project name', () => {
    render(
      <BrowserRouter>
        <CommandBarProvider>
          <SettingsAuthProviderJest>
            <ProjectSidebarMenu project={projectWellFormed} />
          </SettingsAuthProviderJest>
        </CommandBarProvider>
      </BrowserRouter>
    )

    fireEvent.click(screen.getByTestId('project-sidebar-toggle'))

    expect(screen.getByTestId('projectName')).toHaveTextContent(
      projectWellFormed.name
    )
    expect(screen.getByTestId('createdAt')).toHaveTextContent(
      `Created ${now.toLocaleDateString()}`
    )
  })

  test('Renders app name if given no project', () => {
    render(
      <BrowserRouter>
        <CommandBarProvider>
          <SettingsAuthProviderJest>
            <ProjectSidebarMenu />
          </SettingsAuthProviderJest>
        </CommandBarProvider>
      </BrowserRouter>
    )

    fireEvent.click(screen.getByTestId('project-sidebar-toggle'))

    expect(screen.getByTestId('projectName')).toHaveTextContent(APP_NAME)
  })

  test('Renders as a link if set to do so', () => {
    render(
      <BrowserRouter>
        <CommandBarProvider>
          <SettingsAuthProviderJest>
            <ProjectSidebarMenu
              project={projectWellFormed}
              renderAsLink={true}
            />
          </SettingsAuthProviderJest>
        </CommandBarProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('project-sidebar-link')).toBeInTheDocument()
    expect(screen.getByTestId('project-sidebar-link-name')).toHaveTextContent(
      projectWellFormed.name
    )
  })
})
