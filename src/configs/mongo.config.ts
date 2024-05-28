import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

//mongodb://[<username>:<password>@]hostname0<:port>[,hostname1:<port1>][,hostname2:<port2>][...][,hostnameN:<portN>]
const getMongoString = (configService: ConfigService) => {
  const connectionUrl =
    'mongodb://' +
    configService.get('MONGO_LOGIN') +
    ':' +
    configService.get('MONGO_PASSWORD') +
    '@' +
    configService.get('MONGO_HOST') +
    ':' +
    configService.get('MONGO_PORT');
  console.log(connectionUrl);
  return connectionUrl;
};

const getMongoOptions = () => ({
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
});

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};
