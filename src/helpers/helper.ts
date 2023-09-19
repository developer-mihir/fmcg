import { Response } from 'express';

export const commonResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    customStatusCode: number,
    data: T,
): Response<T> => {
    return res.status(statusCode || 500).json({
        status: statusCode,
        message,
        data,
    });
};
