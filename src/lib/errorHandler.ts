import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(details: any) {
    super(400, 'Validation failed', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends ApiError {
  constructor() {
    super(401, 'Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor() {
    super(403, 'Forbidden');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = 'NotFoundError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }
  
  if (error instanceof ZodError) {
    const details = error.issues.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    return new ValidationError(details);
  }
  
  console.error('Unexpected error:', error);
  return new ApiError(500, 'Internal server error');
};

export const sendErrorResponse = (error: ApiError) => {
  const response: any = {
    error: error.message
  };
  
  if (error.details) {
    response.details = error.details;
  }
  
  return new Response(JSON.stringify(response), {
    status: error.statusCode,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};