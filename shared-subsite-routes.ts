/**
 * Which subsite a route belongs to.
 *
 * The API reference is grouped by package rather than by subsite, so its
 * routes no longer carry the subsite in a path segment: `/api/packages/
 * react-signals` is ReactLynx, `/api/config/mode` is Rspeedy. The mapping
 * below is the single place that decides this, for every version and
 * language form of a route.
 *
 * Kept free of imports so `node --test` can run its tests.
 */

/** An entry of a synced `api/packages/_meta.json`. */
export type ApiPackagesMetaItem = {
  type: string;
  name?: string;
  label?: string;
};

/** Sections of `api/packages/_meta.json` that belong to a subsite. */
export const API_GROUP_SUBSITES: Record<string, string> = {
  'Build tools': 'rspeedy',
  'Build internals': 'rspeedy',
  ReactLynx: 'react',
};

/** Routes of the API reference that belong to a subsite as a whole. */
const API_ROUTE_SUBSITES: [RegExp, string][] = [
  [/^\/api\/config(\/|$)/, 'rspeedy'],
  [/^\/api\/react(\/|$)/, 'react'],
];

const API_PACKAGE_ROUTE = /^\/api\/packages\/([^/]+)$/;

/**
 * The subsite of every package page of a synced `api/packages/_meta.json`,
 * taken from the section the page is listed under.
 */
export function apiPackageSubsites(
  meta: readonly ApiPackagesMetaItem[],
): Record<string, string> {
  const subsites: Record<string, string> = {};
  let section: string | undefined;
  for (const item of meta) {
    if (item.type === 'section-header') {
      section = API_GROUP_SUBSITES[item.label ?? ''];
    } else if (section && item.name) {
      subsites[item.name] = section;
    }
  }
  return subsites;
}

export type SubsiteRouteOptions = {
  /** Subsite values a path segment can name, in matching order. */
  subsites: readonly string[];
  /** Subsite of each package page, from {@link apiPackageSubsites}. */
  packageSubsites?: Record<string, string>;
  /** Version prefixes the site is served under, such as `/next`. */
  versionPrefixes?: readonly string[];
};

function normalize(
  pathname: string,
  versionPrefixes: readonly string[],
): string {
  let route = pathname.replace(/\.html$/, '');
  for (const prefix of versionPrefixes) {
    if (route === prefix || route.startsWith(`${prefix}/`)) {
      route = route.slice(prefix.length);
      break;
    }
  }
  route = route.replace(/^\/zh(?=\/|$)/, '').replace(/\/$/, '');
  return route || '/';
}

/** The subsite a route belongs to, or `undefined` when it belongs to none. */
export function findSubsiteValue(
  pathname: string,
  { subsites, packageSubsites = {}, versionPrefixes = [] }: SubsiteRouteOptions,
): string | undefined {
  const route = normalize(pathname, versionPrefixes);

  const apiRoute = API_ROUTE_SUBSITES.find(([pattern]) => pattern.test(route));
  if (apiRoute) {
    return apiRoute[1];
  }

  const page = API_PACKAGE_ROUTE.exec(route);
  if (page) {
    return packageSubsites[page[1]];
  }

  const segments = route.split('/');
  return subsites.find((value) =>
    segments.some(
      (segment) =>
        segment === value || (value === 'ui' && segment === 'lynx-ui'),
    ),
  );
}
