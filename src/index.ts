// npm packages
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Imports
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middlewares/error.middlewares';


class App {

  public app: Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandler();
  }

  private listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandler() {
    this.app.use(errorMiddleware);
  }

  public connectToTheDataBase() {
    // Environment variables
    const { MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env;

    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_URI}`,
        { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        this.listen();
      })
      .catch(err => {
        console.log(err);
      });
  }
}

export default App;















// const app: Application = express();

// // dotenv.config({
// //   path: `.env.${NODE_ENV}`
// // });

// // SwaggerUi configuration
// const swaggerOptions = {
//   swaggerDefinition: {
//     info: {
//       version: '1.0.0',
//       title: 'Forum API',
//       description: 'Forum API Information',
//       contact: {
//         name: 'Oscar Valdivia'
//       },
//       servers: ['http://localhost:8080']
//     }
//   },
//   apis: ['./routes/*.ts']
//   //apis: ['index.ts']
// };
// const swaggerDoc = swaggerJsDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
// app.use(bodyParser.json()); // application/json

// // Api settings
// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });

// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log({
//     hostname: req.hostname,
//     path: req.path,
//     method: req.method
//   });
//   next();
// });

// app.post('/', (req: Request, res: Response) => {
//   res.send(req.body);
// });

// app.use('/user', userRoutes);


// Error handler
// app.use((error: any, req: Request, res: Response, next: NextFunction) => {
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({
//     message: message,
//     data: data
//   });
// });


// mongoose
//   .connect('mongodb+srv://Oscar1996:quiwi25550@nodejs-raroh.mongodb.net/messages?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running in port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.log(err);
//   })




