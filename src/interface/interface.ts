export interface ErrorSource {
  path: string | string[];
  message: string;
}

export interface ErrorResponse {
  success: false;
  statusCode: number;
  message: string;
  errorDetails: string;
  errorSources: ErrorSource[];
  timestamp: string;
  path?: string;
  stack?: string;
}

export interface ErrorWithStatusCode extends Error {
  statusCode?: number;
}
