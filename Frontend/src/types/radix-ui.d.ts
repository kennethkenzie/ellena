declare module "radix-ui" {
  import * as React from "react";

  type AnyComponent = React.ComponentType<any>;

  export const Slot: AnyComponent & {
    Root: AnyComponent;
    Slottable: AnyComponent;
  };

  export const Accordion: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Item: AnyComponent;
    Header: AnyComponent;
    Trigger: AnyComponent;
    Content: AnyComponent;
  };

  export const Avatar: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Image: AnyComponent;
    Fallback: AnyComponent;
  };

  export const Dialog: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Trigger: AnyComponent;
    Portal: AnyComponent;
    Overlay: AnyComponent;
    Content: AnyComponent;
    Header: AnyComponent;
    Footer: AnyComponent;
    Title: AnyComponent;
    Description: AnyComponent;
    Close: AnyComponent;
  };

  export const DropdownMenu: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Trigger: AnyComponent;
    Portal: AnyComponent;
    Content: AnyComponent;
    Group: AnyComponent;
    Label: AnyComponent;
    Item: AnyComponent;
    CheckboxItem: AnyComponent;
    RadioGroup: AnyComponent;
    RadioItem: AnyComponent;
    ItemIndicator: AnyComponent;
    Separator: AnyComponent;
    Shortcut: AnyComponent;
    Sub: AnyComponent;
    SubTrigger: AnyComponent;
    SubContent: AnyComponent;
  };

  export const HoverCard: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Trigger: AnyComponent;
    Portal: AnyComponent;
    Content: AnyComponent;
  };

  export const Label: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
  };

  export const NavigationMenu: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    List: AnyComponent;
    Item: AnyComponent;
    Trigger: AnyComponent;
    Content: AnyComponent;
    Link: AnyComponent;
    Viewport: AnyComponent;
    Indicator: AnyComponent;
  };

  export const Popover: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Trigger: AnyComponent;
    Anchor: AnyComponent;
    Portal: AnyComponent;
    Content: AnyComponent;
  };

  export const Progress: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Indicator: AnyComponent;
  };

  export const ScrollArea: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Viewport: AnyComponent;
    Scrollbar: AnyComponent;
    Thumb: AnyComponent;
    Corner: AnyComponent;
  };

  export const Select: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Group: AnyComponent;
    Value: AnyComponent;
    Trigger: AnyComponent;
    Content: AnyComponent;
    Label: AnyComponent;
    Item: AnyComponent;
    ItemText: AnyComponent;
    ItemIndicator: AnyComponent;
    Separator: AnyComponent;
    ScrollUpButton: AnyComponent;
    ScrollDownButton: AnyComponent;
    Portal: AnyComponent;
    Viewport: AnyComponent;
  };

  export const Separator: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
  };

  export const Tabs: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    List: AnyComponent;
    Trigger: AnyComponent;
    Content: AnyComponent;
  };

  export const ToggleGroup: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
    Item: AnyComponent;
  };

  export const Toggle: {
    [key: string]: AnyComponent;
    Root: AnyComponent;
  };

  export const Tooltip: {
    [key: string]: AnyComponent;
    Provider: AnyComponent;
    Root: AnyComponent;
    Trigger: AnyComponent;
    Portal: AnyComponent;
    Content: AnyComponent;
    Arrow: AnyComponent;
  };
}
