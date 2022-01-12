import { Tabs, TabsProps, ThemeContext, base } from "grommet";
import React from "react";

const TabsWithoutGaps: React.FC<TabsProps> = (props) => (
  <ThemeContext.Extend value={{ global: { edgeSize: { small: "0" } } }}>
    <Tabs {...props}>
      <ThemeContext.Extend
        value={{
          global: { edgeSize: { small: base.global?.edgeSize?.small } },
        }}
      >
        {props.children}
      </ThemeContext.Extend>
    </Tabs>
  </ThemeContext.Extend>
);

export default TabsWithoutGaps;
