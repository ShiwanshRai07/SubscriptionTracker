import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, {requested :1});

        if(decision.isDenied()){
            if(decision.reason.isRateLimit()) return res.status(439).json({error : 'Rate Limit Exceeded'});
            if(decision.reason.isBot()) return res.status(403).json({error : 'Bot detected'});

            return res.status(403).json({error : 'Access Denied'});
        }

        next();
    }catch(e){
        console.log(`Arcjet Middleware Error : ${e}`);
        next(e);
    }
}

export default arcjetMiddleware;