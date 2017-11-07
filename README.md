# homework-manager-backend

## Developing
Make sure that you have [Node](https://nodejs.org) installed.
Clone the project and cd into its folder.

```shell
git clone https://github.com/makmm/homework-manager-backend
cd homework-manager-backend
```

Next, install dependencies.

```shell
npm install
```

Set port, env and DB host, and start.

```shell
export PORT="8080"
export DB_HOST="mongodb://localhost/homework-manager"
export NODE_ENV="dev"
node index.js
```

Done. The API should be live at [port 8080](http://localhost:8080).

I recommend using `nodemon` to auto reload the backend when it gets updated.

```shell
npm install -g nodemon
nodemon index.js
```
