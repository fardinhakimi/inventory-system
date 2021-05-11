# Inventory system

The general idea was to implement an event driven microservices application with an event bus implmeneted on top of redis or kafka.

That proved to be too time consuming and challanging!, so I was forced to revert to synchronous rest calls between the services.
Which has made the system appear more complex than it really is.

Technologies I have used are:

1. Nextjs
2. Mongodb
3. Docker
4. Typescript
5. Node
6. and minikube to create a local cluster locally and run the services.

What about testing? It is shame I did not make time to write unit tests, I would have used Jest to test the react components and the individual services.

What can be improved upon this application? Alot, I mean Alot.

1. Unit test the services
2. Make inter-service communication asynchronous
3. Improve database pagination, skip and limit is not optimal
4. Introduce persistent volumes for the databases
5. Improve error handling
6. send all logs to a single store
7. deploy it to a real kubernetes cluster on a provider like GCP, DO or AWS

_How to run it locally on your computer. that's gonna be a bit of a challange and annoying at first._\

either you have to navigate to each service and do:

1. npm i
2. npm run start

Change the database connection url to locally running mongo instance and the all the inner-sevice call urls.\

or you could install minikube locally and apply the the deployment files in the infra folder one by one and then access the application at your minikube's Ip address. Yeah I know terrible
explanation to get up and running but I am super tired now.\

Btw I made some changes to the provided inventory.json and products.json files. gonna commit them here.
please ignore the inconsistent use of semicolons in the frontend service, my editor has gone crazy on me.
