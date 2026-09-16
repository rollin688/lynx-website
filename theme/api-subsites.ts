import { SUBSITES_CONFIG } from '@site/shared-route-config';

import apiPackagesMeta from '../docs/en/api/packages/_meta.json';
import { apiPackageSubsites, findSubsiteValue } from '../shared-subsite-routes';

const PACKAGE_SUBSITES = apiPackageSubsites(apiPackagesMeta);
const SUBSITE_VALUES = SUBSITES_CONFIG.map((subsite) => subsite.value);

/** The subsite a route belongs to, defaulting to the Lynx guide. */
export const subsiteOf = (pathname: string) =>
  findSubsiteValue(pathname, {
    subsites: SUBSITE_VALUES,
    packageSubsites: PACKAGE_SUBSITES,
  }) ?? 'guide';
