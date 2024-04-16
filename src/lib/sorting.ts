import { CustomIconName } from 'components/CustomIcon'
import { type ProjectWithEntryPointMetadata } from 'lib/types'

const DESC = ':desc'

export function getSortIcon(
  currentSort: string,
  newSort: string
): CustomIconName {
  if (currentSort === newSort) {
    return 'arrowUp'
  } else if (currentSort === newSort + DESC) {
    return 'arrowDown'
  }
  return 'horizontalDash'
}

export function getNextSearchParams(currentSort: string, newSort: string) {
  if (currentSort === null || !currentSort)
    return { sort_by: newSort + (newSort !== 'modified' ? DESC : '') }
  if (currentSort.includes(newSort) && !currentSort.includes(DESC))
    return { sort_by: '' }
  return {
    sort_by: newSort + (currentSort.includes(DESC) ? '' : DESC),
  }
}

export function getSortFunction(sortBy: string) {
  const sortByName = (
    a: ProjectWithEntryPointMetadata,
    b: ProjectWithEntryPointMetadata
  ) => {
    if (a.name && b.name) {
      return sortBy.includes('desc')
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    }
    return 0
  }

  const sortByModified = (
    a: ProjectWithEntryPointMetadata,
    b: ProjectWithEntryPointMetadata
  ) => {
    if (a.entrypointMetadata?.mtime && b.entrypointMetadata?.mtime) {
      return !sortBy || sortBy.includes('desc')
        ? b.entrypointMetadata.mtime.getTime() -
            a.entrypointMetadata.mtime.getTime()
        : a.entrypointMetadata.mtime.getTime() -
            b.entrypointMetadata.mtime.getTime()
    }
    return 0
  }

  if (sortBy?.includes('name')) {
    return sortByName
  } else {
    return sortByModified
  }
}
