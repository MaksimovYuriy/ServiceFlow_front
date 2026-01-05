export interface JsonApiResource<T> {
  type: string;
  id?: string;
  attributes: T;
}

export interface JsonApiResponse<T> {
  data: JsonApiResource<T>;
}

export interface JsonApiError {
  title: string;
  detail?: string;
  code?: string;
}

export interface JsonApiErrorResponse {
  errors: JsonApiError[];
}

export interface JsonApiArrayResponse<T> {
  data: JsonApiResource<T>[];
  meta?: {
    stats?: {
      total: { count: number };
    }
  };
}
