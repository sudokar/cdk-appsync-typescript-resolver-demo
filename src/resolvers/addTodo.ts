import { Context, DynamoDBPutItemRequest, util } from "@aws-appsync/utils";
import { MutationAddTodoArgs, Todo } from "../types/appsync";

export function request(
  ctx: Context<MutationAddTodoArgs>
): DynamoDBPutItemRequest {
  const { id, ...attrValues } = ctx.args;

  return {
    operation: "PutItem",
    key: {
      id: util.dynamodb.toDynamoDB(id),
    },
    attributeValues: util.dynamodb.toMapValues({
      ...attrValues,
    }),
  };
}

export function response(
  ctx: Context<MutationAddTodoArgs, object, object, object, Todo>
) {
  return ctx.result;
}
