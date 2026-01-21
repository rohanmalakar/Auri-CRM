import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Request } from '@customTypes/connection';
import { ERRORS } from '@utils/error';
import createLogger from '@utils/logger';

const logger = createLogger('@validateRequest');

export type RequestValidation = {
  params?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  body?: z.ZodTypeAny;
};

function formatZodIssues(error: z.ZodError) {
  return error.issues.map((issue) => ({
    // exact location of the failing field
    path: issue.path.length ? issue.path.join('.') : 'root',

    // human message
    message: issue.message,

    // Zod error code
    code: issue.code,

    // useful metadata depending on issue.code
    expected: (issue as any).expected,
    received: (issue as any).received,
    minimum: (issue as any).minimum,
    maximum: (issue as any).maximum,
    inclusive: (issue as any).inclusive,
    type: (issue as any).type,

    // in case of unions (common with z.union)
    unionErrors: (issue as any).unionErrors
      ? (issue as any).unionErrors.map((ue: z.ZodError) => ue.issues)
      : undefined,
  }));
}

function logValidationError(opts: {
  part: 'body' | 'query' | 'params';
  req: Request;
  issues: any[];
  rawError: z.ZodError;
}) {
  const { part, req, issues, rawError } = opts;

  const context = {
    method: req.method,
    path: req.originalUrl,
    // If you have requestId middleware, this will show it; otherwise undefined.
    requestId: (req as any).id,
  };

  logger.error(
    `🔴 ${part.toUpperCase()} validation failed`,
    JSON.stringify({ context, issues }, null, 2)
  );

  // Keep raw error in console for debugging (optional)
  console.error(`❌ ${part} validation error:`, context);
  console.error('Issues:', issues);
  console.error('Raw ZodError:', rawError);
}

const validateRequest =
  ({ body, query, params }: RequestValidation) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Validate BODY
    if (body) {
      const parsed = await body.safeParseAsync(req.body);
      if (!parsed.success) {
        const issues = formatZodIssues(parsed.error);
        logValidationError({ part: 'body', req, issues, rawError: parsed.error });

        // IMPORTANT: Return the error details in the response so Postman/frontend shows exact field
        return res.status(400).json({
          error: 'INVALID_BODY',
          message: 'Request body validation failed',
          issues,
        });

        // If you must keep your global error handler instead:
        // (ERRORS.INVALID_INPUT as any).meta = { issues };
        // return next(ERRORS.INVALID_INPUT);
      }
    }

    // Validate QUERY
    if (query) {
      const parsed = await query.safeParseAsync(req.query);
      if (!parsed.success) {
        const issues = formatZodIssues(parsed.error);
        logValidationError({ part: 'query', req, issues, rawError: parsed.error });

        return res.status(400).json({
          error: 'INVALID_QUERY',
          message: 'Query validation failed',
          issues,
        });

        // Or attach meta and next(ERRORS.INVALID_QUERY_PARAMETER)
      }
    }

    // Validate PARAMS
    if (params) {
      const parsed = await params.safeParseAsync(req.params);
      if (!parsed.success) {
        const issues = formatZodIssues(parsed.error);
        logValidationError({ part: 'params', req, issues, rawError: parsed.error });

        return res.status(400).json({
          error: 'INVALID_PARAMS',
          message: 'Params validation failed',
          issues,
        });
      }
    }

    return next();
  };

export default validateRequest;
