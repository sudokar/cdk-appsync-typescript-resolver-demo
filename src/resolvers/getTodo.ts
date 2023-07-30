import { Context, DynamoDBGetItemRequest, util } from '@aws-appsync/utils';
import { Todo, QueryGetTodoArgs } from '../types/appsync';

export function request(
  ctx: Context<QueryGetTodoArgs>,
): DynamoDBGetItemRequest {
  return {
    operation: 'GetItem',
    key: {
      id: util.dynamodb.toDynamoDB(ctx.args.id),
    },
  };
}

export function response(
  ctx: Context<QueryGetTodoArgs, object, object, object, Todo>,
) {
  return ctx.result;
}