import logging

logger = logging.getLogger(__name__)

class MyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.warning("MY MIDDLEWARE CALLED")
        logger.warning(f"request: {request}")
        logger.warning(f"request repr: {repr(request)}")
        logger.warning(f"request type: {type(request)}")
        logger.warning(f"request scope: {request.scope}")
        logger.warning(f"HEADERS: ")
        for header in request.scope['headers']:
            logger.warning(f"\t{header[0]}: {header[1]}")
        logger.warning(f"request client: {request.scope['client']}")
        logger.warning(f"request server: {request.scope['server']}")


        response = self.get_response(request)
        
        return response
