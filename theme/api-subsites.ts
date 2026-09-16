import { subsiteOfRoute } from '@site/shared-route-config';
import { apiPackageSubsites } from '@site/shared-subsite-routes';

import apiPackagesMeta from '../docs/en/api/packages/_meta.json';

const PACKAGE_SUBSITES = apiPackageSubsites(apiPackagesMeta);

/** The subsite a route belongs to, defaulting to the Lynx guide. */
export const subsiteOf = (pathname: string) =>
  subsiteOfRoute(pathname, PACKAGE_SUBSITES);
