
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
        console.log("request body error",parsed);
        if(!parsed.success) {
            logger.error(parsed.error)
            next(ERRORS.INVALID_REQUEST_BODY)
            return;
        }
    }
    if(query) {
        const parsed = query.safeParse(req.query)
        if(!parsed.success) {
            logger.error(parsed.error)
            next(ERRORS.INVALID_QUERY_PARAMETER)
            return;
        } 
    }
    next()
}

export default validateRequest;
