const MESSAGES = [];

export const MessageResolvers = {
  Query: {
    messages: async (_, args) => {
      return MESSAGES;
    },
    message: (_, { id }) => {
      return MESSAGES.find((message) => message.id === id);
    },
  },
  Mutation: {
    post: (root, args, context) => {
      return new Promise(async (resolve, reject) => {
        try {
          const { image, message } = args;

          const {
            createReadStream,
            filename,
            mimetype,
            encoding,
          } = await image;

          const stream = createReadStream();

          var data = `data:${mimetype};base64,`;
          stream.on('readable', function () {
            data += stream?.read()?.toString('base64') || '';
          });
          stream.on('end', function () {
            const messageObj = {
              message,
              image: {
                filename,
                mimetype,
                encoding,
                base64: data
              },
              created_at: new Date(),
            };
            MESSAGES.push(messageObj);
            resolve(messageObj);
          });
        } catch (e) {
          reject(e);
        }
      });
    },
  },
};
