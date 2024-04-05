!#/bin/bash
docker-compose down
docker rmi metalstiv/todo_user_microservice:1.0
npx tsc --p ./userMicroservice ./userMicroservice/src/*.ts --outDir ./userMicroservice/build --downlevelIteration
docker build -t metalstiv/todo_user_microservice:1.0 ./userMicroservice
docker-compose up -d
cd webClient
npm run dev