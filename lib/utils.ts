import settings from '../settings'

// eslint-disable-next-line import/prefer-default-export
export const getAppsEntitiesPaths = (): string[] => {
    const paths = []

    settings.apps.forEach((app) => {
        paths.push(`${__dirname}/../${app}/entities/*.ts`)
    })

    return paths
}
