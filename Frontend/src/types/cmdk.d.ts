declare module "cmdk" {
  import * as React from "react";

  type AnyComponent = React.ComponentType<any>;

  export const Command: AnyComponent & {
    Input: AnyComponent;
    List: AnyComponent;
    Empty: AnyComponent;
    Group: AnyComponent;
    Separator: AnyComponent;
    Item: AnyComponent;
    Loading?: AnyComponent;
  };
}
