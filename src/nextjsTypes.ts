export type NestedStringObject = { [key: string]: NestedStringObject };

export type NextjsRoute = {
  page: string;
  regex: string;
  routeKeys: {
    [key: string]: string;
  };
  namedRegex: string;
};

export type NextjsRoutesManifest = {
  version: number;
  pages404: boolean;
  basePath: string;
  redirects: {
    source: string;
    destination: string;
    statusCode: number;
    internal: boolean;
    regex: string;
  }[];
  rewrites: {
    source: string;
    destination: string;
    regex: string;
  }[];
  headers: unknown[];
  dynamicRoutes: NextjsRoute[];
  dataRoutes: {
    page: string;
    dataRouteRegex: string;
  }[];
  staticRoutes: NextjsRoute[];
  rsc: unknown;
};