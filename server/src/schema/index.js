import { merge } from 'lodash-es'
import { gql } from 'apollo-server';
import { UserResolvers } from './user';
import { MessageResolvers } from './message';
import { EmailAddressResolver } from 'graphql-scalars';
import UserType from './user/type.gql';
import MessageType from './message/type.gql';

const Types = gql`
  scalar EmailAddress
  scalar Date
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;
export const typeDefs = [Types, gql`${UserType}`, gql`${MessageType}`];
export const resolvers = merge({ EmailAddress: EmailAddressResolver }, UserResolvers, MessageResolvers);
