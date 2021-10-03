const MESSAGES = []

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
      const {image, message} = args;
      const messageObj = {
        image: image,
        message,
        created_at: new Date(),
      };
      MESSAGES.push(messageObj);
      return messageObj;
    },
  }
};
