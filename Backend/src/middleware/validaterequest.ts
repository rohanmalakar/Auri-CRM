
import { NextFunction, Response } from 'express';
import { z } from 'zod';

import { Request } from '@customTypes/connection';
import { ERRORS } from '@utils/error';
import createLogger from '@utils/logger';
const logger = createLogger('@validateRequest')

export declare type RequestValidation = {
    params?: z.ZodTypeAny;
    query?: z.ZodTypeAny;
    body?: z.ZodTypeAny;
  };

const validateRequest = ({body, query, params}: RequestValidation) => (req: Request, res: Response, next: NextFunction) => {

    if(body) {
        const parsed = body.safeParse(req.body)
        if(!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                path: err.path.join('.') || 'root',
                message: err.message,
                code: err.code,
            }));
            logger.error('🔴 Body Validation Error:', JSON.stringify(errors, null, 2));
            console.error('❌ Body Validation Error Details:', errors);
            next(ERRORS.INVALID_INPUT)
            return;
        }
    }
    if(query) {
        const parsed = query.safeParse(req.query)
        if(!parsed.success) {
            const errors = parsed.error.issues.map((err) => ({
                path: err.path.join('.') || 'root',
                message: err.message,
                code: err.code,
            }));
            logger.error('🔴 Query Parameter Validation Error:', JSON.stringify(errors, null, 2));
            console.error('❌ Query Validation Error Details:', errors);
            next(ERRORS.INVALID_QUERY_PARAMETER)
            return;
        } 
    }
    next()
}

export default validateRequest;
