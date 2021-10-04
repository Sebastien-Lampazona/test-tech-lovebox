import { gql, useQuery } from '@apollo/client';

export const POST_MESSAGE = gql`
  mutation postMessage($image: Upload!, $message: String!) {
    post(image: $image, message: $message) {
      image {
        filename
        mimetype
        encoding
        base64
      }
      message
      created_at
    }
  }
`;

export const GET_MESSAGES = gql`
{
  messages {
    message,
    created_at,
    image {
      filename,
      mimetype,
      encoding,
      base64,
    }
  }
}
`;