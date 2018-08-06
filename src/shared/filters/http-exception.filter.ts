import { ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { type } from "os";

export class htttpExceptionFilter implements ExceptionFilter{
    catch(error: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest();
        const res = ctx.getResponse();
        
        if(error.getStatus() === HttpStatus.UNAUTHORIZED){
            if(typeof error.response !== 'string'){
                error.response['message'] = error.response.message || 'You do not have permission';
            }
        }
        res.status(error.getStatus()).json({
            statusCode: error.getStatus(),
            error: error.response.name || error.name,
            message: error.response.message || error.message,
            errors: error.response.errors || null,
            timestamp: new Date().toDateString(),
            path: req ? req.url : null
        })
    }
}