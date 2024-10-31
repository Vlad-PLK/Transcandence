FROM public.ecr.aws/docker/library/node:18-alpine

WORKDIR /app

COPY . .

RUN npm install react-charts@beta --save && npm install

EXPOSE 3000

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000" ]
#docker run -it --rm --publish 3000:3000 front
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]