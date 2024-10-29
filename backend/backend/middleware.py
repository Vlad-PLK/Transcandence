import logging

logger = logging.getLogger('django')

class LogRequestsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        logger.info(f"Request URL: {request.path} | Method: {request.method} | Status: {response.status_code}")
        return response