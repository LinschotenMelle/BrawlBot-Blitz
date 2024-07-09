import { Switch } from "@mui/material";
import { Dispatch, Fragment, ReactNode, SetStateAction, useState } from "react";

interface IExpandableCardInterface {
  title: ReactNode;
  content: ReactNode;
  state: [boolean, Dispatch<SetStateAction<boolean>>];
}

export function ExpandableCard({
  title,
  content,
  state,
}: IExpandableCardInterface) {
  const [toggle, setToggle] = useState(true);
  const [value, setState] = state;

  return (
    <div className="App">
      <div className="collapsible-card">
        <div
          id="header"
          className="header"
          onClick={() => {
            setToggle((prev) => {
              return !prev;
            });
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {title}
            <Fragment>
              {value}
              <Switch
                checked={value}
                onChange={async (_, isActive) => {
                  setState(isActive);
                }}
              />
            </Fragment>
          </div>
        </div>
        <div
          className="content"
          style={{
            height: toggle ? "38vh" : "0px",
            overflow: "hidden",
          }}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
