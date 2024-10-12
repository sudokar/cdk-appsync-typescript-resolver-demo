import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import {
  AppsyncTypescriptFunction,
  TSExpressPipelineResolver,
  TypescriptUnitResolver,
} from "cdk-appsync-typescript-resolver";
import * as path from "path";

const RESOLVERS_DIR_PATH = path.join(__dirname, "..", "src", "resolvers");

export class CdkAppsyncTypescriptResolverDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, "Api", {
      name: "cdk-appsync-typescript-resolver-demo",
      definition: {
        schema: appsync.SchemaFile.fromAsset("schema.graphql"),
      },
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
        },
      },
    });

    const todosTable = new dynamodb.Table(this, "TodosTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    const dataSource = api.addDynamoDbDataSource("todoDataSource", todosTable);

    const addTodo = new AppsyncTypescriptFunction(this, "AddTodoFunction", {
      name: "addTodo",
      api,
      dataSource,
      path: path.join(RESOLVERS_DIR_PATH, "addTodo.ts"),
    });

    new TSExpressPipelineResolver(this, "AddTodoResolver", {
      api,
      typeName: "Mutation",
      fieldName: "addTodo",
      tsFunction: addTodo,
    });

    new TypescriptUnitResolver(this, "GetTodoResolver", {
      api,
      dataSource,
      typeName: "Query",
      fieldName: "getTodo",
      path: path.join(RESOLVERS_DIR_PATH, "getTodo.ts"),
    });
  }
}
