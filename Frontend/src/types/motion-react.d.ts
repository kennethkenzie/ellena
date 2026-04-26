declare module "motion/react" {
  import * as React from "react";

  type AnyComponent = React.ComponentType<any>;

  export const motion: {
    [key: string]: AnyComponent | ((component: any) => AnyComponent);
    create: (component: any) => AnyComponent;
    div: AnyComponent;
  };
}
